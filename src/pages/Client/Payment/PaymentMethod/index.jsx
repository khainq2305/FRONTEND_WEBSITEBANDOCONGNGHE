import React from 'react';

const paymentOptions = [
  {
    id: 1,
    label: 'Thanh toán khi nhận hàng',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png',
    disabled: true,
  },
  {
    id: 2,
    label: 'Thanh toán bằng QR Code, thẻ ATM nội địa',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/vnpay.png',
  },
  {
    id: 3,
    label:
      'Thanh toán bằng thẻ quốc tế Visa, Master, JCB, AMEX, Apple Pay, Google Pay',
    icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/alepay.png',
    tag: 'Ưu đãi',
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
];

const PaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
      <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer transition ${option.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-red-500'
              }`}
          >
            <input
              type="radio"
              name="payment"
              checked={selectedPaymentMethod === option.id}
              onChange={() => !option.disabled && setSelectedPaymentMethod(option.id)}
              className="accent-red-500 w-4 h-4"
              disabled={option.disabled}
            />

            <img
              src={option.icon}
              alt={option.label}
              className="w-8 h-8 object-contain"
            />

            <div className="flex-1">
              <p className="text-sm font-medium flex items-center gap-2">
                {option.label}
                {option.tag && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded">
                    {option.tag}
                  </span>
                )}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
