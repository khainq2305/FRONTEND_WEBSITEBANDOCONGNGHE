import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../../../services/client/paymentService';
import { walletService } from '../../../../services/client/walletService';
import vietqrIcon from '../../../../assets/Client/images/566d62fd25cf0867e0033fb1b9b47927.png';

const creditIcons =
  'https://salt.tikicdn.com/ts/upload/16/f8/f3/0c02ea827b71cd89ffadb7a22babbdd6.png';

const paymentIconMap = {
  cod: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
  atm: vietqrIcon,
  vnpay: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
  momo: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  zalopay: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  viettel_money: 'https://i.imgur.com/ttZPvTx.png',
  stripe: 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png',
  credit: creditIcons,
  internalWallet: 'https://cdn-icons-png.flaticon.com/512/1041/1041876.png',
};

const PaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  finalAmount,
  openSetupGoogleAuth, // từ parent (CheckoutPage)
   gaVersion = 0, // 🔹 NHẬN THÊM
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [walletInfo, setWalletInfo] = useState(null); // { hasGoogleAuth, balance, ... }
  const [walletBalance, setWalletBalance] = useState(0);

  // Lấy danh sách phương thức thanh toán
  useEffect(() => {
    (async () => {
      try {
        const res = await paymentService.getPaymentMethods();
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
    })();
  }, []);

 // 🔁 Refetch khi GA vừa được thiết lập ở CheckoutPage
 useEffect(() => {
   (async () => {
     try {
      const res = await walletService.getWallet();
       const data = res?.data?.data || {};
       setWalletInfo(data);
      setWalletBalance(Number(data.balance || 0));
     } catch (err) {
       console.error('Lỗi lấy ví (refresh sau GA):', err);
     }
   })();
 }, [gaVersion]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
      <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isWallet = method.code === 'internalWallet';
          const isGaNotSetup = isWallet && walletInfo && !walletInfo.hasGoogleAuth;
          const isDisabled = isWallet && (walletBalance < finalAmount || isGaNotSetup);
          const isSelected = selectedPaymentMethod === method.id;

          return (
            <div key={method.id} className="space-y-2">
              <div
                className={`flex items-center justify-between gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200
                  ${
                    isSelected
                      ? 'bg-sky-50 ring-1 ring-sky-500'
                      : isDisabled
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
              >
                {/* Khối chọn phương thức (áp dụng opacity riêng khi disabled) */}
                <label
                  className={`flex items-center gap-4 flex-1 cursor-pointer ${
                    isDisabled ? 'opacity-60' : ''
                  }`}
                  onClick={() => {
   if (isDisabled) {
    if (isWallet && isGaNotSetup) openSetupGoogleAuth?.();
     return;
   }
   setSelectedPaymentMethod(method.id);
 }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={isDisabled}
                    className="form-radio h-4 w-4 text-sky-600 focus:ring-sky-500"
                  />

                  <img
                    src={paymentIconMap[method.code] || '/images/default-icon.png'}
                    alt={method.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-icon.png';
                    }}
                  />

                  <div>
                    <p className="text-sm font-medium">{method.name}</p>

                    {isWallet && (
                      <p className={`text-xs mt-0.5 ${isDisabled ? 'text-red-500' : 'text-gray-600'}`}>
                        Số dư:{' '}
                        <span className="font-semibold">
                          {walletBalance.toLocaleString('vi-VN')} ₫
                        </span>
                      </p>
                    )}
                  </div>
                </label>

                {/* Banner GA (không bị mờ) */}
                {isWallet && walletInfo && !walletInfo.hasGoogleAuth && (
                  <div className="flex items-center gap-2 border border-amber-300 bg-amber-50 px-3 py-1 rounded-md text-[13px] text-amber-800">
                    <img
                      src="src/assets/Client/images/google-auth.png"
                      alt="GA"
                      className="w-4 h-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>Yêu cầu Google Auth</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSetupGoogleAuth?.();
                      }}
                      className="text-xs font-medium px-2 py-1 rounded border border-amber-400 text-amber-800 hover:bg-amber-100"
                    >
                      Thiết lập ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;
