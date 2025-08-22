import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: `${API_BASE_URL}/admin/seo`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const seoAPI = {
  // Analyze URL
  analyzeURL: async (url, focusKeyword = '') => {
    try {
      console.log('SEO API: Analyzing URL:', url);
      console.log('SEO API: Focus keyword:', focusKeyword);
      const response = await api.post('/analyze', { url, focusKeyword });
      console.log('SEO API: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('SEO API Error:', error);
      console.error('SEO API Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to analyze URL');
    }
  },

  // Bulk analyze URLs
  bulkAnalyze: async (urls, focusKeyword = '') => {
    try {
      const response = await api.post('/bulk-analyze', { urls, focusKeyword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Bulk analysis failed');
    }
  },

  // Get SEO reports
  getReports: async (params = {}) => {
    try {
      const response = await api.get('/reports', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reports');
    }
  },

  // Get single SEO report
  getReport: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch report');
    }
  },

  // Delete SEO report
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
  },

  // Get SEO statistics
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  // Get SEO configuration
  getConfig: async () => {
    try {
      const response = await api.get('/config');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch configuration');
    }
  },

  // Update SEO configuration
  updateConfig: async (config) => {
    try {
      const response = await api.put('/config', config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update configuration');
    }
  },

  // Generate sitemap
  generateSitemap: async () => {
    try {
      const response = await api.get('/sitemap.xml', {
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate sitemap');
    }
  },

  // Export reports
  exportReports: async (format = 'csv') => {
    try {
      const response = await api.get('/export', {
        params: { format },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `seo-reports.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, message: 'Reports exported successfully' };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to export reports');
    }
  }
};

export default seoAPI;
