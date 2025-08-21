import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import LoaderAdmin from './LoaderVip';
import pages from '@/layout/Admin/Aside/page';

// Utility để flatten menu items lồng nhau
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

// Danh sách route + quyền được flatten sẵn để tối ưu hiệu suất
const ROUTE_PERMISSIONS = flattenMenuItems(pages);

// Hàm kiểm tra quyền
const hasPermission = (userPermissions, requiredAction, requiredSubject) => {
  if (!Array.isArray(userPermissions)) return false;

  return userPermissions.some(permission => {
    const action = (permission.action || '').toLowerCase().trim();
    const subject = (permission.subject || '').toLowerCase().trim();
    const reqAction = (requiredAction || '').toLowerCase().trim();
    const reqSubject = (requiredSubject || '').toLowerCase().trim();

    // 1. Super admin: manage all
    if (action === 'manage' && subject === 'all') return true;

    // 2. Quản lý toàn bộ 1 subject (vd: manage products)
    if (action === 'manage' && subject === reqSubject) return true;

    // 3. Match action + subject chính xác
    return action === reqAction && subject === reqSubject;
  });
};




// Hàm lấy quyền cần thiết từ URL
const getRequiredPermission = (pathname) => {
  
  // Ưu tiên match chính xác trước
  const exactMatch = ROUTE_PERMISSIONS.find(route => route.url === pathname);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Match route động (có :param)
  const dynamicMatch = ROUTE_PERMISSIONS.find(route => {
    if (!route.url.includes(':')) return false;

    const routePattern = route.url.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    const matches = regex.test(pathname);


    return matches;
  });

  // Nếu không thấy thì thử match partial path
  if (!dynamicMatch) {
    console.log('🔄 Thử match một phần đường dẫn...');
    const partialMatch = ROUTE_PERMISSIONS.find(route => {
      if (!route.url.includes(':')) return false;
      
      const routeSegments = route.url.split('/').filter(Boolean);
      const pathSegments = pathname.split('/').filter(Boolean);
      
      if (routeSegments.length !== pathSegments.length) return false;
      
      const matches = routeSegments.every((routeSegment, index) => {
        if (routeSegment.startsWith(':')) return true;
        return routeSegment === pathSegments[index];
      });
      
      if (matches) {
        console.log('✅ Tìm thấy match một phần:', route);
      }
      
      return matches;
    });
    
    return partialMatch;
  }
  
  console.log('📌 Kết quả cuối cùng:', dynamicMatch || null);
  return dynamicMatch;
};

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();


  if (loading) return <LoaderAdmin />;

  // Nếu chưa đăng nhập → điều hướng sang trang đăng nhập
  if (!user) {

    return <Navigate to="/dang-nhap" replace />;
  }

  // Kiểm tra xem user có bất kỳ quyền hợp lệ nào không
  const userPermissions = user.permissions || [];
  const hasAnyValidPermission = userPermissions.some(
    (perm) => perm.action?.trim() && perm.subject?.trim()
  );

  if (!hasAnyValidPermission) {

    return <Navigate to="/403" replace />;
  }

  // Kiểm tra quyền cho route cụ thể
  const requiredPermission = getRequiredPermission(location.pathname);

  if (requiredPermission) {
    
    const hasRoutePermission = hasPermission(
      userPermissions,
      requiredPermission.action,
      requiredPermission.subject
    );
    
    
    if (!hasRoutePermission) {
      return <Navigate to="/403" replace />;
    }
  } else {
    // Nếu route không có trong cấu hình quyền
    
    if (location.pathname.startsWith('/admin/')) {
      return <Navigate to="/403" replace />;
    }
    
    console.log('✅ Cho phép truy cập vì là route public');
  }

  return children;
};

export default RequireAuth;
