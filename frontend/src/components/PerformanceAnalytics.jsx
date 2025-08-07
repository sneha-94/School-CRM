import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowLeftIcon, TrendingUpIcon, TrendingDownIcon, ClockIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000/api';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PerformanceAnalytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default empty data structure
  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    datasets: []
  });
  const [subjectScores, setSubjectScores] = useState({
    labels: [],
    datasets: []
  });
  const [assignmentPunctuality, setAssignmentPunctuality] = useState({
    labels: [],
    datasets: []
  });
  const [analyticsStats, setAnalyticsStats] = useState({
    avgAttendance: 0,
    attendanceTrend: 'up',
    avgScore: 0,
    scoreTrend: 'up',
    punctualityRate: 0,
    punctualityTrend: 'down',
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Fetch real data from API
    const loadData = async () => {
      try {
        // Get authentication token
        const token = localStorage.getItem('token') || 'fake-token-for-demo';
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch all analytics data in parallel
        const [attendanceRes, scoresRes, assignmentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/attendance?period=${selectedPeriod}`, { headers }),
          axios.get(`${API_BASE_URL}/analytics/scores?period=${selectedPeriod}`, { headers }),
          axios.get(`${API_BASE_URL}/analytics/assignments?period=${selectedPeriod}`, { headers })
        ]);

        // Process attendance data
        const attendanceData = {
          labels: attendanceRes.data.map(item => item.month),
          datasets: [{
            label: 'Attendance %',
            data: attendanceRes.data.map(item => item.percentage),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
          }]
        };

        // Process subject scores data
        const subjectScores = {
          labels: scoresRes.data.map(item => item.subject),
          datasets: [{
            label: 'Current Scores',
            data: scoresRes.data.map(item => item.percentage),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 2,
          }]
        };

        // Process assignment punctuality data
        const assignmentData = assignmentsRes.data;
        const assignmentPunctuality = {
          labels: ['On Time', 'Late (1-2 days)', 'Late (3+ days)', 'Not Submitted'],
          datasets: [{
            data: [assignmentData.onTime, assignmentData.late1to2, assignmentData.late3plus, assignmentData.notSubmitted],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(107, 114, 128, 0.8)',
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(107, 114, 128, 1)',
            ],
            borderWidth: 2,
          }]
        };

        // Calculate statistics
        const avgAttendance = attendanceRes.data.reduce((sum, item) => sum + item.percentage, 0) / attendanceRes.data.length;
        const avgScore = scoresRes.data.reduce((sum, item) => sum + item.percentage, 0) / scoresRes.data.length;
        const punctualityRate = assignmentData.onTime;

        // Calculate trends (compare first half vs second half)
        const attendanceTrend = calculateTrend(attendanceRes.data.map(item => item.percentage));
        const scoreTrend = calculateTrend(scoresRes.data.map(item => item.percentage));
        
        const analyticsStats = {
          avgAttendance: Math.round(avgAttendance * 10) / 10,
          attendanceTrend,
          avgScore: Math.round(avgScore * 10) / 10,
          scoreTrend,
          punctualityRate,
          punctualityTrend: 'up', // This could be calculated from historical data
        };

        // Update state with real data
        setAttendanceData(attendanceData);
        setSubjectScores(subjectScores);
        setAssignmentPunctuality(assignmentPunctuality);
        setAnalyticsStats(analyticsStats);
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        
        // Fall back to mock data if API fails
        const mockData = getMockData();
        setAttendanceData(mockData.attendanceData);
        setSubjectScores(mockData.subjectScores);
        setAssignmentPunctuality(mockData.assignmentPunctuality);
        setAnalyticsStats(mockData.analyticsStats);
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedPeriod]);

  // Utility function to calculate trend
  const calculateTrend = (dataArray) => {
    if (dataArray.length < 2) return 'up';
    
    const firstHalf = dataArray.slice(0, Math.floor(dataArray.length / 2));
    const secondHalf = dataArray.slice(Math.floor(dataArray.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return secondAvg > firstAvg ? 'up' : 'down';
  };

  // Mock data fallback
  const getMockData = () => {
    return {
      attendanceData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Attendance %',
          data: [88, 92, 85, 90, 87, 94, 89, 91],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      subjectScores: {
        labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
        datasets: [{
          label: 'Current Scores',
          data: [85, 78, 92, 88, 76, 94],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 2,
        }]
      },
      assignmentPunctuality: {
        labels: ['On Time', 'Late (1-2 days)', 'Late (3+ days)', 'Not Submitted'],
        datasets: [{
          data: [75, 15, 8, 2],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(107, 114, 128, 1)',
          ],
          borderWidth: 2,
        }]
      },
      analyticsStats: {
        avgAttendance: 89.5,
        attendanceTrend: 'up',
        avgScore: 85.5,
        scoreTrend: 'up',
        punctualityRate: 75,
        punctualityTrend: 'down',
      }
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#374151',
          padding: 20,
        },
      },
    },
  };

  const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon className={`h-8 w-8 ${color}`} />
          {trend === 'up' ? (
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDownIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 text-gray-400 rounded-md hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 rounded-md hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <StatCard
            title="Average Attendance"
            value={`${analyticsStats.avgAttendance}%`}
            trend={analyticsStats.attendanceTrend}
            icon={ClockIcon}
            color="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Average Score"
            value={`${analyticsStats.avgScore}%`}
            trend={analyticsStats.scoreTrend}
            icon={TrendingUpIcon}
            color="text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Punctuality Rate"
            value={`${analyticsStats.punctualityRate}%`}
            trend={analyticsStats.punctualityTrend}
            icon={ClockIcon}
            color="text-purple-600 dark:text-purple-400"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Attendance Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Monthly Attendance Trend
            </h2>
            <div className="h-80">
              {attendanceData.datasets && attendanceData.datasets.length > 0 ? (
                <Line data={attendanceData} options={chartOptions} />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>

          {/* Subject-wise Score Chart */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Subject-wise Scores
            </h2>
            <div className="h-80">
              {subjectScores.datasets && subjectScores.datasets.length > 0 ? (
                <Bar data={subjectScores} options={chartOptions} />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>

          {/* Assignment Punctuality Rate */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Assignment Punctuality Rate
            </h2>
            <div className="flex justify-center">
              <div className="w-80 h-80">
                {assignmentPunctuality.datasets && assignmentPunctuality.datasets.length > 0 ? (
                  <Doughnut data={assignmentPunctuality} options={doughnutOptions} />
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="p-6 mt-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Key Insights</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Attendance</h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Your attendance has improved by 3% this month. Keep up the good work!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <h3 className="font-medium text-green-900 dark:text-green-100">Academic Performance</h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Computer Science is your strongest subject with 94% average score.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-100">Assignment Submission</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Focus on timely submission to improve your punctuality rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
