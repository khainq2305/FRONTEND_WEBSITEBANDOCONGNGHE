import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));
const BasicTableDemo = Loadable(lazy(() => import('pages/Admin/BasicTableDemo')));
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));
const UserList = Loadable(lazy(() => import('pages/Admin/User/UserList')));
const UserAdd = Loadable(lazy(() => import('pages/Admin/User/UserAdd')));

//Banner
const BannerList = Loadable(lazy(() => import('pages/Admin/BannerList')));
// const BannerDetail = Loadable(lazy(() => import('pages/Admin/BannerDetail')));
const AddBanner = Loadable(lazy(() => import('pages/Admin/BannerList/AddBanner')));
const EditBanner = Loadable(lazy(() => import('pages/Admin/BannerList/EditBanner')));

//Coupon
const CouponList = Loadable(lazy(() => import('pages/Admin/CouponList')));
const CouponDetail = Loadable(lazy(() => import('pages/Admin/CouponList/CouponDetail')));
const AddCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/AddCoupon')));
const EditCoupon = Loadable(lazy(() => import('pages/Admin/CouponList/EditCoupon')));
const Brand = Loadable(lazy(() => import('pages/Admin/Brand')));
const BrandCreatePage = Loadable(lazy(() => import('pages/Admin/Brand/BrandCreatePage')));
const BrandEditPage = Loadable(lazy(() => import('pages/Admin/Brand/BrandEditPage')));

const ProductQuestion = Loadable(lazy(() => import('pages/Admin/ProductQuestion')));

const HisLog = Loadable(lazy(() => import('pages/Admin/HisLog')));
const News = Loadable(lazy(() => import('pages/Admin/News/News')));
const Add = Loadable(lazy(() => import('pages/Admin/News/Add')));
const Edit = Loadable(lazy(() => import('pages/Admin/News/Edit')));
const CategoryNews = Loadable(lazy(() => import('pages/Admin/News/Category')));
const CategoryAdd = Loadable(lazy(() => import('pages/Admin/News/CategoryAdd')));
const ProductAddPage = Loadable(lazy(() => import('pages/Admin/Product/ProductAddPage')));
const ProductAttributes = Loadable(lazy(() => import('pages/Admin/ProductAttributes')));
const TermPage = Loadable(lazy(() => import('pages/Admin/ProductAttributes/terms/TermPage.jsx')));
const CommentList = Loadable(lazy(() => import('pages/Admin/Comment/CommentList/index.jsx')));
const CommentDetail = Loadable(lazy(() => import('pages/Admin/Comment/CommentDetail/index.jsx')));

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
      path: 'users',
      element: <UserList />
    },
    { path: 'users/create', element: <UserAdd /> },
    // {
    //   path: 'banners/:id',
    //   element: <BannerDetail />
    // },
    {
      path: 'banners/add',
      element: <AddBanner />
    },
    {
      path: 'product-attributes',
      element: <ProductAttributes />
    },
    {
      path: 'product-attributes/:id/terms',
      element: <TermPage />
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
      path: 'products/create',
      element: <ProductAddPage />
    },

    {
      path: 'brands',

      element: <Brand />
    },
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
    },

    {
      path: 'banners/edit/:id',
      element: <EditBanner />
    },

    {
      path: 'hislog',
      element: <HisLog />
    },
    { path: 'users/create', element: <UserAdd /> },
    {
      path: 'quan-ly-bai-viet', 
      element: <News />
    },

    {
      path: 'them-bai-viet-moi', 
      element: <Add />
    },
    {
      path: 'bai-viet/chinh-sua/:id', 
      element: <Edit />
    },
    ,
    {
      path: 'danh-muc-bai-viet', 
      element: <CategoryNews />
    },
    ,
    {
      path: 'them-danh-muc-bai-viet', 
      element: <CategoryAdd />
    },
    {
      path: 'comments',
      element: <CommentList />
    },
    {
      path: 'comments/:id',
      element: <CommentDetail />
    },

    {
      path: 'product-question',
      element: <ProductQuestion />
    }
  ]
};

export default AdminRoutes;
