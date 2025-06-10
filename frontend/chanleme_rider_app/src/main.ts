import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 导入骑手端路由

import axios from 'axios';

// 设置 Axios 基础 URL (与后端认证接口一致)
axios.defaults.baseURL = 'http://localhost:3001/api';

// 在每次请求前检查并添加 JWT token (使用骑手端的 key)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('rider_jwt_token'); // 使用骑手端的 key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 可选：添加 Axios 响应拦截器处理 401 错误
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token 过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('rider_jwt_token');
      localStorage.removeItem('rider_user_info');
      router.push('/login');
      alert('您的会话已过期，请重新登录骑手账号。');
    }
    return Promise.reject(error);
  }
);


createApp(App).use(router).mount('#app');