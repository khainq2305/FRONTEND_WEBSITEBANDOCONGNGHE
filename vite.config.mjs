import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 9999;

  return {
 server: {
  host: true,
  port: PORT,
  cors: true,
  allowedHosts: [
    'localhost',
    '127.0.0.1',
    'ad1e-2402-800-6343-1157-602d-5d2b-2fa2-232d.ngrok-free.app' // 👈 thêm domain ngrok của bạn
  ],
  hmr: {
    protocol: 'wss',
    host: 'ad1e-2402-800-6343-1157-602d-5d2b-2fa2-232d.ngrok-free.app',
  },
},

    preview: {
      host: true,
      port: PORT,
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: []
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths(), tailwindcss()]
  };
});