import React, { useEffect, useState } from 'react';
import { walletService } from '@/services/client/walletService';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import Loader from '@/components/common/Loader';
import MUIPagination from '@/components/common/Pagination';
import DisableGaModal from '../DisableGaModal';
import GoogleAuthModal from '../GoogleAuthModal';
import SuccessModal from '../SuccessModal';
import GoogleAuthActiveImg from '@/assets/Client/images/Google_Authenticator_(April_2023).png';
// các import khác…
import TotpModal from '../../Payment/TotpModal'; // <-- thêm dòng này

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'refund', label: 'Hoàn tiền' },
  { key: 'purchase', label: 'Thanh toán' }
];

import CoinImg from '@/assets/Client/images/tientien 1.png';

export default function InternalWalletPage() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [active, setActive] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  // ...
  const [totpOpen, setTotpOpen] = useState(false);
  const [totpLoading, setTotpLoading] = useState(false);
  const [pendingWithdraw, setPendingWithdraw] = useState(null); // { amount, method }
  // ...
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const openDisableGa = () => setShowDisableModal(true);
  const closeDisableGa = () => setShowDisableModal(false);

  const refreshWallet = async () => {
    const walletRes = await walletService.getWallet();
    setWallet(walletRes?.data?.data || wallet);
  };

  const [gaOpen, setGaOpen] = useState(false);
  const [gaQr, setGaQr] = useState('');
  const [gaLoading, setGaLoading] = useState(false);
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await walletService.getWallet();
        const walletData = res?.data?.data || {};
        setWallet(walletData);
        setBalance(Number(walletData.balance) || 0);

        if (!walletData?.email) {
          return navigate('/dang-nhap');
        }

        const historyRes = await walletService.getTransactions();
        const list = Array.isArray(historyRes?.data?.data) ? historyRes.data.data : [];
        setTransactions(list);
        setTotal(historyRes?.data?.total || list.length || 0);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu ví:', err);
        navigate('/dang-nhap');
      }
    };

    fetchWalletData();
  }, [navigate, page]);
  const startWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return alert('Vui lòng nhập số tiền hợp lệ');
    if (Number(withdrawAmount) > balance) return alert('Số dư không đủ');

    const payload = {
      amount: Number(withdrawAmount),
      method: 'payos',
      accountName,
      accountNumber
    };

    if (googleAuthEnabled) {
      // Lưu yêu cầu, bật modal OTP
      setPendingWithdraw(payload);
      setTotpOpen(true);
      return;
    }

    // Không bật 2FA thì xử lý như cũ
    try {
      setWithdrawLoading(true);
      await walletService.requestWithdrawal(payload);
      setSuccessMessage('Yêu cầu rút tiền thành công!');
      setWithdrawOpen(false);
      setWithdrawAmount('');
      await refreshWallet();
    } catch (err) {
      alert(err?.response?.data?.message || 'Rút tiền thất bại.');
    } finally {
      setWithdrawLoading(false);
    }
  };
  const handleSubmitTotp = async (token) => {
    if (!pendingWithdraw) return;
    try {
      setTotpLoading(true);
      await walletService.requestWithdrawal({
        ...pendingWithdraw,
        accountName,
        accountNumber,
        token
      });

      setSuccessMessage('Yêu cầu rút tiền thành công!');
      setTotpOpen(false);
      setWithdrawOpen(false);
      setWithdrawAmount('');
      setPendingWithdraw(null);
      await refreshWallet();
    } catch (err) {
      // ném lỗi để TotpModal hiển thị “Mã OTP không hợp lệ”
      throw err;
    } finally {
      setTotpLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => (active === 'all' ? true : String(tx.type).toLowerCase() === active));

  const [gaSecret, setGaSecret] = useState('');
  const [gaUri, setGaUri] = useState('');

  const handleSetupGoogleAuth = async () => {
    try {
      setGaOpen(true);
      setGaLoading(true);
      const res = await walletService.enableGoogleAuth();
      setGaQr(res?.data?.qrCode || '');
      setGaSecret(res?.data?.secret || '');
      setGaUri(res?.data?.otpauthUrl || '');
    } catch (err) {
      alert(err?.response?.data?.message || 'Không thể bật Google Authenticator.');
      setGaOpen(false);
    } finally {
      setGaLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    await walletService.verifyGoogleAuth({ token: otp });
    setSuccessMessage('Kích hoạt Google Auth thành công.');

    setGaOpen(false);
    await refreshWallet();
  };

  const googleAuthEnabled = !!wallet?.hasGoogleAuth;
  return (
    <section className="mb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 bg-white  shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
              <img src={CoinImg} alt="coin" className="w-14 h-14 object-contain" />
            </div>

            <div>
              <div className="text-gray-700 text-sm font-medium">Số dư ví hiện tại</div>

              <div className="text-2xl font-bold text-yellow-500 -ml-1 mt-1 leading-tight tabular-nums">{formatCurrencyVND(balance)}</div>
              <p className="text-xs text-gray-500 mt-1 leading-tight">
                {googleAuthEnabled ? (
                  <span className="text-green-600 font-medium">Bảo mật thanh toán (2FA) đã được kích hoạt</span>
                ) : (
                  <>
                    Bật <span className="font-medium">bảo mật thanh toán (2FA)</span> để xác nhận các giao dịch ví.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {googleAuthEnabled ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 h-[40px] rounded-md border border-green-300 bg-green-50 text-green-700 text-sm font-medium shadow-sm">
                  <img src={GoogleAuthActiveImg} alt="Google Authenticator" className="w-6 h-6" />
                  <span>Đã bật bảo mật thanh toán</span>
                </div>
                <button
                  onClick={openDisableGa}
                  className="px-3 h-[40px] border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 font-medium transition"
                >
                  Tắt bảo mật
                </button>
              </>
            ) : (
              <button
                onClick={handleSetupGoogleAuth}
                type="button"
                className="inline-flex items-center gap-3 px-4 h-[40px] rounded-md border border-yellow-300 bg-yellow-50 text-yellow-700 text-sm hover:bg-yellow-100 font-medium shadow-sm transition"
              >
                <img src={GoogleAuthActiveImg} alt="Google Authenticator" className="w-6 h-6" />
                <span>Bật bảo mật thanh toán</span>
              </button>
            )}
          </div>
        </div>

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

        {filtered.length === 0 ? (
          <div className="flex items-center justify-center min-h-[160px] text-gray-500 text-center">Không có giao dịch.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center px-4 py-3">
                <div className="pr-4">
                  <p className={`font-semibold mb-1 ${String(tx.type).toLowerCase() === 'refund' ? 'text-green-600' : 'text-red-600'}`}>
                    {String(tx.type).toLowerCase() === 'refund' ? 'Hoàn tiền' : 'Thanh toán đơn hàng'}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    vào lúc {format(new Date(tx.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi })}
                  </p>
                  {tx.description && <p className="text-sm text-gray-700">{tx.description}</p>}
                </div>
                <span
                  className={`shrink-0 flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm
                    ${
                      String(tx.type).toLowerCase() === 'purchase'
                        ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700'
                        : 'bg-gradient-to-r from-green-50 to-green-100 text-green-700'
                    }`}
                >
                  <span className="font-bold">{String(tx.type).toLowerCase() === 'purchase' ? '−' : '+'}</span>
                  {formatCurrencyVND(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!loading && filtered.length > limit && (
        <MUIPagination
          currentPage={page}
          totalItems={filtered.length}
          itemsPerPage={limit}
          onPageChange={(newPage) => !loading && setPage(newPage)}
        />
      )}

      <GoogleAuthModal
        open={gaOpen}
        qrCode={gaQr}
        secretKey={gaSecret}
        otpauthUrl={gaUri}
        loadingQr={gaLoading}
        onClose={() => setGaOpen(false)}
        onSubmit={handleVerifyOtp}
      />

      {successMessage && <SuccessModal message={successMessage} onClose={() => setSuccessMessage('')} duration={3000} />}

      {showDisableModal && (
        <DisableGaModal
          open={showDisableModal}
          onClose={closeDisableGa}
          onDisabled={(msg) => {
            setSuccessMessage(msg || 'Tắt Google Authenticator thành công.');
            refreshWallet();
          }}
        />
      )}
      {withdrawOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Yêu cầu rút tiền</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Nhập tên chủ tài khoản"
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản"
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền muốn rút</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Nhập số tiền"
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setWithdrawOpen(false)} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={startWithdraw}
                disabled={withdrawLoading}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {withdrawLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      <TotpModal
        open={totpOpen}
        onClose={() => {
          setTotpOpen(false);
          setPendingWithdraw(null);
        }}
        onSubmit={handleSubmitTotp}
        loading={totpLoading}
        title="Xác thực rút tiền"
        helper="Nhập mã 6 số từ Google Authenticator để xác nhận rút tiền."
      />
    </section>
  );
}
