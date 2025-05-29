// src/layout/Client/ClientLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';
import BottomNavigationBar from './BottomNavigationBar';
import { CategoryProvider } from '../../contexts/CategoryContext'; // ✅ Import context

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

  const Layout = (
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

      <div className="pb-[56px] lg:pb-0"></div>
    </>
  );

  return isAuthPage ? Layout : <CategoryProvider>{Layout}</CategoryProvider>;
};

export default ClientLayout;
