// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));
const UserList = Loadable(lazy(() => import('pages/Admin/User/UserList')));
const UserAdd = Loadable(lazy(() => import('pages/Admin/User/UserAdd')));

//Banner
const BannerList = Loadable(lazy(() => import('pages/Admin/BannerList')));
const BannerDetail = Loadable(lazy(() => import('pages/Admin/BannerDetail')));
const AddBanner = Loadable(lazy(() => import('pages/Admin/BannerList/AddBanner')));
const EditBanner = Loadable(lazy(() => import('pages/Admin/BannerList/EditBanner')));


//Coupon
const CouponList = Loadable(lazy(() => import('pages/Admin/CouponList')));
const CouponDetail = Loadable(lazy(() => import('pages/Admin/CouponList/CouponDetail')));
const AddCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/AddCoupon')));
const EditCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/EditCoupon')));
const Brand = Loadable(lazy(() => import('pages/Admin/Brand')));


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
      path: 'users',
      element: <UserList />
    },
    { path: 'users/create', element: <UserAdd /> },
    {
      path: 'banners/:id',
      element: <BannerDetail />
    },
    {
      path: 'banners/add',
      element: <AddBanner />
    },
    {
      path: 'banners/edit/:id',
      element: <EditBanner />
    },
    {
      path: 'coupons',
      element: <CouponList />
    },
    {
      path: 'coupons/:id',
      element: <CouponDetail />
    },
    {
      path: 'coupons/add',
      element: <AddCoupon />
    },
    {
      path: 'coupons/edit/:id',
      element: <EditCoupon />
    },
    {
      path: 'brands',
      element: <Brand />
    },
  ]
};

export default AdminRoutes;
