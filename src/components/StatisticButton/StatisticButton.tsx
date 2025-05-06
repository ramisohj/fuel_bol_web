import { useState, useRef, useEffect } from 'react';
import './StatisticButton.css';

interface StatisticButtonProps {
  buttonName: string,
  statsAPI: string,
  fuelStationId: number;
  fuelStationName: string;
  fuelType: number;
}

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

const StatisticButton = ({buttonName, statsAPI, fuelStationId, fuelStationName, fuelType }: StatisticButtonProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: window.innerWidth/2 - 1200, y: 100 });
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeDirection | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const popupRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const handleResize = () => {
      if (popupRef.current && !isMaximized) {
        const { x, y } = position;
        const { width, height } = size;
        const maxX = window.innerWidth - width;
        const maxY = window.innerHeight - height;
        
        setPosition({
          x: Math.min(Math.max(0, x), maxX),
          y: Math.min(Math.max(0, y), maxY)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, size, isMaximized]);

  const startDrag = (e: React.MouseEvent) => {
    if (isMaximized || isResizing) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const startResize = (direction: ResizeDirection, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const onResize = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    const minWidth = 300;
    const minHeight = 200;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

    switch (isResizing) {
      case 'n':
        newHeight = Math.max(minHeight, resizeStart.height - dy);
        newY = position.y + (size.height - newHeight);
        break;
      case 'ne':
        newWidth = Math.max(minWidth, resizeStart.width + dx);
        newHeight = Math.max(minHeight, resizeStart.height - dy);
        newY = position.y + (size.height - newHeight);
        break;
      case 'e':
        newWidth = Math.max(minWidth, resizeStart.width + dx);
        break;
      case 'se':
        newWidth = Math.max(minWidth, resizeStart.width + dx);
        newHeight = Math.max(minHeight, resizeStart.height + dy);
        break;
      case 's':
        newHeight = Math.max(minHeight, resizeStart.height + dy);
        break;
      case 'sw':
        newWidth = Math.max(minWidth, resizeStart.width - dx);
        newHeight = Math.max(minHeight, resizeStart.height + dy);
        newX = position.x + (size.width - newWidth);
        break;
      case 'w':
        newWidth = Math.max(minWidth, resizeStart.width - dx);
        newX = position.x + (size.width - newWidth);
        break;
      case 'nw':
        newWidth = Math.max(minWidth, resizeStart.width - dx);
        newHeight = Math.max(minHeight, resizeStart.height - dy);
        newX = position.x + (size.width - newWidth);
        newY = position.y + (size.height - newHeight);
        break;
    }

    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };

  const endResize = () => {
    setIsResizing(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', endDrag);
    }
    if (isResizing) {
      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', endResize);
    }

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', endResize);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const fetchImage = async () => {
    // Check cache first
    const cacheKey = `${statsAPI}-${fuelStationId}-${fuelType}`;
    if (imageCache.current.has(cacheKey)) {
      setImageUrl(imageCache.current.get(cacheKey) || null);
      setShowPopup(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(statsAPI, {
        cache: 'force-cache' // Utilize browser cache
      });
      
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      imageCache.current.set(cacheKey, objectUrl);
      
      setImageUrl(objectUrl);
      setShowPopup(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch image');
    } finally {
      setLoading(false);
    }
  };

  const toggleMaximize = () => {
    if (!isMaximized && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    return () => {
      if (imageUrl && !imageCache.current.has(imageUrl)) {
        URL.revokeObjectURL(imageUrl);
      }
      imageCache.current.forEach(url => URL.revokeObjectURL(url));
      imageCache.current.clear();
    };
  }, []);

  const ResizeHandle = ({ direction }: { direction: ResizeDirection }) => (
    <div 
      className={`resize-handle resize-${direction}`}
      onMouseDown={(e) => startResize(direction, e)}
    />
  );

  return (
    <div className="fuel-stats-container">
      <button
        onClick={fetchImage}
        disabled={loading}
        className={`stats-button ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Loading...
          </>
        ) : (
          buttonName
        )}
      </button>

      {error && <div className="error-message">{error}</div>}

      {showPopup && (
        <div 
          className={`popup-overlay ${isMaximized ? 'maximized' : ''}`}
          onClick={closePopup}
        >
          <div
            ref={popupRef}
            className={`popup ${isMinimized ? 'minimized' : ''}`}
            style={{
              width: isMaximized ? '95vw' : `${size.width}px`,
              height: isMaximized ? '95vh' : (isMinimized ? '40px' : `${size.height}px`),
              transform: isMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : (isResizing ? `${isResizing}-resize` : 'default')
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="popup-header"
              onMouseDown={startDrag}
            >
              <h3>{fuelStationName}</h3>
              <div className="popup-controls">
                <button className="control-button" onClick={toggleMinimize}>
                  {isMinimized ? '🗖' : '🗕'}
                </button>
                <button className="control-button" onClick={toggleMaximize}>
                  {isMaximized ? '🗗' : '🗖'}
                </button>
                <button className="control-button close" onClick={closePopup}>
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="popup-content">
                {imageUrl && <img src={imageUrl} alt="Fuel Statistics Chart" />}
                <ResizeHandle direction="n" />
                <ResizeHandle direction="ne" />
                <ResizeHandle direction="e" />
                <ResizeHandle direction="se" />
                <ResizeHandle direction="s" />
                <ResizeHandle direction="sw" />
                <ResizeHandle direction="w" />
                <ResizeHandle direction="nw" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticButton;