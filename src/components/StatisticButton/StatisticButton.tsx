import { useState, useRef, useEffect } from 'react';
import './StatisticButton.css';

interface StatisticButtonProps {
  buttonName: string,
  statsAPI: string,
  fuelStationId: number;
  fuelStationName: string;
  fuelType: number;
}

const StatisticButton = ({ buttonName, statsAPI, fuelStationId, fuelStationName, fuelType }: StatisticButtonProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const popupRef = useRef<HTMLDivElement>(null);

  const startDrag = (e: React.MouseEvent) => {
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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', endDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', endDrag);
    };
  }, [isDragging, dragOffset]);

  const fetchImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(statsAPI);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      setImageUrl(objectUrl);
      setShowPopup(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch image');
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const getMaxDimensions = () => {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;
    return { maxWidth, maxHeight };
  };

  const getScaledDimensions = (imgWidth: number, imgHeight: number) => {
    const { maxWidth, maxHeight } = getMaxDimensions();
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    
    return {
      width: imgWidth * ratio,
      height: imgHeight * ratio
    };
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    setImageSize({ width: naturalWidth, height: naturalHeight });

    const { maxWidth, maxHeight } = getMaxDimensions();
    
    if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
      const scaled = getScaledDimensions(naturalWidth, naturalHeight);
      setSize({
        width: scaled.width,
        height: scaled.height + 50,
      });
    } else {
      setSize({
        width: naturalWidth,
        height: naturalHeight + 50,
      });
    }
  };

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
        <div className="popup-overlay" onClick={closePopup}>
          <div
            ref={popupRef}
            className="popup"
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              transform: `translate(${position.x}px, ${position.y}px)`,
              position: 'fixed',
              top: '120px',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxSizing: 'border-box',
              margin: '0 auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header" onMouseDown={startDrag}>
              <h3>{fuelStationName}</h3>
              <button className="control-button close" onClick={closePopup}>
                ✕
              </button>
            </div>

            <div className="popup-content">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Fuel Statistics Chart"
                  onLoad={handleImageLoad}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: `${size.height - 50}px`,
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticButton;