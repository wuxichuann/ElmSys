<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Order } from '../../types/order';

const props = defineProps<{
  show: boolean;
  order: Order | null;
}>();

const emit = defineEmits(['close']);

const formatDateTime = (isoString: string | null) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
</script>

<template>
  <div v-if="show && order" class="modal-overlay">
    <div class="modal-content">
      <h3>订单详情 #{{ order.order_id }}</h3>
      <div class="detail-section">
        <p><strong>状态:</strong> <span :class="['status-badge', order.status]">{{ order.status }}</span></p>
        <p><strong>总金额:</strong> ¥{{ order.total_amount.toFixed(2) }} ({{ order.payment_status === 'paid' ? '已支付' : '未支付' }})</p>
        <p><strong>支付方式:</strong> {{ order.payment_method }}</p>
        <p><strong>下单时间:</strong> {{ formatDateTime(order.placed_at) }}</p>
        <p><strong>接单时间:</strong> {{ formatDateTime(order.accepted_at) }}</p>
        <p><strong>准备好时间:</strong> {{ formatDateTime(order.ready_at) }}</p>
        <p><strong>取餐时间:</strong> {{ formatDateTime(order.picked_up_at) }}</p>
        <p><strong>送达时间:</strong> {{ formatDateTime(order.delivered_at) }}</p>
        <p><strong>顾客:</strong> {{ order.customer_name }} ({{ order.customer_phone }})</p>
        <p><strong>地址:</strong> {{ order.delivery_address }}</p>
        <p v-if="order.rider_name"><strong>骑手:</strong> {{ order.rider_name }}</p>
        <p v-if="order.notes"><strong>备注:</strong> {{ order.notes }}</p>
      </div>

      <div class="detail-section">
        <h4>菜品列表:</h4>
        <ul>
          <li v-for="item in order.items" :key="item.menu_item_id">
            {{ item.name }} x {{ item.quantity }} @ ¥{{ item.price.toFixed(2) }}
          </li>
        </ul>
      </div>

      <div class="modal-actions">
        <button @click="emit('close')" class="close-button">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-width: 90%;
  max-height: 90vh; /* 限制高度，允许滚动 */
  overflow-y: auto; /* 内容溢出时滚动 */
}

h3 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}
.detail-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-section p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95em;
}

.detail-section strong {
  color: #333;
}

.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detail-section li {
  margin-bottom: 5px;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}
/* 状态颜色可以根据实际需求调整 */
.status-badge.placed { background-color: #ffc107; color: #333; }
.status-badge.accepted { background-color: #007bff; }
.status-badge.preparing { background-color: #fd7e14; }
.status-badge.ready_for_pickup { background-color: #20c997; }
.status-badge.picked_up { background-color: #17a2b8; }
.status-badge.delivered { background-color: #28a745; }
.status-badge.cancelled, .status-badge.rejected { background-color: #6c757d; }


.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
}

.close-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #6c757d;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #5a6268;
}
</style>