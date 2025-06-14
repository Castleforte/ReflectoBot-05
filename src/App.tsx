import React, { useState, useEffect } from 'react';
import MobileNavButtons from './components/MobileNavButtons';
import SettingsSection from './components/SettingsSection';
import ChatSection from './components/ChatSection';
import DailyCheckInSection from './components/DailyCheckInSection';
import WhatIfSection from './components/WhatIfSection';
import DrawItOutSection from './components/DrawItOutSection';
import ChallengesSection from './components/ChallengesSection';
import ChallengeCompletePage from './components/ChallengeCompletePage';
import GrownUpAccessModal from './components/GrownUpAccessModal';
import ChatHistoryModal from './components/ChatHistoryModal';
import MoodHistoryModal from './components/MoodHistoryModal';
import { ConversationTurn, MoodEntry, ReflectoBotProgress } from './types';
import { loadProgress, trackDailyVisit, updateProgress, checkAndUpdateBadges } from './utils/progressManager';
import { badgeQueue } from './badgeData';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges' | 'challenge-complete'>('welcome');
  const [challengesSubScreen, setChallengesSubScreen] = useState<'next-challenge' | 'my-badges'>('next-challenge');
  const [showGrownUpModal, setShowGrownUpModal] = useState(false);
  const [showChatHistoryModal, setShowChatHistoryModal] = useState(false);
  const [showMoodHistoryModal, setShowMoodHistoryModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ConversationTurn[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [progress, setProgress] = useState<ReflectoBotProgress>(loadProgress());
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null);
  const [pendingAwardedBadge, setPendingAwardedBadge] = useState<string | null>(null);
  const [showGoalGetterCard, setShowGoalGetterCard] = useState<boolean>(false);
  const [robotSpeech, setRobotSpeech] = useState<string>(
    "Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!"
  );

  // Focus Finder tracking state
  const [focusFinderMeaningfulActions, setFocusFinderMeaningfulActions] = useState(0);
  const [focusFinderStartTime, setFocusFinderStartTime] = useState<number | null>(null);
  const [focusFinderPage, setFocusFinderPage] = useState<string | null>(null);

  // Track daily visit on component mount
  useEffect(() => {
    const updatedProgress = trackDailyVisit();
    setProgress(updatedProgress);
    
    // Check for resilient badge after tracking daily visit
    handleBadgeEarned('resilient');
  }, []);

  // Function to check and award cumulative badges (Goal Getter and Super Star)
  const checkCumulativeBadges = () => {
    const currentProgress = loadProgress();
    
    // Check for Goal Getter badge (complete 5 challenges)
    if (currentProgress.challengesCompleted >= 5 && !currentProgress.badges['goal_getter']) {
      handleBadgeEarned('goal_getter');
      return; // Exit early to avoid checking Super Star in the same cycle
    }
    
    // Check for Super Star badge (earn all 17 other badges)
    if (currentProgress.badgeCount >= 17 && !currentProgress.badges['super_star']) {
      handleBadgeEarned('super_star');
    }
  };

  // Helper function to display pending badge completion page
  const handlePendingBadgeDisplay = () => {
    if (!pendingAwardedBadge) return false;

    const badgeToAward = pendingAwardedBadge;
    setNewlyEarnedBadge(badgeToAward);
    console.log('Challenge complete screen should show now');
    setCurrentScreen('challenge-complete');
    
    // Customize robot speech based on badge type
    if (badgeToAward === 'reflecto_rookie') {
      setRobotSpeech("Congratulations on your first message! You're now a Reflecto Rookie - welcome to the journey!");
    } else if (badgeToAward === 'super_star') {
      setRobotSpeech("Incredible! You've earned ALL the badges! You're officially a Super Star - what an amazing achievement!");
    } else {
      setRobotSpeech("Wow! You just earned a badge! That's amazing - you're doing such great work!");
    }
    
    // Update persistent progress for the pending badge (deactivate challenge, increment index)
    const currentProgress = loadProgress();
    const updatedProgress = {
      ...currentProgress,
      challengeActive: false,
      currentChallengeIndex: Math.min(currentProgress.currentChallengeIndex + 1, badgeQueue.length - 1)
    };
    updateProgress(updatedProgress);
    setProgress(updatedProgress); // Update local state
    
    // Reset pending badge
    setPendingAwardedBadge(null);
    
    // After handling pending badge, check for cumulative badges
    setTimeout(() => {
      checkCumulativeBadges();
    }, 100);

    return true; // Indicate that a pending badge was handled
  };

  // UPDATED BADGE LOGIC
const handleBadgeEarned = (badgeId: string) => {
    const currentProgress = loadProgress();
    
    // Update progress based on the badge type
    let updatedProgress = { ...currentProgress };
    
    switch (badgeId) {
      case 'calm_creator':
        updatedProgress.drawingsSaved = Math.max(updatedProgress.drawingsSaved, 1);
        break;
      case 'mood_mapper':
        updatedProgress.moodCheckInCount = Math.max(updatedProgress.moodCheckInCount, 3);
        break;
      case 'bounce_back':
        updatedProgress.undoCount = Math.max(updatedProgress.undoCount, 3);
        break;
      case 'reflecto_rookie':
        // Don't increment here - it's already handled in ChatSection
        break;
      case 'brave_voice':
        // Don't set badge directly - let checkAndUpdateBadges handle it
        break;
      case 'what_if_explorer':
        // Progress is already updated in WhatIfSection.tsx
        break;
      case 'truth_spotter':
        // Don't set badge directly - let checkAndUpdateBadges handle it
        break;
      case 'kind_heart':
        // Don't set badge directly - let checkAndUpdateBadges handle it
        break;
      case 'good_listener':
        updatedProgress.historyViews = Math.max(updatedProgress.historyViews, 3);
        break;
      case 'creative_spark':
        updatedProgress.colorsUsedInDrawing = Math.max(updatedProgress.colorsUsedInDrawing, 5);
        break;
      case 'deep_thinker':
        // Progress is already updated in ChatSection.tsx
        break;
      case 'boost_buddy':
        updatedProgress.readItToMeUsed = Math.max(updatedProgress.readItToMeUsed, 1);
        break;
      case 'focus_finder':
        updatedProgress.focusedChallengeCompleted = true;
        break;
      case 'stay_positive':
        // Progress is already updated in ChatSection.tsx
        break;
      case 'great_job':
        updatedProgress.pdfExportCount = Math.max(updatedProgress.pdfExportCount, 1);
        break;
      case 'resilient':
        // Progress is already updated by trackDailyVisit
        break;
      case 'goal_getter':
        // This badge is awarded based on challengesCompleted count
        break;
      case 'super_star':
        // This badge is awarded based on total badge count
        break;
    }

    // Save the updated progress
    updateProgress(updatedProgress);
    
    // Check if badge should be awarded
    const awardedBadgeId = checkAndUpdateBadges(badgeId, updatedProgress);
    
    if (awardedBadgeId) {
      // Special handling for Goal Getter badge - trigger the special card display
      if (awardedBadgeId === 'goal_getter') {
        setShowGoalGetterCard(true);
        setRobotSpeech("Wow, five badges already? You're officially a Goal Getter! I'll show you your special badge when you're ready!");
        setProgress(loadProgress()); // Refresh progress state
        return; // Exit early - badge will be shown via special card
      }
      
      // Special handling for Reflecto Rookie - make it pending to avoid interrupting chat
      if (awardedBadgeId === 'reflecto_rookie') {
        setPendingAwardedBadge(awardedBadgeId);
        setRobotSpeech("Great job sending your first message! I'll show you your badge when you're done chatting.");
        setProgress(loadProgress()); // Refresh progress state
        return; // Exit early - badge will be shown when user navigates away
      }
      
      // Special handling for Super Star - make it pending
      if (awardedBadgeId === 'super_star') {
        setPendingAwardedBadge(awardedBadgeId);
        setRobotSpeech("Incredible! You've earned ALL the badges! You're a Super Star! I'll show you your special badge when you're ready!");
        setProgress(loadProgress()); // Refresh progress state
        return; // Exit early - badge will be shown when user navigates away
      }
      
      // For all other badges, immediately show the complete page
      console.log("Attempting to set screen to 'challenge-complete' for badge:", awardedBadgeId);
      setNewlyEarnedBadge(awardedBadgeId);
      console.log('Challenge complete screen should show now');
      console.log("Attempting to set screen to 'challenge-complete' for badge:", awardedBadgeId);
      setCurrentScreen('challenge-complete');
      setRobotSpeech("Wow! You just earned a badge! That's amazing - you're doing such great work!");
      setProgress(loadProgress()); // Refresh progress state
    }
  };

  const handleMeaningfulAction = () => {
    const currentProgress = loadProgress();
    if (currentProgress.challengeActive && focusFinderPage === currentScreen) {
      setFocusFinderMeaningfulActions(prev => prev + 1);
    }
  };

  const checkFocusFinderConditions = () => {
    const currentProgress = loadProgress();
    if (currentProgress.challengeActive && 
        currentProgress.currentChallengeIndex === 4 && // focus_finder is at index 4
        focusFinderStartTime && 
        focusFinderPage === currentScreen &&
        focusFinderMeaningfulActions >= 3) {
      
      const timeSpent = Date.now() - focusFinderStartTime;
      if (timeSpent >= 90000) { // 90 seconds
        handleBadgeEarned('focus_finder');
      }
    }
  };

  const checkWhatIfExplorerConditions = () => {
    const currentProgress = loadProgress();
    if (currentProgress.challengeActive && 
        currentProgress.currentChallengeIndex === 8 && // what_if_explorer is at index 8
        currentProgress.whatIfPromptsAnswered >= 3) {
      handleBadgeEarned('what_if_explorer');
    }
  };

  const handleCollectGoalGetterBadge = () => {
    // Update persistent progress for the Goal Getter badge
    const currentProgress = loadProgress();
    const updatedProgress = {
      ...currentProgress,
      challengeActive: false,
      currentChallengeIndex: badgeQueue.indexOf('great_job'), // Move to great_job challenge
      challengesCompleted: currentProgress.challengesCompleted + 1,
      goalGetterAcknowledged: true
    };
    updateProgress(updatedProgress);
    setProgress(updatedProgress); // Update local state
    
    // Reset Goal Getter card display
    setShowGoalGetterCard(false);
    
    // Update robot speech
    setRobotSpeech(`Wow! You've already earned ${updatedProgress.badgeCount} badges! Just ${18 - updatedProgress.badgeCount} more to unlock the full set. Keep going!`);
    
    // Navigate to My Badges page
    handleMyBadgesFromApp();
  };

  const handleLogoClick = () => {
    // Check for pending badge awards first
    if (handlePendingBadgeDisplay()) {
      return; // Stop further navigation if a pending badge was displayed
    }

    checkFocusFinderConditions(); // Check before navigation
    checkWhatIfExplorerConditions(); // Check before navigation
    
    if (currentScreen === 'settings') {
      setCurrentScreen('welcome');
      setRobotSpeech("Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!");
    } else {
      setCurrentScreen('settings');
      setRobotSpeech("Tuning things just the way you like them? Smart move! You can save your session, adjust sounds-or even start fresh. Your ReflectoBot, your rules!");
    }
    
    // Reset Focus Finder tracking for new screen
    setFocusFinderMeaningfulActions(0);
    setFocusFinderStartTime(Date.now());
    setFocusFinderPage(currentScreen === 'settings' ? 'welcome' : 'settings');
  };

  const handleNavButtonClick = (screen: 'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges') => {
    // Check for pending badge awards first
    if (handlePendingBadgeDisplay()) {
      return; // Stop further navigation if a pending badge was displayed
    }

    checkFocusFinderConditions(); // Check before navigation
    checkWhatIfExplorerConditions(); // Check before navigation
    
    setCurrentScreen(screen);
    
    // Reset challenges sub-screen to next-challenge when navigating via sidebar
    if (screen === 'challenges') {
      setChallengesSubScreen('next-challenge');
    }
    
    // Reset Focus Finder tracking for new screen
    setFocusFinderMeaningfulActions(0);
    setFocusFinderStartTime(Date.now());
    setFocusFinderPage(screen);
    
    switch (screen) {
      case 'chat':
        setRobotSpeech("Ready to chat? I'm here to listen! You can use the prompts to get started, or just tell me what's on your mind. Let's explore your thoughts together!");
        break;
      case 'daily-checkin':
        setRobotSpeech("Time for your daily check-in! How are you feeling today? Pick an emoji that matches your mood, or just tell me what's going on.");
        break;
      case 'what-if':
        setRobotSpeech("Time to let your imagination soar! I've got some wild What If questions that'll get your creative wheels turning. Ready to think outside the box?");
        break;
      case 'draw-it-out':
        setRobotSpeech("Sometimes feelings are hard to explain with words—so let's draw them instead!");
        break;
      case 'challenges':
        setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
        break;
      case 'settings':
        setRobotSpeech("Tuning things just the way you like them? Smart move! You can save your session, adjust sounds-or even start fresh. Your ReflectoBot, your rules!");
        break;
      default:
        setRobotSpeech("Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!");
        break;
    }
  };

  const handleNextChallengeFromApp = () => {
    setCurrentScreen('challenges');
    setChallengesSubScreen('next-challenge');
    setNewlyEarnedBadge(null);
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
    
    // Check for cumulative badges after dismissing the completion page
    setTimeout(() => {
      checkCumulativeBadges();
    }, 100);
  };

  const handleMyBadgesFromApp = () => {
    setCurrentScreen('challenges');
    setChallengesSubScreen('my-badges');
    setNewlyEarnedBadge(null);
    // Navigate to My Badges page within challenges section
    setRobotSpeech(`Wow! You've already earned ${progress.badgeCount} badges! Just ${18 - progress.badgeCount} more to unlock the full set. Keep going!`);
    
    // Check for cumulative badges after dismissing the completion page
    setTimeout(() => {
      checkCumulativeBadges();
    }, 100);
  };

  const handleSectionClose = (sectionName: string) => {
    // Check for pending badge awards first
    if (handlePendingBadgeDisplay()) {
      return; // Stop further navigation if a pending badge was displayed
    }

    checkFocusFinderConditions(); // Check before closing
    checkWhatIfExplorerConditions(); // Check before closing
    
    setCurrentScreen('welcome');
    setRobotSpeech("Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!");
    
    // Reset Focus Finder tracking
    setFocusFinderMeaningfulActions(0);
    setFocusFinderStartTime(Date.now());
    setFocusFinderPage('welcome');
  };

  return (
    <div className="outer-container">
      <div className="app-wrapper">
        <div className="top-sections-container">
          {/* Sidebar - Only visible on desktop */}
          <div className="sidebar hidden lg:block">
            <div className="sidebar-content">
              <button 
                onClick={handleLogoClick}
                className="logo-button relative z-50"
              >
                <img 
                  src="/ReflectoBot_Logo_lrg_cutout_8bit.png"
                  alt="ReflectoBot Logo" 
                  className="w-[359px] h-auto mb-8 logo-offset-down"
                />
              </button>
              <div className="nav-buttons">
                <button 
                  className={`nav-button ${currentScreen === 'chat' ? 'nav-button-active' : ''}`}
                  onClick={() => handleNavButtonClick('chat')}
                >
                  <img src="/Chat-icon.png" alt="Chat" className="nav-button-icon" />
                  <span className="nav-button-text">Chat</span>
                </button>
                <button 
                  className={`nav-button ${currentScreen === 'daily-checkin' ? 'nav-button-active' : ''}`}
                  onClick={() => handleNavButtonClick('daily-checkin')}
                >
                  <img src="/Mood-icon.png" alt="Daily Check-In" className="nav-button-icon" />
                  <span className="nav-button-text nav-button-text-multiline">Daily<br />Check-In</span>
                </button>
                <button 
                  className={`nav-button ${currentScreen === 'what-if' ? 'nav-button-active' : ''}`}
                  onClick={() => handleNavButtonClick('what-if')}
                >
                  <img src="/Pencil-icon.png" alt="What If...?" className="nav-button-icon" />
                  <span className="nav-button-text max-lg:whitespace-normal max-lg:text-center">What If...?</span>
                </button>
                <button 
                  className={`nav-button ${currentScreen === 'draw-it-out' ? 'nav-button-active' : ''}`}
                  onClick={() => handleNavButtonClick('draw-it-out')}
                >
                  <img src="/Palette-icon.png" alt="Draw It Out" className="nav-button-icon" />
                  <span className="nav-button-text max-lg:whitespace-normal max-lg:text-center">Draw It<br />Out</span>
                </button>
                <button 
                  className={`nav-button ${currentScreen === 'challenges' ? 'nav-button-active' : ''}`}
                  onClick={() => handleNavButtonClick('challenges')}
                >
                  <img src="/Trophy-icon.png" alt="Challenges" className="nav-button-icon" />
                  <span className="nav-button-text">Challenges</span>
                </button>
                <button className="nav-button" onClick={() => handleNavButtonClick('welcome')}>
                  <img src="/Robot-icon.png" alt="My Bot" className="nav-button-icon" />
                  <span className="nav-button-text">My Bot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="flex justify-center items-center py-4 lg:hidden">
            <button 
              onClick={handleLogoClick}
              className="logo-button relative z-50"
            >
              <img 
                src="/ReflectoBot_Logo_lrg_cutout_8bit.png"
                alt="ReflectoBot Logo"
                className="w-4/5 h-auto"
              />
            </button>
          </div>

          {/* Robot and Speech Section */}
          <div className="robot-section">
            <div className="robot-frame-container">
              <img 
                src="/Robot_window_bubble copy.png"
                alt="Speech Bubble Frame" 
                className="frame-background"
              />
              <div className="speech-bubble">
                <p className="speech-text">
                  {robotSpeech}
                </p>
              </div>
              <img 
                src="/Reflekto-01.png"
                alt="Reflekto Robot Character" 
                className="robot-character"
              />
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        {currentScreen === 'settings' ? (
          <SettingsSection 
            onClose={() => handleSectionClose('settings')} 
            onShowGrownUpModal={() => setShowGrownUpModal(true)}
          />
        ) : currentScreen === 'chat' ? (
          <ChatSection 
            onClose={() => handleSectionClose('chat')}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            onShowChatHistory={() => setShowChatHistoryModal(true)}
            setRobotSpeech={setRobotSpeech}
            onBadgeEarned={handleBadgeEarned}
            onMeaningfulAction={handleMeaningfulAction}
          />
        ) : currentScreen === 'daily-checkin' ? (
          <DailyCheckInSection 
            onClose={() => handleSectionClose('daily-checkin')}
            setRobotSpeech={setRobotSpeech}
            moodHistory={moodHistory}
            setMoodHistory={setMoodHistory}
            onShowMoodHistory={() => setShowMoodHistoryModal(true)}
            onBadgeEarned={handleBadgeEarned}
            onMeaningfulAction={handleMeaningfulAction}
          />
        ) : currentScreen === 'what-if' ? (
          <WhatIfSection 
            onClose={() => handleSectionClose('what-if')}
            setRobotSpeech={setRobotSpeech}
            onBadgeEarned={handleBadgeEarned}
            onMeaningfulAction={handleMeaningfulAction}
          />
        ) : currentScreen === 'draw-it-out' ? (
          <DrawItOutSection 
            onClose={() => handleSectionClose('draw-it-out')}
            setRobotSpeech={setRobotSpeech}
            onBadgeEarned={handleBadgeEarned}
            onMeaningfulAction={handleMeaningfulAction}
          />
        ) : currentScreen === 'challenges' ? (
          <ChallengesSection 
            key={challengesSubScreen}
            onClose={() => handleSectionClose('challenges')}
            setRobotSpeech={setRobotSpeech}
            initialSubScreen={challengesSubScreen}
            showGoalGetterCard={showGoalGetterCard}
            setShowGoalGetterCard={setShowGoalGetterCard}
            onCollectGoalGetterBadge={handleCollectGoalGetterBadge}
          />
        ) : currentScreen === 'challenge-complete' && newlyEarnedBadge ? (
          <ChallengeCompletePage
            badgeId={newlyEarnedBadge}
            progress={progress}
            onNextChallenge={handleNextChallengeFromApp}
            onMyBadges={handleMyBadgesFromApp}
          />
        ) : (
          <div className="info-section">
            <div className="info-content">
              <h1 className="welcome-title">
                Welcome to ReflectoBot!
              </h1>
              <p className="welcome-subtitle">
                <span className="font-black">R</span>eflecting{' '}
                <span className="font-black">E</span>motions{' '}
                <span className="font-black">F</span>or{' '}
                <span className="font-black">L</span>earning,{' '}
                <span className="font-black">E</span>mpathy,{' '}
                <span className="font-black">C</span>reativity,{' '}
                <span className="font-black">T</span>hought &{' '}
                <span className="font-black">O</span>ptimism
              </p>
              <p className="text-2xl font-semibold mb-6 text-white tracking-wide md:text-3xl md:mb-8">Here's what you can do:</p>
              <ul className="features-list">
                <li className="feature-item">
                  <img src="/Chat-icon.png" alt="Chat" className="feature-icon" />
                  Chat with Reflekto anytime
                </li>
                <li className="feature-item">
                  <img src="/Mood-icon.png" alt="Daily Check-In" className="feature-icon" />
                  Check-In and share how you feel
                </li>
                <li className="feature-item">
                  <img src="/Pencil-icon.png" alt="What If...?" className="feature-icon" />
                  Answer fun What If...? questions
                </li>
                <li className="feature-item">
                  <img src="/Palette-icon.png" alt="Draw It Out" className="feature-icon" />
                  Draw It Out and express your emotions
                </li>
                <li className="feature-item">
                  <img src="/Trophy-icon.png" alt="Challenges" className="feature-icon" />
                  Complete Challenges to earn cool badges
                </li>
                <li className="feature-item">
                  <img src="/Robot-icon.png" alt="My Bot" className="feature-icon" />
                  Customize Your Bot and make it truly yours
                </li>
                <li className="feature-item">
                  <img src="/Save-icon.png" alt="Save" className="feature-icon" />
                  Save your session and return anytime!
                </li>
              </ul>
              <div className="settings-hint">
                <span className="text-[#a4f61e]">Want to save or change things? Tap the logo anytime for settings!</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Buttons - Now positioned after main content */}
        <MobileNavButtons onNavButtonClick={handleNavButtonClick} currentScreen={currentScreen} />
      </div>

      {/* Grown-Up Access Modal */}
      {showGrownUpModal && (
        <GrownUpAccessModal 
          onClose={() => setShowGrownUpModal(false)} 
          onBadgeEarned={handleBadgeEarned}
        />
      )}

      {/* Chat History Modal */}
      {showChatHistoryModal && (
        <ChatHistoryModal 
          onClose={() => setShowChatHistoryModal(false)} 
          chatHistory={chatMessages}
          onBadgeEarned={handleBadgeEarned}
        />
      )}

      {/* Mood History Modal */}
      {showMoodHistoryModal && (
        <MoodHistoryModal 
          onClose={() => setShowMoodHistoryModal(false)} 
          moodHistory={moodHistory}
          onBadgeEarned={handleBadgeEarned}
        />
      )}
    </div>
  );
}
// Debug: Triggering rebuild for badge award logic test
export default App;