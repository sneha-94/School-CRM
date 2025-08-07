import { useState, useCallback } from 'react';
import { AlertCircle, Check, FileText, Upload } from 'lucide-react';
import SubmissionHistory from './SubmissionHistory'; // ✅ ensure path is correct

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`);
  const assignments = await res.json();

  return {
    props: {
      initialAssignments: assignments || [],
    },
  };
}

const Assignments = ({ initialAssignments }) => {
  const [assignments, setAssignments] = useState(initialAssignments || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const studentId = '123'; // Replace with actual ID from auth or context

  const handleFileChange = useCallback((event, assignmentId) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;

    if (!allowedExtensions.exec(file.name)) {
      setNotification({ type: 'error', message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' });
      return;
    }

    setSelectedFile(file);
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(0);
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      setNotification({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('assignmentId', uploadingAssignmentId);
    formData.append('studentId', studentId); // send studentId

    try {
      const response = await fetch('/api/upload-assignment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === uploadingAssignmentId
              ? { ...assignment, status: 'submitted', file: selectedFile.name }
              : assignment
          )
        );
        setNotification({ type: 'success', message: 'Assignment submitted successfully!' });
        setUploadProgress(100);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      setNotification({ type: 'error', message: 'File upload failed. Please try again.' });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setUploadingAssignmentId(null);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [selectedFile, uploadingAssignmentId]);

  const getDueDateStatus = useCallback((dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due >= today;
  }, []);

  const renderAssignmentList = useCallback((status) => {
    const filteredAssignments = assignments?.filter((assignment) => assignment.status === status) || [];

    if (filteredAssignments.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400">No {status} assignments.</p>;
    }

    return filteredAssignments.map((assignment) => (
      <div key={assignment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{assignment.subject}: {assignment.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{assignment.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Due: {assignment.dueDate}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Points: {assignment.points}</p>
          </div>
          <div className="flex items-center space-x-2">
            {assignment.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, assignment.id)}
                    className="hidden"
                  />
                </label>
                {!getDueDateStatus(assignment.dueDate) && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
            {assignment.status === 'submitted' && (
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">Submitted</span>
                {assignment.file && (
                  <FileText className="h-4 w-4 text-blue-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {uploadingAssignmentId === assignment.id && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Uploading: {selectedFile?.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            {uploadProgress === 100 && (
              <button
                onClick={handleFileUpload}
                disabled={isLoading}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                {isLoading ? 'Submitting...' : 'Submit Assignment'}
              </button>
            )}
          </div>
        )}
      </div>
    ));
  }, [assignments, uploadingAssignmentId, selectedFile, uploadProgress, isLoading, handleFileChange, handleFileUpload, getDueDateStatus]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Assignments</h2>

        {notification.message && (
          <div className={`mb-4 p-3 rounded-lg ${
            notification.type === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Pending Assignments</h3>
            {renderAssignmentList('pending')}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Submitted Assignments</h3>
            {renderAssignmentList('submitted')}
          </div>
        </div>

      
        <div className="mt-10">
          <SubmissionHistory studentId={studentId} />
        </div>
      </div>
    </div>
  );
};

export default Assignments;

