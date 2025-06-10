// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router'; // 导入路由

// import axios from 'axios';

// // 设置 Axios 基础 URL
// axios.defaults.baseURL = 'http://localhost:3001/api'; // 后端 API 的基础地址

// // 在每次请求前检查并添加 JWT token
// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('jwt_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// // 可选：添加 Axios 响应拦截器处理 401 错误
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Token 过期或无效，清除本地存储并重定向到登录页
//       localStorage.removeItem('jwt_token');
//       localStorage.removeItem('user_info');
//       router.push('/login');
//       alert('您的会话已过期，请重新登录。');
//     }
//     return Promise.reject(error);
//   }
// );


// createApp(App).use(router).mount('#app');
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth'; // 引入 auth store

import './styles/index.css'; // 全局样式

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // 注册 Pinia

// 在挂载应用前，从 localStorage 恢复认证状态
// 这确保了在任何组件或路由守卫访问 store 之前，状态是最新的
const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router); // 注册 Vue Router

app.mount('#app');