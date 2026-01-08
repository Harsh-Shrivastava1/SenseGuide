import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import api from '../services/api';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
    // --- State ---
    const [isListening, setIsListening] = useState(false);
    const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
    const [lastCommand, setLastCommand] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    // NEW: Priority Flag
    const [isAudioMicActive, setIsAudioMicActive] = useState(false);

    // --- Refs ---
    const recognizerRef = useRef(null);
    const synthesizerRef = useRef(null);
    const playerRef = useRef(null);
    const isSpeakingRef = useRef(false);

    // --- Hooks ---
    const navigate = useNavigate();
    const location = useLocation();

    // --- Cleanup ---
    useEffect(() => {
        return () => {
            if (recognizerRef.current) recognizerRef.current.close();
            if (playerRef.current) playerRef.current.close();
            if (synthesizerRef.current) synthesizerRef.current.close();
        };
    }, []);

    // --- Initialization (Azure Only) ---
    const initSpeechServices = async () => {
        if (synthesizerRef.current && recognizerRef.current) return true;

        console.log("VC: Initializing Azure Speech (Strict Mode)...");
        try {
            const { token, region } = await api.getSpeechToken();
            const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(token, region);
            speechConfig.speechRecognitionLanguage = 'en-US';
            speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

            // Synthesizer Setup
            if (!playerRef.current) {
                playerRef.current = new speechsdk.SpeakerAudioDestination();
            }
            const synthAudioConfig = speechsdk.AudioConfig.fromSpeakerOutput(playerRef.current);
            synthesizerRef.current = new speechsdk.SpeechSynthesizer(speechConfig, synthAudioConfig);

            // Recognizer Setup
            const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

            // BARGE-IN: If speech detected while speaking, STOP speaking immediately.
            recognizer.recognizing = (s, e) => {
                if (isSpeakingRef.current) {
                    console.log("VC: Barge-in detected (recognizing) -> Stopping Speech");
                    stopSpeaking();
                }
            };

            recognizer.recognized = (s, e) => {
                if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                    const text = e.result.text;
                    console.log(`VC: Recognized '${text}'`);

                    // If we recognized text, definitely stop speaking (redundant but safe)
                    if (isSpeakingRef.current) stopSpeaking();

                    const normalized = text.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                    setLastCommand(normalized);
                    processCommand(normalized);
                }
            };

            recognizer.canceled = (s, e) => {
                console.log(`VC: Canceled ${e.reason}`);
                setIsListening(false);
            };

            recognizer.sessionStopped = () => setIsListening(false);
            recognizerRef.current = recognizer;

            return true;
        } catch (error) {
            console.error("VC: Initialization Failed", error);
            // FAIL-SAFE: Per requirement "Speak: Something went wrong"
            // But if init failed, we can't speak via Azure.
            // Requirement says "Kill Browser Speech APIs". 
            // We have a dilemma. If Azure fails, we are silent.
            // I will strictly follow "Azure Only".
            return false;
        }
    };

    // --- Core Actions ---

    // Helper to stop speech immediately (Barge-In)
    const stopSpeaking = () => {
        if (playerRef.current) {
            playerRef.current.pause(); // Stop audio output
            // We might want to clear the buffer or queue here if possible, 
            // but pause is the most effective immediate silence.
            // Resuming usually happens by new speak calls which creating new audio.
        }
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        console.log("VC: Speech Interrupted/Stopped");
    };

    const startListening = async () => {
        stopSpeaking(); // Interrupt any current speech
        setIsVoiceModeActive(true);
        const success = await initSpeechServices();
        if (success) {
            speak("Hello, I’m SenseGuide. I’m here to help you. You can say Scene, Object, Text, or Audio. I’m currently running in MVP mode. To know my use case say benifit");
            try {
                recognizerRef.current.startContinuousRecognitionAsync(() => {
                    setIsListening(true);
                });
            } catch (e) {
                console.error("VC: Start Mic Error", e);
            }
        } else {
            // Init failed
            console.error("VC: Voice start failed (Backend/Network).");
        }
    };

    const stopListening = () => {
        setIsVoiceModeActive(false);
        if (recognizerRef.current) {
            recognizerRef.current.stopContinuousRecognitionAsync(() => {
                setIsListening(false);
            });
        }
        speak("Voice mode stopped.");
    };

    // The Single Authority for Audio Output
    const speak = async (text, interrupt = true) => {
        if (!text) return;

        if (interrupt) stopSpeaking(); // Stop previous speech if interrupt is true

        // Ensure initialized
        if (!synthesizerRef.current) {
            const success = await initSpeechServices();
            if (!success) return; // Silent fail if Azure down
        }

        // Resume player if it was paused
        if (playerRef.current) {
            playerRef.current.resume();
        }

        setIsSpeaking(true);
        isSpeakingRef.current = true;
        console.log(`VC: Speaking -> "${text}"`);

        try {
            // ... rest of speak logic handles callback
            // We need to keep the callback logic to set isSpeaking false on complete

            synthesizerRef.current.speakTextAsync(
                text,
                (result) => {
                    if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
                        setIsSpeaking(false);
                        isSpeakingRef.current = false;
                    } else {
                        console.error("VC: Speech Synthesis Canceled/Failed", result.errorDetails);
                        setIsSpeaking(false);
                        isSpeakingRef.current = false;
                    }
                },
                (err) => {
                    console.error("VC: Speech Error", err);
                    setIsSpeaking(false);
                    isSpeakingRef.current = false;
                }
            );
        } catch (e) {
            console.error("VC: Speak Crash", e);
            setIsSpeaking(false);
        }
    };

    // Alias requirement
    const speakResponse = (text) => speak(text);

    // --- Navigation & Announcement ---

    const processCommand = (command) => {
        // PRIORITY CHECK: If Audio Page is strictly using mic, IGNORE global nav
        // We use a mutable ref check or state check. State is fine since it re-renders.
        // Wait, processCommand is captured in closure? No, it's called from recognized.
        // We need to access the LATEST value of isAudioMicActive.
        // Since `recognizer.recognized` is defined ONCE in init, it might capture stale state.
        // FIX: Use a ref for the priority flag to ensure fresh reads inside the callback.
        if (priorityRef.current) {
            console.log("VC: Global Nav Blocked (Audio Mic Active)");
            return;
        }

        const cmd = command.toLowerCase();

        // FIX: Home-Specific "Benefit" Command (High Priority)
        // usage of window.location.pathname avoids stale closure issues with react-router location
        const currentPath = window.location.pathname;
        const isHome = currentPath === '/' || currentPath === '/home';

        if (isHome && (cmd.includes("benefit") || cmd.includes("how can you help me"))) {
            speak("I can help you understand your surroundings using your camera and voice. I can describe scenes, identify objects, read printed text, and answer questions hands-free. SenseGuide is designed to support people with low vision with simple, voice-first assistance.");
            return;
        }
        if (cmd.includes("home")) { navigate('/'); return; }
        if (cmd.includes("scene")) { navigate('/scene'); return; }
        if (cmd.includes("object")) { navigate('/object'); return; }
        if (cmd.includes("text") || cmd.includes("read")) { navigate('/text'); return; }
        if (cmd.includes("benefits")) {
            speak("Here’s how I can help you. I can describe your surroundings so you know what’s in front of you. I can identify objects like bottles, phones, doors, or everyday items. I can read printed text such as books, notes, labels, or screens. I can act as a voice companion to answer questions and guide you calmly. You can use me at home, outside, or anywhere you need assistance. Just speak naturally, and I’ll guide you step by step.");
            return;
        }
        if (cmd.includes("audio") || (cmd.includes("ask") || cmd.includes("assistant"))) { navigate('/audio'); return; }
    };

    // Helper to keep ref synced with state
    const priorityRef = useRef(false);
    useEffect(() => { priorityRef.current = isAudioMicActive; }, [isAudioMicActive]);

    // Externally exposed setter that updates both
    const setAudioMicActive = (active) => {
        setIsAudioMicActive(active);
        priorityRef.current = active;
    };

    // Auto Page Announcement
    useEffect(() => {
        if (!isVoiceModeActive) return;

        const path = location.pathname;
        let message = "";

        if (path === '/' || path === '/home') message = "Home page opened";
        else if (path === '/scene') message = "Scene understanding mode";
        else if (path === '/object') message = "Object identification mode";
        else if (path === '/text') message = "Text reading mode";
        else if (path === '/audio') message = "Audio mode opened. Tap the microphone button to start talking with your voice companion.";

        if (message) {
            // Small timeout to allow page mount settled
            setTimeout(() => speak(message), 500);
        }

    }, [location.pathname, isVoiceModeActive]);

    return (
        <VoiceContext.Provider value={{
            isListening,
            isVoiceModeActive,
            startListening,
            stopListening,
            speak,
            speakResponse,
            lastCommand,
            isSpeaking,
            isAudioMicActive,
            setAudioMicActive,
            stopSpeaking
        }}>
            {children}
        </VoiceContext.Provider>
    );
};

export const useVoice = () => useContext(VoiceContext);
