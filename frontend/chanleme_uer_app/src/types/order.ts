export interface CartItem {
  itemId: number;
  quantity: number;
  item_name: string; // 前端购物车需要显示名称
  price: number;     // 前端购物车需要显示价格
  image_url?: string; // 前端购物车显示图片
  restaurantId: number; // 确保购物车商品都来自同一餐厅
}

export interface CreateOrderDto {
  restaurantId: number;
  deliveryAddress: string;
  items: { itemId: number; quantity: number }[]; // 提交给后端时只包含这些
  notes?: string;
  paymentMethod?: string;
}

export interface Order {
  order_id: number;
  customer_id: number;
  restaurant_id: number;
  courier_id: number | null;
  delivery_address: string;
  total_amount: string; // 后端 Decimal 类型，前端通常用字符串处理
  status: string; // ENUM 类型
  payment_method: string | null;
  payment_status: string; // ENUM 类型
  notes: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  // 额外包含的信息，后端查询时可能会带上
  order_items?: {
    order_item_id: number;
    item_id: number;
    quantity: number;
    price_at_purchase: string;
    subtotal: string;
    menu_items?: { // 关联的菜单项信息
      item_name: string;
    };
  }[];
  users_orders_customer_idTousers?: { // 顾客信息
    full_name: string;
    phone_number: string;
  };
  restaurants?: { // 餐厅信息
    restaurant_name: string;
    address: string;
    phone_number: string;
  };
}