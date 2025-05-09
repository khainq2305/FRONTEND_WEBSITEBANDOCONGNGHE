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
const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};
const [errorMessage, setErrorMessage] = useState("");
const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword((prev) => !prev);
};
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Xóa thông báo lỗi cũ
  
      if (isLogin) {
        const response = await authService.login(data);
        const { token } = response.data;
        if (data.remember) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        navigate('/');
      } else {
        const response = await authService.register(data);
        const { otpToken } = response.data;
        navigate('/register-email-sent', {
          state: {
            email: data.email,
            fullName: data.fullName,
            password: data.password,
            otpToken,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };
  

  

  // src/pages/AuthPage.jsx
const handleGoogleLogin = async (credentialResponse) => {
  try {
    setIsLoading(true);
    const response = await authService.loginWithGoogle(
      { token: credentialResponse.credential },
      { withCredentials: true }
    );
    console.log("🔎 Đăng nhập Google response:", response.data);
    
    const { token, user } = response.data;

    if (user.fullName) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Lưu thông tin user
    }
    navigate('/');
  } catch (err) {
    console.error("❌ Đăng nhập Google thất bại:", err);
    alert(err?.response?.data?.message || 'Đăng nhập Google thất bại!');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen">
   {/* Loader Overlay */}
   {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-white text-lg font-semibold mt-2">Đang xử lý...</p>
          </div>
        </div>
      )}

<div 
  className="hidden lg:flex w-1/2 relative overflow-hidden text-white flex-col justify-center items-center p-10" 
  style={{ 
    backgroundColor: 'var(--secondary-color)', 
    clipPath: 'polygon(0 0, 100% 0, 90% 54%, 69% 100%, 0 100%, 0% 50%)' 
  }}
>
  {/* Nội dung hiển thị trên nền đen với điểm nhấn đỏ */}
  <div className="relative z-10 flex flex-col justify-center items-center h-full text-center p-10">
    <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
      {isLogin ? "Bạn mới đến?" : "Bạn đã có tài khoản?"}
    </h2>
    <p className="text-lg max-w-xs mb-4" style={{ color: "var(--text-color)" }}>
      {isLogin 
        ? "Hãy đăng ký để tham gia cộng đồng của chúng tôi và khám phá những điều thú vị!" 
        : "Đăng nhập để tiếp tục khám phá các tính năng tuyệt vời của chúng tôi."}
    </p>
    {isLogin ? (
      <Link
        to="/dang-ky"
        className="px-4 py-2 rounded-full font-semibold transition"
        style={{ backgroundColor: "var(--primary-color)", color: "var(--light-color)" }}
      >
        Đăng ký ngay
      </Link>
    ) : (
      <Link
        to="/dang-nhap"
        className="px-4 py-2 rounded-full font-semibold transition"
        style={{ backgroundColor: "var(--primary-color)", color: "var(--light-color)" }}
      >
        Đăng nhập ngay
      </Link>
    )}
  </div>
</div>


      {/* Phần form bên phải */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">

  <div className="bg-light shadow-md rounded-lg p-6 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4 text-center text-primary">
      {isLogin ? 'Đăng nhập' : 'Đăng ký'}
    </h2>
{/* Thông báo lỗi dưới nút đăng nhập */}
{errorMessage && (
  <div className="flex items-center gap-2 mt-3 mb-3 text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
    <AlertCircle className="w-5 h-5" />
    <p>{errorMessage}</p>
  </div>
)}

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  {!isLogin && (
     <div className="flex flex-col gap-0.5">
     <label className="block text-sm font-medium text-text-color">Họ và Tên</label>
     <input
       {...register('fullName', { required: 'Vui lòng nhập họ và tên.' })}
       placeholder="Họ và Tên"
       className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
         errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
       }`}
     />
     {errors.fullName && <p className="text-red-500 text-sm mt-0.5">{errors.fullName.message}</p>}
   </div>
  )}

<div className="flex flex-col gap-0.5">
    <label className="block text-sm font-medium text-text-color">Email</label>
    <input
      {...register('email', {
        required: 'Vui lòng nhập email.',
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: 'Email không hợp lệ.',
        },
      })}
      placeholder="Email"
      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
      }`}
    />
    {errors.email && <p className="text-red-500 text-sm mt-0.5">{errors.email.message}</p>}
  </div>

  {/* Mật khẩu */}
  {/* Mật khẩu */}
<div className="flex flex-col gap-0.5 relative">
  <label className="block text-sm font-medium">Mật khẩu</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      {...register('password', {
        required: 'Vui lòng nhập mật khẩu.',
        ...(isLogin
          ? {} // Không bắt lỗi phức tạp cho form đăng nhập
          : {
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
              },
            }),
      })}
      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 pr-10 ${
        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
      }`}
      placeholder="Mật khẩu"
    />
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute right-2 top-2 text-gray-500 focus:outline-none"
    >
      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  </div>
  {errors.password && <p className="text-red-500 text-sm mt-0.5">{errors.password.message}</p>}
</div>


  {/* Xác nhận mật khẩu (chỉ khi không phải đăng nhập) */}
  {!isLogin && (
    <div className="flex flex-col gap-0.5 relative mt-4">
      <label className="block text-sm font-medium">Xác nhận mật khẩu</label>
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword', {
            required: 'Vui lòng nhập lại mật khẩu.',
            validate: (value) => value === watch('password') || 'Mật khẩu không khớp.',
          })}
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 pr-10 ${
            errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'
          }`}
          placeholder="Xác nhận mật khẩu"
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-2 top-2 text-gray-500 focus:outline-none"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {errors.confirmPassword && <p className="text-red-500 text-sm mt-0.5">{errors.confirmPassword.message}</p>}
    </div>
            )}
  

  {/* Ghi nhớ đăng nhập */}
  {isLogin && (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('remember')}
          className="focus:ring-primary text-primary"
        />
        <label className="text-sm text-text-color">Ghi nhớ đăng nhập</label>
      </div>
      <Link to="/quen-mat-khau" className="text-primary text-sm font-semibold">Quên mật khẩu?</Link>
    </div>
  )}

<button
              type="submit"
              className={`w-full bg-primary-color text-light-color font-bold py-2 rounded hover:bg-opacity-90 transition ${
                !isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isValid || isLoading}
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
      
</form>



    <div className="mt-4 text-center text-neutral-color">
      {isLogin ? (
        <p>Bạn chưa có tài khoản? <Link to="/dang-ky" className="text-primary font-semibold">Đăng ký ngay</Link></p>
      ) : (
        <p>Bạn đã có tài khoản? <Link to="/dang-nhap" className="text-primary font-semibold">Đăng nhập ngay</Link></p>
      )}
    </div>

    <div className="mt-6 text-center text-neutral-color">Hoặc đăng nhập bằng</div>
    <div className="flex justify-center items-center gap-4 mt-4">
      <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert('Đăng nhập Google thất bại!')} />
      <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" className="w-6 h-6" />
        Facebook
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default AuthPage;
