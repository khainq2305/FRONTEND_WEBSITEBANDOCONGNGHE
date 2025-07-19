import React from 'react';

const DeliveryMethod = ({ address, time }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-2">
    <h2 className="text-base font-semibold text-gray-700 mb-2">Địa chỉ nhận hàng</h2>

    <div className="mb-2">
      <p className="text-xs text-gray-500 mb-1">Nhận tại:</p>
      <div className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-800">
        {address}
      </div>
    </div>

    <div>
      <p className="text-xs text-gray-500 mb-1">Thời gian muốn nhận hàng:</p>
      <div className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-800">
        {time}
      </div>
    </div>
  </div>
);

export default DeliveryMethod;
