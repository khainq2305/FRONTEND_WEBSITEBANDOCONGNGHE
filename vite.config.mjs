// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 9999;

  return {
    server: {
      open: true,
      port: PORT,
      host: true,
      allowedHosts: [
        '.ngrok-free.app' // Cho phép tất cả các subdomain của ngrok-free.app
      ],
      proxy: {
        // Proxy robots.txt và sitemap.xml từ backend
        '/robots.txt': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        },
        '/sitemap.xml': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      open: true,
      host: true,
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
