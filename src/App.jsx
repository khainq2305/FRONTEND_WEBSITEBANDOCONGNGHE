// src/App.jsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

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

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SystemSettingProvider> {/* ✅ bọc bên ngoài các component dùng context */}
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
