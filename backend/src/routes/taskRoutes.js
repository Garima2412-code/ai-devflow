const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  updateTask,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id', protect, updateTask);

module.exports = router;