import React, { useState, useCallback } from 'react';
import MusicPlayer from './components/MusicPlayer';
import DrinkingPrompt from './components/DrinkingPrompt';
import HistoryBadge from './components/HistoryBadge';
import './index.css';

function App() {
  const [historyUpdated, setHistoryUpdated] = useState(0);

  const handlePromptComplete = useCallback(() => {
    setHistoryUpdated(prev => prev + 1);
  }, []);

  return (
    <div className="app-container">
      <div className="brand-logo">shraab.fm</div>
      <div 
        className="background-image-layer" 
        style={{ backgroundImage: `url('/bg.jpg')` }}
      ></div>
      <video 
        className="background-layer" 
        autoPlay 
        loop 
        muted 
        playsInline 
        src="/bg.mp4"
      ></video>
      <div className="overlay"></div>
      
      <HistoryBadge refreshTrigger={historyUpdated} />

      <MusicPlayer />
      <DrinkingPrompt onComplete={handlePromptComplete} />
    </div>
  );
}

export default App;
