import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, put } from '@/services/common/crud';

const base = API_ENDPOINT.admin.reviews.base;

export const reviewService = {
  list: (params) => {
    const url = `${base}/list`;
    return get(url, params);
  },

  getAll: (params) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.getAll}`;
    return get(url, params);
  },

  // Lấy review theo productId (chi tiết theo SKU)
  getAllByProductId: (productId, params) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.getAllByProductId(productId)}`;
    return get(url, params);
  },

  // Lấy tổng quan đánh giá (tổng số sao, tổng comment mỗi sản phẩm)
  getCommentSummary: (params) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.getSummary}`;
    return get(url, params);
  },

  // Gửi phản hồi cho 1 đánh giá
  reply: (reviewId, data) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.reply(reviewId)}`;
    return put(url, data);
  }
};
