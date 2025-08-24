import { createContext, useContext, useEffect, useState } from 'react';
import { systemSettingService } from '@/services/admin/systemSettingService';

const SystemSettingContext = createContext(undefined);

export const SystemSettingProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await systemSettingService.get();
      setSettings(res);
    } catch (err) {
      console.error('Lỗi tải system settings:', err);
      setSettings(null);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SystemSettingContext.Provider value={{ settings, setSettings, fetchSettings }}>
      {children}
    </SystemSettingContext.Provider>
  );
};

export const useSystemSetting = () => useContext(SystemSettingContext);
