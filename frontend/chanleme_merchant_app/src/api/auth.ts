// // frontend/chanleme_merchant_app/src/api/auth.ts
// // import api from './index'; // 这里依然需要从 index.ts 导入 default 导出的 axios 实例
// import apiClient from './config';
// import { LoginResponse, RegisterRestaurantDto } from '../types/auth';
// import { Restaurant } from '../types/restaurant';

// export const auth = { // 保持具名导出 auth 对象
//   login: (credentials: any): Promise<LoginResponse> => {
//     return api.post('/auth/login', credentials);
//   },
//   registerRestaurantAdmin: (data: RegisterRestaurantDto): Promise<LoginResponse> => {
//     return api.post('/auth/register/restaurant', data).then(res => res.data);
//   },
//   getMerchantRestaurant: (): Promise<Restaurant | null> => {
//     return api.get('/merchant/restaurant').then(response => response.data).catch(() => null);
//   },
// };

// src/api/auth.ts
import apiClient from './config'; // Corrected: Import apiClient directly from config.ts

import { LoginDto } from '../types/auth';
import { RegisterDto, RegisterRestaurantDto } from '../types/auth';
import { User } from '../types/auth'; // Assuming User type is defined in types/auth.ts

/**
 * @function loginApi
 * @description Handles user login.
 * @param {LoginDto} data - User login credentials.
 * @returns {Promise<{ user: User, token: string }>} Logged-in user data and JWT.
 */
export const loginApi = async (data: LoginDto): Promise<{ user: User, token: string }> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

/**
 * @function registerApi
 * @description Handles general user registration (customer, courier).
 * @param {RegisterDto} data - User registration data.
 * @returns {Promise<{ user: User, token: string }>} Registered user data and JWT.
 */
export const registerApi = async (data: RegisterDto): Promise<{ user: User, token: string }> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * @function registerRestaurantApi
 * @description Handles restaurant admin registration and restaurant creation.
 * @param {RegisterRestaurantDto} data - Restaurant admin and restaurant data.
 * @returns {Promise<{ user: User, token: string }>} Registered restaurant admin user data and JWT.
 */
export const registerRestaurantApi = async (data: RegisterRestaurantDto): Promise<{ user: User, token: string }> => {
  const response = await apiClient.post('/auth/register/restaurant', data);
  return response.data;
};
