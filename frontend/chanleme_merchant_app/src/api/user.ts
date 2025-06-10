// src/types/user.ts

/**
 * @interface UserProfile
 * @description 用户个人资料的基础数据结构，对应后端 `getUserProfile` 返回的数据。
 */
export interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  phone_number: string;
  user_type: string; // 'customer', 'courier', 'restaurant_admin'
  full_name: string;
  avatar_url?: string | null;
  default_address?: string | null; // 仅对 'customer' 类型用户有效
  created_at: string; // ISO日期字符串
}

/**
 * @interface UpdateUserProfileDto
 * @description 更新用户个人资料时请求体的数据结构。
 * 对应后端 `UpdateUserProfileDto`。
 */
export interface UpdateUserProfileDto {
  full_name?: string;
  avatar_url?: string;
  default_address?: string;
  email?: string;
  phone_number?: string;
}

/**
 * @interface ChangePasswordDto
 * @description 修改密码时请求体的数据结构。
 * 对应后端 `ChangePasswordDto`。
 */
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
