import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import ClientLayout from 'layout/Client';

const HomePage = Loadable(lazy(() => import('pages/Client/Home')));
const SignPage = Loadable(lazy(() => import('pages/Client/Auth/SignPage.jsx')));

const ForgotPasswordPage = Loadable(lazy(() => import('pages/Client/Auth/ForgotPasswordPage')));
const ResetPasswordPage = Loadable(lazy(() => import('pages/Client/Auth/ResetPasswordPage')));


const ForgotPasswordNotice = Loadable(lazy(() => import('pages/Client/Auth/ForgotPasswordNotice')));
const RegisterEmailSentNotice = Loadable(lazy(() => import('pages/Client/Auth/RegisterEmailSentNotice')));
const VerifyEmailPage = Loadable(lazy(() => import('pages/Client/Auth/VerifyEmailPage'))); // ✅ Thêm trang xác thực email
const ClientRoutes = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { index: true, element: <HomePage /> },
   
,
    {
      path: 'dang-nhap',
      element: <SignPage />
    },
    
    {
      path: 'dang-ky',
      element: <SignPage />
    },
    
    { path: 'quen-mat-khau', element: <ForgotPasswordPage /> },
    {
      path: 'forgot-password-notice', 
      element: <ForgotPasswordNotice />
    },
    { path: 'dat-lai-mat-khau', element: <ResetPasswordPage /> },
    
    {
      path: 'register-email-sent', 
      element: <RegisterEmailSentNotice />
    },
    { path: 'verify-email', element: <VerifyEmailPage /> } // ✅ Thêm trang xác thực email
  ]
};

export default ClientRoutes;
