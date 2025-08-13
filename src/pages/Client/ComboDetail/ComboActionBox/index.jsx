import React from 'react';
import { TagIcon } from '@heroicons/react/24/solid';
import { formatCurrencyVND } from '@/utils/formatCurrency';

export default function ComboActionBox({ combo, onBuyNow, onAddToCart }) {
  const discountAmount = combo.originalPrice - combo.price;
  const discountPercent = Math.round((discountAmount / combo.originalPrice) * 100);

  return (
    <div className="p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 text-gray-800 md:sticky md:top-4 h-fit bg-white">
      <h1 className="text-2xl font-bold leading-tight">{combo.name}</h1>

      <div className="flex items-baseline gap-x-3">
        <p className="text-red-600 font-bold text-2xl">{formatCurrencyVND(combo.price)}</p>
        <p className="text-base line-through text-gray-500">{formatCurrencyVND(combo.originalPrice)}</p>
      </div>

      <div className="inline-flex items-center gap-x-1.5 bg-amber-100/60 text-red-600 font-semibold text-sm px-2.5 py-1 rounded-md">
        <TagIcon className="w-4 h-4" />
        <span>Giảm {formatCurrencyVND(discountAmount)} (-{discountPercent}%)</span>
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={onBuyNow}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-base transition-all duration-150"
        >
          MUA NGAY
          <div className="text-xs font-normal mt-0.5 opacity-90">Giao hàng tận nơi</div>
        </button>

        <button
          onClick={onAddToCart}
          className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold text-base transition-all duration-150"
        >
          Thêm vào giỏ hàng
          <div className="text-xs font-normal mt-0.5 opacity-90">Xem lại và thanh toán sau</div>
        </button>
      </div>
    </div>
  );
}
