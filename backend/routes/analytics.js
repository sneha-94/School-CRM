const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { 
  getAttendanceAnalytics, 
  getScoresAnalytics, 
  getAssignmentsAnalytics 
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/attendance', authenticateToken, getAttendanceAnalytics);
router.get('/scores', authenticateToken, getScoresAnalytics);
router.get('/assignments', authenticateToken, getAssignmentsAnalytics);

module.exports = router;