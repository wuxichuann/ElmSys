// frontend/chanleme_merchant_app/src/api/config.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // 确保这个 URL 正确
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 (可选，用于全局错误处理)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting to login...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('restaurantRegistered');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; // <-- 必须是 default 导出!