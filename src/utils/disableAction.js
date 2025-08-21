// src/utils/permissions.js

/**
 * Kiểm tra user có permission cụ thể không
 * @param {Array} userPermissions - Danh sách permissions của user
 * @param {string} action - Action cần kiểm tra (create, read, update, delete...)
 * @param {string} subject - Subject cần kiểm tra (Post, User, Product...)
 * @returns {boolean}
 */
export const hasPermission = (userPermissions = [], action, subject) => {
    if (!userPermissions.length || !action || !subject) return false;
    
    return userPermissions.some(
      permission => permission.action === action && permission.subject === subject
    );
  };
  
  /**
   * Kiểm tra user có ít nhất 1 trong các permissions
   * @param {Array} userPermissions - Danh sách permissions của user  
   * @param {Array} requiredPermissions - Danh sách permissions cần kiểm tra [{action, subject}, ...]
   * @returns {boolean}
   */
  export const hasAnyPermission = (userPermissions = [], requiredPermissions = []) => {
    if (!userPermissions.length || !requiredPermissions.length) return false;
    
    return requiredPermissions.some(({ action, subject }) => 
      hasPermission(userPermissions, action, subject)
    );
  };
  
  /**
   * Kiểm tra user có tất cả permissions yêu cầu
   * @param {Array} userPermissions - Danh sách permissions của user
   * @param {Array} requiredPermissions - Danh sách permissions cần kiểm tra [{action, subject}, ...]
   * @returns {boolean}
   */
  export const hasAllPermissions = (userPermissions = [], requiredPermissions = []) => {
    if (!userPermissions.length || !requiredPermissions.length) return false;
    
    return requiredPermissions.every(({ action, subject }) => 
      hasPermission(userPermissions, action, subject)
    );
  };
  
  /**
   * Lấy tất cả subjects mà user có quyền với action cụ thể
   * @param {Array} userPermissions - Danh sách permissions của user
   * @param {string} action - Action cần tìm
   * @returns {Array} Danh sách subjects
   */
  export const getSubjectsByAction = (userPermissions = [], action) => {
    if (!userPermissions.length || !action) return [];
    
    return [...new Set(
      userPermissions
        .filter(permission => permission.action === action)
        .map(permission => permission.subject)
    )];
  };
  
  /**
   * Lấy tất cả actions mà user có quyền với subject cụ thể  
   * @param {Array} userPermissions - Danh sách permissions của user
   * @param {string} subject - Subject cần tìm
   * @returns {Array} Danh sách actions
   */
  export const getActionsBySubject = (userPermissions = [], subject) => {
    if (!userPermissions.length || !subject) return [];
    
    return [...new Set(
      userPermissions
        .filter(permission => permission.subject === subject)
        .map(permission => permission.action)
    )];
  };
  
  /**
   * Kiểm tra user có quyền trên action bất kỳ subject nào
   * @param {Array} userPermissions - Danh sách permissions của user
   * @param {string} action - Action cần kiểm tra
   * @returns {boolean}
   */
  export const hasActionOnAnySubject = (userPermissions = [], action) => {
    if (!userPermissions.length || !action) return false;
    
    return userPermissions.some(permission => permission.action === action);
  };