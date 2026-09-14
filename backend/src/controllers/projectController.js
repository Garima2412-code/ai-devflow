const Project = require('../models/Project');
const Team = require('../models/Team');

// Helper: confirm the requesting user belongs to the given team
const isTeamMember = (team, userId) => {
  return team.members.some((memberId) => memberId.toString() === userId);
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, teamId } = req.body;

    if (!name || !teamId) {
      return res.status(400).json({ message: 'Project name and teamId are required' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isTeamMember(team, req.userId)) {
      return res.status(403).json({ message: 'You are not a member of this team' });
    }

    const project = await Project.create({
      name,
      description,
      team: teamId,
      createdBy: req.userId,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/projects/team/:teamId
const getProjectsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isTeamMember(team, req.userId)) {
      return res.status(403).json({ message: 'You are not a member of this team' });
    }

    const projects = await Project.find({ team: teamId }).populate(
      'createdBy',
      'name email'
    );

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const team = await Team.findById(project.team);
    if (!isTeamMember(team, req.userId)) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createProject, getProjectsByTeam, getProjectById };