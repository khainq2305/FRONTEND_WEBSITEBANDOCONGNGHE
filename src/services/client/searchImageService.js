import axios from 'axios';
import { API_ENDPOINT } from '@/config/apiEndpoints';
import API from '../common/api';

export const searchImageService = {
  async searchByImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.search}`;

    // Tạo instance riêng biệt không có interceptor
    const plainAxios = axios.create({
      baseURL: '', // không dùng base mặc định
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const res = await plainAxios.post(url, formData);
    return res.data;
  },
  async searchByName(params) {
    // Nhận một object params thay vì chỉ 'name'
    const query = params.q?.trim();
    if (!query) throw new Error('Missing search query.');

    // Xây dựng URL với tất cả các tham số
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    if (params.inStock) queryParams.append('inStock', params.inStock); // Thêm inStock
    if (params.minPrice) queryParams.append('minPrice', params.minPrice); // Thêm minPrice
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice); // Thêm maxPrice
    if (params.brands && params.brands.length > 0) {
      queryParams.append('brands', params.brands); // mảng brands (ví dụ: 'Apple,Samsung')
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy); // Thêm sortBy (popular, asc, desc)

    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.name}?${queryParams.toString()}`;

    console.log('🔍 Gọi API searchByName (with filters) với URL:', url);
    const res = await axios.get(url);
    return res.data; // Mong đợi { similarProducts: [...] }
  },
  async searchSuggestions(query) {
    if (!query || query.length < 2) return []; // Không gửi request nếu query quá ngắn hoặc rỗng
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.suggestions}?q=${encodeURIComponent(query)}`;
    console.log('🔎 Gọi API searchSuggestions với URL:', url);
    try {
      const res = await axios.get(url);
      return res.data.suggestions || []; // Backend của bạn trả về { suggestions: [...] }
    } catch (error) {
      console.error('❌ Lỗi khi lấy gợi ý tìm kiếm:', error);
      return [];
    }
  },

   async getSearchHistory() {
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}`;
    console.log('📚 Gọi API lấy lịch sử tìm kiếm với URL:', url);
    try {
      const res = await API.get(url); // <--- THAY axios BẰNG API
      return res.data.history || [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy lịch sử tìm kiếm:', error);
      throw error;
    }
  },

  async addSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') {
      return;
    }
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}`;
    console.log('➕ Thêm vào lịch sử tìm kiếm:', keyword);
    try {
      await API.post(url, { keyword: keyword }); 
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào lịch sử tìm kiếm:', error);
    }
  },

  async deleteSearchHistoryItem(id) {
    const url = `${API_ENDPOINT.client.search.base}${API_ENDPOINT.client.search.history}/${id}`;
    console.log('🗑️ Xóa mục lịch sử tìm kiếm với ID:', id);
    try {
      await API.delete(url); // <--- THAY axios BẰNG API
    } catch (error) {
      console.error('❌ Lỗi khi xóa mục lịch sử tìm kiếm:', error);
      throw error;
    }
  }
};
