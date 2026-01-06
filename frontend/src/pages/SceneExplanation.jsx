import React, { useState, useRef, useEffect } from 'react';
import { Camera, Volume2, RotateCcw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useVoice } from '../context/VoiceContext';
import api from '../services/api';

const SceneExplanation = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    // Track if we just mounted to prevent double speaking if re-renders occur
    const mountedRef = useRef(false);

    const { speak } = useVoice();

    useEffect(() => {
        if (!mountedRef.current) {
            speak("Scene mode opened");
            mountedRef.current = true;
        }
        // Cleanup stream on unmount
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video to actually be ready to play
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setCameraActive(true);
                };
            }
        } catch (err) {
            console.error("Camera failed", err);
            speak("Camera access denied.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setCameraActive(false);
        }
    };

    const handleCameraClick = async () => {
        if (!cameraActive) {
            // First tap: Open Camera
            await startCamera();
            speak("Camera active. Tap again to capture.");
        } else {
            // Second tap: Capture
            captureAndAnalyze();
        }
    };

    const captureAndAnalyze = () => {
        if (!videoRef.current) return;

        speak("Capturing scene...");
        setLoading(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Ensure dimensions match
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw frame
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to Blob
        canvas.toBlob(async (blob) => {
            // Stop camera immediately after capture to freeze UX or just cleanup
            stopCamera();

            if (!blob) {
                setLoading(false);
                speak("Capture failed. Try again.");
                return;
            }

            const formData = new FormData();
            formData.append('image', blob, 'scene.jpg');

            console.log("Sending Scene API Request...");

            try {
                const data = await api.analyzeScene(formData);
                console.log("Scene API Response:", data);

                setResult(data);
                // Strict Success Requirement: Speak summary
                if (data.summary) {
                    speak(data.summary);
                } else if (data.description) {
                    speak(data.description);
                } else {
                    speak("Scene analyzed.");
                }

            } catch (error) {
                console.error("Scene Analysis Failed", error);
                // Strict Failure Requirement
                speak("azure is not working");
            } finally {
                setLoading(false);
            }
        }, 'image/jpeg');
    };

    const handleReplay = () => {
        if (result && (result.summary || result.description)) {
            speak(result.summary || result.description);
        }
    };

    const handleReset = () => {
        setResult(null);
        setCameraActive(false);
        // Do not auto-open camera, let user choose
        speak("Ready for new scene.");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col p-4 pt-24">
            <div className="text-center pb-6 space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Scene Explainer</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Capture your surroundings to hear a scene description</p>
                {cameraActive && <p className="text-red-500 animate-pulse font-bold">Live Camera Active</p>}
            </div>

            <div className="flex-grow flex flex-col items-center justify-start space-y-4 relative">

                {/* Video Preview */}
                {/* Always render video to keep ref alive, hide if inactive */}
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl max-h-[50vh] max-w-full aspect-[3/4] bg-black ${cameraActive ? 'block' : 'hidden'}`}>
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Main Interaction State: Ready or Camera Active */}
                {!loading && !result && (
                    <button
                        onClick={handleCameraClick}
                        className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-300 group relative overflow-hidden 
                        ${cameraActive ? 'bg-white ring-8 ring-red-500 hover:scale-105' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {cameraActive ? (
                            // Shutter Button Look
                            <div className="w-20 h-20 rounded-full bg-red-500"></div>
                        ) : (
                            <Camera className="w-12 h-12 text-white drop-shadow-md" />
                        )}
                    </button>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center space-y-4">
                        <LoadingSpinner />
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Analyzing Scene...</p>
                    </div>
                )}

                {/* Result State - NO TEXT OUTPUT as requested in "UX Improvements" -> "Do NOT add text output to the UI" */}
                {result && (
                    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-6 space-y-6 animate-slide-up">

                        {/* Visual indicator that result is ready, but no text. Maybe an icon? */}
                        <div className="flex justify-center">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                                <Volume2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleReplay}
                                className="flex-1 py-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <Volume2 className="w-6 h-6" /> Replay
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <RotateCcw className="w-6 h-6" /> New Scene
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SceneExplanation;
