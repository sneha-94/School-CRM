import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, DocumentTextIcon } from '@heroicons/react/solid';

// Sample data for exams
const examsData = [
  {
    id: 1,
    subject: 'Math',
    examName: 'Algebra Test',
    date: '2024-09-10',
    status: 'Completed',
    totalScore: 95,
    maxScore: 100,
    grade: 'A',
  },
  {
    id: 2,
    subject: 'Science',
    examName: 'Physics Midterm',
    date: '2024-09-12',
    status: 'Pending',
    totalScore: null,
    maxScore: 100,
    grade: null,
  },
  {
    id: 3,
    subject: 'History',
    examName: 'Renaissance Quiz',
    date: '2024-09-15',
    status: 'Completed',
    totalScore: 88,
    maxScore: 100,
    grade: 'B+',
  },
];

const ExamsAndMarks = () => {
  const [selectedExam, setSelectedExam] = useState(null);

  // Handle selecting an exam for details view
  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Exams Dashboard Header */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Exams Dashboard</h1>

      {/* Exams List */}
      <div className="w-full max-w-3xl">
        {examsData.map((exam) => (
          <div
            key={exam.id}
            className="flex justify-between items-center p-4 mb-4 bg-gray-100 shadow rounded-lg hover:bg-gray-200 cursor-pointer transition"
            onClick={() => handleExamSelect(exam)}
          >
            <div className="text-lg font-semibold">{exam.examName}</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{exam.subject}</span> | {exam.date}
            </div>
            <div className={`text-sm ${exam.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
              {exam.status === 'Completed' ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 inline-block mr-1" /> Completed
                </>
              ) : (
                <>
                  <XCircleIcon className="h-5 w-5 inline-block mr-1" /> Pending
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exam Details View */}
      {selectedExam && (
        <div className="w-full max-w-lg mt-6 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{selectedExam.examName}</h2>
          <p className="text-md text-gray-800 mb-2">Subject: {selectedExam.subject}</p>
          <p className="text-md text-gray-800 mb-4">Date: {selectedExam.date}</p>
          {selectedExam.status === 'Completed' ? (
            <>
              <div className="mb-4">
                <p className="text-lg font-semibold">Total Score: {selectedExam.totalScore} / {selectedExam.maxScore}</p>
                <p className="text-lg font-semibold">Grade: {selectedExam.grade}</p>
              </div>
              <div className="mt-6 text-gray-600">
                <DocumentTextIcon className="h-6 w-6 inline-block mr-2" />
                <span>Exam Details and Faculty Actions: Faculty reviews and updates scores. Reports are generated for analysis.</span>
              </div>
            </>
          ) : (
            <p className="text-lg text-gray-600">Exam is pending. Scores will be updated after completion.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamsAndMarks;
