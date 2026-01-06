import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Eye, Type } from 'lucide-react';

const AccessibilityToggle = () => {
    const { highContrast, toggleHighContrast, largeText, toggleLargeText } = useAccessibility();

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={toggleHighContrast}
                className={`p-2 rounded-full transition-all duration-300 ${highContrast
                    ? 'bg-yellow-400 text-black ring-2 ring-yellow-500 shadow-md transform scale-110'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                aria-label={highContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
                title="Toggle High Contrast"
            >
                <Eye className={highContrast ? "w-6 h-6" : "w-5 h-5"} />
            </button>
        </div>
    );
};

export default AccessibilityToggle;
