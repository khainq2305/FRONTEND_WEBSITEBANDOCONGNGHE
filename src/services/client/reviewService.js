import { API_ENDPOINT } from '../../config/apiEndpoints';
import { post, get } from '../common/crud';

const base = API_ENDPOINT.client.review.base;

export const reviewService = {
  create: (data) =>
    post(`${base}${API_ENDPOINT.client.review.create}`, data, {
      withCredentials: true
    }),

  getBySku: async (skuId, filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).reduce((acc, [k, v]) => {
        if (v !== null && v !== undefined) acc[k] = v;
        return acc;
      }, {})
    ).toString();

    const res = await get(`${base}${API_ENDPOINT.client.review.getBySku(skuId)}?${query}`);
    return Array.isArray(res?.data?.reviews) ? res.data.reviews : [];
  },

  /**
   * @description Kiểm tra xem người dùng hiện tại đã đánh giá SKU này chưa.
   * @param {string} skuId - ID của SKU cần kiểm tra.
   * @returns {Promise<Object>} Promise trả về object, ví dụ: { hasReviewed: boolean }.
   */
  checkUserReview: (skuId) => {
    // Gọi đến API GET /reviews/check/{skuId}
    // Giả định hàm `get` của bạn tự động xử lý credentials nếu đã cấu hình,
    // hoặc bạn có thể thêm `{ withCredentials: true }` nếu cần.
    return get(
        `${base}${API_ENDPOINT.client.review.check(skuId)}`, 
        { withCredentials: true }
    );
  }
};