const cors = require('cors');
const { CORS_ORIGINS } = require('../config/environment');

const corsMiddleware = cors({
  origin: CORS_ORIGINS,
  credentials: true
});

module.exports = { corsMiddleware };