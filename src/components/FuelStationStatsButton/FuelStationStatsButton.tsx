import { useState } from 'react';
import { API_ENDPOINTS } from '../../constants';
import './FuelStationStatsButton.css';


interface StatsData {
  refill_time_daily_stats: {
    day: string;
    mean: string;
    median: string;
    min: string;
    max: string;
    std: string;
  };
  time_between_refill_empty_daily_stats: {
    day: string;
    mean: string;
    median: string;
    min: string;
    max: string;
    std: string;
  };
}

interface FuelStationStatsButtonProps {
  fuelStationId: number;
  fuelType: number;
}

const FuelStationStatsButton= ({fuelStationId, fuelType}: FuelStationStatsButtonProps) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.FUEL_STATION_STATS.GET_FUEL_STATISTICS(fuelStationId, fuelType));
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      let errorMessage = 'Failed to fetch statistics';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuel-stats-container">
      <button
        onClick={fetchStats}
        disabled={loading}
        className={`stats-button ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Loading...
          </>
        ) : (
          'Show Refill Statistics'
        )}
      </button>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <div className="stats-tables">
          <div className="stats-table">
            <h3>Daily Refill Time</h3>
            <table>
              <tbody>
                <TableRow label="Day" value={stats.refill_time_daily_stats.day} />
                <TableRow label="Average" value={stats.refill_time_daily_stats.mean} highlight />
                <TableRow label="Median" value={stats.refill_time_daily_stats.median} />
                <TableRow label="Earliest" value={stats.refill_time_daily_stats.min} highlight />
                <TableRow label="Latest" value={stats.refill_time_daily_stats.max} />
                <TableRow label="Variation" value={stats.refill_time_daily_stats.std} highlight />
              </tbody>
            </table>
          </div>

          <div className="stats-table">
            <h3>Fuel Refill Duration</h3>
            <table>
              <tbody>
                <TableRow label="Day" value={stats.time_between_refill_empty_daily_stats.day} />
                <TableRow label="Average" value={stats.time_between_refill_empty_daily_stats.mean} highlight />
                <TableRow label="Median" value={stats.time_between_refill_empty_daily_stats.median} />
                <TableRow label="Shortest" value={stats.time_between_refill_empty_daily_stats.min} highlight />
                <TableRow label="Longest" value={stats.time_between_refill_empty_daily_stats.max} />
                <TableRow label="Variation" value={stats.time_between_refill_empty_daily_stats.std} highlight />
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

interface TableRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const TableRow = ({ label, value, highlight = false }: TableRowProps) => (
  <tr className={highlight ? 'highlight' : ''}>
    <td className="label">{label}</td>
    <td className="value">{value}</td>
  </tr>
);


export default FuelStationStatsButton;