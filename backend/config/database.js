// In-memory storage (replace with actual database connection in production)
let users = [];
let otpStore = {};
let attendanceRecords = [];
let examRecords = [];
let assignmentRecords = [];

module.exports = {
  users,
  otpStore,
  attendanceRecords,
  examRecords,
  assignmentRecords
};