import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import LoaderAdmin from './LoaderVip';
import pages from '@/layout/Admin/Aside/page';

// Utility để flatten nested menu items
const flattenMenuItems = (items) => {
  const result = [];
  
  items.forEach(item => {
    if (item.url && item.action && item.subject) {
      result.push({
        url: item.url,
        action: item.action,
        subject: item.subject
      });
    }
    
    if (item.children) {
      result.push(...flattenMenuItems(item.children));
    }
  });
  
  return result;
};

// Cache flattened items để tối ưu performance
const ROUTE_PERMISSIONS = flattenMenuItems(pages);

// Utility để check permission
const hasPermission = (userPermissions, requiredAction, requiredSubject) => {
  return userPermissions.some(
    permission => permission.action === requiredAction && permission.subject === requiredSubject
  );
};

// Utility để tìm permission yêu cầu từ URL
const getRequiredPermission = (pathname) => {
  // Exact match trước
  const exactMatch = ROUTE_PERMISSIONS.find(route => route.url === pathname);
  if (exactMatch) return exactMatch;
  
  // Dynamic route matching (ví dụ: /admin/posts/123/edit)
  const dynamicMatch = ROUTE_PERMISSIONS.find(route => {
    if (!route.url.includes(':')) return false;
    
    const routePattern = route.url.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
  
  return dynamicMatch;
};

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <LoaderAdmin />;

  // Check authentication
  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }
  
  // Check role access
  const hasAccess = (user.roles || []).some(role => role.canAccess === true);
  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  // Check route-specific permissions
  const requiredPermission = getRequiredPermission(location.pathname);
  
  if (requiredPermission) {
    const hasRoutePermission = hasPermission(
      user.permissions || [], 
      requiredPermission.action, 
      requiredPermission.subject
    );
    
    if (!hasRoutePermission) {
      return <Navigate to="/403" replace />;
    }
  }
  
  return children;
};

export default RequireAuth;