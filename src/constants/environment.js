export const API_BASE_URL = 'http://localhost:5000';

// Frontend public URL - có thể cấu hình theo environment
export const FRONTEND_PUBLIC_URL = import.meta.env.VITE_FRONTEND_PUBLIC_URL || 'http://localhost:9999';

// Helper function để tạo URL xem bài viết
export const getArticleViewUrl = (slug) => `${FRONTEND_PUBLIC_URL}/tin-tuc/${slug}`;
