import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Load pages như cũ
const DashboardDefault = Loadable(lazy(() => import('pages/Admin/Dashboard')));
const OrderList = Loadable(lazy(() => import('pages/Admin/OrderList')));
const OrderDetail = Loadable(lazy(() => import('pages/Admin/OrderDetail')));
const UserList = Loadable(lazy(() => import('pages/Admin/User/UserList')));
const UserAdd = Loadable(lazy(() => import('pages/Admin/User/UserAdd')));
const CouponList = Loadable(lazy(() => import('pages/Admin/Coupon')));
const Brand = Loadable(lazy(() => import('pages/Admin/Brand')));
const BrandCreatePage = Loadable(lazy(() => import('pages/Admin/Brand/BrandCreatePage')));
const BrandEditPage = Loadable(lazy(() => import('pages/Admin/Brand/BrandEditPage')));
const ProductQuestion = Loadable(lazy(() => import('pages/Admin/ProductQuestion')));
const ProductEditPage = Loadable(lazy(() => import('pages/Admin/Product/ProductEditPage')));
const HisLog = Loadable(lazy(() => import('pages/Admin/HisLog')));
const News = Loadable(lazy(() => import('pages/Admin/News/News')));
const Add = Loadable(lazy(() => import('pages/Admin/News/Add')));
const Edit = Loadable(lazy(() => import('pages/Admin/News/Edit')));
const NewsDetails = Loadable(lazy(() => import('pages/Admin/News/NewsDetails')));
const CategoryNews = Loadable(lazy(() => import('pages/Admin/News/Category')));
const CategoryAdd = Loadable(lazy(() => import('pages/Admin/News/CategoryAdd')));
const NewsCategoryEdit = Loadable(lazy(() => import('pages/Admin/News/CategoryEdit')));
const ProductAddPage = Loadable(lazy(() => import('pages/Admin/Product/ProductAddPage')));
const VariantValueList = Loadable(lazy(() => import('pages/Admin/VariantValue/index.jsx')));
const VariantValueForm = Loadable(lazy(() => import('pages/Admin/VariantValue/VariantValueForm')));
const PaymentMethodList = Loadable(lazy(() => import('pages/Admin/PaymentMethodList')));
const ShippingProviderList = Loadable(lazy(() => import('pages/Admin/ShippingProviderList')));
const OrderReturnRefund = Loadable(lazy(() => import('pages/Admin/Returns')));

const AdminReviewsPage = Loadable(lazy(() => import('pages/Admin/Comment/AdminReviewsPage')));

const ProductListPage = Loadable(lazy(() => import('pages/Admin/Product')));
const VariantList = Loadable(lazy(() => import('pages/Admin/ProductVariants')));
const VariantForm = Loadable(lazy(() => import('pages/Admin/ProductVariants/VariantForm')));
const CouponForm = Loadable(lazy(() => import('pages/Admin/Coupon/CouponForm')));
const HighlightedCategoryItemList = Loadable(lazy(() => import('pages/Admin/HighlightedCategoryItem')));
const HighlightedCategoryItemForm = Loadable(lazy(() => import('pages/Admin/HighlightedCategoryItem/HighlightedCategoryItemForm')));
const HomeSectionList = Loadable(lazy(() => import('pages/Admin/HomeSection')));
const HomeSectionFormPage = Loadable(lazy(() => import('pages/Admin/HomeSection/HomeSectionForm')));
const FlashSaleList = Loadable(lazy(() => import('pages/Admin/FlashSale')));
const FlashSaleForm = Loadable(lazy(() => import('pages/Admin/FlashSale/FlashSaleForm')));
const BannerList = Loadable(lazy(() => import('pages/Admin/Banner')));
const BannerForm = Loadable(lazy(() => import('pages/Admin/Banner/BannerForm')));
const NotificationPage = Loadable(lazy(() => import('pages/Admin/Notification')));
const CategoryList = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryList/CategoryList')));
const CategoryAddd = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryAdd/CategoryAdd')));
const CategoryEdit = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryEdit/CategoryEdit')));
const UserDetailPage = Loadable(lazy(() => import('pages/Admin/User/UserDetailDialog')));
const NotificationCreatePage = Loadable(lazy(() => import('pages/Admin/Notification/NotificationCreatePage')));
const NotificationEditPage = Loadable(lazy(() => import('pages/Admin/Notification/NotificationEditPage')));
const QuestionDetailPage = Loadable(lazy(() => import('pages/Admin/ProductQuestion/QuestionDetailPage/index.jsx')));
const SystemSettings = Loadable(lazy(() => import('pages/Admin/SystemSettings/index')));
const SpinRewardAdminPage = Loadable(lazy(() => import('pages/Admin/MiniGame/SpinRewards')));
const SpinRewardFormPage = Loadable(lazy(() => import('pages/Admin/MiniGame/SpinRewards/SpinRewardFormPage')));
const SpinHistoryAdminPage = Loadable(lazy(() => import('pages/Admin/MiniGame/SpinHistory')));

