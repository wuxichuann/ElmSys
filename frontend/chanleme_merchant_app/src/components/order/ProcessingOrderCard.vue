<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { Order } from '../../types/order';

const props = defineProps<{
  order: Order;
}>();

const emit = defineEmits(['ready-for-pickup']);

const isReadyStatus = computed(() => {
  return props.order.status === 'ready_for_pickup';
});
</script>

<template>
  <div class="order-card processing-order-card">
    <div class="card-header">
      <span>订单号: #{{ order.order_id }}</span>
      <span :class="['status', order.status]">{{ order.status }}</span>
      <span>顾客: {{ order.customer_name }}</span>
    </div>
    <div class="card-body">
      <ul class="items-summary">
        <li v-for="item in order.items" :key="item.menu_item_id">
          {{ item.name }} x {{ item.quantity }}
        </li>
      </ul>
      <p class="notes" v-if="order.notes">备注: <span class="highlight-notes">!! {{ order.notes }} !!</span></p>
    </div>
    <div class="card-actions">
      <button
        @click="emit('ready-for-pickup')"
        :disabled="isReadyStatus"
        :class="{ 'action-button': true, 'ready-button': !isReadyStatus, 'disabled-button': isReadyStatus }"
      >
        {{ isReadyStatus ? '✓ 餐品已准备好' : '餐品已准备好' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
.card-header .status.accepted { background-color: #007bff; color: white; } /* 蓝色 */
.card-header .status.preparing { background-color: #ffc107; color: #333; } /* 黄色 */


.card-body {
  flex-grow: 1; /* 让内容区域填充可用空间 */
}

.items-summary {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  color: #666;
}

.notes {
  font-style: italic;
  color: #e74c3c;
  margin-bottom: 15px;
}
.highlight-notes {
  font-weight: bold;
}

.card-actions {
  margin-top: auto; /* Push button to the bottom */
  text-align: center;
}

.action-button {
  width: 80%; /* 按钮宽度 */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s;
}

.ready-button {
  background-color: #28a745;
  color: white;
}
.ready-button:hover {
  background-color: #218838;
}

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>