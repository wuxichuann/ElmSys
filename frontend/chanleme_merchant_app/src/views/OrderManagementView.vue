<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '../stores/order';
import NewOrderCard from '../components/order/NewOrderCard.vue';
import ProcessingOrderCard from '../components/order/ProcessingOrderCard.vue';
import HistoryOrderCard from '../components/order/HistoryOrderCard.vue';
import OrderDetailModal from '../components/order/OrderDetailModal.vue'; // 用于历史订单详情

const orderStore = useOrderStore();
const activeTab = ref('new'); // 'new', 'processing', 'history'

const showDetailModal = ref(false);
const selectedOrder = ref<any | null>(null);

onMounted(() => {
  fetchOrdersForActiveTab();
});

const fetchOrdersForActiveTab = () => {
  if (activeTab.value === 'new') {
    orderStore.fetchNewOrders();
  } else if (activeTab.value === 'processing') {
    orderStore.fetchProcessingOrders();
  } else if (activeTab.value === 'history') {
    orderStore.fetchHistoryOrders();
  }
};

const handleOrderUpdate = async (orderId: number, status: 'accepted' | 'rejected' | 'preparing' | 'ready_for_pickup') => {
  try {
    let apiStatus: UpdateOrderStatusDto['status']; // 声明一个变量来存储后端期望的状态值

    // 根据前端传入的语义化状态，映射到后端实际接受的状态值
    if (status === 'accepted') {
      apiStatus = 'restaurant_confirmed'; // <--- 将 'accepted' 映射为后端需要的 'restaurant_confirmed'
    } else if (status === 'rejected') {
      apiStatus = 'rejected'; // 假设后端拒绝状态也是 'rejected'
    } else if (status === 'preparing') {
      apiStatus = 'preparing'; // 假设后端准备中状态也是 'preparing'
    } else if (status === 'ready_for_pickup') {
      apiStatus = 'ready_for_pickup'; // 假设后端待取货状态也是 'ready_for_pickup'
    } else {
      // 如果有其他未预期的状态，进行警告或错误处理
      console.warn(`handleOrderUpdate: 收到未知状态: ${status}`);
      alert('操作失败：无效的订单状态。');
      return; // 提前退出
    }

    await orderStore.updateOrderStatus(orderId, apiStatus); // 调用 Pinia Store 的 action，传入映射后的状态
    alert('订单状态更新成功！');
    // 状态更新后，orderStore会自动移动订单，所以不需要手动刷新
  } catch (error) {
    // 捕获 Pinia Store 中抛出的错误，并显示给用户
    alert('更新订单状态失败：' + (orderStore.error || '未知错误'));
  }
};

const openOrderDetail = (order: any) => {
  selectedOrder.value = order;
  showDetailModal.value = true;
};
</script>

<template>
  <div class="order-management-view">
    <h2>订单管理</h2>

    <div class="tabs">
      <button :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'; fetchOrdersForActiveTab()">
        新下单 ({{ orderStore.newOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'processing' }" @click="activeTab = 'processing'; fetchOrdersForActiveTab()">
        进行中 ({{ orderStore.processingOrders.length }})
      </button>
      <button :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'; fetchOrdersForActiveTab()">
        历史订单 ({{ orderStore.historyOrders.length }})
      </button>
    </div>

    <div v-if="orderStore.loading" class="loading-message">加载中...</div>
    <div v-else-if="orderStore.error" class="error-message">{{ orderStore.error }}</div>

    <div v-else class="order-list">
      <div v-if="activeTab === 'new'">
        <div v-if="orderStore.newOrders.length === 0" class="no-data-message">暂无新订单。</div>
        <NewOrderCard
          v-for="order in orderStore.newOrders"
          :key="order.order_id"
          :order="order"
          @accept-order="handleOrderUpdate(order.order_id, 'accepted')"
          @reject-order="handleOrderUpdate(order.order_id, 'rejected')"
        />
      </div>

      <div v-else-if="activeTab === 'processing'">
        <div v-if="orderStore.processingOrders.length === 0" class="no-data-message">暂无进行中订单。</div>
        <ProcessingOrderCard
          v-for="order in orderStore.processingOrders"
          :key="order.order_id"
          :order="order"
          @ready-for-pickup="handleOrderUpdate(order.order_id, 'ready_for_pickup')"
        />
      </div>

      <div v-else-if="activeTab === 'history'">
        <div v-if="orderStore.historyOrders.length === 0" class="no-data-message">暂无历史订单。</div>
        <HistoryOrderCard
          v-for="order in orderStore.historyOrders"
          :key="order.order_id"
          :order="order"
          @view-detail="openOrderDetail(order)"
        />
      </div>
    </div>

    <OrderDetailModal
      v-if="showDetailModal"
      :show="showDetailModal"
      :order="selectedOrder"
      @close="showDetailModal = false"
    />
  </div>
</template>

<style scoped>
.order-management-view {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  background-color: transparent;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #555;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tabs button:hover {
  color: #007bff;
}

.tabs button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  font-weight: bold;
}

.loading-message, .error-message, .no-data-message {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error-message {
  color: #dc3545;
}

.order-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* 响应式布局 */
}
</style>