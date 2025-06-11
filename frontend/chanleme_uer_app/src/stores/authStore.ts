// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { authService } from '@/api/userApi'; // 导入 authService

// 定义 RegisterDto 接口（这里简化了，实际应与后端 RegisterDto 严格匹配）
interface RegisterDto {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  userType: 'customer' | 'courier' | 'merchant'; // 根据后端实际枚举值
}

// 定义 LoginDto 接口
interface LoginDto {
  identifier: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null') as any,
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
    },
    setUser(user: any) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    },

    async login(loginData: LoginDto) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await authService.login(loginData);
        const { token, user } = response.data;
        this.setToken(token);
        this.setUser(user);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || '登录失败，请检查账号或密码。';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 处理用户注册逻辑
     * @param registerData 注册凭据
     */
    async register(registerData: RegisterDto) {
      this.isLoading = true;
      this.error = null; // 清空之前的错误
      try {
        const response = await authService.register(registerData);
        // 注册成功后，通常不会直接设置 token 或 user，而是提示用户去登录
        console.log('注册成功响应:', response.data);
        // 如果后端注册后直接返回 token 和 user，可以在这里设置
        // const { token, user } = response.data;
        // this.setToken(token);
        // this.setUser(user);
      } catch (err: any) {
        // 捕获 API 错误，将错误信息设置到 store 的 error 状态
        this.error = err.response?.data?.message || err.message || '注册失败，请检查输入或稍后再试。';
        throw err; // 抛出错误以便组件也能捕获
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.clearToken();
      this.clearUser();
    },
  },
});