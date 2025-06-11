// // frontend/chanleme_merchant_app/src/api/merchantApi.ts
// import authAxios, { publicAxios } from './axiosInstance';

// // --- 类型定义（这些可以放到 src/types/ 或 src/interfaces/ 文件夹下，然后在此处导入） ---
// // 示例订单接口，请根据你的后端实际返回结构进行补充
// export interface Order {
//   id: number;
//   restaurantId: number;
//   userId: number;
//   totalAmount: number;
//   status: 'placed' | 'restaurant_confirmed' | 'preparing' | 'ready_for_pickup' | 'in_delivery' | 'delivered' | 'cancelled';
//   items: Array<{
//     dishId: number;
//     quantity: number;
//     price: number;
//     dishName: string; // 假设会返回菜品名称
//   }>;
//   createdAt: string;
//   updatedAt: string;
//   // ... 其他你需要的订单字段，例如配送信息、用户地址等
// }

// // 示例菜品接口，根据你后端 CreateMenuItemDto 和 UpdateMenuItemDto 定义进行补充
// export interface Dish {
//   id: number;
//   restaurantId: number; // 后端自动添加，前端创建时不需要提供
//   name: string;
//   description: string;
//   price: number;
//   imageUrl?: string; // 可选
//   isAvailable?: boolean; // 可选，后端可能默认 true
//   createdAt?: string; // 后端自动生成
//   updatedAt?: string; // 后端自动生成
//   // ... 其他菜品字段
// }

// // 登录和注册相关的服务
// export const authService = {
//   login: (credentials: any) => publicAxios.post('/auth/login', credentials),
//   // 商家注册时需要同时注册商家账号和餐厅账号
//   registerRestaurant: (merchantRestaurantData: any) => publicAxios.post('/auth/register/restaurant', merchantRestaurantData),
// };

// // 商家订单管理相关的服务
// export const merchantOrderService = {
//   /**
//    * 获取商家名下所有“新下单”('placed')的订单。
//    * @route GET /api/orders/restaurant/new
//    */
//   getNewRestaurantOrders: async (): Promise<Order[]> => {
//     const response = await authAxios.get('/orders/restaurant/new');
//     return response.data;
//   },

//   /**
//    * 获取商家名下所有“进行中”的订单。
//    * @route GET /api/orders/restaurant/in-progress
//    */
//   getInProgressRestaurantOrders: async (): Promise<Order[]> => {
//     const response = await authAxios.get('/orders/restaurant/in-progress');
//     return response.data;
//   },

//   /**
//    * 获取商家名下所有“历史”订单。
//    * @route GET /api/orders/restaurant/history
//    */
//   getHistoryRestaurantOrders: async (): Promise<Order[]> => {
//     const response = await authAxios.get('/orders/restaurant/history');
//     return response.data;
//   },

//   /**
//    * 商家确认接单，将订单状态从 'placed' 更新为 'restaurant_confirmed'。
//    * @route PATCH /api/orders/:id/confirm
//    * @param orderId 订单ID
//    */
//   confirmOrder: async (orderId: number | string): Promise<Order> => {
//     const response = await authAxios.patch(`/orders/${orderId}/confirm`);
//     return response.data;
//   },

//   /**
//    * 商家更新进行中订单的状态 (e.g., preparing, ready_for_pickup)。
//    * @route PATCH /api/orders/:id/status
//    * @param orderId 订单ID
//    * @param newStatus 新的订单状态
//    */
//   updateOrderStatus: async (orderId: number | string, newStatus: string): Promise<Order> => {
//     const response = await authAxios.patch(`/orders/${orderId}/status`, { status: newStatus });
//     return response.data;
//   },

//   /**
//    * 商家也可以查看订单详情。
//    * @route GET /api/orders/:id (如果后端有此API，但目前提供的后端路由中没有明确的 GET /api/orders/:id 供商家使用)
//    * @param id 订单ID
//    */
//   getOrderDetail: async (id: number | string): Promise<Order> => {
//     // 警告：后端路由定义中没有明确的 GET /api/orders/:id 路由供商家直接获取单个订单详情。
//     // 如果此路由在后端未实现，此调用将返回 404。
//     // 通常，前端会从订单列表中获取到足够的信息，或者后端会提供一个 /api/orders/restaurant/:restaurantId/order/:id 的路由。
//     const response = await authAxios.get(`/orders/${id}`);
//     return response.data;
//   },
// };

// // 商家菜品管理相关的服务 (已根据后端路由定义进行更新)
// export const merchantDishService = {
//   /**
//    * 获取商家所有菜品列表。
//    * @route GET /api/menu-items
//    */
//   getMerchantDishes: async (): Promise<Dish[]> => {
//     const response = await authAxios.get('/menu-items');
//     return response.data;
//   },

