// src/services/recommendationService.js

import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

// Đặt base URL cho tất cả route liên quan đến recommendation
const base = API_ENDPOINT.client.recommendation.base;

export const recommendationService = {
  /**
   * Lấy danh sách sản phẩm gợi ý cho người dùng.
   * @param {number} userId - ID người dùng.
   * @param {number|null} currentProductId - ID sản phẩm hiện tại (nếu có).
   * @returns {Promise<Array>} Danh sách sản phẩm gợi ý.
   */
  getRecommendations: async (userId, currentProductId = null) => {
  const url = `${base}${API_ENDPOINT.client.recommendation.get(userId, currentProductId)}`;
  const response = await get(url);

  console.log("DEBUG_SERVICE: Raw API response", response);

  // ✅ Lấy response.data.recommendations thay vì response.recommendations
  if (response?.data && Array.isArray(response.data.recommendations)) {
    return response.data.recommendations;
  }

  console.warn("WARN_SERVICE: Response không chứa 'recommendations'", response);
  return []; // fallback an toàn
}


  // TODO: Thêm các hàm khác như trackClick, logView nếu backend có
};
