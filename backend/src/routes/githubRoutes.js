const express = require('express');

const router = express.Router();

const {
  connectGithub,
  githubCallback,
  getGithubStatus,
} = require('../controllers/githubController');

const protect = require('../middleware/authMiddleware');

// GitHub OAuth
router.get('/connect', connectGithub);

// GitHub redirects here — DO NOT protect this route
router.get('/callback', githubCallback);

// Check GitHub connection status
router.get('/status', protect, getGithubStatus);

module.exports = router;