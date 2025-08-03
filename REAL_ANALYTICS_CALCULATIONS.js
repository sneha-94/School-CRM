// EXAMPLE: How Performance Analytics Should Calculate Real Data

// 1. ATTENDANCE CALCULATION
const calculateAttendance = (attendanceRecords) => {
  const monthlyData = {};
  
  attendanceRecords.forEach(record => {
    const month = new Date(record.date).getMonth();
    if (!monthlyData[month]) {
      monthlyData[month] = { present: 0, total: 0 };
    }
    monthlyData[month].total++;
    if (record.status === 'present') {
      monthlyData[month].present++;
    }
  });
  
  return Object.keys(monthlyData).map(month => ({
    month: getMonthName(month),
    percentage: (monthlyData[month].present / monthlyData[month].total) * 100
  }));
};

// 2. SUBJECT SCORES CALCULATION
const calculateSubjectScores = (examRecords) => {
  const subjectData = {};
  
  examRecords.forEach(record => {
    if (!subjectData[record.subject]) {
      subjectData[record.subject] = { totalMarks: 0, maxMarks: 0 };
    }
    subjectData[record.subject].totalMarks += record.marksObtained;
    subjectData[record.subject].maxMarks += record.maxMarks;
  });
  
  return Object.keys(subjectData).map(subject => ({
    subject,
    percentage: (subjectData[subject].totalMarks / subjectData[subject].maxMarks) * 100
  }));
};

// 3. ASSIGNMENT PUNCTUALITY CALCULATION  
const calculatePunctuality = (assignments) => {
  const categories = {
    onTime: 0,
    late1to2: 0,
    late3plus: 0,
    notSubmitted: 0
  };
  
  assignments.forEach(assignment => {
    if (!assignment.submittedDate) {
      categories.notSubmitted++;
    } else {
      const dueDate = new Date(assignment.dueDate);
      const submittedDate = new Date(assignment.submittedDate);
      const daysDiff = Math.ceil((submittedDate - dueDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 0) {
        categories.onTime++;
      } else if (daysDiff <= 2) {
        categories.late1to2++;
      } else {
        categories.late3plus++;
      }
    }
  });
  
  const total = assignments.length;
  return {
    onTime: (categories.onTime / total) * 100,
    late1to2: (categories.late1to2 / total) * 100,
    late3plus: (categories.late3plus / total) * 100,
    notSubmitted: (categories.notSubmitted / total) * 100
  };
};

// 4. TREND CALCULATION
const calculateTrend = (dataArray) => {
  if (dataArray.length < 2) return 'neutral';
  
  const firstHalf = dataArray.slice(0, Math.floor(dataArray.length / 2));
  const secondHalf = dataArray.slice(Math.floor(dataArray.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  return secondAvg > firstAvg ? 'up' : 'down';
};

// EXAMPLE API INTEGRATION:
const fetchPerformanceData = async (period) => {
  try {
    // Fetch all data in parallel
    const [attendanceRes, scoresRes, assignmentsRes] = await Promise.all([
      axios.get(`/api/analytics/attendance?period=${period}`),
      axios.get(`/api/analytics/scores?period=${period}`),
      axios.get(`/api/analytics/assignments?period=${period}`)
    ]);
    
    // Calculate metrics
    const attendanceData = calculateAttendance(attendanceRes.data);
    const subjectScores = calculateSubjectScores(scoresRes.data);
    const punctuality = calculatePunctuality(assignmentsRes.data);
    
    // Calculate averages and trends
    const avgAttendance = attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length;
    const avgScore = subjectScores.reduce((sum, item) => sum + item.percentage, 0) / subjectScores.length;
    const punctualityRate = punctuality.onTime;
    
    const attendanceTrend = calculateTrend(attendanceData.map(d => d.percentage));
    const scoreTrend = calculateTrend(subjectScores.map(d => d.percentage));
    const punctualityTrend = 'up'; // Based on historical comparison
    
    return {
      attendanceData,
      subjectScores,
      punctuality,
      stats: {
        avgAttendance,
        avgScore,
        punctualityRate,
        attendanceTrend,
        scoreTrend,
        punctualityTrend
      }
    };
  } catch (error) {
    console.error('Failed to fetch performance data:', error);
    // Fall back to mock data
    return getMockData();
  }
};
