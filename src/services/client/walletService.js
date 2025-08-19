import { get, post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.wallet.base;

export const walletService = {

  getWallet: () => get(`${base}`),

  
  getBalance: () => get(`${base}${API_ENDPOINT.client.wallet.balance}`),
  getTransactions: () => get(`${base}${API_ENDPOINT.client.wallet.transactions}`),
 requestWithdrawal: (data) => post(`${base}${API_ENDPOINT.client.wallet.withdrawals}`, data),
  getWithdrawals: () => get(`${base}${API_ENDPOINT.client.wallet.withdrawalList}`),
  enableGoogleAuth: () => post(`${base}${API_ENDPOINT.client.wallet.enableGoogleAuth}`),
  verifyGoogleAuth: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyGoogleAuth}`, data),
  disableGa: (data) => post(`${base}${API_ENDPOINT.client.wallet.disableGa}`, data),
  verifyPayment: (data) => post(`${base}${API_ENDPOINT.client.wallet.verifyPayment}`, data),
};
