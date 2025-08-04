const express = require('express');
const { corsMiddleware } = require('./middlewares/cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { initializeSampleData } = require('./services/dataGeneratorService');

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const examRoutes = require('./routes/exams');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School CRM API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize sample data
initializeSampleData();

module.exports = app;