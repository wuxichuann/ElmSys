export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'cancelled' | 'rejected';

export interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string; // 例如 'wechat_pay', 'alipay'
  payment_status: 'paid' | 'unpaid';
  items: OrderItem[];
  notes: string | null;
  placed_at: string;
  accepted_at: string | null;
  ready_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  rider_id: number | null;
  rider_name: string | null;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}