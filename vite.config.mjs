import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = 9999;

  return {
    server: {
      host: true,
      port: PORT,
      cors: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'ad1e-2402-800-6343-1157-602d-5d2b-2fa2-232d.ngrok-free.app'
      ],
      hmr: {
        protocol: 'wss',
        host: 'ad1e-2402-800-6343-1157-602d-5d2b-2fa2-232d.ngrok-free.app',
      },
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
      host: true,
      port: PORT,
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
        { find: 'react', replacement: path.resolve('./node_modules/react') },
        { find: 'react-dom', replacement: path.resolve('./node_modules/react-dom') }
      ]
    },
    base: env.VITE_APP_BASE_NAME || '/',
    plugins: [react(), jsconfigPaths(), tailwindcss()]
  };
});

