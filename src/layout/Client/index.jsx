import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';
import BottomNavigationBar from './BottomNavigationBar';
import FloatingContact from '../../pages/Client/FloatingContact';
import Toastify from '../../components/common/Toastify';
import PopupBanner from '../../pages/Client/PopupBanner';
import CompareBar from './CompareBar';
import { injectNavigate } from '@/services/common/api';

const ClientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    injectNavigate(navigate);
  }, [navigate]);

  const isAuthPage = [
    '/dang-nhap',
    '/dang-ky', 
    '/quen-mat-khau',
    '/dat-lai-mat-khau',
    '/otp-verification',
    '/forgot-password-notice',
    '/register-email-sent',
    '/xac-minh-ma-pin',
    '/cart',
    '/checkout'
  ].includes(location.pathname);

  const isComparePage = location.pathname.startsWith('/compare-products');

  const isCategoryOrProductDetail =
    (location.pathname.startsWith('/category/') && location.pathname.split('/').length > 2) ||
    (location.pathname.startsWith('/product/') && location.pathname.split('/').length > 2);

  const isMiniGamePage = location.pathname === '/mini-game';

  if (isMiniGamePage) {
    return (
      <main>
        <Outlet />
      </main>
    );
  }

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
        {!isComparePage && isCategoryOrProductDetail && <CompareBar />}
      </main>

      <Footer />

      {!isAuthPage && <FloatingContact />}

      <BottomNavigationBar />
      <PopupBanner />
      <Toastify />
      <div className="pb-[56px] lg:pb-0" />
    </div>
  );
};

export default ClientLayout;
