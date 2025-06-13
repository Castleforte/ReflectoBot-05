import React, { useRef, useEffect } from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface MyBadgesPageProps {
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  newlyEarnedBadgeId?: string | null;
}

function MyBadgesPage({ progress, onNextChallenge, newlyEarnedBadgeId }: MyBadgesPageProps) {
  const badgeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to newly earned badge and highlight it
  useEffect(() => {
    if (newlyEarnedBadgeId && badgeRefs.current[newlyEarnedBadgeId]) {
      const badgeElement = badgeRefs.current[newlyEarnedBadgeId];
      if (badgeElement) {
        setTimeout(() => {
          badgeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    }
  }, [newlyEarnedBadgeId]);

  return (
    <div className="my-badges-content">
      <div className="my-badges-header">
        <h1 className="my-badges-title">My Badges</h1>
        <div className="my-badges-header-right">
          <span id="badge-counter" className="badges-collected-indicator">{progress.badgeCount} of 18 Collected!</span>
          <button 
            className="next-challenge-header-button"
            onClick={onNextChallenge}
          >
            <img src="/My_Badges_Button_Icon.png" alt="Next Challenge" className="button-icon" />
            <span className="font-bold leading-none">Next Challenge</span>
          </button>
        </div>
      </div>

      <div className="badges-grid">
        {allBadges.map((badge) => {
          const isEarned = progress.badges[badge.id];
          const isNewlyEarned = badge.id === newlyEarnedBadgeId;
          
          return (
            <div 
              key={badge.id}
              ref={(el) => { badgeRefs.current[badge.id] = el; }}
              className={`badge-item ${isEarned ? 'badge-earned' : 'badge-unearned'} ${isNewlyEarned ? 'badge-newly-earned' : ''}`}
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
    </div>
  );
}

export default MyBadgesPage;