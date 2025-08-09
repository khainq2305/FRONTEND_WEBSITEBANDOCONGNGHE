// src/constants/socket.js
import { io } from 'socket.io-client';
import { API_BASE_URL } from './environment';

const socket = io(API_BASE_URL, {
  transports: ['websocket', 'polling'], // ưu tiên websocket, fallback polling
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
