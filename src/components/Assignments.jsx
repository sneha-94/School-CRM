import React, { useState, useEffect } from 'react';

// Dummy backend fetch for assignments
const fetchAssignmentsFromBackend = async () => {
  return [
    { id: 1, subject: 'Math', title: 'Algebra Assignment', dueDate: '2024-09-10', description: 'Solve all exercises from Chapter 3', status: 'pending' },
    { id: 2, subject: 'Science', title: 'Photosynthesis Essay', dueDate: '2024-09-12', description: 'Write an essay on the process of photosynthesis.', status: 'submitted', file: 'photosynthesis_essay.pdf' },
    { id: 3, subject: 'History', title: 'World War II Project', dueDate: '2024-05-15', description: 'Create a timeline of key events in World War II.', status: 'pending' },
  ];
};

// Dummy function to simulate file upload to the backend
const uploadFileToBackend = async (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 2000); // Simulate 2-second upload time
  });
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch assignments from backend on component mount
    const fetchData = async () => {
      const data = await fetchAssignmentsFromBackend();
      setAssignments(data);
    };
    fetchData();
  }, []);

  const handleFileChange = (event, assignmentId) => {
    const file = event.target.files[0];

    // File validation: Only allow PDF, DOC, DOCX
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    setSelectedFile(file);
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(0); // Reset progress bar
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true); // Show loading while file uploads

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 20));
    }, 400);

    // Simulate file upload to backend
    const response = await uploadFileToBackend(selectedFile);
    clearInterval(interval);

    if (response.success) {
      // Update assignment status to 'submitted'
      const newAssignments = assignments.map((assignment) => {
        if (assignment.id === uploadingAssignmentId) {
          return { ...assignment, status: 'submitted', file: selectedFile.name };
        }
        return assignment;
      });
      setAssignments(newAssignments);
      setNotification('Assignment submitted successfully!');
    } else {
      setNotification('File upload failed. Please try again.');
    }

    setLoading(false); // Hide loading after file upload
    setSelectedFile(null);
    setUploadingAssignmentId(null);
    setUploadProgress(0); // Reset progress bar
  };

  const getDueDateStatus = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due >= today;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', backgroundColor: '#f9fafc', fontFamily: '"Poppins", sans-serif' }}>
      <div style={{ width: '800px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Assignments</h2>

        {/* Notification */}
        {notification && <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#d4edda', borderRadius: '8px', color: '#155724' }}>{notification}</div>}

        {/* Pending Assignments */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '16px' }}>Pending Assignments</h3>
          {assignments.filter(assignment => assignment.status === 'pending').length > 0 ? (
            <ul>
              {assignments.filter(assignment => assignment.status === 'pending').map((assignment) => (
                <li key={assignment.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{assignment.subject}: {assignment.title}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{assignment.description}</p>
                      <p style={{ margin: 0 }}>Due: {assignment.dueDate}</p>
                    </div>
                    <div>
                      {getDueDateStatus(assignment.dueDate) ? (
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, assignment.id)} />
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Past Deadline</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending assignments.</p>
          )}
        </div>

        {/* Submitted Assignments */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '16px' }}>Submitted Assignments</h3>
          {assignments.filter(assignment => assignment.status === 'submitted').length > 0 ? (
            <ul>
              {assignments.filter(assignment => assignment.status === 'submitted').map((assignment) => (
                <li key={assignment.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#E0F7FA', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{assignment.subject}: {assignment.title}</p>
                      <p style={{ margin: 0 }}>Due: {assignment.dueDate}</p>
                    </div>
                    <div>
                      <a href={`#${assignment.file}`} style={{ color: '#2196F3', textDecoration: 'none' }}>📄 {assignment.file}</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No submitted assignments.</p>
          )}
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            {loading ? (
              <div>
                <progress value={uploadProgress} max="100" style={{ width: '100%', marginBottom: '16px' }} />
                <p>Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <button
                onClick={handleFileUpload}
                style={{
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                Submit Assignment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
