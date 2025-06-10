import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // 导入 Pinia auth store

const API_BASE_URL = 'http://localhost:3001/api'; // 根据你的后端实际端口和路径修改

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 JWT Token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理全局错误（例如 401 Unauthorized）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('认证失败或令牌过期，将重定向到登录页...');
      const authStore = useAuthStore();
      authStore.logout(); // 清除本地 token 和用户信息
      // 可以在这里跳转到登录页，但为了避免循环依赖，通常在路由守卫或组件中处理
      // router.push('/login'); // 如果在 setup() 外，需要引入 router 实例
    }
    return Promise.reject(error);
  }
);

export default api;