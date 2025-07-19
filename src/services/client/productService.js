import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud';
import { API_BASE_URL } from '../../constants/environment';

const base = API_ENDPOINT.client.product.base;
const productListBase = API_ENDPOINT.client.product.baseList;

export const productService = {
  getBySlug: (slug) => get(`${API_ENDPOINT.client.product.baseList}${API_ENDPOINT.client.product.getBySlug(slug)}`),
  getByCategory: (params = {}) => {
    const { slug, page = 1, limit = 20, brand = [], stock = false, priceRange = null, sort = 'popular' } = params;

    if (!slug) throw new Error('Missing slug in getByCategory');

    const query = { slug, page, limit };

    if (Array.isArray(brand) && brand.length > 0) {
      query.brand = brand.join(',');
    }

    if (stock === true) {
      query.stock = 'true';
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    if (sort) {
      query.sort = sort;
    }

    return get(productListBase, query);
  },
  getRelated: (categoryId, excludeProductId) => {
    return get(`${API_ENDPOINT.client.product.base}${API_ENDPOINT.client.product.getRelated()}`, {
      categoryId,
      excludeId: excludeProductId // TÊN PHẢI GIỐNG BÊN BACKEND NHẬN
    });
  },
   getCompareByIds: (ids = []) => {
    if (!ids.length) throw new Error('Thiếu danh sách ID sản phẩm để so sánh');
    // Sử dụng trực tiếp hàm đã định nghĩa trong API_ENDPOINT
    const path = API_ENDPOINT.client.product.getCompareByIds(ids);
    // Hàm 'get' của bạn có thể cần base URL hoặc nó tự xử lý
    // Nếu 'get' đã có base URL mặc định (ví dụ API_BASE_URL/api/...),
    // thì bạn chỉ cần truyền '/product/compare-ids?ids=...'
    // Nếu không, bạn cần nối thêm API_BASE_URL
    return get(`${API_BASE_URL}${path}`); // Giả định get cần full URL
  }
};
