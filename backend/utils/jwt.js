const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment');

const generateJWT = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = { generateJWT };