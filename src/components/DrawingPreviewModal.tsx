import React, { useRef } from 'react';
import { X } from 'lucide-react';

interface DrawingPreviewModalProps {
  onClose: () => void;
  drawingDataUrl: string;
  onDownload: () => void;
}

function DrawingPreviewModal({ onClose, drawingDataUrl, onDownload }: DrawingPreviewModalProps) {
  return (
    <div className="grown-up-modal-overlay" onClick={onClose}>
      <div className="grown-up-modal-container">
        <div className="drawing-preview-modal-content" onClick={e => e.stopPropagation()}>
          <button 
            className="absolute top-5 right-5 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 lg:w-12 lg:h-12 grown-up-modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} strokeWidth={4} />
          </button>

          <div className="grown-up-modal-header">
            <img src="/Palette-icon.png" alt="Drawing" className="grown-up-modal-icon" />
            <h1 className="grown-up-modal-title">Your Amazing Drawing!</h1>
          </div>

          <div className="drawing-preview-body">
            <p className="drawing-preview-intro">
              Look at this incredible artwork you've created! Your feelings and creativity really shine through.
            </p>

            <div className="grown-up-modal-section">
              <div className="drawing-preview-container">
                <img 
                  src={drawingDataUrl} 
                  alt="Your drawing" 
                  className="drawing-preview-image"
                />
              </div>
            </div>

            <button 
              className="grown-up-modal-download-button"
              onClick={onDownload}
            >
              Download Drawing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingPreviewModal;