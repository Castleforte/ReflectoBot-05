import React from 'react';

interface MobileNavButtonsProps {
  onNavButtonClick: (screen: 'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges') => void;
  currentScreen: 'welcome' | 'settings' | 'chat' | 'daily-checkin' | 'what-if' | 'draw-it-out' | 'challenges';
}

function MobileNavButtons({ onNavButtonClick, currentScreen }: MobileNavButtonsProps) {
  return (
    <div className="mobile-nav-buttons lg:hidden">
      <div className="nav-buttons">
        <button 
          className={`nav-button ${currentScreen === 'chat' ? 'nav-button-active' : ''}`}
          onClick={() => onNavButtonClick('chat')}
        >
          <img src="/Chat-icon.png" alt="Chat" className="nav-button-icon" />
          <span className="nav-button-text">Chat</span>
        </button>
        <button 
          className={`nav-button ${currentScreen === 'daily-checkin' ? 'nav-button-active' : ''}`}
          onClick={() => onNavButtonClick('daily-checkin')}
        >
          <img src="/Mood-icon.png" alt="Daily Check-In" className="nav-button-icon" />
          <span className="nav-button-text nav-button-text-multiline">Daily<br />Check-In</span>
        </button>
        <button 
          className={`nav-button ${currentScreen === 'what-if' ? 'nav-button-active' : ''}`}
          onClick={() => onNavButtonClick('what-if')}
        >
          <img src="/Pencil-icon.png" alt="What If...?" className="nav-button-icon" />
          <span className="nav-button-text max-lg:whitespace-normal max-lg:text-center">What If...?</span>
        </button>
        <button 
          className={`nav-button ${currentScreen === 'draw-it-out' ? 'nav-button-active' : ''}`}
          onClick={() => onNavButtonClick('draw-it-out')}
        >
          <img src="/Palette-icon.png" alt="Draw It Out" className="nav-button-icon" />
          <span className="nav-button-text max-lg:whitespace-normal max-lg:text-center">Draw It<br />Out</span>
        </button>
        <button 
          className={`nav-button ${currentScreen === 'challenges' ? 'nav-button-active' : ''}`}
          onClick={() => onNavButtonClick('challenges')}
        >
          <img src="/Trophy-icon.png" alt="Challenges" className="nav-button-icon" />
          <span className="nav-button-text">Challenges</span>
        </button>
        <button className="nav-button" onClick={() => onNavButtonClick('welcome')}>
          <img src="/Robot-icon.png" alt="My Bot" className="nav-button-icon" />
          <span className="nav-button-text">My Bot</span>
        </button>
      </div>
    </div>
  );
}

export default MobileNavButtons;