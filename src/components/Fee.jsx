import React from 'react';

const Fee = () => {
    // Sample fee data
    const fees = [
        { term: 'Term 1', dueDate: '2024-01-15', status: 'paid' },
        { term: 'Term 2', dueDate: '2024-06-15', status: 'due' },
        { term: 'Term 3', dueDate: '2024-12-15', status: 'overdue' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500 text-white';
            case 'due':
                return 'bg-yellow-500 text-white';
            case 'overdue':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-300 text-black';
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fee Status</h2>
            <ul>
                {fees.map((fee, index) => (
                    <li key={index} className="mb-4">
                        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                            <div>
                                <span className="text-lg font-semibold text-gray-700">{fee.term}</span>
                                <p className="text-sm text-gray-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full ${getStatusStyles(fee.status)}`}>
                                {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Fee;
