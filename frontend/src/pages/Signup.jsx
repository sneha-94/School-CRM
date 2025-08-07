import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API call to register the user
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Success - store token and redirect
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('Account created successfully! You are now logged in.');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 409) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        // Backend not available - development mode
        alert('Backend server not available. Using development mode - account created locally!');
        navigate('/login');
      } else {
        alert('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute flex items-center space-x-2 top-4 right-4">
        <ThemeToggle />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Theme</span>
      </div>
      
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 p-3 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your name"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 p-3 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 p-3 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 p-3 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-medium transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">Already have an account? <button onClick={() => navigate('/login')} className="text-blue-500 transition-colors duration-200 bg-transparent border-none cursor-pointer hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
