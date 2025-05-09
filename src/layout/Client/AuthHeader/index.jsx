import React from "react";
import { Link, useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/dang-nhap';
  const isRegister = location.pathname === '/dang-ky';
  const isForgotPassword = location.pathname === '/quen-mat-khau';
  const isResetPassword = location.pathname === '/dat-lai-mat-khau';
  const isOtpVerification = location.pathname === '/otp-verification';

  return (
    <header style={{ 
      padding: '12px 24px', 
      textAlign: 'center', 
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
        </Link>
        <h2 style={{ marginLeft: '12px', fontSize: '20px' }}>
          {isLogin ? "Đăng nhập" : isRegister ? "Đăng ký" : isForgotPassword ? "Quên mật khẩu" : isResetPassword ? "Đặt lại mật khẩu" : isOtpVerification ? "Xác thực OTP" : ""}
        </h2>
      </div>

      <Link 
        to={isLogin ? '/dang-ky' : '/dang-nhap'} 
        style={{ 
          textDecoration: 'none', 
          color: '#007bff', 
          fontWeight: 'bold' 
        }}
      >
        {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
      </Link>
    </header>
  );
};

export default AuthHeader;
