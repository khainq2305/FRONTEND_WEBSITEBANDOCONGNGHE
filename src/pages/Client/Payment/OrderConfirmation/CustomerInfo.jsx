import React from 'react';

const CustomerInfo = ({ name, phone }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-2">
    <h2 className="text-base font-semibold text-gray-700 mb-2">Người đặt hàng</h2>

    <div className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-800">
      <p>{name}</p>
      <p>{phone}</p>
    </div>
  </div>
);

export default CustomerInfo;
