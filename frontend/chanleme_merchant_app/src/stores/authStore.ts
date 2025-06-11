// frontend/chanleme_merchant_app/src/stores/authStore.ts
import { defineStore } from 'pinia';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  // ... 其他用户和商家相关信息
}

export const useAuthStore = defineStore('merchantAuth', {
  state: () => ({
    token: localStorage.getItem('merchant_token') || null, // 商家端使用 'merchant_token'
    user: null as UserProfile | null, // 存储商家用户信息
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentMerchantUser: (state) => state.user,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('merchant_token', token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('merchant_token');
      this.user = null;
    },
    setUser(user: UserProfile) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});