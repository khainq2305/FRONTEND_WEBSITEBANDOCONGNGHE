import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import ClientRoutes from './ClientRoutes';
import Page403 from '@/components/Admin/Page403';
import LoginAdmin from '@/pages/Admin/Auth';
import NotFound from '@/pages/Admin/NotFound';
import ServerError from '@/pages/Admin/ServerError';

const SystemRoutes = [
  {
    path: '/dang-nhap-dashboard',
    element: <LoginAdmin />
  },
  {
    path: '/403',
    element: <Page403 />
  },
   {
    path: '/500',
    element: <ServerError />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

const router = createBrowserRouter(
  [ClientRoutes, AdminRoutes, ...SystemRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
