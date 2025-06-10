<template>
  <div class="my-orders-page">
    <Header />
    <div class="container">
      <h1>我的订单</h1>
      <div v-if="isLoading" class="loading-spinner">加载中...</div>
      <div v-else-if="orders.length === 0" class="no-orders">
        <p>您还没有任何订单。</p>
      </div>
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.order_id" class="order-card">
          <div class="order-header">
            <h3>订单号: {{ order.order_id }}</h3>
            <span :class="['order-status', order.status]">{{ order.status }}</span>
          </div>
          <p class="order-restaurant">餐厅: {{ order.restaurants?.restaurant_name || '未知餐厅' }}</p>
          <p class="order-time">下单时间: {{ new Date(order.created_at).toLocaleString() }}</p>
          <p class="order-delivery-address">配送地址: {{ order.delivery_address }}</p>
          <div class="order-items-summary">
            <h4>订单详情:</h4>
            <ul>
              <li v-for="item in order.order_items" :key="item.order_item_id">
                {{ item.menu_items?.item_name || '未知菜品' }} x {{ item.quantity }} (¥{{ item.price_at_purchase }})
              </li>
            </ul>
          </div>
          <p class="order-total">总金额: ¥{{ order.total_amount }}</p>
          <p v-if="order.estimated_delivery_at">预计送达: {{ new Date(order.estimated_delivery_at).toLocaleString() }}</p>
          <p v-if="order.delivered_at">实际送达: {{ new Date(order.delivered_at).toLocaleString() }}</p>
          <p v-if="order.notes">备注: {{ order.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { orderApi } from '../api';
import { Order } from '../types/order.ts';
import Header from '../components/Header.vue';

const orders = ref<Order[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await orderApi.getMyOrders(); // 调用后端获取用户订单的 API
    orders.value = data;
  } catch (error) {
    console.error('获取我的订单失败:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.my-orders-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
  flex-grow: 1;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading-spinner, .no-orders {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 50px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.order-header h3 {
  font-size: 22px;
  color: #333;
  margin: 0;
}

.order-status {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  font-size: 14px;
}

/* 订单状态颜色 */
.order-status.placed { background-color: #007bff; }
.order-status.restaurant_confirmed { background-color: #ffc107; color: #333; }
.order-status.preparing { background-color: #17a2b8; }
.order-status.ready_for_pickup { background-color: #6f42c1; }
.order-status.out_for_delivery { background-color: #28a745; }
.order-status.delivered { background-color: #6c757d; }
.order-status.cancelled, .order-status.refunded { background-color: #dc3545; }

.order-card p {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
}

.order-items-summary {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.order-items-summary h4 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.order-items-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items-summary li {
  font-size: 15px;
  color: #666;
  margin-bottom: 5px;
}

.order-total {
  font-size: 20px;
  font-weight: bold;
  color: #e44d26;
  margin-top: 15px;
  text-align: right;
}
</style>