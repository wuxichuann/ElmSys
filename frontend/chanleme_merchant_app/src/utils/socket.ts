// frontend/chanleme_merchant_app/src/utils/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const setupSocketConnection = (token: string) => {
  if (socket && socket.connected) {
    console.log('Socket already connected.');
    return;
  }
  // 确保这里的 URL 和端口与后端 Socket.IO 服务一致
  // 例如，如果后端 API 是 3001，Socket.IO 也可能运行在 3001
  socket = io('http://localhost:3001', {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
        // 通常是服务器主动断开，例如 token 过期
        // 这里可以考虑触发重新登录或提示
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  // 其他事件监听在 OrderStore 中处理，这里只负责连接
  // 例如： socket.on('newOrder', (orderData) => { /* 转发到 store */ });
  // 这部分逻辑已移至 MerchantDashboardLayout.vue
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected from server.');
  }
};

export const getSocket = () => {
  return socket;
};