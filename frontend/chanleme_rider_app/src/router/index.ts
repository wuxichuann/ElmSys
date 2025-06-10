import { createRouter, createWebHistory } from 'vue-router';
import CourierRegisterView from '../views/CourierRegisterView.vue';
import CourierLoginView from '../views/CourierLoginView.vue';
import CourierHomeView from '../views/CourierHomeView.vue'; // 假设骑手首页

const routes = [
  {
    path: '/',
    name: 'CourierHome',
    component: CourierHomeView,
  },
  {
    path: '/register',
    name: 'CourierRegister',
    component: CourierRegisterView,
  },
  {
    path: '/login',
    name: 'CourierLogin',
    component: CourierLoginView,
  },
  // 可以添加其他骑手端路由，例如受保护的订单列表
  // {
  //   path: '/orders',
  //   name: 'CourierOrders',
  //   component: () => import('../views/CourierOrdersView.vue'),
  //   meta: { requiresAuth: true }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局导航守卫 (与用户端类似，处理登录状态和路由保护)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('rider_jwt_token'); // 注意：使用不同的 key
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