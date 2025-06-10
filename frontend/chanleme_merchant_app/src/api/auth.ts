// frontend/chanleme_merchant_app/src/api/auth.ts
import api from './index'; // 这里依然需要从 index.ts 导入 default 导出的 axios 实例
import { LoginResponse, RegisterRestaurantDto } from '../types/auth';
import { Restaurant } from '../types/restaurant';

export const auth = { // 保持具名导出 auth 对象
  login: (credentials: any): Promise<LoginResponse> => {
    return api.post('/auth/login', credentials);
  },
  registerRestaurantAdmin: (data: RegisterRestaurantDto): Promise<LoginResponse> => {
    return api.post('/auth/register/restaurant', data).then(res => res.data);
  },
  getMerchantRestaurant: (): Promise<Restaurant | null> => {
    return api.get('/merchant/restaurant').then(response => response.data).catch(() => null);
  },
};