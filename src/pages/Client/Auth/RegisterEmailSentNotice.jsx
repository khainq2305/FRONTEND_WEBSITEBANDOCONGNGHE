import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from 'services/client/authService';
import { toast } from 'react-toastify';
import { XCircle, Info } from 'lucide-react';
import Loader from 'components/common/Loader';
import GradientButton from '../../../components/Client/GradientButton';
const RegisterEmailSentNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [initialLockDurationMs, setInitialLockDurationMs] = useState(0);
  const [lockStartTime, setLockStartTime] = useState(0);
  const [initialResendCooldownSec, setInitialResendCooldownSec] = useState(0);
  const [resendCooldownStartTime, setResendCooldownStartTime] = useState(0);

  const [now, setNow] = useState(Date.now());
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendButtonLoading, setResendButtonLoading] = useState(false);
  const isFetchingStatusRef = useRef(false);

  useEffect(() => {
    if (!email) {
      toast.error('Không tìm thấy email. Vui lòng thử lại.');
      navigate('/dang-ky');
    }
  }, [email, navigate]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!email || isFetchingStatusRef.current) {
        return;
      }
      isFetchingStatusRef.current = true;

      try {
        const checkResponse = await authService.checkVerificationStatus(email);
        if (checkResponse.data.verified) {
          setIsVerified(true);
          setLoading(false);
          toast.success('Tài khoản của bạn đã được xác thực! Vui lòng đăng nhập');
          setTimeout(() => {
            navigate('/dang-nhap');
          }, 3000);
          isFetchingStatusRef.current = false;
          return;
        }

        const cooldownResponse = await authService.getVerificationCooldown(email);
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
        setLoading(false);
        isFetchingStatusRef.current = false;
      }
    };

    if (email) {
      setLoading(true);
      fetchStatus();
      const intervalId = setInterval(() => {
        fetchStatus();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [email, navigate]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  let remainingLockMs = 0;
  if (initialLockDurationMs > 0 && lockStartTime > 0) {
    remainingLockMs = Math.max(0, initialLockDurationMs - (now - lockStartTime));
  }

  let remainingResendSeconds = 0;
  if (initialResendCooldownSec > 0 && resendCooldownStartTime > 0) {
    remainingResendSeconds = Math.max(0, initialResendCooldownSec - Math.floor((now - resendCooldownStartTime) / 1000));
  }

  const handleResendEmail = async () => {
    if (resendButtonLoading || remainingLockMs > 0 || remainingResendSeconds > 0) {
      return;
    }

    setResendButtonLoading(true);
    setLoading(true);

    try {
      const checkResponse = await authService.checkVerificationStatus(email);
      if (checkResponse.data.verified) {
        setIsVerified(true);
        toast.success('Tài khoản đã xác thực!');
        navigate('/dang-nhap');
        return;
      }

      await authService.resendVerificationLink({ email });
      toast.success('Đã gửi lại liên kết đến email của bạn.');
      const cdRes = await authService.getVerificationCooldown(email);
      const cdMs = cdRes.data.cooldown || 0;
      setInitialResendCooldownSec(Math.ceil(cdMs / 1000));
      setResendCooldownStartTime(cdMs > 0 ? Date.now() : 0);
    } catch (error) {
      console.error('Lỗi gửi lại liên kết:', error);
      toast.error('Không thể gửi lại liên kết.');
    } finally {
      setResendButtonLoading(false);
      setLoading(false);
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

  if (isVerified) {
    return null;
  }

  if (!email && !loading) {
    return <Loader fullscreen />;
  }

  const isAccountLocked = remainingLockMs > 0;
  const isResendOnCooldown = !isAccountLocked && remainingResendSeconds > 0;

  const isButtonDisabled = resendButtonLoading || isAccountLocked || isResendOnCooldown;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && <Loader fullscreen />}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <img
          src="https://www.geetest.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsuccess.04438e03.png&w=384&q=75"
          alt="Cảm ơn bạn!"
          className="w-16 mx-auto mb-3"
        />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Cảm ơn bạn!</h2>
        <p className="text-gray-600">
          Chúng tôi đã gửi liên kết kích hoạt tài khoản đến địa chỉ email:
          <span className="text-blue-600 font-semibold block mt-1">{email}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Không nhận được? Vui lòng kiểm tra thư mục <strong>'Spam'</strong> hoặc <strong>'Junk'</strong>.
        </p>

        <GradientButton onClick={handleResendEmail} disabled={isButtonDisabled} className="mt-4 w-full">
          Gửi lại liên kết
        </GradientButton>

        {(isAccountLocked || isResendOnCooldown) && (
          <div
            className={`mt-4 p-3 text-left border rounded-md flex items-center gap-2 ${
              isAccountLocked ? 'text-red-700 bg-red-100 border-red-400' : 'text-amber-700 bg-amber-100 border-amber-400'
            }`}
          >
            {isAccountLocked ? (
              <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            )}
            <div>
              {isAccountLocked ? (
                <>
                  <p className="font-semibold">Bạn đã gửi liên kết xác thực quá thường xuyên.</p>
                  <p>Vui lòng thử lại sau {formatMillisecondsToTime(remainingLockMs)}.</p>
                </>
              ) : (
                <p>Vui lòng chờ {remainingResendSeconds} giây để gửi lại liên kết.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEmailSentNotice;
