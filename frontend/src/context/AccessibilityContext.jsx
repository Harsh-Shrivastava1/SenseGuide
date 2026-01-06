import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [autoVoiceGuidance, setAutoVoiceGuidance] = useState(true);

    useEffect(() => {
        const root = document.documentElement;
        if (highContrast) {
            root.classList.add('high-contrast');
            root.classList.add('dark'); // Leverage Tailwind dark mode as well
        } else {
            root.classList.remove('high-contrast');
            root.classList.remove('dark');
        }
    }, [highContrast]);

    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const toggleLargeText = () => setLargeText(prev => !prev);
    const toggleAutoVoiceGuidance = () => setAutoVoiceGuidance(prev => !prev);

    return (
        <AccessibilityContext.Provider value={{
            highContrast, toggleHighContrast,
            largeText, toggleLargeText,
            autoVoiceGuidance, toggleAutoVoiceGuidance
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext);
