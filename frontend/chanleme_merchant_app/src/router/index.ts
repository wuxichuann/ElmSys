import { createRouter, createWebHistory } from 'vue-router';
import MerchantRegisterView from '../views/MerchantRegisterView.vue';
import MerchantLoginView from '../views/MerchantLoginView.vue';
import MerchantHomeView from '../views/MerchantHomeView.vue'; // 假设商家首页

const routes = [
  {
    path: '/',
    name: 'MerchantHome',
    component: MerchantHomeView,
  },
  {
    path: '/register',
    name: 'MerchantRegister',
    component: MerchantRegisterView,
  },
  {
    path: '/login',
    name: 'MerchantLogin',
    component: MerchantLoginView,
  },
  // 可以添加其他商家端路由，例如受保护的仪表板
  // {
  //   path: '/dashboard',
  //   name: 'MerchantDashboard',
  //   component: () => import('../views/MerchantDashboardView.vue'),
  //   meta: { requiresAuth: true }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局导航守卫 (与用户端类似，处理登录状态和路由保护)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('merchant_jwt_token'); // 注意：使用不同的 key
  const publicPages = ['/login', '/register', '/'];

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }
  
  if (token && publicPages.includes(to.path) && to.path !== '/') {
    return next('/');
  }

  next();
});

export default router;