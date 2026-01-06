import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

import { AccessibilityProvider } from './context/AccessibilityContext';
import { VoiceProvider } from './context/VoiceContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <VoiceProvider>
                <AccessibilityProvider>
                    <App />
                </AccessibilityProvider>
            </VoiceProvider>
        </BrowserRouter>
    </React.StrictMode>
);
