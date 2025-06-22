// src/App.jsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { systemSettingService } from './services/admin/systemSettingService';
import { SystemSettingProvider } from './contexts/SystemSettingContext';

import useAuthStore from '@/stores/AuthStore';

import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeCustomization from './themes';
import Toastify from 'components/common/Toastify';
import ScrollTop from './components/Admin/ScrollTop';
import './assets/Client/css/global.css';
import './index.css';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  
export default function App() {
  /**
   * @hook useAuthStore lưu trạng thái user
   * @method fetchUserInfo gọi ra khi mỗi lần load lại web
   */
  const fetchUserInfo = useAuthStore((s) => s.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const res = await systemSettingService.get();
        if (res.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = res.favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (err) {
        console.error("Lỗi khi lấy favicon:", err);
      }
    };

    fetchSystemSettings();
  }, []);
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SystemSettingProvider>
        <ThemeCustomization>
          <ScrollTop>
            <Toastify />
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </SystemSettingProvider>
    </GoogleOAuthProvider>
  );
}
