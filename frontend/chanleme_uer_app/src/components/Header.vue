<template>
  <header class="main-header">
    <div class="header-container">
      <router-link to="/" class="logo">馋了么</router-link>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">首页</router-link></li>
          <li v-if="authStore.isAuthenticated && authStore.isCustomer">
            <router-link to="/my-orders">我的订单</router-link>
          </li>
          <li v-if="authStore.isAuthenticated">
            <button @click="authStore.logout()" class="logout-button">退出登录</button>
          </li>
          <li v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register-link">注册</router-link>
          </li>
          <li class="cart-icon" v-if="authStore.isCustomer && cartStore.totalItems > 0">
            <router-link to="/cart">
              🛒
              <span class="cart-count">{{ cartStore.totalItems }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

<style scoped>
.main-header {
  background-color: #333;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 25px; /* Adjust spacing between nav items */
}

.nav-links li a, .nav-links li button {
  color: white;
  text-decoration: none;
  font-size: 17px;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-links li a:hover, .nav-links li button:hover {
  background-color: #555;
}

.nav-links li button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-links .register-link {
  background-color: #007bff;
}

.nav-links .register-link:hover {
  background-color: #0056b3;
}

.cart-icon {
  position: relative;
  font-size: 24px;
}

.cart-icon .cart-count {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #ff5722;
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
</style>