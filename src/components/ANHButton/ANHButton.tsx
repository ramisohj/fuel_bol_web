import { useState } from 'react';
import { API_ENDPOINTS } from '../../constants';
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
    fuelStationId: number;
    fuelType: number;
  }

const ANHButton = ({fuelStationId, fuelType}: ANHButtonProps) => {
  const [totalBsa, setTotalBsa] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={fetchBalances}
        disabled={loading}
        className='anh-button'
      >
        {loading ? 'Loading...' : 'ANH Fuel Level'}
      </button>

      {error && <span style={{ color: 'red' }}>{error}</span>}

      {totalBsa !== null && (
        <span className='anh-span'>
          Level: {totalBsa.toFixed(2)} [L]
        </span>
      )}
    </div>
  );
};

export default ANHButton;