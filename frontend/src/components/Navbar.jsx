import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Box, Type, Image, Mic } from 'lucide-react';
import AccessibilityToggle from './AccessibilityToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Object', path: '/object', icon: Box },
        { name: 'Text', path: '/text', icon: Type },
        { name: 'Scene', path: '/scene', icon: Image },
        { name: 'Audio', path: '/audio', icon: Mic },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md dark:bg-gray-900/90' : 'bg-white dark:bg-gray-900 border-b dark:border-gray-800'}`}>
            <div className="layout-container">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-blue-600 rounded-lg p-1.5">
                                <Box className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                                Sense<span className="text-blue-600">Guide</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 shadow-sm ring-1 ring-blue-200 dark:ring-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <link.icon className={`w-4 h-4 mr-2 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center pl-6 border-l border-gray-200 dark:border-gray-700 ml-6">
                        <AccessibilityToggle />
                    </div>

                    <div className="flex items-center md:hidden">
                        <div className="mr-4">
                            <AccessibilityToggle />
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t dark:border-gray-800">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === link.path
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <link.icon className="w-5 h-5 mr-3" />
                                    {link.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
