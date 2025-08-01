import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // For Google OAuth
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  // State for email, OTP, and managing the login stage
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP was sent

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle submitting email for OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to your backend to send OTP
      await axios.post('/api/auth/login', { email: formData.email });
      setIsOtpSent(true); // Move to OTP input stage
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error.response.data.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Handle OTP submission for login verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verify the OTP and log in the user
      const response = await axios.post('/api/auth/verify-login', { email: formData.email, otp: formData.otp });
      // Store the JWT token locally after successful login
      localStorage.setItem('token', response.data.token);
      // Redirect or show success message
      alert("Login successful!");
    } catch (error) {
      console.error("Error verifying OTP:", error.response.data.message);
      alert("Invalid OTP. Please try again.");
    }
  };

  // Handle Google authentication
  const handleGoogleSuccess = async (response) => {
    try {
      // Send the Google ID token to your backend for verification
      const googleResponse = await axios.post('/api/auth/google-login', { token: response.credential });
      
      // Store the JWT token locally after successful login
      localStorage.setItem('token', googleResponse.data.token);
      
      // Redirect or show success message
      alert("Login with Google successful!");
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error:", error);
    alert("Failed to log in with Google. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}> {/* Add your Google client ID here */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* Theme Toggle - Top Right Corner */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <ThemeToggle />
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Theme</span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login to Your Account</h2>

          {/* Form for email submission or OTP input */}
          {isOtpSent ? (
            // OTP input form
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter the OTP sent to your email"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-200">Verify OTP</button>
            </form>
          ) : (
            // Email input form
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-200">Send OTP</button>
            </form>
          )}

          {/* Google login button */}
          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600 dark:text-gray-300">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200">Sign Up</a></p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
