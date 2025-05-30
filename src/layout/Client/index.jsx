import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';
import BottomNavigationBar from './BottomNavigationBar';
import FloatingContact from '../../pages/Client/FloatingContact'; // Đúng đường dẫn tới file bạn tạo
import { CategoryProvider } from '../../contexts/CategoryContext';
import Toastify from '../../components/common/Toastify';

const ClientLayout = () => {
  const location = useLocation();

  const isAuthPage = [
    '/dang-nhap',
    '/dang-ky',
    '/quen-mat-khau',
    '/dat-lai-mat-khau',
    '/otp-verification',
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
      <FloatingContact />
      <BottomNavigationBar />
      <Toastify />
      <div className="pb-[56px] lg:pb-0"></div>
    </>
  );
};

export default ClientLayout;
