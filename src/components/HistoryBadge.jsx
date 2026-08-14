import React, { useState, useEffect } from 'react';
import './HistoryBadge.css';

const HistoryBadge = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const historyStr = localStorage.getItem('drinkingHistory');
    if (historyStr) {
      try {
        const parsedHistory = JSON.parse(historyStr);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          // Reverse so the most recent is at the top of the list
          setHistory(parsedHistory.reverse());
        }
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, [refreshTrigger]);

  if (history.length === 0) return null;

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  };

  const lastDate = formatDate(history[0].timestamp);

  return (
    <div className="history-panel-container">
      <div className="history-panel-header">
        <span className="icon">🍷</span> Past Sessions
      </div>
      <ul className="history-panel-list">
        {history.map((session, idx) => (
          <li key={session.timestamp || idx}>
            <span className="history-idx">{history.length - idx}.</span>
            <div className="history-info">
              <span className="history-date">{formatDate(session.timestamp)}</span>
              {session.note && <span className="history-note">{session.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryBadge;
