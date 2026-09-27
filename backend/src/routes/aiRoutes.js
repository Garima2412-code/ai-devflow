const express = require('express');
const router = express.Router();
const { analyzeTask } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

router.post('/tasks/:taskId/analyze', protect, analyzeTask);

module.exports = router;