// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import ClientRoutes from './ClientRoutes';


const router = createBrowserRouter(
  [ClientRoutes, AdminRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
