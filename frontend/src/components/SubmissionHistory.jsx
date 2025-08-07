import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaFilePdf, FaFileWord } from 'react-icons/fa';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  // 🧠 FIX: Temporary mock studentId for local testing
  const studentId = '123';

  useEffect(() => {
    // 🧪 Using mock data for now
    const mockData = [
      {
        title: "Math Assignment 1",
        subject: "Mathematics",
        submittedAt: "2025-08-06",
        status: "Submitted",
        fileUrl: "/uploads/math-assignment1.pdf",
        fileType: "pdf",
        feedback: "Well done! Check question 3 again."
      },
      {
        title: "Science Project",
        subject: "Science",
        submittedAt: null,
        status: "Pending",
        fileUrl: null,
        fileType: null,
        feedback: null
      }
    ];
    setSubmissions(mockData);

    

    // 🔄 When backend is ready, use this instead of mockData:
    /*
    fetch(`http://localhost:5000/api/assignments/submission-history/${studentId}`)
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(err => console.error('Failed to load submission history:', err));
    */



  }, []);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.click();
  };

  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500 text-xl" />;
      default: return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📄 Assignment Submission History</h2>

      {submissions.map((submission, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 border relative">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{submission.title}</h3>
              <p className="text-sm text-gray-600">Subject: {submission.subject}</p>
              <p className="text-sm text-gray-600">
                Date Submitted: {submission.submittedAt || 'Not yet submitted'}
              </p>
              <div className="mt-1">
                Status: {
                  submission.status === 'Submitted' ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">✅ Submitted</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">❌ Pending</span>
                  )
                }
              </div>
            </div>

            {submission.fileUrl && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                  {renderFileIcon(submission.fileType)}
                  <button
                    className="text-sm text-blue-600 underline"
                    onClick={() => setPreviewFile(submission.fileUrl)}
                  >
                    Preview
                  </button>
                </div>
                <button
                  onClick={() => handleDownload(submission.fileUrl)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <FaDownload /> Download
                </button>
              </div>
            )}
          </div>

          {submission.feedback && (
            <div className="mt-4">
              <span className="text-sm font-semibold">🗨️ Feedback: </span>
              <span className="text-sm text-gray-700">{submission.feedback}</span>
            </div>
          )}
        </div>
      ))}

      {/* PDF Preview Modal */}
      {previewFile && previewFile.endsWith('.pdf') && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">PDF Preview</h3>
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => setPreviewFile(null)}
              >
                ✖
              </button>
            </div>
            <Document file={previewFile}>
              <Page pageNumber={1} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;

