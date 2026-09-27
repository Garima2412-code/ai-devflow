const Task = require('../models/Task');
const Project = require('../models/Project');
const Team = require('../models/Team');
const { analyzeIssue } = require('../services/aiService');

// POST /api/ai/tasks/:taskId/analyze
const analyzeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Reuse the same authorization pattern as everywhere else
    const project = await Project.findById(task.project);
    const team = await Team.findById(project.team);
    const isMember = team.members.some((id) => id.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }

    const analysis = await analyzeIssue(task.title, task.description);

    res.status(200).json(analysis);
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ message: 'Could not analyze this issue right now. Please try again.' });
  }
};

module.exports = { analyzeTask };