const axios = require('axios');
const User = require('../models/User');

// GET /api/github/connect
// Redirects the user to GitHub's authorization page
const jwt = require('jsonwebtoken');

// GET /api/github/connect?token=...
const connectGithub = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'repo',
    state: decoded.id,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

// GET /api/github/callback
// GitHub redirects here after the user approves access
const githubCallback = async (req, res) => {
  const { code, state: userId } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
  }

  try {
    // Exchange the temporary code for a real access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
    }

    // Fetch the GitHub username using the new token
    const githubUserResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    await User.findByIdAndUpdate(userId, {
      githubAccessToken: access_token,
      githubUsername: githubUserResponse.data.login,
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=connected`);
  } catch (err) {
    console.error('GitHub OAuth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
  }
};

// GET /api/github/status
// Lets the frontend check if the current user has connected GitHub
const getGithubStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      connected: !!user.githubUsername,
      githubUsername: user.githubUsername,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { connectGithub, githubCallback, getGithubStatus };