import RequireAuth from '@/components/Admin/RequireAuth';
const ReturnRefundDetail = Loadable(lazy(() => import('pages/Admin/Returns/ReturnRefundDetail'))); // <-- Thêm dòng này

const RoleIndex = Loadable(lazy(() => import('pages/Admin/Role/index')));
const RoleManagement = Loadable(lazy(() => import('pages/Admin/Role/RoleManagement')));
import { UserProvider } from '@/contexts/UserContext';
const Skulist = Loadable(lazy(() => import('pages/Admin/Skus')));
const NotFound = Loadable(lazy(() => import('pages/Admin/NotFound')));
const AdminRoutes = {
  path: '/admin',
  element: (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
  children: [
    { index: true, element: <DashboardDefault /> },
    { path: 'dashboard/default', element: <DashboardDefault /> },
    { path: 'payment-methods', element: <PaymentMethodList /> },
    { path: 'shipping-providers', element: <ShippingProviderList /> },
    { path: 'users', element: <UserList /> },
    { path: 'users/create', element: <UserAdd /> },
    { path: 'users/:id', element: <UserDetailPage /> },
    { path: 'orders', element: <OrderList /> },
    { path: 'orders/:id', element: <OrderDetail /> },
    { path: 'products', element: <ProductListPage /> },
    { path: 'products/create', element: <ProductAddPage /> },
    { path: 'products/edit/:slug', element: <ProductEditPage /> },
    { path: 'product-question', element: <ProductQuestion /> },
    {
      path: 'product-variants',
      children: [
        { index: true, element: <VariantList /> },
        { path: 'create', element: <VariantForm /> },
        { path: 'edit/:variantId', element: <VariantForm /> }
      ]
    },
    {
      path: 'product-variants/:variantId/values',
      children: [
        { index: true, element: <VariantValueList /> },
        { path: 'create', element: <VariantValueForm /> },
        { path: 'edit/:valueId', element: <VariantValueForm /> }
      ]
    },
    {
      path: 'brands',
      children: [
        { index: true, element: <Brand /> },
        { path: 'create', element: <BrandCreatePage /> },
        { path: 'edit/:id', element: <BrandEditPage /> }
      ]
    },
    {
      path: 'banners',
      children: [
        { index: true, element: <BannerList /> },
        { path: 'create', element: <BannerForm /> },

        { path: 'edit/:slug', element: <BannerForm /> }
      ]
    },
    {
      path: 'categories/list',
      element: <CategoryList />
    },
    {
      path: 'categories/addd',
      element: <CategoryAddd />
    },
    {
      path: 'categories/edit/:id',
      element: <CategoryEdit />
    },
    { path: 'return-requests/:id', element: <ReturnRefundDetail /> }, // <-- Thêm route này
    {
      path: 'notifications',
      children: [
        { index: true, element: <NotificationPage /> },
        { path: 'create', element: <NotificationCreatePage /> },
        { path: 'edit/:slug', element: <NotificationEditPage /> } //
      ]
    },
    {
      path: 'flash-sale',
      children: [
        { index: true, element: <FlashSaleList /> },
        { path: 'create', element: <FlashSaleForm /> },
        { path: 'edit/:slug', element: <FlashSaleForm /> }
      ]
    },
    {
      path: 'home-sections',
      children: [
        { index: true, element: <HomeSectionList /> },
        { path: 'create', element: <HomeSectionFormPage /> },
        { path: 'edit/:slug', element: <HomeSectionFormPage /> }
      ]
    },

    {
      path: 'orders',
      element: <OrderList />
    },
    {
      path: 'orders/:id',
      element: <OrderDetail />
    },
    { path: '/admin/return-requests', element: <OrderReturnRefund /> },

    {
      path: 'highlighted-category-items',
      children: [
        { index: true, element: <HighlightedCategoryItemList /> },
        { path: 'create', element: <HighlightedCategoryItemForm /> },
        { path: 'edit/:slug', element: <HighlightedCategoryItemForm /> }
      ]
    },

    {
      path: 'users',
      element: <UserList />
    },
    {
      path: '/admin/users/:id',
      element: <UserDetailPage />
    },
    { path: 'users/create', element: <UserAdd /> },

    { path: 'coupons', element: <CouponList /> },
    { path: 'coupons/create', element: <CouponForm /> },
    { path: 'coupons/edit/:id', element: <CouponForm /> },
    { path: 'categories/list', element: <CategoryList /> },
    { path: 'categories/addd', element: <CategoryAddd /> },
    { path: 'categories/edit/:id', element: <CategoryEdit /> },
    { path: 'notifications', element: <NotificationPage /> },
    {
      path: 'flash-sale',
      children: [
        { index: true, element: <FlashSaleList /> },
        { path: 'create', element: <FlashSaleForm /> },
        { path: 'edit/:id', element: <FlashSaleForm /> }
      ]
    },

    {
      path: 'product-variants',
      children: [
        { index: true, element: <VariantList /> },
        { path: 'create', element: <VariantForm /> },
        { path: 'edit/:variantId', element: <VariantForm /> }
      ]
    },

    {
      path: 'products/create',
      element: <ProductAddPage />
    },
    {
      path: 'products/edit/:slug',
      element: <ProductEditPage />
    },

    {
      path: 'brands',
      children: [
        { index: true, element: <Brand /> },
        { path: 'create', element: <BrandCreatePage /> },
        { path: 'edit/:id', element: <BrandEditPage /> }
      ]
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
      path: 'quan-ly-bai-viet/chinh-sua-bai-viet/:slug',
      element: <Edit />
    },
    {
      path: 'quan-ly-bai-viet/chi-tiet-bai-viet/:slug',
      element: <NewsDetails />
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
      path: 'danh-muc-bai-viet/chinh-sua-danh-muc/:slug',
      element: <NewsCategoryEdit />
    },
    { path: 'quan-ly-vai-tro/ma-tran-phan-quyen', element: <RoleIndex /> },
    { path: 'quan-ly-vai-tro/danh-sach-vai-tro', element: <RoleManagement /> },
    {
      path: 'comments/all',
      element: <AdminReviewsPage />
    },

    {
      path: 'product-question',
      children: [
        { index: true, element: <ProductQuestion /> },
        { path: ':id', element: <QuestionDetailPage /> }
      ]
    },
    {
      path: 'system-settings',
      element: <SystemSettings />
    },
    {
      path: 'skulist',
      element: <Skulist />
    },
    {
      path: 'spin-rewards',
      children: [
        { index: true, element: <SpinRewardAdminPage /> },
        { path: 'create', element: <SpinRewardFormPage /> },
        { path: 'edit/:id', element: <SpinRewardFormPage /> }
      ]
    },
    {
      path: 'spin-history',
      element: <SpinHistoryAdminPage />
    },
    
  ]
};

export default AdminRoutes;
