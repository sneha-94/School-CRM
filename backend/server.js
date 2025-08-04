const app = require('./app');
const { PORT } = require('./config/environment');

app.listen(PORT, () => {
  console.log(`🚀 School CRM API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});