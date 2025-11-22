'use client';

import { Earthquake } from '@/lib/mockData';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Custom icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const predictedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle flying to location
function FlyToLocation({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center as LatLngExpression, 8, {
        duration: 2
      });
    }
  }, [center, map]);
  return null;
}

interface MapProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (eq: Earthquake) => void;
}

export default function Map({ earthquakes, selectedEarthquake, onSelectEarthquake }: MapProps) {
  const center: LatLngExpression = selectedEarthquake 
    ? selectedEarthquake.coordinates 
    : [20, 0]; // Default center

  return (
    <MapContainer 
      center={center} 
      zoom={2} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FlyToLocation center={selectedEarthquake?.coordinates} />

      {earthquakes.map((eq) => (
        <Marker 
          key={eq.id} 
          position={eq.coordinates as LatLngExpression}
          icon={eq.isPredicted ? predictedIcon : defaultIcon}
          eventHandlers={{
            click: () => onSelectEarthquake(eq),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {eq.location}
                {eq.isPredicted && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                    Predicted
                  </span>
                )}
              </h3>
              <div className="text-sm space-y-1 mt-2">
                <p><span className="font-semibold">Magnitude:</span> {eq.magnitude}</p>
                <p><span className="font-semibold">Depth:</span> {eq.depth} km</p>
                <p><span className="font-semibold">Time:</span> {new Date(eq.time).toLocaleString()}</p>
                <div className={`mt-2 inline-block px-2 py-1 rounded text-white text-xs font-bold
                  ${eq.alertLevel === 'Red' ? 'bg-red-500' : 
                    eq.alertLevel === 'Yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {eq.alertLevel} Alert
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
