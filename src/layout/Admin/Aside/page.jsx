// assets
import {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined,
  MessageOutlined,
  AppstoreOutlined,
  CommentOutlined,
  GiftOutlined
} from '@ant-design/icons';


// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  MessageOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TagsOutlined,
  CommentOutlined,
  GiftOutlined
};
// import { MENU_PERMISSION_ALLOW } from '@/constants/MENU_PERMISSION_ALLOW';
// import { subject } from '@casl/ability';
// // phần trên giữ nguyên (icons, MENU_PERMISSION_ALLOW...)

const pages = [
  {
    id: 'product-section-collapse',
    title: 'Quản lý sản phẩm',
    type: 'collapse',
    icon: icons.AppstoreOutlined,
    subject: 'Product',
    children: [
      {
        id: 'product-list',
        title: 'Sản phẩm',
        type: 'item',
        url: '/admin/products',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'featured-products',
        title: 'Sản phẩm nổi bật',
        type: 'item',
        url: '/admin/home-sections',
        icon: icons.GiftOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'highlighted-category',
        title: 'Danh mục nổi bật',
        type: 'item',
        url: '/admin/highlighted-category-items',
        icon: icons.ProfileOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'product-category',
        title: 'Danh mục sản phẩm',
        type: 'item',
        url: '/admin/categories/list',
        icon: icons.TagsOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductCategory'
      },
      {
        id: 'product-attribute',
        title: 'Thuộc tính sản phẩm',
        type: 'item',
        url: '/admin/product-variants',
        icon: icons.CommentOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductAttribute'
      },
      {
        id: 'brand-list',
        title: 'Thương hiệu',
        type: 'item',
        url: '/admin/brands',
        icon: icons.MessageOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Brand'
      }
    ]
  },

  {
    id: 'flash-sale',
    title: 'Flash Sale',
    type: 'collapse',
    icon: icons.GiftOutlined,
    subject: 'FlashSale',
    children: [
      {
        id: 'flash-sale-list',
        title: 'Danh sách Flash Sale',
        type: 'item',
        url: '/admin/flash-sale',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'FlashSale'
      },
      {
        id: 'flash-sale-create',
        title: 'Tạo Flash Sale',
        type: 'item',
        url: '/admin/flash-sale/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'FlashSale'
      }
    ]
  },

  {
    id: 'slider-section',
    title: 'Slider & Banner',
    type: 'collapse',
    icon: icons.FileTextOutlined,
    subject: 'Banner',
    children: [
      {
        id: 'banner-list',
        title: 'Danh sách Banner',
        type: 'item',
        url: '/admin/banners',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Banner'
      }
    ]
  },

  {
    id: 'coupon-section',
    title: 'Mã giảm giá',
    type: 'collapse',
    icon: icons.GiftOutlined,
    subject: 'Coupon',
    children: [
      {
        id: 'coupon-list',
        title: 'Danh sách mã giảm',
        type: 'item',
        url: '/admin/coupons',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Coupon'
      },
      {
        id: 'coupon-add',
        title: 'Thêm mã giảm giá',
        type: 'item',
        url: '/admin/coupons/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Coupon'
      }
    ]
  },

  {
    id: 'orderlist',
    title: 'Đơn hàng',
    type: 'item',
    url: '/admin/orders',
    icon: icons.FileTextOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'Order'
  },

  {
    id: 'news',
    title: 'Bài viết',
    type: 'collapse',
    icon: icons.FileTextOutlined,
    breadcrumbs: false,
    subject: 'Post',
    children: [
      {
        id: 'news-list',
        title: 'Danh sách bài viết',
        type: 'item',
        url: '/admin/quan-ly-bai-viet',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Post'
      },
      {
        id: 'news-create',
        title: 'Thêm bài viết',
        type: 'item',
        url: '/admin/them-bai-viet-moi',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Post'
      },
      {
        id: 'category-new',
        title: 'Danh mục bài viết',
        type: 'item',
        url: '/admin/danh-muc-bai-viet',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Post'
      }
    ]
  },

  {
    id: 'user-management',
    title: 'Tài khoản',
    type: 'collapse',
    icon: icons.TableOutlined,
    subject: 'User',
    children: [
      {
        id: 'user-list',
        title: 'Danh sách',
        type: 'item',
        url: '/admin/users',
        icon: icons.TableOutlined,
        exact: true,
        activeMenu: '/admin/users',
        action: 'read',
        subject: 'User'
      },
      {
        id: 'user-add',
        title: 'Thêm tài khoản',
        type: 'item',
        url: '/admin/users/create',
        icon: icons.FileTextOutlined,
        exact: true,
        action: 'create',
        subject: 'User'
      }
    ]
  },

  {
    id: 'notification-section',
    title: 'Thông báo',
    type: 'collapse',
    icon: icons.MessageOutlined,
    subject: 'Notification',
    children: [
      {
        id: 'notification-list',
        title: 'Danh sách thông báo',
        type: 'item',
        url: '/admin/notifications',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Notification'
      },
      {
        id: 'notification-create',
        title: 'Tạo thông báo',
        type: 'item',
        url: '/admin/notifications/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Notification'
      }
    ]
  },

  {
    id: 'comments',
    title: 'Bình luận',
    type: 'item',
    url: '/admin/comments',
    icon: icons.MessageOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'Comment'
  },

  {
    id: 'productqna',
    title: 'Hỏi đáp sản phẩm',
    type: 'item',
    url: '/admin/product-question',
    icon: icons.CommentOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'ProductQuestion'
  },

  {
    id: 'hislog',
    title: 'Nhật ký hoạt động',
    type: 'item',
    url: '/admin/hislog',
    icon: icons.TableOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'ActivityLog'
  }
];

export default pages;
