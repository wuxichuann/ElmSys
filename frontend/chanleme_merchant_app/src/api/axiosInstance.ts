// frontend/chanleme_merchant_app/src/api/axiosInstance.ts
import axios from 'axios';
import { useRouter } from 'vue-router'; // 引入 useRouter 用于路由跳转

// 从环境变量读取后端API地址，默认为 /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建一个带有认证功能的Axios实例
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 请求超时时间
});

// 请求拦截器：在每次请求前，如果存在token，则添加到Authorization头
authAxios.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token，也可以从 Pinia store 获取
    const token = localStorage.getItem('merchant_token'); // 商家端使用 'merchant_token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理全局错误（如401 Unauthorized）
authAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API 错误:', error.response.status, error.response.data);
      // 示例：如果401，则重定向到登录页
      if (error.response.status === 401) {
        console.error('未授权，重定向到登录页...');
        localStorage.removeItem('merchant_token'); // 清除无效 token
        // 注意：这里需要延迟导入 router，因为在 setup 之外调用 useRouter() 会报错
        // 实际应用中，你可能需要一个全局的错误处理机制或在 App.vue 中监听 401 状态
        // 简化处理：直接刷新页面或引导用户手动登录
        window.location.href = '/login'; // 或者使用 router.push('/login')
      }
      // 可以根据后端返回的错误结构，提取并抛出更友好的错误信息
      return Promise.reject(error.response.data?.message || error.message);
    } else if (error.request) {
      console.error('网络错误:', error.request);
      return Promise.reject('网络错误，请检查您的网络连接');
    } else {
      console.error('错误:', error.message);
      return Promise.reject('请求发送失败');
    }
  }
);

export default authAxios;

// 对于不需要认证的请求，可以单独导出
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});