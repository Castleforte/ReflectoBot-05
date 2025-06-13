import { ReflectoBotProgress, Badge } from '../types';
import { allBadges, badgeQueue } from '../badgeData';

const STORAGE_KEY = 'reflectobot_progress';

export const getInitialProgress = (): ReflectoBotProgress => {
  const today = new Date().toDateString();
  return {
    badges: Object.fromEntries(allBadges.map(badge => [badge.id, false])),
    badgeCount: 0,
    earnedBadges: [],
    moodCheckInCount: 0,
    chatMessageCount: 0,
    undoCount: 0,
    returnDays: [today],
    pdfExportCount: 0,
    whatIfPromptViews: 0,
    historyViews: 0,
    drawingsSaved: 0,
    colorsUsedInDrawing: 0,
    challengesCompleted: 0,
    readItToMeUsed: 0,
    focusedChallengeCompleted: false,
    lastVisitDate: today,
    challengeActive: false,
    currentChallengeIndex: 0,
    stayPositiveMessageCount: 0
  };
};

export const loadProgress = (): ReflectoBotProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required fields exist with backward compatibility
      const initial = getInitialProgress();
      return { 
        ...initial, 
        ...parsed,
        // Ensure new fields are properly initialized
        challengeActive: parsed.challengeActive ?? false,
        currentChallengeIndex: parsed.currentChallengeIndex ?? 0,
        stayPositiveMessageCount: parsed.stayPositiveMessageCount ?? 0
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

// New badge checking system with gatekeeping rules
export const checkAndUpdateBadges = (triggeredBadgeId: string, progress: ReflectoBotProgress): string | null => {
  // Only award badges if challenge is active
  if (!progress.challengeActive) {
    return null;
  }

  // Get the expected badge based on current challenge index
  const expectedBadgeId = badgeQueue[progress.currentChallengeIndex];
  
  // Only award if the triggered badge matches the expected badge
  if (triggeredBadgeId !== expectedBadgeId) {
    return null;
  }

  // Check if badge condition is met
  let conditionMet = false;
  
  switch (triggeredBadgeId) {
    case 'calm_creator':
      conditionMet = progress.drawingsSaved >= 1;
      break;
    case 'mood_mapper':
      conditionMet = progress.moodCheckInCount >= 3;
      break;
    case 'bounce_back':
      conditionMet = progress.undoCount >= 3;
      break;
    case 'reflecto_rookie':
      // Special handling for Reflecto Rookie - checked in App.tsx
      conditionMet = progress.chatMessageCount >= 2;
      break;
    case 'focus_finder':
      conditionMet = progress.focusedChallengeCompleted;
      break;
    case 'stay_positive':
      conditionMet = progress.stayPositiveMessageCount >= 3;
      break;
    case 'great_job':
      conditionMet = progress.pdfExportCount >= 1;
      break;
    case 'brave_voice':
      // Condition already verified by calling component
      conditionMet = true;
      break;
    case 'what_if_explorer':
      conditionMet = progress.whatIfPromptViews >= 3;
      break;
    case 'truth_spotter':
      // Condition already verified by calling component
      conditionMet = true;
      break;
    case 'kind_heart':
      // Condition already verified by calling component
      conditionMet = true;
      break;
    case 'super_star':
      conditionMet = progress.badgeCount >= 17;
      break;
    case 'goal_getter':
      conditionMet = progress.challengesCompleted >= 5;
      break;
    case 'good_listener':
      conditionMet = progress.historyViews >= 3;
      break;
    case 'creative_spark':
      conditionMet = progress.colorsUsedInDrawing >= 5;
      break;
    case 'deep_thinker':
      // Condition already verified by calling component
      conditionMet = true;
      break;
    case 'boost_buddy':
      // Condition already verified by calling component
      conditionMet = true;
      break;
    case 'resilient':
      conditionMet = progress.returnDays.length >= 3;
      break;
    default:
      return null;
  }

  // If condition is met and badge not already earned
  if (conditionMet && !progress.badges[triggeredBadgeId]) {
    // Award the badge
    const updatedBadges = { ...progress.badges, [triggeredBadgeId]: true };
    const newBadgeCount = progress.badgeCount + 1;
    
    // For focus_finder and stay_positive badges, don't update challenge state here
    // This will be handled in App.tsx when the completion screen is displayed
    if (triggeredBadgeId === 'focus_finder' || triggeredBadgeId === 'stay_positive') {
      const updatedProgress = {
        ...progress,
        badges: updatedBadges,
        badgeCount: newBadgeCount,
        earnedBadges: [...progress.earnedBadges, triggeredBadgeId]
      };
      saveProgress(updatedProgress);
      updateBadgeCounterDisplay(newBadgeCount);
      return triggeredBadgeId;
    } else {
      // For all other badges, update challenge state immediately
      const updatedProgress = {
        ...progress,
        badges: updatedBadges,
        badgeCount: newBadgeCount,
        earnedBadges: [...progress.earnedBadges, triggeredBadgeId],
        challengeActive: false,
        currentChallengeIndex: Math.min(progress.currentChallengeIndex + 1, badgeQueue.length - 1),
        challengesCompleted: progress.challengesCompleted + 1
      };
      saveProgress(updatedProgress);
      updateBadgeCounterDisplay(newBadgeCount);
      return triggeredBadgeId;
    }
  }

  return null;
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
        // Validate that it's a valid progress object
        if (loaded && typeof loaded === 'object' && loaded.badges) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
          window.location.reload(); // Reload to reflect changes
          resolve();
        } else {
          reject(new Error('Invalid progress file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Fixed function to reset a specific badge for debugging
export const resetSpecificBadge = (badgeId: string): boolean => {
  try {
    console.log(`Attempting to reset badge: "${badgeId}"`);
    
    // Check if the badge ID exists in allBadges
    const badgeExists = allBadges.some(badge => badge.id === badgeId);
    if (!badgeExists) {
      console.error(`Badge ID "${badgeId}" does not exist.`);
      console.log('Available badge IDs:', allBadges.map(b => b.id));
      return false;
    }

    const progress = loadProgress();
    console.log('Current progress:', progress);
    
    // Check if the badge is currently earned
    if (!progress.badges[badgeId]) {
      console.log(`Badge "${badgeId}" is not currently earned.`);
      return false;
    }

    // Reset the badge
    const updatedBadges = { ...progress.badges, [badgeId]: false };
    const newBadgeCount = Math.max(0, progress.badgeCount - 1);
    const updatedEarnedBadges = progress.earnedBadges.filter(id => id !== badgeId);

    // Find the badge index in the queue to potentially reset challenge progress
    const badgeIndex = badgeQueue.indexOf(badgeId);
    let updatedChallengeIndex = progress.currentChallengeIndex;
    let updatedChallengeActive = progress.challengeActive;

    // If resetting a badge that's before or at the current challenge index, adjust accordingly
    if (badgeIndex !== -1 && badgeIndex <= progress.currentChallengeIndex) {
      updatedChallengeIndex = badgeIndex;
      updatedChallengeActive = false; // Deactivate any active challenge
    }

    // Reset related progress counters based on badge type
    let updatedProgress = {
      ...progress,
      badges: updatedBadges,
      badgeCount: newBadgeCount,
      earnedBadges: updatedEarnedBadges,
      currentChallengeIndex: updatedChallengeIndex,
      challengeActive: updatedChallengeActive,
      challengesCompleted: Math.max(0, progress.challengesCompleted - 1)
    };

    // Reset specific counters based on badge type
    switch (badgeId) {
      case 'calm_creator':
        updatedProgress.drawingsSaved = 0;
        break;
      case 'mood_mapper':
        updatedProgress.moodCheckInCount = 0;
        break;
      case 'bounce_back':
        updatedProgress.undoCount = 0;
        break;
      case 'reflecto_rookie':
        updatedProgress.chatMessageCount = 0;
        break;
      case 'focus_finder':
        updatedProgress.focusedChallengeCompleted = false;
        break;
      case 'stay_positive':
        updatedProgress.stayPositiveMessageCount = 0;
        break;
      case 'great_job':
        updatedProgress.pdfExportCount = 0;
        break;
      case 'what_if_explorer':
        updatedProgress.whatIfPromptViews = 0;
        break;
      case 'good_listener':
        updatedProgress.historyViews = 0;
        break;
      case 'creative_spark':
        updatedProgress.colorsUsedInDrawing = 0;
        break;
      case 'boost_buddy':
        updatedProgress.readItToMeUsed = 0;
        break;
      case 'resilient':
        // Keep only today's visit for resilient badge reset
        const today = new Date().toDateString();
        updatedProgress.returnDays = [today];
        break;
    }

    saveProgress(updatedProgress);
    updateBadgeCounterDisplay(newBadgeCount);
    
    console.log(`Badge "${badgeId}" has been reset successfully.`);
    console.log('Updated progress:', updatedProgress);
    return true;
  } catch (error) {
    console.error('Error resetting badge:', error);
    return false;
  }
};

// --- Begin Enhanced Badge Logic Insert ---

export function checkCustomBadgeConditions(badgeId: string, progress: ReflectoBotProgress): boolean {
  switch (badgeId) {
    case 'reflecto_rookie':
      return (progress.chatMessageCount >= 2 && progress.longMessagesSent >= 1);
    case 'focus_finder':
      return (progress.focusSessionCompleted === true);
    case 'stay_positive':
      return (progress.stayPositiveMessageCount >= 3);
    default:
      return false;
  }
}

// --- End Enhanced Badge Logic Insert ---