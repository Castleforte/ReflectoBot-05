import React from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface MyBadgesPageProps {
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  allChallengesComplete?: boolean;
}

function MyBadgesPage({ progress, onNextChallenge, allChallengesComplete = false }: MyBadgesPageProps) {
  return (
    <div className="my-badges-content">
      <div className="my-badges-header">
        <h1 className="my-badges-title">My Badges</h1>
        <div className="my-badges-header-right">
          <span id="badge-counter" className="badges-collected-indicator">{progress.badgeCount} of 18 Collected!</span>
          <button 
            className={`next-challenge-header-button ${allChallengesComplete ? 'disabled' : ''}`}
            onClick={onNextChallenge}
            disabled={allChallengesComplete}
            title={allChallengesComplete ? "You've completed all available challenges!" : "Go to next challenge"}
          >
            <img src="/My_Badges_Button_Icon.png" alt="Next Challenge" className="button-icon" />
            <span className="font-bold leading-none">
              {allChallengesComplete ? 'All Complete!' : 'Next Challenge'}
            </span>
          </button>
        </div>
      </div>

      <div className="badges-grid">
        {allBadges.map((badge) => {
          const isEarned = progress.badges[badge.id];
          return (
            <div 
              key={badge.id}
              className={`badge-item ${isEarned ? 'badge-earned' : 'badge-unearned'}`}
            >
              <img 
                src={badge.icon}
                alt={badge.name}
                className="badge-icon"
              />
              <span className="badge-label">{badge.name}</span>
            </div>
          );
        })}
      </div>

      {allChallengesComplete && (
        <div className="completion-message">
          <p className="text-center text-2xl font-bold text-[#a4f61e] mt-8">
            🎉 Congratulations! You've earned every single badge! 🎉
          </p>
          <p className="text-center text-lg text-white mt-4">
            You're officially a ReflectoBot Super Star!
          </p>
        </div>
      )}
    </div>
  );
}

export default MyBadgesPage;