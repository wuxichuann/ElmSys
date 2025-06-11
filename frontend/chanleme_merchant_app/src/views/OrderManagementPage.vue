<!-- <template>
  <div class="merchant-order-management container">
    <h2>商家订单管理</h2>
    <div class="tabs">
      <button @click="changeTabAndFetch('new')" :class="{ active: currentTab === 'new' }">新下单</button>
      <button @click="changeTabAndFetch('inProgress')" :class="{ active: currentTab === 'inProgress' }">进行中</button>
      <button @click="changeTabAndFetch('history')" :class="{ active: currentTab === 'history' }">历史订单</button>
    </div>

    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="!loading && !error && currentTab === 'new'" class="order-section">
      <h3>新下单订单 (状态: {{ getStatusDisplayName('placed') }})</h3>
      <div v-if="newOrders.length > 0" class="order-list">
        <div v-for="order in newOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <button @click="confirmOrder(order.id)">确认订单 (接单)</button>
        </div>
      </div>
      <div v-else class="no-orders">暂无新下单订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'inProgress'" class="order-section">
      <h3>进行中订单</h3>
      <div v-if="inProgressOrders.length > 0" class="order-list">
        <div v-for="order in inProgressOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <div class="button-group">
            <button v-if="order.status === 'restaurant_confirmed'" @click="updateOrderStatus(order.id, 'preparing')">餐厅开始制作</button>
            <button v-if="order.status === 'preparing'" @click="updateOrderStatus(order.id, 'ready_for_pickup')">餐品已准备好</button>
            <button v-if="order.status === 'ready_for_pickup'">等待骑手取餐</button>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无进行中订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'history'" class="order-section">
      <h3>历史订单</h3>
      <div v-if="historyOrders.length > 0" class="order-list">
        <div v-for="order in historyOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无历史订单。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { merchantOrderService, Order } from '@/api/merchantApi'; // 导入 Order 类型
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'; // 确保路径正确
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';   // 确保路径正确

// 这里重新定义 Order 和 OrderItem 以确保类型与 `merchantApi.ts` 中的定义一致
// 如果 `merchantApi.ts` 中的 Order 和 OrderItem 足够完整，这里可以直接使用导入的 Order 类型
// 如果你的后端返回的 Order 结构有嵌套的用户信息，Order 接口需要包含它。
// 这里我们假设 Order 类型已经包含 user?: { username: string } 和 items: OrderItem[]
// 并假设 OrderItem 包含 dishId, dishName, quantity, price

// 定义订单状态的映射
const OrderStatusMap: { [key: string]: string } = {
  placed: '新下单',
  restaurant_confirmed: '餐厅已确认',
  preparing: '准备中',
  ready_for_pickup: '待取餐',
  in_delivery: '配送中',
  delivered: '已送达',
  cancelled: '已取消',
};

const currentTab = ref<'new' | 'inProgress' | 'history'>('new');
const newOrders = ref<Order[]>([]);
const inProgressOrders = ref<Order[]>([]);
const historyOrders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getStatusDisplayName = (status: string): string => {
  return OrderStatusMap[status] || status;
};

// 核心的获取订单函数，根据当前tab获取数据
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (currentTab.value === 'new') {
      newOrders.value = await merchantOrderService.getNewRestaurantOrders();
    } else if (currentTab.value === 'inProgress') {
      inProgressOrders.value = await merchantOrderService.getInProgressRestaurantOrders();
    } else if (currentTab.value === 'history') {
      historyOrders.value = await merchantOrderService.getHistoryRestaurantOrders();
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '获取订单列表失败';
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

// 切换Tab并刷新数据
const changeTabAndFetch = async (tab: 'new' | 'inProgress' | 'history') => {
  currentTab.value = tab;
  await fetchOrders();
};

const confirmOrder = async (orderId: number | string) => {
  if (!confirm('确定要确认此订单吗？')) return;
  try {
    await merchantOrderService.confirmOrder(orderId);
    alert('订单已确认！');
    // 确认后，订单状态会改变，需要刷新对应的tab
    await fetchOrders();
  } catch (err: any) {
    alert(`确认订单失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error confirming order:', err);
  }
};

const updateOrderStatus = async (orderId: number | string, newStatus: string) => {
  let confirmationMessage = '';
  switch (newStatus) {
    case 'preparing':
      confirmationMessage = '确定要将订单状态更新为“餐厅开始制作”吗？';
      break;
    case 'ready_for_pickup':
      confirmationMessage = '确定要将订单状态更新为“餐品已准备好”吗？';
      break;
    default:
      confirmationMessage = `确定要将订单状态更新为 ${getStatusDisplayName(newStatus)} 吗？`;
  }

  if (!confirm(confirmationMessage)) return;

  try {
    await merchantOrderService.updateOrderStatus(orderId, newStatus);
    alert(`订单状态已更新为: ${getStatusDisplayName(newStatus)}`);
    // 更新状态后，订单可能从进行中列表移除或改变排序，需要刷新
    await fetchOrders();
  } catch (err: any) {
    alert(`更新订单状态失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error updating order status:', err);
  }
};

onMounted(() => {
  // 组件挂载时，默认加载“新下单”订单
  fetchOrders();
});
</script>

<style scoped>
/* 样式保持不变，如果需要，可以自行调整 */
.merchant-order-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  color: #555;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  color: #007bff;
  background-color: #f8f8f8;
}

.tabs button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: #eaf6ff;
}

