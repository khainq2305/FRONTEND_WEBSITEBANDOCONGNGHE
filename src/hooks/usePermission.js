// src/hooks/usePermission.js
import useAuthStore from '@/stores/AuthStore';
import { hasPermission, hasActionOnAnySubject } from '@/utils/disableAction';

export const usePermission = (action, subject) => {
  const { user } = useAuthStore();
  
  return hasPermission(user?.permissions || [], action, subject);
};

// Check if user can manage a subject (has any action on it)
export const useCanManage = (subject) => {
  const { user } = useAuthStore();
  
  if (!user?.permissions || !subject) return false;
  
  return user.permissions.some(permission => permission.subject === subject);
};