// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));
const BannerList = Loadable(lazy(() => import('pages/Admin/BannerList')));
const BannerDetail = Loadable(lazy(() => import('pages/Admin/BannerDetail')));
const CouponList = Loadable(lazy(() => import('pages/Admin/CouponList')));



const AdminRoutes = {
  path: '/admin',
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <DashboardDefault />
    },
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: 'basic-table', // <- THÊM ROUTE MỚI
      element: <BasicTableDemo />
    },
    {
      path: 'orders',
      element: <OrderList />
    },
    {
      path: 'orders/:id',
      element: <OrderDetail />
    },
    {
      path: 'banners',
      element: <BannerList />
    },
    {
      path: 'banners/:id',
      element: <BannerDetail />
    },
        {
      path: 'coupons',
      element: <CouponList />
    },
  ]
};

export default AdminRoutes;
