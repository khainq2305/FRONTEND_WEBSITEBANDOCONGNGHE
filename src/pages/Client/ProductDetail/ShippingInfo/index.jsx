import React from 'react';

export default function ShippingInfo({ address, onChange }) {
  if (!address) return null;

  return (
    <div className=" px-4 py-3 rounded-md border border-gray-200 shadow-sm mb-2 text-sm text-gray-800">
      <div className="font-semibold mb-1">Thông tin vận chuyển</div>
      <div>
        <strong className="text-gray-900">Giao đến:</strong>{' '}
        <span>{address.fullAddress}</span>{' '}
        <button
          onClick={onChange}
          className="text-blue-600 hover:underline ml-1"
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
}
