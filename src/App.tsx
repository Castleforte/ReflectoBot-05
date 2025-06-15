import React, { useState, useEffect } from 'react';
import MobileNavButtons from './components/MobileNavButtons';
import SettingsSection from './components/SettingsSection';
import ChatSection from './components/ChatSection';
import DailyCheckInSection from './components/DailyCheckInSection';
import WhatIfSection from './components/WhatIfSection';
import DrawItOutSection from './components/DrawItOutSection';
import ChallengesSection from './components/ChallengesSection';
import ChallengeCompletePage from './components/ChallengeCompletePage';
import GoalGetterPage from './components/GoalGetterPage';
import SuperStarPage from './components/SuperStarPage';
import GrownUpAccessModal from './components/GrownUpAccessModal';
import ChatHistoryModal from './components/ChatHistoryModal';
import MoodHistoryModal from './components/MoodHistoryModal';
import { ConversationTurn, MoodEntry, ReflectoBotProgress } from './types';
import { 
  loadProgress, 
  trackDailyVisit, 
  updateProgress, 
  awardBadge,
  checkBadgeCondition,
  startFocusTracking,
  trackFocusEngagement,
  checkFocusFinderCompletion,
  trackSectionVisit,
  saveProgress
} from './utils/progressManager';
import { badgeQueue } from './badgeData';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges' | 'challenge-complete' | 'goal-getter' | 'super-star'>('welcome');
  const [challengesSubScreen, setChallengesSubScreen] = useState<'next-challenge' | 'my-badges'>('next-challenge');
  const [showGrownUpModal, setShowGrownUpModal] = useState(false);
  const [showChatHistoryModal, setShowChatHistoryModal] = useState(false);
  const [showMoodHistoryModal, setShowMoodHistoryModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ConversationTurn[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [progress, setProgress] = useState<ReflectoBotProgress>(loadProgress());
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null);
  const [robotSpeech, setRobotSpeech] = useState<string>(
    "Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!"
  );

  // Track daily visit on component mount
  useEffect(() => {
    const updatedProgress = trackDailyVisit();
    setProgress(updatedProgress);
  }, []);

  // Handle section navigation and tracking
  const handleSectionEnter = (section: string) => {
    console.log(`🚀 Entering section: ${section}`);
    
    // Track section visit for resilient badge
    trackSectionVisit(section);
    
    // Start focus tracking if applicable
    startFocusTracking(section);
    
    // Update progress state
    setProgress(loadProgress());
  };

  // Handle section exit and check for pending badges - RETURNS BOOLEAN
  const handleSectionExit = (fromSection: string): boolean => {
    console.log(`🚪 Exiting section: ${fromSection}`);
    
    const currentProgress = loadProgress();
    console.log('📊 Current progress on exit:', {
      challengeActive: currentProgress.challengeActive,
      currentChallengeIndex: currentProgress.currentChallengeIndex,
      currentBadge: badgeQueue[currentProgress.currentChallengeIndex],
      challengesCompleted: currentProgress.challengesCompleted
    });
    
    let badgeToAward: string | null = null;
    
    // Check Focus Finder completion if leaving a tracked page
    if (currentProgress.focusPage === fromSection && checkFocusFinderCompletion()) {
      console.log('✅ Focus Finder completed!');
      badgeToAward = 'focus_finder';
    }
    
    // ✅ NEW: Check for final 4 badges that need award screens
    if (!badgeToAward && currentProgress.challengeActive) {
      const currentBadgeId = badgeQueue[currentProgress.currentChallengeIndex];
      console.log(`🔍 Checking badge condition for: ${currentBadgeId}`);
      
      // ✅ FIXED: Check specific conditions for final 4 badges
      if (currentBadgeId === 'good_listener' && 
          currentProgress.hasVisitedChatHistory && 
          currentProgress.hasVisitedMoodHistory &&
          !currentProgress.badges['good_listener']) {
        console.log('✅ Good Listener badge condition met!');
        badgeToAward = 'good_listener';
      }
      else if (currentBadgeId === 'creative_spark' && 
               fromSection === 'draw-it-out' &&
               currentProgress.colorsUsedInDrawing >= 5 &&
               !currentProgress.badges['creative_spark']) {
        console.log('✅ Creative Spark badge condition met!');
        badgeToAward = 'creative_spark';
      }
      else if (currentBadgeId === 'deep_thinker' && 
               fromSection === 'chat' &&
               currentProgress.hasLongMessageSent &&
               !currentProgress.badges['deep_thinker']) {
        console.log('✅ Deep Thinker badge condition met!');
        badgeToAward = 'deep_thinker';
      }
      else if (currentBadgeId === 'resilient' && 
               currentProgress.visitedSections.length >= 4 &&
               !currentProgress.badges['resilient']) {
        console.log('✅ Resilient badge condition met!');
        badgeToAward = 'resilient';
      }
      // Check for current challenge badge completion (for other badges)
      else if (currentBadgeId && checkBadgeCondition(currentBadgeId, loadProgress())) {
        console.log(`✅ Badge condition met for: ${currentBadgeId}`);
        badgeToAward = currentBadgeId;
      }
    }
    
    // Check resilient badge (visit all 4 sections) - fallback check
    if (!badgeToAward) {
      const updatedProgress = loadProgress();
      if (updatedProgress.visitedSections.length >= 4 && 
          updatedProgress.challengeActive && 
          badgeQueue[updatedProgress.currentChallengeIndex] === 'resilient') {
        console.log('✅ Resilient badge condition met!');
        badgeToAward = 'resilient';
      }
    }
    
    // Award badge and show congratulations screen
    if (badgeToAward) {
      console.log(`🏆 Awarding badge: ${badgeToAward}`);
      console.log(`✅ Showing Congrats screen for: ${badgeToAward}`);
      
      const finalProgress = awardBadge(badgeToAward);
      setProgress(finalProgress);
      setNewlyEarnedBadge(badgeToAward);
      setCurrentScreen('challenge-complete');
      
      // ✅ FIXED: Set appropriate robot speech for final 4 badges
      switch (badgeToAward) {
        case 'good_listener':
          setRobotSpeech("Wow! You just earned the Good Listener badge! You're such a thoughtful person for reflecting on your journey!");
          break;
        case 'creative_spark':
          setRobotSpeech("Amazing! You just earned the Creative Spark badge! Your colorful creativity is absolutely brilliant!");
          break;
        case 'deep_thinker':
          setRobotSpeech("Incredible! You just earned the Deep Thinker badge! Your thoughtful words show real wisdom!");
          break;
        case 'resilient':
          setRobotSpeech("Outstanding! You just earned the Resilient badge! You've shown amazing dedication by exploring every section!");
          break;
        default:
          setRobotSpeech("Wow! You just earned a badge! That's amazing - you're doing such great work!");
          break;
      }
      
      return true; // ✅ BADGE WAS AWARDED - STOP NAVIGATION
    } else {
      console.log('❌ No badge to award on exit');
      return false; // ❌ NO BADGE - CONTINUE NAVIGATION
    }
  };

  // Handle engagement tracking
  const handleEngagement = () => {
    trackFocusEngagement();
  };

  // Handle immediate badge triggers (for content-based badges like brave_voice, truth_spotter)
  const handleBadgeEarned = (badgeId: string) => {
    const currentProgress = loadProgress();
    
    console.log(`🎯 Badge earned trigger: ${badgeId}`);
    console.log('Challenge active:', currentProgress.challengeActive);
    console.log('Current challenge index:', currentProgress.currentChallengeIndex);
    
    // Only process if challenge is active
    if (!currentProgress.challengeActive) {
      console.log('❌ No active challenge, ignoring badge trigger');
      return;
    }
    
    const expectedBadgeId = badgeQueue[currentProgress.currentChallengeIndex];
    console.log('Expected badge:', expectedBadgeId);
    
    if (badgeId !== expectedBadgeId) {
      console.log('❌ Badge does not match expected challenge, ignoring');
      return;
    }
    
    // For content-based badges that should be awarded immediately when detected
    if (badgeId === 'brave_voice' || badgeId === 'truth_spotter' || badgeId === 'good_listener') {
      console.log(`🏆 Content-based badge detected: ${badgeId} - will award on section exit`);
      // These will be caught by the section exit logic
    }
  };

  // ✅ FIXED: Handle modal close with Good Listener badge check
  const handleModalClose = (modalType: 'chat' | 'mood') => {
    console.log(`🚪 Closing ${modalType} history modal`);
    
    // Close the modal first
    if (modalType === 'chat') {
      setShowChatHistoryModal(false);
    } else {
      setShowMoodHistoryModal(false);
    }
    
    // Check if Good Listener badge should be awarded after closing modal
    const currentProgress = loadProgress();
    
    console.log('📖 Good Listener check on modal close:', {
      challengeActive: currentProgress.challengeActive,
      currentChallengeIndex: currentProgress.currentChallengeIndex,
      expectedBadge: badgeQueue[currentProgress.currentChallengeIndex],
      hasVisitedChatHistory: currentProgress.hasVisitedChatHistory,
      hasVisitedMoodHistory: currentProgress.hasVisitedMoodHistory
    });
    
    // Only award if Good Listener challenge is active and both histories have been visited
    if (currentProgress.challengeActive && 
        badgeQueue[currentProgress.currentChallengeIndex] === 'good_listener' &&
        currentProgress.hasVisitedChatHistory && 
        currentProgress.hasVisitedMoodHistory &&
        !currentProgress.badges['good_listener']) {
      
      console.log('✅ Good Listener badge condition met - awarding badge');
      
      const finalProgress = awardBadge('good_listener');
      setProgress(finalProgress);
      setNewlyEarnedBadge('good_listener');
      setCurrentScreen('challenge-complete');
      setRobotSpeech("Wow! You just earned the Good Listener badge! You're such a thoughtful person for reflecting on your journey!");
    }
  };

  const handleLogoClick = () => {
    // ✅ CRITICAL FIX: Check if we're on any award screen and bypass all badge logic
    const isOnAwardScreen = currentScreen === 'challenge-complete' || currentScreen === 'goal-getter' || currentScreen === 'super-star';
    
    if (isOnAwardScreen) {
      console.log('🚫 On award screen - forcing navigation to settings without any badge checks');
      setCurrentScreen('settings');
      setNewlyEarnedBadge(null); // Clear any pending badge
      setRobotSpeech("Tuning things just the way you like them? Smart move! You can save your session, adjust sounds-or even start fresh. Your ReflectoBot, your rules!");
      return;
    }
    
    // ✅ CHECK FOR BADGE AWARD FIRST - STOP IF BADGE AWARDED
    const badgeAwarded = handleSectionExit(currentScreen);
    if (badgeAwarded) {
      console.log('🛑 Badge awarded - stopping logo navigation');
      return; // ✅ CRITICAL: STOP HERE IF BADGE WAS AWARDED
    }
    
    // ✅ ONLY CONTINUE IF NO BADGE WAS AWARDED
    if (currentScreen === 'settings') {
      setCurrentScreen('welcome');
      setRobotSpeech("Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!");
    } else {
      setCurrentScreen('settings');
      setRobotSpeech("Tuning things just the way you like them? Smart move! You can save your session, adjust sounds-or even start fresh. Your ReflectoBot, your rules!");
    }
  };

  const handleNavButtonClick = (screen: 'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges') => {
    // ✅ CRITICAL FIX: Check if we're on any award screen and bypass all badge logic
    const isOnAwardScreen = currentScreen === 'challenge-complete' || currentScreen === 'goal-getter' || currentScreen === 'super-star';
    
    if (isOnAwardScreen) {
      console.log('🚫 On award screen - forcing navigation without any badge checks');
      setCurrentScreen(screen);
      setNewlyEarnedBadge(null); // Clear any pending badge
      handleSectionEnter(screen);
      
      // Reset challenges sub-screen to next-challenge when navigating via sidebar
      if (screen === 'challenges') {
        setChallengesSubScreen('next-challenge');
      }
      
      // Set appropriate robot speech
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
      return;
    }
    
    // ✅ CHECK FOR BADGE AWARD FIRST - STOP IF BADGE AWARDED
    const badgeAwarded = handleSectionExit(currentScreen);
    if (badgeAwarded) {
      console.log('🛑 Badge awarded - stopping navigation');
      return; // ✅ CRITICAL: STOP HERE IF BADGE WAS AWARDED
    }
    
    // ✅ ONLY CONTINUE IF NO BADGE WAS AWARDED
    setCurrentScreen(screen);
    handleSectionEnter(screen);
    
    // Reset challenges sub-screen to next-challenge when navigating via sidebar
    if (screen === 'challenges') {
      setChallengesSubScreen('next-challenge');
    }
    
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

  // 🎯 FIXED: Handle Next Challenge button with direct Goal Getter and Super Star checks
  const handleNextChallengeFromApp = () => {
    console.log('🎯 Next Challenge clicked');
    
    // ✅ NEW: Check for Super Star after Resilient
    if (newlyEarnedBadge === 'resilient') {
      console.log('🌟 Resilient just completed — checking for Super Star');
      
      const progress = loadProgress();
      
      // Count all badges except super_star itself
      const otherBadgeCount = Object.keys(progress.badges).filter(id => 
        id !== 'super_star' && progress.badges[id]
      ).length;
      
      console.log(`🌟 Super Star check: ${otherBadgeCount}/17 badges earned`);
      
      if (otherBadgeCount >= 17 && !progress.badges['super_star']) {
        console.log('⭐ Super Star condition met - awarding badge');
        awardBadge('super_star');
        setNewlyEarnedBadge(null);
        setCurrentScreen('super-star');
        setRobotSpeech("Wow! You've completed every challenge and earned every badge! You're officially a Super Star!");
        return;
      }
    }
    
    // ✅ CRITICAL FIX: Clear the newly earned badge state
    setNewlyEarnedBadge(null);
    
    // 🎯 CRITICAL FIX: Check for Focus Finder completion and Goal Getter eligibility
    if (newlyEarnedBadge === 'focus_finder') {
      console.log('Focus Finder just completed — immediately checking for Goal Getter');

      // Forcefully ensure the latest progress
      const progress = loadProgress(); // <-- freshly reloaded

      if (progress.challengesCompleted >= 5 && !progress.badges['goal_getter']) {
        console.log('Awarding Goal Getter NOW');
        awardBadge('goal_getter');
        setCurrentScreen('goal-getter');
        setRobotSpeech("Incredible! You've completed your first 5 challenges! You're officially a Goal Getter!");
        return;
      }
    }

    // ✅ NEW: Check for Super Star after any other badge
    const currentProgress = loadProgress();
    const otherBadgeCount = Object.keys(currentProgress.badges).filter(id => 
      id !== 'super_star' && currentProgress.badges[id]
    ).length;
    
    console.log(`🌟 Super Star check: ${otherBadgeCount}/17 badges earned`);
    
    if (otherBadgeCount >= 17 && !currentProgress.badges['super_star']) {
      console.log('⭐ Super Star condition met - awarding badge');
      awardBadge('super_star');
      setCurrentScreen('super-star');
      setRobotSpeech("Incredible! You've earned ALL the badges! You're officially a Super Star - what an amazing achievement!");
      return;
    }
    
    // Fallback (if Goal Getter or Super Star not triggered)
    setCurrentScreen('challenges');
    setChallengesSubScreen('next-challenge');
    setRobotSpeech("Ready for a new challenge? Put on your thinking cap and give this one a try!");
  };

  // 🎯 FIXED: Handle My Badges button with direct Goal Getter and Super Star checks
  const handleMyBadgesFromApp = () => {
    console.log('🎯 My Badges clicked');
    
    // ✅ NEW: Check for Super Star after Resilient
    if (newlyEarnedBadge === 'resilient') {
      console.log('🌟 Resilient just completed — checking for Super Star');
      
      const progress = loadProgress();
      
      // Count all badges except super_star itself
      const otherBadgeCount = Object.keys(progress.badges).filter(id => 
        id !== 'super_star' && progress.badges[id]
      ).length;
      
      console.log(`🌟 Super Star check: ${otherBadgeCount}/17 badges earned`);
      
      if (otherBadgeCount >= 17 && !progress.badges['super_star']) {
        console.log('⭐ Super Star condition met - awarding badge');
        awardBadge('super_star');
        setNewlyEarnedBadge(null);
        setCurrentScreen('super-star');
        setRobotSpeech("Wow! You've completed every challenge and earned every badge! You're officially a Super Star!");
        return;
      }
    }
    
    // ✅ CRITICAL FIX: Clear the newly earned badge state
    setNewlyEarnedBadge(null);
    
    // 🎯 CRITICAL FIX: Check for Focus Finder completion and Goal Getter eligibility
    if (newlyEarnedBadge === 'focus_finder') {
      console.log('Focus Finder just completed — immediately checking for Goal Getter');

      // Forcefully ensure the latest progress
      const progress = loadProgress(); // <-- freshly reloaded

      if (progress.challengesCompleted >= 5 && !progress.badges['goal_getter']) {
        console.log('Awarding Goal Getter NOW');
        awardBadge('goal_getter');
        setCurrentScreen('goal-getter');
        setRobotSpeech("Incredible! You've completed your first 5 challenges! You're officially a Goal Getter!");
        return;
      }
    }

    // ✅ NEW: Check for Super Star after any other badge
    const currentProgress = loadProgress();
    const otherBadgeCount = Object.keys(currentProgress.badges).filter(id => 
      id !== 'super_star' && currentProgress.badges[id]
    ).length;
    
    console.log(`🌟 Super Star check: ${otherBadgeCount}/17 badges earned`);
    
    if (otherBadgeCount >= 17 && !currentProgress.badges['super_star']) {
      console.log('⭐ Super Star condition met - awarding badge');
      awardBadge('super_star');
      setCurrentScreen('super-star');
      setRobotSpeech("Incredible! You've earned ALL the badges! You're officially a Super Star - what an amazing achievement!");
      return;
    }
    
    // Fallback (if Goal Getter or Super Star not triggered)
    setCurrentScreen('challenges');
    setChallengesSubScreen('my-badges');
    setRobotSpeech(`Wow! You've already earned ${progress.badgeCount} badges! Just ${18 - progress.badgeCount} more to unlock the full set. Keep going!`);
  };

  const handleGoalGetterCollect = () => {
    setCurrentScreen('challenges');
    setChallengesSubScreen('my-badges');
    setNewlyEarnedBadge(null); // Clear the badge state
    setRobotSpeech(`Amazing! You've earned the Goal Getter badge! You now have ${progress.badgeCount} badges total. Keep going for more!`);
  };

  // ✅ NEW: Handle Super Star badge collection
  const handleSuperStarCollect = () => {
    setCurrentScreen('challenges');
    setChallengesSubScreen('my-badges');
    setNewlyEarnedBadge(null); // Clear the badge state
    setRobotSpeech(`Incredible! You're officially a Super Star! You've earned all ${progress.badgeCount} badges! What an amazing achievement!`);
  };

  const handleSectionClose = (sectionName: string) => {
    // ✅ CHECK FOR BADGE AWARD FIRST - STOP IF BADGE AWARDED
    const badgeAwarded = handleSectionExit(sectionName);
    if (badgeAwarded) {
      console.log('🛑 Badge awarded - stopping section close navigation');
      return; // ✅ CRITICAL: STOP HERE IF BADGE WAS AWARDED
    }
    
    // ✅ ONLY CONTINUE IF NO BADGE WAS AWARDED
    setCurrentScreen('welcome');
    setRobotSpeech("Hey friend! I'm Reflekto, your AI buddy. Let's explore your thoughts together — and if you want to tweak anything, just tap my logo!");
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
            onEngagement={handleEngagement}
          />
        ) : currentScreen === 'daily-checkin' ? (
          <DailyCheckInSection 
            onClose={() => handleSectionClose('daily-checkin')}
            setRobotSpeech={setRobotSpeech}
            moodHistory={moodHistory}
            setMoodHistory={setMoodHistory}
            onShowMoodHistory={() => setShowMoodHistoryModal(true)}
            onBadgeEarned={handleBadgeEarned}
            onEngagement={handleEngagement}
          />
        ) : currentScreen === 'what-if' ? (
          <WhatIfSection 
            onClose={() => handleSectionClose('what-if')}
            setRobotSpeech={setRobotSpeech}
            onBadgeEarned={handleBadgeEarned}
            onEngagement={handleEngagement}
          />
        ) : currentScreen === 'draw-it-out' ? (
          <DrawItOutSection 
            onClose={() => handleSectionClose('draw-it-out')}
            setRobotSpeech={setRobotSpeech}
            onBadgeEarned={handleBadgeEarned}
            onEngagement={handleEngagement}
          />
        ) : currentScreen === 'challenges' ? (
          <ChallengesSection 
            onClose={() => handleSectionClose('challenges')}
            setRobotSpeech={setRobotSpeech}
            initialSubScreen={challengesSubScreen}
          />
        ) : currentScreen === 'challenge-complete' && newlyEarnedBadge ? (
          <ChallengeCompletePage
            badgeId={newlyEarnedBadge}
            progress={progress}
            onNextChallenge={handleNextChallengeFromApp}
            onMyBadges={handleMyBadgesFromApp}
          />
        ) : currentScreen === 'goal-getter' ? (
          <GoalGetterPage
            progress={progress}
            onCollectBadge={handleGoalGetterCollect}
          />
        ) : currentScreen === 'super-star' ? (
          <SuperStarPage
            progress={progress}
            onCollectBadge={handleSuperStarCollect}
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

        {/* Mobile Navigation Buttons */}
        <MobileNavButtons onNavButtonClick={handleNavButtonClick} currentScreen={currentScreen} />
      </div>

      {/* Modals */}
      {showGrownUpModal && (
        <GrownUpAccessModal 
          onClose={() => setShowGrownUpModal(false)} 
          onBadgeEarned={handleBadgeEarned}
        />
      )}

      {showChatHistoryModal && (
        <ChatHistoryModal 
          onClose={() => handleModalClose('chat')} 
          chatHistory={chatMessages}
          onBadgeEarned={handleBadgeEarned}
        />
      )}

      {showMoodHistoryModal && (
        <MoodHistoryModal 
          onClose={() => handleModalClose('mood')} 
          moodHistory={moodHistory}
          onBadgeEarned={handleBadgeEarned}
        />
      )}
    </div>
  );
}

export default App;