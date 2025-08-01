import api from '../common/api';

// Service để lấy SEO config từ public endpoint
export const publicSeoService = {
  // Lấy SEO config từ public endpoint (không cần auth)
  getConfig: async () => {
    try {
      const response = await api.get('/api/seo/config');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public SEO config:', error);
      throw error;
    }
  }
};

export default publicSeoService;
