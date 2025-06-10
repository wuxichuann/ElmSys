// src/types/restaurant.ts

import { MenuItem } from './menu'; // 引入 MenuItem 类型，因为餐厅详情会包含菜单

/**
 * @interface RestaurantListItem
 * @description 用于餐厅列表展示的精简信息。
 */
export interface RestaurantListItem {
  restaurant_id: number;
  restaurant_name: string;
  description: string;
  address: string;
  logo_url?: string; // 可选
  opening_hours: string;
}

/**
 * @interface RestaurantDetail
 * @description 单个餐厅的完整详细信息，包括其可售菜单。
 */
export interface RestaurantDetail extends RestaurantListItem {
  // 可以添加其他详细信息，例如：
  owner_user_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  menu_items: MenuItem[]; // 包含该餐厅的可售菜单项
}

/**
 * @interface SearchRestaurantDto
 * @description 搜索餐厅时请求查询参数的 DTO。
 */
export interface SearchRestaurantDto {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}
