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

const pages = [
  {
    id: 'product-section-collapse',
    title: 'Quản lý sản phẩm',
    type: 'collapse',
    icon: icons.AppstoreOutlined,
    children: [
      {
        id: 'product-list',
        title: 'Sản phẩm',
        type: 'item',
        url: '/admin/products',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      },
      {
        id: 'featured-products',
        title: 'Sản phẩm nổi bật',
        type: 'item',
        url: '/admin/home-sections',
        icon: icons.GiftOutlined,
        breadcrumbs: false
      },
      {
        id: 'highlighted-category',
        title: 'Danh mục nổi bật',
        type: 'item',
        url: '/admin/highlighted-category-items',
        icon: icons.ProfileOutlined,
        breadcrumbs: false
      },
      {
        id: 'product-category',
        title: 'Danh mục sản phẩm',
        type: 'item',
        url: '/admin/categories/list',
        icon: icons.TagsOutlined,
        breadcrumbs: false
      },
      {
        id: 'product-attribute',
        title: 'Thuộc tính sản phẩm',
        type: 'item',
        url: '/admin/product-variants',
        icon: icons.CommentOutlined,
        breadcrumbs: false
      },
      {
        id: 'brand-list',
        title: 'Thương hiệu',
        type: 'item',
        url: '/admin/brands',
        icon: icons.MessageOutlined,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'flash-sale',
    title: 'Flash Sale',
    type: 'collapse',
    icon: icons.GiftOutlined,
    children: [
      {
        id: 'flash-sale-list',
        title: 'Danh sách Flash Sale',
        type: 'item',
        url: '/admin/flash-sale',
        icon: icons.TableOutlined,
        breadcrumbs: false
      },
      {
        id: 'flash-sale-create',
        title: 'Tạo Flash Sale',
        type: 'item',
        url: '/admin/flash-sale/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'slider-section',
    title: 'Slider & Banner',
    type: 'collapse',
    icon: icons.FileTextOutlined,
    children: [
      {
        id: 'banner-list',
        title: 'Danh sách Banner',
        type: 'item',
        url: '/admin/banners', 
        icon: TableOutlined,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'coupon-section',
    title: 'Mã giảm giá',
    type: 'collapse',
    icon: icons.GiftOutlined,
    children: [
      {
        id: 'coupon-list',
        title: 'Danh sách mã giảm',
        type: 'item',
        url: '/admin/coupons',
        icon: icons.TableOutlined,
        breadcrumbs: false
      },
      {
        id: 'coupon-add',
        title: 'Thêm mã giảm giá',
        type: 'item',
        url: '/admin/coupons/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'orderlist',
    title: 'Đơn hàng',
    type: 'item',
    url: '/admin/orders',
    icon: icons.FileTextOutlined,
    breadcrumbs: false
  },

  {
    id: 'news',
    title: 'Bài viết',
    type: 'collapse',
    icon: icons.FileTextOutlined,
    breadcrumbs: false,
    children: [
      {
        id: 'news-list',
        title: 'Danh sách bài viết',
        type: 'item',
        url: '/admin/quan-ly-bai-viet',
        icon: icons.TableOutlined,
        breadcrumbs: false
      },
      {
        id: 'news-create',
        title: 'Thêm bài viết',
        type: 'item',
        url: '/admin/them-bai-viet-moi',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      },
      {
        id: 'category-new',
        title: 'Danh mục bài viết',
        type: 'item',
        url: '/admin/danh-muc-bai-viet',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'user-management',
    title: 'Tài khoản',
    type: 'collapse',
    icon: icons.TableOutlined,
    url: '/admin/users',
    children: [
      {
        id: 'user-list',
        title: 'Danh sách',
        type: 'item',
        url: '/admin/users',
        icon: icons.TableOutlined,
        exact: true,
        activeMenu: '/admin/users'
      },
      {
        id: 'user-add',
        title: 'Thêm tài khoản',
        type: 'item',
        url: '/admin/users/create',
        icon: icons.FileTextOutlined,
        exact: true
      }
    ]
  },
  {
    id: 'notification-section',
    title: 'Thông báo',
    type: 'collapse',
    icon: icons.MessageOutlined,
    children: [
      {
        id: 'notification-list',
        title: 'Danh sách thông báo',
        type: 'item',
        url: '/admin/notifications',
        icon: icons.TableOutlined,
        breadcrumbs: false
      },
      {
        id: 'notification-create',
        title: 'Tạo thông báo',
        type: 'item',
        url: '/admin/notifications/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'all-comments',
    title: 'Bình luận',
    type: 'item',
    url: '/admin/comments/all',
    icon: icons.MessageOutlined,
    breadcrumbs: false
  },

  {
    id: 'productqna',
    title: 'Hỏi đáp sản phẩm',
    type: 'item',
    url: '/admin/product-question',
    icon: icons.CommentOutlined,
    breadcrumbs: false
  },
  {
    id: 'hislog',
    title: 'Nhật ký hoạt động',
    type: 'item',
    url: '/admin/hislog',
    icon: icons.TableOutlined,
    breadcrumbs: false
  }
];

export default pages;
