import React from 'react';

const GiftList = ({ gifts }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <h2 className="text-base font-semibold text-gray-700 mb-4">
      Quà tặng đơn hàng ({gifts.length})
    </h2>
    <div className="space-y-3">
      {gifts.map((gift, index) => (
        <div key={index} className="flex items-start gap-3">
          <img
            src={gift.image}
            alt={gift.name}
            className="w-6 h-6 rounded-full object-cover mt-1"
          />
          <div className="flex justify-between w-full">
            <p className="text-sm text-gray-800">{gift.name}</p>
            <span className="text-sm text-gray-600 whitespace-nowrap">x{gift.quantity}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GiftList;
