import React, { useEffect, useState } from 'react';
import { walletService } from '@/services/client/walletService';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldOff } from 'lucide-react';
import ChangePinModal from '../ChangePinModal';
import Loader from '@/components/common/Loader';
import MUIPagination from '@/components/common/Pagination';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'refund', label: 'Hoàn tiền' },
  { key: 'purchase', label: 'Thanh toán' }
];

export default function InternalWalletPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [active, setActive] = useState('all');

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const res = await walletService.getWallet();
        const walletData = res?.data?.data || {};
        setWallet(walletData);
        setEmail(walletData.email || '');
        setBalance(Number(walletData.balance) || 0);

        if (!walletData.email) {
          return navigate('/dang-nhap');
        }

        const historyRes = await walletService.getTransactions({ page, limit });
        setTransactions(Array.isArray(historyRes?.data?.data) ? historyRes.data.data : []);
        setTotal(historyRes?.data?.total || 0);

      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu ví:', err);
        navigate('/dang-nhap');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate, page]);

  const handleSetupPinClick = async () => {
    try {
      const res = await walletService.sendPinVerification();
      alert(res.data.message);
      navigate('/xac-minh-ma-pin', { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể gửi mã xác minh.');
    }
  };

  const handleForgotPinClick = async () => {
    try {
      setForgotLoading(true);
      await walletService.sendForgotPin({ email });
      navigate('/xac-minh-ma-pin?mode=forgot', { state: { email } });
    } catch (err) {
      setForgotLoading(false);
      alert(err.response?.data?.message || 'Không thể gửi mã xác minh quên PIN.');
    }
  };


  if (loading) return <Loader />;

  const filtered = transactions.filter((tx) =>
    active === 'all' ? true : String(tx.type).toLowerCase() === active
  );

  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Summary */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
              <img
                src="src/assets/Client/images/tientien 1.png"
                alt="coin"
                className="w-14 h-14 object-contain"
              />
            </div>

            <div>
              <div className="text-gray-700 text-sm font-medium">Số dư ví hiện tại</div>
              <div className="text-2xl font-bold text-yellow-500 mt-1">
                {formatCurrencyVND(balance)}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col md:flex-row gap-2">
            {!wallet?.hasPin ? (
              <button
                onClick={handleSetupPinClick}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"
              >
                <KeyRound size={16} /> Thiết lập mã PIN
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowChangePinModal(true)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"
                >
                  <KeyRound size={16} /> Đổi mã PIN
                </button>
                <button
                  onClick={handleForgotPinClick}
                  disabled={forgotLoading}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 flex items-center gap-1"
                >
                  {forgotLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                        ></path>
                      </svg>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff size={16} /> Quên mã PIN
                    </>
                  )}
                </button>

              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 text-center py-3 text-sm font-medium relative
                ${active === t.key ? 'text-[#1CA7EC] font-semibold' : 'text-gray-500'}
                after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px]
                ${active === t.key ? 'after:bg-[#1CA7EC]' : 'after:bg-transparent'}
              `}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Lịch sử */}
        {filtered.length === 0 ? (
          <p className="text-gray-500 p-4">Không có giao dịch.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center px-4 py-3">
                <div className="pr-4">
                  <p
                    className={`font-semibold mb-1 ${String(tx.type).toLowerCase() === 'refund'
                        ? 'text-green-600'
                        : 'text-red-600'
                      }`}
                  >
                    {String(tx.type).toLowerCase() === 'refund'
                      ? 'Hoàn tiền'
                      : 'Thanh toán đơn hàng'}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    vào lúc {format(new Date(tx.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi })}
                  </p>
                  {tx.description && (
                    <p className="text-sm text-gray-700">{tx.description}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm
                    ${String(tx.type).toLowerCase() === 'purchase'
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700'
                      : 'bg-gradient-to-r from-green-50 to-green-100 text-green-700'}`}
                >
                  <span className="font-bold">
                    {String(tx.type).toLowerCase() === 'purchase' ? '−' : '+'}
                  </span>
                  {formatCurrencyVND(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {total > limit && (
        <MUIPagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <ChangePinModal open={showChangePinModal} onClose={() => setShowChangePinModal(false)} />
    </section>
  );
}
