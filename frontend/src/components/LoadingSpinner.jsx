import React from 'react';

const LoadingSpinner = ({ label = "Thinking..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 animate-pulse">{label}</p>
        </div>
    );
};

export default LoadingSpinner;
