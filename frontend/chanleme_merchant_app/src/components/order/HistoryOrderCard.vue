<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Order } from '../../types/order';

const props = defineProps<{
  order: Order;
}>();

const emit = defineEmits(['view-detail']);

const formatDateTime = (isoString: string | null) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="order-card history-order-card">
    <div class="card-header">
      <span>订单号: #{{ order.order_id }}</span>
      <span :class="['status', order.status]">{{ order.status }}</span>
    </div>
    <div class="card-body">
      <p class="summary-line">
        {{ formatDateTime(order.delivered_at || order.picked_up_at || order.placed_at) }}
        <span v-if="order.rider_name"> 骑手: {{ order.rider_name }}</span>
        <span class="total-amount"> ¥{{ order.total_amount.toFixed(2) }}</span>
      </p>
    </div>
    <div class="card-actions">
      <button @click="emit('view-detail', order)" class="action-button view-detail-button">查看详情</button>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.card-header .status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  text-transform: uppercase;
}
.card-header .status.delivered { background-color: #28a745; color: white; } /* 绿色 */
.card-header .status.picked_up { background-color: #17a2b8; color: white; } /* 青色 */
.card-header .status.cancelled, .card-header .status.rejected { background-color: #6c757d; color: white; } /* 灰色 */


.card-body {
  flex-grow: 1;
  text-align: center;
}

.summary-line {
  font-size: 0.9em;
  color: #666;
  margin: 5px 0;
}

.total-amount {
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
  margin-left: 10px;
}

.card-actions {
  margin-top: 15px;
  text-align: center;
}

.action-button {
  padding: 8px 15px;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: #007bff;
  color: white;
}
</style>