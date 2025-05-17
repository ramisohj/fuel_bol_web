import { Calendar, Clock, Droplet, Fuel, MapPin } from "lucide-react";
import './FuelStationCard.css';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import ANHButton from "./ANHButton/ANHButton";
import RefillStatsButton from './StatisticButton/StatisticButton'
import { API_ENDPOINTS } from "../constants";
import { getNameCodeByFuelCode } from "../util";

interface FuelStationCardProps {
  name: string;
  idFuelStation: number;
  direction: string;
  fuelCode: number;
  levelBsa: number;
  monitoringAt: string;
  colorAmount: string;
}


const FuelStationCard: React.FC<FuelStationCardProps> = ({
  name,
  idFuelStation,
  direction,
  fuelCode,
  levelBsa,
  monitoringAt,
  colorAmount
}) => {

  const { t } = useTranslation();

  return (
    <div className="fuel-station-card" style={{
      borderColor: colorAmount,
      borderWidth: '0.5rem',
      borderStyle: 'solid',
    }}>
      <div className="fuel-station-header">
        <h2 className="fuel-station-name">{name}</h2>
      </div>

      <div>
      <p className="location-text">ID: {idFuelStation}</p>  
      </div>

      <div className="location-container">
        <MapPin className="h-10 w-10 location-icon" />
        <p className="location-text">{direction}</p>
      </div>
      
      <div className="fuel-info-row-container">
        <div className="fuel-type-container">
          <Fuel className="h-10 w-10 fuel-icon"/>
          <p className="fuel-type-text">{ t(getNameCodeByFuelCode(fuelCode))}</p>
        </div>

        <div className="fuel-info-container">
          <div className="fuel-icon-container" style={{backgroundColor: colorAmount}}>
            <Droplet size={15} className="fuel-icon" />
          </div>
          <div className="fuel-details">
            <p className="fuel-amount" style={{color: colorAmount}}>{Math.round(levelBsa)} [L]</p>
          </div>
        </div>

        <div className="last-update-info-container">
          <div className="last-update-info">
            <div className="udpate-item">
              <Calendar className="h-5 w-5 calendar-icon" />
              <p className="update-text">{moment(monitoringAt).format("MMMM Do YYYY")}</p>
              <p className="update-text">{moment(monitoringAt).format("h:mm a")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='stats-buttons-row-container'>
        <ANHButton
          buttonName={t('anhButton')}
          fuelStationId={idFuelStation}
          fuelType={fuelCode}
        />
        <RefillStatsButton
          buttonName={t('timeSeriesButton')}
          fuelStationId={idFuelStation}
          statsAPI={API_ENDPOINTS.FUEL_BOL_PY.GET_TIME_SEREIES(idFuelStation, fuelCode)}
          fuelStationName={name}
          fuelType={fuelCode}
        />
        <RefillStatsButton
          buttonName={t('graphsButton')}
          fuelStationId={idFuelStation}
          statsAPI={API_ENDPOINTS.FUEL_BOL_PY.GET_GRAPHS(idFuelStation, fuelCode)}
          fuelStationName={name}
          fuelType={fuelCode}
        />
        <RefillStatsButton
          buttonName={t('statisticalDataButton')}
          fuelStationId={idFuelStation}
          statsAPI={API_ENDPOINTS.FUEL_BOL_PY.GET_STATISTICAL_DATA(idFuelStation, fuelCode)}
          fuelStationName={name}
          fuelType={fuelCode}
        />
        <RefillStatsButton
          buttonName={t('mlModelsButton')}
          fuelStationId={idFuelStation}
          statsAPI={API_ENDPOINTS.FUEL_BOL_PY.GET_ML_MODELS(idFuelStation, fuelCode)}
          fuelStationName={name}
          fuelType={fuelCode}
        />
      </div>
    </div>
  );
};

export default FuelStationCard;
