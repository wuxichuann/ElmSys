// frontend/chanleme_merchant_app/src/api/order.ts
import api from './config';
import { Order } from '../types/order'; // 导入订单类型

class OrderApi {
  /**
   * 获取餐厅的新订单列表 (状态为 'placed')
   * @returns 订单列表
   */
  async getNewRestaurantOrders(): Promise<Order[]> {
    // 后端接口：GET /api/orders/restaurant/new
    const response = await api.get<Order[]>('/orders/restaurant/new');
    return response.data;
  }

  /**
   * 确认接单
   * @param orderId 订单ID
   * @returns 更新后的订单信息
   */
  async confirmOrder(orderId: string): Promise<Order> {
    // 后端接口：PATCH /api/orders/:id/confirm
    const response = await api.patch<Order>(`/orders/${orderId}/confirm`);
    return response.data;
  }

  // 你可能还会需要其他订单相关的API，例如：
  // async rejectOrder(orderId: string, reason: string): Promise<Order> { /* ... */ }
  // async completeOrder(orderId: string): Promise<Order> { /* ... */ }
  // async getRestaurantOrderHistory(): Promise<Order[]> { /* ... */ }
}

export const orderApi = new OrderApi();