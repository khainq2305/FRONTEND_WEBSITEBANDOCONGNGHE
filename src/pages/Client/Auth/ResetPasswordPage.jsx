// src/components/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "services/client/authService";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "components/common/Loader"; 
import { XCircle } from "lucide-react";

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
  const [tokenValid, setTokenValid] = useState(false);

useEffect(() => {
  const verifyToken = async () => {
    if (!token) {
      toast.error("Thiếu token xác thực!");
      navigate("/quen-mat-khau");
      return;
    }

    try {
      const response = await authService.verifyResetToken(token);
      if (response.data.verified) {
        setTokenValid(true);
      } else {
        toast.error(response.data.message || "Liên kết không hợp lệ hoặc đã hết hạn.");
        navigate("/quen-mat-khau");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Lỗi xác thực token. Vui lòng thử lại.";
      toast.error(errorMessage);
      navigate("/quen-mat-khau");
    }
  };

  verifyToken();
}, [token, navigate]);

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!tokenValid) {
      toast.error("Liên kết không hợp lệ hoặc đã hết hạn.");
      setTimeout(() => navigate("/dang-nhap"), 2000);
      return;
    }

    let validationErrors = {};

if (!newPassword || newPassword.trim().length === 0) {
  validationErrors.newPassword = "Mật khẩu không được để trống!";
    } else if (!validatePassword(newPassword)) {
      validationErrors.newPassword =
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
    }

    if (confirmPassword.trim() && newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
   await authService.resetPassword({ token, newPassword, confirmPassword });

      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      setTimeout(() => navigate("/dang-nhap"), 2000); 
    } catch (err) {
      setErrors({ global: err?.response?.data?.message || "Lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
  {loading && <Loader fullscreen />}

  <div
    className="bg-white shadow-xl rounded-lg w-full text-center relative"
    style={{
      maxWidth: "480px",
      paddingTop: "40px",
      paddingBottom: "40px",
      paddingLeft: "32px",
      paddingRight: "32px",
      borderRadius: "8px",
    }}
  >
    <h2 className="text-xl font-semibold text-gray-700 mb-6">
      Đặt lại mật khẩu
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
  
      <div className="relative flex flex-col items-start">
        <label htmlFor="newPasswordInput" className="text-sm font-medium text-gray-600 mb-1">
          Mật khẩu mới
        </label>
        <div className="w-full relative">
          <input
            id="newPasswordInput"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới của bạn"
            value={newPassword}
           onChange={(e) => {
  setNewPassword(e.target.value);
  if (errors?.newPassword) {
    const updatedErrors = { ...errors };
    delete updatedErrors.newPassword;
    setErrors(updatedErrors); // 👈 THÊM DÒNG NÀY
  }
}}

            className={`w-full px-4 py-3 border rounded-md text-sm
              ${ errors?.newPassword
                ? "border-red-500 focus:ring-red-300"
             
                : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
              }
              focus:outline-none focus:ring-1 transition-colors duration-200 ease-in-out`}
            disabled={loading}
          />
          <div
          
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[var(--primary-color)]" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        {errors?.newPassword && (
          <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.newPassword}</span>
          </div>
        )}
      </div>

      {/* Trường Xác nhận mật khẩu */}
      <div className="relative flex flex-col items-start">
        <label htmlFor="confirmPasswordInput" className="text-sm font-medium text-gray-600 mb-1">
          Xác nhận mật khẩu
        </label>
        <div className="w-full relative">
          <input
            id="confirmPasswordInput"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận lại mật khẩu mới"
            value={confirmPassword}
          onChange={(e) => {
  setConfirmPassword(e.target.value);
  if (errors?.confirmPassword) {
    const updatedErrors = { ...errors };
    delete updatedErrors.confirmPassword;
    setErrors(updatedErrors); // 👈 THÊM DÒNG NÀY
  }
}}

            className={`w-full px-4 py-3 border rounded-md text-sm
              ${ errors?.confirmPassword
                ? "border-red-500 focus:ring-red-300"
          
                : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              }
              focus:outline-none focus:ring-1 transition-colors duration-200 ease-in-out`}
            disabled={loading}
          />
          <div
          
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[var(--primary-color)]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        {errors?.confirmPassword && (
          <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
      </div>

      {errors?.global && (
        <div className="text-red-600 text-sm text-left bg-red-50 p-3 rounded-md border border-red-300 flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <span>{errors.global}</span>
        </div>
      )}

      
      <button
        type="submit"
        className={`w-full py-3 rounded-md text-white text-base font-semibold transition-opacity duration-200 ease-in-out
          ${ loading
        
            ? "bg-[var(--primary-color)] opacity-50 cursor-not-allowed" 
            : "bg-[var(--primary-color)] hover:opacity-85" 
        }`}
        disabled={loading}
        style={{ letterSpacing: '0.5px' }}
      >
        {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  </div>
</div>
  );
};

export default ResetPasswordPage;
