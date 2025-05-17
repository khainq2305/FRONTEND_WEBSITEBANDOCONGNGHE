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
    { path: 'users/create', element: <UserAdd /> }
  ]
};

export default AdminRoutes;
