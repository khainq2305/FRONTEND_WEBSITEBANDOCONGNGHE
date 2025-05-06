// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/dashboard/default/default')));
const Color = Loadable(lazy(() => import('pages/Admin/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/Admin/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/Admin/component-overview/shadows')));

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
      path: 'color',
      element: <Color />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'basic-table', // <- THÊM ROUTE MỚI
      element: <BasicTableDemo />
    }
  ]
};

export default AdminRoutes;
