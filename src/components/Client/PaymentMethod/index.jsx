import React from 'react';

const paymentOptions = [
  { id: 1, label: 'Thanh toán khi nhận hàng' },
  { id: 2, label: 'Thanh toán bằng QR Code, thẻ ATM nội địa' },
  { id: 3, label: 'Thanh toán bằng thẻ quốc tế Visa, Master, JCB, AMEX, Apple Pay, Google Pay', tag: 'Ưu đãi' },
  { id: 4, label: 'Thanh toán bằng ví MoMo' },
  { id: 5, label: 'Thanh toán bằng ví ZaloPay' },
];

const PaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
      <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {paymentOptions.map(option => (
          <label key={option.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              checked={selectedPaymentMethod === option.id}
              onChange={() => setSelectedPaymentMethod(option.id)}
              className="accent-red-500"
            />
            <span>{option.label}</span>
            {option.tag && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded">{option.tag}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
