// assets
import {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined,
  MessageOutlined,
  AppstoreOutlined,
  CommentOutlined
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
  CommentOutlined
};

const pages = [
  {
    id: 'product-section-collapse',
    title: 'Sản phẩm',
    type: 'collapse',
    icon: icons.AppstoreOutlined,
    children: [
      {
        id: 'product-list',
        title: 'Danh sách sản phẩm',
        type: 'item',
        url: '/admin/products',
        icon: icons.TableOutlined,
        breadcrumbs: false
      },
      {
        id: 'product-category',
        title: 'Danh mục sản phẩm',
        type: 'item',
        url: '/admin/categories',
        icon: icons.TagsOutlined,
        breadcrumbs: false
      },
      {
        id: 'product-attribute',
        title: 'Thuộc tính sản phẩm',
        type: 'item',
        url: '/admin/product-attributes',
        icon: icons.CommentOutlined,
        breadcrumbs: false
      },
      {
        id: 'product-create',
        title: 'Thêm sản phẩm',
        type: 'item',
        url: '/admin/products/create',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'basictable',
    title: 'Basic Table',
    type: 'item',
    url: '/admin/basic-table',
    icon: icons.TableOutlined,
    breadcrumbs: false
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
        url: '/admin/quan-ly-bai-viet/create',
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
    id: 'userlist',
    title: 'Tài khoản',
    type: 'item',
    url: '/admin/users',
    icon: icons.TableOutlined,
    breadcrumbs: false
  },
  {
    id: 'comments',
    title: 'Bình luận',
    type: 'item',
    url: '/admin/comments',
    icon: icons.MessageOutlined,
    breadcrumbs: false
  },
  {
    id: 'brand',
    title: 'Thương hiệu',
    type: 'item',
    url: '/admin/brands',
    icon: icons.TagsOutlined,
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
