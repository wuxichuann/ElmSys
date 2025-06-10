// src/stores/auth.ts
import { defineStore } from 'pinia';
import { authApi } from '../api';
import router from '../router';
import { LoginResponse, User, RegisterRestaurantDto, UserType } from '../types/auth'; 

// 定义 AuthState 接口来明确 state 的类型
// 确保 User 接口的定义也正确，包含 user_type
interface AuthState {
  token: string | null;
  user: User | null;
  restaurantRegistered: boolean;
  loading: boolean;
  error: string | null;
}

// 定义一个安全的 JSON.parse 函数
function safeJSONParse<T>(jsonString: string | null): T | null {
  if (jsonString === null || jsonString === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON from localStorage:', e, 'String:', jsonString);
    localStorage.removeItem('authUser');
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  // 明确 state 的类型为 AuthState
  state: (): AuthState => {
    const userString = localStorage.getItem('authUser');
    const parsedUser = safeJSONParse<User>(userString);

    return {
      token: localStorage.getItem('authToken') || null,
      user: parsedUser,
      restaurantRegistered: localStorage.getItem('restaurantRegistered') === 'true', 
      loading: false,
      error: null as string | null,
    };
  },
  getters: {
    // 为 state 参数明确类型，虽然 Pinia 通常能正确推断
    isAuthenticated: (state: AuthState): boolean => !!state.token && !!state.user,
    isMerchant: (state: AuthState): boolean => state.user?.user_type === UserType.MERCHANT,
    
    // !!! 核心修改：在 getter 中访问其他 getter 时使用 `this` !!!
    // 明确指定返回类型 `boolean`
    isMerchantAndRestaurantRegistered(state: AuthState): boolean {
      return this.isAuthenticated && this.isMerchant && state.restaurantRegistered;
    },
  },
  
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('authToken', token);
    },
    setUser(user: User | null) {
      this.user = user;
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('authUser');
      }
    },
    setRestaurantRegistered(status: boolean) {
      this.restaurantRegistered = status;
      localStorage.setItem('restaurantRegistered', String(status));
    },

    async login(credentials: any) {
      this.loading = true;
      this.error = null;
      try {
        console.log('1. Starting login process with credentials:', credentials);
        const response: any = await authApi.login(credentials); // 暂时使用 any 来避免 LoginResponse 类型检查问题
        console.log('2. Login API call successful. Raw Response:', response); 

        // !!! 确保 response.data 存在且包含 token 和 user !!!
        if (!response.data || typeof response.data.token === 'undefined' || typeof response.data.user === 'undefined') {
            throw new Error('Login response data is missing token or user.');
        }

        const { token, user } = response.data; 

        this.setToken(token); 
        this.setUser(user); 
        this.setRestaurantRegistered(true); 

        router.push('/merchant/menu-management'); 
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || '登录失败，请检查用户名和密码。';
        console.error('Login error:', err);
        return false;
      } finally {
        this.loading = false;
        console.log('8. Login process finished. Loading status:', this.loading);
      }
    },

    async registerMerchantAndRestaurant(registerData: RegisterRestaurantDto) {
      this.loading = true;
      this.error = null;
      try {
        const response: LoginResponse = await authApi.registerRestaurantAdmin(registerData);
        this.setToken(response.token);
        this.setUser(response.user);
        this.setRestaurantRegistered(true); 

        this.error = null; 
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || '注册失败，请重试。';
        console.error('Register error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.setToken('');
      this.setUser(null);
      this.setRestaurantRegistered(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('restaurantRegistered');
      router.push('/login');
    },
  },
});