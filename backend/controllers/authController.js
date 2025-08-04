const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../config/database');
const { generateJWT } = require('../utils/jwt');
const { generateOTP, storeOTP, verifyOTP } = require('../services/otpService');
const { generateUserSampleData } = require('../services/dataGeneratorService');
const { NODE_ENV } = require('../config/environment');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);
    generateUserSampleData(newUser.id, newUser.name);
    
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
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    storeOTP(email, otp);

    console.log(`📧 OTP for ${email}: ${otp}`);

    res.json({ 
      message: 'OTP sent to your email',
      otp: NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpVerification = verifyOTP(email, otp);
    if (!otpVerification.success) {
      return res.status(400).json({ message: otpVerification.message });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
};

module.exports = { signup, login, verifyLogin };