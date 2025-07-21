import React from 'react';

const paymentOptions = [
  {
    id: 1,
    label: 'Thanh toán khi nhận hàng',
    icon: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
  },
  {
    id: 2,
    label: 'Chuyển khoản ngân hàng',
    icon: 'https://i.gyazo.com/566d62fd25cf0867e0033fb1b9b47927.png',
  },
  {
    id: 3,
    label: 'Thanh toán bằng ví VNPay',
    icon: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
  },
  {
    id: 4,
    label: 'Thanh toán bằng ví MoMo',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  },
  {
    id: 5,
    label: 'Thanh toán bằng ví ZaloPay',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  },
  {
    id: 6,
    label: 'Thanh toán bằng ví ZaloPay',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  },
];

const PaymentMethod = ({ method }) => {
  // Tìm icon tương ứng với phương thức thanh toán
 const selected = paymentOptions.find(p => method?.includes(p.label));


  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-base font-semibold text-gray-700 mb-2">Phương thức thanh toán</h2>
      <div className="flex items-center gap-2">
        <img
          src={selected?.icon || '/default-payment.png'}
          alt={method}
          className="w-6 h-6 object-contain"
        />
        <p className="text-sm text-gray-800">{method}</p>
      </div>
    </div>
  );
};

export default PaymentMethod;
