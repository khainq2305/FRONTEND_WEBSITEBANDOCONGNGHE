// assets – import đủ icon cần dùng
import {
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
  InboxOutlined
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
  InboxOutlined
};

const pages = [
  // ===== Dashboard =====
  {
    id: 'dashboard-statistics',
    title: 'Thống kê',
    type: 'item',
    url: '/admin/dashboard/default',
    icon: icons.PieChartOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'Dashboard'
  },

  // ===== Product =====
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
        icon: icons.ShoppingOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'sku-list',
        title: 'Sản phẩm tồn kho',
        type: 'item',
        url: '/admin/skulist',
        icon: icons.InboxOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'featured-products',
        title: 'Sản phẩm nổi bật',
        type: 'item',
        url: '/admin/home-sections',
        icon: icons.StarOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Product'
      },
      {
        id: 'highlighted-category',
        title: 'Danh mục nổi bật',
        type: 'item',
        url: '/admin/highlighted-category-items',
        icon: icons.ClusterOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'ProductCategory'
      },
       {
        id: 'sku-list',
        title: 'Sản phẩm tồn kho',
        type: 'item',
        url: '/admin/skulist',
        icon: icons.InboxOutlined,
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
        icon: icons.SlidersOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'VariantProduct'
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
      }
    ]
  },

  // ===== Flash sale / Promotion =====
  {
    id: 'flash-sale',
    title: 'Khuyến mãi',
    type: 'collapse',
    icon: icons.ThunderboltOutlined,
    action: 'read',
    subject: 'FlashSale',
    children: [
      {
        id: 'flash-sale-list',
        title: 'Danh sách khuyến mãi',
        type: 'item',
        url: '/admin/flash-sale',
        icon: icons.DollarOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'FlashSale'
      },
      {
        id: 'flash-sale-create',
        title: 'Tạo mới khuyến mãi',
        type: 'item',
        url: '/admin/flash-sale/create',
        icon: icons.PercentageOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'FlashSale'
      }
    ]
  },

  // ===== Slider & Banner =====
  {
    id: 'slider-section',
    title: 'Slider & Banner',
    type: 'collapse',
    icon: icons.SlidersOutlined,
    action: 'read',
    subject: 'Banner',
    children: [
      {
        id: 'banner-list',
        title: 'Danh sách Banner',
        type: 'item',
        url: '/admin/banners',
        icon: icons.FileTextOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Banner'
      }
    ]
  },

  // ===== Coupon =====
  {
    id: 'coupon-section',
    title: 'Mã giảm giá',
    type: 'collapse',
    icon: icons.PercentageOutlined,
    action: 'read',
    subject: 'Coupon',
    children: [
      {
        id: 'coupon-list',
        title: 'Danh sách mã giảm',
        type: 'item',
        url: '/admin/coupons',
        icon: icons.TagsOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Coupon'
      },
      {
        id: 'coupon-add',
        title: 'Thêm mã giảm giá',
        type: 'item',
        url: '/admin/coupons/create',
        icon: icons.EditOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Coupon'
      }
    ]
  },

  // ===== Orders =====
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

  // ===== Posts =====
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
        id: 'category-new',
        title: 'Danh mục bài viết',
        type: 'item',
        url: '/admin/danh-muc-bai-viet',
        icon: icons.TagsOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'PostCategory'
      }
    ]
  },

  // ===== Users =====
  {
    id: 'user-management',
    title: 'Tài khoản',
    type: 'collapse',
    icon: icons.UserOutlined,
    url: '/admin/users',
    action: 'read',
    subject: 'User',
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

  // ===== Notifications =====
  {
    id: 'notification-section',
    title: 'Thông báo',
    type: 'collapse',
    icon: icons.BellOutlined,
    action: 'read',
    subject: 'Notification',
    children: [
      {
        id: 'notification-list',
        title: 'Danh sách thông báo',
        type: 'item',
        url: '/admin/notifications',
        icon: icons.BellOutlined,
        breadcrumbs: false,
        action: 'read',
        subject: 'Notification'
      },
      {
        id: 'notification-create',
        title: 'Tạo thông báo',
        type: 'item',
        url: '/admin/notifications/create',
        icon: icons.EditOutlined,
        breadcrumbs: false,
        action: 'create',
        subject: 'Notification'
      }
    ]
  },

  // ===== Comments & Q&A =====
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
  },

  // ===== Logs =====
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

  // ===== Roles & Permissions =====
  {
    id: 'roles',
    title: 'Quản lý vai trò',
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
  },

  // ===== Settings =====
  {
    id: 'system-settings',
    title: 'Cài đặt',
    type: 'item',
    url: '/admin/system-settings',
    icon: icons.SettingOutlined,
    breadcrumbs: false,
    action: 'read',
    subject: 'SystemSettings'
  },
  // ===== NEW – Payment & Shipping =====
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

];

export default pages;
