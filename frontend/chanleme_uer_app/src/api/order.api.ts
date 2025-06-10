import apiClient from './index';

interface OrderItemPayload {
  itemId: number;
  quantity: number;
}

interface CreateOrderPayload {
  restaurantId: number;
  deliveryAddress: string;
  items: OrderItemPayload[];
  notes?: string;
  // 其他可能需要的字段，如 paymentMethod, paymentStatus
}

export const orderApi = {
  // 创建新订单
  create(orderData: CreateOrderPayload) {
    return apiClient.post('/orders', orderData);
  },
};