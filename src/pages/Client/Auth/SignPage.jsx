// src/pages/AuthPage.jsx
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from 'services/client/authService'; 
import Loader from 'components/common/Loader'; 
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/dang-nhap';

  const {
    register,
    handleSubmit,
    setError, 
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
  
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); 
  
      if (isLogin) {
        const response = await authService.login(data);
        const { token } = response.data; 
        if (data.remember) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        
        navigate('/');
      } else { // Đăng ký
        const response = await authService.register(data);
        const { otpToken } = response.data; 
        navigate('/otp-verification', {
          state: {
            email: data.email,
            
            otpToken, 
          },
        });
      }
    } catch (err) {
      console.error("Lỗi Auth:", err);
      const apiErrorMessage = err?.response?.data?.message || 
                             (isLogin ? "Email hoặc mật khẩu không chính xác." : "Đăng ký không thành công, vui lòng thử lại.");
      setErrorMessage(apiErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await authService.loginWithGoogle(
        { token: credentialResponse.credential }
        // { withCredentials: true } // Thường không cần nếu server không yêu cầu cookie đặc biệt
      );
      console.log("🔎 Đăng nhập Google response:", response.data);
      
      const { token, user } = response.data; // Giả sử token và user nằm trong response.data
  
      // Chỉ lưu token nếu đăng nhập thành công và có token
      // Việc lưu user có fullName hay không tùy thuộc vào logic của bạn
      if (token) {
        localStorage.setItem("token", token);
        if (user) { // Lưu user nếu có
            localStorage.setItem("user", JSON.stringify(user)); 
        }
      }
      navigate('/');
    } catch (err) {
      console.error("❌ Đăng nhập Google thất bại:", err);
      const googleApiErrorMessage = err?.response?.data?.message || 'Đăng nhập Google thất bại!';
      setErrorMessage(googleApiErrorMessage); 
    
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50"> 
      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-white text-lg font-semibold mt-3">Đang xử lý...</p>
          </div>
        </div>
      )}

      <div 
        className="hidden lg:flex w-1/2 relative overflow-hidden text-white flex-col justify-center items-center p-10" 
        style={{ 
          backgroundColor: 'var(--secondary-color)', // Đảm bảo biến CSS này được định nghĩa
          // clipPath: 'polygon(0 0, 100% 0, 90% 54%, 69% 100%, 0 100%, 0% 50%)' // Có thể đơn giản hóa hoặc bỏ nếu gây lỗi hiển thị
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' // Một ví dụ clip-path đơn giản hơn
        }}
      >
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center max-w-md"> {/* Giới hạn max-w cho text */}
          <h2 className="text-3xl xl:text-4xl font-bold mb-4" style={{ color: "var(--text-on-secondary)" }}> {/* Giả sử có text-on-secondary */}
            {isLogin ? "Chào mừng trở lại!" : "Tham gia cùng chúng tôi!"}
          </h2>
          <p className="text-lg xl:text-xl mb-6" style={{ color: "var(--text-on-secondary-muted)" }}> {/* Giả sử có text-on-secondary-muted */}
            {isLogin 
              ? "Đăng nhập để tiếp tục hành trình và khám phá những điều mới mẻ." 
              : "Tạo tài khoản để nhận những ưu đãi đặc biệt và trải nghiệm dịch vụ tốt nhất."}
          </p>
          {isLogin ? (
            <Link
              to="/dang-ky"
              className="px-6 py-2.5 rounded-full font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: "var(--primary-color)", color: "var(--text-on-primary)" }} // Giả sử có text-on-primary
            >
              Tạo tài khoản mới
            </Link>
          ) : (
            <Link
              to="/dang-nhap"
              className="px-6 py-2.5 rounded-full font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: "var(--primary-color)", color: "var(--text-on-primary)" }}
            >
              Đăng nhập ngay
            </Link>
          )}
        </div>
      </div>


      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-4 sm:p-8">
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[var(--primary-color)]"> 
            {isLogin ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
          </h2>

          {errorMessage && (
            <div className="flex items-center gap-2 mb-4 text-red-600 bg-red-50 border border-red-300 rounded-md p-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="flex flex-col gap-1"> {/* Giảm gap */}
                <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                <input
                  {...register('fullName', { required: 'Vui lòng nhập họ và tên.' })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base ${
                    errors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-primary focus:ring-primary-light' 
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" // Thêm type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ.' },
                })}
                placeholder="vidu@email.com"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-primary focus:ring-primary-light'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1 relative">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu.',
                    ...(!isLogin && { // Chỉ áp dụng pattern cho đăng ký
                      minLength: { value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.'},
                      pattern: { 
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]).{8,}$/, 
                        message: 'Mật khẩu cần chữ hoa, thường, số, ký tự đặc biệt.' 
                      },
                    }),
                  })}
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 pr-10 text-sm sm:text-base ${
                    errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-primary focus:ring-primary-light'
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1 relative">
                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Vui lòng nhập lại mật khẩu.',
                      validate: (value) => value === watch('password') || 'Mật khẩu không khớp.',
                    })}
                    className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 pr-10 text-sm sm:text-base ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-primary focus:ring-primary-light'
                    }`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    {...register('remember')}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-light" // Style checkbox
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link to="/quen-mat-khau" className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-dark-color)]">Quên mật khẩu?</Link>
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-300 text-sm sm:text-base
                ${!isValid || isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[var(--primary-color)] hover:bg-[var(--primary-dark-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light'
                }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? (
              <p>Bạn chưa có tài khoản? <Link to="/dang-ky" className="font-semibold text-[var(--primary-color)] hover:text-[var(--primary-dark-color)]">Đăng ký ngay</Link></p>
            ) : (
              <p>Bạn đã có tài khoản? <Link to="/dang-nhap" className="font-semibold text-[var(--primary-color)] hover:text-[var(--primary-dark-color)]">Đăng nhập ngay</Link></p>
            )}
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Các nút social login - có thể cho stack theo chiều dọc trên mobile */}
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
                 <GoogleLogin 
                    onSuccess={handleGoogleLogin} 
                    onError={() => setErrorMessage('Đăng nhập Google thất bại!')} 
                    width="100%" 
                    size="large" 
                    theme="outline" 
                    shape="rectangular" 
                    logo_alignment="left" 
                 />
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700 shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" className="w-5 h-5" /> {/* Giảm kích thước icon */}
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;