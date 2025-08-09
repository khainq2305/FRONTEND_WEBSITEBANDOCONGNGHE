import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const BoxOtp = ({ value, onChange, disabled }) => {
  const refs = useRef([]);
  const onInput = (e, i) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 1);
    const next = value.map((d, idx) => (idx === i ? v : d));
    onChange(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="flex items-center gap-2 mt-3">
      {value.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => onInput(e, i)}
          onKeyDown={e => onKeyDown(e, i)}
          disabled={disabled}
          className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ))}
    </div>
  );
};

// ✅ thêm secretKey, otpauthUrl
const GoogleAuthModal = ({ open, qrCode, secretKey = '', otpauthUrl = '', loadingQr = false, onClose, onSubmit }) => {
  const [otpArr, setOtpArr] = useState(Array(6).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [manual, setManual] = useState(false); // ✅ chế độ nhập thủ công

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  // reset khi mở lại modal
  useEffect(() => {
    if (open) {
      setOtpArr(Array(6).fill(''));
      setManual(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    const otp = otpArr.join('');
    if (otp.length !== 6 || submitting) return;
    try { setSubmitting(true); await onSubmit?.(otp); } finally { setSubmitting(false); }
  };

  if (!open) return null;

  const canSubmit = otpArr.join('').length === 6 && !submitting;
  const secretFormatted =
    (secretKey || '').replace(/\s+/g, '').toUpperCase().match(/.{1,4}/g)?.join(' ') || 'SECRET-KEY-TRỐNG';

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={onClose} />

      {/* card */}
      <div
        className="relative z-[10001] w-[92%] max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 sm:p-7"
        role="dialog" aria-modal="true" aria-labelledby="ga-title"
      >
       <button
  onClick={onClose}
  className="absolute -top-4 -right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700"
  aria-label="Đóng"
>
  ✕
</button>


        <div className="text-center">
          <h3 id="ga-title" className="text-[18px] font-semibold tracking-tight">
            Quét mã QR bằng Google Authenticator
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Bật <span className="font-medium">bảo mật thanh toán (2FA)</span> cho ví của bạn.
          </p>
        </div>

        {/* QR hoặc Nhập thủ công */}
        {!manual ? (
          <div className="mt-5 flex flex-col items-center">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
              <div className="w-48 h-48 grid place-items-center overflow-hidden rounded-lg">
                {loadingQr ? (
                  <div className="w-full h-full animate-pulse bg-gray-100 rounded" />
                ) : qrCode ? (
                  <img src={qrCode} alt="QR Code" className="w-48 h-48 object-contain" />
                ) : (
                  <span className="text-xs text-gray-400 px-2 text-center">
                    Chưa có QR (hãy gọi API enableGoogleAuth)
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 text-center">
              Mở Google Authenticator, quét mã và nhập OTP bên dưới
            </p>

            <button
              type="button"
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
              onClick={() => setManual(true)} // ✅ bật chế độ nhập tay
            >
              Không quét được? Nhập thủ công
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <div className="text-sm text-gray-600 text-center">Nhập thủ công bằng secret key</div>

            {/* Secret + Copy */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm tracking-widest text-gray-800 select-all">
                {secretFormatted}
              </div>
              <button
                type="button"
                className="px-3 py-2 rounded-md border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
                onClick={async () => { try { await navigator.clipboard.writeText(secretKey || ''); } catch {} }}
                disabled={!secretKey}
              >
                Sao chép
              </button>
            </div>

            {/* Link otpauth nếu có */}
            {otpauthUrl ? (
              <a
                href={otpauthUrl}
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
              >
                Mở Google Authenticator bằng liên kết otpauth://
              </a>
            ) : null}

            <button
              type="button"
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
              onClick={() => setManual(false)}
            >
              ← Quay lại quét QR
            </button>
          </div>
        )}

        {/* OTP & Submit */}
        <div className="mt-5 flex flex-col items-center">
          <BoxOtp value={otpArr} onChange={setOtpArr} disabled={submitting} />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Đang xác minh…' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GoogleAuthModal;
