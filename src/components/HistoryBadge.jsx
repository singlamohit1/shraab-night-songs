import React, { useState, useEffect, useRef } from 'react';
import './HistoryBadge.css';

const HistoryBadge = ({ refreshTrigger }) => {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isTestHistory = searchParams?.get('testHistory') === '1';
  // Allow ?openHistory=0 to force-closed for testing, otherwise open by default
  const forceClosed = searchParams?.get('openHistory') === '0';

  const [history, setHistory] = useState(() => {
    if (isTestHistory) {
      return [
        { timestamp: 1757800000000, name: "gaa**masti", note: "fun" },
        { timestamp: 1757700000000, name: "", note: "" },
        { timestamp: 1757600000000, name: "", note: "" },
        { timestamp: 1757500000000, name: "", note: "" },
        { timestamp: 1757400000000, name: "", note: "chilling" },
      ];
    }
    return [];
  });

  // By default, past sessions is opened when history exists
  const [isOpen, setIsOpen] = useState(!forceClosed);
  const containerRef = useRef(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('drinkingHistory');
    if (historyStr) {
      try {
        const parsedHistory = JSON.parse(historyStr);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          // Reverse so the most recent is at the top of the list
          setHistory(parsedHistory.reverse());
        } else if (!isTestHistory) {
          setHistory([]);
        }
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, [refreshTrigger, isTestHistory]);

  if (history.length === 0) return null;

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  };

  return (
    <div className="history-badge-container" ref={containerRef}>
      <button 
        className={`history-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Collapse past sessions" : "View past drinking sessions"}
        aria-label={isOpen ? "Collapse past sessions" : "View past drinking sessions"}
        aria-expanded={isOpen}
      >
        <span className="history-icon">🍷</span>
        <span className="history-text-full">Past Sessions</span>
        <span className="history-count-pill">{history.length}</span>
        <svg 
          className={`history-chevron ${isOpen ? 'rotate' : ''}`} 
          width="13" 
          height="13" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="history-dropdown-menu">
          <div className="history-dropdown-header">
            <span className="header-title">🍷 Past Sessions</span>
            <div className="header-right-actions">
              <span className="header-badge">{history.length} total</span>
              <button 
                className="history-collapse-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                title="Collapse past sessions"
                aria-label="Collapse past sessions"
              >
                ✕
              </button>
            </div>
          </div>
          <ul className="history-panel-list">
            {history.slice(0, 5).map((session, idx) => (
              <li key={session.timestamp || idx}>
                <span className="history-idx">{history.length - idx}.</span>
                <div className="history-info">
                  <span className="history-date">
                    {session.name ? `${session.name} - ` : ''}{formatDate(session.timestamp)}
                  </span>
                  {session.note && <span className="history-note">{session.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryBadge;
