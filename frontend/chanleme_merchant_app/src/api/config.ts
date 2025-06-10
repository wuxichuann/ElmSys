// frontend/chanleme_merchant_app/src/api/config.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // 假设商家端也有一个 authStore

const API_BASE_URL = 'http://localhost:3001/api'; // 后端API的基础URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：在每个请求中添加认证Token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token; // 从store获取token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理401未授权响应
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      // Token过期或无效，清空认证信息并重定向到登录页
      authStore.clearAuth();
      // 使用 router 实例进行跳转，这里需要确保 router 已导入
      // import router from '../router'; // 如果需要在这里直接跳转，需要导入
      // router.push('/login');
      console.warn('认证过期或无效，请重新登录。');
      alert('您的登录已过期，请重新登录。'); // 简单的用户提示
      // 如果你希望用户直接回到登录页，可以在这里添加 router.push('/login')
    }
    return Promise.reject(error);
  }
);

export default api;