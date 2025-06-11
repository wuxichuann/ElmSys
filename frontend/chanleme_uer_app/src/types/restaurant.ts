// src/types/restaurant.ts

// 餐厅详情接口
export interface RestaurantDetail {
  restaurant_id: string; // 后端通常用 ID 区分，这里可能是 number 或 string
  restaurant_name: string;
  description: string;
  address: string;
  phone_number: string; // 注意：下划线命名
  opening_hours: string; // 注意：下划线命名
  logo_url?: string;     // 注意：下划线命名，对应前端的 logo_url
  
  // 假设菜单项直接嵌套在餐厅详情里
  menu_items?: MenuItem[]; // 注意：下划线命名
  // ... 其他餐厅相关字段，请根据后端实际返回的数据补充
}

// 菜单项接口
export interface MenuItem {
  item_id: string; // 后端通常用 ID 区分，这里可能是 number 或 string
  item_name: string;
  description: string;
  price: number; // 确保价格是数字类型
  image_url?: string;  // 注意：下划线命名
  is_available: boolean; // 注意：下划线命名，是否可售
  restaurant_id: string; // 关联到餐厅的 ID
  // ... 其他菜单项相关字段，请根据后端实际返回的数据补充
}