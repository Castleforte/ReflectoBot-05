export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface MoodEntry {
  moodName: string;
  checkInText: string;
  timestamp: string;
}

export interface ConversationTurn {
  id: string;
  promptText: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorIcon: string;
  earned: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  badgeId: string;
}

export interface ReflectoBotProgress {
  badges: Record<string, boolean>;
  badgeCount: number;
  earnedBadges: string[];
  
  // Challenge tracking
  challengeActive: boolean;
  currentChallengeIndex: number;
  challengesCompleted: number;
  
  // Badge-specific progress
  moodCheckInCount: number;
  chatMessageCount: number;
  undoCount: number;
  drawingsSaved: number;
  colorsUsedInDrawing: number;
  pdfExportCount: number;
  whatIfPromptsAnswered: number;
  historyViews: number;
  readItToMeUsed: number;
  hasLongMessageSent: boolean;
  stayPositiveMessageCount: number;
  hasLongPositiveMessage: boolean;
  kindHeartWordCount: number;
  
  // Focus Finder tracking
  focusStartTime: number | null;
  focusPage: string | null;
  focusEngagementCount: number;
  
  // Resilient tracking
  visitedSections: string[];
  
  // Daily tracking
  returnDays: string[];
  lastVisitDate: string;
  
  // Pending badges (for exit-based awards)
  pendingBadges: string[];
  
  // Content-based badge flags
  hasBraveVoiceMessage: boolean;
  hasTruthSpotterMessage: boolean;
}

export interface DrawingEntry {
  title: string;
  imageData: string;
  timestamp: string;
}