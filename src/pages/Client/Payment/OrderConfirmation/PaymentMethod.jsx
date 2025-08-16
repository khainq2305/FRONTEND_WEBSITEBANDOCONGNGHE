import React from 'react';

const ICON_COD =
  'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png';
const ICON_VIETQR =
  'https://i.gyazo.com/566d62fd25cf0867e0033fb1b9b47927.png'; // dùng cho PayOS/VietQR
const ICON_VNPAY =
  'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png';
const ICON_MOMO =
  'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png';
const ICON_ZALOPAY =
  'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png';
const ICON_STRIPE =
  'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png';
const ICON_WALLET = 'https://cdn-icons-png.flaticon.com/512/1041/1041876.png';
const ICON_DEFAULT = '/default-payment.png';

function pickIcon(method) {
  const m = (method || '').toLowerCase();

  if (/payos|vietqr|chuyển khoản/.test(m)) return ICON_VIETQR; // PayOS / VietQR
  if (/vnpay/.test(m)) return ICON_VNPAY;
  if (/momo/.test(m)) return ICON_MOMO;
  if (/zalo/.test(m)) return ICON_ZALOPAY;
  if (/stripe|credit|card|visa|master/.test(m)) return ICON_STRIPE;
  if (/wallet|nội bộ|cyberzone/.test(m)) return ICON_WALLET;
  if (/cod|nhận hàng/.test(m)) return ICON_COD;

  return ICON_DEFAULT;
}

const PaymentMethod = ({ method }) => {
  const icon = pickIcon(method);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-base font-semibold text-gray-700 mb-2">
        Phương thức thanh toán
      </h2>
      <div className="flex items-center gap-2">
        <img src={icon} alt={method} className="w-6 h-6 object-contain" />
        <p className="text-sm text-gray-800">{method}</p>
      </div>
    </div>
  );
};

export default PaymentMethod;
