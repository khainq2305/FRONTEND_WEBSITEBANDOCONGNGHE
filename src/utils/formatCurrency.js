// src/utils/formatCurrency.js
export function formatCurrencyVND(value) {
  if (isNaN(value)) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' đ';
}
