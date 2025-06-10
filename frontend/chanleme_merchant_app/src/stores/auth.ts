// frontend/chanleme_merchant_app/src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, AuthResponse } from '../types/auth';
import { authApi } from '../api'; // 导入 authApi

export const useAuthStore = defineStore('merchantAuth', () => {
  const token = ref<string | null>(localStorage.getItem('merchant_auth_token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('merchant_auth_user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);
  const isMerchantAdmin = computed(() => user.value?.user_type === 'restaurant_admin');
  const restaurantId = computed(() => user.value?.restaurantId); // 商家用户特有的 restaurantId

  const setAuth = (authData: AuthResponse) => {
    token.value = authData.token;
    user.value = authData.user;
    localStorage.setItem('merchant_auth_token', authData.token);
    localStorage.setItem('merchant_auth_user', JSON.stringify(authData.user));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('merchant_auth_token');
    localStorage.removeItem('merchant_auth_user');
  };

  // 登录动作
  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      setAuth(response);
      return true; // 登录成功
    } catch (error) {
      console.error('商家登录失败:', error);
      clearAuth();
      throw error; // 抛出错误以便组件处理
    }
  };

  // 注册动作
  const register = async (registerData: any) => { // 实际类型应该是 RegisterRestaurantDto
    try {
      const response = await authApi.registerRestaurant(registerData);
      setAuth(response);
      return true; // 注册成功
    } catch (error) {
      console.error('商家注册失败:', error);
      clearAuth();
      throw error;
    }
  };

  // 登出动作
  const logout = () => {
    clearAuth();
    // 可以在这里添加重定向到登录页的逻辑，例如 router.push('/login')
  };

  return {
    token,
    user,
    isAuthenticated,
    isMerchantAdmin,
    restaurantId,
    setAuth,
    clearAuth,
    login,
    register,
    logout,
  };
});