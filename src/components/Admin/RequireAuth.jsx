import { useEffect } from 'react';
import { Navigate, Outlet, useMatches } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import LoaderAdmin from './LoaderVip';
import { toast } from 'react-toastify';

/**
 * 
 * @function RequireAuth check user nếu có thì vào @param children, user === null thì tới @Navigate đăng nhập
 * 
 *
 */
const RequireAuth = ({ children }) => {
  const { user, loading, } = useAuthStore();
  
  if (loading) return <LoaderAdmin />;

  if (!user) {
    return <Navigate to="/dang-nhap-dashboard" replace />;
  }
  
  return children;
};

export default RequireAuth;
