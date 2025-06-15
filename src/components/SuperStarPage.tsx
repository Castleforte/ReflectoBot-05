import React from 'react';
import { ReflectoBotProgress } from '../types';

interface SuperStarPageProps {
  progress: ReflectoBotProgress;
  onCollectBadge: () => void;
}

function SuperStarPage({ progress, onCollectBadge }: SuperStarPageProps) {
  return (
    <div className="next-challenge-content">
      <div className="next-challenge-header">
        <h1 className="next-challenge-title">🎉 You're a Super Star!</h1>
      </div>

      <div className="challenge-card">
        <div className="challenge-content">
          <h2 className="challenge-card-title">Incredible Achievement!</h2>
          
          <p className="challenge-card-description">
            You've completed every single challenge and earned all 17 badges! 
            That's absolutely amazing! ReflectoBot is so proud of you - you've shown incredible 
            dedication, creativity, and heart throughout this entire journey.
          </p>

          <div className="challenge-progress-indicator">
            <span className="challenge-progress-text">All 18 Badges Collected!</span>
          </div>

          <div className="challenge-buttons-container">
            <button 
              className="start-challenge-button"
              onClick={onCollectBadge}
            >
              Collect Your Badge
            </button>
          </div>
        </div>
        
        <img 
          src="/badges/SuperStar.png"
          alt="Super Star Badge"
          className="challenge-badge"
        />
      </div>

      <p className="challenge-helper-text">
        You're officially a Super Star! What an amazing accomplishment!
      </p>
    </div>
  );
}

export default SuperStarPage;