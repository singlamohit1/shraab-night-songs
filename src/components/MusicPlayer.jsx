import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { songs } from '../data/songs';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(() => Math.floor(Math.random() * songs.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState(null);
  
  const progressInterval = useRef(null);
  const currentSong = songs[currentSongIndex];

  // Options for the YouTube iframe
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1, // Auto-play the video on load
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
      startProgressLoop(event.target);
    } else {
      setIsPlaying(false);
      stopProgressLoop();
    }
    
    if (event.data === 0) {
      handleNext();
    }
  };

  const startProgressLoop = (ytPlayer) => {
    stopProgressLoop();
    progressInterval.current = setInterval(async () => {
      const time = await ytPlayer.getCurrentTime();
      const dur = await ytPlayer.getDuration();
      setCurrentTime(time);
      if (dur > 0) {
        setDuration(dur);
        setProgress((time / dur) * 100);
      }
    }, 1000);
  };

  const stopProgressLoop = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  useEffect(() => {
    return () => stopProgressLoop();
  }, []);

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    if (player && duration > 0) {
      const newTime = (newProgress / 100) * duration;
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="music-player-container">
      {/* Hidden YouTube Player */}
      <div style={{ position: 'absolute', opacity: 0, zIndex: -100, pointerEvents: 'none' }}>
        <YouTube 
          videoId={currentSong.youtubeId} 
          opts={opts} 
          onReady={onReady} 
          onStateChange={onStateChange} 
        />
      </div>
      
      <div className="player-content">
        <div className="song-info">
          <img src={currentSong.cover} alt="cover" className="cover-img" />
          <div className="details">
            <h3 className="song-title">{currentSong.title}</h3>
            <p className="song-artist">{currentSong.artist}</p>
          </div>
        </div>

        <div className="controls">
          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress-bar"
              value={progress || 0}
              onChange={handleProgressChange}
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
          
          <div className="buttons">
            <button className="control-btn" onClick={handlePrev}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
            </button>
            <button className="play-btn" onClick={togglePlayPause}>
              {isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              )}
            </button>
            <button className="control-btn" onClick={handleNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
