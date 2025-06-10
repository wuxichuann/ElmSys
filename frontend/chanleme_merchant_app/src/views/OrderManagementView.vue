<!-- <script setup lang="ts">
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
</style> -->
<!-- src/views/OrderManagementView.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen font-inter">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">订单管理</h1>

    <div class="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'new'; fetchOrdersForActiveTab()"
          :class="['flex-1 py-4 px-6 text-center text-lg font-medium transition duration-200 ease-in-out', activeTab === 'new' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
        >
          新订单 ({{ orderStore.newOrders?.length || 0 }})
        </button>
        <button
          @click="activeTab = 'inProgress'; fetchOrdersForActiveTab()"
          :class="['flex-1 py-4 px-6 text-center text-lg font-medium transition duration-200 ease-in-out', activeTab === 'inProgress' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
        >
          进行中 ({{ orderStore.inProgressOrders?.length || 0 }})
        </button>
        <button
          @click="activeTab = 'history'; fetchOrdersForActiveTab()"
          :class="['flex-1 py-4 px-6 text-center text-lg font-medium transition duration-200 ease-in-out', activeTab === 'history' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
        >
          历史订单 ({{ orderStore.historyOrders?.length || 0 }})
        </button>
      </div>

      <div class="p-6">
        <!-- 新订单列表 -->
        <div v-if="activeTab === 'new'">
          <div v-if="orderStore.loading.new" class="text-center py-8 text-gray-600">
            <i class="fas fa-spinner fa-spin mr-2"></i> 加载新订单中...
          </div>
          <div v-else-if="orderStore.error.new" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
            <p>{{ orderStore.error.new }}</p>
            <button @click="orderStore.fetchNewOrders" class="mt-2 text-blue-600 hover:underline focus:outline-none">点击重试</button>
          </div>
          <div v-else-if="!orderStore.loading.new && (!orderStore.newOrders || orderStore.newOrders.length === 0)" class="text-center py-12 text-gray-500">
            暂无新订单。
          </div>
          <div v-else class="grid grid-cols-1 gap-6">
            <NewOrderCard
              v-for="order in orderStore.newOrders"
              :key="order.order_id"
              :order="order"
              @confirm-order="handleOrderUpdate(order.order_id, 'accepted')"
            />
          </div>
        </div>

        <!-- 进行中订单列表 -->
        <div v-else-if="activeTab === 'inProgress'">
          <div v-if="orderStore.loading.inProgress" class="text-center py-8 text-gray-600">
            <i class="fas fa-spinner fa-spin mr-2"></i> 加载进行中订单中...
          </div>
          <div v-else-if="orderStore.error.inProgress" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
            <p>{{ orderStore.error.inProgress }}</p>
            <button @click="orderStore.fetchInProgressOrders" class="mt-2 text-blue-600 hover:underline focus:outline-none">点击重试</button>
          </div>
          <div v-else-if="!orderStore.loading.inProgress && (!orderStore.inProgressOrders || orderStore.inProgressOrders.length === 0)" class="text-center py-12 text-gray-500">
            暂无进行中订单。
          </div>
          <div v-else class="grid grid-cols-1 gap-6">
            <ProcessingOrderCard
              v-for="order in orderStore.inProgressOrders"
              :key="order.order_id"
              :order="order"
              @update-order-status="handleOrderUpdate"
            />
          </div>
        </div>

        <!-- 历史订单列表 -->
        <div v-else-if="activeTab === 'history'">
          <div v-if="orderStore.loading.history" class="text-center py-8 text-gray-600">
            <i class="fas fa-spinner fa-spin mr-2"></i> 加载历史订单中...
          </div>
          <div v-else-if="orderStore.error.history" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
            <p>{{ orderStore.error.history }}</p>
            <button @click="orderStore.fetchHistoryOrders" class="mt-2 text-blue-600 hover:underline focus:outline-none">点击重试</button>
          </div>
          <div v-else-if="!orderStore.loading.history && (!orderStore.historyOrders || orderStore.historyOrders.length === 0)" class="text-center py-12 text-gray-500">
            暂无历史订单。
          </div>
          <div v-else class="grid grid-cols-1 gap-6">
            <HistoryOrderCard
              v-for="order in orderStore.historyOrders"
              :key="order.order_id"
              :order="order"
              @view-details="openOrderDetail(order)"
            />
          </div>
        </div>
      </div>
    </div>

    <OrderDetailModal
      :is-visible="showDetailModal"
      :order="selectedOrder"
      @close="showDetailModal = false; selectedOrder = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useOrderStore } from '../stores/order';
import NewOrderCard from '../components/order/NewOrderCard.vue';
import ProcessingOrderCard from '../components/order/ProcessingOrderCard.vue';
import HistoryOrderCard from '../components/order/HistoryOrderCard.vue';
import OrderDetailModal from '../components/order/OrderDetailModal.vue'; // 用于历史订单详情
import { AllowedRestaurantStatus, Order } from '../types/order'; // 导入 AllowedRestaurantStatus 和 Order 类型

const orderStore = useOrderStore();
const activeTab = ref<'new' | 'inProgress' | 'history'>('new'); // 统一为 'inProgress'

const showDetailModal = ref(false);
const selectedOrder = ref<Order | null>(null); // 明确类型为 Order

onMounted(() => {
  fetchOrdersForActiveTab();
});

// 监听 activeTab 的变化，当切换 tab 时加载数据
watch(activeTab, () => {
  fetchOrdersForActiveTab();
});

const fetchOrdersForActiveTab = () => {
  if (activeTab.value === 'new') {
    orderStore.fetchNewOrders();
  } else if (activeTab.value === 'inProgress') { // 统一为 'inProgress'
    orderStore.fetchInProgressOrders();
  } else if (activeTab.value === 'history') {
    orderStore.fetchHistoryOrders();
  }
};

// handleOrderUpdate 调整为更通用的处理函数
// 对于 NewOrderCard: @confirm-order="handleOrderUpdate(order.order_id, 'accepted')"
// 对于 ProcessingOrderCard: @update-order-status="handleOrderUpdate" (传递 orderId 和 newStatus)
const handleOrderUpdate = async (orderId: number, status: 'accepted' | AllowedRestaurantStatus) => {
  try {
    let apiStatus: AllowedRestaurantStatus | undefined; // 声明一个变量来存储后端期望的状态值

    if (status === 'accepted') {
      // 商家确认接单，对应后端 confirmOrder 路由
      await orderStore.confirmOrder(orderId);
    } else {
      // 其他状态更新，对应后端 updateOrderStatus 路由
      apiStatus = status as AllowedRestaurantStatus; // 将前端传来的状态直接作为后端允许的状态
      await orderStore.updateOrderStatus(orderId, apiStatus);
    }
    // 成功后，Pinia Store 会自动更新数据和移动订单，这里无需手动刷新或弹窗
  } catch (error: any) {
    // 错误信息已由 store 设置，并会在模板中显示，这里只做控制台输出
    console.error('更新订单状态失败:', error);
  }
};

const openOrderDetail = (order: Order) => { // 明确类型为 Order
  selectedOrder.value = order;
  showDetailModal.value = true;
};
</script>

<style scoped>
/* 使用 Tailwind CSS，以下为旧的自定义样式，可以考虑转换为 Tailwind */
/*
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}
*/
</style>
