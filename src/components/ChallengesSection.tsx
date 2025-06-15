import React, { useState, useEffect } from 'react';
import NextChallengePage from './NextChallengePage';
import ChallengeCompletePage from './ChallengeCompletePage';
import MyBadgesPage from './MyBadgesPage';
import { loadProgress, updateProgress } from '../utils/progressManager';
import { challengeDetails, badgeQueue } from '../badgeData';
import { ReflectoBotProgress } from '../types';

interface ChallengesSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
  initialSubScreen?: 'next-challenge' | 'my-badges';
}

type ChallengeScreen = 'next-challenge' | 'challenge-complete' | 'my-badges' | 'all-complete';

function ChallengesSection({ 
  onClose, 
  setRobotSpeech, 
  initialSubScreen = 'next-challenge'
}: ChallengesSectionProps) {
  const [currentScreen, setCurrentScreen] = useState<ChallengeScreen>(initialSubScreen);
  const [progress, setProgress] = useState<ReflectoBotProgress>(loadProgress());
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null);

  // Listen for changes in initialSubScreen prop and update internal state
  useEffect(() => {
    // Check if all challenges are complete
    if (progress.badgeCount >= 18) {
      setCurrentScreen('all-complete');
    } else {
      setCurrentScreen(initialSubScreen);
    }
  }, [initialSubScreen, progress.badgeCount]);

  // Get the current challenge based on progress
  const getCurrentChallenge = () => {
    // Get the badge ID from the queue based on current index
    const currentBadgeId = badgeQueue[progress.currentChallengeIndex];
    if (!currentBadgeId) return null; // All challenges completed
    
    // Find the challenge details for this badge
    return challengeDetails.find(challenge => challenge.badgeId === currentBadgeId);
  };

  const currentChallenge = getCurrentChallenge();

  const handleStartChallenge = () => {
    if (!currentChallenge) return;
    
    // Activate the challenge - stay on the same page
    const updatedProgress = updateProgress({
      challengeActive: true
    });
    setProgress(updatedProgress);
    
    // Update robot speech based on challenge
    switch (currentChallenge.badgeId) {
      case 'calm_creator':
        setRobotSpeech("Time to get creative! Head to Draw It Out and create a beautiful drawing that shows how you're feeling.");
        break;
      case 'mood_mapper':
        setRobotSpeech("Time to explore your emotions! Head to Daily Check-In and track how you're feeling today.");
        break;
      case 'creative_spark':
        setRobotSpeech("Let's get creative! Go to Draw It Out and use lots of colors to express yourself.");
        break;
      case 'deep_thinker':
        setRobotSpeech("Time for some deep thinking! Go to Chat and share what's really on your mind.");
        break;
      case 'what_if_explorer':
        setRobotSpeech("Ready to explore your imagination? Check out the What If section and let your creativity soar!");
        break;
      case 'brave_voice':
        setRobotSpeech("Time to be brave and share your feelings! Use the word 'because' to explain how you're feeling.");
        break;
      case 'boost_buddy':
        setRobotSpeech("Let's try something fun! Go to What If and use the 'Read It to Me' button to hear a prompt out loud.");
        break;
      case 'reflecto_rookie':
        setRobotSpeech("Ready to start chatting? Go to Chat and share your thoughts with me. Remember, I need at least 2 messages from you!");
        break;
      case 'focus_finder':
        setRobotSpeech("Time to focus! Pick any section (Chat, Daily Check-In, What If, or Draw It Out) and stay there for at least 90 seconds while being active. No switching allowed!");
        break;
      case 'stay_positive':
        setRobotSpeech("Let's spread some positivity! Go to Chat and share at least 15 words about what makes you happy.");
        break;
      default:
        setRobotSpeech("Great choice! Go explore and complete your challenge. I believe in you!");
    }
  };

  const handleNextChallenge = () => {
    // Check if all challenges are complete
    if (progress.badgeCount >= 18) {
      setCurrentScreen('all-complete');
      setRobotSpeech("You've completed every single challenge! What an incredible achievement!");
    } else {
      setCurrentScreen('next-challenge');
      setNewlyEarnedBadge(null);
      setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
    }
  };

  const handleMyBadges = () => {
    setCurrentScreen('my-badges');
    setRobotSpeech(`Wow! You've already earned ${progress.badgeCount} badges! Just ${18 - progress.badgeCount} more to unlock the full set. Keep going!`);
  };

  const handleBackToNextChallenge = () => {
    // Check if all challenges are complete
    if (progress.badgeCount >= 18) {
      setCurrentScreen('all-complete');
      setRobotSpeech("You've completed every single challenge! What an incredible achievement!");
    } else {
      setCurrentScreen('next-challenge');
      setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
    }
  };

  // If all challenges are completed, show completion screen
  if (currentScreen === 'all-complete' || (!currentChallenge && progress.badgeCount >= 18)) {
    return (
      <div className="challenges-section">
        <div className="next-challenge-content">
          <div className="next-challenge-header">
            <h1 className="next-challenge-title">You've Completed All Challenges!</h1>
            <button 
              className="my-badges-button"
              onClick={handleMyBadges}
            >
              <img src="/My_Badges_Button_Icon.png" alt="My Badges" className="button-icon" />
              <span className="font-bold leading-none">My Badges</span>
            </button>
          </div>
          
          <div className="challenge-card">
            <div className="challenge-content">
              <h2 className="challenge-card-title">Congratulations, Super Star!</h2>
              <p className="challenge-card-description">
                You've earned all the badges and completed every ReflectoBot challenge! 
                That's a huge accomplishment that shows incredible dedication, creativity, and heart.
                <br /><br />
                Feel free to revisit any section to continue exploring your thoughts and feelings, 
                or start fresh by resetting your progress in Settings if you want to experience 
                the journey again!
              </p>
              <div className="challenge-buttons-container">
                <button 
                  className="start-challenge-button"
                  onClick={handleMyBadges}
                >
                  View All My Badges
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
            You're officially a ReflectoBot Super Star! What an amazing journey you've completed!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-section">
      {/* Regular next challenge page */}
      {currentScreen === 'next-challenge' && currentChallenge && (
        <NextChallengePage
          challenge={currentChallenge}
          onStartChallenge={handleStartChallenge}
          onMyBadges={handleMyBadges}
          progress={progress}
        />
      )}
      
      {currentScreen === 'challenge-complete' && newlyEarnedBadge && (
        <ChallengeCompletePage
          badgeId={newlyEarnedBadge}
          progress={progress}
          onNextChallenge={handleNextChallenge}
          onMyBadges={handleMyBadges}
        />
      )}
      
      {currentScreen === 'my-badges' && (
        <MyBadgesPage
          progress={progress}
          onNextChallenge={handleBackToNextChallenge}
          allChallengesComplete={progress.badgeCount >= 18}
        />
      )}
    </div>
  );
}

export default ChallengesSection;