// src/utils/formatCurrency.js

export function formatCurrencyVND(value) {
    if (isNaN(value)) return '0₫';
  
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  }
  