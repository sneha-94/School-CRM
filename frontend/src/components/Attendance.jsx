import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data from backend
  const fetchAttendanceData = async (month) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view attendance');
        return;
      }

      const year = month.getFullYear();
      const monthNum = month.getMonth() + 1;
      
      const response = await fetch(
        `http://localhost:5000/api/attendance?year=${year}&month=${monthNum}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      setAttendanceData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance data');
      // Fallback to dummy data if backend is not available
      setAttendanceData({
        "2024-05-01": "present",
        "2024-05-02": "absent",
        "2024-05-03": "publicHoliday",
        "2024-05-04": "present",
        "2024-05-05": "present",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update attendance status
  const updateAttendance = async (date, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to update attendance');
        return;
      }

      const dateString = date.toISOString().split('T')[0];
      
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: dateString,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      // Update local state
      setAttendanceData(prev => ({
        ...prev,
        [dateString]: newStatus
      }));

      alert(`Attendance marked as ${newStatus} for ${dateString}`);
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Failed to update attendance. Please try again.');
    }
  };

  useEffect(() => {
    fetchAttendanceData(currentMonth);
  }, [currentMonth]);

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
    const dateString = date.toISOString().split('T')[0];
    const currentStatus = getAttendanceStatus(date);
    
    // Cycle through statuses: unknown -> present -> absent -> publicHoliday -> notTracked -> unknown
    const statusCycle = ['unknown', 'present', 'absent', 'publicHoliday', 'notTracked'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    if (nextStatus === 'unknown') {
      // Remove the date from attendance data
      const newData = { ...attendanceData };
      delete newData[dateString];
      setAttendanceData(newData);
    } else {
      updateAttendance(date, nextStatus);
    }
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const calculateAttendance = () => {
    const total = Object.values(attendanceData).filter(status => status !== 'publicHoliday' && status !== 'notTracked').length;
    const attended = Object.values(attendanceData).filter(status => status === 'present').length;
    return `${attended}/${total}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
        {/* Attendance Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance</h2>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">📅</span>
            <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              {loading ? 'Loading...' : calculateAttendance()}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 mb-4 text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="font-semibold text-center text-gray-600 dark:text-gray-400">
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
                    title={`Click to change status (currently: ${status})`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">Legend (Click dates to update)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded dark:bg-green-900/30"></div>
                  <span className="text-gray-700 dark:text-gray-300">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 rounded dark:bg-red-900/30"></div>
                  <span className="text-gray-700 dark:text-gray-300">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 rounded dark:bg-blue-900/30"></div>
                  <span className="text-gray-700 dark:text-gray-300">Holiday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded dark:bg-yellow-900/30"></div>
                  <span className="text-gray-700 dark:text-gray-300">Not Tracked</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handleMonthChange(-1)}
            disabled={loading}
            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => handleMonthChange(1)}
            disabled={loading}
            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
