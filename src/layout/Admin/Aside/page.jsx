// assets
import {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined // <- THÊM ICON PHÙ HỢP
} from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined,
  FileTextOutlined,
  TagsOutlined // <- THÊM VÀO ICONS
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
    icon: icons.TagsOutlined, // <- ICON GỢI Ý
    breadcrumbs: false
  }
];

export default pages;
