import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatIcon, 
  XIcon, 
  ArrowUpIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BellIcon
} from '@heroicons/react/solid';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your School Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // School-specific responses
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common school queries
    if (lowerMessage.includes('attendance') || lowerMessage.includes('present')) {
      return "You can check your attendance in the Attendance section. It shows your daily attendance record and percentage.";
    }
    
    if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
      return "Assignments are available in the Assignments section. You can view due dates, submit work, and check grades there.";
    }
    
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('mark')) {
      return "Exam schedules and marks are available in the Exams & Marks section. You can view upcoming exams and past results.";
    }
    
    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('class')) {
      return "Your class timetable is available in the Timetable section. It shows your daily class schedule and room numbers.";
    }
    
    if (lowerMessage.includes('fee') || lowerMessage.includes('payment') || lowerMessage.includes('dues')) {
      return "Fee information and payment status can be found in the Fee section. You can view dues, payment history, and make payments.";
    }
    
    if (lowerMessage.includes('notification') || lowerMessage.includes('announcement')) {
      return "Check the Notifications section for important announcements, updates, and school notices.";
    }
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      return "Your profile information is available in the Profile section. You can update personal details and view academic records.";
    }
    
    if (lowerMessage.includes('mock test') || lowerMessage.includes('practice')) {
      return "Mock tests and practice materials are available in the Mock Tests section. You can take practice exams and review performance.";
    }
    
    if (lowerMessage.includes('diary') || lowerMessage.includes('class diary')) {
      return "The Class Diary section contains daily class activities, homework assignments, and teacher notes.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I assist you with your school activities today?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can help you with:\n• Attendance queries\n• Assignment information\n• Exam schedules and marks\n• Timetable details\n• Fee payments\n• Notifications\n• Profile management\n• Mock tests\n• Class diary\n\nJust ask me anything about these topics!";
    }
    
    // Default response
    return "I'm here to help with your school-related queries. You can ask me about attendance, assignments, exams, timetable, fees, notifications, or any other school activities. How can I assist you?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: AcademicCapIcon, text: 'Attendance', action: 'How can I check my attendance?' },
    { icon: DocumentTextIcon, text: 'Assignments', action: 'Where can I find my assignments?' },
    { icon: CalendarIcon, text: 'Exams', action: 'When are my next exams?' },
    { icon: ClockIcon, text: 'Timetable', action: 'Show me my class schedule' },
    { icon: CurrencyDollarIcon, text: 'Fees', action: 'What are my fee dues?' },
    { icon: BellIcon, text: 'Notifications', action: 'Any new notifications?' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <ChatIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">School Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex flex-col items-center p-2 text-xs bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <action.icon className="w-4 h-4 mb-1" />
                  <span className="text-center">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUpIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
