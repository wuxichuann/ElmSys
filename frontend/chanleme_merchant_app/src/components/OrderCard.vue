<template>
  <div class="order-card">
    <div class="order-header">
      <h3>订单号: {{ order.order_id }}</h3>
      <span :class="['order-status', getStatusClass(order.status)]">{{ getOrderStatusText(order.status) }}</span>
    </div>
    <p><strong>下单时间:</strong> {{ new Date(order.created_at).toLocaleString() }}</p>
    <p><strong>顾客姓名:</strong> {{ order.users_orders_customer_idTousers.full_name }}</p>
    <p><strong>顾客电话:</strong> {{ order.users_orders_customer_idTousers.phone_number }}</p>
    <p><strong>配送地址:</strong> {{ order.delivery_address }}</p>
    <p><strong>支付方式:</strong> {{ getPaymentMethodText(order.payment_method) }}</p>
    <p v-if="order.notes"><strong>备注:</strong> {{ order.notes }}</p>

    <div class="order-items">
      <h4>订单菜品:</h4>
      <ul>
        <li v-for="(item, index) in order.order_items" :key="index" class="order-item-detail">
          <img v-if="item.menu_items.image_url" :src="item.menu_items.image_url" alt="菜品图片" class="item-image" />
          <span>{{ item.menu_items.item_name }} x {{ item.quantity }}</span>
          <span>¥{{ item.price_at_purchase.toFixed(2) }}</span>
        </li>
      </ul>
    </div>
    <p class="total-amount">总金额: ¥{{ order.total_amount.toFixed(2) }}</p>

    <div class="card-actions" v-if="order.status === OrderStatus.PLACED">
      <button @click="emitConfirmOrder" :disabled="isConfirming">
        {{ isConfirming ? '接单中...' : '确认接单' }}
      </button>
      </div>
    <div v-else class="order-processed-message">
        <p>此订单已处理。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { OrderForRestaurantDisplay, OrderStatus } from '../types/order';

const props = defineProps<{
  order: OrderForRestaurantDisplay;
  isConfirming: boolean; // 用于控制按钮的加载状态
}>();

const emit = defineEmits(['confirmOrder', 'rejectOrder']); // 定义发出的事件

const emitConfirmOrder = () => {
  emit('confirmOrder', props.order.order_id);
};

const emitRejectOrder = () => {
  emit('rejectOrder', props.order.order_id);
};

const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PLACED: return '待确认';
    case OrderStatus.RESTAURANT_CONFIRMED: return '已确认';
    case OrderStatus.PREPARING: return '准备中';
    case OrderStatus.READY_FOR_PICKUP: return '待取货';
    case OrderStatus.OUT_FOR_DELIVERY: return '配送中';
    case OrderStatus.DELIVERED: return '已送达';
    case OrderStatus.CANCELLED: return '已取消';
    case OrderStatus.REJECTED: return '已拒绝';
    default: return '未知状态';
  }
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PLACED: return 'status-placed';
    case OrderStatus.RESTAURANT_CONFIRMED: return 'status-confirmed';
    case OrderStatus.OUT_FOR_DELIVERY: return 'status-delivery';
    case OrderStatus.DELIVERED: return 'status-delivered';
    case OrderStatus.CANCELLED:
    case OrderStatus.REJECTED: return 'status-cancelled';
    default: return 'status-default';
  }
};

const getPaymentMethodText = (method: string): string => {
  switch (method) {
    case 'alipay': return '支付宝';
    case 'wechatpay': return '微信支付';
    case 'cash_on_delivery': return '货到付款';
    default: return method;
  }
};
</script>

<style scoped>
.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}

.order-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.order-status {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.status-placed { background-color: #ff9800; } /* Orange */
.status-confirmed { background-color: #4caf50; } /* Green */
.status-delivery { background-color: #2196f3; } /* Blue */
.status-delivered { background-color: #00796b; } /* Teal */
.status-cancelled, .status-rejected { background-color: #f44336; } /* Red */
.status-default { background-color: #9e9e9e; } /* Gray */


.order-card p {
  font-size: 15px;
  color: #555;
  margin-bottom: 8px;
}

.order-items {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.order-items h4 {
  font-size: 16px;
  color: #444;
  margin-bottom: 10px;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-item-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.item-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 10px;
  object-fit: cover;
}

.order-card .total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #e44d26;
  margin-top: 10px;
  text-align: right;
  border-top: 1px dashed #eee;
  padding-top: 10px;
}

.card-actions {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 10px;
  margin-top: 20px;
}

.order-card button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.order-card button:hover:not(:disabled) {
  background-color: #0056b3;
}

.order-card button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.order-card .reject-btn {
  background-color: #dc3545;
}

.order-card .reject-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.order-processed-message {
    text-align: center;
    color: #888;
    font-style: italic;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px dashed #eee;
}
</style>