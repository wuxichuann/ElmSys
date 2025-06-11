// src/types/auth.ts

export enum UserType {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  DELIVERY_DRIVER = 'delivery_driver',
  ADMIN = 'admin',
  RESTAURANT_ADMIN = 'restaurant_admin',
}

// 对应您提供的 backend/src/dto/auth/restaurant-data.dto.ts
export interface RestaurantDataDto { // 加上 export
  restaurant_name: string;
  description: string;
  address: string;
  phone_number: string;
  opening_hours: string;
}

// 对应您提供的 backend/src/dto/auth/register.dto.ts
export interface RegisterDto { // 加上 export
  username: string;
  password: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  full_name: string;
}

// 对应您提供的 backend/src/dto/auth/register-restaurant.dto.ts
export interface RegisterRestaurantDto { // 加上 export
  user: RegisterDto;
  restaurant: RestaurantDataDto;
}