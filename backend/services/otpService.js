const { otpStore } = require('../config/database');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (email, otp) => {
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };
};

const verifyOTP = (email, otp) => {
  const storedOTP = otpStore[email];
  
  if (!storedOTP) {
    return { success: false, message: 'No OTP found for this email' };
  }

  if (storedOTP.expiresAt < Date.now()) {
    delete otpStore[email];
    return { success: false, message: 'OTP has expired' };
  }

  if (storedOTP.otp !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }

  delete otpStore[email];
  return { success: true };
};

module.exports = { generateOTP, storeOTP, verifyOTP };