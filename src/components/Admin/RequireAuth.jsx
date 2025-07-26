import { Navigate } from 'react-router-dom';

import useAuthStore from '@/stores/AuthStore';
import LoaderAdmin from './LoaderVip';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <LoaderAdmin />;

  // ✅ Không có user => về login
  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }
  
  // // ✅ Check ít nhất 1 role có canAccess: true
  const hasAccess = (user.roles || []).some(role => role.canAccess === true);
  
  if (!hasAccess) {
    return <Navigate to="/403" replace />;
    // Hoặc bạn muốn về 403 thì đổi: <Navigate to="/403" replace />
  }

  return children;
};

export default RequireAuth;
