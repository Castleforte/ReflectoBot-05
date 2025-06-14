import React, { useState, useEffect } from 'react';
import { whatIfPrompts } from '../whatIfPrompts';
import { updateProgress, loadProgress } from '../utils/progressManager';

interface WhatIfSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
  onBadgeEarned: (badgeId: string) => void;
  onEngagement: () => void;
}

function WhatIfSection({ onClose, setRobotSpeech, onBadgeEarned, onEngagement }: WhatIfSectionProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [whatIfText, setWhatIfText] = useState<string>('');

  const handleRefreshPrompt = () => {
    if (isRefreshDisabled) return;

    // Cycle to the next prompt in the array
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % whatIfPrompts.length);
    
    // Enable cooldown
    setIsRefreshDisabled(true);
    
    // Re-enable button after 2 seconds
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, 2000);

    // Track engagement for Focus Finder
    onEngagement();

    // Track viewing prompts (separate from answering)
    const currentProgress = loadProgress();
    updateProgress({ 
      whatIfPromptViews: currentProgress.whatIfPromptViews + 1 
    });
  };

  const handleReadItToMe = () => {
    // Toggle reading state
    setIsReading(!isReading);
    
    // TODO: Integrate with ElevenLabs API for text-to-speech
    // For now, we'll simulate the reading with a timeout
    if (!isReading) {
      // Simulate reading duration (you'll replace this with actual audio playback)
      setTimeout(() => {
        setIsReading(false);
      }, 3000);
      
      // Update robot speech to acknowledge the action
      setRobotSpeech("Listen up! I'm reading your What If prompt out loud. Let your imagination run wild!");

      // Track engagement for Focus Finder
      onEngagement();

      // Update progress for boost_buddy badge
      const currentProgress = loadProgress();
      updateProgress({ 
        readItToMeUsed: currentProgress.readItToMeUsed + 1 
      });

      // Track badge progress for using Read It to Me
      onBadgeEarned('boost_buddy');
    }
  };

  const handleSendResponse = () => {
    const trimmedText = whatIfText.trim();
    if (!trimmedText) return;

    // Update progress to track answered prompts
    const currentProgress = loadProgress();
    updateProgress({ 
      whatIfPromptsAnswered: currentProgress.whatIfPromptsAnswered + 1 
    });

    // TODO: Save the response or handle it as needed
    // For now, we'll just show a confirmation in the robot speech
    setRobotSpeech("Wow! I love your creative thinking! That's such an imaginative answer. Want to try another What If question?");
    
    // Track engagement for Focus Finder
    onEngagement();

    // Track badge progress for answering What If prompts
    onBadgeEarned('what_if_explorer');
    
    // Clear the input
    setWhatIfText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      handleSendResponse();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWhatIfText(e.target.value);
    
    // Track engagement for Focus Finder
    onEngagement();
  };

  return (
    <div className="what-if-section">
      <div className="what-if-content">
        <div className="what-if-header">
          <h1 className="what-if-title">Today's What If...?</h1>
          <div className="what-if-buttons">
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
            <button 
              className={`settings-button chat-action-button ${isReading ? 'reading-active' : ''}`}
              onClick={handleReadItToMe}
            >
              <img src="/Speaker-icon.png" alt="Read It to Me" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Read It</span>
                <span className="text-2xl font-bold leading-none">to Me</span>
              </div>
            </button>
          </div>
        </div>

        <div className={`what-if-prompt-display ${isReading ? 'reading-animation' : ''}`}>
          {whatIfPrompts[currentPromptIndex]}
        </div>

        <div className="what-if-input-container">
          <textarea
            className="what-if-textarea"
            value={whatIfText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Let your imagination run wild! Write your creative answer here..."
          />
          
          <button 
            className="settings-button settings-button-lg what-if-send-button"
            onClick={handleSendResponse}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatIfSection;