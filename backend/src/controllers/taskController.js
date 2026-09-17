const Task = require('../models/Task');
const Project = require('../models/Project');
const Team = require('../models/Team');

// Shared helper: confirm the requesting user has access to a project
// (via team membership), and return the project if so.
const getAuthorizedProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };

  const team = await Team.findById(project.team);
  const isMember = team.members.some((id) => id.toString() === userId);
  if (!isMember) return { error: 'You do not have access to this project', status: 403 };

  return { project };
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, priority, assignee } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    const { project, error, status } = await getAuthorizedProject(projectId, req.userId);
    if (error) return res.status(status).json({ message: error });

    const task = await Task.create({
      title,
      description,
      project: project._id,
      priority,
      assignee: assignee || null,
      createdBy: req.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/tasks/project/:projectId
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { error, status } = await getAuthorizedProject(projectId, req.userId);
    if (error) return res.status(status).json({ message: error });

    const tasks = await Task.find({ project: projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in_progress', 'review', 'done'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { error, status: httpStatus } = await getAuthorizedProject(task.project, req.userId);
    if (error) return res.status(httpStatus).json({ message: error });

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, assignee } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { error, status: httpStatus } = await getAuthorizedProject(task.project, req.userId);
    if (error) return res.status(httpStatus).json({ message: error });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, updateTask };