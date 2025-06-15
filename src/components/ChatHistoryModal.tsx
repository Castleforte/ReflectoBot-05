import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { generatePdf } from '../utils/pdfGenerator';
import { ConversationTurn } from '../types';
import { updateProgress, loadProgress, trackChatHistoryVisit } from '../utils/progressManager';

interface ChatHistoryModalProps {
  onClose: () => void;
  chatHistory: ConversationTurn[];
  onBadgeEarned: (badgeId: string) => void;
}

function ChatHistoryModal({ onClose, chatHistory, onBadgeEarned }: ChatHistoryModalProps) {
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Track Chat History visit when modal opens
  useEffect(() => {
    console.log('📖 Chat History modal opened - tracking visit');
    trackChatHistoryVisit();
    
    // Check if Good Listener badge should be triggered
    onBadgeEarned('good_listener');
  }, [onBadgeEarned]);

  const handleDownloadHistory = async () => {
    if (pdfContentRef.current) {
      try {
        await generatePdf(pdfContentRef.current, 'reflectobot-chat-history.pdf');
        
        console.log('📝 Chat PDF exported');
        
        // ✅ Immediately update the export count
        const progress = loadProgress();
        updateProgress({ pdfExportCount: progress.pdfExportCount + 1 });
        
        console.log('📈 Export count incremented:', progress.pdfExportCount + 1);
        
        // ✅ Immediately check for Great Job badge - ONLY called here
        onBadgeEarned('great_job');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
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
            <img src="/Chat-icon.png" alt="Chat" className="grown-up-modal-icon" />
            <h1 className="grown-up-modal-title">Chat History</h1>
          </div>

          <h2 className="grown-up-modal-subtitle">Your Conversation</h2>

          <div className="grown-up-modal-body">
            <p className="grown-up-modal-intro">
              Here are all the messages you've shared with ReflectoBot during this session. 
              Your thoughts and feelings are important, and this is your space to reflect on them.
            </p>

            <div className="grown-up-modal-section">
              <h3 className="grown-up-modal-section-title">Your Messages:</h3>
              <div className="chat-history-text-box">
                {chatHistory.length > 0 ? (
                  chatHistory.map((turn, index) => (
                    <div key={turn.id} className="chat-history-message">
                      <span className="chat-history-message-number">{index + 1}.</span>
                      <div className="chat-history-message-content">
                        <div className="mb-2">
                          <span className="chat-history-message-sender bot">Prompt:</span>
                          <span className="chat-history-message-text"> {turn.promptText}</span>
                        </div>
                        <div className="mb-2">
                          <span className="chat-history-message-sender user">You:</span>
                          <span className="chat-history-message-text"> {turn.userMessage}</span>
                        </div>
                        <div className="mb-2">
                          <span className="chat-history-message-sender bot">ReflectoBot:</span>
                          <span className="chat-history-message-text"> {turn.botResponse}</span>
                        </div>
                        <span className="chat-history-message-timestamp">{turn.timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="chat-history-empty">No messages yet. Start chatting with ReflectoBot to see your conversation history here!</p>
                )}
              </div>
            </div>

            <button 
              className="grown-up-modal-download-button"
              onClick={handleDownloadHistory}
            >
              Download Chat History
            </button>
          </div>
        </div>
      </div>

      {/* Hidden PDF Content */}
      <div ref={pdfContentRef} className="pdf-content">
        <div className="pdf-header">
          <h1 className="pdf-title">💬 ReflectoBot Chat History</h1>
          <h2 className="pdf-subtitle">Your Conversation Journal</h2>
          <div className="pdf-intro">
            <p>This document contains your conversations with ReflectoBot.</p>
            <p>Think of it as your personal journal of thoughts, feelings, and insights.</p>
            <p>You can look back anytime to see how you've grown, what's been on your mind, or even to remember a good piece of advice from your AI buddy.</p>
            <p><strong>Let's take a stroll down memory lane!</strong></p>
          </div>
        </div>

        <div className="pdf-messages">
          {chatHistory.length > 0 ? (
            chatHistory.map((turn, index) => (
              <div key={turn.id} className="pdf-message-group" style={{ marginBottom: '1.5rem' }}>
                <div className="pdf-message bot">
                  <div className="pdf-message-header">
                    <span className="pdf-message-sender">🤖 Prompt</span>
                    <span className="pdf-message-timestamp">{turn.timestamp}</span>
                  </div>
                  <div className="pdf-message-text">{turn.promptText}</div>
                </div>
                <div className="pdf-message user">
                  <div className="pdf-message-header">
                    <span className="pdf-message-sender">👤 You</span>
                  </div>
                  <div className="pdf-message-text">{turn.userMessage}</div>
                </div>
                <div className="pdf-message bot">
                  <div className="pdf-message-header">
                    <span className="pdf-message-sender">🤖 ReflectoBot</span>
                  </div>
                  <div className="pdf-message-text">{turn.botResponse}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="pdf-empty">No messages yet. Start chatting with ReflectoBot!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistoryModal;