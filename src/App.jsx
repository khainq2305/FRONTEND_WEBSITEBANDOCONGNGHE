// src/App.js

import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Analytics from './components/common/Analytics';
import router from './routes'; // Đảm bảo đường dẫn này đúng
import ThemeCustomization from './themes'; // Đảm bảo đường dẫn này đúng
import Toastify from 'components/common/Toastify'; // Đảm bảo đường dẫn này đúng
import ScrollTop from './components/Admin/ScrollTop'; // Đảm bảo đường dẫn này đúng

import { GoogleOAuthProvider } from '@react-oauth/google';
// import { UserProvider } from './contexts/UserContext'; // ✅ 1. Import UserProvider

import './assets/Client/css/global.css';
import './index.css';

// Lấy Client ID từ biến môi trường
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleAnalyticsId = import.meta.env.VITE_GA_TRACKING_ID;
const facebookPixelId = import.meta.env.VITE_FB_PIXEL_ID;

export default function App() {
  return (
    <HelmetProvider>
      <Analytics 
        googleAnalyticsId={googleAnalyticsId}
        facebookPixelId={facebookPixelId}
      >
        <GoogleOAuthProvider clientId={clientId}>
          {/* ✅ 2. UserProvider bao bọc các phần cần truy cập dữ liệu người dùng */}
          {/* <UserProvider> */}
            <ThemeCustomization>
              <ScrollTop>
                <Toastify />
                {/* RouterProvider quản lý việc hiển thị các trang dựa trên route */}
                <RouterProvider router={router} />
              </ScrollTop>
            </ThemeCustomization>
          {/* </UserProvider> */}
        </GoogleOAuthProvider>
      </Analytics>
    </HelmetProvider>
  );
}
