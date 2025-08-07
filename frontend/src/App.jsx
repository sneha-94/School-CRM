// App.jsx or App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ClassDiary from './components/ClassDiary';
import MockTests from './components/MockTests';
import Assignments from './components/Assignments';
import Attendance from './components/Attendance';
import ExamsAndMarks from './components/ExamsAndMarks';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ProfileDashboard from './components/ProfileDashboard';
import Notifications from './components/Notifications';
import Timetable from './components/Timetable';
import Fee from './components/Fee';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const Layout = () => {
  const location = useLocation();

  const studentName = "John Doe";
  const profilePic = "https://www.w3schools.com/howto/img_avatar.png";
  const schoolName = "My School";
  const schoolLogo = "https://i.pinimg.com/originals/48/a3/54/48a354314bb3517dabc705eb3ee8b968.jpg";

  const hideHeaderPaths = ["/", "/login", "/signup", "/dashboard", "/performance-analytics"];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {!hideHeaderPaths.includes(location.pathname) && (
        <Header 
          studentName={studentName} 
          profilePic={profilePic} 
          schoolName={schoolName} 
          schoolLogo={schoolLogo} 
        />
      )}

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/class-diary" element={<ClassDiary />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/exams-and-marks" element={<ExamsAndMarks />} />
        <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Chatbot />
    </div>
  );
};

// AppWrapper: now correctly wraps ThemeProvider and Router
const AppWrapper = () => (
  <ThemeProvider>
    <Router>
      <Layout />
    </Router>
  </ThemeProvider>
);

export default AppWrapper;
