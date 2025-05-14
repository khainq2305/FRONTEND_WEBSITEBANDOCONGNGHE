// src/components/ForgotPasswordNotice.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";

const ForgotPasswordNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // ✅ Lấy trạng thái khóa và cooldown từ server một lần duy nhất
  useEffect(() => {
    const fetchLockStatus = async () => {
      if (!email) return;

      try {
        const response = await authService.checkResetStatus(email);
        const { lockTime, resendCooldown } = response.data;
        setLockTime(lockTime > 0 ? lockTime : 0);
        setLocked(lockTime > 0);
        setResendTimeout(resendCooldown > 0 ? resendCooldown : 0);
      } catch (error) {
        console.error("❌ Lỗi kiểm tra trạng thái:", error);
      }
    };

    fetchLockStatus();
  }, [email]);

  // ✅ Đếm ngược cooldown và khóa
  useEffect(() => {
    const interval = setInterval(() => {
      setLockTime((prev) => {
        if (prev > 0) return prev - 1000;
        setLocked(false);
        return 0;
      });
      setResendTimeout((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Gửi lại email đặt lại mật khẩu
  const handleResendEmail = async () => {
    if (resendLoading || resendTimeout > 0 || locked) return;

    setResendLoading(true);
    try {
      const response = await authService.resendForgotPassword({ email });
      toast.success("✅ Đã gửi lại liên kết đến email của bạn.");

      const { lockTime, resendCooldown } = response.data;
      setLockTime(lockTime > 0 ? lockTime : 0);
      setLocked(lockTime > 0);
      setResendTimeout(resendCooldown > 0 ? resendCooldown : 0);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "❌ Không thể gửi lại liên kết.";
      toast.error(errorMessage);

      if (error.response?.status === 429) {
        setLocked(true);
        setLockTime(error.response.data.lockTime || 60 * 60 * 1000);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <img 
          src="https://www.geetest.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsuccess.04438e03.png&w=384&q=75" 
          alt="Cảm ơn bạn!" 
          className="w-16 mx-auto mb-3" 
        />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Cảm ơn bạn!</h2>
        <hr className="my-4" />
        <p className="text-gray-600">
          Đã gửi liên kết đặt lại mật khẩu đến email:
          <span className="text-blue-600 font-semibold block mt-1">{email}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Nếu không nhận được email, vui lòng kiểm tra thư mục <strong>'Spam'</strong> hoặc <strong>'Junk'</strong>.
        </p>

        <button
          onClick={handleResendEmail}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${
            resendLoading || locked || resendTimeout > 0
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={resendLoading || locked || resendTimeout > 0}
        >
          {resendLoading
            ? "Đang gửi lại liên kết..."
            : locked
            ? `Đang khóa (${Math.floor(lockTime / 60000)} phút ${Math.floor((lockTime % 60000) / 1000)} giây)`
            : resendTimeout > 0
            ? `Gửi lại liên kết (${resendTimeout}s)` 
            : "Gửi lại liên kết"}
        </button>

        {/* ✅ Thông báo lỗi nếu bị khóa */}
        {locked && (
          <div className="mt-4 p-3 flex items-center text-red-700 bg-red-100 border border-red-400 rounded-md">
            <AlertCircle className="w-5 h-5 mr-2" />
            <div>
              <p className="font-semibold">Bạn đã gửi yêu cầu xác minh quá nhiều lần.</p>
              <p>Vui lòng thử lại sau.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordNotice;
