// src/api/userApi.ts
import axiosInstance from './axiosInstance'; // 确保导入了 axiosInstance

// ===========================================
// 用户认证相关接口和服务
// ===========================================

// 定义后端 LoginDto 和 RegisterDto 接口
export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  password: string;
  userType: string; // 'customer', 'courier', 'merchant'
}

// 假设后端返回的用户信息接口
export interface User {
  id: string; // 后端可能返回 UUID 字符串
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  userType: string;
  default_address?: string; // 根据 CartPage.vue 中的使用添加
  avatar_url?: string;
  // ... 其他用户字段
}

// 假设登录成功返回的数据结构
export interface LoginResponse {
  token: string;
  user: User;
}

// 认证相关的 API 服务
export const authService = {
  login(data: LoginDto) {
    return axiosInstance.post<LoginResponse>('/auth/login', data);
  },
  register(data: RegisterDto) {
    return axiosInstance.post('/auth/register', data);
  },
  getProfile() {
    return axiosInstance.get<User>('/users/profile');
  },
  updateProfile(data: Partial<User>) { // Partial 表示部分更新
    return axiosInstance.patch<User>('/users/profile', data);
  },
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return axiosInstance.patch('/users/change-password', data);
  }
};

// ===========================================
// 餐厅相关接口和服务
// ===========================================

// 餐厅详情接口，根据之前讨论和使用情况进行修正
export interface Restaurant {
  restaurant_id: number;   // 确保 ID 类型和名称与后端一致
  restaurant_name: string; // 确保名称与后端一致，解决 CartPage.vue 报错
  description: string;
  address: string;
  opening_hours: string;   // 修正为 opening_hours
  logo_url?: string;       // 修正为 logo_url
  phone_number: string;
  // ... 其他可能的餐厅字段
}

export interface SearchRestaurantParams {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  // ... 其他可能的筛选参数
}

export const restaurantService = {
  // getRestaurants 返回餐厅列表，假设后端直接返回 Restaurant[] 数组
  getRestaurants(params?: SearchRestaurantParams) {
    return axiosInstance.get<Restaurant[]>('/restaurants', { params });
  },
  // getRestaurantById 根据 ID 获取单个餐厅详情，ID 类型为 number
  getRestaurantById(id: number) { // 修正 ID 类型为 number
    return axiosInstance.get<Restaurant>(`/restaurants/${id}`);
  }
  // ... 其他餐厅相关 API
};

// ===========================================
// 订单相关接口和服务
// ===========================================

// 对应后端 `backend\src\dto\order\create-order.dto.ts` 中的 OrderItemDto (用于请求体)
export interface OrderItemDto {
  itemId: number; // 保持 camelCase，因为后端验证时要求
  quantity: number;
}

// 对应后端 `backend\src\dto\order\create-order.dto.ts` 中的 CreateOrderDto (用于请求体)
export interface CreateOrderDto {
  restaurantId: number;    // 保持 camelCase
  deliveryAddress: string; // 保持 camelCase
  payment_method: string;
  items: OrderItemDto[];
  notes?: string;
}

// 后端返回的完整订单详情接口 (用于响应体)
// 根据后端 OrderDto (backend\src\dto\order\order.dto.ts) 和实际返回数据调整
export interface Order {
  order_id: number; // 假设后端返回是 snake_case，且 axiosInstance 不会自动转换
  user_id: number;
  restaurant_id: number;
  status: 'pending' | 'accepted' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'; // 根据后端 OrderStatus 枚举
  total_amount: number;
  created_at: string;
  updated_at: string;
  delivery_address: string; // 订单详情可能包含这些字段
  payment_method: string;   // 订单详情可能包含这些字段
  notes?: string;           // 订单详情可能包含这些字段

  // !!! 核心修改：匹配后端 OrderDto 中的 order_items 属性名和内部结构 !!!
  order_items: Array<{
    order_item_id: number; // 订单项自身的ID (如果后端有)
    order_id: number;      // 关联的订单ID
    menu_item_id: number;  // 关联的菜品ID
    quantity: number;      // 数量

    // 假设后端通过 include 返回了关联的 menuItem 详情
    menuItem?: {
      menu_item_id: number; // 菜品自身的ID
      name: string;         // 菜品名称
      price: number;        // 菜品价格
      image_url?: string;   // 菜品图片URL
      // ... 其他菜品详情字段
    };
  }>;

  // 餐厅名称：后端 OrderDto 没有直接 restaurant_name 字段，但可能通过关联或自定义 DTO 返回
  // 如果需要，可以在这里加上，或者在前端通过 restaurant_id 再次查询
  restaurant_name?: string; // 增加此字段，因为在 CartPage.vue 中有使用
}

export interface CreateOrderResponse {
  message: string; // 对应后端返回的 "下单成功！"
  order: Order;    // 对应后端返回的 "order" 属性，其值是你的 Order 接口类型
}

// 如果后端有分页的订单列表，可能还需要这个接口
export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}

// 订单相关的 API 服务 
export const orderService = {
  /**
   * 创建新订单
   * @param data CreateOrderDto 包含订单详情
   * @returns 返回新创建的订单信息
   */
  createOrder(data: CreateOrderDto) {
    return axiosInstance.post<CreateOrderResponse>('/orders', data);
  },

  /**
   * 获取当前用户的订单历史
   * @param params 可选的查询参数，例如分页 (注意：/orders/user 接口可能不支持分页参数)
   * @returns 返回当前用户订单的列表 (Order[])
   */
  // !!! 核心修改: 将 getOrderHistory 方法名改为 getUserOrders, 并将接口路径改为 /orders/user !!!
  // !!! 返回类型也改为 Promise<Order[]>，因为后端 /orders/user 通常直接返回订单数组 !!!
  async getUserOrders(): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders/my-orders');
    return response.data; // 假设 response.data 直接是 Order 数组
  },

  /**
   * 根据订单ID获取单个订单的详细信息
   * @param orderId 订单ID (通常是 number)
   * @returns 返回单个订单详情
   */
  getOrderById(orderId: number) {
    return axiosInstance.get<Order>(`/orders/${orderId}`);
  },

  /**
   * 取消订单 (如果后端支持此功能)
   * @param orderId 订单ID
   * @returns 返回操作结果
   */
  cancelOrder(orderId: number) {
    return axiosInstance.patch(`/orders/${orderId}/cancel`);
  }
};