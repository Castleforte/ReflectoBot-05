import React, { useState, useEffect } from 'react';
import { moodData, moodResponses, sentenceStarters } from '../moodData';
import { MoodEntry } from '../types';
import { updateProgress, loadProgress } from '../utils/progressManager';

interface DailyCheckInSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
  moodHistory: MoodEntry[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  onShowMoodHistory: () => void;
  onBadgeEarned: (badgeId: string) => void;
  onEngagement: () => void;
}

function DailyCheckInSection({ onClose, setRobotSpeech, moodHistory, setMoodHistory, onShowMoodHistory, onBadgeEarned, onEngagement }: DailyCheckInSectionProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState<string>('');
  const [hasUserTyped, setHasUserTyped] = useState<boolean>(false);

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('reflectobot-mood-history');
    if (savedMoodHistory) {
      try {
        const parsedHistory = JSON.parse(savedMoodHistory);
        if (Array.isArray(parsedHistory)) {
          setMoodHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Error loading mood history from localStorage:', error);
      }
    }
  }, [setMoodHistory]);

  // Save mood history to localStorage whenever moodHistory updates
  useEffect(() => {
    localStorage.setItem('reflectobot-mood-history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleMoodSelect = (moodName: string) => {
    setSelectedMood(moodName);
    setRobotSpeech(moodResponses[moodName]);
    
    // Only auto-fill if user hasn't typed anything yet
    if (!hasUserTyped) {
      setCheckInText(sentenceStarters[moodName]);
    }

    // Track engagement for Focus Finder
    onEngagement();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCheckInText(e.target.value);
    setHasUserTyped(true);

    // Track engagement for Focus Finder
    onEngagement();
  };

  const handleSendCheckIn = () => {
    if (selectedMood || checkInText.trim()) {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newEntry: MoodEntry = {
        moodName: selectedMood || 'neutral',
        checkInText: checkInText.trim() || 'No additional notes',
        timestamp: timestamp
      };

      // Add the new entry to mood history
      setMoodHistory(prevHistory => [...prevHistory, newEntry]);

      // Track engagement for Focus Finder
      onEngagement();

      // ✅ FIXED: Check word count for Mood Mapper badge
      const trimmedText = checkInText.trim();
      const wordCount = trimmedText.split(/\s+/).filter(word => word.length > 0).length;
      
      console.log(`📝 Mood check-in submitted: "${trimmedText}"`);
      console.log(`📊 Word count: ${wordCount}`);

      // ✅ FIXED: Update progress for mood_mapper badge IMMEDIATELY after submission
      const currentProgress = loadProgress();
      console.log('🧠 Mood Check-In Count BEFORE:', currentProgress.moodCheckInCount);
      
      updateProgress({ 
        moodCheckInCount: currentProgress.moodCheckInCount + 1 
      });
      
      const updatedProgress = loadProgress();
      console.log('🧠 Mood Check-In Count AFTER:', updatedProgress.moodCheckInCount);
      console.log('🟢 Mood Mapper badge earned?', updatedProgress.badges['mood_mapper']);

      // ✅ Check for mood_mapper badge if word count is 25+
      if (wordCount >= 25) {
        console.log('✅ Mood Mapper condition met (25+ words)');
        onBadgeEarned('mood_mapper');
      }

      // Check for specific mood badges
      if (selectedMood === 'happy') {
        // For Stay Positive badge, check if the message is 15+ words about happiness
        if (wordCount >= 15) {
          // Update progress for stay_positive badge
          updateProgress({ 
            stayPositiveMessageCount: updatedProgress.stayPositiveMessageCount + 1,
            hasLongPositiveMessage: true
          });
          onBadgeEarned('stay_positive');
        }
      }
      
      if (selectedMood === 'love') {
        // For Kind Heart badge, check if the message contains love-related content and is 25+ words
        
        // Check if the message contains love-related keywords
        const loveKeywords = ['love', 'adore', 'cherish', 'treasure', 'appreciate', 'care', 'heart', 'affection', 'dear', 'precious'];
        const containsLoveContent = loveKeywords.some(keyword => 
          trimmedText.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (containsLoveContent && wordCount >= 25) {
          // Update progress with the word count
          updateProgress({ 
            kindHeartWordCount: Math.max(updatedProgress.kindHeartWordCount, wordCount)
          });
          
          onBadgeEarned('kind_heart'); // Love emoji + 25+ words about love
        }
      }
      
      // Reset form
      setSelectedMood(null);
      setCheckInText('');
      setHasUserTyped(false);
      setRobotSpeech("Thanks for checking in! Your feelings matter, and I'm here whenever you want to share more.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCheckIn();
    }
  };

  const handleMoodHistory = () => {
    onShowMoodHistory();
  };

  const getEmojiImage = (mood: any) => {
    // Show color image if selected or hovered
    if (selectedMood === mood.name || hoveredMood === mood.name) {
      return mood.colorImage;
    }
    return mood.blueImage;
  };

  return (
    <div className="daily-checkin-section">
      <div className="daily-checkin-content">
        <div className="daily-checkin-header">
          <h1 className="daily-checkin-title">How Do You Feel Today?</h1>
          <div className="daily-checkin-buttons">
            <button 
              className="settings-button chat-action-button"
              onClick={handleMoodHistory}
            >
              <img src="/Mood-icon.png" alt="Mood History" className="button-icon" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none">Mood</span>
                <span className="text-2xl font-bold leading-none">History</span>
              </div>
            </button>
          </div>
        </div>

        <div className="emoji-grid">
          {moodData.map((mood) => (
            <button
              key={mood.name}
              className={`emoji-button ${selectedMood === mood.name ? 'emoji-selected' : ''}`}
              onClick={() => handleMoodSelect(mood.name)}
              onMouseEnter={() => setHoveredMood(mood.name)}
              onMouseLeave={() => setHoveredMood(null)}
              aria-label={`Select ${mood.name} mood`}
            >
              <img 
                src={getEmojiImage(mood)}
                alt={mood.name}
                className="emoji-image"
              />
            </button>
          ))}
        </div>

        <div className="daily-checkin-input-container">
          <textarea
            className="daily-checkin-textarea"
            value={checkInText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Choose an emoji or write how you're feeling here..."
          />
          
          <button 
            className="settings-button settings-button-lg daily-checkin-send-button"
            onClick={handleSendCheckIn}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyCheckInSection;