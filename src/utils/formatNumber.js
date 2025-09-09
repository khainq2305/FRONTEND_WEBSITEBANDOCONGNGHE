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

// src/utils/formatNumber.js

export function parseNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  let str = String(value);

  // Xóa tất cả dấu chấm (phân cách hàng nghìn)
  // và thay thế dấu phẩy (phân cách thập phân) bằng dấu chấm
  str = str.replace(/\./g, '').replace(/,/g, '.');

  const number = parseFloat(str);

  return isNaN(number) ? null : number;
}