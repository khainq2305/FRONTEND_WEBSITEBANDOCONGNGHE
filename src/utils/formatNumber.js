// src/utils/formatNumber.js
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  const number = Number(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function parseNumber(value) {
  if (!value) return '';
  let str = String(value).replace(/[^\d.,-]/g, '');
  if (str.includes('.') && !str.includes(',')) return parseFloat(str);
  str = str.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(str);
}