//   /**
//    * 添加新菜品。
//    * @route POST /api/menu-items
//    * @param dishData 菜品数据（不包含id, restaurantId等后端自动生成的字段）
//    */
//   addDish: async (dishData: Omit<Dish, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>): Promise<Dish> => {
//     const response = await authAxios.post('/menu-items', dishData);
//     return response.data;
//   },

//   /**
//    * 更新菜品信息。
//    * @route PATCH /api/menu-items/:id
//    * @param dishId 菜品ID
//    * @param dishData 要更新的菜品部分数据
//    */
//   updateDish: async (dishId: number | string, dishData: Partial<Dish>): Promise<Dish> => {
//     const response = await authAxios.patch(`/menu-items/${dishId}`, dishData);
//     return response.data;
//   },

//   /**
//    * 删除菜品。
//    * @route DELETE /api/menu-items/:id
//    * @param dishId 菜品ID
//    */
//   deleteDish: async (dishId: number | string): Promise<void> => {
//     await authAxios.delete(`/menu-items/${dishId}`);
//   },
// };

// // 商家端也使用通用的用户个人信息API
// export const userService = {
//   /**
//    * 获取当前登录用户的详细个人资料。
//    * @route GET /api/users/profile
//    */
//   getProfile: () => authAxios.get('/users/profile'),

//   /**
//    * 更新当前登录用户的个人资料。
//    * @route PATCH /api/users/profile
//    * @param profileData 要更新的个人资料数据
//    */
//   updateProfile: (profileData: any) => authAxios.patch('/users/profile', profileData),

//   /**
//    * 修改当前登录用户的密码。
//    * @route PATCH /api/users/change-password
//    * @param passwordData 包含旧密码和新密码
//    */
//   changePassword: (passwordData: any) => authAxios.patch('/users/change-password', passwordData),
// };
// frontend/chanleme_merchant_app/src/api/merchantApi.ts
import authAxios, { publicAxios } from './axiosInstance';

// --- 类型定义（这些可以放到 src/types/ 或 src/interfaces/ 文件夹下，然后在此处导入） ---

// 定义订单中的菜品项接口，根据后端 order_items 数组中的对象结构
export interface OrderItem {
  dish_id: number; // 假设菜品ID是数字，如果后端返回的是字符串，请改为 string
  dish_name: string;
  quantity: number;
  price: number;
  // 如果 order_items 中还有其他字段，请在此处添加
}

// 定义订单中的用户信息接口，根据后端 users_orders_customer_idTousers 对象结构
export interface UserInfo {
  full_name: string;
  phone_number: string;
  // 如果 users_orders_customer_idTousers 中还有其他字段，请在此处添加
}

// 定义订单接口，根据后端实际返回的订单对象结构
export interface Order {
  order_id: number; // 对应后端返回的 "order_id"
  total_amount: string; // 对应后端返回的 "total_amount"，注意它是字符串类型
  status: 'placed' | 'restaurant_confirmed' | 'preparing' | 'ready_for_pickup' | 'in_delivery' | 'delivered' | 'cancelled';
  payment_status: string;
  payment_method: string;
  notes: string;
  delivery_address: string;
  created_at: string; // 对应后端返回的 "created_at"
  users_orders_customer_idTousers: UserInfo; // 对应后端嵌套的用户信息对象
  order_items: OrderItem[]; // 对应后端嵌套的订单菜品列表

  // 以下是之前 Order 接口中有的字段，但你提供的 `new` 订单返回值中没有明确体现。
  // 如果它们在其他订单类型（如进行中、历史订单）的返回中存在，则应保留并可能设为可选，
  // 或根据实际情况调整。这里暂时不包含，以严格匹配你给出的新订单结构。
  // restaurantId?: number;
  // userId?: number;
  // updatedAt?: string;
}

// 示例菜品接口，根据你后端 CreateMenuItemDto 和 UpdateMenuItemDto 定义进行补充
export interface Dish {
  // id: number;
  // restaurantId: number; // 后端自动添加，前端创建时不需要提供
  // item_name: string;
  // description: string;
  // price: number;
  // imageUrl?: string; // 可选
  // category: string;
  // isAvailable?: boolean; // 可选，后端可能默认 true
  // createdAt?: string; // 后端自动生成
  // updatedAt?: string; // 后端自动生成
  // // ... 其他菜品字段
  item_id: number;
  restaurantId: number;
  item_name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string; // <-- 确认是 string，且没有问号（如果后端是必填）
  is_available?: boolean; // <-- 确认是 boolean。如果后端 isNotEmpty 表示必填，那么这里的 ? 应该移除。
                          //     但通常布尔值必填只需 IsBoolean，isNotEmpty 针对布尔值可能表示它不能是 null/undefined。
                          //     先保留 ?，如果报错继续，再移除。
  createdAt?: string;
  updatedAt?: string;
}

