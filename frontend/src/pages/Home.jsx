import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ThemeToggle />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Theme</span>
      </div>
      
      <div className="text-center">
        <img
          src="https://i.pinimg.com/originals/48/a3/54/48a354314bb3517dabc705eb3ee8b968.jpg" 
          alt="School Logo"
          className="h-24 w-24 mx-auto rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-4">Welcome to School App</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">Your gateway to a streamlined school experience.</p>
      </div>

      <div className="mt-8 space-y-4">
        <Link to="/login">
          <button className="px-6 py-3 mr-5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
