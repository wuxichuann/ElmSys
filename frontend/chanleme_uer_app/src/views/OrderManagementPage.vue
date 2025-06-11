<template>
  <div class="order-management-page">
    <h2>我的订单</h2>

    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="orders.length" class="order-list">
      <div v-for="order in orders" :key="order.order_id" class="order-card" @click="goToOrderDetail(order.order_id)">
        <div class="order-header">
          <h3>订单号: {{ order.order_id }}</h3>
          <span :class="['order-status', order.status]">{{ formatStatus(order.status) }}</span>
        </div>
        <p>餐厅: {{ order.restaurant_name }}</p>
        <p>下单时间: {{ new Date(order.created_at).toLocaleString() }}</p>
        <p class="total-amount">总金额: ¥{{ Number(order.total_amount || 0).toFixed(2) }}</p>
        <div class="order-dishes">
          <span v-for="item in order.order_items" :key="item.menu_item_id">
            {{ item.menuItem?.name }} x {{ item.quantity }}
          </span>
        </div>
      </div>
    </div>
    <div v-else-if="!loading">暂无订单</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService, type Order } from '@/api/userApi';

const router = useRouter();
const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchUserOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const fetchedOrders = await orderService.getUserOrders();
    orders.value = fetchedOrders;
  } catch (err: any) {
    console.error('获取订单列表失败:', err);
    error.value = err.message || '获取订单列表失败';
  } finally {
    loading.value = false;
  }
};

const goToOrderDetail = (id: number) => {
  router.push(`/order/${id}`);
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '待确认',
    restaurant_confirmed: '餐厅已接单',
    preparing: '制作中',
    ready_for_pickup: '待取货',
    out_for_delivery: '配送中',
    delivered: '已送达',
    canceled: '已取消',
    // ...其他状态
  };
  return statusMap[status] || status;
};

onMounted(() => {
  fetchUserOrders();
});
</script>

<style scoped>
/* 样式保持不变 */
.order-management-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.order-list {
  margin-top: 20px;
}
.order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.order-header h3 {
  margin: 0;
  color: #333;
}
.order-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
  color: white;
}
/* 状态颜色 */
.pending { background-color: #ffc107; } /* Yellow */
.restaurant_confirmed { background-color: #17a2b8; } /* Info Blue */
.preparing { background-color: #007bff; } /* Primary Blue */
.ready_for_pickup { background-color: #6f42c1; } /* Purple */
.out_for_delivery { background-color: #28a745; } /* Success Green */
.delivered { background-color: #6c757d; } /* Secondary Gray */
.canceled { background-color: #dc3545; } /* Danger Red */

.order-card p {
  margin: 5px 0;
  color: #555;
  font-size: 0.95em;
}
.total-amount {
  font-size: 1.1em;
  font-weight: bold;
  color: #e44d26;
  margin-top: 10px;
}
.order-dishes {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
  font-size: 0.85em;
  color: #777;
}
.order-dishes span {
  margin-right: 10px;
  display: inline-block;
}
</style>