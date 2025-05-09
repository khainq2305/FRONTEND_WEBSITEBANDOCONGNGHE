import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from 'services/client/authService';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate('/forgot-password-notice', { state: { error: "❌ Liên kết đã hết hạn hoặc không hợp lệ!" } });
        return;
      }

      try {
        const response = await authService.verifyResetToken(token);
        if (response.data.status !== "valid") {
          navigate('/forgot-password-notice', { state: { error: "❌ Liên kết đã hết hạn hoặc không hợp lệ!" } });
        }
      } catch (err) {
        navigate('/forgot-password-notice', { state: { error: "❌ Liên kết đã hết hạn hoặc không hợp lệ!" } });
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewPasswordError('');
    setConfirmPasswordError('');

    if (newPassword.trim() === '') {
      setNewPasswordError("❌ Vui lòng nhập mật khẩu mới!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await authService.resetPassword({ token, newPassword });
      toast.success("✅ Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      setTimeout(() => navigate('/dang-nhap'), 2000);
    } catch (err) {
      toast.error("❌ Lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 relative">
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
