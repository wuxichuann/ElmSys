<!-- <script setup lang="ts">
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
</style> -->
<!-- src/components/order/NewOrderCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col p-6 font-inter">
    <div class="flex justify-between items-center mb-4 border-b pb-4">
      <h3 class="text-xl font-bold text-gray-800">订单 #{{ order.order_id }}</h3>
      <span :class="['px-3 py-1 rounded-full text-sm font-semibold', statusClass(order.status)]">
        {{ orderStatusMap[order.status] || order.status }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
      <div>
        <p><strong>总金额:</strong> <span class="text-red-600 font-semibold">¥{{ parseFloat(order.total_amount).toFixed(2) }}</span></p>
        <p><strong>下单时间:</strong> {{ formatDateTime(order.created_at) }}</p>
      </div>
      <div>
        <p><strong>顾客:</strong> {{ order.users_orders_customer_idTousers?.full_name || '未知顾客' }}</p>
        <p><strong>电话:</strong> {{ order.users_orders_customer_idTousers?.phone_number || 'N/A' }}</p>
        <p><strong>送货地址:</strong> {{ order.delivery_address }}</p>
      </div>
    </div>

    <div v-if="order.notes" class="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
      <strong>备注:</strong> {{ order.notes }}
    </div>

    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-800 mb-2">菜品详情:</h4>
      <ul class="list-disc pl-5 text-gray-700">
        <li v-for="(item, index) in order.order_items" :key="item.item_id || `item-${order.order_id}-${index}`" class="mb-1">
          - {{ getMenuItemName(item) }} x {{ item.quantity }} (¥{{ parseFloat(item.price_at_purchase).toFixed(2) }})
        </li>
      </ul>
    </div>

    <p class="text-base font-semibold text-gray-800 mt-auto pt-4 border-t border-gray-100">
      支付状态: <span :class="{'text-green-600': order.payment_status === 'paid', 'text-red-600': order.payment_status !== 'paid'}">{{ order.payment_status === 'paid' ? '已支付' : '未支付' }}</span>
      <span v-if="order.payment_method"> ({{ order.payment_method }})</span>
    </p>

    <!-- 订单操作区域 -->
    <div class="mt-4 flex justify-end gap-3">
      <div v-if="orderStore.error.action" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg relative text-sm w-full sm:w-auto mb-3 sm:mb-0 mr-auto" role="alert">
        {{ orderStore.error.action }}
      </div>

      <button
        @click="confirmOrder"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="orderStore.loading.action"
      >
        <span v-if="orderStore.loading.action" class="flex items-center">
          <i class="fas fa-spinner fa-spin mr-2"></i> 接单中...
        </span>
        <span v-else>
          接 单
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// defineProps 和 defineEmits 不再需要导入，它们是编译器宏
import { PropType } from 'vue'; // PropType 仍需导入以确保类型安全
import { Order } from '../../types/order';
import { useOrderStore } from '../../stores/order';

const props = defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true,
  },
});

const emit = defineEmits(['confirm-order']); // 修改事件名称为 'confirm-order'

const orderStore = useOrderStore(); // 引入 orderStore

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

// 格式化日期时间
const formatDateTime = (isoString: string): string => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 辅助函数，用于获取菜品名称
const getMenuItemName = (orderItem: any) => {
  return orderItem.menu_items?.item_name || '未知菜品'; // 修正路径
};

// 根据订单状态返回不同的CSS类
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

// 商家确认接单
const confirmOrder = async () => {
  try {
    await orderStore.confirmOrder(props.order.order_id);
    emit('confirm-order'); // 通知父组件操作已完成 (可选，因为store会更新)
  } catch (error) {
    console.error('接单失败:', error);
    // 错误信息会通过 orderStore.error.action 显示在模板中
  }
};
</script>

<style scoped>
/*
以下为旧的自定义样式，已被 Tailwind CSS 类替代或不再需要。
为了简洁，我们将移除它们，并依赖 Tailwind。

.order-card, .card-header, .card-body, .items-list, .notes, .amount, .card-actions,
.action-button, .accept-button, .reject-button 的样式将通过 Tailwind 类直接在模板中实现。
*/
</style>
