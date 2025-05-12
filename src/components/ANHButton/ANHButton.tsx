import { useState, useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '../../constants';
import { useTranslation } from 'react-i18next';
import './ANHButton.css';

interface ApiResponse {
  decCodigo: number;
  strMensaje: string;
  oResultado: {
    saldo_bsa: number;
    saldo_octano: number;
    saldo_planta: number;
    id_producto_bsa: number;
    id_producto_hydro: number;
    id_eess: number;
    id_entidad: number;
  }[];
}

interface ANHButtonProps {
  buttonName: string,
  fuelStationId: number;
  fuelType: number;
}

const ANHButton = ({ buttonName, fuelStationId, fuelType }: ANHButtonProps) => {
  const [totalBsa, setTotalBsa] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  
  const popupRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startPopupPos = useRef({ left: 0, top: 0 });

  const { t } = useTranslation();

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.ANH.GET_FUEL_STATION_DATA(fuelStationId, fuelType));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      const sum = data.oResultado.reduce((acc, item) => acc + item.saldo_bsa, 0);
      setTotalBsa(sum);
      setShowPopup(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (!showPopup || !popupRef.current) return;

    // Position the popup below the FuelStationCard and center it horizontally
    const popup = popupRef.current;
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.top = '200px'; // This positions it below the FuelStationCard
    popup.style.zIndex = '1000';
  }, [showPopup]);

  useEffect(() => {
    if (!showPopup) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!popupRef.current || !isDragging.current) return;

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      
      popupRef.current.style.left = `${startPopupPos.current.left + dx}px`;
      popupRef.current.style.top = `${startPopupPos.current.top + dy}px`;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };

    const headerText = headerTextRef.current;

    const handleHeaderMouseDown = (e: MouseEvent) => {
      if (popupRef.current) {
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        startPopupPos.current = {
          left: parseInt(popupRef.current.style.left || '0'),
          top: parseInt(popupRef.current.style.top || '0')
        };
        document.body.style.cursor = 'grabbing';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    if (headerText) headerText.addEventListener('mousedown', handleHeaderMouseDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (headerText) headerText.removeEventListener('mousedown', handleHeaderMouseDown);
    };
  }, [showPopup]);

  return (
    <div className="anh-container">
      <button
        onClick={fetchBalances}
        disabled={loading}
        className={`anh-button ${loading ? 'loading' : ''}`}
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

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div 
            ref={popupRef}
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              minWidth: '300px',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <div className="popup-header">
              <h3 ref={headerTextRef} className="header-text">
                {t('anhPopUpTitle')}
                {error ? (
                  <p className="error-message">{error}</p>
                ) : totalBsa !== null ? (
                  <p className="fuel-level-text">
                    <strong>{totalBsa.toFixed(2)} [L]</strong>
                  </p>
                ) : (
                  <p>No data available</p>
                )}
              </h3>
              <button className="close-button" onClick={closePopup}>
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ANHButton;