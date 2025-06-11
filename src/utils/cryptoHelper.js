// cryptoHelper.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_AUTH_ENCRYPTION_KEY // nên để trong biến môi trường `.env`

export const encrypt = (data) => {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedStr);
};
