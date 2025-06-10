import { defineStore } from 'pinia';
import { User, LoginDto, RegisterDto, UserType } from '../types/auth';
import { authApi } from '../api';
import router from '../router'; // 引入 router 实例

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isCustomer: (state) => state.user?.user_type === UserType.CUSTOMER,
    isRestaurantAdmin: (state) => state.user?.user_type === UserType.RESTAURANT_ADMIN,
    isCourier: (state) => state.user?.user_type === UserType.COURIER,
  },
  actions: {
    async login(loginData: LoginDto) {
      this.isLoading = true;
      this.error = null;
      try {
        const { user, token } = await authApi.login(loginData);
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        router.push('/'); // 登录成功后跳转到首页
      } catch (err: any) {
        this.error = err.response?.data?.message || '登录失败';
        console.error('登录错误:', err);
        throw err; // 抛出错误以便组件捕获
      } finally {
        this.isLoading = false;
      }
    },
    async register(registerData: RegisterDto) {
      this.isLoading = true;
      this.error = null;
      try {
        const { user, token } = await authApi.register(registerData);
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        router.push('/'); // 注册成功后跳转到首页
      } catch (err: any) {
        this.error = err.response?.data?.message || '注册失败';
        console.error('注册错误:', err);
        throw err; // 抛出错误以便组件捕获
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login'); // 退出登录后跳转到登录页
    },
    initializeAuth() {
        // 在应用启动时调用，从 localStorage 恢复状态
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            this.user = JSON.parse(storedUser);
            this.token = storedToken;
        }
    }
  },
});