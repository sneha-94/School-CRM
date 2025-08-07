import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // For Google OAuth
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';


// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL  // Adjust based on your backend setup

const Login = () => {
  const navigate = useNavigate();
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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email: formData.email });
      setIsOtpSent(true); // Move to OTP input stage
      
      // Show OTP in development mode
      if (response.data.otp) {
        alert(`OTP sent to your email! Development OTP: ${response.data.otp}`);
      } else {
        alert("OTP sent to your email!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data?.message || error.message);
      
      if (error.response?.status === 404) {
        alert("User not found. Please sign up first.");
      } else if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        // Backend not available - development mode
        alert("Backend server not available. Using development mode - OTP simulation!");
        setIsOtpSent(true); // Allow user to proceed
      } else {
        alert("Failed to send OTP. Please check your email and try again.");
      }
    }
  };

  // Handle OTP submission for login verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verify the OTP and log in the user
      const response = await axios.post(`${API_BASE_URL}/auth/verify-login`, { 
        email: formData.email, 
        otp: formData.otp 
      });
      
      // Store the JWT token locally after successful login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      alert("Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data?.message || error.message);
      
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        // Backend not available - development mode
        alert("Backend server not available. Using development mode - login successful!");
        localStorage.setItem('token', 'fake-token-for-demo');
        navigate('/dashboard');
      } else {
        alert("Invalid OTP. Please try again.");
      }
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

  // Check if Google Client ID is configured
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isGoogleConfigured = googleClientId && googleClientId !== 'your-google-client-id-here';


  return (
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

        {/* Google login button - only show if properly configured */}
        {isGoogleConfigured ? (
          <div className="mt-6">
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </GoogleOAuthProvider>
          </div>
        ) : (
          <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              Google login is not configured. Please set up your Google Client ID in the .env file.
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
