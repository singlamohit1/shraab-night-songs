import React, { useState, useEffect } from 'react';
import './HistoryBadge.css';

const HistoryBadge = ({ refreshTrigger }) => {
  const [lastDate, setLastDate] = useState(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('drinkingHistory');
    if (historyStr) {
      const history = JSON.parse(historyStr);
      if (history.length > 0) {
        // Find the most recent date that is NOT today, or just show the most recent
        // Actually, the user asked to show "last time you drank on <date>".
        // If they drank today, maybe we show today's date, or the previous one?
        // "last time you drank on <date>" implies the last recorded session.
        const lastSession = history[history.length - 1];
        
        // Format the date nicely
        const dateObj = new Date(lastSession.timestamp);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        setLastDate(dateObj.toLocaleDateString(undefined, options));
      }
    }
  }, [refreshTrigger]); // re-run when refreshTrigger changes

  if (!lastDate) return null;

  return (
    <div className="history-badge">
      <span className="icon">🍷</span>
      <span className="text">Last session: {lastDate}</span>
    </div>
  );
};

export default HistoryBadge;
