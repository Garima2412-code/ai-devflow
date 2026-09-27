const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjectsByTeam,
  getProjectById,
  getMyProjects,
} = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.get('/team/:teamId', protect, getProjectsByTeam);
router.get('/:id', protect, getProjectById);
const { linkRepoToProject } = require('../controllers/githubDataController');

// add alongside your existing project routes:
router.patch('/:id/github-repo', protect, linkRepoToProject);
module.exports = router;