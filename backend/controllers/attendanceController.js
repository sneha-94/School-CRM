const { v4: uuidv4 } = require('uuid');
const { attendanceRecords } = require('../config/database');

const getAttendance = (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    let userAttendance = attendanceRecords.filter(record => record.userId === userId);

    if (year && month) {
      const datePrefix = `${year}-${month.toString().padStart(2, '0')}`;
      userAttendance = userAttendance.filter(record => record.date.startsWith(datePrefix));
    }

    const attendanceData = {};
    userAttendance.forEach(record => {
      attendanceData[record.date] = record.status;
    });

    res.json(attendanceData);
  } catch (error) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAttendance = (req, res) => {
  try {
    const { date, status } = req.body;
    const userId = req.user.id;

    if (!date || !status) {
      return res.status(400).json({ message: 'Date and status are required' });
    }

    if (!['present', 'absent', 'publicHoliday', 'notTracked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const existingIndex = attendanceRecords.findIndex(
      record => record.userId === userId && record.date === date
    );

    if (existingIndex !== -1) {
      attendanceRecords[existingIndex].status = status;
      attendanceRecords[existingIndex].updatedAt = new Date();
    } else {
      const newRecord = {
        id: uuidv4(),
        userId: userId,
        date: date,
        status: status,
        createdAt: new Date()
      };
      attendanceRecords.push(newRecord);
    }

    res.json({ message: 'Attendance updated successfully', date, status });
  } catch (error) {
    console.error('Attendance update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAttendance, updateAttendance };