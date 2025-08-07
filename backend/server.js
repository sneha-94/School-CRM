const app = require('./app');
const { PORT } = require('./config/environment');
module.exports = app;





app.listen(PORT, () => {
  console.log(`🚀 School CRM API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});


app.get('/api/assignments/submission-history/:studentId', (req, res) => {
  const submissions = [
    {
      title: "Math Assignment 1",
      subject: "Mathematics",
      submittedAt: "2025-08-06",
      status: "Submitted",
      fileUrl: "/uploads/math-assignment1.pdf",
      fileType: "pdf",
      feedback: "Well done! Check question 3 again."
    },
    {
      title: "Science Project",
      subject: "Science",
      submittedAt: null,
      status: "Pending",
      fileUrl: null,
      fileType: null,
      feedback: null
    }
  ];

  res.json(submissions);
});
