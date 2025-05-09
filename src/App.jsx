import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ThemeCustomization from './themes';
import Toastify from 'components/common/Toastify';
import ScrollTop from './components/Admin/ScrollTop';

import { GoogleOAuthProvider } from '@react-oauth/google';
import './assets/Client/css/global.css'; // ✅ Đảm bảo đường dẫn đúng tới global.css
// Nếu dùng biến môi trường, import như sau:
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // hoặc thay bằng client ID thật nếu chưa dùng .env

export default function App() {
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
