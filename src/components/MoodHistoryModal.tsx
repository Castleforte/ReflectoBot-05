import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { moodData } from '../moodData';
import { generatePdf } from '../utils/pdfGenerator';
import { MoodEntry } from '../types';
import { updateProgress, loadProgress, trackMoodHistoryVisit } from '../utils/progressManager';

interface MoodHistoryModalProps {
  onClose: () => void;
  moodHistory: MoodEntry[];
  onBadgeEarned: (badgeId: string) => void;
}

function MoodHistoryModal({ onClose, moodHistory, onBadgeEarned }: MoodHistoryModalProps) {
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Track Mood History visit when modal opens
  useEffect(() => {
    console.log('📖 Mood History modal opened - tracking visit');
    trackMoodHistoryVisit();
    
    // Check if Good Listener badge should be triggered
    onBadgeEarned('good_listener');
  }, [onBadgeEarned]);

  const handleDownloadHistory = async () => {
    if (pdfContentRef.current) {
      try {
        await generatePdf(pdfContentRef.current, 'reflectobot-mood-history.pdf');
        
        console.log('📝 Mood PDF exported');
        
        // ✅ Immediately update the export count
        const progress = loadProgress();
        updateProgress({ pdfExportCount: progress.pdfExportCount + 1 });
        
        console.log('📈 Export count incremented:', progress.pdfExportCount + 1);
        
        // ✅ Immediately check for Great Job badge - ONLY called here
        onBadgeEarned('great_job');
        
        // Track mood history download for mood_mapper badge (additional trigger)
        onBadgeEarned('mood_mapper');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  const getMoodIcon = (moodName: string) => {
    const mood = moodData.find(m => m.name === moodName);
    return mood ? mood.colorImage : '/Mood-Emojis_0001s_0007_happy-color.png';
  };

  const getMoodEmoji = (moodName: string) => {
    const mood = moodData.find(m => m.name === moodName);
    return mood ? mood.emoji : '😊';
  };

  return (
    <div className="grown-up-modal-overlay" onClick={onClose}>
      <div className="grown-up-modal-container">
        <div className="grown-up-modal-content" onClick={e => e.stopPropagation()}>
          <button 
            className="absolute top-5 right-5 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 lg:w-12 lg:h-12 grown-up-modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} strokeWidth={4} />
          </button>

          <div className="grown-up-modal-header">
            <img src="/Mood-icon.png" alt="Mood" className="grown-up-modal-icon" />
            <h1 className="grown-up-modal-title">Mood History</h1>
          </div>

          <h2 className="grown-up-modal-subtitle">Your Daily Check-Ins</h2>

          <div className="grown-up-modal-body">
            <p className="grown-up-modal-intro">
              Here are all your daily mood check-ins with ReflectoBot. 
              Each entry shows how you were feeling and what you shared during that moment.
            </p>

            <div className="grown-up-modal-section">
              <h3 className="grown-up-modal-section-title">Your Mood Journey:</h3>
              <div className="mood-history-text-box">
                {moodHistory.length > 0 ? (
                  moodHistory.map((entry, index) => (
                    <div key={index} className="mood-history-entry">
                      <div className="mood-history-header">
                        <img 
                          src={getMoodIcon(entry.moodName)}
                          alt={entry.moodName}
                          className="mood-history-icon"
                        />
                        <div className="mood-history-meta">
                          <span className="mood-history-number">{index + 1}.</span>
                          <span className="mood-history-mood">{entry.moodName.charAt(0).toUpperCase() + entry.moodName.slice(1)}</span>
                          <span className="mood-history-timestamp">{entry.timestamp}</span>
                        </div>
                      </div>
                      <p className="mood-history-text">{entry.checkInText}</p>
                    </div>
                  ))
                ) : (
                  <p className="mood-history-empty">No mood check-ins yet. Start your daily check-in to see your mood journey here!</p>
                )}
              </div>
            </div>

            <button 
              className="grown-up-modal-download-button"
              onClick={handleDownloadHistory}
            >
              Download Mood History
            </button>
          </div>
        </div>
      </div>

      {/* Hidden PDF Content */}
      <div ref={pdfContentRef} className="pdf-content">
        <div className="pdf-header">
          <h1 className="pdf-title">💜 ReflectoBot Mood History</h1>
          <h2 className="pdf-subtitle">Your Daily Check-Ins</h2>
          <div className="pdf-intro">
            <p>This is your personal mood journey with ReflectoBot!</p>
            <p>Each check-in shows how you were feeling and what you shared in that moment.</p>
            <p>Reflecting on your moods can help you understand yourself better, notice patterns, and celebrate your growth — one emoji at a time! 😄</p>
            <p><strong>Let's take a look at what you've been feeling lately...</strong></p>
          </div>
        </div>

        <div className="pdf-mood-entries">
          {moodHistory.length > 0 ? (
            moodHistory.map((entry, index) => (
              <div key={index} className="pdf-mood-entry">
                <div className="pdf-mood-header">
                  <span className="pdf-mood-emoji">{getMoodEmoji(entry.moodName)}</span>
                  <div className="pdf-mood-meta">
                    <span className="pdf-mood-number">#{index + 1}</span>
                    <span className="pdf-mood-name">{entry.moodName.charAt(0).toUpperCase() + entry.moodName.slice(1)}</span>
                    <span className="pdf-mood-timestamp">{entry.timestamp}</span>
                  </div>
                </div>
                <div className="pdf-mood-text">{entry.checkInText}</div>
              </div>
            ))
          ) : (
            <p className="pdf-empty">No mood check-ins yet. Start your daily check-in!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodHistoryModal;