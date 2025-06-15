import { ReflectoBotProgress, Badge } from '../types';
import { allBadges, badgeQueue } from '../badgeData';

const STORAGE_KEY = 'reflectobot_progress';

export const getInitialProgress = (): ReflectoBotProgress => {
  const today = new Date().toDateString();
  return {
    badges: Object.fromEntries(allBadges.map(badge => [badge.id, false])),
    badgeCount: 0,
    earnedBadges: [],
    
    // Challenge tracking
    challengeActive: false,
    currentChallengeIndex: 0,
    challengesCompleted: 0,
    
    // Badge-specific progress
    moodCheckInCount: 0,
    chatMessageCount: 0,
    undoCount: 0,
    drawingsSaved: 0,
    colorsUsedInDrawing: 0,
    pdfExportCount: 0,
    whatIfPromptsAnswered: 0,
    historyViews: 0,
    readItToMeUsed: 0,
    hasLongMessageSent: false,
    stayPositiveMessageCount: 0,
    hasLongPositiveMessage: false,
    kindHeartWordCount: 0,
    
    // Focus Finder tracking
    focusStartTime: null,
    focusPage: null,
    focusEngagementCount: 0,
    
    // Resilient tracking
    visitedSections: [],
    
    // Daily tracking
    returnDays: [today],
    lastVisitDate: today,
    
    // Pending badges
    pendingBadges: [],
    
    // Content-based badge flags
    hasBraveVoiceMessage: false,
    hasTruthSpotterMessage: false,
    
    // Good Listener tracking
    hasVisitedChatHistory: false,
    hasVisitedMoodHistory: false
  };
};

export const loadProgress = (): ReflectoBotProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const initial = getInitialProgress();
      return { 
        ...initial, 
        ...parsed,
        // Ensure new fields are properly initialized
        focusStartTime: parsed.focusStartTime ?? null,
        focusPage: parsed.focusPage ?? null,
        focusEngagementCount: parsed.focusEngagementCount ?? 0,
        visitedSections: parsed.visitedSections ?? [],
        pendingBadges: parsed.pendingBadges ?? [],
        hasBraveVoiceMessage: parsed.hasBraveVoiceMessage ?? false,
        hasTruthSpotterMessage: parsed.hasTruthSpotterMessage ?? false,
        hasVisitedChatHistory: parsed.hasVisitedChatHistory ?? false,
        hasVisitedMoodHistory: parsed.hasVisitedMoodHistory ?? false
      };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return getInitialProgress();
};

