import React, { useRef } from 'react';
import { Challenge, ReflectoBotProgress } from '../types';
import { exportProgress, importProgress } from '../utils/progressManager';

interface NextChallengePageProps {
  challenge: Challenge;
  onStartChallenge: () => void;
  onMyBadges: () => void;
  progress: ReflectoBotProgress;
  showGoalGetterCard: boolean;
  onCollectGoalGetterBadge: () => void;
}

function NextChallengePage({ 
  challenge, 
  onStartChallenge, 
  onMyBadges, 
  progress, 
  showGoalGetterCard,
  onCollectGoalGetterBadge
}: NextChallengePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remainingBadges = 18 - progress.badgeCount;
  const isActive = progress.challengeActive;

  const handleSaveProgress = () => {
    exportProgress();
  };

  const handleLoadProgress = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importProgress(file);
      } catch (error) {
        console.error('Error importing progress:', error);
        alert('Error loading progress file. Please check the file and try again.');
      }
    }
  };

  // Show special Goal Getter card if flag is set
  if (showGoalGetterCard) {
    return (
      <div className="next-challenge-content">
        <div className="next-challenge-header">
          <h1 className="next-challenge-title">You're a Goal Getter!</h1>
          <button 
            className="my-badges-button"
            onClick={onMyBadges}
          >
            <img src="/My_Badges_Button_Icon.png" alt="My Badges" className="button-icon" />
            <span className="font-bold leading-none">My Badges</span>
          </button>
        </div>

        <div className="challenge-card">
          <div className="challenge-content">
            <h2 className="challenge-card-title">Congratulations!</h2>
            
            <p className="challenge-card-description">
              You've completed the first five challenges! Way to go!
              Your determination and focus are truly impressive.
            </p>

            <div className="challenge-progress-indicator">
              <span className="challenge-progress-text">5 Challenges Complete!</span>
            </div>

            <div className="challenge-buttons-container">
              <button 
                className="start-challenge-button"
                onClick={onCollectGoalGetterBadge}
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

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  // Regular next challenge display
  return (
    <div className="next-challenge-content">
      <div className="next-challenge-header">
        <h1 className="next-challenge-title">
          {isActive ? 'Current Challenge' : 'Next Challenge'}
        </h1>
        <button 
          className="my-badges-button"
          onClick={onMyBadges}
        >
          <img src="/My_Badges_Button_Icon.png" alt="My Badges" className="button-icon" />
          <span className="font-bold leading-none">My Badges</span>
        </button>
      </div>

      <div className="challenge-card">
        <div className="challenge-content">
          <h2 className="challenge-card-title">{challenge.title}</h2>
          
          <p className="challenge-card-description">
            {challenge.description}
          </p>

          <div className="challenge-progress-indicator">
            <span className="challenge-progress-text">Just {remainingBadges} More To Go</span>
          </div>

          <div className="challenge-buttons-container">
            {isActive ? (
              <div className="challenge-started-indicator">
                Challenge Started — Good Luck!
              </div>
            ) : (
              <button 
                className="start-challenge-button"
                onClick={onStartChallenge}
              >
                Start Challenge
              </button>
            )}
          </div>
        </div>
        
        <img 
          src={`/badges/${challenge.badgeId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}.png`}
          alt={`${challenge.title} Badge`}
          className="challenge-badge"
        />
      </div>

      <p className="challenge-helper-text">
        Your badges save automatically. You can also save or load progress from the Settings page.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default NextChallengePage;