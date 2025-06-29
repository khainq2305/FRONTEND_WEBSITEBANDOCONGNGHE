import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: `${API_BASE_URL}/admin/post-seo`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('=== REQUEST INTERCEPTOR DEBUG ===');
    console.log('Token from localStorage:', token ? `${token.substring(0, 50)}...` : 'null');
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token found - request will fail');
    }
    console.log('Final headers:', config.headers);
    console.log('==============================');
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPONSE INTERCEPTOR DEBUG ===');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data || {}));
    console.log('Response data:', response.data);
    console.log('================================');
    return response;
  },
  (error) => {
    console.error('=== RESPONSE ERROR DEBUG ===');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    console.error('==========================');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postSEOAPI = {
  // Get posts (with or without SEO data)
  getPosts: async (params = {}) => {
    try {
      console.log('Post SEO API: Getting posts with SEO data');
      const response = await api.get('/posts', { params });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  // Get all post SEO records
  getAllPostSEO: async (params = {}) => {
    try {
      console.log('Post SEO API: Getting all post SEO records');
      const response = await api.get('/', { params });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch post SEO records');
    }
  },

  // Get post SEO by ID
  getPostSEOById: async (id) => {
    try {
      console.log('Post SEO API: Getting post SEO by ID:', id);
      const response = await api.get(`/${id}`);
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch post SEO record');
    }
  },

  // Get post SEO by post ID
  getPostSEOByPostId: async (postId) => {
    try {
      console.log('Post SEO API: Getting post SEO by post ID:', postId);
      const response = await api.get(`/post/${postId}`);
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      // Return null if not found (new post without SEO data)
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch post SEO record');
    }
  },

  // Create new post SEO
  createPostSEO: async (postSEOData) => {
    try {
      console.log('Post SEO API: Creating post SEO:', postSEOData);
      const response = await api.post('/', postSEOData);
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create post SEO record');
    }
  },

  // Update post SEO
  updatePostSEO: async (id, postSEOData) => {
    try {
      console.log('Post SEO API: Updating post SEO:', id, postSEOData);
      const response = await api.put(`/${id}`, postSEOData);
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update post SEO record');
    }
  },

  // Delete post SEO
  deletePostSEO: async (id) => {
    try {
      console.log('Post SEO API: Deleting post SEO:', id);
      const response = await api.delete(`/${id}`);
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete post SEO record');
    }
  },

  // Analyze post SEO
  analyzePostSEO: async (postId, focusKeyword = '') => {
    try {
      console.log('Post SEO API: Analyzing post SEO:', postId, focusKeyword);
      const response = await api.post(`/analyze/${postId}`, { focusKeyword });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to analyze post SEO');
    }
  },

  // Alias for analyzePostSEO (for component compatibility)
  analyzePost: async (postId, options = {}) => {
    try {
      const focusKeyword = options.focusKeyword || '';
      console.log('Post SEO API: Analyzing post (alias):', postId, focusKeyword);
      const response = await api.post(`/analyze/${postId}`, { focusKeyword });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to analyze post SEO');
    }
  },

  // Bulk analyze posts
  bulkAnalyzePosts: async (postIds, focusKeyword = '') => {
    try {
      console.log('Post SEO API: Bulk analyzing posts:', postIds, focusKeyword);
      const response = await api.post('/bulk-analyze', { postIds, focusKeyword });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      console.error('Post SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to bulk analyze posts');
    }
  },

  // Get posts without SEO data
  getPostsWithoutSEO: async (params = {}) => {
    try {
      console.log('Post SEO API: Getting posts without SEO data');
      const response = await api.get('/posts-without-seo', { params });
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts without SEO data');
    }
  },

  // Get SEO statistics for posts
  getPostSEOStats: async () => {
    try {
      console.log('Post SEO API: Getting post SEO statistics');
      const response = await api.get('/stats');
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch post SEO statistics');
    }
  },

  // Alias for getPostSEOStats (for component compatibility)
  getStats: async () => {
    try {
      console.log('Post SEO API: Getting post SEO statistics (alias)');
      const response = await api.get('/stats');
      console.log('Post SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Post SEO API Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch post SEO statistics');
    }
  }
};

export default postSEOAPI;
