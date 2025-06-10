<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Order } from '../../types/order'; // 确保你的 types/order.ts 定义正确

const props = defineProps<{
  order: Order;
}>();

const emit = defineEmits(['accept-order', 'reject-order']);

const formatTime = (isoString: string) => {
  // 确保 isoString 是有效的，并且它可能需要先被 Date 解析
  if (!isoString) return 'N/A'; // 添加空值检查
  const date = new Date(isoString);
  // 检查日期是否有效，避免 Invalid Date 错误
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

// 辅助函数，用于获取菜品名称
// 因为后端返回的 order_items 里面，菜品名称在 menu_items.name 里
const getMenuItemName = (orderItem: any) => {
  return orderItem.menu_items?.name || '未知菜品'; // 使用可选链操作符 ?. 确保安全访问
};
</script>

<template>
  <div class="order-card new-order-card">
    <div class="card-header">
      <span>订单号: #{{ order.order_id }}</span>
      <span :class="['status', order.status]">{{ order.status }}</span>
      <span>下单时间: {{ formatTime(order.created_at) }}</span> 
    </div>
    <div class="card-body">
      <p>顾客: {{ order.users_orders_customer_idTousers?.full_name || '未知顾客' }} ({{ order.users_orders_customer_idTousers?.phone_number || 'N/A' }})</p>
      <p>地址: {{ order.delivery_address }}</p>
      <div class="items-list">
        <h4>菜品列表:</h4>
        <ul>
          <li v-for="(item, index) in order.order_items" :key="item.menu_item_id || `item-${order.order_id}-${index}`">
            - {{ getMenuItemName(item) }} x {{ item.quantity }}
          </li>
        </ul>
      </div>
      <p class="notes" v-if="order.notes">备注: <span class="highlight-notes">!! {{ order.notes }} !!</span></p>
      <p class="amount">金额: ¥{{ parseFloat(order.total_amount).toFixed(2) }} ({{ order.payment_status === 'paid' ? '已支付' : '未支付' }}/{{ order.payment_method }})</p>
    </div>
    <div class="card-actions">
      <button @click="emit('accept-order')" class="action-button accept-button">接 单</button>
      <button @click="emit('reject-order')" class="action-button reject-button">拒 绝</button>
    </div>
  </div>
</template>

<style scoped>
/* 样式保持不变 */
.order-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.card-header .status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  text-transform: uppercase;
}
.card-header .status.placed { background-color: #ffc107; color: #333; } /* 黄色 */

.card-body p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95em;
}

.items-list h4 {
  margin-top: 15px;
  margin-bottom: 5px;
  color: #444;
}
.items-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.items-list li {
  margin-bottom: 3px;
  color: #666;
}

.notes {
  margin-top: 15px;
  font-style: italic;
  color: #e74c3c; /* 红色醒目 */
}
.highlight-notes {
  font-weight: bold;
}

.amount {
  font-size: 1.1em;
  font-weight: bold;
  color: #28a745; /* 绿色表示金额 */
  margin-top: 15px;
  border-top: 1px dashed #eee;
  padding-top: 10px;
}

.card-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.accept-button {
  background-color: #28a745;
  color: white;
}
.accept-button:hover {
  background-color: #218838;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}
.reject-button:hover {
  background-color: #c82333;
}
</style>