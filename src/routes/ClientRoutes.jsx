import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import ClientLayout from 'layout/Client';

const HomePage = Loadable(lazy(() => import('pages/Client/Home')));
const SignPage = Loadable(lazy(() => import('pages/Client/Auth/SignPage.jsx')));
const VerifyEmailPage = Loadable(lazy(() => import('pages/Client/Auth/VerifyEmailPage')));
const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'xac-thuc-email', element: <VerifyEmailPage /> }
,
    {
      path: 'dang-nhap',
      element: <SignPage />
    },
    {
      path: 'dang-ky',
      element: <SignPage />
    }
    
  ]
};

export default ClientRoutes;
