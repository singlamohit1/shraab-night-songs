import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import './DrinkingPrompt.css';

const DrinkingPrompt = ({ onComplete }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const lastPromptDate = localStorage.getItem('lastPromptDate');
    const today = new Date().toLocaleDateString();
    
    const declinesKey = `promptDeclines_${today}`;
    const declinesCount = parseInt(localStorage.getItem(declinesKey) || '0', 10);
    
    // If they haven't said Yes today AND they haven't declined 2 times today, show prompt
    if (lastPromptDate !== today && declinesCount < 2) {
      setShowPrompt(true);
    } else {
      onComplete(); // Already answered Yes today or hit decline limit
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYes = () => {
    const historyStr = localStorage.getItem('drinkingHistory');
    let history = [];
    if (historyStr) {
      try {
        history = JSON.parse(historyStr);
        if (!Array.isArray(history)) history = [];
      } catch (e) {
        history = [];
      }
    }
    
    const today = new Date().toLocaleDateString();
    const newEntry = { date: today, timestamp: Date.now(), note: note.trim() };
    
    localStorage.setItem('drinkingHistory', JSON.stringify([...history, newEntry].slice(-10)));
    localStorage.setItem('lastPromptDate', today);
    
    posthog.capture('drinking_session_recorded', { date: today });
    setShowPrompt(false);
    onComplete();
  };

  const handleNo = () => {
    const today = new Date().toLocaleDateString();
    const declinesKey = `promptDeclines_${today}`;
    const currentDeclines = parseInt(localStorage.getItem(declinesKey) || '0', 10);
    localStorage.setItem(declinesKey, (currentDeclines + 1).toString());
    
    posthog.capture('drinking_session_declined', { date: today, declineCount: currentDeclines + 1 });
    setShowPrompt(false);
    onComplete();
  };

  if (!showPrompt) return null;

  return (
    <div className="prompt-overlay">
      <div className="prompt-modal">
        <h2>Is this your drinking night? 🥃</h2>
        <p>Set the mood and let's update your session history.</p>
        <input 
          type="text" 
          className="prompt-note-input"
          placeholder="What's the occasion? (optional)" 
          maxLength={50}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="prompt-buttons">
          <button className="btn-yes" onClick={handleYes}>Yes, it is!</button>
          <button className="btn-no" onClick={handleNo}>Not today</button>
        </div>
      </div>
    </div>
  );
};

export default DrinkingPrompt;
