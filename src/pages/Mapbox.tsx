import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import './Mapbox.css';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';

import FuelStationCard from '../components/FuelStationCard';
import { API_ENDPOINTS, REGIONS, FUEL_TYPES } from '../constants';
import { getFuelCodeByFuelName } from '../util';
import { COLORS } from '../colors';
import FilterControls from '../components/FilterControls/FilterControls';

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

  const { t } = useTranslation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isGeolocateActive, setIsGeolocateActive] = useState(false);
  const [isLoadingGeoJSON, setIsLoadingGeoJson] = useState(true);
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

  
  const getFuelStations = async (region: number, fuelType: number) => {
    try {
      setIsLoadingGeoJson(true);
      const response = await fetch(API_ENDPOINTS.FUEL_BOL_PY.GET_BY_REGION_FUEL_TYPE(region, fuelType));
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
    } finally {
      setIsLoadingGeoJson(false);
    }
  };

  const handleRegionChange = async (values: { region: number, fuelType: number }) => {
    if (mapRef.current) {
      stationsMarkers.current.forEach((marker) => {
        marker.remove();
      });
      stationsMarkers.current = [];
      await getFuelStations(values.region, values.fuelType);
    }
  }

  const selectFuelIcon = (levelBsa: number) => {
    if (levelBsa <= 0) {
      return 'url(/images/fuel_station_black.png)';
    } else if (levelBsa > 0 && levelBsa <= 5000) {
      return 'url(/images/fuel_station_red.png)';
    } else if (levelBsa > 5000 && levelBsa <= 15000) {
      return 'url(/images/fuel_station_orange.png)';
    } else {
      return 'url(/images/fuel_station_green.png)';
    }
  }

  const getAmountColor = (levelBsa: number) => {
    if (levelBsa <= 0) {
      return COLORS.BLACK;
    } else if (levelBsa > 0 && levelBsa <= 5000) {
      return COLORS.RED;
    } else if (levelBsa > 5000 && levelBsa <= 15000) {
      return COLORS.ORANGE;
    } else {
      return COLORS.GREEN;
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
    geometry: { coordinates: LngLatLike };
    properties: {
      fuel_station_name: string;
      id_fuel_station: number;
      direction: string;
      fuel_type: string;
      level_bsa: number;
      monitoring_at: string;
    }
  }) => {
    if (!mapRef.current) return;

    const coords = feature.geometry.coordinates;
    const {
      fuel_station_name: name = 'Unnamed',
      id_fuel_station,
      direction = 'Unknown',
      fuel_type = 'Unknown',
      level_bsa = 0,
      monitoring_at = '',
    } = feature.properties;

    const container = document.createElement('div');
    container.className = 'marker-container';

    const icon = document.createElement('div');
    icon.className = 'custom-marker';
    icon.style.backgroundImage = selectFuelIcon(level_bsa);
    icon.style.opacity = level_bsa == 0 ? '0.4' : '1.0';
    icon.style.width = '2rem';
    icon.style.height = '2rem';
    icon.style.backgroundSize = 'cover';

    container.appendChild(icon);

    const marker = new mapboxgl.Marker(container)
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
      idFuelStation={id_fuel_station}
      direction={direction}
      fuelCode={getFuelCodeByFuelName(fuel_type)}
      levelBsa={level_bsa}
      monitoringAt={monitoring_at}
      colorAmount={getAmountColor(level_bsa)}
    />);
    popup.setDOMContent(popupNode);
    marker.setPopup(popup);

    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      removeAllMarkerLabels();
      addLabelsToMarker(container, level_bsa, name);

      popup.addTo(mapRef.current!);
      popup.setLngLat(marker.getLngLat());
    });

    return marker;
  }

  const addLabelsToMarker = (container: HTMLElement, levelBsa: number, name: string) => {
    const color = getAmountColor(levelBsa);

    const topLabel = document.createElement('div');
    topLabel.className = 'marker-label top';
    topLabel.innerText = `${Math.round(levelBsa)} [L]`;
    topLabel.style.color  = color;
    topLabel.style.border = `2px solid ${color}`;

    const bottomLabel = document.createElement('div');
    bottomLabel.className = 'marker-label bottom';
    bottomLabel.innerText = name;
    bottomLabel.style.color  = color;
    bottomLabel.style.border = `2px solid ${color}`;

    container.insertBefore(topLabel, container.firstChild);
    container.appendChild(bottomLabel);
  };

  const removeAllMarkerLabels = () => {
    stationsMarkers.current.forEach((marker) => {
      const el = marker.getElement();
      const labels = el.querySelectorAll('.marker-label');
      labels.forEach(label => label.remove());
    });
  };

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

    map.on('click', () => {
      removeAllMarkerLabels();
    });

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
            getFuelStations(REGIONS[defaultRegion as keyof typeof REGIONS].code, FUEL_TYPES.GASOLINE.code);
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
        aria-label={isGeolocateActive ? t('hideMyLocationButton') : t('showMyLocationButton')}
      >
        {isGeolocateActive ? t('hideMyLocationButton') : t('showMyLocationButton')}
      </button>
      <FilterControls
        isLoadingGeoJSON={isLoadingGeoJSON}
        onFilterChange={handleRegionChange}
      />
    </div>
  );
};

export default Mapbox;
