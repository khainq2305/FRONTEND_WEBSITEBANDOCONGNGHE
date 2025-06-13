// src/App.jsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

import useAuthStore from '@/stores/AuthStore';

import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeCustomization from './themes';
import Toastify from 'components/common/Toastify';
import ScrollTop from './components/Admin/ScrollTop';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import './assets/Client/css/global.css';
import './index.css';


export default function App() {
  const fetchUserInfo = useAuthStore((s) => s.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo(); // gọi khi app mount
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeCustomization>
        <ScrollTop>
          <Toastify />
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </GoogleOAuthProvider>
  );
}
