import React, { useState, useCallback } from 'react';
import MusicPlayer from './components/MusicPlayer';
import DrinkingPrompt from './components/DrinkingPrompt';
import HistoryBadge from './components/HistoryBadge';
import SceneSelector from './components/SceneSelector';
import VibeCardModal from './components/VibeCardModal';
import { songs, punjabiSongs } from './data/songs';
import { SCENES } from './data/scenes';
import posthog from 'posthog-js';
import './index.css';

function App() {
  const [historyUpdated, setHistoryUpdated] = useState(0);
  const [playlistMode, setPlaylistMode] = useState('bollywood'); // 'bollywood' or 'punjabi'
  
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialScene = searchParams?.get('scene') || 'whiskey';
  const initialVibeOpen = searchParams?.get('openVibe') === '1';

  const [currentSceneId, setCurrentSceneId] = useState(initialScene);
  const [currentSong, setCurrentSong] = useState(null);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(initialVibeOpen);

  const activeScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];

  const handlePromptComplete = useCallback(() => {
    setHistoryUpdated(prev => prev + 1);
  }, []);

  const handleSongChange = useCallback((song) => {
    setCurrentSong(song);
  }, []);

  const handleModeSwitch = () => {
    const nextMode = playlistMode === 'bollywood' ? 'punjabi' : 'bollywood';
    setPlaylistMode(nextMode);
    posthog.capture('mode_switched', { mode: nextMode });
  };

  return (
    <div className="app-container">
      <div className="brand-logo">shraab.fm</div>

      {/* Top Left Controls: Mode Switch & Ambient Scene Selector */}
      <div className="top-toolbar-left">
        <button 
          className="mode-toggle-btn"
          onClick={handleModeSwitch}
        >
          {playlistMode === 'bollywood' ? 'Switch to Punjabi 🕺🪩' : 'Switch to Bollywood 🥃'}
        </button>

        <SceneSelector 
          currentSceneId={currentSceneId}
          onSelectScene={setCurrentSceneId}
        />
      </div>

      {/* Top Right Controls: History & Share Vibe */}
      <div className="top-toolbar-right">
        <HistoryBadge refreshTrigger={historyUpdated} />
        <button 
          className="share-vibe-btn"
          onClick={() => {
            setIsVibeModalOpen(true);
            posthog.capture('share_vibe_opened');
          }}
          title="Share your listening vibe"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span className="share-text-full">Share Vibe ✨</span>
          <span className="share-text-mobile">Share ✨</span>
        </button>
      </div>

      {/* Ambient Visual Background with smooth transitions */}
      <div 
        className="background-image-layer" 
        style={{ backgroundImage: `url('${activeScene.poster}')` }}
      ></div>
      <video 
        key={activeScene.id}
        className="background-layer" 
        autoPlay 
        loop 
        muted 
        playsInline 
        src={activeScene.video}
      ></video>
      <div className="overlay"></div>

      {/* Music Player - keeps running without interruption when switching atmosphere */}
      <MusicPlayer 
        key={playlistMode} 
        playlistData={playlistMode === 'bollywood' ? songs : punjabiSongs} 
        onSongChange={handleSongChange}
      />

      <DrinkingPrompt onComplete={handlePromptComplete} />

      {/* Share Vibe Card Modal */}
      <VibeCardModal 
        isOpen={isVibeModalOpen}
        onClose={() => setIsVibeModalOpen(false)}
        currentSong={currentSong}
        currentSceneId={currentSceneId}
        playlistMode={playlistMode}
      />

      {/* Footer / Founder Attribution */}
      <footer className="app-footer">
        <a 
          href="https://hiredvoices.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hiredvoices-link"
          onClick={() => {
            posthog.capture('hiredvoices_clicked', { source: 'footer_attribution', url: 'https://hiredvoices.com' });
          }}
        >
          <span className="footer-label">from the founder of</span>
          <span className="footer-brand">
            <img src="/hiredvoices-logo.png" alt="HiredVoices" className="hv-logo-img" />
            HiredVoices
          </span>
          <svg className="hv-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
