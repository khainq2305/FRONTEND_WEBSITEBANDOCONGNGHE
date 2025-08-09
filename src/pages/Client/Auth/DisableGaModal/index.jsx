import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { walletService } from '@/services/client/walletService';

const OtpInputs = ({ value, onChange, disabled }) => {
  const refs = useRef([]);
  const handleChange = (e, i) => {
    const v = e.target.value.replace(/\D/g, '');
    const next = value.map((d, idx) => (idx === i ? v : d));
    onChange(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="flex gap-2 mt-4">
      {value.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="tel"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none transition"
        />
      ))}
    </div>
  );
};

const DisableGaModal = ({ open, onClose, onDisabled }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 số.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await walletService.disableGa({ token: code });
      onDisabled?.('Tắt Google Authenticator thành công.');
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Tắt Google Auth thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const canSubmit = otp.join('').length === 6 && !loading;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Nền mờ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Nút ✕ nằm ngoài modal box */}
   
      {/* Hộp modal */}
      {/* Hộp modal */}
<div
  className="relative z-[10001] w-[92%] max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 sm:p-7"
  onClick={(e) => e.stopPropagation()}
  role="dialog"
  aria-modal="true"
  aria-labelledby="disable-ga-title"
>
  {/* Nút ✕ nằm trong modal box */}
  <button
    onClick={onClose}
    className="absolute -top-3 -right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100"
    aria-label="Đóng"
  >
    ✕
  </button>

  <div className="text-center">
    <h3 id="disable-ga-title" className="text-[18px] font-semibold tracking-tight">
      Tắt Google Authenticator
    </h3>
    <p className="mt-1 text-xs text-gray-500">
      Nhập mã 6 số từ Google Authenticator để xác nhận tắt.
    </p>
  </div>

  <OtpInputs value={otp} onChange={setOtp} disabled={loading} />
  {error && <p className="text-sm text-red-600 mt-3 text-center">{error}</p>}

  <button
    onClick={handleSubmit}
    disabled={!canSubmit}
    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-2.5 text-white font-medium shadow hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? 'Đang xử lý…' : 'Xác nhận tắt'}
  </button>
</div>

    </div>,
    document.body
  );
};

export default DisableGaModal;