.order-section {
  margin-top: 25px;
}

.order-section h3 {
  text-align: left;
  color: #444;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
}

.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.order-card {
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-card p {
  margin: 5px 0;
  color: #666;
}

.order-card p strong {
  color: #333;
}

.order-items {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.order-items h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #555;
  font-size: 1.1em;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items li {
  background-color: #f7f7f7;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95em;
  color: #444;
}

.order-card button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.order-card button:hover {
  background-color: #368e6b;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Align buttons to the start */
  flex-wrap: wrap; /* Allow buttons to wrap */
}

.button-group button {
  flex-grow: 1; /* Allow buttons to grow */
  min-width: 120px; /* Minimum width for buttons */
}

.no-orders {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style> -->
<!-- <template>
  <div class="merchant-order-management container">
    <h2>商家订单管理</h2>
    <div class="tabs">
      <button @click="changeTabAndFetch('new')" :class="{ active: currentTab === 'new' }">新下单</button>
      <button @click="changeTabAndFetch('inProgress')" :class="{ active: currentTab === 'inProgress' }">进行中</button>
      <button @click="changeTabAndFetch('history')" :class="{ active: currentTab === 'history' }">历史订单</button>
    </div>

    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="!loading && !error && currentTab === 'new'" class="order-section">
      <h3>新下单订单 (状态: {{ getStatusDisplayName('placed') }})</h3>
      <div v-if="newOrders.length > 0" class="order-list">
        <div v-for="order in newOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <button @click="confirmOrder(order.id)">确认订单 (接单)</button>
        </div>
      </div>
      <div v-else class="no-orders">暂无新下单订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'inProgress'" class="order-section">
      <h3>进行中订单</h3>
      <div v-if="inProgressOrders.length > 0" class="order-list">
        <div v-for="order in inProgressOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <div class="button-group">
            <button v-if="order.status === 'restaurant_confirmed'" @click="updateOrderStatus(order.id, 'preparing')">餐厅开始制作</button>
            <button v-if="order.status === 'preparing'" @click="updateOrderStatus(order.id, 'ready_for_pickup')">餐品已准备好</button>
            <button v-if="order.status === 'ready_for_pickup'">等待骑手取餐</button>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无进行中订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'history'" class="order-section">
      <h3>历史订单</h3>
      <div v-if="historyOrders.length > 0" class="order-list">
        <div v-for="order in historyOrders" :key="order.id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.id }}</p>
          <p><strong>用户:</strong> {{ order.user?.username || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ order.totalAmount?.toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.dishId">
                {{ item.dishName }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无历史订单。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { merchantOrderService, Order } from '@/api/merchantApi'; // 导入 Order 类型
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';

// 定义订单状态的映射
const OrderStatusMap: { [key: string]: string } = {
  placed: '新下单',
  restaurant_confirmed: '餐厅已确认',
  preparing: '准备中',
  ready_for_pickup: '待取餐',
  in_delivery: '配送中',
  delivered: '已送达',
  cancelled: '已取消',
};

const currentTab = ref<'new' | 'inProgress' | 'history'>('new');
const newOrders = ref<Order[]>([]);
const inProgressOrders = ref<Order[]>([]);
const historyOrders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getStatusDisplayName = (status: string): string => {
  return OrderStatusMap[status] || status;
};

// 核心的获取订单函数，根据当前tab获取数据
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    let fetchedData: Order[] = [];
    if (currentTab.value === 'new') {
      fetchedData = await merchantOrderService.getNewRestaurantOrders();
      newOrders.value = fetchedData;
    } else if (currentTab.value === 'inProgress') {
      fetchedData = await merchantOrderService.getInProgressRestaurantOrders();
      inProgressOrders.value = fetchedData;
    } else if (currentTab.value === 'history') {
      fetchedData = await merchantOrderService.getHistoryRestaurantOrders();
      historyOrders.value = fetchedData;
    }
    // 【重要调试信息】打印出获取到的订单ID及其类型，帮助你检查数据源问题
    console.log(`Fetched ${currentTab.value} orders:`, fetchedData.map(o => ({ id: o.id, type: typeof o.id })));

  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '获取订单列表失败';
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

const confirmOrder = async (orderId: number | string) => {
  // 【重要调试信息】打印出即将发送的订单ID及其类型
  console.log('Attempting to confirm order with ID:', orderId, 'Type:', typeof orderId);

  // 防御性检查：确保 orderId 有效
  if (orderId === null || orderId === undefined || orderId === '') {
      alert('错误：订单ID无效，无法进行确认操作。');
      console.error('Invalid orderId for confirmation:', orderId);
      return;
  }

  // 显式转换为字符串，以确保作为 URL 参数传递时格式正确
  // 虽然 Axios 通常会处理数字，但显式转换可以避免一些边缘情况
  const idToSend = String(orderId);

  if (!confirm('确定要确认此订单吗？')) return;
  try {
    await merchantOrderService.confirmOrder(idToSend); // 使用转换后的 ID
    alert('订单已确认！');
    // 确认后，订单状态会改变，需要刷新对应的tab
    await fetchOrders();
  } catch (err: any) {
    // 优先显示后端返回的错误信息
    alert(`确认订单失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error confirming order:', err);
  }
};

const updateOrderStatus = async (orderId: number | string, newStatus: string) => {
  // 【重要调试信息】打印出即将发送的订单ID及其类型和新状态
  console.log('Attempting to update order status for ID:', orderId, 'Type:', typeof orderId, 'New status:', newStatus);

  // 防御性检查：确保 orderId 有效
  if (orderId === null || orderId === undefined || orderId === '') {
      alert('错误：订单ID无效，无法进行状态更新操作。');
      console.error('Invalid orderId for status update:', orderId);
      return;
  }
  const idToSend = String(orderId); // 显式转换为字符串

  let confirmationMessage = '';
  switch (newStatus) {
    case 'preparing':
      confirmationMessage = '确定要将订单状态更新为“餐厅开始制作”吗？';
      break;
    case 'ready_for_pickup':
      confirmationMessage = '确定要将订单状态更新为“餐品已准备好”吗？';
      break;
    default:
      confirmationMessage = `确定要将订单状态更新为 ${getStatusDisplayName(newStatus)} 吗？`;
  }

  if (!confirm(confirmationMessage)) return;

  try {
    await merchantOrderService.updateOrderStatus(idToSend, newStatus); // 使用转换后的 ID
    alert(`订单状态已更新为: ${getStatusDisplayName(newStatus)}`);
    // 更新状态后，订单可能从进行中列表移除或改变排序，需要刷新
    await fetchOrders();
  } catch (err: any) {
    // 优先显示后端返回的错误信息
    alert(`更新订单状态失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error updating order status:', err);
  }
};

onMounted(() => {
  // 组件挂载时，默认加载“新下单”订单
  fetchOrders();
});
</script>

<style scoped>
/* 样式保持不变 */
.merchant-order-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  color: #555;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  color: #007bff;
  background-color: #f8f8f8;
}

.tabs button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: #eaf6ff;
}

.order-section {
  margin-top: 25px;
}

.order-section h3 {
  text-align: left;
  color: #444;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
}

.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.order-card {
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-card p {
  margin: 5px 0;
  color: #666;
}

.order-card p strong {
  color: #333;
}

.order-items {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.order-items h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #555;
  font-size: 1.1em;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items li {
  background-color: #f7f7f7;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95em;
  color: #444;
}

.order-card button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.order-card button:hover {
  background-color: #368e6b;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Align buttons to the start */
  flex-wrap: wrap; /* Allow buttons to wrap */
}

.button-group button {
  flex-grow: 1; /* Allow buttons to grow */
  min-width: 120px; /* Minimum width for buttons */
}

.no-orders {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style> -->
<template>
  <div class="merchant-order-management container">
    <h2>商家订单管理</h2>
    <div class="tabs">
      <button @click="changeTabAndFetch('new')" :class="{ active: currentTab === 'new' }">新下单</button>
      <button @click="changeTabAndFetch('inProgress')" :class="{ active: currentTab === 'inProgress' }">进行中</button>
      <button @click="changeTabAndFetch('history')" :class="{ active: currentTab === 'history' }">历史订单</button>
    </div>

    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="!loading && !error && currentTab === 'new'" class="order-section">
      <h3>新下单订单 (状态: {{ getStatusDisplayName('placed') }})</h3>
      <div v-if="newOrders.length > 0" class="order-list">
        <div v-for="order in newOrders" :key="order.order_id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.order_id }}</p>
          <p><strong>用户:</strong> {{ order.users_orders_customer_idTousers?.full_name || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ parseFloat(order.total_amount || '0').toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.order_items" :key="item.dish_id">
                {{ item.dish_name }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <button v-if="order.order_id" @click="confirmOrder(order.order_id)">确认订单 (接单)</button>
        </div>
      </div>
      <div v-else class="no-orders">暂无新下单订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'inProgress'" class="order-section">
      <h3>进行中订单</h3>
      <div v-if="inProgressOrders.length > 0" class="order-list">
        <div v-for="order in inProgressOrders" :key="order.order_id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.order_id }}</p>
          <p><strong>用户:</strong> {{ order.users_orders_customer_idTousers?.full_name || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ parseFloat(order.total_amount || '0').toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.order_items" :key="item.dish_id">
                {{ item.dish_name }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
          <div class="button-group">
            <button v-if="order.order_id && order.status === 'restaurant_confirmed'" @click="updateOrderStatus(order.order_id, 'preparing')">餐厅开始制作</button>
            <button v-if="order.order_id && order.status === 'preparing'" @click="updateOrderStatus(order.order_id, 'ready_for_pickup')">餐品已准备好</button>
            <button v-if="order.order_id && order.status === 'ready_for_pickup'">等待骑手取餐</button>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无进行中订单。</div>
    </div>

    <div v-if="!loading && !error && currentTab === 'history'" class="order-section">
      <h3>历史订单</h3>
      <div v-if="historyOrders.length > 0" class="order-list">
        <div v-for="order in historyOrders" :key="order.order_id" class="order-card card">
          <p><strong>订单号:</strong> {{ order.order_id }}</p>
          <p><strong>用户:</strong> {{ order.users_orders_customer_idTousers?.full_name || '未知用户' }}</p>
          <p><strong>总价:</strong> ¥{{ parseFloat(order.total_amount || '0').toFixed(2) }}</p>
          <p><strong>状态:</strong> {{ getStatusDisplayName(order.status) }}</p>
          <div class="order-items">
            <h4>菜品详情:</h4>
            <ul>
              <li v-for="item in order.order_items" :key="item.dish_id">
                {{ item.dish_name }} x {{ item.quantity }} (¥{{ item.price?.toFixed(2) }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">暂无历史订单。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { merchantOrderService } from '@/api/merchantApi'; // 导入 merchantOrderService
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';

// 【重要】根据后端返回值，重新定义或补充 Order 接口和相关子接口
interface OrderItem {
  dish_id: string; // 后端返回的是 dish_id
  dish_name: string;
  quantity: number;
  price: number;
}

interface UserInfo {
  full_name: string;    // 后端返回的是 full_name
  phone_number: string; // 后端返回的是 phone_number
}

interface Order {
  order_id: number;     // 后端返回的订单ID是 order_id
  total_amount: string; // 后端返回的总价是字符串
  status: string;
  payment_status: string;
  payment_method: string;
  notes: string;
  delivery_address: string;
  created_at: string;
  users_orders_customer_idTousers: UserInfo; // 后端嵌套的用户信息
  order_items: OrderItem[]; // 后端嵌套的订单菜品列表
  // ... 其他后端可能返回的字段
}

const OrderStatusMap: { [key: string]: string } = {
  placed: '新下单',
  restaurant_confirmed: '餐厅已确认',
  preparing: '准备中',
  ready_for_pickup: '待取餐',
  in_delivery: '配送中',
  delivered: '已送达',
  cancelled: '已取消',
};

const currentTab = ref<'new' | 'inProgress' | 'history'>('new');
const newOrders = ref<Order[]>([]);
const inProgressOrders = ref<Order[]>([]);
const historyOrders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getStatusDisplayName = (status: string): string => {
  return OrderStatusMap[status] || status;
};

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    let fetchedData: Order[] = [];
    if (currentTab.value === 'new') {
      fetchedData = await merchantOrderService.getNewRestaurantOrders();
      newOrders.value = fetchedData;
    } else if (currentTab.value === 'inProgress') {
      fetchedData = await merchantOrderService.getInProgressRestaurantOrders();
      inProgressOrders.value = fetchedData;
    } else if (currentTab.value === 'history') {
      fetchedData = await merchantOrderService.getHistoryRestaurantOrders();
      historyOrders.value = fetchedData;
    }
    console.log(`Fetched ${currentTab.value} orders:`, fetchedData.map(o => ({ id: o.order_id, type: typeof o.order_id })));

  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '获取订单列表失败';
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

const changeTabAndFetch = async (tab: 'new' | 'inProgress' | 'history') => {
  currentTab.value = tab;
  await fetchOrders();
};

const confirmOrder = async (orderId: number | string) => {
  console.log('Attempting to confirm order with ID:', orderId, 'Type:', typeof orderId);

  if (orderId === null || orderId === undefined || orderId === '') {
      alert('错误：订单ID无效，无法进行确认操作。请检查订单数据。');
      console.error('Invalid orderId for confirmation:', orderId);
      return;
  }

  const idToSend = String(orderId);

  if (!confirm('确定要确认此订单吗？')) return;
  try {
    await merchantOrderService.confirmOrder(idToSend);
    alert('订单已确认！');
    await fetchOrders();
  } catch (err: any) {
    alert(`确认订单失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error confirming order:', err);
  }
};

const updateOrderStatus = async (orderId: number | string, newStatus: string) => {
  console.log('Attempting to update order status for ID:', orderId, 'Type:', typeof orderId, 'New status:', newStatus);

  if (orderId === null || orderId === undefined || orderId === '') {
      alert('错误：订单ID无效，无法进行状态更新操作。请检查订单数据。');
      console.error('Invalid orderId for status update:', orderId);
      return;
  }
  const idToSend = String(orderId);

  let confirmationMessage = '';
  switch (newStatus) {
    case 'preparing':
      confirmationMessage = '确定要将订单状态更新为“餐厅开始制作”吗？';
      break;
    case 'ready_for_pickup':
      confirmationMessage = '确定要将订单状态更新为“餐品已准备好”吗？';
      break;
    default:
      confirmationMessage = `确定要将订单状态更新为 ${getStatusDisplayName(newStatus)} 吗？`;
  }

  if (!confirm(confirmationMessage)) return;

  try {
    await merchantOrderService.updateOrderStatus(idToSend, newStatus);
    alert(`订单状态已更新为: ${getStatusDisplayName(newStatus)}`);
    await fetchOrders();
  } catch (err: any) {
    alert(`更新订单状态失败: ${err.response?.data?.message || err.message || '未知错误'}`);
    console.error('Error updating order status:', err);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* 样式保持不变 */
.merchant-order-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  color: #555;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  color: #007bff;
  background-color: #f8f8f8;
}

.tabs button.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: #eaf6ff;
}

.order-section {
  margin-top: 25px;
}

.order-section h3 {
  text-align: left;
  color: #444;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
}

.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.order-card {
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-card p {
  margin: 5px 0;
  color: #666;
}

.order-card p strong {
  color: #333;
}

.order-items {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.order-items h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #555;
  font-size: 1.1em;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items li {
  background-color: #f7f7f7;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95em;
  color: #444;
}

.order-card button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.order-card button:hover {
  background-color: #368e6b;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.button-group button {
  flex-grow: 1;
  min-width: 120px;
}

.no-orders {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style>