// frontend/chanleme_merchant_app/src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'MerchantLogin',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'MerchantRegister',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'MerchantOrderManagement',
    component: () => import('@/views/OrderManagementPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dishes',
    name: 'DishManagement',
    component: () => import('@/views/DishManagementPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'MerchantProfile',
    component: () => import('@/views/Profile/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'MerchantEditProfile',
    component: () => import('@/views/Profile/EditProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/change-password',
    name: 'MerchantChangePassword',
    component: () => import('@/views/Profile/ChangePasswordPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*', // 404 catch-all 路由
    name: 'MerchantNotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // 未认证用户重定向到登录页
  } else if ((to.name === 'MerchantLogin' || to.name === 'MerchantRegister') && authStore.isAuthenticated) {
    next('/'); // 已认证用户访问登录注册页，重定向到首页
  } else {
    next();
  }
});

export default router;