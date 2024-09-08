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
  const [currentSubject, setCurrentSubject] = useState('Math');
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryData, setDiaryData] = useState(dummyDiaryData);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getDiaryEntry = () => {
    if (selectedDate) {
      return diaryData.subjects[currentSubject][selectedDate] || 'No diary entry for this date.';
    }
    return 'Please select a date.';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: '#f9fafc',
      height: '100vh'
    }}>
      {/* Class Diary Header */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Class Diary</h2>

      {/* Subject Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: '600', fontSize: '1rem', color: '#555' }}>Select Subject: </label>
        <select
          value={currentSubject}
          onChange={(e) => setCurrentSubject(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        >
          {Object.keys(diaryData.subjects).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar View */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        {/* Display month and year */}
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px'
        }}>
          {getCurrentMonth()}
        </div>
        
        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          width: '350px'
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '1rem',
              color: '#757575'
            }}>{day}</div>
          ))}
          {getDaysInMonth(new Date()).map((date, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: selectedDate === date.toISOString().split('T')[0] ? '#2196F3' : '#E0E0E0',
                color: selectedDate === date.toISOString().split('T')[0] ? '#fff' : '#000',
                transition: 'transform 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Diary Entry Display */}
      <div style={{
        width: '350px',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontSize: '1rem'
      }}>
        <h3 style={{ marginBottom: '8px', color: '#2196F3' }}>Diary Entry</h3>
        <p style={{ color: '#333' }}>{getDiaryEntry()}</p>
      </div>
    </div>
  );
};

export default ClassDiary;
