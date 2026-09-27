const express = require('express');
const router = express.Router();
const {
  listRepos,
  getProjectCommits,
  getProjectPulls,
} = require('../controllers/githubDataController');
const protect = require('../middleware/authMiddleware');

router.get('/repos', protect, listRepos);
router.get('/projects/:projectId/commits', protect, getProjectCommits);
router.get('/projects/:projectId/pulls', protect, getProjectPulls);

module.exports = router;