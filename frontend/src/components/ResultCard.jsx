import React from 'react';
import { Volume2 } from 'lucide-react';

const ResultCard = ({ title, content, details, onSpeak }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up transition-all hover:shadow-2xl">
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
                    {onSpeak && (
                        <button
                            onClick={onSpeak}
                            className="p-3 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            aria-label="Speak text"
                            title="Read Aloud"
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                    )}
                </div>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8 border-l-4 border-blue-500 pl-6">
                        {content}
                    </p>

                    {details && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Analysis Details</h3>
                            <div className="grid gap-4">
                                {Object.entries(details).map(([key, value]) => (
                                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b last:border-0 border-gray-200 dark:border-gray-700 pb-3 last:pb-0">
                                        <span className="font-medium text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-gray-900 dark:text-white font-semibold text-lg">{Array.isArray(value) ? value.join(', ') : value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
