import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del } from '../common/crud';

export const seoService = {
  // SEO Config methods
  async getSEOConfig() {
    return get(API_ENDPOINT.admin.seo.config);
  },

  async updateSEOConfig(configData) {
    return put(API_ENDPOINT.admin.seo.config, configData);
  },

  // SEO Reports methods
  async getSEOReports(params = {}) {
    return get(API_ENDPOINT.admin.seo.reports, params);
  },

  async getSEOReport(id) {
    return get(`${API_ENDPOINT.admin.seo.reports}/${id}`);
  },

  async createSEOReport(reportData) {
    return post(API_ENDPOINT.admin.seo.reports, reportData);
  },

  async updateSEOReport(id, reportData) {
    return put(`${API_ENDPOINT.admin.seo.reports}/${id}`, reportData);
  },

  async deleteSEOReport(id) {
    return del(`${API_ENDPOINT.admin.seo.reports}/${id}`);
  }
};

export const postSEOService = {
  // Post SEO methods
  async getAllPostSEO(params = {}) {
    return get(API_ENDPOINT.admin.postSEO.base, params);
  },

  async getPostsWithSEO(params = {}) {
    return get(API_ENDPOINT.admin.postSEO.posts, params);
  },

  async getPostsWithoutSEO(params = {}) {
    return get(API_ENDPOINT.admin.postSEO.postsWithoutSEO, params);
  },

  async getPostSEOById(id) {
    return get(`${API_ENDPOINT.admin.postSEO.base}/${id}`);
  },

  async getPostSEOByPostId(postId) {
    return get(`${API_ENDPOINT.admin.postSEO.base}/post/${postId}`);
  },

  async createPostSEO(seoData) {
    return post(API_ENDPOINT.admin.postSEO.base, seoData);
  },

  async updatePostSEO(id, seoData) {
    return put(`${API_ENDPOINT.admin.postSEO.base}/${id}`, seoData);
  },

  async deletePostSEO(id) {
    return del(`${API_ENDPOINT.admin.postSEO.base}/${id}`);
  },

  async analyzePostSEO(postId, focusKeyword = '') {
    return post(`${API_ENDPOINT.admin.postSEO.base}/analyze/${postId}`, {
      focusKeyword
    });
  },

  async bulkAnalyzePosts(postIds) {
    return post(`${API_ENDPOINT.admin.postSEO.base}/bulk-analyze`, {
      postIds
    });
  },

  async getSEOStats() {
    return get(API_ENDPOINT.admin.postSEO.stats);
  }
};
