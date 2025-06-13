import React, { useState, useEffect } from 'react';
import { chatPrompts, promptStarters } from '../prompts';
import { ConversationTurn } from '../types';
import { loadProgress, updateProgress } from '../utils/progressManager';

interface ChatSectionProps {
  onClose: () => void;
  chatMessages: ConversationTurn[];
  setChatMessages: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
  onShowChatHistory: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
  onBadgeEarned: (badgeId: string) => void;
  onMeaningfulAction: () => void;
  onReflectoRookieProgress?: () => void;
  onStayPositiveProgress?: () => void;
}

function ChatSection({ 
  onClose, 
  chatMessages, 
  setChatMessages, 
  onShowChatHistory, 
  setRobotSpeech, 
  onBadgeEarned, 
  onMeaningfulAction,
  onReflectoRookieProgress,
  onStayPositiveProgress
}: ChatSectionProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);

  // Load chat messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('reflectobot-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setChatMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Error loading chat messages from localStorage:', error);
      }
    }
  }, [setChatMessages]);

  // Save chat messages to localStorage whenever chatMessages updates
  useEffect(() => {
    localStorage.setItem('reflectobot-chat-messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const handleRefreshPrompt = () => {
    if (isRefreshDisabled) return;

    // Cycle to the next prompt in the array
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % chatPrompts.length);
    
    // Enable cooldown
    setIsRefreshDisabled(true);
    
    // Re-enable button after 2 seconds
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, 2000);

    // Track meaningful action for Focus Finder
    onMeaningfulAction();
  };

  const handlePromptClick = () => {
    // Find the matching starter for the current prompt
    const currentPrompt = chatPrompts[currentPromptIndex];
    const matchingStarter = promptStarters.find(item => item.prompt === currentPrompt);
    
    if (matchingStarter) {
      setChatInputText(matchingStarter.starter);
    }
  };

  const handleChatHistory = () => {
    onShowChatHistory();
  };

  const isPositiveMessage = (message: string): boolean => {
    const positiveWords = [
      'happy', 'good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 
      'love', 'excited', 'grateful', 'thankful', 'blessed', 'proud', 'confident',
      'hopeful', 'optimistic', 'positive', 'cheerful', 'joyful', 'peaceful',
      'calm', 'relaxed', 'content', 'satisfied', 'accomplished', 'successful'
    ];
    
    const lowerMessage = message.toLowerCase();
    return positiveWords.some(word => lowerMessage.includes(word));
  };

  const handleSendMessage = () => {
    const trimmedMessage = chatInputText.trim();
    if (!trimmedMessage) return;

    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create a single conversation turn
    const conversationTurn: ConversationTurn = {
      id: Date.now().toString(),
      promptText: chatPrompts[currentPromptIndex],
      userMessage: trimmedMessage,
      botResponse: "Thanks for sharing! Let's talk more about that...",
      timestamp: timestamp
    };

    // Add the conversation turn to chat history
    setChatMessages(prevMessages => [...prevMessages, conversationTurn]);
    
    // Show placeholder reply in speech bubble
    setRobotSpeech("Thanks for sharing! Let's talk more about that...");
    
    // Clear input
    setChatInputText('');

    // Track meaningful action for Focus Finder
    onMeaningfulAction();

    // Track badge progress
    onBadgeEarned('reflecto_rookie'); // Track message for Reflecto Rookie
    
    // Check for specific badge conditions
    if (trimmedMessage.split(/\s+/).length >= 15) {
      // Update progress to mark that a long message has been sent
      const currentProgress = loadProgress();
      updateProgress({ hasLongMessageSent: true });
      onBadgeEarned('deep_thinker'); // 15+ words badge
    }
    
    if (trimmedMessage.toLowerCase().includes('because')) {
      onBadgeEarned('brave_voice'); // Contains "because" badge
    }
    
    if (trimmedMessage.toLowerCase().includes('i realized')) {
      onBadgeEarned('truth_spotter'); // Contains "I realized" badge
    }

    // Check for positive messages for Stay Positive badge
    if (isPositiveMessage(trimmedMessage)) {
      // Get current progress to check if Stay Positive challenge is active
      const currentProgress = loadProgress();
      if (currentProgress.challengeActive && currentProgress.currentChallengeIndex === 5) {
        onBadgeEarned('stay_positive');
      }
    }

    // Trigger progress checks
    if (onReflectoRookieProgress) {
      onReflectoRookieProgress();
    }
    if (onStayPositiveProgress) {
      onStayPositiveProgress();
    }
    
    // TODO: Replace this logic with actual GPT API call in the future
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      handleSendMessage();
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">What's On Your Mind?</h1>
          <div className="chat-buttons">
            <button 
              className={`settings-button chat-action-button ${isRefreshDisabled ? 'disabled' : ''}`}
              onClick={handleRefreshPrompt}
              disabled={isRefreshDisabled}
            >
              <img src="/Refresh_Icon.png" alt="Prompt Refresh" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Prompt</span>
                <span className="text-2xl font-bold leading-none">Refresh</span>
              </div>
            </button>
            <button className="settings-button chat-action-button" onClick={handleChatHistory}>
              <img src="/Chat-History_Icon.png" alt="Chat History" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Chat</span>
                <span className="text-2xl font-bold leading-none">History</span>
              </div>
            </button>
          </div>
        </div>

        <div className="prompt-display" onClick={handlePromptClick}>
          {chatPrompts[currentPromptIndex]}
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-textarea"
            value={chatInputText}
            onChange={(e) => setChatInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Choose an option above or just type what's on your mind here – I'm listening."
          />
          
          <button 
            className="settings-button settings-button-lg chat-send-button"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;