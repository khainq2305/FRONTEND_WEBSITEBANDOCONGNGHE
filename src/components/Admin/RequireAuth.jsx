import { Navigate } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import { useEffect } from 'react';
import Loader from './Loader';
import LoaderAdmin from './LoaderVip';


const ALLOWED_ROLES = ['admin', 'content_staff'];

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuthStore();


  if (loading) {
    return <LoaderAdmin />;
  }

  if (!user) {
    return <Navigate to="/dang-nhap-dashboard" replace />;
  } 
  // else if (!ALLOWED_ROLES.includes(user.role)) {
  //   return <Navigate to="/403" replace />;
  // }

  console.log('[Page Requied ] Vai tro', user.role)
  
  return children;
};

export default RequireAuth;
