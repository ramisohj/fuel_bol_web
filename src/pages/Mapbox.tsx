import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Mapbox.css';
import { createRoot } from 'react-dom/client';
import FuelStationCard from '../components/FuelStationCard';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

const Mapbox: React.FC = () => {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeolocateActive, setIsGeolocateActive] = useState(false);

  const selectFuelIcon = (levelBsa: number) => {
    if (levelBsa > 15000) {
      return 'url(/green-fuel-icon.png)';
    } else if (levelBsa > 5000 && levelBsa <= 15000) {
      return 'url(/orange-fuel-icon.png)';
    } else {
      return 'url(/red-fuel-icon.png)';
    }
  }

  const getAmountColor = (levelBsa: number) => {
    if (levelBsa > 15000) {
      return '#23a221';
    } else if (levelBsa > 5000 && levelBsa <= 15000) {
      return '#fd6117';
    } else {
      return '#df3a4a';
    }
  }

  const addGeolocateControl = () => {
    if (mapRef.current) {
      geolocateControlRef.current = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: true,
        showAccuracyCircle: true,
        showUserHeading: true,
      });

      mapRef.current.addControl(geolocateControlRef.current);

      geolocateControlRef.current.on('geolocate', () => {
        setIsGeolocateActive(true);
      });
    }
  }

  const toggleGeolocation = () => {
    if (geolocateControlRef.current && mapRef.current) {
      if (!isGeolocateActive) {
        geolocateControlRef.current.trigger();
      } else {
        mapRef.current.removeControl(geolocateControlRef.current);
        
        addGeolocateControl();

        setIsGeolocateActive(false);
      }
    }
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-64.5, -17],
      zoom: 5.2,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    );

    map.on('load', () => {
      fetch('https://fuelbol-production.up.railway.app/fuel-levels/geo/3/0')
        .then((res) => res.json())
        .then((geojson) => {
          geojson.features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const name = feature.properties?.fuelStationName || 'Unnamed';
            const direction = feature.properties?.direction || 'Unknown';
            const fuelType = feature.properties?.fuelType || 'Unknown';
            const levelBsa = feature.properties?.levelBsa || 0;
            const monitoringAt = feature.properties?.monitoringAt || '';

            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.backgroundImage = selectFuelIcon(levelBsa);
            el.style.width = '3rem';
            el.style.height = '3rem';
            el.style.backgroundSize = 'cover';

            const marker = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .addTo(map);

            const popup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: true,
              offset: 25,
            });

            const popupNode = document.createElement('div');
            const popupRoot = createRoot(popupNode);

            popupRoot.render(<FuelStationCard
              name={name}
              direction={direction}
              fuelType={fuelType}
              levelBsa={levelBsa}
              monitoringAt={monitoringAt}
              colorAmount={getAmountColor(levelBsa)}
            />);

            popup.setDOMContent(popupNode);
            popup.setMaxWidth('100%');

            marker.setPopup(popup);
          });
        })
        .catch((err) => console.error('Error loading GeoJSON:', err));
    });

    mapRef.current = map;

    addGeolocateControl();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="map-wrapper">
      <div className="map-container" ref={mapContainerRef}  style={{ width: '100%', height: '100vh' }} />
      <button 
        className={`locate-btn ${isGeolocateActive ? 'active' : ''}`} 
        onClick={toggleGeolocation}
        aria-label={isGeolocateActive ? 'Hide my location' : 'Show my location'}
      >
        {isGeolocateActive ? 'Hide My Location' : 'Show My Location'}
      </button>
    </div>
  );
};

export default Mapbox;
