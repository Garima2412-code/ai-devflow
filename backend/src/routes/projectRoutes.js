const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjectsByTeam,
  getProjectById,
} = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/team/:teamId', protect, getProjectsByTeam);
router.get('/:id', protect, getProjectById);

module.exports = router;