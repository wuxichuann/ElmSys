import api from './config';
import { CreateOrderDto, Order } from '../types/order';

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  const response = await api.post('/orders', data);
  // 后端返回 { message: '下单成功！', order: newOrder }
  return response.data.order;
};

// 后端目前没有提供获取用户自己订单的路由 (GET /api/orders/me)。
// 如果需要，后端需要增加此路由，前端才能调用。
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders/me'); // 假设后端有此路由
  return response.data;
};