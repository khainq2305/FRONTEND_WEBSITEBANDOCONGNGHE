// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));

//Coupon
const CouponList = Loadable(lazy(() => import('pages/Admin/CouponList')));
const CouponDetail = Loadable(lazy(() => import('pages/Admin/CouponList/CouponDetail')));
const AddCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/AddCoupon')));
const EditCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/EditCoupon')));

// //Media
const MediaList = Loadable(lazy(() => import('pages/Admin/Media')));
const MediaTypeList = Loadable(lazy(() => import('pages/Admin/Media/MediaTypeList')));

const MediaDetail = Loadable(lazy(() => import('pages/Admin/Media/MediaDetail')));
const AddMedia = Loadable(lazy(() => import('pages/Admin/Media/AddMedia')));
const EditMedia = Loadable(lazy(() => import('pages/Admin/Media/EditMedia')));

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
      path: 'medias',
      element: <MediaList />
    },
    {
      path: 'medias/type/:type',
      element: <MediaTypeList />
    },
    {
      path: 'medias/:id',
      element: <MediaDetail />
    },
    {
      path: 'medias/add',
      element: <AddMedia />
    },
        {
      path: 'medias/edit/:id',
      element: <EditMedia />
    }
  ]
};

export default AdminRoutes;
