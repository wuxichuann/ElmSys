// 为了方便，这里直接定义 UserType，实际项目中可以考虑从共享的包中导入
export enum UserType {
  CUSTOMER = 'customer',
  COURIER = 'courier',
  RESTAURANT_ADMIN = 'restaurant_admin',
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  full_name: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  full_name: string;
  avatar_url?: string;
  default_address?: string;
  created_at: string;
  updated_at: string;
  // 商家管理员可能有的字段
  restaurantId?: number; // 后端JWT payload中会有
}