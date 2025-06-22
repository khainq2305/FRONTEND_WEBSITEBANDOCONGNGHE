import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import ClientLayout from 'layout/Client';

const HomePage = Loadable(lazy(() => import('pages/Client/Home')));
const SignPage = Loadable(lazy(() => import('pages/Client/Auth/SignPage.jsx')));
const ProductListByCategory = Loadable(lazy(() => import('pages/Client/ProductListByCategory')));
const ForgotPasswordPage = Loadable(lazy(() => import('pages/Client/Auth/ForgotPasswordPage')));
const ResetPasswordPage = Loadable(lazy(() => import('pages/Client/Auth/ResetPasswordPage')));

const ProductDetail = Loadable(lazy(() => import('pages/Client/ProductDetail')));
const ForgotPasswordNotice = Loadable(lazy(() => import('pages/Client/Auth/ForgotPasswordNotice')));
const RegisterEmailSentNotice = Loadable(lazy(() => import('pages/Client/Auth/RegisterEmailSentNotice')));
const VerifyEmailPage = Loadable(lazy(() => import('pages/Client/Auth/VerifyEmailPage')));
const UserProfilePage = Loadable(lazy(() => import('pages/Client/Auth/UserProfilePage.jsx')));
const CartPage = Loadable(lazy(() => import('pages/Client/Cart')));
const CheckoutPage = Loadable(lazy(() => import('pages/Client/Payment')));

const OrderConfirmation = Loadable(lazy(() => import('pages/Client/Payment/OrderConfirmation')));

const News = Loadable(lazy(() => import('pages/Client/Blog')));
const NewsDetails = Loadable(lazy(() => import('pages/Client/BlogDetail')));

const OrderLookup = Loadable(lazy(() => import('pages/Client/OrderLookup')));
const ProductComparison = Loadable(lazy(() => import('pages/Client/CompareProducts')));
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
    { path: 'verify-email', element: <VerifyEmailPage /> },
    { path: 'user-profile', element: <UserProfilePage /> },
  { path: 'category/:slug', element: <ProductListByCategory /> },

    { path: 'product/:slug', element: <ProductDetail /> },
    { path: 'tin-noi-bat', element: <News /> },
    { path: 'tin-noi-bat/:slug', element: <NewsDetails /> },
    { path: 'cart', element: <CartPage /> },
    { path: 'checkout', element: <CheckoutPage /> },
    { path: 'order-confirmation', element: <OrderConfirmation /> },

    { path: 'news', element: <News /> },
    { path: 'news/:id', element: <NewsDetails /> },
    { path: 'orderlookup', element: <OrderLookup /> },
    { path: 'compare-products', element: <ProductComparison /> }
  ]
};

export default ClientRoutes;
