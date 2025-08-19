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
  console.log('🔍 Kiểm tra đường dẫn:', pathname);
  console.log('📜 Danh sách route có quyền:', ROUTE_PERMISSIONS);
  
  // Ưu tiên match chính xác trước
  const exactMatch = ROUTE_PERMISSIONS.find(route => route.url === pathname);
  if (exactMatch) {
    console.log('✅ Tìm thấy route khớp chính xác:', exactMatch);
    return exactMatch;
  }
  
  // Match route động (có :param)
  const dynamicMatch = ROUTE_PERMISSIONS.find(route => {
    if (!route.url.includes(':')) return false;

    const routePattern = route.url.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    const matches = regex.test(pathname);

    console.log(`🛠 Kiểm tra route động: ${route.url}`);
    console.log(`   📌 Pattern: ${routePattern}`);
    console.log(`   📌 Pathname: ${pathname}`);
    console.log(`   📌 Kết quả khớp: ${matches}`);

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
  console.log('👤 Thông tin người dùng:', user);
  console.log('📍 Đường dẫn hiện tại:', location.pathname);

  if (loading) return <LoaderAdmin />;

  // Nếu chưa đăng nhập → điều hướng sang trang đăng nhập
  if (!user) {
    console.log('🚫 Chưa đăng nhập, chuyển hướng sang /dang-nhap');
    return <Navigate to="/dang-nhap" replace />;
  }

  // Kiểm tra xem user có bất kỳ quyền hợp lệ nào không
  const userPermissions = user.permissions || [];
  const hasAnyValidPermission = userPermissions.some(
    (perm) => perm.action?.trim() && perm.subject?.trim()
  );

  if (!hasAnyValidPermission) {
    console.log('🚫 Người dùng không có bất kỳ quyền hợp lệ nào');
    return <Navigate to="/403" replace />;
  }

  // Kiểm tra quyền cho route cụ thể
  const requiredPermission = getRequiredPermission(location.pathname);

  if (requiredPermission) {
    console.log('📌 Quyền yêu cầu cho route:', requiredPermission);
    console.log('📜 Danh sách quyền của người dùng:', userPermissions);
    
    const hasRoutePermission = hasPermission(
      userPermissions,
      requiredPermission.action,
      requiredPermission.subject
    );
    
    console.log(`✅ Có quyền truy cập route này: ${hasRoutePermission}`);
    
    if (!hasRoutePermission) {
      console.log('🚫 Không đủ quyền, chuyển hướng sang /403');
      return <Navigate to="/403" replace />;
    }
  } else {
    // Nếu route không có trong cấu hình quyền
    console.log('ℹ️ Route này không có cấu hình quyền:', location.pathname);
    
    if (location.pathname.startsWith('/admin/')) {
      console.log('🚫 Đây là route admin nhưng không có quyền cấu hình → chặn');
      return <Navigate to="/403" replace />;
    }
    
    console.log('✅ Cho phép truy cập vì là route public');
  }

  return children;
};

export default RequireAuth;
