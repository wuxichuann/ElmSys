<template>
  <div class="order-detail-page">
    <router-link to="/orders">返回我的订单</router-link>
    <h2>订单详情</h2>

    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="order" class="order-details-card">
      <p><strong>订单号:</strong> {{ order.id }}</p>
      <p><strong>餐厅:</strong> {{ order.restaurantName }}</p>
      <p><strong>下单时间:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
      <p>
        <strong>订单状态:</strong>
        <span :class="['order-status-detail', order.status]">{{ formatStatus(order.status) }}</span>
      </p>
      <p><strong>配送地址:</strong> {{ order.deliveryAddress }}</p>
      <p v-if="order.notes"><strong>备注:</strong> {{ order.notes }}</p> <h3>订单内容:</h3>
      <ul class="order-items-list">
        <li v-for="(item, index) in order.items" :key="item.dishId || index">
          <span>{{ item.dishName }}</span>
          <span>x {{ item.quantity }}</span>
          <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
        </li>
      </ul>

      <div class="order-summary-detail">
        <p>菜品总额: ¥{{ calculateSubtotal(order.items).toFixed(2) }}</p>
        <p>配送费: ¥{{ order.deliveryFee !== undefined && order.deliveryFee !== null ? order.deliveryFee.toFixed(2) : '0.00' }}</p>
        <p>优惠: -¥{{ order.discount !== undefined && order.discount !== null ? order.discount.toFixed(2) : '0.00' }}</p>
        <h3><strong>总计:</strong> ¥{{ order.totalAmount.toFixed(2) }}</h3>
      </div>

      </div>
    <div v-else-if="!loading && !order">未找到订单详情</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// 从 userApi 中导入后端定义的接口，虽然后端 OrderItemDto 目前不完全匹配实际响应，
// 但我们将在前端接口中进行更精确的定义和适配
import { orderService, Order as BackendOrderInterface, OrderItemDto as BackendOrderItemDtoInterface } from '@/api/userApi';

// ===============================================
// 前端组件内部使用的接口定义 - 适配后端数据
// 确保这里的字段名和类型与你在模板中使用的一致 (camelCase, id 为 number等)
// ===============================================

// 根据后端实际响应的 order_items 结构来定义
interface BackendActualOrderItem {
    quantity: number;
    price_at_purchase: string; // 后端返回的是字符串
    menu_items: {
        item_name: string;
        image_url?: string;
        // 注意：这里后端没有 price 字段，只有 price_at_purchase
    };
}

// 适配到前端使用的 OrderItem 接口
interface OrderItem {
  dishId: number;       // 后端可能没有，如果需要唯一ID，可能需要生成或使用其他字段
  dishName: string;     // 从 backendItem.menu_items.item_name 获取
  quantity: number;
  price: number;        // 从 backendItem.price_at_purchase 转换而来
}

// 适配到前端使用的 Order 接口
interface Order {
  id: number;           // 从 backendOrder.order_id 获取
  restaurantId: number; // 后端响应中没有直接的 restaurant_id 字段了，可能需要重新获取或假设它是固定的
  restaurantName: string; // 从 backendOrder.restaurants.restaurant_name 获取
  totalAmount: number;    // 从 backendOrder.total_amount 转换
  status: string;         // 后端响应中的 status 是 "placed" 等
  createdAt: string;    // 从 backendOrder.created_at 获取
  deliveryAddress: string; // 从 backendOrder.delivery_address 获取
  items: OrderItem[];     // 适配后的订单项列表
  deliveryFee?: number;   // 后端响应没有，如果需要，这里可以保留并给默认值
  discount?: number;      // 后端响应没有，如果需要，这里可以保留并给默认值
  paymentStatus?: string; // 后端响应没有
  paymentMethod?: string; // 后端响应没有
  notes?: string;         // 从 backendOrder.notes 获取
}

const route = useRoute();
const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const orderId = Number(route.params.id);

const fetchOrderDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await orderService.getOrderById(orderId);
    // 这里不再使用 BackendOrderInterface 直接作为类型，因为实际响应结构不同
    // 我们直接用 any 或者根据实际结构定义一个更精确的后端响应接口
    const backendResponseData: any = response.data; // 使用 any 临时处理，或定义精确接口

    // *** 核心：根据最新的后端响应结构进行适配 ***
    order.value = {
      id: backendResponseData.order_id,
      // 注意：后端响应中没有直接的 restaurant_id。
      // 如果你的 API 确实不返回，restaurantId 可能会缺失或需要固定值。
      // 这里为了编译通过，暂时设置为一个默认值，但实际可能需要调整后端接口或前端逻辑
      restaurantId: backendResponseData.restaurant_id || 0, // 如果后端不返回，可能需要固定值或移除
      restaurantName: backendResponseData.restaurants?.restaurant_name || '未知餐厅', // 从嵌套的 restaurants 对象中获取
      totalAmount: Number(backendResponseData.total_amount) || 0, // 确保转换为数字，并提供默认值
      status: backendResponseData.status, // 使用后端返回的 "placed" 等状态
      createdAt: backendResponseData.created_at,
      deliveryAddress: backendResponseData.delivery_address,
      notes: backendResponseData.notes, // 适配 notes
      items: backendResponseData.order_items.map((backendItem: BackendActualOrderItem) => ({ // 使用 BackendActualOrderItem
        // 如果后端 order_items 数组中没有唯一的 ID，可能需要用随机数或索引作为 key
        dishId: backendItem.menu_items?.item_name.length ? Math.random() : 0, // 临时生成一个 dishId，更好的做法是后端提供
        dishName: backendItem.menu_items?.item_name || '未知菜品', // 从 menu_items 嵌套对象中获取 item_name
        quantity: backendItem.quantity,
        price: Number(backendItem.price_at_purchase) || 0, // 从 price_at_purchase 转换并确保是数字
      })),
      deliveryFee: 0, // 后端未提供，给默认值
      discount: 0,    // 后端未提供，给默认值
      paymentMethod: '', // 后端未提供，给默认值
    };

  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      error.value = '订单未找到。';
    } else {
      console.error('获取订单详情失败:', err); // 打印详细错误信息
      error.value = err.message || '获取订单详情失败';
    }
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '待确认',
    accepted: '餐厅已接单',
    preparing: '制作中',
    delivering: '配送中',
    delivered: '已送达',
    cancelled: '已取消',
    placed: '已下单', // *** 新增：适配后端返回的 "placed" 状态 ***
    // 根据实际情况添加更多状态
  };
  return statusMap[status] || status;
};

const calculateSubtotal = (items: OrderItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

onMounted(() => {
  if (isNaN(orderId)) {
    error.value = '无效的订单ID。';
    loading.value = false;
  } else {
    fetchOrderDetail();
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.order-detail-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.order-details-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}
.order-details-card p {
  margin-bottom: 8px;
  font-size: 1.05em;
  color: #333;
}
.order-status-detail {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
  color: white;
  margin-left: 10px;
}
/* 新增 placed 状态样式 */
.placed { background-color: #4CAF50; } /* 绿色，表示已成功下单 */
.pending { background-color: #ffc107; }
.accepted { background-color: #17a2b8; }
.preparing { background-color: #007bff; }
.delivering { background-color: #28a745; }
.delivered { background-color: #6c757d; }
.cancelled { background-color: #dc3545; }


h3 {
  margin-top: 20px;
  margin-bottom: 15px;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.order-items-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.order-items-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
  font-size: 0.95em;
  color: #444;
}
.order-items-list li:last-child {
  border-bottom: none;
}
.order-summary-detail {
  text-align: right;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #eee;
}
.order-summary-detail p {
  margin: 5px 0;
  color: #666;
}
.order-summary-detail h3 {
  margin-top: 10px;
  color: #e44d26;
}
.cancel-order-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}
.cancel-order-btn:hover {
  background-color: #c82333;
}
</style>