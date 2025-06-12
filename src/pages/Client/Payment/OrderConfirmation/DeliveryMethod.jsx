import React from 'react';

const DeliveryMethod = ({ address, time }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-base font-semibold text-gray-700 mb-2">Hình thức nhận hàng</h2>
        <p className="text-sm text-gray-800">Giao tại: {address}</p>
        <p className="text-sm text-gray-600">Thời gian giao: {time}</p>
    </div>
);

export default DeliveryMethod;
