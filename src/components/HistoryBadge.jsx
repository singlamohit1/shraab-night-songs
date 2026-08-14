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
    <div 
      className="history-badge-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="history-badge">
        <span className="icon">🍷</span>
        <span className="text">Last: {lastDate} ({history.length} total)</span>
      </div>
      
      {isHovered && history.length > 0 && (
        <div className="history-dropdown">
          <div className="history-dropdown-header">Last {history.length} Sessions</div>
          <ul className="history-list">
            {history.map((session, idx) => (
              <li key={session.timestamp || idx}>
                <span className="history-idx">{history.length - idx}.</span>
                <span className="history-date">{formatDate(session.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryBadge;
