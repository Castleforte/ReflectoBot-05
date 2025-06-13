import React, { useState, useRef } from 'react';
import { resetSpecificBadge, exportProgress, importProgress, skipToChallenge } from '../utils/progressManager';

interface SettingsSectionProps {
  onClose: () => void;
  onShowGrownUpModal: () => void;
}

function SettingsSection({ onClose, onShowGrownUpModal }: SettingsSectionProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEraseProgress = () => {
    // Clear all ReflectoBot progress data
    localStorage.removeItem('reflectobot_progress');
    localStorage.removeItem('reflectobot-chat-messages');
    localStorage.removeItem('reflectobot-mood-history');
    
    // Show confirmation and reload
    alert('All progress has been erased! The app will now reload to reset everything.');
    window.location.reload();
  };

  const handleSaveSession = () => {
    try {
      exportProgress();
      alert('Your session has been saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('There was an error saving your session. Please try again.');
    }
  };

  const handleLoadSession = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importProgress(file);
        alert('Your session has been loaded successfully! The app will now reload.');
      } catch (error) {
        console.error('Error loading session:', error);
        alert('Error loading session file. Please check the file and try again.');
      }
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetSpecificBadge = () => {
    console.log('Reset specific badge button clicked');
    
    const badgeId = prompt(
      'Enter the badge ID to reset (e.g., "brave_voice", "deep_thinker", "stay_positive"):\n\n' +
      'Common badge IDs:\n' +
      '• brave_voice\n' +
      '• deep_thinker\n' +
      '• stay_positive\n' +
      '• focus_finder\n' +
      '• calm_creator\n' +
      '• mood_mapper\n' +
      '• reflecto_rookie\n' +
      '• what_if_explorer\n' +
      '• truth_spotter\n' +
      '• kind_heart\n' +
      '• great_job\n' +
      '• bounce_back\n' +
      '• good_listener\n' +
      '• creative_spark\n' +
      '• boost_buddy\n' +
      '• resilient\n' +
      '• goal_getter\n' +
      '• super_star'
    );

    console.log('User entered badge ID:', badgeId);

    if (badgeId && badgeId.trim()) {
      console.log('Calling resetSpecificBadge with:', badgeId.trim());
      const success = resetSpecificBadge(badgeId.trim());
      console.log('Reset result:', success);
      
      if (success) {
        alert(`Badge "${badgeId}" has been reset successfully! The page will reload to reflect changes.`);
        window.location.reload();
      } else {
        alert(`Failed to reset badge "${badgeId}". Please check the badge ID and try again. Check the console for more details.`);
      }
    } else {
      console.log('No badge ID entered or empty string');
    }
  };

  const handleSkipToChallenge = () => {
    console.log('Skip to challenge button clicked');
    
    const badgeId = prompt(
      'Enter the badge ID to skip to (e.g., "brave_voice", "deep_thinker", "stay_positive"):\n\n' +
      'Available badge IDs:\n' +
      '• calm_creator\n' +
      '• mood_mapper\n' +
      '• bounce_back\n' +
      '• reflecto_rookie\n' +
      '• focus_finder\n' +
      '• goal_getter\n' +
      '• great_job\n' +
      '• brave_voice\n' +
      '• what_if_explorer\n' +
      '• truth_spotter\n' +
      '• kind_heart\n' +
      '• boost_buddy\n' +
      '• stay_positive\n' +
      '• good_listener\n' +
      '• creative_spark\n' +
      '• deep_thinker\n' +
      '• resilient\n' +
      '• super_star'
    );

    console.log('User entered badge ID for skip:', badgeId);

    if (badgeId && badgeId.trim()) {
      console.log('Calling skipToChallenge with:', badgeId.trim());
      try {
        skipToChallenge(badgeId.trim());
      } catch (error) {
        console.error('Error skipping to challenge:', error);
        alert(`Failed to skip to challenge "${badgeId}". Please check the badge ID and try again.`);
      }
    } else {
      console.log('No badge ID entered or empty string');
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
        </div>

        <div className="settings-rows">
          <div className="settings-row">
            <div className="settings-label">
              <img src="/Save-icon copy.png" alt="Save icon" className="settings-icon" />
              <span>Save/Load Session</span>
            </div>
            <div className="settings-controls">
              <button className="settings-button" onClick={handleSaveSession}>
                <img src="/Save-icon copy.png" alt="Save icon" className="button-icon" />
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold leading-none">Save</span>
                  <span className="text-2xl font-bold leading-none">Session</span>
                </div>
              </button>
              <button className="settings-button" onClick={handleLoadSession}>
                <img src="/Load-icon.png" alt="Load icon" className="button-icon" />
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold leading-none">Load</span>
                  <span className="text-2xl font-bold leading-none">Session</span>
                </div>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Speaker-icon.png" alt="Sound icon" className="settings-icon" />
              <span>Sound On/Off</span>
            </div>
            <div className="settings-controls">
              <button
                className={`toggle-switch ${soundEnabled ? 'enabled' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-pressed={soundEnabled}
                role="switch"
              >
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Brain-icon.png" alt="Brain icon" className="settings-icon" />
              <span>Reset Progress</span>
            </div>
            <div className="settings-controls justify-center lg:justify-end">
              <button
                className="settings-button settings-button-lg danger"
                onClick={() => setShowResetModal(true)}
              >
                Erase My Progress
              </button>
              <button
                className="settings-button settings-button-lg"
                onClick={handleResetSpecificBadge}
                style={{ marginLeft: '10px' }}
              >
                Reset Specific Badge
              </button>
              <button
                className="settings-button settings-button-lg"
                onClick={handleSkipToChallenge}
                style={{ marginLeft: '10px' }}
              >
                Skip to Challenge
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <img src="/Shield-icon.png" alt="Grown-up access icon" className="settings-icon" />
              <span>Grown-Up Access</span>
            </div>
            <div className="settings-controls justify-center lg:justify-end">
              <button 
                className="settings-button settings-button-lg"
                onClick={onShowGrownUpModal}
              >
                I'm a Grown-Up
              </button>
            </div>
          </div>
        </div>

        <div className="settings-hint">
          <span className="text-[#a4f61e]">Want to come back here? Just tap the ReflectoBot logo anytime!</span>
        </div>
      </div>

      {/* Hidden file input for loading sessions */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <p className="modal-message">
              This will clear your badges and reset all your activities. It's like starting fresh!
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowResetModal(false)}
              >
                Don't Do It
              </button>
              <button
                className="modal-button danger"
                onClick={() => {
                  handleEraseProgress();
                  setShowResetModal(false);
                }}
              >
                Yes, Do It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsSection;