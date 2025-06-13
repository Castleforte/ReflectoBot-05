import React, { useState, useRef, useEffect } from 'react';
import DrawingPreviewModal from './DrawingPreviewModal';

interface DrawItOutSectionProps {
  onClose: () => void;
  setRobotSpeech: React.Dispatch<React.SetStateAction<string>>;
  onBadgeEarned: (badgeId: string) => void;
  onMeaningfulAction: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  color: string;
  size: number;
  points: Point[];
}

const colors = [
  '#ff3333', // Red
  '#ff66cc', // Pink
  '#ffcc66', // Peach
  '#ff9933', // Orange
  '#3366ff', // Blue
  '#00ffff', // Cyan
  '#9966ff', // Purple
  '#99ff33'  // Green
];

const brushSizes = [2, 4, 8]; // Small, Medium, Large

function DrawItOutSection({ onClose, setRobotSpeech, onBadgeEarned, onMeaningfulAction }: DrawItOutSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ff3333');
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser'>('brush');
  const [currentBrushSize, setCurrentBrushSize] = useState(4);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [showBrushSizeSelector, setShowBrushSizeSelector] = useState(false);
  const [showEraserSizeSelector, setShowEraserSizeSelector] = useState(false);
  const [showDrawingPreview, setShowDrawingPreview] = useState(false);
  const [savedDrawingDataUrl, setSavedDrawingDataUrl] = useState('');
  const [selectorTimeout, setSelectorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
  const [hasUsedUndoThisSession, setHasUsedUndoThisSession] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 700;
    canvas.height = 400;

    // Set initial canvas background
    ctx.fillStyle = '#111122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const point = getCanvasCoordinates(e);
    const newStroke: Stroke = {
      color: currentTool === 'eraser' ? '#111122' : currentColor,
      size: currentBrushSize,
      points: [point]
    };
    
    setCurrentStroke(newStroke);

    // Track meaningful action for Focus Finder
    onMeaningfulAction();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !currentStroke) return;

    const point = getCanvasCoordinates(e);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    };
    
    setCurrentStroke(updatedStroke);
    drawStroke(updatedStroke);
  };

  const endDrawing = () => {
    if (!isDrawing || !currentStroke) return;
    
    setIsDrawing(false);
    
    // Save current state for undo
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]); // Clear redo stack when new action is performed
    
    // Add completed stroke to strokes array
    setStrokes(prev => [...prev, currentStroke]);
    setCurrentStroke(null);
  };

  const drawStroke = (stroke: Stroke) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || stroke.points.length < 2) return;

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();
  };

  const redrawCanvas = (strokesArray: Stroke[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Clear canvas and set background
    ctx.fillStyle = '#111122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokesArray.forEach(stroke => {
      if (stroke.points.length >= 2) {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        
        ctx.stroke();
      }
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, strokes]);
    setUndoStack(prev => prev.slice(0, -1));
    setStrokes(previousState);
    redrawCanvas(previousState);

    // Track that undo was used this session
    setHasUsedUndoThisSession(true);

    // Track meaningful action for Focus Finder
    onMeaningfulAction();
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack(prev => prev.slice(0, -1));
    setStrokes(nextState);
    redrawCanvas(nextState);

    // Track meaningful action for Focus Finder
    onMeaningfulAction();
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture canvas as data URL
    const dataUrl = canvas.toDataURL('image/png');
    setSavedDrawingDataUrl(dataUrl);
    setShowDrawingPreview(true);

    // Update robot speech
    setRobotSpeech("Amazing artwork! I love seeing your creativity come to life. Your drawing is ready to save!");

    // Track meaningful action for Focus Finder
    onMeaningfulAction();
  };

  const handleDownloadDrawing = () => {
    if (!savedDrawingDataUrl) return;

    // Create download link
    const link = document.createElement('a');
    link.download = 'my-reflectobot-drawing.png';
    link.href = savedDrawingDataUrl;
    link.click();

    // Close modal and update robot speech
    setShowDrawingPreview(false);
    setRobotSpeech("Perfect! Your drawing has been saved to your device. You're such a talented artist!");

    // Track drawing save for calm_creator badge
    onBadgeEarned('calm_creator');
    
    // Track colors used for creative_spark badge
    if (usedColors.size >= 5) {
      onBadgeEarned('creative_spark');
    }

    // Track bounce_back badge if undo was used this session
    if (hasUsedUndoThisSession) {
      onBadgeEarned('bounce_back');
      setHasUsedUndoThisSession(false); // Reset for next drawing session
    }

    // Reset used colors for next drawing
    setUsedColors(new Set());
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setCurrentTool('brush');
    // Track colors used in current drawing
    setUsedColors(prev => new Set([...prev, color]));
  };

  const handleBrushTool = () => {
    setCurrentTool('brush');
    // Toggle brush size selector
    if (showBrushSizeSelector) {
      setShowBrushSizeSelector(false);
    } else {
      setShowBrushSizeSelector(true);
      setShowEraserSizeSelector(false);
    }
  };

  const handleEraserTool = () => {
    setCurrentTool('eraser');
    // Toggle eraser size selector
    if (showEraserSizeSelector) {
      setShowEraserSizeSelector(false);
    } else {
      setShowEraserSizeSelector(true);
      setShowBrushSizeSelector(false);
    }
  };

  const handleBrushSizeChange = (size: number) => {
    setCurrentBrushSize(size);
    setShowBrushSizeSelector(false);
    setShowEraserSizeSelector(false);
  };

  const handleSelectorMouseLeave = () => {
    // Start a timer to hide the selector after 2 seconds
    const timeout = setTimeout(() => {
      setShowBrushSizeSelector(false);
      setShowEraserSizeSelector(false);
    }, 2000);
    setSelectorTimeout(timeout);
  };

  const handleSelectorMouseEnter = () => {
    // Clear the timeout if mouse re-enters
    if (selectorTimeout) {
      clearTimeout(selectorTimeout);
      setSelectorTimeout(null);
    }
  };

  return (
    <div className="draw-it-out-section">
      <div className="draw-it-out-content">
        <div className="draw-it-out-header">
          <h1 className="draw-it-out-title">Draw What You're Feeling</h1>
          <button 
            className="save-drawing-button"
            onClick={handleSaveDrawing}
          >
            <img src="/Save-icon.png" alt="Save" className="button-icon" />
            Save Drawing
          </button>
        </div>

        <div className="drawing-canvas-container">
          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>

        <div className="drawing-controls">
          <div className="color-swatches">
            {colors.map((color) => (
              <button
                key={color}
                className={`color-swatch ${currentColor === color && currentTool === 'brush' ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>

          <div className="tool-buttons">
            <div 
              className="tool-button-container"
              onMouseLeave={handleSelectorMouseLeave}
              onMouseEnter={handleSelectorMouseEnter}
            >
              <button
                className={`tool-button ${currentTool === 'brush' ? 'active' : ''}`}
                onClick={handleBrushTool}
                aria-label="Brush tool"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
                </svg>
              </button>
              {showBrushSizeSelector && (
                <div className="brush-size-selector">
                  {brushSizes.map((size, index) => (
                    <button
                      key={size}
                      className={`brush-size-option ${currentBrushSize === size ? 'active' : ''}`}
                      onClick={() => handleBrushSizeChange(size)}
                      aria-label={`${index === 0 ? 'Small' : index === 1 ? 'Medium' : 'Large'} brush size`}
                    >
                      <div 
                        className="brush-size-circle"
                        style={{ 
                          width: `${8 + index * 4}px`, 
                          height: `${8 + index * 4}px` 
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div 
              className="tool-button-container"
              onMouseLeave={handleSelectorMouseLeave}
              onMouseEnter={handleSelectorMouseEnter}
            >
              <button
                className={`tool-button ${currentTool === 'eraser' ? 'active' : ''}`}
                onClick={handleEraserTool}
                aria-label="Eraser tool"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-6.36-6.36-3.54 3.36z"/>
                </svg>
              </button>
              {showEraserSizeSelector && (
                <div className="brush-size-selector">
                  {brushSizes.map((size, index) => (
                    <button
                      key={size}
                      className={`brush-size-option ${currentBrushSize === size ? 'active' : ''}`}
                      onClick={() => handleBrushSizeChange(size)}
                      aria-label={`${index === 0 ? 'Small' : index === 1 ? 'Medium' : 'Large'} eraser size`}
                    >
                      <div 
                        className="brush-size-circle"
                        style={{ 
                          width: `${8 + index * 4}px`, 
                          height: `${8 + index * 4}px` 
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              className="tool-button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              aria-label="Undo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
              </svg>
            </button>
            <button
              className="tool-button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              aria-label="Redo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawing Preview Modal */}
      {showDrawingPreview && (
        <DrawingPreviewModal 
          onClose={() => setShowDrawingPreview(false)}
          drawingDataUrl={savedDrawingDataUrl}
          onDownload={handleDownloadDrawing}
        />
      )}
    </div>
  );
}

export default DrawItOutSection;