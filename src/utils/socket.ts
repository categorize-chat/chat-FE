import { io } from 'socket.io-client';

const socketUrl = `${import.meta.env.VITE_SOCK_URL}/chat`;

export const socket = io(socketUrl, {
  path: '/socket.io',
  withCredentials: true,
  secure: true,
  auth: { token: localStorage.getItem('accessToken') },
});
