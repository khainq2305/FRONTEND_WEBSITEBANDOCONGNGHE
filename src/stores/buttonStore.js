import { create } from 'zustand';
import useAuthStore from './AuthStore';

const useButtonStore = create((set, get) => ({
  // Kiểm tra quyền từ user permissions
  canPerformAction: (action, subject) => {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.permissions) {
      console.warn('Không có user hoặc permissions - user chưa đăng nhập');
      return false;
    }

    // Kiểm tra trong danh sách permissions của user
    return user.permissions.some(permission => 
      permission.action === action && permission.subject === subject
    );
  },

  // Kiểm tra quyền và trả về trạng thái disable cho button
  isButtonDisabled: (action, subject) => {
    const canPerform = get().canPerformAction(action, subject);
    return !canPerform;
  },

  // Kiểm tra nhiều quyền cùng lúc (AND logic)
  canPerformMultipleActions: (permissions) => {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.permissions) {
      return false;
    }

    return permissions.every(({ action, subject }) => 
      user.permissions.some(permission => 
        permission.action === action && permission.subject === subject
      )
    );
  },

  // Kiểm tra ít nhất một quyền trong danh sách (OR logic)
  canPerformAnyAction: (permissions) => {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.permissions) {
      return false;
    }

    return permissions.some(({ action, subject }) => 
      user.permissions.some(permission => 
        permission.action === action && permission.subject === subject
      )
    );
  },

  // Kiểm tra role có quyền truy cập
  hasRoleAccess: (roleName) => {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some(role => 
      role.name === roleName && role.canAccess === true
    );
  },

  // Kiểm tra user có quyền quản trị
  isAdmin: () => {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some(role => 
      role.name === 'admin' && role.canAccess === true
    );
  }
}));

export default useButtonStore; 