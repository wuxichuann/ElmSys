import { createRouter, createWebHistory } from 'vue-router';
import PortalHome from '../views/PortalHome.vue'; // 导入门户主页组件

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: PortalHome,
    },
    // 如果有其他门户页面，可以在这里添加更多路由
  ],
});

export default router;