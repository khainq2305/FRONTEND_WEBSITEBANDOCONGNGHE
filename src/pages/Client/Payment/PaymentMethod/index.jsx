import React, { useEffect, useState } from 'react';
import { orderService } from '../../../../services/client/orderService';
import { toast } from 'react-toastify';
import vietqrIcon from '../../../../assets/Client/images/566d62fd25cf0867e0033fb1b9b47927.png';

const paymentIconMap = {
  cod: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png',
  atm: vietqrIcon,
  vnpay: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1-300x96.png',
  momo: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  zalopay: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  viettel_money: 'https://i.imgur.com/ttZPvTx.png',
  stripe: 'https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png',

};

const PaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await orderService.getPaymentMethods();
        setPaymentMethods(res.data?.data || []);
      } catch (err) {
        console.error('Lỗi lấy phương thức thanh toán:', err);
        toast.error('Không thể tải phương thức thanh toán');
      }
    };

    fetchPaymentMethods();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
      <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200
              ${
                selectedPaymentMethod === method.id
                  ? 'bg-sky-50 ring-1 ring-sky-500'
                  : 'hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name="payment"
              checked={selectedPaymentMethod === method.id}
              onChange={() => setSelectedPaymentMethod(method.id)}
              className="form-radio h-4 w-4 text-sky-600 focus:ring-sky-500"
            />

            <img
              src={paymentIconMap[method.code] || '/images/default-icon.png'}
              alt={method.name}
              className="w-8 h-8 object-contain"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">{method.name}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
