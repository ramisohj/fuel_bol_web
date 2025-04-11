import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './Mapbox.css';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

const Mapbox: React.FC = () => {

	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current as HTMLDivElement,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-64.5, -16.5], //-16.997630, -65.424762
			zoom: 5.5,
			attributionControl: false
		});

		map.addControl(
			new mapboxgl.AttributionControl({
				compact: true 
			})
		);


		mapRef.current = map;

    fetch('/fuel-stations.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        geojson.features.forEach((feature: any) => {
          const coords = feature.geometry.coordinates;
          const name = feature.properties?.fuelStationName || 'Unnamed';

					// Create a custom DOM element
					const el = document.createElement('div');
					el.className = 'custom-marker';
					el.style.backgroundImage = 'url(/logo512.png)';
					el.style.width = '30px';
					el.style.height = '30px';
					el.style.backgroundSize = 'cover';

					const popup = new mapboxgl.Popup().setText(name);

          new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map);
        });
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));


		return () => map.remove();
	}, []);

	return <div className="map-container" ref={mapContainerRef} />;
};

export default Mapbox;
