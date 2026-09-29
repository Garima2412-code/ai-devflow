const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
const Team = require('../models/Team');

// Helper: get a valid GitHub client for the current user, or throw
const getGithubClient = async (userId) => {
  const user = await User.findById(userId).select('+githubAccessToken');
  if (!user?.githubAccessToken) {
    const error = new Error('GitHub account not connected');
    error.status = 400;
    throw error;
  }
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: { Authorization: `Bearer ${user.githubAccessToken}` },
  });
};

// GET /api/github/repos
const listRepos = async (req, res) => {
  try {
    const github = await getGithubClient(req.userId);
    const response = await github.get('/user/repos', {
      params: { sort: 'updated', per_page: 50 },
    });

    const repos = response.data.map((repo) => ({
      fullName: repo.full_name,
      private: repo.private,
      updatedAt: repo.updated_at,
    }));

    res.status(200).json(repos);
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({
        message: 'GitHub connection expired. Please reconnect your GitHub account.',
        code: 'GITHUB_TOKEN_INVALID',
      });
    }
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

// PATCH /api/projects/:id/github-repo
const linkRepoToProject = async (req, res) => {
  try {
    const { repoFullName } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const team = await Team.findById(project.team);
    const isMember = team.members.some((id) => id.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }

    project.githubRepo = repoFullName;
    await project.save();

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/github/projects/:projectId/commits
const getProjectCommits = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project?.githubRepo) {
      return res.status(400).json({ message: 'No GitHub repo linked to this project' });
    }

    const github = await getGithubClient(req.userId);
    const response = await github.get(`/repos/${project.githubRepo}/commits`, {
      params: { per_page: 10 },
    });

    const commits = response.data.map((commit) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));

    res.status(200).json(commits);
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({
        message: 'GitHub connection expired. Please reconnect your GitHub account.',
        code: 'GITHUB_TOKEN_INVALID',
      });
    }
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/github/projects/:projectId/pulls
const getProjectPulls = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project?.githubRepo) {
      return res.status(400).json({ message: 'No GitHub repo linked to this project' });
    }

    const github = await getGithubClient(req.userId);
    const response = await github.get(`/repos/${project.githubRepo}/pulls`, {
      params: { state: 'all', per_page: 10 },
    });

    const pulls = response.data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      state: pr.merged_at ? 'merged' : pr.state,
      author: pr.user.login,
      url: pr.html_url,
      createdAt: pr.created_at,
    }));

    res.status(200).json(pulls);
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({
        message: 'GitHub connection expired. Please reconnect your GitHub account.',
        code: 'GITHUB_TOKEN_INVALID',
      });
    }
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  listRepos,
  linkRepoToProject,
  getProjectCommits,
  getProjectPulls,
  getGithubClient,
};