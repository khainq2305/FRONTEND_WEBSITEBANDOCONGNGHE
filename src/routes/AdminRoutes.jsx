// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY

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
    }
  ]
};

export default AdminRoutes;
