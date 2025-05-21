// src/routes/AdminRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));

const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo'))); // <- THÊM DÒNG NÀY
const News = Loadable(lazy(() => import('pages/Admin/News/News'))); // <- THÊM DÒNG NÀY
const Add = Loadable(lazy(() => import('pages/Admin/News/Add'))); // <- THÊM DÒNG NÀY
const Edit = Loadable(lazy(() => import('pages/Admin/News/Edit')))
const CategoryNews = Loadable(lazy(() => import('pages/Admin/News/Category')))
const CategoryAdd = Loadable(lazy(() => import('pages/Admin/News/CategoryAdd')))
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
      path: 'quan-ly-bai-viet', // <- THÊM ROUTE MỚI
      element: <News /> 
    },
    
    {
      path: 'them-bai-viet-moi', // <- THÊM ROUTE MỚI
      element: <Add /> 
    },
    {
      path: 'chinh-sua-bai-viet/:id', // <- THÊM ROUTE MỚI
      element: <Edit /> 
    },
    ,
    {
      path: 'danh-muc-bai-viet', // <- THÊM ROUTE MỚI
      element: <CategoryNews /> 
    },
    ,
    {
      path: 'them-danh-muc-bai-viet', // <- THÊM ROUTE MỚI
      element: <CategoryAdd /> 
    },

  ]
};

export default AdminRoutes;
