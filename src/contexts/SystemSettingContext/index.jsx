// import { createContext, useContext, useEffect, useState } from 'react';
// import { systemSettingService } from '@/services/admin/systemSettingService';

// const SystemSettingContext = createContext();

// export const SystemSettingProvider = ({ children }) => {
//   const [settings, setSettings] = useState(null);

//   // const fetchSettings = async () => {
//   //   try {
//   //     const res = await systemSettingService.get();
//   //     setSettings(res);
//   //   } catch (err) {
//   //     console.error('Lỗi khi fetch system settings:', err);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchSettings();
//   // }, []);

//   return (
//     <SystemSettingContext.Provider value={{ settings, fetchSettings }}>
//       {children}
//     </SystemSettingContext.Provider>
//   );
// };

// export const useSystemSetting = () => useContext(SystemSettingContext);
