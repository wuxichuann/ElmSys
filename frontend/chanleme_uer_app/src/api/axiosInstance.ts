// src/api/axiosInstance.ts
import axios from 'axios';

// 从环境变量中获取后端 API 基础 URL
// Vite 会将 VITE_ 开头的环境变量暴露给客户端代码
const API_BASE_URL = 'http://localhost:3001/api';


// **临时调试代码**
console.log('从 .env 文件读取到的 API_BASE_URL:', API_BASE_URL);
if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is NOT defined. Check your .env.development file and restart the dev server.');
} else if (!API_BASE_URL.startsWith('http')) {
  console.error('VITE_API_BASE_URL seems incorrect, it should start with http:// or https://');
}
// **临时调试代码结束**
// if (!API_BASE_URL) {
//   console.error('VITE_API_BASE_URL is not defined. Please check your .env.development file.');
// }

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // 设置所有请求的基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer YOUR_TOKEN_HERE' // 如果需要，可以在这里添加默认的认证头，或者在拦截器中动态添加
  },
});

// 请求拦截器：在发送请求前添加认证 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理 API 响应，例如统一的错误处理
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 示例：统一错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.status, error.response.data);
      // 可以根据 status 或 data.code 进行更细致的错误处理
      if (error.response.status === 401) {
        // 未授权，可能需要清除 token 并跳转到登录页
        // import router from '@/router';
        // import { useAuthStore } from '@/stores/authStore';
        // const authStore = useAuthStore();
        // authStore.logout();
        // router.push('/login');
      }
      return Promise.reject(error.response.data); // 将后端返回的错误信息抛出
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('网络错误，请检查您的网络连接。'));
    } else {
      // 其他错误
      console.error('Error:', error.message);
      return Promise.reject(new Error('请求失败，请稍后再试。'));
    }
  }
);

export default axiosInstance;