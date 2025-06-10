// export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'rejected';

// export interface OrderItem {
//   menu_item_id: number;
//   name: string;
//   quantity: number;
//   price: number;
// }

// export interface Order {
//   order_id: number;
//   customer_id: number;
//   customer_name: string;
//   customer_phone: string;
//   delivery_address: string;
//   total_amount: number;
//   status: OrderStatus;
//   payment_method: string; // 例如 'wechat_pay', 'alipay'
//   payment_status: 'paid' | 'unpaid';
//   items: OrderItem[];
//   notes: string | null;
//   placed_at: string;
//   accepted_at: string | null;
//   ready_at: string | null;
//   picked_up_at: string | null;
//   delivered_at: string | null;
//   rider_id: number | null;
//   rider_name: string | null;
// }

// export interface UpdateOrderStatusDto {
//   status: OrderStatus;
// }
// src/types/order.ts

/**
 * @enum AllowedRestaurantStatus
 * @description 商家可以手动更新的订单状态。
 * 对应后端 `AllowedRestaurantStatus` 枚举。
 */
export enum AllowedRestaurantStatus {
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
}

/**
 * @interface UpdateOrderStatusDto
 * @description 更新订单状态的请求体。
 * 对应后端 `UpdateOrderStatusDto`。
 */
export interface UpdateOrderStatusDto {
  status: AllowedRestaurantStatus;
}

/**
 * @interface OrderItem
 * @description 订单中的单个菜品项。
 */
export interface OrderItem {
  item_id: number;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  menu_items?: { // 嵌套的菜品详情
    item_name: string;
    image_url?: string;
  };
}

/**
 * @interface Order
 * @description 订单的完整数据结构，用于新订单、进行中订单和历史订单。
 */
export interface Order {
  order_id: number;
  customer_id: number;
  restaurant_id: number;
  courier_id?: number | null;
  delivery_address: string;
  total_amount: number;
  notes?: string | null;
  payment_method?: string | null;
  status: string; // 'placed', 'restaurant_confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
  payment_status: string;
  created_at: string;
  updated_at: string;
  estimated_delivery_at?: string | null;
  delivered_at?: string | null; // 历史订单会有

  // 关联信息
  order_items: OrderItem[];
  restaurants?: {
    restaurant_name: string;
    logo_url?: string;
    address?: string; // 取餐地址
    phone_number?: string;
  };
  users_orders_customer_idTousers?: { // 顾客信息
    full_name: string;
    phone_number: string;
    user_id?: number;
  };
  users_orders_courier_idTousers?: { // 骑手信息
    full_name: string;
    phone_number?: string;
    avatar_url?: string;
  };
}
