import React, { useState, useEffect } from 'react';
import { Mic, Activity } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import api from '../services/api';

const AudioInterpretation = () => {
    const { startListening, stopListening, isListening, lastCommand, speak, isSpeaking, setAudioMicActive } = useVoice();
    const [isThinking, setIsThinking] = useState(false);
    // Local state to track if we are in an active conversation vs just sitting on the page
    const [conversationActive, setConversationActive] = useState(false);

    useEffect(() => {
        // On mount, ensure we do NOT block global navigation
        setAudioMicActive(false);
        setConversationActive(false);

        // Cleanup on unmount
        return () => {
            setAudioMicActive(false);
        };
    }, []);

    // Toggle Conversation Mode
    const toggleConversation = () => {
        if (conversationActive) {
            // Stop Conversation: keep global listening ON, but unblock navigation
            setConversationActive(false);
            setAudioMicActive(false);
            // We do NOT call stopListening() because we want to allow "Home", "Scene" etc commands immediately
        } else {
            // Start Conversation: block global navigation
            setConversationActive(true);
            setAudioMicActive(true);

            // If global listening isn't on for some reason, start it
            if (!isListening) {
                startListening();
            }
        }
    };

    useEffect(() => {
        // Only process command if Conversation is Active AND we are listening
        if (lastCommand && isListening && conversationActive) {
            handleUserQuery(lastCommand);
        }
    }, [lastCommand]);

    const handleUserQuery = async (text) => {
        setIsThinking(true);
        try {
            const reply = await api.chatWithGroq(text);
            speak(reply);
        } catch (error) {
            speak("I am having trouble connecting to the assistant.");
        } finally {
            setIsThinking(false);
        }
    };

    // Animation Classes - Only animate if Conversation is Active
    const getWaveClass = () => {
        if (!conversationActive) return "border-gray-400 opacity-30"; // Dull if inactive

        if (isSpeaking) return "animate-[pulse_0.5s_ease-in-out_infinite] scale-110 border-blue-400";
        if (isListening) return "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] border-red-400 opacity-75";
        return "animate-[pulse_3s_ease-in-out_infinite] border-gray-400 opacity-30";
    };

    const getCoreColor = () => {
        if (!conversationActive) return "bg-gray-400"; // Dull if inactive

        if (isSpeaking) return "bg-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)]";
        if (isListening) return "bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]";
        if (isThinking) return "bg-purple-500 animate-bounce";
        return "bg-gray-700";
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 pt-20 overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${conversationActive && (isListening || isSpeaking) ? 'opacity-20' : 'opacity-0'}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] 
                    ${isListening ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            </div>

            {/* Main Interaction Area */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-12">

                {/* Status Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Voice Assistant</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
                        {conversationActive ? "Interactive Mode" : "Tap to Activate"}
                    </p>
                </div>

                {/* Central Interactive Button */}
                <div className="relative flex items-center justify-center">
                    {/* Outer Ripples */}
                    {conversationActive && (isListening || isSpeaking) && (
                        <>
                            <div className={`absolute w-80 h-80 rounded-full border opacity-20 animate-[ping_2s_linear_infinite] delay-75 
                                ${isListening ? 'border-red-500' : 'border-blue-500'}`}></div>
                            <div className={`absolute w-64 h-64 rounded-full border opacity-30 animate-[ping_2s_linear_infinite] delay-150
                                ${isListening ? 'border-red-500' : 'border-blue-500'}`}></div>
                        </>
                    )}

                    {/* Main Circle Button */}
                    <button
                        onClick={toggleConversation}
                        className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-20 shadow-2xl hover:scale-105 active:scale-95 outline-none ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-900 focus:ring-4
                            ${getCoreColor()}
                            ${conversationActive ? '' : 'hover:bg-gray-600'}
                            `}
                        aria-label={conversationActive ? (isListening ? "Stop Listening" : "Stop Speaking") : "Start Conversation"}
                    >
                        {conversationActive && isSpeaking ? (
                            <Activity className="w-20 h-20 text-white animate-pulse" />
                        ) : (
                            <Mic className={`w-20 h-20 text-white transition-transform duration-300 ${conversationActive && isListening ? 'scale-110' : 'scale-100'}`} />
                        )}

                        {/* Internal Label for clarity */}
                        <span className="mt-2 text-white/80 text-xs font-semibold uppercase tracking-wider">
                            {!conversationActive ? "Start" : isListening ? "Stop" : "Interrupt"}
                        </span>
                    </button>
                </div>

                {/* Status & Helper Text */}
                <div className="text-center space-y-4">
                    <p className="text-2xl font-light text-gray-600 dark:text-gray-300 tracking-[0.1em] h-8">
                        {!conversationActive ? "Tap to Speak" :
                            isListening ? "Listening..." :
                                isSpeaking ? "SenseGuide Speaking..." :
                                    isThinking ? "Thinking..." :
                                        "Ready"}
                    </p>

                    <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-full inline-block">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Voice-only mode. No text responses.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AudioInterpretation;
