<!-- <script setup lang="ts">
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
</style> -->
<!-- src/components/order/ProcessingOrderCard.vue -->
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
        <p v-if="order.updated_at"><strong>更新时间:</strong> {{ formatDateTime(order.updated_at) }}</p>
      </div>
      <div>
        <p><strong>顾客:</strong> {{ order.users_orders_customer_idTousers?.full_name || 'N/A' }}</p>
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
        <li v-for="item in order.order_items" :key="item.item_id" class="mb-1">
          {{ item.menu_items?.item_name }} x {{ item.quantity }} (¥{{ item.price_at_purchase.toFixed(2) }})
        </li>
      </ul>
    </div>

    <div v-if="order.courier_id" class="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
      <h4 class="text-md font-semibold mb-2">骑手信息:</h4>
      <p><strong>姓名:</strong> {{ order.users_orders_courier_idTousers?.full_name || 'N/A' }}</p>
      <p><strong>电话:</strong> {{ order.users_orders_courier_idTousers?.phone_number || 'N/A' }}</p>
      <p v-if="order.estimated_delivery_at"><strong>预计送达:</strong> {{ formatTime(order.estimated_delivery_at) }}</p>
    </div>

    <!-- 订单操作区域 -->
    <div class="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
      <div v-if="orderStore.error.action" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm w-full sm:w-auto mb-3 sm:mb-0" role="alert">
        {{ orderStore.error.action }}
      </div>

      <!-- 状态更新下拉菜单 -->
      <div v-if="['restaurant_confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(order.status)"
           class="w-full sm:w-auto">
        <select
          v-model="selectedStatus"
          @change="handleStatusChange"
          class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :disabled="orderStore.loading.action"
        >
          <option value="" disabled>更新订单状态</option>
          <option :value="AllowedRestaurantStatus.PREPARING" :disabled="!canTransitionTo('preparing')">
            制作中
          </option>
          <option :value="AllowedRestaurantStatus.READY_FOR_PICKUP" :disabled="!canTransitionTo('ready_for_pickup')">
            待取餐
          </option>
          <!-- 商家完成/送达，这里是交给骑手，不是商家直接操作 -->
          <!-- <option value="delivered">已送达</option> -->
          <option value="cancelled">取消订单</option> <!-- 如果后端支持商家取消 -->
        </select>
      </div>

      <!-- 确认订单按钮 (仅新订单可见) -->
      <button
        v-if="order.status === 'placed'"
        @click="confirmOrder"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        :disabled="orderStore.loading.action"
      >
        {{ orderStore.loading.action ? '接单中...' : '接单' }}
      </button>

      <!-- 标记为完成按钮 (这通常是骑手操作，但如果商家需要手动完成，可以添加) -->
      <!-- <button
        v-if="order.status === 'ready_for_pickup'"
        @click="markAsDelivered"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
        :disabled="orderStore.loading.action"
      >
        标记为完成
      </button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Order, AllowedRestaurantStatus } from '../../types/order';
import { useOrderStore } from '../../stores/order';

export default defineComponent({
  name: 'ProcessingOrderCard',
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  setup(props) {
    const orderStore = useOrderStore();
    const selectedStatus = ref<string>(''); // 用于下拉菜单绑定
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

    // 监听订单状态变化，更新下拉菜单选中项
    watch(() => props.order.status, (newStatus) => {
      selectedStatus.value = newStatus;
    }, { immediate: true });

    // 格式化日期时间
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

    // 格式化时间（仅小时和分钟）
    const formatTime = (dateString: string | undefined): string => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
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
      } catch (error) {
        console.error('接单失败:', error);
      }
    };

    // 处理订单状态更新
    const handleStatusChange = async () => {
      if (selectedStatus.value) {
        try {
          // 这里检查如果是 'cancelled'，虽然后端 AllowedRestaurantStatus 没有，但可以作为扩展
          // 如果后端 `updateOrderStatusByRestaurant` 路由支持，可以放开。
          // 目前只支持 PREPARING 和 READY_FOR_PICKUP
          if (selectedStatus.value === 'cancelled') {
             // 示例：如果后端支持商家取消，可以这样调用
             // await orderStore.updateOrderStatus(props.order.order_id, 'cancelled' as AllowedRestaurantStatus);
             alert('目前不支持商家直接取消订单，请联系管理员。');
             selectedStatus.value = props.order.status; // 恢复旧状态
             return;
          }
          await orderStore.updateOrderStatus(props.order.order_id, selectedStatus.value as AllowedRestaurantStatus);
        } catch (error) {
          console.error('更新状态失败:', error);
          selectedStatus.value = props.order.status; // 失败后恢复旧状态
        }
      }
    };

    // 判断是否可以流转到某个状态
    const canTransitionTo = (targetStatus: string): boolean => {
        const currentStatus = props.order.status;
        if (currentStatus === 'restaurant_confirmed' && targetStatus === 'preparing') return true;
        if (currentStatus === 'preparing' && targetStatus === 'ready_for_pickup') return true;
        // 如果后端支持，可以添加更多规则
        return false;
    };


    return {
      orderStore,
      selectedStatus,
      orderStatusMap,
      AllowedRestaurantStatus, // 暴露给模板使用
      formatDateTime,
      formatTime,
      statusClass,
      confirmOrder,
      handleStatusChange,
      canTransitionTo,
    };
  },
});
</script>

<style scoped>
/* 可以添加一些 Card 的额外样式 */
</style>
