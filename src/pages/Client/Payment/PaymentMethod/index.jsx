import React from 'react';

 const paymentOptions = [
   {
     id: 1,
     label: 'Thanh toán khi nhận hàng',
     icon: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png',
   },
   {
     id: 2,
     label: 'Chuyển khoản ngân hàng',
     icon: 'https://i.gyazo.com/566d62fd25cf0867e0033fb1b9b47927.png',
   },
   {
     id: 3,
     label: 'Thanh toán bằng ví VNPay',
     icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1-300x96.png',
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
   label: 'Thanh toán bằng Viettel Money',
   icon: 'https://i.imgur.com/ttZPvTx.png',           // ← logo Viettel Money
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
            className={`
              flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200
              ${option.disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                // ✨ ĐỔI TỪ ĐỎ SANG XANH
                : selectedPaymentMethod === option.id
                  ? 'bg-sky-50 ring-1 ring-sky-500' 
                  : 'hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name="payment"
              checked={selectedPaymentMethod === option.id}
              onChange={() => !option.disabled && setSelectedPaymentMethod(option.id)}
              // ✨ ĐỔI TỪ ĐỎ SANG XANH
              className="form-radio h-4 w-4 text-sky-600 focus:ring-sky-500"
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