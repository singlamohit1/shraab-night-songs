import React, { useState, useRef, useEffect } from 'react';
import { SCENES } from '../data/scenes';
import posthog from 'posthog-js';
import './SceneSelector.css';

const SceneSelector = ({ currentSceneId, onSelectScene }) => {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const [isOpen, setIsOpen] = useState(() => searchParams?.get('openScene') === '1');
  const containerRef = useRef(null);

  const activeScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (scene) => {
    onSelectScene(scene.id);
    posthog.capture('scene_switched', { scene: scene.id, name: scene.name });
    setIsOpen(false);
  };

  return (
    <div className="scene-selector-container" ref={containerRef}>
      <button 
        className={`scene-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Change ambient atmosphere"
        aria-label="Change ambient atmosphere"
        aria-expanded={isOpen}
      >
        <span className="scene-icon">{activeScene.icon}</span>
        <span className="scene-name">{activeScene.name}</span>
        <svg 
          className={`scene-chevron ${isOpen ? 'rotate' : ''}`} 
          width="14" 
          height="14" 
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
        <div className="scene-dropdown-menu">
          <div className="scene-dropdown-header">
            <span>Atmosphere</span>
            <span className="scene-header-sub">No music pause</span>
          </div>
          <div className="scene-options-list">
            {SCENES.map((scene) => {
              const isSelected = scene.id === currentSceneId;
              return (
                <button
                  key={scene.id}
                  className={`scene-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(scene)}
                >
                  <span className="option-icon">{scene.icon}</span>
                  <div className="option-text">
                    <span className="option-title">{scene.name}</span>
                  </div>
                  {isSelected && <span className="option-check">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneSelector;
