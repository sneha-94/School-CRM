import React from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const sampleSchedule = {
  'Monday': {
    '08:00 AM': 'Math',
    '09:00 AM': 'English',
    '10:00 AM': 'History',
    '12:00 PM': 'Biology',
    '02:00 PM': 'Physical Education',
  },
  'Tuesday': {
    '09:00 AM': 'Chemistry',
    '10:00 AM': 'Math',
    '11:00 AM': 'Geography',
    '01:00 PM': 'History',
    '03:00 PM': 'Art',
  },
  // Add more sample data as needed
};

const Timetable = () => {
  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Timetable</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border-b">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="px-4 py-2 border-b">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="border-t border-gray-200">
                <td className="px-4 py-2 font-semibold border-r">{time}</td>
                {daysOfWeek.map(day => (
                  <td key={day} className="px-4 py-2 border-r text-center">
                    <div
                      className={`p-2 rounded-md ${
                        sampleSchedule[day] && sampleSchedule[day][time]
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sampleSchedule[day] && sampleSchedule[day][time] ? sampleSchedule[day][time] : '-'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
