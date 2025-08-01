import { useMemo } from 'react';
import useAuthStore from '@/stores/AuthStore';

// Hook đơn giản để kiểm tra quyền
export const usePermission = (action, subject) => {
  const user = useAuthStore((state) => state.user);
  
  return useMemo(() => {
    if (!user?.permissions) return false;
    
    return user.permissions.some(permission => 
      permission.action === action && permission.subject === subject
    );
  }, [user, action, subject]);
};

// Hook để kiểm tra trạng thái disable
export const usePermissionDisabled = (action, subject) => {
  const hasPermission = usePermission(action, subject);
  return !hasPermission;
};
