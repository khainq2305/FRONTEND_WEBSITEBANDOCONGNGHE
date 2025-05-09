import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";

const ForgotPasswordNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(30);
  const [isExpired, setIsExpired] = useState(false);

  // ✅ Đếm ngược thời gian gửi lại liên kết
  useEffect(() => {
    let timer;
    if (resendTimeout > 0) {
      timer = setTimeout(() => setResendTimeout((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimeout]);

  // ✅ Gửi lại liên kết kích hoạt
  const handleResendEmail = async () => {
    if (resendLoading || resendTimeout > 0 || isExpired) return;

    try {
      setResendLoading(true);
      toast.dismiss(); // ✅ Xóa tất cả thông báo cũ
      const response = await authService.resendForgotPassword({ email });

      if (response.data?.message.includes("hết hạn")) {
        setIsExpired(true);
        toast.error("❌ Liên kết đã hết hạn. Vui lòng yêu cầu lại từ đầu.");
        return;
      }

      toast.success("✅ Đã gửi lại liên kết đến email của bạn.");
      setResendTimeout(30);
    } catch (error) {
      toast.dismiss();
      toast.error("❌ Không thể gửi lại liên kết. Vui lòng thử lại.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
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
          className={`mt-4 w-full py-3 rounded-lg font-semibold ${
            resendLoading || isExpired
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={resendLoading || resendTimeout > 0 || isExpired}
        >
          {resendLoading 
            ? "Đang gửi lại liên kết..." 
            : isExpired 
            ? "Liên kết đã hết hạn. Vui lòng yêu cầu lại." 
            : resendTimeout > 0 
            ? `Gửi lại liên kết (${resendTimeout}s)` 
            : "Gửi lại liên kết"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordNotice;
