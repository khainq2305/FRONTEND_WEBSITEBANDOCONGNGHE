import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: iconShadow,
  shadowSize: [41, 41]
});

const LocationMarker = ({ selectedLocation, setSelectedLocation }) => {
  useMapEvents({
    click(e) {
      setSelectedLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    }
  });

  return selectedLocation ? (
    <Marker position={selectedLocation} icon={customIcon} />
  ) : null;
};

const MapModal = ({ center, onClose, setSelectedLocation }) => {
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-md overflow-hidden shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Chọn vị trí</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Đóng</button>
        </div>
        <div className="w-full h-[400px]">
          <MapContainer center={center} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <LocationMarker selectedLocation={center} setSelectedLocation={setSelectedLocation} />
          </MapContainer>
        </div>
        <div className="p-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
