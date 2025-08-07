import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = ({ studentName, profilePic, schoolName, schoolLogo }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <header className="flex justify-between items-center p-1 bg-blue-600 dark:bg-blue-800 transition-colors duration-300 shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={schoolLogo}
          alt="School Logo"
          className="w-8 h-8 rounded-full mt-2"
        />
        <span className="text-lg font-semibold text-white">{schoolName}</span>
      </div>
      
      {/* Profile Section with Theme Toggle */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <div className="flex flex-col items-center">
          <ThemeToggle />
          <span className="text-xs text-white/80 mt-1">Theme</span>
        </div>
        
        {/* Profile Picture and User Name */}
        <div className="flex flex-col items-center">
          <img
            src={profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full mt-2 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all duration-200"
            onClick={handleProfileClick}
          />
          <span className="text-lg font-semibold text-white">{studentName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
