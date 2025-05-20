import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));
const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo')));
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));
const Brand = Loadable(lazy(() => import('pages/Admin/Brand')));
const BrandCreatePage = Loadable(lazy(() => import('pages/Admin/Brand/BrandCreatePage')));
const BrandEditPage = Loadable(lazy(() => import('pages/Admin/Brand/BrandEditPage')));

const ProductQuestion = Loadable(lazy(() => import('pages/Admin/ProductQuestion')));

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
      path: 'basic-table',
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
      path: 'brands',
      children: [
        {
          index: true,
          element: <Brand />
        },
        {
          path: 'create',
          element: <BrandCreatePage />
        },
        {
          path: 'edit/:id',
          element: <BrandEditPage />
        }
      ]
    },



    {
      path: 'product-question',
      element: <ProductQuestion />
    }
  ]
};

export default AdminRoutes;
