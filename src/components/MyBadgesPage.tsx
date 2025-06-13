import React, { useRef, useEffect } from 'react';
import { allBadges } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface MyBadgesPageProps {
  progress: ReflectoBotProgress;
  onNextChallenge: () => void;
  newlyEarnedBadgeId?: string | null;
}

function MyBadgesPage({ progress, onNextChallenge, newlyEarnedBadgeId }: MyBadgesPageProps) {
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Handle highlighting and scrolling for newly earned badges
  useEffect(() => {
    if (newlyEarnedBadgeId && badgeRefs.current[newlyEarnedBadgeId]) {
      const badgeElement = badgeRefs.current[newlyEarnedBadgeId];
      
      // Scroll to the badge
      badgeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight class
      badgeElement.classList.add('badge-newly-earned-highlight');
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        badgeElement.classList.remove('badge-newly-earned-highlight');
      }, 3000);
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
          return (
            <div 
              key={badge.id}
              ref={el => badgeRefs.current[badge.id] = el}
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
    </div>
  );
}

export default MyBadgesPage;