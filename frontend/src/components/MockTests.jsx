import React, { useState } from 'react';
import { CheckIcon, XIcon } from '@heroicons/react/solid'; // Tailwind Heroicons for correct and wrong indicators

// Sample JSON data for mock tests
const mockTestsData = [
  {
    id: 1,
    title: 'Mock Test 1',
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        options: { A: 'Berlin', B: 'Paris', C: 'Madrid', D: 'Rome' },
        answer: 'B',
        explanation: 'Paris is the capital of France.',
      },
      {
        id: 2,
        question: 'Who wrote "Hamlet"?',
        options: { A: 'Charles Dickens', B: 'Mark Twain', C: 'William Shakespeare', D: 'J.K. Rowling' },
        answer: 'C',
        explanation: 'William Shakespeare wrote "Hamlet".',
      },
      // Add more questions here up to 10
    ],
    userScore: null, // Store user score
  },
  {
    id: 2,
    title: 'Mock Test 2',
    questions: [
      {
        id: 1,
        question: 'What is the largest planet in our solar system?',
        options: { A: 'Earth', B: 'Mars', C: 'Jupiter', D: 'Saturn' },
        answer: 'C',
        explanation: 'Jupiter is the largest planet in our solar system.',
      },
      {
        id: 2,
        question: 'What element does "O" represent in the periodic table?',
        options: { A: 'Oxygen', B: 'Osmium', C: 'Oganesson', D: 'Oxium' },
        answer: 'A',
        explanation: 'The element "O" represents Oxygen.',
      },
      // Add more questions here up to 10
    ],
    userScore: null, // Store user score
  }
];

const MockTests = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store user's selected answers

  // Handle selecting a mock test
  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setSelectedAnswers({}); // Reset answers when a new test is selected
  };

  // Handle user's choice selection for each question
  const handleChoiceSelect = (testId, questionId, choice) => {
    if (!selectedAnswers[questionId]) { // Only allow answer selection once per question
      const updatedAnswers = { ...selectedAnswers, [questionId]: choice };
      setSelectedAnswers(updatedAnswers);
    }
  };

  // Calculate score after test completion
  const calculateScore = () => {
    let score = 0;
    selectedTest.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) score++;
    });
    // Update the test's score after completion
    selectedTest.userScore = `${score}/${selectedTest.questions.length}`;
    setSelectedTest(null); // Reset after scoring
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Mock Test Tab Header */}
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">Mock Tests</h1>

      {/* Test List */}
      <div className="w-full max-w-md mb-6">
        {mockTestsData.map((test) => (
          <div
            key={test.id}
            className="flex justify-between items-center p-4 mb-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 cursor-pointer transition duration-300 border border-gray-200 dark:border-gray-700"
            onClick={() => handleTestSelect(test)}
          >
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{test.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {test.userScore ? `Score: ${test.userScore}` : 'Pending'}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Test */}
      {selectedTest && (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedTest.title}</h2>
          
          {selectedTest.questions.map((question) => (
            <div key={question.id} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Question {question.id}: {question.question}
              </h3>
              
              <div className="space-y-2">
                {Object.entries(question.options).map(([choice, option]) => {
                  const isSelected = selectedAnswers[question.id] === choice;
                  const isCorrect = question.answer === choice;
                  const showResult = selectedAnswers[question.id];
                  
                  return (
                    <button
                      key={choice}
                      onClick={() => handleChoiceSelect(selectedTest.id, question.id, choice)}
                      disabled={selectedAnswers[question.id]}
                      className={`
                        w-full p-3 text-left rounded-lg border transition-all duration-200
                        ${isSelected 
                          ? isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-400 text-red-800 dark:text-red-200'
                          : showResult && isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                        }
                        ${selectedAnswers[question.id] ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{choice}: {option}</span>
                        {showResult && (
                          <div className="flex items-center">
                            {isCorrect ? (
                              <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : isSelected ? (
                              <XIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {selectedAnswers[question.id] && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {/* Submit Button */}
          {Object.keys(selectedAnswers).length === selectedTest.questions.length && (
            <button
              onClick={calculateScore}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Submit Test
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MockTests;
