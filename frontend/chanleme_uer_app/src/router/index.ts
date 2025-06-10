import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // 引入认证 store

// 页面组件
import HomePage from '../views/HomePage.vue';
import RestaurantDetailPage from '../views/RestaurantDetailPage.vue';
import CartPage from '../views/CartPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import MyOrdersPage from '../views/MyOrdersPage.vue'; // 假设你希望用户能查看自己的订单

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: false }, // 首页不需要登录
  },
  {
    path: '/restaurants/:id',
    name: 'RestaurantDetail',
    component: RestaurantDetailPage,
    props: true, // 允许将路由参数作为 props 传递给组件
    meta: { requiresAuth: false }, // 餐厅详情页也不需要登录
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
    meta: { requiresAuth: true }, // 购物车需要登录
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: MyOrdersPage,
    meta: { requiresAuth: true }, // 我的订单需要登录
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresAuth: false },
  },
  // 重定向到首页或 404 页
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫：实现路由鉴权
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果路由需要认证但用户未登录，则跳转到登录页
    next({ name: 'Login' });
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    // 如果用户已登录但尝试访问登录或注册页，则跳转到首页
    next({ name: 'Home' });
  } else {
    next(); // 继续导航
  }
});

export default router;