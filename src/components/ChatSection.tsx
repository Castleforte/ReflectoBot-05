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
  onEngagement: () => void;
}

function ChatSection({ 
  onClose, 
  chatMessages, 
  setChatMessages, 
  onShowChatHistory, 
  setRobotSpeech, 
  onBadgeEarned,
  onEngagement
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

    // Track engagement for Focus Finder
    onEngagement();
  };

  const handlePromptClick = () => {
    // Find the matching starter for the current prompt
    const currentPrompt = chatPrompts[currentPromptIndex];
    const matchingStarter = promptStarters.find(item => item.prompt === currentPrompt);
    
    if (matchingStarter) {
      setChatInputText(matchingStarter.starter);
    }

    // Track engagement for Focus Finder
    onEngagement();
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

    // Track engagement for Focus Finder
    onEngagement();

    // Load current progress and update it
    const currentProgress = loadProgress();
    const wordCount = trimmedMessage.split(/\s+/).filter(word => word.length > 0).length;
    
    console.log(`💬 Chat message sent: "${trimmedMessage}"`);
    console.log(`📊 Word count: ${wordCount}`);
    console.log(`🔍 Contains "because": ${trimmedMessage.toLowerCase().includes('because')}`);
    console.log(`🔍 Contains "I realized": ${trimmedMessage.toLowerCase().includes('i realized')}`);
    
    // Prepare progress updates
    let progressUpdates: any = {
      chatMessageCount: currentProgress.chatMessageCount + 1
    };

    // ✅ FIXED: Check for long message (15+ words) - SET FLAG BUT DON'T AWARD IMMEDIATELY
    if (wordCount >= 15) {
      progressUpdates.hasLongMessageSent = true;
      console.log('✅ Long message detected (15+ words) - flag set for Deep Thinker badge');
    }

    // ✅ FIXED: Check for "because" keyword for Brave Voice badge - SET FLAG BUT DON'T AWARD IMMEDIATELY
    if (trimmedMessage.toLowerCase().includes('because')) {
      console.log('✅ "Because" keyword detected - setting brave voice flag');
      progressUpdates.hasBraveVoiceMessage = true;
    }
    
    // ✅ FIXED: Check for "I realized" keyword for Truth Spotter badge - SET FLAG BUT DON'T AWARD IMMEDIATELY
    if (trimmedMessage.toLowerCase().includes('i realized')) {
      console.log('✅ "I realized" phrase detected - setting truth spotter flag');
      progressUpdates.hasTruthSpotterMessage = true;
    }

    // Check for positive message and Stay Positive challenge
    if (isPositiveMessage(trimmedMessage)) {
      // Check if Stay Positive challenge is active
      if (currentProgress.challengeActive && currentProgress.currentChallengeIndex === 11) { // stay_positive is at index 11
        progressUpdates.stayPositiveMessageCount = currentProgress.stayPositiveMessageCount + 1;
        
        // If this is a long positive message (15+ words), mark it
        if (wordCount >= 15) {
          progressUpdates.hasLongPositiveMessage = true;
          console.log('✅ Long positive message detected');
        }
      }
    }

    // Update progress with all changes
    updateProgress(progressUpdates);

    // ✅ FIXED: Only trigger reflecto_rookie badge (first message badge)
    onBadgeEarned('reflecto_rookie'); // Track message for Reflecto Rookie
    
    // ✅ REMOVED: No longer immediately trigger other badges - they will be checked on section exit
    // The following badges will be awarded when user exits the Chat section:
    // - deep_thinker (15+ words)
    // - brave_voice (contains "because")
    // - truth_spotter (contains "I realized")
    // - stay_positive (positive message with 15+ words)
    
    // TODO: Replace this logic with actual GPT API call in the future
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      handleSendMessage();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInputText(e.target.value);
    
    // Track engagement for Focus Finder
    onEngagement();
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
            onChange={handleTextChange}
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