import React from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengeCompletePageProps {
  badgeId: string;
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  onMyBadges: () => void;
  newlyEarnedBadgeId?: string | null;
}

function ChallengeCompletePage({ badgeId, progress, onNextChallenge, onMyBadges, newlyEarnedBadgeId }: ChallengeCompletePageProps) {
  const badge = allBadges.find(b => b.id === badgeId);
  
  if (!badge) return null;

  // Custom content for Goal Getter badge
  if (badgeId === 'goal_getter') {
    return (
      <div className="challenge-complete-content">
        <div className="challenge-complete-header">
          <h1 className="challenge-complete-title">You've been awarded the Goal Getter badge!</h1>
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
            Congratulations! You've completed 5 challenges and earned the Goal Getter badge. Keep up the great work!
          </p>

          <div className="badge-progress-display">
            <span id="badge-counter" className="badge-progress-text">{progress.badgeCount} of 18 Collected!</span>
          </div>

          <div className="challenge-complete-buttons">
            <button 
              className="next-challenge-button"
              onClick={onMyBadges}
            >
              Collect Your Badge
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

  // Custom content for Super Star badge
  if (badgeId === 'super_star') {
    return (
      <div className="challenge-complete-content">
        <div className="challenge-complete-header">
          <h1 className="challenge-complete-title">You've earned the Super Star badge!</h1>
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
            Incredible! You've earned all 18 badges and are a true ReflectoBot Super Star!
          </p>

          <div className="badge-progress-display">
            <span id="badge-counter" className="badge-progress-text">{progress.badgeCount} of 18 Collected!</span>
          </div>

          <div className="challenge-complete-buttons">
            <button 
              className="next-challenge-button"
              onClick={onMyBadges}
            >
              View All Badges
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

  // Default content for all other badges
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