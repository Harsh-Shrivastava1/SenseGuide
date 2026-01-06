import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ObjectUnderstanding from './pages/ObjectUnderstanding';
import TextSimplification from './pages/TextSimplification';
import SceneExplanation from './pages/SceneExplanation';
import AudioInterpretation from './pages/AudioInterpretation';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/object" element={<ObjectUnderstanding />} />
            <Route path="/text" element={<TextSimplification />} />
            <Route path="/scene" element={<SceneExplanation />} />
            <Route path="/audio" element={<AudioInterpretation />} />
            {/* Settings and History to be implemented or just placeholders if needed, 
          but requirements didn't explicitly ask for page code for them in the detailed list, 
          just routes in the request. I'll add simple placeholders if visited. */}
            <Route path="/settings" element={<div className="text-center p-10 font-bold dark:text-white">Settings Page (Coming Soon)</div>} />
            <Route path="/history" element={<div className="text-center p-10 font-bold dark:text-white">History Page (Coming Soon)</div>} />
        </Routes>
    );
};

export default AppRouter;
