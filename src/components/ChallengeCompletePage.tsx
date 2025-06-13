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

  return (
    <div className="challenge-complete-content">
      <div className="challenge-complete-header">
        <h1 className="challenge-complete-title">Challenge Complete!</h1>
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
          That took focus, creativity, and heart – and you showed up. Keep going – little steps lead to big growth.
        </p>

        <div className="badge-progress-display">
          <span id="badge-counter" className="badge-progress-text">{progress.badgeCount} of 18 Collected!</span>
        </div>

        <div className="challenge-complete-buttons">
          <button 
            className="next-challenge-button"
            onClick={onNextChallenge}
          >
            Next Challenge
          </button>
          <button 
            className="my-badges-button"
            onClick={onMyBadges}
          >
            My Badges
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeCompletePage;