import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import './DrinkingPrompt.css';

const DrinkingPrompt = ({ onComplete }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const lastPromptDate = localStorage.getItem('lastPromptDate');
    const today = new Date().toLocaleDateString();
    
    // If today is not the last prompt date, show the prompt
    if (lastPromptDate !== today) {
      setShowPrompt(true);
    } else {
      onComplete(); // Already answered today
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYes = () => {
    const historyStr = localStorage.getItem('drinkingHistory');
    const history = historyStr ? JSON.parse(historyStr) : [];
    
    const today = new Date().toLocaleDateString();
    const newEntry = { date: today, timestamp: Date.now() };
    
    localStorage.setItem('drinkingHistory', JSON.stringify([...history, newEntry]));
    localStorage.setItem('lastPromptDate', today);
    
    posthog.capture('drinking_session_recorded', { date: today });
    setShowPrompt(false);
    onComplete();
  };

  const handleNo = () => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem('lastPromptDate', today);
    
    posthog.capture('drinking_session_declined', { date: today });
    setShowPrompt(false);
    onComplete();
  };

  if (!showPrompt) return null;

  return (
    <div className="prompt-overlay">
      <div className="prompt-modal">
        <h2>Is this your drinking night? 🥃</h2>
        <p>Set the mood and let's update your session history.</p>
        <div className="prompt-buttons">
          <button className="btn-yes" onClick={handleYes}>Yes, it is!</button>
          <button className="btn-no" onClick={handleNo}>Not today</button>
        </div>
      </div>
    </div>
  );
};

export default DrinkingPrompt;
