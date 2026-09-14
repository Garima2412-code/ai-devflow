const crypto = require('crypto');
const Team = require('../models/Team');

const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex'); // e.g. "a1b2c3d4"
};

// POST /api/teams
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await Team.create({
      name,
      owner: req.userId,
      members: [req.userId],
      inviteCode: generateInviteCode(),
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/teams/join
const joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const team = await Team.findOne({ inviteCode });
    if (!team) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (team.members.includes(req.userId)) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }

    team.members.push(req.userId);
    await team.save();

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/teams
const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.userId }).populate(
      'owner',
      'name email'
    );
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createTeam, joinTeam, getMyTeams };