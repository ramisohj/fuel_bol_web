import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import './Mapbox.css';
import { createRoot } from 'react-dom/client';
import FuelStationCard from '../components/FuelStationCard';
import { API_ENDPOINTS, REGION_LIST, REGIONS } from '../constants';
import { Select } from 'antd';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

interface MapboxFeature {
  id: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

interface MapboxGeocodeResponse {
  features: MapboxFeature[];
}

const Mapbox: React.FC = () => {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isGeolocateActive, setIsGeolocateActive] = useState(false);
  const [isSelectRegionDisabled, setIsSelectRegionDisabled] = useState(false);
  const stationsMarkers = useRef<mapboxgl.Marker[]>([]);

  const getCountryCode = async () => {
    try {
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const data = await response.text();
      const lines = data.split('\n');
      const locationLine = lines.find(line => line.startsWith('loc='));
      if (locationLine) {
        const countryCode = locationLine.split('=')[1];
        return countryCode;
      }
      return null;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const getFuelStations = async (region: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.FUEL_STATIONS.GET_BY_REGION_FUEL_TYPE(REGIONS[region as keyof typeof REGIONS].code,0));
      if (response.ok) {
        const geojson = await response.json();
        geojson.features.forEach((feature: any) => {
          const marker = createMarker(feature);
          if (marker) stationsMarkers.current.push(marker);
        });
      } else {
        console.error(`Error when try to get fuel stations: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error(`Error when try to get fuel stations: ${error}`);
    }
  };

  const handleRegionChange = async (value: string) => {
    if (mapRef.current) {
      stationsMarkers.current.forEach((marker) => {
        marker.remove();
      });
      stationsMarkers.current = [];
      setIsSelectRegionDisabled(true);
      await getFuelStations(value);
      setIsSelectRegionDisabled(false);
    }
  }

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

  const createMarker = (feature: {
    geometry: {
      coordinates: LngLatLike;
    }
    properties: {
      fuelStationName: string;
      direction: string;
      fuelType: string;
      levelBsa: number;
      monitoringAt: string;
    }
  }) => {
    if (!mapRef.current) return;

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
      .addTo(mapRef.current);

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 25,
      className: 'centered-popup',
      anchor: 'top',
      maxWidth: '100%'
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

    return marker;
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
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const countryCode = await getCountryCode();
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
            new URLSearchParams({
              access_token: mapboxgl.accessToken,
              types: 'region',
              country: countryCode
            } as Record<string, string>)
          );

          if (!response.ok) throw new Error('Geocoding failed');

          const data = await response.json() as MapboxGeocodeResponse;

          const region = data.features.find(f => f.id.startsWith('region'));
          
          if (!region) throw new Error('No region found for this location');

          const pair = Object.entries(REGIONS).find(([_, value]) => value.name === region.text);
          if (pair) {
            const defaultRegion = pair[0];
            getFuelStations(defaultRegion);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    });

    mapRef.current = map;

    addGeolocateControl();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="map-wrapper">
      <div className="map-container" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      <button
        className={`locate-btn ${isGeolocateActive ? 'active' : ''}`}
        onClick={toggleGeolocation}
        aria-label={isGeolocateActive ? 'Hide my location' : 'Show my location'}
      >
        {isGeolocateActive ? 'Hide My Location' : 'Show My Location'}
      </button>
      <Select 
        className="select-region"
        placeholder="Select a department"
        onChange={handleRegionChange}
        disabled={isSelectRegionDisabled}
        loading={isSelectRegionDisabled}
        options={
          Object.entries(REGION_LIST).map(([key, value]) => ({
            value: key,
            label: REGIONS[value as keyof typeof REGIONS].name,
          }))
        }
      />
    </div>
  );
};

export default Mapbox;
