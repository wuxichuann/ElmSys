<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart.store';
import { orderApi } from '../api/order.api';

const cartStore = useCartStore();
const router = useRouter();

const handleCheckout = async () => {
  const payload = cartStore.prepareOrderPayload(); // 获取准备好的订单数据

  if (payload) { // 只有当 payload 不为 null (即通过了前置检查) 时才发送请求
    try {
      await orderApi.create(payload); // 调用 API 发送下单请求
      alert("下单成功！");
      cartStore.clearCart(); // 清空购物车
      router.push('/order-success'); // 跳转到下单成功页
    } catch (error: any) {
      console.error("下单失败:", error);
      alert("下单失败: " + (error.response?.data?.message || error.message || "未知错误"));
    }
  }
};
</script>

<template>
  <div class="cart">
    <h3>购物车 ({{ cartStore.itemCount }})</h3>
    <div v-if="cartStore.itemCount > 0">
      <p class="restaurant-source">来自: <strong>{{ cartStore.restaurantName }}</strong></p>
      <ul class="cart-items-list">
        <li v-for="item in cartStore.items" :key="item.itemId" class="cart-item">
          <span class="item-name">{{ item.name }}</span>
          <div class="item-controls">
            <button @click="cartStore.decreaseQuantity(item.itemId)" class="quantity-btn">-</button>
            <span class="item-quantity">{{ item.quantity }}</span>
            <button @click="cartStore.increaseQuantity(item.itemId)" class="quantity-btn">+</button>
            <span class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </li>
      </ul>

      <p class="total-price">总计: <strong>¥{{ cartStore.totalPrice }}</strong></p>
      <button @click="handleCheckout" class="checkout-btn">去结算</button>
      <button @click="cartStore.clearCart()" class="clear-cart-btn">清空购物车</button>
    </div>
    <div v-else class="empty-cart-message">
      <p>购物车是空的</p>
    </div>
  </div>
</template>

<style scoped>
.cart {
  position: fixed; /* 固定在页面右侧 */
  right: 20px;
  top: 100px; /* 距离顶部一定距离 */
  width: 320px; /* 固定宽度 */
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保在其他内容之上 */
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.6em;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.restaurant-source {
  font-size: 0.95em;
  color: #666;
  margin-bottom: 15px;
}

.cart-items-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-name {
  font-weight: bold;
  color: #444;
  flex-grow: 1;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantity-btn {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #555;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover {
  background-color: #e0e0e0;
}

.item-quantity {
  font-size: 1em;
  font-weight: bold;
  color: #333;
  min-width: 20px;
  text-align: center;
}

.item-subtotal {
  font-weight: bold;
  color: #e44d26;
  margin-left: 10px;
  min-width: 60px;
  text-align: right;
}

.total-price {
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  text-align: right;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #f0f0f0;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #43a047;
}

.clear-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #f8f8f8;
  color: #888;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.clear-cart-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.empty-cart-message {
  text-align: center;
  color: #888;
  padding: 20px 0;
}
</style>