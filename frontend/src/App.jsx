import React from 'react';

import Navbar from './components/Navbar';
import AppRouter from './router';


const App = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                <AppRouter />
            </main>
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SenseGuide. Built for Microsoft Imagine Cup.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
