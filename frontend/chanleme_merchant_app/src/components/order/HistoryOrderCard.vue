<!-- <script setup lang="ts">
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
</style> -->
<!-- src/components/order/HistoryOrderCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col p-6">
    <div class="flex justify-between items-center mb-4 border-b pb-4">
      <h3 class="text-xl font-bold text-gray-800">订单 #{{ order.order_id }}</h3>
      <span :class="['px-3 py-1 rounded-full text-sm font-semibold', statusClass(order.status)]">
        {{ orderStatusMap[order.status] || order.status }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
      <div>
        <p><strong>总金额:</strong> <span class="text-red-600 font-semibold">¥{{ order.total_amount.toFixed(2) }}</span></p>
        <p><strong>下单时间:</strong> {{ formatDateTime(order.created_at) }}</p>
        <p v-if="order.delivered_at"><strong>送达时间:</strong> {{ formatDateTime(order.delivered_at) }}</p>
      </div>
      <div>
        <p><strong>顾客:</strong> {{ order.users_orders_customer_idTousers?.full_name || 'N/A' }}</p>
        <p v-if="order.users_orders_courier_idTousers"><strong>骑手:</strong> {{ order.users_orders_courier_idTousers?.full_name || 'N/A' }}</p>
      </div>
    </div>

    <div class="mt-auto pt-4 border-t border-gray-100 flex justify-end">
      <!-- 可以在这里添加查看详情按钮，如果需要详情弹窗 -->
      <button @click="$emit('view-details', order.order_id)"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm transition duration-200">
        查看详情
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Order } from '../../types/order';

export default defineComponent({
  name: 'HistoryOrderCard',
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  emits: ['view-details'],
  setup() {
    const orderStatusMap: { [key: string]: string } = {
        'placed': '新订单',
        'restaurant_confirmed': '商家已接单',
        'preparing': '制作中',
        'ready_for_pickup': '待取餐',
        'out_for_delivery': '配送中',
        'delivered': '已送达',
        'cancelled': '已取消',
        'refunded': '已退款',
    };
    const formatDateTime = (dateString: string | undefined): string => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const statusClass = (status: string): string => {
      switch (status) {
        case 'placed': return 'bg-yellow-100 text-yellow-800';
        case 'restaurant_confirmed':
        case 'preparing': return 'bg-blue-100 text-blue-800';
        case 'ready_for_pickup': return 'bg-green-100 text-green-800';
        case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-gray-100 text-gray-800';
        case 'cancelled':
        case 'refunded': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-200 text-gray-700';
      }
    };

    return {
      orderStatusMap,
      formatDateTime,
      statusClass,
    };
  },
});
</script>

<style scoped>
/* 可以添加一些 Card 的额外样式 */
</style>
