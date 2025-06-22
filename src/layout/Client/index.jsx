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
import PopupBanner from '../../pages/Client/PopupBanner';
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
  <div className="bg-gray-100 min-h-screen text-gray-900"> {/* ← thêm bg ở đây */}
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
      {!isComparePage && <CompareBar /> }
    </main>

    <Footer />
    <FloatingContact />
    <BottomNavigationBar />
    <PopupBanner />
    <Toastify />
    <div className="pb-[56px] lg:pb-0"></div>
  </div>
);

};

export default ClientLayout;
