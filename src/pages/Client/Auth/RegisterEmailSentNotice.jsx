import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import Loader from "components/common/Loader";

const RegisterEmailSentNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [lockTime, setLockTime] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!email) {
      toast.error("Không tìm thấy email. Vui lòng thử lại.");
      navigate("/dang-ky");
    }
  }, [email, navigate]);


 useEffect(() => {
  const fetchStatus = async () => {
    if (!email) return;

    setLoading(true); // ✅ Hiển thị Loader toàn màn hình
    try {
      const checkResponse = await authService.checkVerificationStatus(email);
      if (checkResponse.data.verified) {
        setIsVerified(true);
        toast.success("Tài khoản của bạn đã được xác thực! Vui lòng đăng nhập");
        navigate("/dang-nhap");
        return;
      }

      const response = await authService.getVerificationCooldown(email);
      const { cooldown, lockTime } = response.data;
      setLockTime(lockTime || 0);
      setResendTimeout(Math.ceil(cooldown / 1000) || 0);
    } catch (error) {
      toast.error("Không thể kiểm tra trạng thái xác thực.");
    } finally {
      setLoading(false); // ✅ Tắt Loader toàn màn hình
    }
  };

  fetchStatus();
  const interval = setInterval(fetchStatus, 3000); 
  return () => {
    clearInterval(interval);
    setLoading(false); // ✅ Đảm bảo tắt Loader khi rời khỏi component
  };
}, [email, navigate]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setLockTime((prev) => (prev > 1000 ? prev - 1000 : 0));
      setResendTimeout((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleResendEmail = async () => {
  if (resendLoading || lockTime > 0 || resendTimeout > 0) {
    toast.error("Không thể gửi lại liên kết.");
    return;
  }

  setResendLoading(true);
  setLoading(true); // ✅ Hiển thị Loader toàn màn hình

  try {
    await authService.resendVerificationLink({ email });
    toast.success("Đã gửi lại liên kết đến email của bạn.");
    setResendTimeout(10); 
  } catch (error) {
    console.error("Lỗi gửi lại liên kết:", error);
    toast.error("Không thể gửi lại liên kết.");
  } finally {
    setResendLoading(false);
    setLoading(false); // ✅ Tắt Loader toàn màn hình
  }
};

 
  const formatLockTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

    if (hours > 0) return `${hours} giờ ${minutes} phút ${seconds} giây`;
    if (minutes > 0) return `${minutes} phút ${seconds} giây`;
    return `${seconds} giây`;
  };


  if (isVerified) {
    return null; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading && <Loader fullscreen />} {/* ✅ Loader toàn màn hình */}

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

    
        <button
          onClick={handleResendEmail}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${
            resendLoading || lockTime > 0 || resendTimeout > 0 
              ? "bg-gray-300 text-white cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={resendLoading || lockTime > 0 || resendTimeout > 0}
        >
          {lockTime > 0 
            ? `Đang khóa (${formatLockTime(lockTime)})`
            : resendTimeout > 0 
            ? `Gửi lại liên kết (${resendTimeout}s)` 
            : "Gửi lại liên kết"}
        </button>

       
        {lockTime > 0 && (
          <div className="mt-4 p-3 text-left text-red-700 bg-red-100 border border-red-400 rounded-md flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <p className="font-semibold">Bạn đã gửi liên kết xác thực quá thường xuyên.</p>
              <p>Vui lòng thử lại sau {formatLockTime(lockTime)}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEmailSentNotice;
