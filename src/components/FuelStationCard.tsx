import { Calendar, Clock, Droplet, Fuel, MapPin } from "lucide-react";
import './FuelStationCard.css';
import moment from "moment";

interface FuelStationCardProps {
  name: string;
  direction: string;
  fuelType: string;
  levelBsa: number;
  monitoringAt: string;
}

const FuelStationCard: React.FC<FuelStationCardProps> = ({
  name,
  direction,
  fuelType,
  levelBsa,
  monitoringAt
}) => {
  return (
    <div className="fuel-station-card">
      <div className="fuel-station-header">
        <h2 className="fuel-station-name">{name}</h2>
      </div>

      <div className="location-container">
        <MapPin className="h-10 w-10 location-icon" />
        <p className="location-text">{direction}</p>
      </div>

      <div className="fuel-type-container">
        <Fuel className="h-10 w-10 fuel-icon" />
        <p className="fuel-type-text">{fuelType}</p>
      </div>

      <div className="fuel-info-container">
        <div className="fuel-icon-container">
          <Droplet size={20} className="fuel-icon" />
        </div>
        <div className="fuel-details">
          <p className="fuel-label">Available Fuel</p>
          <p className="fuel-amount">{levelBsa} liters</p>
        </div>
      </div>

      <div className="last-update-info-container">
        <div className="last-update-info">
          <div className="udpate-item">
            <Calendar className="h-5 w-5 calendar-icon" />
            <p className="update-text">{moment(monitoringAt).format("MMMM Do YYYY")}</p>
          </div>
          <div className="udpate-item">
            <Clock className="h-5 w-5 clock-icon" />
            <p className="update-text">{moment(monitoringAt).format("h:mm a")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelStationCard;
