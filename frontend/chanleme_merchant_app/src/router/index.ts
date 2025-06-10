// frontend/chanleme_merchant_app/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginPage from '../views/LoginPage.vue';
import RegisterRestaurantPage from '../views/RegisterRestaurantPage.vue';
import MerchantDashboardLayout from '../views/MerchantDashboardLayout.vue'; // 导入新的布局组件
import MenuItemManagementView from '../views/MenuItemManagementView.vue'; // 导入菜品管理页
import OrderManagementView from '../views/OrderManagementView.vue';     // 导入订单管理页

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login', // 默认重定向到登录页
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register-merchant-restaurant',
      component: RegisterRestaurantPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/merchant', // 商家后台主路由
      name: 'merchant-dashboard',
      component: MerchantDashboardLayout, // 使用布局组件
      redirect: '/merchant/menu-management', // 登录后默认跳转到菜品管理
      meta: { requiresAuth: true, requiresMerchant: true, requiresRestaurantRegistration: true },
      children: [
        {
          path: 'menu-management',
          name: 'menu-management',
          component: MenuItemManagementView,
          meta: { title: '菜品管理' }
        },
        {
          path: 'order-management',
          name: 'order-management',
          component: OrderManagementView,
          meta: { title: '订单管理' }
        },
        // 更多商家子路由...
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/login' // 对于未匹配的路径，重定向到登录页
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && localStorage.getItem('authToken')) {
    // await authStore.initializeAuth(); // 使用 await 确保初始化完成
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isMerchant = authStore.isMerchant;
  const restaurantRegistered = authStore.restaurantRegistered;

  // 如果访问登录或注册页，但用户已登录且是商家
   console.log('Auth Store State:');
  console.log('  isAuthenticated:', isAuthenticated);
  console.log('  isMerchant:', isMerchant);
  console.log('  restaurantRegistered:', restaurantRegistered);
  console.log('  User Type (from store):', authStore.user?.user_type); // 确认实际的用户类型
  // if ((to.name === 'login' || to.name === 'register-merchant-restaurant') && isAuthenticated && isMerchant) {
  //   if (!restaurantRegistered) {
  //       next('/register'); // 如果是商家且未注册餐厅，仍旧可以去注册
  //   } else {
  //       next('/merchant/menu-management'); // 否则，直接跳转到商家后台主页（菜品管理）
  //   }
  //   return;
  // }
  if ((to.name === 'login' || to.name === 'register-merchant-restaurant') && isAuthenticated && isMerchant) {
    console.log('Condition met: On login/register page, authenticated, and is merchant.');
    if (!restaurantRegistered) {
      console.log('  Restaurant NOT registered. Redirecting to /register');
      next('/register');
    } else {
      console.log('  Restaurant IS registered. Redirecting to /merchant/menu-management');
      next('/merchant/menu-management');
    }
    console.log('--- Router Guard End (Redirected) ---');
    return;
  }


  // 路由守卫：需要认证的商家路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login'); // 未认证，重定向到登录页
    } else if (!isMerchant) {
      // 认证但不是商家用户，可能需要更精确的错误提示或重定向到其他用户类型的页面
      console.warn('Unauthorized access: User is not a merchant.');
      next('/login');
    } else if (to.matched.some(record => record.meta.requiresRestaurantRegistration) && !restaurantRegistered) {
      next('/register'); // 如果目标路由需要餐厅注册但未注册，重定向到注册页
    } else {
      next(); // 已认证、是商家、且满足餐厅注册要求，放行
    }
  } else {
    // 不需要认证的路由（如登录页、统一注册页）
    next();
  }
});

export default router;