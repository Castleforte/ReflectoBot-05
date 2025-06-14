import React from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengeCompletePageProps {
  badgeId: string;
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  onMyBadges: () => void;
  onCollectGoalGetterBadge?: () => void;
}

function ChallengeCompletePage({ badgeId, progress, onNextChallenge, onMyBadges, onCollectGoalGetterBadge }: ChallengeCompletePageProps) {
  const badge = allBadges.find(b => b.id === badgeId);
  
  if (!badge) return null;

  // Special handling for Goal Getter badge
  if (badgeId === 'goal_getter') {
    return (
      <div className="challenge-complete-content">
        <div className="challenge-complete-header">
          <h1 className="challenge-complete-title">You're a Goal Getter!</h1>
        </div>

        <div className="congratulations-section">
          <h2 className="congratulations-title">Congratulations!</h2>
          <h3 className="congratulations-subtitle">You've Completed Your First 5 Challenges!</h3>
          
          <div className="badge-display">
            <img 
              src={badge.colorIcon} 
              alt={badge.name}
              className="earned-badge-image"
            />
            <h4 className="badge-name">{badge.name}</h4>
          </div>

          <p className="congratulations-message">
            Way to go! Your determination and focus are truly impressive. You've shown real commitment to your growth journey.
          </p>

          <div className="badge-progress-display">
            <span id="badge-counter" className="badge-progress-text">{progress.badgeCount} of 18 Collected!</span>
          </div>

          <div className="challenge-complete-buttons">
            <button 
              className="next-challenge-button"
              onClick={() => {
                if (onCollectGoalGetterBadge) {
                  onCollectGoalGetterBadge();
                }
              }}
            >
              Claim My Badge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular badge completion page
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
            className="my-badges-button text-2xl font-bold"
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