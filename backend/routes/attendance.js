const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { getAttendance, updateAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', authenticateToken, getAttendance);
router.post('/', authenticateToken, updateAttendance);

module.exports = router;