import React from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengeCompletePageProps {
  badgeId: string;
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  onMyBadges: () => void;
}

function ChallengeCompletePage({ badgeId, progress, onNextChallenge, onMyBadges }: ChallengeCompletePageProps) {
  const badge = allBadges.find(b => b.id === badgeId);
  
  if (!badge) return null;

  // Determine content based on badge type
  const isGoalGetter = badgeId === 'goal_getter';
  const isSuperStar = badgeId === 'super_star';
  
  const getTitle = () => {
    if (isGoalGetter) return "You've been awarded the Goal Getter badge!";
    if (isSuperStar) return "You've earned the Super Star badge!";
    return "Challenge Complete!";
  };

  const getMessage = () => {
    if (isGoalGetter) return "Congratulations! You've completed 5 challenges and earned the Goal Getter badge. Keep up the great work!";
    if (isSuperStar) return "Incredible! You've earned all 18 badges and are a true ReflectoBot Super Star!";
    return "That took focus, creativity, and heart – and you showed up. Keep going – little steps lead to big growth.";
  };

  const getButtonText = () => {
    if (isGoalGetter) return "Collect Your Badge";
    if (isSuperStar) return "View All Badges";
    return "Next Challenge";
  };

  const getButtonAction = () => {
    if (isGoalGetter || isSuperStar) return onMyBadges;
    return onNextChallenge;
  };

  return (
    <div className="challenge-complete-content">
      <div className="challenge-complete-header">
        <h1 className="challenge-complete-title">{getTitle()}</h1>
      </div>

      <div className="congratulations-section">
        <h2 className="congratulations-title">Congratulations!</h2>
        <h3 className="congratulations-subtitle">You've Earned a Badge!</h3>
        
        <div className="badge-display">
          <img 
            src={badge.colorIcon} 
            alt={badge.name}
            className="earned-badge-image"
          />
          <h4 className="badge-name">{badge.name}</h4>
        </div>

        <p className="congratulations-message">
          {getMessage()}
        </p>

        <div className="badge-progress-display">
          <span id="badge-counter" className="badge-progress-text">{progress.badgeCount} of 18 Collected!</span>
        </div>

        <div className="challenge-complete-buttons">
          <button 
            className="next-challenge-button"
            onClick={getButtonAction()}
          >
            {getButtonText()}
          </button>
          {!isGoalGetter && !isSuperStar && (
            <button 
              className="my-badges-button"
              onClick={onMyBadges}
            >
              My Badges
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeCompletePage;