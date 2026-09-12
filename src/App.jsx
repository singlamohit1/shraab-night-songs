import React, { useState, useCallback } from 'react';
import MusicPlayer from './components/MusicPlayer';
import DrinkingPrompt from './components/DrinkingPrompt';
import HistoryBadge from './components/HistoryBadge';
import { songs, punjabiSongs } from './data/songs';
import posthog from 'posthog-js';
import './index.css';
import './index.css';

function App() {
  const [historyUpdated, setHistoryUpdated] = useState(0);
  const [playlistMode, setPlaylistMode] = useState('bollywood'); // 'bollywood' or 'punjabi'

  const handlePromptComplete = useCallback(() => {
    setHistoryUpdated(prev => prev + 1);
  }, []);

  return (
    <div className="app-container">
      <div className="brand-logo">shraab.fm</div>
      <div className="mode-toggle" style={{ 
        position: 'absolute', 
        top: '75px', 
        left: '25px', 
        zIndex: 10
      }}>
        {playlistMode === 'bollywood' ? (
          <button 
            onClick={() => {
              setPlaylistMode('punjabi');
              posthog.capture('mode_switched', { mode: 'punjabi' });
            }}
            style={{ 
              background: 'rgba(0, 0, 0, 0.6)', 
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            Switch to Punjabi 🕺🪩
          </button>
        ) : (
          <button 
            onClick={() => {
              setPlaylistMode('bollywood');
              posthog.capture('mode_switched', { mode: 'bollywood' });
            }}
            style={{ 
              background: 'rgba(0, 0, 0, 0.6)', 
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            Switch to Bollywood 🥃
          </button>
        )}
      </div>

      <div className="share-btn-container" style={{ 
        position: 'absolute', 
        top: '75px', 
        right: '25px', 
        zIndex: 10
      }}>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Shraab Night Songs',
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
            posthog.capture('site_shared');
          }}
          style={{ 
            background: 'rgba(0, 0, 0, 0.6)', 
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          Share
        </button>
      </div>

      <div 
        className="background-image-layer" 
        style={{ backgroundImage: `url('/bg.jpg')` }}
      ></div>
      <video 
        key={playlistMode}
        className="background-layer" 
        autoPlay 
        loop 
        muted 
        playsInline 
        src={playlistMode === 'bollywood' ? '/bg-bollywood.mp4' : '/bg-punjabi.mp4'}
      ></video>
      <div className="overlay"></div>
      
      <HistoryBadge refreshTrigger={historyUpdated} />

      <MusicPlayer key={playlistMode} playlistData={playlistMode === 'bollywood' ? songs : punjabiSongs} />
      <DrinkingPrompt onComplete={handlePromptComplete} />
    </div>
  );
}

export default App;
