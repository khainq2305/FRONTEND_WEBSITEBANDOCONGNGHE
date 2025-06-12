import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import ClientLayout from 'layout/Client';
import {
  ProductRedirect,
  NewsRedirect,
  NewsDetailRedirect,
  CartRedirect,
  CheckoutRedirect,
  OrderConfirmationRedirect,
  UserProfileRedirect,
  OrderLookupRedirect,
  CompareProductsRedirect,
  CategoryRedirect
} from '../components/common/SEORedirects';

// Lazy load components
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
    // Home page
    { 
      index: true, 
      element: <HomePage /> 
    },

    // Authentication pages
    {
      path: 'dang-nhap',
      element: <SignPage />
    },
    {
      path: 'dang-ky',
      element: <SignPage />
    },
    { 
      path: 'quen-mat-khau', 
      element: <ForgotPasswordPage /> 
    },
    {
      path: 'forgot-password-notice',
      element: <ForgotPasswordNotice />
    },
    { 
      path: 'dat-lai-mat-khau', 
      element: <ResetPasswordPage /> 
    },
    {
      path: 'register-email-sent',
      element: <RegisterEmailSentNotice />
    },
    { 
      path: 'verify-email', 
      element: <VerifyEmailPage /> 
    },

    // SEO-Optimized URLs (Main Routes)
    {
      path: 'danh-muc/:slug',
      element: <ProductListByCategory />
    },
    { 
      path: 'san-pham/:slug', 
      element: <ProductDetail /> 
    },
    { 
      path: 'tin-tuc', 
      element: <News /> 
    },
    { 
      path: 'tin-tuc/:slug', 
      element: <NewsDetails /> 
    },
    { 
      path: 'ho-so-ca-nhan', 
      element: <UserProfilePage /> 
    },
    { 
      path: 'gio-hang', 
      element: <CartPage /> 
    },
    { 
      path: 'thanh-toan', 
      element: <CheckoutPage /> 
    },
    { 
      path: 'xac-nhan-don-hang', 
      element: <OrderConfirmation /> 
    },
    { 
      path: 'tra-cuu-don-hang', 
      element: <OrderLookup /> 
    },
    { 
      path: 'so-sanh-san-pham', 
      element: <ProductComparison /> 
    },

    // Redirect routes for backward compatibility
    {
      path: 'category/:id',
      element: <CategoryRedirect />
    },
    {
      path: 'product/:slug',
      element: <ProductRedirect />
    },
    {
      path: 'tin-noi-bat',
      element: <NewsRedirect />
    },
    {
      path: 'tin-noi-bat/:slug',
      element: <NewsDetailRedirect />
    },
    {
      path: 'news',
      element: <NewsRedirect />
    },
    {
      path: 'news/:id',
      element: <NewsDetailRedirect />
    },
    {
      path: 'cart',
      element: <CartRedirect />
    },
    {
      path: 'checkout',
      element: <CheckoutRedirect />
    },
    {
      path: 'order-confirmation',
      element: <OrderConfirmationRedirect />
    },
    {
      path: 'user-profile',
      element: <UserProfileRedirect />
    },
    {
      path: 'orderlookup',
      element: <OrderLookupRedirect />
    },
    {
      path: 'compare-products',
      element: <CompareProductsRedirect />
    }
  ]
};

export default ClientRoutes;
