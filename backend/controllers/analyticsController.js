const { attendanceRecords, examRecords, assignmentRecords } = require('../config/database');

const getAttendanceAnalytics = (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const userId = req.user.id;

    // Filter attendance records for the user
    const userAttendance = attendanceRecords.filter(record => record.userId === userId);

    // Group by month and calculate percentages
    const monthlyData = {};
    userAttendance.forEach(record => {
      const monthKey = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { present: 0, total: 0 };
      }
      monthlyData[monthKey].total++;
      if (record.status === 'present') {
        monthlyData[monthKey].present++;
      }
    });

    const attendanceData = Object.keys(monthlyData)
      .sort()
      .slice(-8) // Last 8 months
      .map(month => ({
        month: new Date(month + '-01').toLocaleDateString('en', { month: 'short' }),
        percentage: Math.round((monthlyData[month].present / monthlyData[month].total) * 100)
      }));

    res.json(attendanceData);
  } catch (error) {
    console.error('Attendance analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getScoresAnalytics = (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const userId = req.user.id;

    // Filter exam records for the user
    const userExams = examRecords.filter(record => record.userId === userId);

    // Group by subject and calculate average scores
    const subjectData = {};
    userExams.forEach(record => {
      if (!subjectData[record.subject]) {
        subjectData[record.subject] = { totalMarks: 0, maxMarks: 0, count: 0 };
      }
      subjectData[record.subject].totalMarks += record.marksObtained;
      subjectData[record.subject].maxMarks += record.maxMarks;
      subjectData[record.subject].count++;
    });

    const scoresData = Object.keys(subjectData).map(subject => ({
      subject,
      percentage: Math.round((subjectData[subject].totalMarks / subjectData[subject].maxMarks) * 100),
      examCount: subjectData[subject].count
    }));

    res.json(scoresData);
  } catch (error) {
    console.error('Scores analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssignmentsAnalytics = (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const userId = req.user.id;

    // Filter assignment records for the user
    const userAssignments = assignmentRecords.filter(record => record.userId === userId);

    // Calculate punctuality categories
    const categories = {
      onTime: 0,
      late1to2: 0,
      late3plus: 0,
      notSubmitted: 0
    };

    userAssignments.forEach(assignment => {
      if (!assignment.submittedDate) {
        categories.notSubmitted++;
      } else {
        const dueDate = new Date(assignment.dueDate);
        const submittedDate = new Date(assignment.submittedDate);
        const daysDiff = Math.ceil((submittedDate - dueDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 0) {
          categories.onTime++;
        } else if (daysDiff <= 2) {
          categories.late1to2++;
        } else {
          categories.late3plus++;
        }
      }
    });

    const total = userAssignments.length;
    const punctualityData = {
      onTime: Math.round((categories.onTime / total) * 100),
      late1to2: Math.round((categories.late1to2 / total) * 100),
      late3plus: Math.round((categories.late3plus / total) * 100),
      notSubmitted: Math.round((categories.notSubmitted / total) * 100),
      totalAssignments: total,
      categories
    };

    res.json(punctualityData);
  } catch (error) {
    console.error('Assignments analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  getAttendanceAnalytics, 
  getScoresAnalytics, 
  getAssignmentsAnalytics 
};