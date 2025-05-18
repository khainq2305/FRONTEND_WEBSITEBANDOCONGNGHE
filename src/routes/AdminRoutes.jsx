// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY
const News = Loadable(lazy(() => import('pages/Admin/News/News'))); // <- THÊM DÒNG NÀY
const Trash = Loadable(lazy(() => import('pages/Admin/News/Trash'))); // <- THÊM DÒNG NÀY
const Add = Loadable(lazy(() => import('pages/Admin/News/Add'))); // <- THÊM DÒNG NÀY
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
      path: 'news', // <- THÊM ROUTE MỚI
      element: <News /> 
    },
    {
      path: 'trash', // <- THÊM ROUTE MỚI
      element: <Trash /> 
    },
    {
      path: 'add', // <- THÊM ROUTE MỚI
      element: <Add /> 
    },
  ]
};

export default AdminRoutes;
