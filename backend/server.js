const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
let users = [];
let otpStore = {};
let attendanceRecords = [];
let examRecords = [];
let assignmentRecords = [];

// Utility function to generate personalized sample data for a new user
const generateUserSampleData = (userId, userName) => {
  console.log(`📊 Generating personalized sample data for user: ${userName}`);
  
  // Generate attendance records (last 8 months)
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'];
  const userAttendanceRecords = [];
  
  months.forEach((month, index) => {
    // Random but realistic attendance percentages (70-95%)
    const attendancePercentage = Math.floor(Math.random() * 25) + 70; // 70-95%
    const daysInMonth = 22; // Average school days
    const presentDays = Math.round((attendancePercentage / 100) * daysInMonth);
    
    for (let day = 1; day <= daysInMonth; day++) {
      userAttendanceRecords.push({
        id: uuidv4(),
        userId: userId,
        date: `${month}-${day.toString().padStart(2, '0')}`,
        status: day <= presentDays ? 'present' : 'absent',
        createdAt: new Date()
      });
    }
  });

  // Generate exam records with realistic but random scores
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'
  ];
  
  const userExamRecords = subjects.map(subject => ({
    id: uuidv4(),
    userId: userId,
    subject: subject,
    marksObtained: Math.floor(Math.random() * 30) + 65, // 65-95 marks
    maxMarks: 100,
    examDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
    createdAt: new Date()
  }));

  // Generate assignment records with varied punctuality
  const assignmentTypes = [
    'Math Assignment 1', 'Physics Lab Report', 'Chemistry Project', 'Biology Essay', 
    'English Essay', 'Programming Assignment', 'Math Assignment 2', 'Physics Problem Set',
    'Chemistry Lab', 'Biology Diagram', 'English Presentation', 'Code Review',
    'Statistics Project', 'Physics Experiment', 'Organic Chemistry', 'Genetics Study',
    'Literature Review', 'Database Design', 'Calculus Problems', 'Final Project'
  ];

  const userAssignmentRecords = assignmentTypes.map((title, index) => {
    const dueDate = new Date(Date.now() - (20 - index) * 24 * 60 * 60 * 1000);
    const randomOutcome = Math.random();
    let submittedDate = null;
    
    if (randomOutcome < 0.75) { // 75% on time
      submittedDate = new Date(dueDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    } else if (randomOutcome < 0.90) { // 15% late 1-2 days
      const daysLate = Math.floor(Math.random() * 2) + 1;
      submittedDate = new Date(dueDate.getTime() + daysLate * 24 * 60 * 60 * 1000);
    } else if (randomOutcome < 0.98) { // 8% late 3+ days
      const daysLate = Math.floor(Math.random() * 5) + 3;
      submittedDate = new Date(dueDate.getTime() + daysLate * 24 * 60 * 60 * 1000);
    }
    // 2% not submitted (submittedDate remains null)

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return {
      id: uuidv4(),
      userId: userId,
      title: title,
      subject: subject,
      dueDate: dueDate,
      submittedDate: submittedDate,
      createdAt: new Date()
    };
  });

  // Add to global arrays
  attendanceRecords.push(...userAttendanceRecords);
  examRecords.push(...userExamRecords);
  assignmentRecords.push(...userAssignmentRecords);

  console.log(`✅ Generated for ${userName}:`);
  console.log(`   📅 ${userAttendanceRecords.length} attendance records`);
  console.log(`   📝 ${userExamRecords.length} exam records`);
  console.log(`   📋 ${userAssignmentRecords.length} assignment records`);
  
  return {
    attendance: userAttendanceRecords.length,
    exams: userExamRecords.length,
    assignments: userAssignmentRecords.length
  };
};

