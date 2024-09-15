import React, { useState } from 'react';

// Updated dummy data with additional subjects
const dummyDiaryData = {
  subjects: {
    Math: {
      "2024-09-01": "Introduction to Algebra.",
      "2024-09-02": "Solved exercises on quadratic equations.",
    },
    Science: {
      "2024-09-01": "Physics: Laws of Motion introduction.",
      "2024-09-02": "Chemistry: Balancing chemical equations.",
    },
    History: {
      "2024-09-01": "Chapter on the Renaissance period.",
      "2024-09-02": "Discussion on medieval civilizations.",
    },
    English: {
      "2024-09-01": "Essay writing on Shakespeare.",
      "2024-09-02": "Reading comprehension exercise.",
    },
    Geography: {
      "2024-09-01": "Introduction to map reading.",
      "2024-09-02": "Study of world climates.",
    },
    Art: {
      "2024-09-01": "Sketching basics.",
      "2024-09-02": "Color theory workshop.",
    }
  }
};

const ClassDiary = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getDiaryEntries = () => {
    if (selectedDate) {
      return Object.keys(dummyDiaryData.subjects).map(subject => {
        const entry = dummyDiaryData.subjects[subject][selectedDate];
        return (
          <div key={subject} className="mb-2">
            <h4 className="text-sm font-semibold text-blue-600">{subject}</h4>
            <p className="text-gray-700 text-sm">{entry || '-'}</p>
          </div>
        );
      });
    }
    return 'Please select a date.';
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Class Diary</h2>

      {/* Month and Year Selectors */}
      <div className="flex space-x-4 mb-8">
        <div className="flex flex-col items-center">
          <label className="font-semibold text-gray-600 mb-1">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="font-semibold text-gray-600 mb-1">Select Year</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Main Content - Calendar and Diary Entries */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 items-start">
        {/* Calendar View */}
        <div className="flex flex-col items-center mb-6 lg:mb-0">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {months[selectedMonth]} {selectedYear}
          </div>

          <div className="grid grid-cols-7 gap-2 w-72">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-500">
                {day}
              </div>
            ))}

            {getDaysInMonth(selectedYear, selectedMonth).map((date, index) => {
              const dateKey = date.toISOString().split('T')[0];
              const hasEntry = Object.values(dummyDiaryData.subjects).some(subjects => subjects[dateKey]);
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-transform
                    ${selectedDate === dateKey ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                    ${hasEntry ? 'border-blue-500 border' : ''}
                    ${!hasEntry ? 'border-none' : ''}
                    hover:scale-105`}
                >
                  <span className="text-base">{date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diary Entries Display */}
        <div className="w-full lg:w-80 p-4 bg-white shadow-lg rounded-md">
          <h3 className="text-xl font-semibold text-blue-500 mb-4">Diary Entries</h3>
          {getDiaryEntries()}
        </div>
      </div>
    </div>
  );
};

export default ClassDiary;
