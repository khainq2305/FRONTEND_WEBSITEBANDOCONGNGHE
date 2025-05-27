import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from 'services/client/authService';
import { toast } from 'react-toastify';
import { XCircle } from 'lucide-react';
import Loader from 'components/common/Loader';
import GradientButton from '../../../components/Client/GradientButton';

const ForgotPasswordNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [lockTime, setLockTime] = useState(0);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.dismiss();
      toast.error('Không tìm thấy email. Vui lòng thử lại.');
      navigate('/quen-mat-khau');
      return;
    }

    const resetSuccess = localStorage.getItem("passwordResetSuccess");
    if (resetSuccess === "true") {
      localStorage.removeItem("passwordResetSuccess");
      toast.success("Mật khẩu đã được đặt lại. Đang chuyển sang trang đăng nhập...");
      setVerified(true);
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 1000);
    } else {
      checkStatus();
    }
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLockTime((prev) => (prev > 0 ? prev - 1000 : 0));
      setResendTimeout((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const statusResponse = await authService.checkResetStatus(email);
      const { verified, lockTime, resendCooldown } = statusResponse.data;
      setVerified(verified);
      setLockTime(lockTime || 0);
      setResendTimeout(Math.ceil(resendCooldown / 1000) || 0);

      if (verified) {
        toast.success("Mật khẩu đã được đặt lại. Đang chuyển sang trang đăng nhập...");
        setTimeout(() => {
          navigate('/dang-nhap');
        }, 1000);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái:', error);
      toast.error('Không thể kiểm tra trạng thái đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendLoading || lockTime > 0 || resendTimeout > 0 || verified) {
      toast.error('Không thể gửi lại liên kết.');
      return;
    }

    setResendLoading(true);
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      const { resendCooldown } = response.data;
      setResendTimeout(Math.ceil(resendCooldown / 1000));
      toast.success('Đã gửi lại liên kết đến email của bạn.');
    } catch (error) {
      if (error.response?.data?.resendCooldown) {
        setResendTimeout(Math.ceil(error.response.data.resendCooldown / 1000));
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể gửi lại liên kết.');
      }
    } finally {
      setTimeout(() => {
        setResendLoading(false);
        setLoading(false);
      }, 300);
    }
  };

  const formatLockTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return hours > 0
      ? `${hours} giờ ${minutes % 60} phút ${seconds % 60} giây`
      : minutes > 0
      ? `${minutes} phút ${seconds % 60} giây`
      : `${seconds} giây`;
  };

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
          Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email:
          <span className="text-blue-600 font-semibold block mt-1">{email}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Không nhận được? Vui lòng kiểm tra thư mục <strong>'Spam'</strong> hoặc <strong>'Junk'</strong>.
        </p>

        <GradientButton
          onClick={handleResendEmail}
          disabled={resendLoading || lockTime > 0 || resendTimeout > 0 || verified}
          className="mt-4 w-full"
        >
          Gửi lại liên kết
        </GradientButton>

        {lockTime > 0 && (
          <div className="mt-4 p-3 text-left text-red-700 bg-red-100 border border-red-400 rounded-md flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <p className="font-semibold">Bạn đã gửi xác thực quá thường xuyên.</p>
              <p>Vui lòng thử lại sau {formatLockTime(lockTime)}.</p>
            </div>
          </div>
        )}
        {resendTimeout > 0 && (
          <div className="mt-4 p-3 text-left text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-md flex items-start gap-2">
            <XCircle className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <p className="font-semibold">Vui lòng đợi trước khi gửi lại.</p>
              <p>Thời gian chờ: {formatLockTime(resendTimeout * 1000)}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordNotice;
