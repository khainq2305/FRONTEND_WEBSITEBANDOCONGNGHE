import { lazy } from 'react';
import Loadable from 'components/Admin/Loadable';
import DashboardLayout from 'layout/Admin';

// Pages
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
const CategoryNews = Loadable(lazy(() => import('pages/Admin/News/Category')));
const CategoryAdd = Loadable(lazy(() => import('pages/Admin/News/CategoryAdd')));
const ProductAddPage = Loadable(lazy(() => import('pages/Admin/Product/ProductAddPage')));
const VariantValueList = Loadable(lazy(() => import('pages/Admin/VariantValue/index.jsx')));

const ReviewList = Loadable(lazy(() => import("pages/Admin/Review/ReviewList/index.jsx")));
const ReviewDetail = Loadable(lazy(() => import("pages/Admin/Review/ReviewDetail/index.jsx")));
const ReviewAll = Loadable(lazy(() => import("pages/Admin/Review/ReviewAll/index.jsx")));

const VariantList = Loadable(lazy(() => import('pages/Admin/ProductVariants')));
const VariantForm = Loadable(lazy(() => import('pages/Admin/ProductVariants/VariantForm')));
const ProductListPage = Loadable(lazy(() => import('pages/Admin/Product')));
const VariantValueForm = Loadable(lazy(() => import('pages/Admin/VariantValue/VariantValueForm')));
const CouponForm = Loadable(lazy(() => import('pages/Admin/Coupon/CouponForm')));

const HighlightedCategoryItemList = Loadable(lazy(() => import('pages/Admin/HighlightedCategoryItem')));
const HighlightedCategoryItemForm = Loadable(lazy(() => import('pages/Admin/HighlightedCategoryItem/HighlightedCategoryItemForm')));
const HomeSectionList = Loadable(lazy(() => import('pages/Admin/HomeSection')));
const HomeSectionFormPage = Loadable(lazy(() => import('pages/Admin/HomeSection/HomeSectionForm')));
const FlashSaleList = Loadable(lazy(() => import('pages/Admin/FlashSale')));
const FlashSaleForm = Loadable(lazy(() => import('pages/Admin/FlashSale/FlashSaleForm')));
//
// Banner 3 bảng mới
const BannerList = Loadable(lazy(() => import('pages/Admin/Banner')));
const BannerForm = Loadable(lazy(() => import('pages/Admin/Banner/BannerForm')));
const PlacementList = Loadable(lazy(() => import('pages/Admin/Banner/PlacementList')));
const PlacementForm = Loadable(lazy(() => import('pages/Admin/Banner/PlacementForm')));
const PlacementBannerList = Loadable(lazy(() => import('pages/Admin/Banner/PlacementBannerList')));
const AssignBannerToPlacementForm = Loadable(lazy(() => import('pages/Admin/Banner/AssignBannerToPlacementForm')));
const CategoryList = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryList/CategoryList')));
const CategoryAddd = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryAdd/CategoryAdd')));
const CategoryEdit = Loadable(lazy(() => import('pages/Admin/CaterogyProduct/CategoryEdit/CategoryEdit')));
const NotificationPage = Loadable(lazy(() => import('pages/Admin/Notification')));
const NotificationDetail = Loadable(lazy(() => import('pages/Admin/Notification/NotificationDetail')));
const DeletedUserList = Loadable(lazy(() => import('pages/Admin/User/DeletedUserList')));
const UserDetailPage = Loadable(lazy(() => import('pages/Admin/User/UserDetailDialog')));
const HomeSectionDetailPage = Loadable(lazy(() => import('pages/Admin/HomeSection/HomeSectionDetail')));

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

    // CRUD Banner
    {
      path: 'banners',
      children: [
        { index: true, element: <BannerList /> },
        { path: 'create', element: <BannerForm /> },
        { path: 'edit/:id', element: <BannerForm /> }
      ]
    },

   
    {
      path: 'placements',
      children: [
        { index: true, element: <PlacementList /> },
        { path: 'create', element: <PlacementForm /> },
        { path: 'edit/:id', element: <PlacementForm /> }
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
    
    {
      path: 'placement-banners',
      children: [
        {
          index: true,
          element: <AssignBannerToPlacementForm />
        },
        {
          path: ':placementId/banners',
          element: <PlacementBannerList />
        }
      ]
    },
    {
      path: 'notifications',
      element: <NotificationPage />
    },
    {
      path: 'notifications/:id',
      element: <NotificationDetail />
    },
    {
      path: 'flash-sale',
      children: [
        { index: true, element: <FlashSaleList /> },
        { path: 'create', element: <FlashSaleForm /> },
        { path: 'edit/:id', element: <FlashSaleForm /> }
      ]
    },

    {
      path: 'home-sections',
      children: [
        { index: true, element: <HomeSectionList /> },
        { path: 'create', element: <HomeSectionFormPage /> },
         { path: 'detail/:id', element: <HomeSectionDetailPage /> }, // ✅ Thêm dòng này
         { path: 'edit/:id',   element: <HomeSectionFormPage /> },
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
    {
      path: 'highlighted-category-items',
      children: [
        { index: true, element: <HighlightedCategoryItemList /> },
        { path: 'create', element: <HighlightedCategoryItemForm /> },
        { path: 'edit/:id', element: <HighlightedCategoryItemForm /> }
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
    {
      path: 'users/deleted',
      element: <DeletedUserList />
    },
    { path: 'users/create', element: <UserAdd /> },
  

    { path: 'coupons', element: <CouponList /> },
    {
      path: 'coupons/create',
      element: <CouponForm /> 
    },
    {
      path: 'coupons/edit/:id',
      element: <CouponForm /> 
    },
    {
      path: 'products',
      element: <ProductListPage />
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
  path: 'products/edit/:id',
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
      path: "reviews",
      element: <ReviewList />,
    },
    {
      path: "reviews/all",
      element: <ReviewAll />,
    },

    {
      path: "reviews/:skuId",
      element: <ReviewDetail />,
    },

    {
      path: 'product-question',
      element: <ProductQuestion />
    }
  ]
};

export default AdminRoutes;
