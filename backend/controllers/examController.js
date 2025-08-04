const { v4: uuidv4 } = require('uuid');
const { examRecords } = require('../config/database');

const getExams = (req, res) => {
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
};

const createExam = (req, res) => {
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
};

const updateExam = (req, res) => {
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
};

const deleteExam = (req, res) => {
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
};

module.exports = { getExams, createExam, updateExam, deleteExam };