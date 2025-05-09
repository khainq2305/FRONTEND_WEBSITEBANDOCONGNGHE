// src/layout/Client/ClientLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';

const ClientLayout = () => {
  const location = useLocation();
  
  // ✅ Kiểm tra nếu là các trang Auth và OTP
  const isAuthPage = [
    '/dang-nhap',
    '/dang-ky',
    '/quen-mat-khau',
    '/dat-lai-mat-khau',
    '/otp-verification', // ✅ Thêm OTP vào đây
    '/forgot-password-notice',
    '/register-email-sent'
  ].includes(location.pathname);

  return (
    <>
      {isAuthPage ? (
        <AuthHeader />
      ) : (
        <>
          <Topbar />
          <Header />
        </>
      )}

      <main style={{ padding: isAuthPage ? '0' : '1rem', minHeight: '80vh' }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default ClientLayout;
