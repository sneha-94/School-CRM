import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CheckCircleIcon, XCircleIcon, DocumentTextIcon } from '@heroicons/react/solid';
import 'chart.js/auto'; // Automatically register all necessary components
import { motion } from 'framer-motion';

// Sample data for exams
const examsData = [
  {
    id: 1,
    subject: 'Math',
    examName: 'Algebra Test',
    date: '2024-09-10',
    status: 'Completed',
    scores: {
      Math: 95,
      Science: 88,
      History: 92,
    },
    maxScore: 100,
    grade: 'A',
  },
  {
    id: 2,
    subject: 'Science',
    examName: 'Physics Midterm',
    date: '2024-09-12',
    status: 'Pending',
    scores: {
      Math: null,
      Science: null,
      History: null,
    },
    maxScore: 100,
    grade: null,
  },
  {
    id: 3,
    subject: 'History',
    examName: 'Renaissance Quiz',
    date: '2024-09-15',
    status: 'Completed',
    scores: {
      Math: 88,
      Science: 92,
      History: 85,
    },
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

  // Prepare data for the bar graph
  const chartData = {
    labels: examsData.map(exam => exam.examName),
    datasets: [
      {
        label: 'Math',
        data: examsData.map(exam => exam.scores.Math !== null ? exam.scores.Math : 0), // Use 0 if score is null
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Science',
        data: examsData.map(exam => exam.scores.Science !== null ? exam.scores.Science : 0), // Use 0 if score is null
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'History',
        data: examsData.map(exam => exam.scores.History !== null ? exam.scores.History : 0), // Use 0 if score is null
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Exams Dashboard Header */}
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center"
      >
        <DocumentTextIcon className="mr-2 h-8 w-8" />
        Exams Dashboard
      </motion.h2>

      <div className="w-full max-w-6xl">
        {/* Exam List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {examsData.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              onClick={() => handleExamSelect(exam)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.examName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
                </div>
                <div className="flex items-center">
                  {exam.status === 'Completed' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Date:</strong> {exam.date}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Status:</strong> {exam.status}
                </p>
                {exam.grade && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Grade:</strong> {exam.grade}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.2)',
                    },
                    ticks: {
                      color: 'rgba(156, 163, 175, 0.8)',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(156, 163, 175, 0.2)',
                    },
                    ticks: {
                      color: 'rgba(156, 163, 175, 0.8)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(156, 163, 175, 0.8)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Selected Exam Details */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedExam.examName} - Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Exam Information</h4>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Subject:</strong> {selectedExam.subject}</p>
                  <p><strong>Date:</strong> {selectedExam.date}</p>
                  <p><strong>Status:</strong> {selectedExam.status}</p>
                  <p><strong>Max Score:</strong> {selectedExam.maxScore}</p>
                  {selectedExam.grade && <p><strong>Grade:</strong> {selectedExam.grade}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Scores</h4>
                <div className="space-y-2">
                  {Object.entries(selectedExam.scores).map(([subject, score]) => (
                    <div key={subject} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{subject}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {score !== null ? `${score}/${selectedExam.maxScore}` : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExamsAndMarks;
