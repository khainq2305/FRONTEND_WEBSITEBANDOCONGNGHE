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
    action: 'read',
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
        subject: 'Product',
      },
      {
        id: 'featured-products',
        title: 'Sản phẩm nổi bật',
        type: 'item',
        url: '/admin/home-sections',
        icon: icons.GiftOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product',
      },
      {
        id: 'highlighted-category',
        title: 'Danh mục nổi bật',
        type: 'item',
        url: '/admin/highlighted-category-items',
        icon: icons.ProfileOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductCategory',
      },
      {
        id: 'product-category',
        title: 'Danh mục sản phẩm',
        type: 'item',
        url: '/admin/categories/list',
        icon: icons.TagsOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductCategory',
      },
      {
        id: 'product-attribute',
        title: 'Thuộc tính sản phẩm',
        type: 'item',
        url: '/admin/product-variants',
        icon: icons.CommentOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'VariantProduct',
      },
      {
        id: 'brand-list',
        title: 'Thương hiệu',
        type: 'item',
        url: '/admin/brands',
        icon: icons.MessageOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Brand',
      }
    ]
  },

  {
    id: 'flash-sale',
    title: 'Flash Sale',
    type: 'collapse',
    icon: icons.GiftOutlined,
    action: 'read',
        subject: 'flashSale',
    children: [
      {
        id: 'flash-sale-list',
        title: 'Danh sách Flash Sale',
        type: 'item',
        url: '/admin/flash-sale',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'flashSale',
      },
      {
        id: 'flash-sale-create',
        title: 'Tạo Flash Sale',
        type: 'item',
        url: '/admin/flash-sale/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'flashSale',
      }
    ]
  },

  {
    id: 'slider-section',
    title: 'Slider & Banner',
    type: 'collapse',
    icon: icons.FileTextOutlined,
    action: 'read',
        subject: 'Banner',
    children: [
      {
        id: 'banner-list',
        title: 'Danh sách Banner',
        type: 'item',
        url: '/admin/banners', 
        icon: TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Banner',
      }
    ]
  },

  {
    id: 'coupon-section',
    title: 'Mã giảm giá',
    type: 'collapse',
    icon: icons.GiftOutlined,
    action: 'read',
        subject: 'coupon',
    children: [
      {
        id: 'coupon-list',
        title: 'Danh sách mã giảm',
        type: 'item',
        url: '/admin/coupons',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'coupon'
      },
      {
        id: 'coupon-add',
        title: 'Thêm mã giảm giá',
        type: 'item',
        url: '/admin/coupons/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'coupon'
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
    action: 'read',
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
        subject: 'PostCategory'
      }
    ]
  },

  {
    id: 'user-management',
    title: 'Tài khoản',
    type: 'collapse',
    icon: icons.TableOutlined,
    url: '/admin/users',
    action: 'read',
        subject: 'user',
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
        subject: 'user'
      },
      {
        id: 'user-add',
        title: 'Thêm tài khoản',
        type: 'item',
        url: '/admin/users/create',
        icon: icons.FileTextOutlined,
        exact: true,
        action: 'create',
        subject: 'user'
      }
    ]
  },
  {
    id: 'notification-section',
    title: 'Thông báo',
    type: 'collapse',
    icon: icons.MessageOutlined,
    action: 'read',
        subject: 'notification',
    children: [
      {
        id: 'notification-list',
        title: 'Danh sách thông báo',
        type: 'item',
        url: '/admin/notifications',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'notification'
      },
      {
        id: 'notification-create',
        title: 'Tạo thông báo',
        type: 'item',
        url: '/admin/notifications/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'notification'
      }
    ]
  },
  {
    id: 'all-comments',
    title: 'Bình luận',
    type: 'item',
    url: '/admin/comments/all',
    icon: icons.MessageOutlined,
    breadcrumbs: false,
    action: 'read',
        subject: 'comment'
  },

  {
    id: 'productqna',
    title: 'Hỏi đáp sản phẩm',
    type: 'item',
    url: '/admin/product-question',
    icon: icons.CommentOutlined,
    breadcrumbs: false,
    action: 'read',
        subject: 'ProductQA'
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
  },
  {
    id: 'roles',
    title: 'Quản lý vai trò',
    type: 'collapse',
    url: '/admin/quan-ly-vai-tro',
    icon: icons.TableOutlined,
    breadcrumbs: false,
    subject: 'Role', 
    children: [
      {
        id: 'role-list',
        title: 'Phân quyền & Vai trò',
        type: 'item',
        url: '/admin/quan-ly-vai-tro/ma-tran-phan-quyen',
        icon: icons.TableOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Role'
      },
      {
        id: 'role-manage',
        title: 'Quản lý vai trò',
        type: 'item',
        url: '/admin/quan-ly-vai-tro/danh-sach-vai-tro',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Role'
      },
      {
        id: 'permission-manage',
        title: 'Danh mục quyền',
        type: 'item',
        url: '/admin/quan-ly-vai-tro/danh-muc-quyen',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Role'
      }
    ]
  }
];

export default pages;
