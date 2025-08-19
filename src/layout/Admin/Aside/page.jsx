// src/layout/Admin/Aside/page.jsx
import {
  PieChartOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  StarOutlined,
  ClusterOutlined,
  TagsOutlined,
  SlidersOutlined,
  InboxOutlined,
  TableOutlined,
  CarOutlined,
  TrademarkOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  ReadOutlined,
  EditOutlined,
  BookOutlined,
  UserOutlined,
  UserAddOutlined,
  BellOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  SettingOutlined,
  GiftOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';

const icons = {
  PieChartOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  StarOutlined,
  ClusterOutlined,
  TagsOutlined,
  SlidersOutlined,
  TrademarkOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  ReadOutlined,
  InboxOutlined,
  TableOutlined,
  CarOutlined,
  EditOutlined,
  BookOutlined,
  UserOutlined,
  UserAddOutlined,
  BellOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  SettingOutlined,
  GiftOutlined,
  CheckSquareOutlined
};

const pages = [
  {
    id: 'overview-group',
    title: 'Tổng quan',
    type: 'group',
    children: [
      {
        id: 'dashboard-statistics',
        title: 'Thống kê',
        type: 'item',
        url: '/admin/dashboard/default',
        icon: icons.PieChartOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Dashboard'
      }
    ]
  },

  {
    id: 'product-catalog-group',
    title: 'Sản phẩm & Danh mục',
    type: 'group',
    children: [
      {
        url: '/admin/products/create',
        action: 'create',
        subject: 'Product'
      },
      {
        url: '/admin/products/edit/:slug',
        action: 'update',
        subject: 'Product'
      },
      {
        id: 'product-list',
        title: 'Sản phẩm',
        type: 'item',
        url: '/admin/products',
        icon: icons.ShoppingOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'featured-products',
        title: 'Sản phẩm nổi bật',
        type: 'item',
        url: '/admin/home-sections',
        icon: icons.StarOutlined, // Đã thêm lại icon bị thiếu
        breadcrumbs: false,
        action: 'read',
        subject: 'Section'
      },
      {
        url: '/admin/home-sections/edit/:slug',
        action: 'update',
        subject: 'Section'
      },
      {
        url: '/admin/home-sections/create',
        action: 'create',
        subject: 'Section'
      },
      {
        id: 'highlighted-category',
        title: 'Danh mục nổi bật',
        type: 'item',
        url: '/admin/highlighted-category-items',
        icon: icons.ClusterOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        url: '/admin/highlighted-category-items/create',
        action: 'create',
        subject: 'Product'
      },
      {
        url: '/admin/highlighted-category-items/edit/:slug',
        action: 'update',
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
        url: '/admin/categories/addd',
        action: 'create',
        subject: 'Product'
      },
      {
        url: '/admin/categories/edit/:slug',
        action: 'create',
        subject: 'Product'
      },
      {
        id: 'product-attribute',
        title: 'Thuộc tính sản phẩm',
        type: 'item',
        url: '/admin/product-variants',
        icon: icons.SlidersOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        url: '/admin/product-variants/create',
        action: 'create',
        subject: 'Product'
      },
      {
        url: '/admin/product-variants/edit/:slug',
        action: 'update',
        subject: 'Product'
      },
      {
        id: 'brand-list',
        title: 'Thương hiệu',
        type: 'item',
        url: '/admin/brands',
        icon: icons.TrademarkOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Brand'
      },
      {
        url: '/admin/brands/create',
        action: 'create',
        subject: 'Brand'
      },
      {
        url: '/admin/brands/edit/:slug',
        action: 'edit',
        subject: 'Brand'
      },
      
    ]
  },

  {
    id: 'marketing-group',
    title: 'Marketing',
    type: 'group',
    children: [
      {
        id: 'flash-sale',
        title: 'Khuyến mãi',
        type: 'collapse',
        icon: icons.ThunderboltOutlined,
        action: 'read',
        subject: 'flashSale',
        children: [
          {
            id: 'flash-sale-list',
            title: 'Danh sách khuyến mãi',
            type: 'item',
            url: '/admin/flash-sale',
            icon: icons.DollarOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'flashSale'
          },
          {
            id: 'flash-sale-create',
            title: 'Tạo mới khuyến mãi',
            type: 'item',
            url: '/admin/flash-sale/create',
            icon: icons.PercentageOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'flashSale'
          }
        ]
      },
      {
        id: 'slider-banner-section',
        title: 'Slider & Banner',
        type: 'collapse',
        icon: icons.SlidersOutlined,
        action: 'read',
        subject: 'Banner',
        children: [
          {
            id: 'banner-list',
            title: 'Danh sách banner',
            type: 'item',
            url: '/admin/banners',
            icon: icons.TableOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'Banner'
          },
          {
            url: '/admin/banners/create',
            action: 'create',
            subject: 'Banner'
          },
          {
            url: '/admin/banners/edit/:slug',
            action: 'update',
            subject: 'Banner'
          },
        ]
      },
      {
        id: 'coupon-section',
        title: 'Mã giảm giá',
        type: 'collapse',
        icon: icons.PercentageOutlined,
        action: 'read',
        subject: 'coupon',
        children: [
          {
            id: 'coupon-list',
            title: 'Danh sách mã giảm',
            type: 'item',
            url: '/admin/coupons',
            icon: icons.TagsOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'coupon'
          },
          {
            id: 'coupon-add',
            title: 'Thêm mã giảm giá',
            type: 'item',
            url: '/admin/coupons/create',
            icon: icons.EditOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'coupon'
          },
          {
            url: '/admin/coupons/edit/:id',
            action: 'update',
            subject: 'coupon'
          }
        ]
      },
      {
        id: 'mini-game-section',
        title: 'Mini Game',
        type: 'collapse',
        icon: icons.GiftOutlined,
        action: 'read',
        subject: 'SpinReward',
        children: [
          {
            id: 'spin-reward-list',
            title: 'Vòng quay may mắn',
            type: 'item',
            url: '/admin/spin-rewards',
            icon: icons.TableOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'SpinReward'
          },
          {
            url: '/admin/spin-rewards/edit/:id',
            action: 'update',
            subject: 'SpinReward'
          },
          {
            url: '/admin/spin-rewards/create',
            action: 'create',
            subject: 'SpinReward'
          },
          {
            id: 'spin-history-list',
            title: 'Lịch sử quay',
            type: 'item',
            url: '/admin/spin-history',
            icon: icons.HistoryOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'SpinHistory'
          }
        ]
      },
      {
        id: 'news',
        title: 'Bài viết',
        type: 'collapse',
        icon: icons.ReadOutlined,
        action: 'read',
        subject: 'Post',
        children: [
          {
            id: 'news-list',
            title: 'Danh sách bài viết',
            type: 'item',
            url: '/admin/quan-ly-bai-viet',
            icon: icons.BookOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'Post'
          },
          {
            id: 'news-create',
            title: 'Thêm bài viết',
            type: 'item',
            url: '/admin/them-bai-viet-moi',
            icon: icons.EditOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'Post'
          },
          {
            url: '/admin/quan-ly-bai-viet/chinh-sua-bai-viet/:slug',
            action: 'update',
            subject: 'Post'
          },
          {
            id: 'category-new',
            title: 'Danh mục bài viết',
            type: 'item',
            url: '/admin/danh-muc-bai-viet',
            icon: icons.TagsOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'Post'
          },
          {
            url: '/admin/danh-muc-bai-viet/chinh-sua-danh-muc/:slug',
            action: 'update',
            subject: 'Post'
          },
        ]
      }
    ]
  },

  {
    id: 'order-management-group',
    title: 'Quản lý Đơn hàng',
    type: 'group',
    children: [
      {
        id: 'orderlist',
        title: 'Đơn hàng',
        type: 'item',
        url: '/admin/orders',
        icon: icons.ShoppingCartOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Order'
      },
      {
        url: '/admin/orders',
        action: 'update',
        subject: 'Order'
      },
      {
        id: 'return-requests',
        title: 'Yêu cầu đổi/trả',
        type: 'item',
        url: '/admin/return-requests',
        icon: icons.HistoryOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ReturnRequest'
      }
    ]
  },

  {
    id: 'content-interact-group',
    title: 'Nội dung & Tương tác',
    type: 'group',
    children: [
      {
        id: 'all-comments',
        title: 'Bình luận',
        type: 'item',
        url: '/admin/comments/all',
        icon: icons.CommentOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Comment'
      },
      {
        id: 'productqna',
        title: 'Hỏi đáp sản phẩm',
        type: 'item',
        url: '/admin/product-question',
        icon: icons.QuestionCircleOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductQA'
      }
    ]
  },

  {
    id: 'user-management-group',
    title: 'Quản lý Người dùng',
    type: 'group',
    children: [
      {
        id: 'user-management',
        title: 'Tài khoản',
        type: 'collapse',
        icon: icons.UserOutlined,
        url: '/admin/users',
        action: 'read',
        subject: 'user',
        children: [
          {
            id: 'user-list',
            title: 'Danh sách',
            type: 'item',
            url: '/admin/users',
            icon: icons.UserOutlined,
            exact: false,
            activeMenu: '/admin/users',
            action: 'read',
            subject: 'User'
          },
          {
            id: 'user-add',
            title: 'Thêm tài khoản',
            type: 'item',
            url: '/admin/users/create',
            icon: icons.UserAddOutlined,
            exact: true,
            action: 'create',
            subject: 'User'
          }
        ]
      },
      {
        id: 'roles',
        title: 'Quản lý Vai trò',
        type: 'collapse',
        url: '/admin/quan-ly-vai-tro',
        icon: icons.SafetyCertificateOutlined,
        breadcrumbs: false,
        subject: 'Role',
        children: [
          {
            id: 'role-list',
            title: 'Phân quyền & Vai trò',
            type: 'item',
            url: '/admin/quan-ly-vai-tro/ma-tran-phan-quyen',
            icon: icons.SafetyCertificateOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'Role'
          },
          {
            id: 'role-manage',
            title: 'Quản lý vai trò',
            type: 'item',
            url: '/admin/quan-ly-vai-tro/danh-sach-vai-tro',
            icon: icons.ToolOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'Role'
          },
          {
            id: 'permission-manage',
            title: 'Danh mục quyền',
            type: 'item',
            url: '/admin/quan-ly-vai-tro/danh-muc-quyen',
            icon: icons.TagsOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'Role'
          }
        ]
      }
    ]
  },

  {
    id: 'system-config-group',
    title: 'Cấu hình Hệ thống',
    type: 'group',
    children: [
      {
        id: 'notification-settings',
        title: 'Thông báo',
        type: 'collapse',
        icon: icons.BellOutlined,
        action: 'read',
        subject: 'notification',
        children: [
          {
            id: 'notification-list',
            title: 'Danh sách thông báo',
            type: 'item',
            url: '/admin/notifications',
            icon: icons.BellOutlined,
            breadcrumbs: false,
            action: 'read',
            subject: 'notification'
          },
          {
            id: 'notification-create',
            title: 'Tạo thông báo',
            type: 'item',
            url: '/admin/notifications/create',
            icon: icons.EditOutlined,
            breadcrumbs: false,
            action: 'create',
            subject: 'notification'
          }
        ]
      },
      {
        id: 'hislog',
        title: 'Nhật ký hoạt động',
        type: 'item',
        url: '/admin/hislog',
        icon: icons.HistoryOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ActivityLog'
      },
      {
        id: 'payment-methods',
        title: 'Phương thức thanh toán',
        type: 'item',
        url: '/admin/payment-methods',
        icon: icons.DollarOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'PaymentMethod'
      },
      {
        id: 'shipping-providers',
        title: 'Hãng vận chuyển',
        type: 'item',
        url: '/admin/shipping-providers',
        icon: icons.CarOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ShippingProvider'
      },
      {
        id: 'system-settings',
        title: 'Cài đặt hệ thống',
        type: 'item',
        url: '/admin/system-settings',
        icon: icons.SettingOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Setting'
      }
    ]
  }
];

export default pages;
