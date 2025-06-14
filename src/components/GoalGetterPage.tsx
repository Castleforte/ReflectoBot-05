import React from 'react';
import { ReflectoBotProgress } from '../types';

interface GoalGetterPageProps {
  progress: ReflectoBotProgress;
  onCollectBadge: () => void;
}

function GoalGetterPage({ progress, onCollectBadge }: GoalGetterPageProps) {
  return (
    <div className="next-challenge-content">
      <div className="next-challenge-header">
        <h1 className="next-challenge-title">Congratulations!</h1>
      </div>

      <div className="challenge-card">
        <div className="challenge-content">
          <h2 className="challenge-card-title">You're a Goal Getter!</h2>
          
          <p className="challenge-card-description">
            You've earned the Goal Getter badge for completing your first 5 challenges!
            Your determination and focus are truly impressive.
          </p>

          <div className="challenge-progress-indicator">
            <span className="challenge-progress-text">5 Challenges Complete!</span>
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
          src="/badges/GoalGetter.png"
          alt="Goal Getter Badge"
          className="challenge-badge"
        />
      </div>

      <p className="challenge-helper-text">
        You're officially a Goal Getter! Keep up the amazing work!
      </p>
    </div>
  );
}

export default GoalGetterPage;