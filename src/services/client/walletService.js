import { get, post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.wallet.base;

export const walletService = {
  // Lấy số dư và thông tin ví
  getWallet: () => get(`${base}`),

  // Lấy số dư ví (dự phòng)
  getBalance: () => get(`${base}${API_ENDPOINT.client.wallet.balance}`),

  // Lịch sử giao dịch
  getTransactions: () => get(`${base}${API_ENDPOINT.client.wallet.transactions}`),

  // Google Authenticator
  enableGoogleAuth: () => post(`${base}${API_ENDPOINT.client.wallet.enableGoogleAuth}`),
  verifyGoogleAuth: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyGoogleAuth}`, data),
  disableGa: (data) => post(`${base}${API_ENDPOINT.client.wallet.disableGa}`, data),

  // Xác minh thanh toán
  verifyPayment: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyPayment}`, data),
};