const generateJWT = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize sample data
const initializeSampleData = () => {
  // Sample user
  const sampleUser = {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    createdAt: new Date()
  };
  users.push(sampleUser);

  // Generate sample data for the default user
  generateUserSampleData(sampleUser.id, sampleUser.name);

  console.log('✅ Sample data initialized with default user');
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School CRM API is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate personalized sample data for the new user
    generateUserSampleData(newUser.id, newUser.name);

    // Generate JWT token
    const token = generateJWT(newUser);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    // In production, send OTP via email
    console.log(`📧 OTP for ${email}: ${otp}`);

    res.json({ 
      message: 'OTP sent to your email',
      // For development - include OTP in response (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/verify-login', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check OTP
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (storedOTP.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up OTP
    delete otpStore[email];

    // Generate JWT token
    const token = generateJWT(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verify login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Performance Analytics Routes
app.get('/api/analytics/attendance', authenticateToken, (req, res) => {
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
});

// Attendance Management Routes
app.get('/api/attendance', authenticateToken, (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    let userAttendance = attendanceRecords.filter(record => record.userId === userId);

    // Filter by year and month if provided
    if (year && month) {
      const datePrefix = `${year}-${month.toString().padStart(2, '0')}`;
      userAttendance = userAttendance.filter(record => record.date.startsWith(datePrefix));
    }

    // Convert to object format for easier frontend consumption
    const attendanceData = {};
    userAttendance.forEach(record => {
      attendanceData[record.date] = record.status;
    });

    res.json(attendanceData);
  } catch (error) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/attendance', authenticateToken, (req, res) => {
  try {
    const { date, status } = req.body;
    const userId = req.user.id;

    if (!date || !status) {
      return res.status(400).json({ message: 'Date and status are required' });
    }

    if (!['present', 'absent', 'publicHoliday', 'notTracked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if attendance record already exists
    const existingIndex = attendanceRecords.findIndex(
      record => record.userId === userId && record.date === date
    );

    if (existingIndex !== -1) {
      // Update existing record
      attendanceRecords[existingIndex].status = status;
      attendanceRecords[existingIndex].updatedAt = new Date();
    } else {
      // Create new record
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
});

// Exam Management Routes
app.get('/api/exams', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userExams = examRecords.filter(record => record.userId === userId);
    
    // Sort by exam date, most recent first
    userExams.sort((a, b) => new Date(b.examDate) - new Date(a.examDate));
    
    res.json(userExams);
  } catch (error) {
    console.error('Exams fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/exams', authenticateToken, (req, res) => {
  try {
    const { subject, marksObtained, maxMarks, examDate, examName } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!subject || marksObtained === undefined || !maxMarks || !examDate) {
      return res.status(400).json({ message: 'Subject, marks obtained, max marks, and exam date are required' });
    }

    if (marksObtained < 0 || marksObtained > maxMarks) {
      return res.status(400).json({ message: 'Marks obtained must be between 0 and max marks' });
    }

    // Create new exam record
    const newExam = {
      id: uuidv4(),
      userId: userId,
      subject: subject,
      marksObtained: parseInt(marksObtained),
      maxMarks: parseInt(maxMarks),
      examDate: new Date(examDate),
      examName: examName || `${subject} Exam`,
      createdAt: new Date()
    };

    examRecords.push(newExam);

    res.status(201).json({
      message: 'Exam record created successfully',
      exam: newExam
    });
  } catch (error) {
    console.error('Exam creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/exams/:examId', authenticateToken, (req, res) => {
  try {
    const { examId } = req.params;
    const { subject, marksObtained, maxMarks, examDate, examName } = req.body;
    const userId = req.user.id;

    // Find the exam record
    const examIndex = examRecords.findIndex(
      record => record.id === examId && record.userId === userId
    );

    if (examIndex === -1) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    // Validate input
    if (marksObtained !== undefined && (marksObtained < 0 || marksObtained > maxMarks)) {
      return res.status(400).json({ message: 'Marks obtained must be between 0 and max marks' });
    }

    // Update the exam record
    const exam = examRecords[examIndex];
    if (subject) exam.subject = subject;
    if (marksObtained !== undefined) exam.marksObtained = parseInt(marksObtained);
    if (maxMarks) exam.maxMarks = parseInt(maxMarks);
    if (examDate) exam.examDate = new Date(examDate);
    if (examName) exam.examName = examName;
    exam.updatedAt = new Date();

    res.json({
      message: 'Exam record updated successfully',
      exam: exam
    });
  } catch (error) {
    console.error('Exam update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/exams/:examId', authenticateToken, (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Find and remove the exam record
    const examIndex = examRecords.findIndex(
      record => record.id === examId && record.userId === userId
    );

    if (examIndex === -1) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    examRecords.splice(examIndex, 1);

    res.json({ message: 'Exam record deleted successfully' });
  } catch (error) {
    console.error('Exam deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/analytics/scores', authenticateToken, (req, res) => {
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
});

app.get('/api/analytics/assignments', authenticateToken, (req, res) => {
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
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize sample data and start server
initializeSampleData();

app.listen(PORT, () => {
  console.log(`🚀 School CRM API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