export const saveProgress = (progress: ReflectoBotProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log('✅ Progress saved to localStorage:', {
      challengesCompleted: progress.challengesCompleted,
      badgeCount: progress.badgeCount,
      goalGetterEarned: progress.badges['goal_getter']
    });
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateProgress = (updates: Partial<ReflectoBotProgress>): ReflectoBotProgress => {
  const current = loadProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
};

// Check if a badge should be awarded based on current progress
export const checkBadgeCondition = (badgeId: string, progress: ReflectoBotProgress): boolean => {
  console.log(`Checking badge condition for ${badgeId}:`, {
    drawingsSaved: progress.drawingsSaved,
    moodCheckInCount: progress.moodCheckInCount,
    undoCount: progress.undoCount,
    chatMessageCount: progress.chatMessageCount,
    pdfExportCount: progress.pdfExportCount,
    whatIfPromptsAnswered: progress.whatIfPromptsAnswered,
    kindHeartWordCount: progress.kindHeartWordCount,
    readItToMeUsed: progress.readItToMeUsed,
    stayPositiveMessageCount: progress.stayPositiveMessageCount,
    hasLongPositiveMessage: progress.hasLongPositiveMessage,
    historyViews: progress.historyViews,
    colorsUsedInDrawing: progress.colorsUsedInDrawing,
    hasLongMessageSent: progress.hasLongMessageSent,
    visitedSections: progress.visitedSections,
    hasBraveVoiceMessage: progress.hasBraveVoiceMessage,
    hasTruthSpotterMessage: progress.hasTruthSpotterMessage,
    hasVisitedChatHistory: progress.hasVisitedChatHistory,
    hasVisitedMoodHistory: progress.hasVisitedMoodHistory,
    badgeAlreadyEarned: progress.badges[badgeId]
  });

  // ✅ CRITICAL FIX: Always check if badge is already earned first
  if (progress.badges[badgeId]) {
    console.log(`❌ Badge ${badgeId} already earned, not awarding again`);
    return false;
  }

  switch (badgeId) {
    case 'calm_creator':
      return progress.drawingsSaved >= 1;
    case 'mood_mapper':
      return progress.moodCheckInCount >= 1;
    case 'bounce_back':
      return progress.undoCount >= 3;
    case 'reflecto_rookie':
      return progress.chatMessageCount >= 1;
    case 'focus_finder':
      // This is handled by special focus tracking logic
      return false;
    case 'great_job':
      return progress.pdfExportCount >= 1;
    case 'brave_voice':
      return progress.hasBraveVoiceMessage;
    case 'what_if_explorer':
      return progress.whatIfPromptsAnswered >= 3;
    case 'truth_spotter':
      return progress.hasTruthSpotterMessage;
    case 'kind_heart':
      return progress.kindHeartWordCount >= 25;
    case 'boost_buddy':
      return progress.readItToMeUsed >= 1;
    case 'stay_positive':
      return progress.stayPositiveMessageCount >= 1 && progress.hasLongPositiveMessage;
    case 'good_listener':
      return progress.hasVisitedChatHistory && progress.hasVisitedMoodHistory;
    case 'creative_spark':
      return progress.colorsUsedInDrawing >= 5;
    case 'deep_thinker':
      return progress.hasLongMessageSent;
    case 'resilient':
      return progress.visitedSections.length >= 4;
    default:
      return false;
  }
};

// Award a badge and update progress - ⛏️ CONFIRMED: This persists progress immediately
export const awardBadge = (badgeId: string): ReflectoBotProgress => {
  const progress = loadProgress();
  
  console.log(`🏆 Awarding badge: ${badgeId}`);
  console.log(`📊 Current challengesCompleted BEFORE award: ${progress.challengesCompleted}`);
  
  // ✅ CRITICAL FIX: Don't award if already earned
  if (progress.badges[badgeId]) {
    console.log(`❌ Badge ${badgeId} already earned, not awarding again`);
    return progress;
  }
  
  const updatedBadges = { ...progress.badges, [badgeId]: true };
  const newBadgeCount = progress.badgeCount + 1;
  
  let updatedProgress = {
    ...progress,
    badges: updatedBadges,
    badgeCount: newBadgeCount,
    earnedBadges: [...progress.earnedBadges, badgeId]
  };
  
  // If this is a challenge badge (not a reward badge), advance the challenge
  if (badgeQueue.includes(badgeId)) {
    console.log(`📈 Advancing challenge after awarding ${badgeId}`);
    updatedProgress = {
      ...updatedProgress,
      challengeActive: false,
      currentChallengeIndex: Math.min(progress.currentChallengeIndex + 1, badgeQueue.length - 1),
      challengesCompleted: progress.challengesCompleted + 1
    };
    console.log(`📊 NEW challengesCompleted AFTER award: ${updatedProgress.challengesCompleted}`);
  }
  
  // ⛏️ CRITICAL: Save progress immediately and confirm it's persisted
  saveProgress(updatedProgress);
  updateBadgeCounterDisplay(newBadgeCount);
  
  // 🔍 VERIFICATION: Log fresh progress from localStorage to confirm persistence
  const verifyProgress = loadProgress();
  console.log(`🔍 VERIFICATION - Fresh progress challengesCompleted: ${verifyProgress.challengesCompleted}`);
  
  return updatedProgress;
};

// 🎯 FIXED: Check and award Goal Getter badge - now re-reads fresh progress state
export const checkGoalGetterBadge = (): boolean => {
  // 🎯 CRITICAL: Re-read fresh progress state to ensure Focus Finder progress is detected
  const progress = loadProgress();
  
  console.log(`🎯 Checking Goal Getter: challengesCompleted=${progress.challengesCompleted}, hasGoalGetter=${progress.badges['goal_getter']}`);
  
  // 🎯 Check if we just completed the 5th challenge (Focus Finder should have updated challengesCompleted to 5)
  if (progress.challengesCompleted >= 5 && !progress.badges['goal_getter']) {
    console.log('🎯 Goal Getter condition met - awarding badge');
    awardBadge('goal_getter');
    return true;
  }
  
  console.log('❌ Goal Getter condition NOT met');
  return false;
};

// Check and award Super Star badge
export const checkSuperStarBadge = (): boolean => {
  const progress = loadProgress();
  
  // Count all badges except super_star itself
  const otherBadgeCount = Object.keys(progress.badges).filter(id => 
    id !== 'super_star' && progress.badges[id]
  ).length;
  
  console.log(`Checking Super Star: otherBadgeCount=${otherBadgeCount}, hasSuperStar=${progress.badges['super_star']}`);
  
  if (otherBadgeCount >= 17 && !progress.badges['super_star']) {
    console.log('Awarding Super Star badge');
    awardBadge('super_star');
    return true;
  }
  
  return false;
};

// Add a badge to pending list (for exit-based awards)
export const addPendingBadge = (badgeId: string): void => {
  const progress = loadProgress();
  if (!progress.pendingBadges.includes(badgeId) && !progress.badges[badgeId]) {
    console.log(`Adding pending badge: ${badgeId}`);
    updateProgress({
      pendingBadges: [...progress.pendingBadges, badgeId]
    });
  }
};

// Get and clear pending badges
export const getPendingBadges = (): string[] => {
  const progress = loadProgress();
  const pending = [...progress.pendingBadges];
  
  console.log(`Getting pending badges: ${pending}`);
  
  return pending;
};

// Clear pending badges
export const clearPendingBadges = (): void => {
  console.log('Clearing pending badges');
  updateProgress({ pendingBadges: [] });
};

// Focus Finder specific functions
export const startFocusTracking = (page: string): void => {
  const progress = loadProgress();
  
  // Only start if Focus Finder challenge is active
  if (progress.challengeActive && 
      progress.currentChallengeIndex === 4 && // focus_finder is at index 4
      (page === 'chat' || page === 'daily-checkin' || page === 'what-if' || page === 'draw-it-out')) {
    
    console.log(`Starting focus tracking for page: ${page}`);
    updateProgress({
      focusStartTime: Date.now(),
      focusPage: page,
      focusEngagementCount: 0
    });
  }
};

export const trackFocusEngagement = (): void => {
  const progress = loadProgress();
  
  if (progress.focusStartTime && progress.focusPage) {
    const newCount = progress.focusEngagementCount + 1;
    console.log(`Focus engagement: ${newCount}`);
    updateProgress({
      focusEngagementCount: newCount
    });
  }
};

export const checkFocusFinderCompletion = (): boolean => {
  const progress = loadProgress();
  
  if (progress.focusStartTime && 
      progress.focusEngagementCount >= 3 &&
      (Date.now() - progress.focusStartTime) >= 90000) { // 90 seconds
    
    console.log('Focus Finder completed! Time and engagement requirements met.');
    
    // Clear focus tracking
    updateProgress({
      focusStartTime: null,
      focusPage: null,
      focusEngagementCount: 0
    });
    
    return true;
  }
  
  const timeRemaining = progress.focusStartTime ? 90000 - (Date.now() - progress.focusStartTime) : 0;
  console.log(`Focus Finder progress: ${progress.focusEngagementCount}/3 engagements, ${Math.max(0, timeRemaining/1000)}s remaining`);
  
  return false;
};

// Resilient tracking
export const trackSectionVisit = (section: string): void => {
  const progress = loadProgress();
  const validSections = ['chat', 'daily-checkin', 'what-if', 'draw-it-out'];
  
  if (validSections.includes(section) && !progress.visitedSections.includes(section)) {
    console.log(`Tracking section visit: ${section}`);
    updateProgress({
      visitedSections: [...progress.visitedSections, section]
    });
  }
};

// ✅ NEW: Good Listener tracking functions
export const trackChatHistoryVisit = (): void => {
  const progress = loadProgress();
  
  if (!progress.hasVisitedChatHistory) {
    console.log('📖 Tracking Chat History visit for Good Listener badge');
    updateProgress({
      hasVisitedChatHistory: true
    });
  }
};

export const trackMoodHistoryVisit = (): void => {
  const progress = loadProgress();
  
  if (!progress.hasVisitedMoodHistory) {
    console.log('📖 Tracking Mood History visit for Good Listener badge');
    updateProgress({
      hasVisitedMoodHistory: true
    });
  }
};

export const updateBadgeCounterDisplay = (badgeCount?: number): void => {
  const count = badgeCount ?? loadProgress().badgeCount;
  const counterElements = document.querySelectorAll('[id="badge-counter"]');
  counterElements.forEach(element => {
    if (element) {
      element.textContent = `${count} of 18 Collected!`;
    }
  });
};

export const trackDailyVisit = (): ReflectoBotProgress => {
  const progress = loadProgress();
  const today = new Date().toDateString();
  
  if (progress.lastVisitDate !== today) {
    const returnDays = [...new Set([...progress.returnDays, today])];
    return updateProgress({
      lastVisitDate: today,
      returnDays
    });
  }
  
  return progress;
};

export const exportProgress = (): void => {
  const progress = loadProgress();
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reflectobot-progress.json';
  link.click();
  
  URL.revokeObjectURL(url);
};

export const importProgress = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target?.result as string);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        window.location.reload();
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const resetSpecificBadge = (badgeId: string): boolean => {
  const badgeExists = allBadges.some(badge => badge.id === badgeId);
  if (!badgeExists) {
    console.error(`Badge ID "${badgeId}" does not exist.`);
    return false;
  }

  const progress = loadProgress();
  
  if (!progress.badges[badgeId]) {
    console.log(`Badge "${badgeId}" is not currently earned.`);
    return false;
  }

  const updatedBadges = { ...progress.badges, [badgeId]: false };
  const newBadgeCount = Math.max(0, progress.badgeCount - 1);
  const updatedEarnedBadges = progress.earnedBadges.filter(id => id !== badgeId);

  const badgeIndex = badgeQueue.indexOf(badgeId);
  let updatedChallengeIndex = progress.currentChallengeIndex;
  let updatedChallengeActive = progress.challengeActive;

  if (badgeIndex !== -1 && badgeIndex <= progress.currentChallengeIndex) {
    updatedChallengeIndex = badgeIndex;
    updatedChallengeActive = false;
  }

  const updatedProgress = {
    ...progress,
    badges: updatedBadges,
    badgeCount: newBadgeCount,
    earnedBadges: updatedEarnedBadges,
    currentChallengeIndex: updatedChallengeIndex,
    challengeActive: updatedChallengeActive,
    challengesCompleted: Math.max(0, progress.challengesCompleted - 1)
  };

  saveProgress(updatedProgress);
  updateBadgeCounterDisplay(newBadgeCount);
  
  console.log(`Badge "${badgeId}" has been reset successfully.`);
  return true;
};

export const skipToChallenge = (targetBadgeId: string): void => {
  const progress = loadProgress();
  const targetIndex = badgeQueue.indexOf(targetBadgeId);

  if (targetIndex === -1) {
    console.error(`Badge ID "${targetBadgeId}" not found in badgeQueue.`);
    return;
  }

  const updatedProgress = {
    ...progress,
    currentChallengeIndex: targetIndex,
    challengeActive: false
  };

  saveProgress(updatedProgress);
  console.log(`Skipped to challenge for badge: ${targetBadgeId}. Current challenge index is now ${targetIndex}.`);
  alert(`Skipped to "${targetBadgeId}" challenge. Please refresh the page to see changes.`);
};