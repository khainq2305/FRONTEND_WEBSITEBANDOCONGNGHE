import React from "react";
import { Link, useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/dang-nhap';
  const isRegister = location.pathname === '/dang-ky';
  const isForgotPassword = location.pathname === '/quen-mat-khau';
  const isResetPassword = location.pathname === '/dat-lai-mat-khau';
  const isOtpVerification = location.pathname === '/otp-verification';

  const linkStyles = "no-underline font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap"; // Thêm text-xs sm:text-sm và whitespace-nowrap

  const pageTitle = isLogin ? "Đăng nhập" 
                  : isRegister ? "Đăng ký" 
                  : isForgotPassword ? "Quên mật khẩu" 
                  : isResetPassword ? "Đặt lại mật khẩu" 
                  : isOtpVerification ? "Xác thực OTP" 
                  : "";

  return (
    <header
      className="bg-white w-screen shadow-md border-b-2 border-[var(--primary-color)]"
    >
      <div
        
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center min-w-0"> 
          <Link to="/" className="no-underline flex-shrink-0"> 
            <img
              src="src/assets/Client/images/Logo/logo.svg"
              alt="Logo"
              className="h-15 sm:h-[50px] w-auto" 
            />
          </Link>
         
          <span className="mx-2 sm:mx-3 text-neutral-400 hidden xs:inline">|</span> 
          <h2 className="text-lg sm:text-xl text-neutral-700 font-semibold truncate hidden xs:inline"> 
            {pageTitle}
          </h2>
        </div>

        <Link
          to="/lien-he"
          className={linkStyles}
        >
       
          <span className="hidden sm:inline">Liên hệ với chúng tôi</span>
          <span className="sm:hidden">Liên hệ</span> 
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;