import { API_ENDPOINT } from '@/config/apiEndpoints';
import API from '../common/api'; // axios instance đã cấu hình baseURL + interceptor JWT

export const searchImageService = {
 // 🔍 Tìm kiếm bằng hình ảnh
async searchByImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.search}`;
  
  // 🚀 Debug log
  console.log("📸 [searchByImage] URL gọi:", url);
  console.log("📸 [searchByImage] File gửi:", file?.name || file);

  try {
    const res = await API.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("📸 [searchByImage] Kết quả trả về:", res.data);
    return res.data; // { similarProducts: [...] }
  } catch (error) {
    console.error('❌ [searchByImage] Lỗi:', error?.response?.data || error.message);
    throw error;
  }
},

  // 🔍 Tìm kiếm bằng tên (text search + filter)
  async searchByName(params) {
    const query = params.q?.trim();
    if (!query) throw new Error('Thiếu từ khóa tìm kiếm.');

    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    if (params.inStock) queryParams.append('inStock', params.inStock);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.brands && params.brands.length > 0) {
      queryParams.append('brands', params.brands.join(',')); // mảng brand
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.name}?${queryParams.toString()}`;
    console.log('🔍 Gọi API searchByName:', url);

    try {
      const res = await API.get(url);
      return res.data; // { similarProducts: [...] }
    } catch (error) {
      console.error('❌ Lỗi searchByName:', error);
      throw error;
    }
  },

  // 🔎 Gợi ý tìm kiếm
  async searchSuggestions(query) {
    if (!query || query.length < 2) return [];

    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.suggestions}?q=${encodeURIComponent(query)}`;
    console.log('🔎 Gọi API searchSuggestions:', url);

    try {
      const res = await API.get(url);
      return res.data.suggestions || [];
    } catch (error) {
      console.error('❌ Lỗi searchSuggestions:', error);
      return [];
    }
  },

  // 📚 Lịch sử tìm kiếm
  async getSearchHistory() {
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}`;
    console.log('📚 Gọi API getSearchHistory:', url);

    try {
      const res = await API.get(url);
      return res.data.history || [];
    } catch (error) {
      console.error('❌ Lỗi getSearchHistory:', error);
      return [];
    }
  },

  // ➕ Thêm vào lịch sử
  async addSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') return;

    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}`;
    console.log('➕ Thêm searchHistory:', keyword);

    try {
      await API.post(url, { keyword });
    } catch (error) {
      console.error('❌ Lỗi addSearchHistory:', error);
    }
  },

  // 🗑️ Xóa lịch sử
  async deleteSearchHistoryItem(id) {
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}/${id}`;
    console.log('🗑️ Xóa searchHistory ID:', id);

    try {
      await API.delete(url);
    } catch (error) {
      console.error('❌ Lỗi deleteSearchHistoryItem:', error);
    }
  }
};
