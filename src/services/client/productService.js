import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud';
import { API_BASE_URL } from '../../constants/environment';

const base = API_ENDPOINT.client.product.base;
const productListBase = API_ENDPOINT.client.product.baseList;

export const productService = {
getBySlug: (slug) => get(`${API_ENDPOINT.client.product.baseList}${API_ENDPOINT.client.product.getBySlug(slug)}`)
,
  getByCategory: (params = {}) => {
  const {
    slug,
    page = 1,
    limit = 20,
    brand = [],
    stock = false,
    priceRange = null,
    sort = 'popular'
  } = params;

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
    excludeId: excludeProductId, // TÊN PHẢI GIỐNG BÊN BACKEND NHẬN
  });
}


};
