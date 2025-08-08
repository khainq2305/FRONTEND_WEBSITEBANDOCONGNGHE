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

  // Gửi mã xác minh thiết lập PIN
  sendPinVerification: () => post(`${base}${API_ENDPOINT.client.wallet.sendPinVerification}`),

  // Trạng thái cooldown và khóa
  getWalletPinCooldown: () => get(`${base}${API_ENDPOINT.client.wallet.pinCooldown}`),

  // Xác minh mã token thiết lập PIN
  verifyPinToken: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyPinToken}`, data),

  // Thiết lập mã PIN
  setPin: (data) => post(`${base}${API_ENDPOINT.client.wallet.setPin}`, data),

  // Xác minh mã PIN và trả số dư
  verifyPinAndBalance: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyPinAndBalance}`, data),

  // ✅ Gửi mã xác minh để quên PIN
  sendForgotPin: () => post(`${base}${API_ENDPOINT.client.wallet.sendForgotPin}`),

  // ✅ Xác minh mã quên PIN
  verifyForgotPinToken: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyForgotPinToken}`, data),

  // ✅ Đặt lại mã PIN mới (sau khi xác minh quên PIN)
  resetPin: (data) => post(`${base}${API_ENDPOINT.client.wallet.resetPin}`, data),

  // ✅ Đổi mã PIN (yêu cầu mã cũ và mã mới)
  changePin: (data) => post(`${base}${API_ENDPOINT.client.wallet.changePin}`, data),
};
