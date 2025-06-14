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
  moodCheckInCount: number;
  chatMessageCount: number;
  undoCount: number;
  returnDays: string[];
  pdfExportCount: 0;
  whatIfPromptViews: number;
  whatIfPromptsAnswered: number;
  historyViews: number;
  drawingsSaved: number;
  colorsUsedInDrawing: number;
  challengesCompleted: number;
  readItToMeUsed: number;
  focusedChallengeCompleted: boolean;
  focusedChallengeActions: number;
  focusedChallengeStartTime: number | null;
  focusedChallengePage: string | null;
  lastVisitDate: string;
  challengeActive: boolean;
  currentChallengeIndex: number;
  stayPositiveMessageCount: number;
  hasLongMessageSent: boolean;
  hasLongPositiveMessage: boolean;
  kindHeartWordCount: number;
}

export interface DrawingEntry {
  title: string;
  imageData: string;
  timestamp: string;
}