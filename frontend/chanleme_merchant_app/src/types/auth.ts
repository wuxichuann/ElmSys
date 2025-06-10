// src/types/auth.ts

export enum UserType {
  ADMIN = 'admin',
  MERCHANT = 'restaurant_admin', // 后端是 RESTAURANT_ADMIN，前端简化为 MERCHANT
  CUSTOMER = 'customer',
}

// 对应后端 RegisterRestaurantDto 中的 user 部分
export interface RegisterUserPart {
  username: string;
  password: string;
  email: string;
  phone_number: string; // 后端 DTO 有 phone_number
}

// 对应后端 RegisterRestaurantDto 中的 restaurant 部分
export interface RegisterRestaurantPart {
  restaurant_name: string;
  description: string;
  address: string;
  phone_number: string; // 餐厅的电话号码
  opening_hours: string;
  logo_url?: string;
}

// 组合成完整的 RegisterRestaurantDto
export interface RegisterRestaurantDto {
  user: RegisterUserPart;
  restaurant: RegisterRestaurantPart;
}

export interface User {
  id: number; // user_id
  username: string;
  email: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
  phone_number?: string; // 用户手机号
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  // 后端返回的 user 对象中可能包含 restaurant_id 或 restaurant_name
  // 我们可以通过 user 对象来判断是否已注册餐厅
  restaurant_id?: number;
}