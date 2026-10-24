import React, { useState, useRef } from 'react';
import posthog from 'posthog-js';
import { SCENES } from '../data/scenes';
import './VibeCardModal.css';

const VibeCardModal = ({ isOpen, onClose, currentSong, currentSceneId, playlistMode }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [vibeIndex, setVibeIndex] = useState(0);

  const activeScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];
  const vibesList = activeScene.vibes && activeScene.vibes.length > 0 
    ? activeScene.vibes 
    : ["Tonight's vibe 🥃 — old Bollywood, dim lights, no worries."];
  
  const currentVibe = vibesList[vibeIndex % vibesList.length];

  // Retrieve drinker name if present in localStorage
  let drinkerName = '';
  try {
    const historyStr = localStorage.getItem('drinkingHistory');
    if (historyStr) {
      const history = JSON.parse(historyStr);
      if (Array.isArray(history) && history.length > 0) {
        drinkerName = history[history.length - 1].name || '';
      }
    }
  } catch (e) {
    // Ignore parse error
  }

  if (!isOpen) return null;

  const songTitle = currentSong?.title || "Bollywood Classics";
  const songArtist = currentSong?.artist || "Timeless Melodies";
  const songThumb = currentSong?.youtubeId 
    ? `https://img.youtube.com/vi/${currentSong.youtubeId}/0.jpg` 
    : '/bg.jpg';

  const shareText = `${currentVibe}\n\n🎶 "${songTitle}" — ${songArtist}\n✨ Atmosphere: ${activeScene.name} ${activeScene.icon}\n🍸 Join the session: https://shraab.fm`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      posthog.capture('vibe_copied', { scene: activeScene.id, song: songTitle });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleNativeShare = async () => {
    posthog.capture('vibe_native_share_clicked', { scene: activeScene.id, song: songTitle });
    if (navigator.share) {
      try {
        await navigator.share({
          title: "shraab.fm vibe",
          text: shareText,
          url: "https://shraab.fm"
        });
        posthog.capture('vibe_native_share_success');
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyText();
    }
  };

  const cycleVibe = () => {
    setVibeIndex((prev) => prev + 1);
    posthog.capture('vibe_cycled');
  };

  const handleDownloadCard = () => {
    setIsGeneratingImage(true);
    posthog.capture('vibe_card_download_started', { scene: activeScene.id, song: songTitle });

    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const posterImg = new Image();
    posterImg.crossOrigin = 'anonymous';
    posterImg.src = activeScene.poster;

    const renderCanvas = () => {
      // 1. Dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0d17');
      bgGrad.addColorStop(0.5, '#141a29');
      bgGrad.addColorStop(1, '#07090e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw poster image if loaded with subtle tint
      if (posterImg.complete && posterImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.32;
        // Cover fit
        const scale = Math.max(width / posterImg.naturalWidth, height / posterImg.naturalHeight);
        const x = (width / 2) - (posterImg.naturalWidth / 2) * scale;
        const y = (height / 2) - (posterImg.naturalHeight / 2) * scale;
        ctx.drawImage(posterImg, x, y, posterImg.naturalWidth * scale, posterImg.naturalHeight * scale);
        ctx.restore();
      }

      // 3. Card Inner Border & Ambient Glow
      ctx.save();
      ctx.strokeStyle = 'rgba(252, 163, 17, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(50, 50, width - 100, height - 100, 36);
      ctx.stroke();

      // Subtle inner corner accents
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(70, 70, width - 140, height - 140, 24);
      ctx.stroke();
      ctx.restore();

      // 4. Header: shraab.fm logo
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 52px Outfit, sans-serif';
      ctx.fillText('shraab.fm', 100, 150);

      // Drinker Name tag if exists
      if (drinkerName) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '600 24px Outfit, sans-serif';
        ctx.fillText(`Session: ${drinkerName} 🥃`, 100, 195);
      }

      // Scene Badge pill
      ctx.save();
      const badgeText = `${activeScene.name} ${activeScene.icon}`;
      ctx.font = '600 26px Outfit, sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 48;
      const badgeX = width - 100 - badgeWidth;
      const badgeY = 110;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 54, 27);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fca311';
      ctx.fillText(badgeText, badgeX + 24, badgeY + 36);
      ctx.restore();

      // 5. Stylized Vibe Quote in Center
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 60px Outfit, sans-serif';
      ctx.textAlign = 'center';
      
      // Word wrap for quote
      const quoteMaxWidth = 860;
      const words = currentVibe.split(' ');
      let line = '';
      let quoteY = 460;
      
      // Quote opening mark
      ctx.fillStyle = 'rgba(252, 163, 17, 0.8)';
      ctx.font = '900 90px Outfit, sans-serif';
      ctx.fillText('“', width / 2, quoteY - 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 48px Outfit, sans-serif';

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > quoteMaxWidth && n > 0) {
          ctx.fillText(line.trim(), width / 2, quoteY);
          line = words[n] + ' ';
          quoteY += 72;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width / 2, quoteY);
      ctx.restore();

      // 6. Song Information Card near bottom
      const cardY = 880;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(100, cardY, width - 200, 230, 28);
      ctx.fill();
      ctx.stroke();

      // Song cover
      const coverSize = 140;
      const coverX = 145;
      const coverY = cardY + 45;

      // Draw cover placeholder
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.roundRect(coverX, coverY, coverSize, coverSize, 20);
      ctx.fill();

      // Text details
      const textX = coverX + coverSize + 35;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '600 24px Outfit, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('NOW PLAYING', textX, cardY + 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 38px Outfit, sans-serif';
      // Truncate title if long
      let displayTitle = songTitle;
      if (ctx.measureText(displayTitle).width > 520) {
        while (ctx.measureText(displayTitle + '...').width > 520 && displayTitle.length > 0) {
          displayTitle = displayTitle.slice(0, -1);
        }
        displayTitle += '...';
      }
      ctx.fillText(displayTitle, textX, cardY + 130);

      ctx.fillStyle = 'rgba(252, 163, 17, 0.9)';
      ctx.font = '500 30px Outfit, sans-serif';
      ctx.fillText(songArtist, textX, cardY + 175);
      ctx.restore();

      // 7. Footer Watermark
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '500 28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Join the vibe at shraab.fm 🥃', width / 2, height - 100);
      ctx.restore();

      // Trigger download
      const link = document.createElement('a');
      link.download = `shraab-vibe-${activeScene.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGeneratingImage(false);
      posthog.capture('vibe_card_downloaded', { scene: activeScene.id });
    };

    posterImg.onload = renderCanvas;
    posterImg.onerror = renderCanvas; // Fallback if image fails crossOrigin
  };

  return (
    <div className="vibe-modal-overlay" onClick={onClose}>
      <div className="vibe-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vibe-modal-header">
          <div className="vibe-header-title">
            <span className="vibe-sparkle">✨</span>
            <h3>Share Your Listening Vibe</h3>
          </div>
          <button className="vibe-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Live Vibe Card Preview */}
        <div 
          className="vibe-card-preview"
          style={{ backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.8), rgba(5, 8, 16, 0.9)), url(${activeScene.poster})` }}
        >
          <div className="vibe-card-header">
            <div className="vibe-brand">
              <span className="vibe-logo">shraab.fm</span>
              {drinkerName && <span className="vibe-drinker">{drinkerName} 🥃</span>}
            </div>
            <div className="vibe-scene-pill">
              <span>{activeScene.icon}</span>
              <span>{activeScene.name}</span>
            </div>
          </div>

          <div className="vibe-quote-area">
            <p className="vibe-quote-text">“{currentVibe}”</p>
            <button className="vibe-shuffle-btn" onClick={cycleVibe} title="Shuffle quote vibe">
              🎲 Change Vibe Line
            </button>
          </div>

          <div className="vibe-song-footer">
            <img 
              src={songThumb} 
              alt="Song Cover" 
              className="vibe-song-cover"
              onError={(e) => { e.target.src = '/bg.jpg'; }}
            />
            <div className="vibe-song-meta">
              <span className="vibe-now-playing">NOW PLAYING</span>
              <span className="vibe-song-title">{songTitle}</span>
              <span className="vibe-song-artist">{songArtist}</span>
            </div>
          </div>

          <div className="vibe-watermark">
            shraab.fm 🥃
          </div>
        </div>

        {/* Action Buttons */}
        <div className="vibe-actions">
          <button 
            className="vibe-action-btn primary-share"
            onClick={handleNativeShare}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share Vibe</span>
          </button>

          <button 
            className={`vibe-action-btn secondary-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyText}
          >
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button 
            className="vibe-action-btn secondary-btn"
            onClick={handleDownloadCard}
            disabled={isGeneratingImage}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{isGeneratingImage ? 'Saving...' : 'Save Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeCardModal;
