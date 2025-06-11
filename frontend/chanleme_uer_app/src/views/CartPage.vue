<template>
  <div class="cart-page">
    <Header />
    <div class="container">
      <h1>我的购物车</h1>
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>购物车还是空的，去 <router-link to="/">逛逛</router-link> 吧！</p>
      </div>
      <div v-else class="cart-content">
        <div class="cart-items-list">
          <div class="restaurant-name-header">
            来自: {{ currentRestaurantName }}
          </div>
          <div v-for="item in cartStore.items" :key="item.productId" class="cart-item">
            <img :src="item.imageUrl || 'https://via.placeholder.com/80'" alt="Item Image" class="cart-item-image" />
            <div class="item-details">
              <h4>{{ item.productName }}</h4>
              <p>单价: ¥{{ (typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')).toFixed(2) }}</p>
              <div class="quantity-controls">
                <button @click="cartStore.updateItemQuantity(item.productId, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="cartStore.updateItemQuantity(item.productId, item.quantity + 1)">+</button>
              </div>
              <p class="subtotal">小计: ¥{{ ((typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')) * item.quantity).toFixed(2) }}</p>
            </div>
            <button class="remove-button" @click="cartStore.removeItem(item.productId)">移除</button>
          </div>
        </div>

        <div class="checkout-summary">
          <h3>订单总览</h3>
          <p>商品数量: {{ cartStore.totalItems }} 件</p>
          <p class="total-amount">总金额: <span>¥{{ cartStore.cartTotal.toFixed(2) }}</span></p>

          <div class="form-group">
            <label for="deliveryAddress">配送地址:</label>
            <input type="text" id="deliveryAddress" v-model="deliveryAddress" required placeholder="请输入您的收货地址" />
          </div>
          <div class="form-group">
            <label for="paymentMethod">支付方式:</label>
            <select id="paymentMethod" v-model="paymentMethod">
              <option value="alipay">支付宝</option>
              <option value="wechatpay">微信支付</option>
              <option value="cash_on_delivery">货到付款</option>
            </select>
          </div>
          <div class="form-group">
            <label for="notes">备注 (可选):</label>
            <textarea id="notes" v-model="notes" rows="3" placeholder="例如：少放辣，不放香菜"></textarea>
          </div>

          <button class="checkout-button" @click="placeOrder" :disabled="isPlacingOrder || !deliveryAddress">
            {{ isPlacingOrder ? '下单中...' : '立即下单' }}
          </button>
          <p v-if="orderError" class="error-message">{{ orderError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore'; // 假设 @/stores 路径正确
import { useAuthStore } from '@/stores/auth'; // 假设 @/stores 路径正确
// !!! 核心修改：从 userApi 导入 service 和 DTO !!!
import { orderService, restaurantService, CreateOrderDto } from '@/api/userApi'; // 假设 @/api 路径正确
import Header from '@/components/Header.vue'; // 假设 @/components 路径正确
import router from '@/router'; // 假设 @/router 路径正确

const cartStore = useCartStore();
const authStore = useAuthStore();

const deliveryAddress = ref(authStore.user?.default_address || ''); // 尝试使用用户默认地址
const paymentMethod = ref('alipay');
const notes = ref('');
const isPlacingOrder = ref(false);
const orderError = ref<string | null>(null);

const currentRestaurantName = ref('加载中...'); // 用于显示餐厅名称

// CartPage.vue 的 onMounted 钩子中
onMounted(async () => {
  if (cartStore.restaurantId) {
    try {
      const response = await restaurantService.getRestaurantById(cartStore.restaurantId);
      // !!! 核心修改：改为 restaurant_name !!!
      currentRestaurantName.value = response.data.restaurant_name;
    } catch (error) {
      console.error('获取餐厅名称失败:', error);
      currentRestaurantName.value = '未知餐厅';
    }
  }
});

const placeOrder = async () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录才能下单！');
    router.push('/login');
    return;
  }
  if (!deliveryAddress.value.trim()) {
    alert('配送地址不能为空！');
    return;
  }
  if (!cartStore.restaurantId || cartStore.items.length === 0) { // 检查购物车是否为空
    alert('购物车为空，无法下单。');
    return;
  }

  isPlacingOrder.value = true;
  orderError.value = null;

  // !!! 核心修改：构建符合后端 CreateOrderDto 结构的数据 !!!
  const orderData: CreateOrderDto = {
    // 将 restaurant_id 改为 restaurantId
    restaurantId: cartStore.restaurantId,
    // 将 delivery_address 改为 deliveryAddress
    deliveryAddress: deliveryAddress.value,
    payment_method: paymentMethod.value, // 这个没有报错，保持不变
    items: cartStore.items.map(item => ({
      itemId: item.productId, // 这个没有报错，保持不变
      quantity: item.quantity,      // 这个没有报错，保持不变
    })),
    notes: notes.value.trim() !== '' ? notes.value : undefined,
  };

  try {
    // !!! 核心修改：使用 orderService.createOrder !!!
    const newOrder = await orderService.createOrder(orderData);
    alert(`订单创建成功！订单号: ${newOrder.data.order.order_id}`); // 假设 newOrder.data 是 Order 对象
    cartStore.clearCart(); // 下单成功后清空购物车
    router.push('/'); // 跳转到我的订单页面
  }catch (error: any) {
    orderError.value = error.response?.data?.message || '下单失败，请重试。';
    console.error('下单失败:', error); // 保留这行，提供上下文

    // !!! 核心修改：确保详细错误能够完整打印 !!!
    if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
      console.error('后端验证错误详情 (JSON):', JSON.stringify(error.response.data.errors, null, 2));
      // 如果你希望在 UI 上显示更友好的第一个错误信息，可以考虑：
      // if (error.response.data.errors.length > 0) {
      //   const firstError = error.response.data.errors[0];
      //   const property = firstError.property || '未知字段';
      //   const constraint = Object.values(firstError.constraints || {})[0] || '格式错误';
      //   orderError.value = `${error.response.data.message || '下单失败'}：${property} ${constraint}`;
      // }
    } else if (error.response?.data?.message) {
      console.error('后端返回消息:', error.response.data.message);
    }
  } finally {
    isPlacingOrder.value = false;
  }
};
</script>

<style scoped>
/* 样式部分保持不变 */
.cart-page {
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

.empty-cart {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #888;
}

.empty-cart a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.cart-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.cart-items-list {
  flex: 2; /* Takes more space */
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.restaurant-name-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.cart-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 15px;
}

.cart-item .item-details {
  flex-grow: 1;
}

.cart-item h4 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333;
}

.cart-item p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.quantity-controls button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: #e0e0e0;
}
.quantity-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.quantity-controls span {
  font-size: 16px;
  font-weight: bold;
  min-width: 25px;
  text-align: center;
}

.cart-item .subtotal {
  font-size: 16px;
  font-weight: bold;
  color: #e44d26;
  margin-top: 10px;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: #c82333;
}

.checkout-summary {
  flex: 1; /* Takes less space */
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  height: fit-content; /* Adjust height to content */
}

.checkout-summary h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.checkout-summary p {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.checkout-summary .total-amount {
  font-size: 20px;
  font-weight: bold;
  color: #e44d26;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.checkout-summary .total-amount span {
  float: right;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: calc(100% - 20px); /* Adjust for padding */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; /* Include padding in width */
}

.form-group textarea {
  resize: vertical; /* Allow vertical resizing */
}

.checkout-button {
  width: 100%;
  padding: 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.checkout-button:hover:not(:disabled) {
  background-color: #218838;
}

.checkout-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>