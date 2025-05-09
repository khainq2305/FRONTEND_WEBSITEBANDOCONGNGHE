import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";

const RegisterEmailSentNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(10);

  // ✅ Đếm ngược thời gian gửi lại liên kết
  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  // ✅ Gửi lại liên kết kích hoạt tài khoản
  const handleResendEmail = async () => {
    if (resendLoading || resendTimeout > 0) return;

    setResendLoading(true);
    try {
      await authService.resendVerificationLink({ email });
      toast.success("✅ Đã gửi lại liên kết kích hoạt đến email của bạn.");
      setResendTimeout(10);
    } catch (error) {
      toast.error("❌ Không thể gửi lại liên kết. Vui lòng thử lại.");
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
          Chúng tôi đã gửi liên kết kích hoạt tài khoản đến địa chỉ email: 
          <span className="text-blue-600 font-semibold block mt-1">{email}</span>
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Không nhận được?</strong> Vui lòng kiểm tra thư mục <strong>'Spam'</strong> hoặc <strong>'Junk'</strong>.
        </p>
        <p className="text-gray-600 mt-2">Vẫn không tìm thấy email?</p>

        <button
          onClick={handleResendEmail}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${
            resendLoading
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={resendLoading || resendTimeout > 0}
        >
          {resendLoading 
            ? "Đang gửi lại liên kết..." 
            : resendTimeout > 0 
            ? `Gửi lại liên kết (${resendTimeout}s)` 
            : "Gửi lại liên kết" }
        </button>
      </div>
    </div>
  );
};

export default RegisterEmailSentNotice;
