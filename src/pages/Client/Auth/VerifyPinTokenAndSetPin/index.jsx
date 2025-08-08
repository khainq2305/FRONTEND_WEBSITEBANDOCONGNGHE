import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { walletService } from '@/services/client/walletService';
import { toast } from 'react-toastify';
import { ShieldCheck, KeyRound, XCircle, Info } from 'lucide-react';
import GradientButton from '@/components/Client/GradientButton';
import OtpInput from './OtpInput';

const VerifyPinTokenAndSetPin = () => {
  const location = useLocation();
  const emailFromLocation = location.state?.email || '';
  const [email, setEmail] = useState(emailFromLocation);

  const [searchParams] = useSearchParams();
  const tokenFromURL = searchParams.get('token');
  const mode = searchParams.get('mode'); // 'forgot' hoặc undefined

  const navigate = useNavigate();

  const [tokenInput, setTokenInput] = useState('');
  const [step, setStep] = useState('verify'); // 'verify' | 'setpin'
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendButtonLoading, setResendButtonLoading] = useState(false);
  const isFetchingStatusRef = useRef(false);

  // Trạng thái cooldown & lock
  const [initialLockDurationMs, setInitialLockDurationMs] = useState(0);
  const [lockStartTime, setLockStartTime] = useState(0);
  const [initialResendCooldownSec, setInitialResendCooldownSec] = useState(0);
  const [resendCooldownStartTime, setResendCooldownStartTime] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Timer for cooldown/lock
  useEffect(() => {
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Fetch cooldown/lock status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!email || isFetchingStatusRef.current) return;
      isFetchingStatusRef.current = true;

      try {
        const cooldownResponse = await walletService.getWalletPinCooldown();
        const serverTotalLockMs = cooldownResponse.data.lockTime || 0;
        const serverTotalResendCooldownMs = cooldownResponse.data.cooldown || 0;
        const serverTotalResendCooldownSec = Math.ceil(serverTotalResendCooldownMs / 1000);

        if (serverTotalLockMs !== initialLockDurationMs) {
          setInitialLockDurationMs(serverTotalLockMs);
          setLockStartTime(serverTotalLockMs > 0 ? Date.now() : 0);
        }

        if (serverTotalResendCooldownSec !== initialResendCooldownSec) {
          setInitialResendCooldownSec(serverTotalResendCooldownSec);
          setResendCooldownStartTime(serverTotalResendCooldownSec > 0 ? Date.now() : 0);
        }
      } catch (error) {
        toast.error('Không thể kiểm tra trạng thái xác thực.');
      } finally {
        isFetchingStatusRef.current = false;
      }
    };

    if (email) {
      fetchStatus();
      const intervalId = setInterval(fetchStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [email, initialLockDurationMs, initialResendCooldownSec]);

  // ✅ Get email and check wallet status on mount
  useEffect(() => {
    const checkWalletAndRedirect = async () => {
      try {
        const res = await walletService.getWallet();
        const data = res?.data?.data;
        
        if (data?.email) {
          setEmail(data.email);
        }

        // ✅ LOGIC QUAN TRỌNG: Nếu đã có PIN, chuyển hướng ngay lập tức
    if (data?.hasPin && mode !== 'forgot') {
  toast.success('Bạn đã thiết lập mã PIN trước đó.');
  navigate('/user-profile#vi-noi-bo');
  return;
}


        // Nếu có token trên URL, chuyển sang bước thiết lập PIN
        if (tokenFromURL) {
          setStep('setpin');
        }
      } catch (err) {
        console.error('❌ Lỗi gọi API getWallet:', err);
      }
    };
    
    checkWalletAndRedirect();
  }, [tokenFromURL, navigate]);


  const handleVerifyToken = async () => {
    const token = tokenFromURL || tokenInput;
    if (!token) return toast.error('Vui lòng nhập mã xác minh.');

    setLoading(true);
    try {
 if (mode === 'forgot') {
  await walletService.verifyForgotPinToken({ token });
} else {
  await walletService.verifyPinToken({ token });
}

      toast.success('Xác minh mã thành công!');
      setStep('setpin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mã xác minh không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };


  const handleSetPin = async () => {
    if (pin.length !== 6 || !/^\d+$/.test(pin)) return toast.error('Mã PIN phải gồm 6 chữ số.');
    if (pin !== confirmPin) return toast.error('Mã PIN không khớp.');

    setLoading(true);
    try {
     if (mode === 'forgot') {
  await walletService.resetPin({ pin });
} else {
  await walletService.setPin({ pin });
}

      toast.success('Thiết lập mã PIN thành công!');
      
      // ✅ Chuyển hướng về trang ví sau khi thiết lập thành công
      navigate('/user-profile#vi-noi-bo');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi thiết lập mã PIN.');
    } finally {
      setLoading(false);
    }
  };


  // Logic gửi lại mã
  const handleResendPin = async () => {
    setResendButtonLoading(true);
    try {
      await walletService.sendPinVerification();
      toast.success('Đã gửi lại mã xác minh đến email của bạn.');
      const cdRes = await walletService.getWalletPinCooldown();
      const cdMs = cdRes.data.cooldown || 0;
      setInitialResendCooldownSec(Math.ceil(cdMs / 1000));
      setResendCooldownStartTime(cdMs > 0 ? Date.now() : 0);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể gửi lại mã xác minh.';
      console.error('❌ resend error:', message, error);
      toast.error(message);
    } finally {
      setResendButtonLoading(false);
    }
  };

  const formatMillisecondsToTime = (milliseconds) => {
    if (milliseconds <= 0) return '0 giây';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours} giờ ${minutes} phút ${seconds} giây`;
    if (minutes > 0) return `${minutes} phút ${seconds} giây`;
    return `${seconds} giây`;
  };

  let remainingLockMs = 0;
  if (initialLockDurationMs > 0 && lockStartTime > 0) {
    remainingLockMs = Math.max(0, initialLockDurationMs - (now - lockStartTime));
  }

  let remainingResendSeconds = 0;
  if (initialResendCooldownSec > 0 && resendCooldownStartTime > 0) {
    remainingResendSeconds = Math.max(0, initialResendCooldownSec - Math.floor((now - resendCooldownStartTime) / 1000));
  }

  const isAccountLocked = remainingLockMs > 0;
  const isResendOnCooldown = !isAccountLocked && remainingResendSeconds > 0;
  const isButtonDisabled = loading || resendButtonLoading || isAccountLocked || isResendOnCooldown;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-10">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="Xác minh mã"
          className="w-16 mx-auto mb-3"
        />
       <h2 className="text-2xl font-semibold mb-2 text-gray-800">
  {step === 'verify'
    ? (mode === 'forgot' ? 'Quên mã PIN' : 'Xác minh mã xác thực')
    : 'Thiết lập mã PIN'}
</h2>

        <p className="text-gray-600 mb-4">
          Email: <span className="text-blue-600 font-semibold">{email}</span>
        </p>

        {step === 'verify' && (
          <>
            <OtpInput value={tokenInput} onChange={setTokenInput} disabled={isButtonDisabled} />

            <GradientButton onClick={handleVerifyToken} disabled={isButtonDisabled} className="w-full">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Xác minh mã</span>
              </div>
            </GradientButton>

            <p
              onClick={!isButtonDisabled ? handleResendPin : undefined}
              className={`mt-2 text-sm underline text-blue-600 hover:text-blue-800 cursor-pointer ${
                isButtonDisabled ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Gửi lại mã xác minh
            </p>


            {(isAccountLocked || isResendOnCooldown) && (
              <div className={`mt-4 p-3 text-left border rounded-md flex items-center gap-2 ${isAccountLocked ? 'text-red-700 bg-red-100 border-red-400' : 'text-amber-700 bg-amber-100 border-amber-400'}`}>
                {isAccountLocked ? (<XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />) : (<Info className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />)}
                <div>
                  {isAccountLocked ? (
                    <>
                      <p className="font-semibold">Bạn đã gửi mã quá thường xuyên.</p>
                      <p>Vui lòng thử lại sau {formatMillisecondsToTime(remainingLockMs)}.</p>
                    </>
                  ) : (
                    <p>Vui lòng chờ {remainingResendSeconds} giây để gửi lại.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {step === 'setpin' && (
          <>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1 text-center">Nhập mã PIN</p>
              <div className="flex justify-center">
                <OtpInput value={pin} onChange={setPin} disabled={loading} />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-1 text-center">Nhập lại mã PIN</p>
              <div className="flex justify-center">
                <OtpInput value={confirmPin} onChange={setConfirmPin} disabled={loading} />
              </div>
            </div>

            <GradientButton onClick={handleSetPin} disabled={loading} className="w-full">
              <div className="flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Thiết lập mã PIN</span>
              </div>
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPinTokenAndSetPin;
