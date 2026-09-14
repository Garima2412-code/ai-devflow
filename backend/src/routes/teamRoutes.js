const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getMyTeams } = require('../controllers/teamController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam);
router.get('/', protect, getMyTeams);

module.exports = router;