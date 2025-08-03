import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const ExamsAndMarks = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    marksObtained: '',
    maxMarks: 100,
    examDate: '',
    examName: ''
  });
  const [editingId, setEditingId] = useState(null);
  
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in');
      const res = await fetch(`${API_BASE_URL}/exams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch exams');
      const data = await res.json();
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchExams(); }, []);
  
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/exams/${editingId}` : `${API_BASE_URL}/exams`;
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save exam');
      setFormData({ subject: '', marksObtained: '', maxMarks: 100, examDate: '', examName: '' });
      setEditingId(null);
      fetchExams();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleEdit = exam => {
    setFormData({
      subject: exam.subject,
      marksObtained: exam.marksObtained,
      maxMarks: exam.maxMarks,
      examDate: exam.examDate ? exam.examDate.substring(0, 10) : '',
      examName: exam.examName || ''
    });
    setEditingId(exam.id);
  };
  
  const handleDelete = async id => {
    if (!window.confirm('Delete this exam record?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in');
      const res = await fetch(`${API_BASE_URL}/exams/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete exam');
      fetchExams();
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-6 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">📚 Exams & Marks Management</h2>
        {error && <div className="p-3 mb-4 text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-200">{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
          <input name="marksObtained" value={formData.marksObtained} onChange={handleInputChange} placeholder="Marks Obtained" type="number" min="0" max={formData.maxMarks} className="p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
          <input name="maxMarks" value={formData.maxMarks} onChange={handleInputChange} placeholder="Max Marks" type="number" min="1" className="p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
          <input name="examDate" value={formData.examDate} onChange={handleInputChange} placeholder="Exam Date" type="date" className="p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
          <input name="examName" value={formData.examName} onChange={handleInputChange} placeholder="Exam Name (optional)" className="p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <button type="submit" className="px-4 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded hover:bg-blue-700">{editingId ? '✏️ Update' : '➕ Add'} Exam</button>
        </form>
        
        {loading ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No exam records found. Add your first exam above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border-collapse rounded-lg dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Exam Name</th>
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Score</th>
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => {
                  const percentage = Math.round((exam.marksObtained / exam.maxMarks) * 100);
                  const gradeColor = percentage >= 90 ? 'text-green-600' : percentage >= 75 ? 'text-blue-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
                  
                  return (
                    <tr key={exam.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3 text-gray-800 dark:text-gray-200">{exam.subject}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{exam.examName || '-'}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{exam.marksObtained}/{exam.maxMarks}</td>
                      <td className={`p-3 font-semibold ${gradeColor}`}>{percentage}%</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : '-'}</td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => handleEdit(exam)} className="px-3 py-1 text-sm text-yellow-900 transition-colors bg-yellow-400 rounded hover:bg-yellow-500">✏️ Edit</button>
                        <button onClick={() => handleDelete(exam.id)} className="px-3 py-1 text-sm text-white transition-colors bg-red-500 rounded hover:bg-red-600">🗑️ Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsAndMarks;
