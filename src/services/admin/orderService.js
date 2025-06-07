// src/services/admin/orderService.js

import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

export const fetchOrders = async ({ page, limit, search, status }) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;

  // Ví dụ gọi tới: GET ${API_BASE_URL}/admin/order/list?page=1&limit=5&status=pending
  const res = await get(
    `${API_ENDPOINT.admin.order.base}${API_ENDPOINT.admin.order.list}`,
    params
  );
  return res.data; // { totalItems, totalPages, currentPage, data: [ ...orders ] }
};
