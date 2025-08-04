const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { users, attendanceRecords, examRecords, assignmentRecords } = require('../config/database');

const generateUserSampleData = (userId, userName) => {
  console.log(`📊 Generating personalized sample data for user: ${userName}`);
  
  // Generate attendance records (last 8 months)
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'];
  const userAttendanceRecords = [];
  
  months.forEach((month, index) => {
    const attendancePercentage = Math.floor(Math.random() * 25) + 70;
    const daysInMonth = 22;
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

  // Generate exam records
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
  
  const userExamRecords = subjects.map(subject => ({
    id: uuidv4(),
    userId: userId,
    subject: subject,
    marksObtained: Math.floor(Math.random() * 30) + 65,
    maxMarks: 100,
    examDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }));

  // Generate assignment records
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
    
    if (randomOutcome < 0.75) {
      submittedDate = new Date(dueDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    } else if (randomOutcome < 0.90) {
      const daysLate = Math.floor(Math.random() * 2) + 1;
      submittedDate = new Date(dueDate.getTime() + daysLate * 24 * 60 * 60 * 1000);
    } else if (randomOutcome < 0.98) {
      const daysLate = Math.floor(Math.random() * 5) + 3;
      submittedDate = new Date(dueDate.getTime() + daysLate * 24 * 60 * 60 * 1000);
    }

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

const initializeSampleData = () => {
  const sampleUser = {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    createdAt: new Date()
  };
  users.push(sampleUser);

  generateUserSampleData(sampleUser.id, sampleUser.name);
  console.log('✅ Sample data initialized with default user');
};

module.exports = { generateUserSampleData, initializeSampleData };