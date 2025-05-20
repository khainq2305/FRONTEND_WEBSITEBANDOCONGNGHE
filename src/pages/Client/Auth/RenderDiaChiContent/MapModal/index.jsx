import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapModal = ({ center, onClose, setSelectedLocation }) => {
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-md overflow-hidden shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Sửa Vị trí</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Đóng</button>
        </div>
        <div className="w-full h-[400px]">
          <LoadScript googleMapsApiKey="AIzaSyAbtM7StFMB1GewF4W52-gJFu_snJtSbFA">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
              onClick={handleMapClick}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
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
