const express = require('express');
const router = express.Router();
const {
  connectGithub,
  githubCallback,
  getGithubStatus,
} = require('../controllers/githubController');
const protect = require('../middleware/authMiddleware');

router.get('/connect', protect, connectGithub);
router.get('/callback', githubCallback); // NOT protected — GitHub calls this directly, with no JWT
router.get('/status', protect, getGithubStatus);

module.exports = router;