// 登录和注册相关的服务
export const authService = {
  login: (credentials: any) => publicAxios.post('/auth/login', credentials),
  // 商家注册时需要同时注册商家账号和餐厅账号
  registerRestaurant: (merchantRestaurantData: any) => publicAxios.post('/auth/register/restaurant', merchantRestaurantData),
};

// 商家订单管理相关的服务
export const merchantOrderService = {
  /**
   * 获取商家名下所有“新下单”('placed')的订单。
   * @route GET /api/orders/restaurant/new
   */
  getNewRestaurantOrders: async (): Promise<Order[]> => {
    const response = await authAxios.get('/orders/restaurant/new');
    return response.data;
  },

  /**
   * 获取商家名下所有“进行中”的订单。
   * @route GET /api/orders/restaurant/in-progress
   */
  getInProgressRestaurantOrders: async (): Promise<Order[]> => {
    const response = await authAxios.get('/orders/restaurant/in-progress');
    return response.data;
  },

  /**
   * 获取商家名下所有“历史”订单。
   * @route GET /api/orders/restaurant/history
   */
  getHistoryRestaurantOrders: async (): Promise<Order[]> => {
    const response = await authAxios.get('/orders/restaurant/history');
    return response.data;
  },

  /**
   * 商家确认接单，将订单状态从 'placed' 更新为 'restaurant_confirmed'。
   * @route PATCH /api/orders/:id/confirm
   * @param orderId 订单ID
   */
  confirmOrder: async (orderId: number | string): Promise<Order> => {
    const response = await authAxos.patch(`/orders/${orderId}/confirm`);
    return response.data;
  },

  /**
   * 商家更新进行中订单的状态 (e.g., preparing, ready_for_pickup)。
   * @route PATCH /api/orders/:id/status
   * @param orderId 订单ID
   * @param newStatus 新的订单状态
   */
  updateOrderStatus: async (orderId: number | string, newStatus: string): Promise<Order> => {
    const response = await authAxios.patch(`/orders/${orderId}/status`, { status: newStatus });
    return response.data;
  },

  /**
   * 商家也可以查看订单详情。
   * @route GET /api/orders/:id (如果后端有此API，但目前提供的后端路由中没有明确的 GET /api/orders/:id 供商家使用)
   * @param id 订单ID
   */
  getOrderDetail: async (id: number | string): Promise<Order> => {
    // 警告：后端路由定义中没有明确的 GET /api/orders/:id 路由供商家直接获取单个订单详情。
    // 如果此路由在后端未实现，此调用将返回 404。
    // 通常，前端会从订单列表中获取到足够的信息，或者后端会提供一个 /api/orders/restaurant/:restaurantId/order/:id 的路由。
    const response = await authAxios.get(`/orders/${id}`);
    return response.data;
  },
};

// 商家菜品管理相关的服务 (已根据后端路由定义进行更新)
export const merchantDishService = {
  /**
   * 获取商家所有菜品列表。
   * @route GET /api/menu-items
   */
  getMerchantDishes: async (): Promise<Dish[]> => {
    const response = await authAxios.get('/menu-items');
    return response.data;
  },

  /**
   * 添加新菜品。
   * @route POST /api/menu-items
   * @param dishData 菜品数据（不包含id, restaurantId等后端自动生成的字段）
   */
  addDish: async (dishData: Omit<Dish, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>): Promise<Dish> => {
    const response = await authAxios.post('/menu-items', dishData);
    return response.data;
  },

  /**
   * 更新菜品信息。
   * @route PATCH /api/menu-items/:id
   * @param dishId 菜品ID
   * @param dishData 要更新的菜品部分数据
   */
  updateDish: async (dishId: number | string, dishData: Partial<Dish>): Promise<Dish> => {
    const response = await authAxios.patch(`/menu-items/${dishId}`, dishData);
    return response.data;
  },

  /**
   * 删除菜品。
   * @route DELETE /api/menu-items/:id
   * @param dishId 菜品ID
   */
  deleteDish: async (dishId: number | string): Promise<void> => {
    await authAxios.delete(`/menu-items/${dishId}`);
  },
};

// 商家端也使用通用的用户个人信息API
export const userService = {
  /**
   * 获取当前登录用户的详细个人资料。
   * @route GET /api/users/profile
   */
  getProfile: () => authAxios.get('/users/profile'),

  /**
   * 更新当前登录用户的个人资料。
   * @route PATCH /api/users/profile
   * @param profileData 要更新的个人资料数据
   */
  updateProfile: (profileData: any) => authAxios.patch('/users/profile', profileData),

  /**
   * 修改当前登录用户的密码。
   * @route PATCH /api/users/change-password
   * @param passwordData 包含旧密码和新密码
   */
  changePassword: (passwordData: any) => authAxios.patch('/users/change-password', passwordData),
};