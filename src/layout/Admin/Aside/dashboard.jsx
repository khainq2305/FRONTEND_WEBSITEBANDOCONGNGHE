// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEM - DASHBOARD (FLAT) ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'item',
  url: '/admin/dashboard/default',
  icon: icons.DashboardOutlined,
  breadcrumbs: false
};

export default dashboard;
