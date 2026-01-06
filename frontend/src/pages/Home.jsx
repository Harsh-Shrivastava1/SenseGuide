import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Type, Mic, Info, ShieldCheck, Heart, Sparkles, AlertCircle, Image } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const Home = () => {
    const [showWhyModal, setShowWhyModal] = useState(false);
    const { startListening, stopListening, isListening, speak } = useVoice();
    const [voiceStarted, setVoiceStarted] = useState(false);

    const handleToggleVoiceMode = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
            setVoiceStarted(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex flex-col">
            <main className="flex-grow flex flex-col items-center justify-center px-4 relative overflow-hidden">
                {/* Subtle Background Accent - Reduced Brightness */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-100/10 to-transparent dark:from-blue-900/10 pointer-events-none" />
                {/* Hero Section */}
                <div className="w-full max-w-md text-center space-y-4">



                    {/* Heading */}
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter leading-tight">
                        SenseGuide <br />
                        <span className="text-blue-600 dark:text-blue-400">Voice-First Visual Assistance</span>
                    </h1>

                    {/* Purpose Tagline - Concise & Visual Hierarchy */}
                    <p className="text-base font-medium text-slate-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto pt-2">
                        Helping people with low vision understand their surroundings using camera and voice.
                    </p>

                    {/* Primary CTA - Toggle Button */}
                    <div className="py-4 space-y-3">
                        <button
                            onClick={handleToggleVoiceMode}
                            className={`w-full max-w-xs mx-auto btn-primary text-xl py-8 shadow-2xl flex flex-col items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 rounded-3xl ${isListening
                                ? 'ring-4 ring-green-400 bg-green-600 shadow-green-500/40'
                                : 'shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            aria-label={isListening ? "Stop Voice Mode" : "Start Voice Mode"}
                        >
                            <Mic className={`w-12 h-12 mb-3 ${isListening ? 'animate-pulse text-white' : 'text-white'}`} />
                            <span className="font-bold tracking-wider">{isListening ? "Stop Voice Mode" : "Start Voice Mode"}</span>
                        </button>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Tap once to start • Tap again to stop
                        </p>
                        {/* DEBUG STATUS */}
                        <div className="text-[10px] text-gray-300 mt-2 font-mono">
                            Status: {isListening ? "Listening" : "Idle"} | VoiceMode: {String(voiceStarted)}
                        </div>
                    </div>

                    {/* Voice Status Indicator */}
                    <div className={`transition-all duration-500 overflow-hidden ${isListening ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                            <div className="flex gap-1 h-4 items-end">
                                <div className="w-1 bg-current animate-music-bar-1 h-2"></div>
                                <div className="w-1 bg-current animate-music-bar-2 h-4"></div>
                                <div className="w-1 bg-current animate-music-bar-3 h-3"></div>
                            </div>
                            <span className="font-semibold text-sm">Active</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
                            Say "open scene", "identify object", or "read text"
                        </p>
                    </div>

                    {/* Capability Strip */}
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <Link to="/scene" className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group hover:scale-105 active:scale-95">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                                <Image className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight">Describe Scene</span>
                        </Link>
                        <Link to="/object" className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer group hover:scale-105 active:scale-95">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                                <Box className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight">Identify Object</span>
                        </Link>
                        <Link to="/text" className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all cursor-pointer group hover:scale-105 active:scale-95">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-green-200 dark:group-hover:border-green-800 transition-colors">
                                <Type className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight">Read Text</span>
                        </Link>
                        <Link to="/audio" className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer group hover:scale-105 active:scale-95">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-red-200 dark:group-hover:border-red-800 transition-colors">
                                <Mic className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight">Ask Anything</span>
                        </Link>
                    </div>

                    {/* Collapsible More Features */}
                    <div className="pt-2">
                        <details className="group">
                            <summary className="flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer list-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span>More Features</span>
                                <span className="ml-1 transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="mt-4 grid grid-cols-1 gap-3 animate-fade-in text-left">
                                <Link to="/scene" className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Image className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Scene Explanation</h3>
                                        <p className="text-xs text-gray-500">Describe surroundings</p>
                                    </div>
                                </Link>
                                <Link to="/object" className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <Box className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Object Identity</h3>
                                        <p className="text-xs text-gray-500">Identify items</p>
                                    </div>
                                </Link>
                                <Link to="/text" className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                        <Type className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Text Simplifier</h3>
                                        <p className="text-xs text-gray-500">Read & simplify docs</p>
                                    </div>
                                </Link>
                                <Link to="/audio" className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                        <Mic className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Audio Assistant</h3>
                                        <p className="text-xs text-gray-500">Ask questions</p>
                                    </div>
                                </Link>
                            </div>
                        </details>
                    </div>

                    <button
                        onClick={() => setShowWhyModal(true)}
                        className="mt-6 text-xs font-medium text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2"
                        aria-label="Learn why SenseGuide matters"
                    >
                        Why SenseGuide Matters
                    </button>
                </div>
            </main>

            {/* Bottom Sheet */}
            {showWhyModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                        onClick={() => setShowWhyModal(false)}
                        aria-hidden="true"
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 rounded-t-3xl p-6 shadow-2xl transform transition-transform animate-slide-up max-w-md mx-auto border-t border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Why SenseGuide Matters</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Heart className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Confidence & Independence</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Navigate confidently without needing to ask for help.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Safety First</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Real-time hazard detection.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Universal Accessibility</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">Built for everyone, including those with low vision or situational challenges.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowWhyModal(false)}
                            className="w-full mt-8 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-900 dark:text-white"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
