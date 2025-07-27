// src/App.jsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { SystemSettingProvider, useSystemSetting } from "@/contexts/SystemSettingContext";
import { systemSettingService } from "@/services/admin/systemSettingService";
import useAuthStore from "@/stores/AuthStore";

import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeCustomization from "./themes"; 
import Toastify from "components/common/Toastify";
import ScrollTop from "./components/Admin/ScrollTop";

import "./assets/Client/css/global.css";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function DynamicTitleUpdater() {
  const { settings } = useSystemSetting();

  useEffect(() => {
    if (settings?.site_name) {
      document.title = settings.site_name;
    }
  }, [settings]);

  return null;
}

function AppContent() {
  const fetchUserInfo = useAuthStore((s) => s.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const res = await systemSettingService.get();
        if (res && res.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = res.favicon;
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      } catch (err) {
        console.error("Lỗi khi lấy favicon:", err);
      }
    };

    fetchSystemSettings();
  }, []);

  return (
    <> 
      <ScrollTop />
      <Toastify />
      <DynamicTitleUpdater />
     
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SystemSettingProvider>
        {/* Đặt ThemeCustomization ở đây, bao bọc AppContent hoặc trực tiếp RouterProvider */}
        <ThemeCustomization> {/* <-- Đặt ThemeCustomization ở cấp cao hơn */}
          <AppContent />
        </ThemeCustomization>
      </SystemSettingProvider>
    </GoogleOAuthProvider>
  );
}