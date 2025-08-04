const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');

const router = express.Router();

router.get('/', authenticateToken, getExams);
router.post('/', authenticateToken, createExam);
router.put('/:examId', authenticateToken, updateExam);
router.delete('/:examId', authenticateToken, deleteExam);

module.exports = router;