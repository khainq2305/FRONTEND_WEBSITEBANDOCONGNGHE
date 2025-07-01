import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';
import BottomNavigationBar from './BottomNavigationBar';
import FloatingContact from '../../pages/Client/FloatingContact';
import { CategoryProvider } from '../../contexts/CategoryContext';
import Toastify from '../../components/common/Toastify';
import PopupBanner from '../../pages/Client/PopupBanner';
import CompareBar from '@/components/common/CompareBar';

const ClientLayout = () => {
  const location = useLocation();
  const isComparePage = location.pathname.startsWith('/compare-products');

  const isAuthPage = [
    '/dang-nhap',
    '/dang-ky',
    '/quen-mat-khau',
    '/dat-lai-mat-khau',
    '/otp-verification',
    '/forgot-password-notice',
    '/register-email-sent',
  ].includes(location.pathname);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
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
        {!isComparePage && <CompareBar />}
      </main>

      <Footer />

      {/* Ẩn FloatingContact ở các trang auth */}
      {!isAuthPage && <FloatingContact />}

      <BottomNavigationBar />
      <PopupBanner />
      <Toastify />

      {/* chừa khoảng cho BottomNavigationBar trên mobile */}
      <div className="pb-[56px] lg:pb-0" />
    </div>
  );
};

export default ClientLayout;
