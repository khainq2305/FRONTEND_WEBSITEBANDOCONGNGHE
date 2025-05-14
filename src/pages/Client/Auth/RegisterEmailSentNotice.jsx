import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";

const RegisterEmailSentNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // ✅ Kiểm tra trạng thái khi trang tải lại
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await authService.getVerificationCooldown(email);
        const { lockUntil, resendCooldown } = response.data;
        const now = Date.now();

        if (lockUntil) {
          const lockRemaining = Math.max(0, new Date(lockUntil).getTime() - now);
          setLockTime(lockRemaining);
          setLocked(lockRemaining > 0);
        } else {
          setLockTime(0);
          setLocked(false);
        }

        if (resendCooldown) {
          const cooldownRemaining = Math.max(0, new Date(resendCooldown).getTime() - now);
          setResendTimeout(Math.ceil(cooldownRemaining / 1000));
        } else {
          setResendTimeout(0);
        }
      } catch (error) {
        console.error("❌ Lỗi kiểm tra trạng thái:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Cập nhật sau mỗi 5 giây

    return () => clearInterval(interval);
  }, [email]);

  // ✅ Đếm ngược cooldown và lockTime
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimeout((prev) => (prev > 0 ? prev - 1 : 0));
      setLockTime((prev) => {
        if (prev > 1000) {
          return prev - 1000;
        } else {
          setLocked(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Xử lý gửi lại link xác thực
  const handleResendEmail = async () => {
    if (resendLoading || locked || resendTimeout > 0) return;

    setResendLoading(true);
    try {
      const response = await authService.resendVerificationLink({ email });
      toast.success("✅ Đã gửi lại liên kết đến email của bạn.");
    } catch (error) {
      toast.error("❌ Không thể gửi lại liên kết.");
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
          Không nhận được? Vui lòng kiểm tra thư mục <strong>'Spam'</strong> hoặc <strong>'Junk'</strong>.
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

        {locked && lockTime > 0 && (
          <div className="mt-4 p-3 text-left text-red-700 bg-red-100 border border-red-400 rounded-md flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <p className="font-semibold">Bạn đã gửi liên kết xác thực quá thường xuyên.</p>
              <p>Vui lòng thử lại sau</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEmailSentNotice;
