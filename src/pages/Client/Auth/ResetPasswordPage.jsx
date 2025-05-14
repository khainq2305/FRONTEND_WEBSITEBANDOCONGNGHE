// src/components/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.search.split("=")[1];
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let validationErrors = {};

    // ✅ Kiểm tra mật khẩu mới
    if (!newPassword.trim()) {
      validationErrors.newPassword = "Mật khẩu không được để trống!";
    } else if (!validatePassword(newPassword)) {
      validationErrors.newPassword =
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
    }

    // ✅ Kiểm tra xác nhận mật khẩu chỉ khi submit
    if (confirmPassword.trim() && newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword });
      toast.success("✅ Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/dang-nhap");
    } catch (err) {
      setErrors({ global: err?.response?.data?.message || "❌ Lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md text-sm ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.newPassword}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md text-sm ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.global && (
            <p className="text-red-500 text-sm text-left">{errors.global}</p>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={loading}
          >
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
