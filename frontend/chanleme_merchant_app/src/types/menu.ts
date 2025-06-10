// export interface MenuItem {
//   id: number;
//   restaurant_id: number;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   image_url: string | null;
//   is_available: boolean; // 可售状态
//   created_at: string;
//   updated_at: string;
// }

// export interface CreateMenuItemDto {
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   image_url?: string; // 可选
// }

// export interface UpdateMenuItemDto {
//   name?: string;
//   description?: string;
//   price?: number;
//   category?: string;
//   image_url?: string;
//   is_available?: boolean;
// }
// src/types/menu.ts

/**
 * @interface MenuItem
 * @description 菜品的基础数据结构，对应后端数据库中的 `menu_items` 表。
 */
export interface MenuItem {
  item_id: number;
  restaurant_id: number;
  item_name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string; // 可选
  is_available: boolean;
  created_at: string; // ISO日期字符串
  updated_at: string; // ISO日期字符串
}

/**
 * @interface CreateMenuItemDto
 * @description 创建新菜品时请求体的数据结构。
 * 对应后端 `CreateMenuItemDto`。
 */
export interface CreateMenuItemDto {
  item_name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
}

/**
 * @interface UpdateMenuItemDto
 * @description 更新菜品时请求体的数据结构。
 * 对应后端 `UpdateMenuItemDto`。所有字段可选。
 */
export interface UpdateMenuItemDto {
  item_name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  is_available?: boolean;
}
