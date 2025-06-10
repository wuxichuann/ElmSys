// frontend/chanleme_merchant_app/src/api/order.ts
import api from './index'; // 假设这是你的 Axios 实例
import { Order, UpdateOrderStatusDto, OrderStatus } from '../types/order';

export const order = {
  // 获取指定状态的订单列表
  // 根据后端目前的API，我们只能获取"新订单"
  // 如果你需要获取其他状态的订单，后端需要提供相应的API
  fetchOrdersByStatus: (status: OrderStatus | 'all'): Promise<Order[]> => {
    // 假设 order.ts 中的 `api` 实例已经配置了基础URL，例如 http://localhost:3001/api

    // 后端目前只有 /api/orders/restaurant/new 这个接口，用于获取新订单。
    // 所以，我们只能硬编码调用这个接口。
    // 如果 future 需要支持其他状态，后端必须提供 /api/merchant/orders?status=xxx 这样的通用接口
    // 或者提供 /api/orders/restaurant/confirmed, /api/orders/restaurant/ready_for_pickup 等特定接口。

    // 我们可以根据传入的 status 来决定调用哪个后端接口，
    // 但目前你的后端只提供了 getNewOrdersHandler (对应 /orders/restaurant/new)
    // 并且该 handler 不接收 status 参数来过滤。

    // 最直接的修复是让 fetchOrdersByStatus 专用于获取新订单，
    // 如果需要其他状态，要么后端改，要么前端调用不同的API。
    
    // 如果你前端的 UI 有多个标签（新订单、已接单、历史订单等），
    // 那么你后端需要提供更通用的接口，或者每个状态一个独立接口。
    // 目前来看，只能获取新订单。

    let url = '';
    if (status === 'placed' || status === 'all') { // 假设 'all' 也暂时映射到新订单，因为没有通用接口
        // 对应后端路由 GET /api/orders/restaurant/new
        url = '/orders/restaurant/new';
    } else {
        // 如果请求其他状态，但后端没有对应接口，需要进行错误处理或提示
        console.warn(`Backend does not have an API for orders with status: ${status}. Fetching new orders instead.`);
        url = '/orders/restaurant/new'; // 暂时也指向新订单，或者抛出错误
        // throw new Error(`Unsupported order status: ${status}. Backend API not found.`);
    }

    // 确保 api.get 的路径是 `/orders/restaurant/new`
    // api 会自动加上基础URL，所以不需要再写 http://localhost:3001/api
    return api.get(url).then(res => {
      console.log('Fetched orders data from backend:', res.data); // <-- 这里添加了调试信息
      return res.data;
    });
  },

  // 更新订单状态 (包括接单/拒绝/餐品准备好等)
  // 后端确认接单的路由是 PATCH /api/orders/:id/confirm
  // updateOrderStatus: (orderId: number, status: UpdateOrderStatusDto['status']): Promise<Order> => {
  //   let endpoint = '';
  //   // 根据 status 来构建不同的URL，因为后端有不同的 PATCH 路由
  //   if (status === 'restaurant_confirmed') {
  //     endpoint = `/orders/${orderId}/confirm`; // 对应后端 PATCH /api/orders/:id/confirm
  //   } 
  //   // 如果有其他状态更新（如 ready_for_pickup, delivered），需要后端提供对应路由
  //   // 否则，这里需要添加错误处理
  //   else {
  //     console.error(`Unsupported order status update: ${status}. Please check backend API.`);
  //     throw new Error(`Unsupported order status update: ${status}`);
  //   }
    
  //   // 注意：后端 confirmOrderHandler 似乎不需要 { status } body，
  //   // 它只通过 URL 和餐厅ID来确认订单。
  //   // 但如果后端实际需要，则保持 { status }。
  //   // 暂时先去掉 body，如果报错再加回来
  //   return api.patch(endpoint).then(res => res.data); 
  // },
   updateOrderStatus: (orderId: number, status: UpdateOrderStatusDto['status']): Promise<Order> => {
    let endpoint = '';
    // 根据传入的后端实际状态名称来构建不同的URL
    if (status === 'restaurant_confirmed') { // 当传入 'restaurant_confirmed' 时，使用接单路由
      endpoint = `/orders/${orderId}/confirm`; 
    } 
    // 如果有“拒绝订单”的后端API，你需要在后端提供 /api/orders/:id/reject 路由，
    // 并且在这里添加 `else if (status === 'rejected') { endpoint = `/orders/${orderId}/reject`; }`
    // 其他状态如 'preparing', 'ready_for_pickup' 也需要后端提供相应路由。
    // 如果后端有一个通用的状态更新接口，例如 PATCH /api/orders/:id/status
    // 并且请求体是 { status: 'new_status_value' }，那么这里可以简化。
    // 但目前看，接单是独立的 /confirm 路由。
    
    // 如果没有匹配到已知的后端路由，就抛出错误
    else {
      console.error(`Unsupported order status update: ${status}. Please check backend API and ensure mapping.`);
      throw new Error(`Unsupported order status update: ${status}`);
    }
    
    // 根据后端 confirmOrderHandler 的实现，它不接收请求体
    return api.patch(endpoint).then(res => res.data); 
  },
  
  // 获取单个订单详情（后端未提供明确的 get single order by ID 路由）
  // 你的后端目前没有一个通用的 GET /api/orders/:id 路由。
  // 如果需要这个功能，后端需要添加类似：
  // router.get('/:id', authMiddleware, checkRole(UserType.RESTAURANT_ADMIN), getOrderDetailHandler);
  getOrderDetail: (orderId: number): Promise<Order> => {
    // 暂时先抛出错误，直到后端提供这个接口
    console.error(`Backend API for /merchant/orders/${orderId} is not implemented.`);
    return Promise.reject(new Error(`Backend API for /merchant/orders/${orderId} is not implemented.`));
    // return api.get(`/merchant/orders/${orderId}`).then(res => res.data); // 这会 404
  }
};