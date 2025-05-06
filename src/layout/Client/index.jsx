import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthHeader from './AuthHeader';
import Topbar from './Topbar';

const ClientLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/dang-nhap' || location.pathname === '/dang-ky';

  return (
    <>
      {isAuthPage ? <AuthHeader /> : <>
        <Topbar />
        <Header />
      </>}

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default ClientLayout;
