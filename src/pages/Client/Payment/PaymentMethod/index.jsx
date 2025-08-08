import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../../../services/client/paymentService'; // Updated import
import vietqrIcon from '../../../../assets/Client/images/566d62fd25cf0867e0033fb1b9b47927.png';
const creditIcons = 'https://salt.tikicdn.com/ts/upload/16/f8/f3/0c02ea827b71cd89ffadb7a22babbdd6.png';
import { walletService } from '../../../../services/client/walletService'; // thêm dòng này

const paymentIconMap = {
  cod: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
  atm: vietqrIcon,
  vnpay: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
  momo: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  zalopay: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  viettel_money: 'https://i.imgur.com/ttZPvTx.png',
  stripe: 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png',
  credit: creditIcons,
  internalWallet: 'https://cdn-icons-png.flaticon.com/512/1041/1041876.png', // 🪙 ví nội bộ
};


const PaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod, finalAmount }) => {


  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await paymentService.getPaymentMethods(); // Call from paymentService
        const sorted = [...(res.data?.data || [])].sort((a, b) => {
  if (a.code === 'internalWallet') return -1;
  if (b.code === 'internalWallet') return 1;
  return 0;
});
setPaymentMethods(sorted);

      } catch (err) {
        console.error('Lỗi lấy phương thức thanh toán:', err);
        toast.error('Không thể tải phương thức thanh toán');
      }
    };

    fetchPaymentMethods();
  }, []);
const [walletBalance, setWalletBalance] = useState(0);

useEffect(() => {
  const fetchWalletBalance = async () => {
    try {
      const res = await walletService.getBalance();
      setWalletBalance(Number(res.data?.data?.balance || 0));
    } catch (err) {
      console.error('Lỗi lấy số dư ví:', err);
    }
  };

  fetchWalletBalance();
}, []);


  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
      <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
       {paymentMethods.map((method) => {
  const isWallet = method.code === 'internalWallet';
const isDisabled = isWallet && walletBalance < finalAmount;

  return (
    <label
      key={method.id}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200
        ${
          selectedPaymentMethod === method.id
            ? 'bg-sky-50 ring-1 ring-sky-500'
            : isDisabled
            ? 'bg-gray-100 opacity-60 cursor-not-allowed'
            : 'hover:bg-gray-50'
        }
      `}
    >
      <input
        type="radio"
        name="payment"
        checked={selectedPaymentMethod === method.id}
        onChange={() => !isDisabled && setSelectedPaymentMethod(method.id)}
        disabled={isDisabled}
        className="form-radio h-4 w-4 text-sky-600 focus:ring-sky-500"
      />

      <img
        src={paymentIconMap[method.code] || '/images/default-icon.png'}
        alt={method.name}
        className="w-8 h-8 object-contain"
      />

      <div className="flex-1">
        <p className="text-sm font-medium">
          {method.code === 'stripe' ? 'Thẻ tín dụng / Ghi nợ' : method.name}
        </p>

        {isWallet && (
          <p className={`text-xs mt-0.5 ${isDisabled ? 'text-red-500' : 'text-gray-600'}`}>
            Số dư: <span className="font-semibold">{walletBalance.toLocaleString('vi-VN')} ₫</span>
            {isDisabled && ' (Không đủ để thanh toán)'}
          </p>
        )}

        {method.code === 'stripe' && (
          <img
            src={creditIcons}
            alt="Thẻ tín dụng icons"
            className="mt-1 h-5 w-auto object-contain"
          />
        )}
      </div>
    </label>
  );
})}

      </div>
    </div>
  );
};

export default PaymentMethod;