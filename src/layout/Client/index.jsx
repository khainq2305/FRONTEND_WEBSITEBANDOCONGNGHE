// src/layout/Client/ClientLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';
import BottomNavigationBar from "./BottomNavigationBar"; // IMPORT COMPONENT MỚI
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

      <main>
        <Outlet />
      </main>

      <Footer />
        <BottomNavigationBar />

      {/* Thêm một khoảng trống ở cuối trang để nội dung không bị thanh nav che mất */}
      {/* Chiều cao của khoảng trống này nên bằng hoặc lớn hơn chiều cao của BottomNavigationBar (56px) */}
      <div className="pb-[56px] lg:pb-0"></div>
    </>
  );
};

export default ClientLayout;
