// assets
import {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined,
  CommentOutlined
} from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined,
  CommentOutlined 
};

// ==============================|| MENU ITEMS - FLAT AUTH PAGES ||============================== //

const pages = [
  {
    id: 'login1',
    title: 'Login',
    type: 'item',
    url: '/login',
    icon: icons.LoginOutlined,
    target: true
  },
  {
    id: 'register1',
    title: 'Register',
    type: 'item',
    url: '/register',
    icon: icons.ProfileOutlined,
    target: true
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
    url: '/admin/quan-ly-bai-viet',
    icon: icons.FileTextOutlined,
    breadcrumbs: false,
  },
  {
    id: 'category-new',
    title: 'Danh mục bài viết',
    type: 'item',
    url: '/admin/danh-muc-bai-viet',
    icon: icons.FileTextOutlined,
    breadcrumbs: false
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
},
];

export default pages;
