/**
 * URL normalization utilities cho SEO
 */

/**
 * Middleware để loại bỏ trailing slash từ URL
 */
export const removeTrailingSlash = () => {
  // Chỉ chạy trên client side
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  
  // Nếu URL có trailing slash và không phải root path
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    const newPath = currentPath.slice(0, -1);
    const newUrl = newPath + window.location.search + window.location.hash;
    
    // Redirect 301 bằng cách replace URL
    window.history.replaceState(null, '', newUrl);
  }
};

/**
 * Chuyển URL thành lowercase (trừ query parameters)
 */
export const normalizeUrlCase = () => {
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  const lowerPath = currentPath.toLowerCase();
  
  // Nếu path có chữ hoa
  if (currentPath !== lowerPath) {
    const newUrl = lowerPath + window.location.search + window.location.hash;
    window.history.replaceState(null, '', newUrl);
  }
};

/**
 * Validate và clean query parameters
 */
export const cleanQueryParams = () => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const cleanParams = new URLSearchParams();
  
  // Chỉ giữ lại các query parameters hợp lệ
  const allowedParams = ['page', 'sort', 'filter', 'q', 'category', 'brand', 'price'];
  
  urlParams.forEach((value, key) => {
    // Loại bỏ các params rỗng hoặc không hợp lệ
    if (value && value.trim() !== '' && allowedParams.includes(key.toLowerCase())) {
      cleanParams.append(key.toLowerCase(), value.trim());
    }
  });
  
  const newSearch = cleanParams.toString();
  const currentSearch = window.location.search.replace('?', '');
  
  if (newSearch !== currentSearch) {
    const newUrl = window.location.pathname + 
                   (newSearch ? '?' + newSearch : '') + 
                   window.location.hash;
    window.history.replaceState(null, '', newUrl);
  }
};

/**
 * Tổng hợp tất cả URL normalizations
 */
export const normalizeUrl = () => {
  removeTrailingSlash();
  normalizeUrlCase();
  cleanQueryParams();
};

/**
 * Hook để sử dụng trong React components
 */
export const useUrlNormalization = () => {
  React.useEffect(() => {
    normalizeUrl();
    
    // Lắng nghe thay đổi URL
    const handlePopState = () => {
      normalizeUrl();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};
