import React, { useState, useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import './HistoryBadge.css';

const HistoryBadge = ({ refreshTrigger }) => {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isTestHistory = searchParams?.get('testHistory') === '1';
  // Allow ?openHistory=0 to force-closed for testing, otherwise open by default
  const forceClosed = searchParams?.get('openHistory') === '0';
  const testConfirmClear = searchParams?.get('confirmClear') === '1';

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
  const [showConfirmClear, setShowConfirmClear] = useState(testConfirmClear);
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

  const handleClearHistory = () => {
    localStorage.removeItem('drinkingHistory');
    posthog.capture('drinking_history_cleared', { total_sessions: history.length });
    setHistory([]);
    setIsOpen(false);
    setShowConfirmClear(false);
  };

  return (
    <div className="history-badge-container" ref={containerRef}>
      <button 
        className={`history-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setShowConfirmClear(false);
        }}
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
                  setShowConfirmClear(false);
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

          {showConfirmClear ? (
            <div className="history-confirm-clear">
              <div className="confirm-warning-icon">⚠️</div>
              <div className="confirm-warning-text">
                <strong>Clear all {history.length} sessions?</strong>
                <span>This cannot be undone.</span>
              </div>
              <div className="confirm-buttons">
                <button 
                  className="confirm-btn-delete"
                  onClick={handleClearHistory}
                >
                  Delete all
                </button>
                <button 
                  className="confirm-btn-cancel"
                  onClick={() => setShowConfirmClear(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="history-dropdown-footer">
              <button 
                className="history-clear-trigger-btn"
                onClick={() => setShowConfirmClear(true)}
                title="Clear all drinking history"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Clear history</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryBadge;
