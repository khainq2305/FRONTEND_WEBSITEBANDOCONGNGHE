import React from 'react';

const CustomerInfo = ({ name, phone }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-base font-semibold text-gray-700 mb-2">Người đặt hàng</h2>
        <p className="text-sm text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">{phone}</p>
    </div>
);

export default CustomerInfo;
