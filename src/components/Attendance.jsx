import React, { useState } from 'react';

// Dummy backend response for attendance data
const dummyAttendanceData = {
  "2024-05-01": "present",
  "2024-05-02": "absent",
  "2024-05-03": "publicHoliday",
  "2024-05-04": "present",
  "2024-05-05": "present",
  "2024-05-06": "notTracked",
  "2024-05-07": "absent",
  "2024-05-08": "publicHoliday",
  // Add more dates as needed
};

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(dummyAttendanceData);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const getAttendanceStatus = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return attendanceData[dateString] || 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#4CAF50'; // Green for present
      case 'absent': return '#F44336'; // Red for absent
      case 'publicHoliday': return '#64B5F6'; // Light Blue for public holiday
      case 'notTracked': return '#FFEB3B'; // Yellow for not tracked
      default: return '#E0E0E0'; // Gray for unknown
    }
  };

  const handleDateClick = (date) => {
    const status = getAttendanceStatus(date);
    if (status === 'absent') {
      alert('Notification sent to parent for absence.');
    }
  };

  const calculateAttendance = () => {
    const total = Object.values(attendanceData).filter(status => status !== 'publicHoliday' && status !== 'notTracked').length;
    const attended = Object.values(attendanceData).filter(status => status === 'present').length;
    return `${attended}/${total}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Attendance Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance</h2>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">📅</span>
            <span className="font-semibold text-lg text-gray-600 dark:text-gray-300">{calculateAttendance()}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
          
          {getDaysInMonth(currentMonth).map(date => {
            const status = getAttendanceStatus(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200
                  ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                  ${status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : ''}
                  ${status === 'absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' : ''}
                  ${status === 'publicHoliday' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : ''}
                  ${status === 'notTracked' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : ''}
                  ${status === 'unknown' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : ''}
                  hover:scale-105 hover:shadow-md
                `}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Legend</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Holiday</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Not Tracked</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
