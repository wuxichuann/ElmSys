// frontend/chanleme_merchant_app/src/api/auth.ts
import api from './config';
import { LoginDto, RegisterRestaurantDto, AuthResponse } from '../types/auth'; // 导入必要的类型

class AuthApi {
  /**
   * 商家登录
   * @param credentials 登录凭据 (username, password)
   * @returns AuthResponse (token, user)
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * 商家注册 (注册一个新餐厅管理员账号)
   * @param data 注册信息 (包含用户信息和餐厅信息)
   * @returns AuthResponse (token, user)
   */
  async registerRestaurant(data: RegisterRestaurantDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/restaurant', data);
    return response.data;
  }
}

export const authApi = new AuthApi();