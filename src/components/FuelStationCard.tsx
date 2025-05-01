import { Calendar, Clock, Droplet, Fuel, MapPin } from "lucide-react";
import './FuelStationCard.css';
import moment from "moment";
import FuelStationStatsButton from "./FuelStationStatsButton/FuelStationStatsButton";
import ANHButton from "./ANHButton/ANHButton";

interface FuelStationCardProps {
  name: string;
  idFuelStation: number;
  direction: string;
  fuelType: string;
  levelBsa: number;
  monitoringAt: string;
  colorAmount: string;
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  name,
  idFuelStation,
  direction,
  fuelType,
  levelBsa,
  monitoringAt,
  colorAmount
}) => {
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
          <p className="fuel-type-text">{fuelType}</p>
        </div>

        <div className="fuel-info-container">
          <div className="fuel-icon-container" style={{backgroundColor: colorAmount}}>
            <Droplet size={15} className="fuel-icon" />
          </div>
          <div className="fuel-details">
            <p className="fuel-amount" style={{color: colorAmount}}>{levelBsa} liters</p>
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
      <ANHButton fuelStationId={idFuelStation} fuelType={0} />
      <FuelStationStatsButton fuelStationId={idFuelStation} fuelType={0} />
    </div>
  );
};

export default FuelStationCard;
