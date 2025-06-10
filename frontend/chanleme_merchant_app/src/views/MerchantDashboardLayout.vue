<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { onMounted, onBeforeUnmount } from 'vue'; // 如果需要Socket.IO
import { setupSocketConnection, disconnectSocket, getSocket } from '../utils/socket'; // 如果需要Socket.IO
import { useOrderStore } from '../stores/order'; // 如果需要Socket.IO

const authStore = useAuthStore();
const orderStore = useOrderStore(); // 如果需要Socket.IO
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// 如果需要Socket.IO实时更新，取消注释以下代码块
onMounted(() => {
  if (authStore.isAuthenticated && authStore.token) {
    setupSocketConnection(authStore.token);
    const socket = getSocket();
    if (socket) {
      socket.on('newOrder', (orderData) => {
        console.log('Socket received new order:', orderData);
        orderStore.addNewOrder(orderData);
      });
      socket.on('orderUpdated', (orderData) => {
        console.log('Socket received order update:', orderData);
        orderStore.updateOrderFromSocket(orderData);
      });
    }
  }
});

onBeforeUnmount(() => {
  disconnectSocket();
});

</script>

<template>
  <div class="merchant-dashboard-layout">
    <aside class="sidebar">
      <div class="logo">商家后台</div>
      <nav>
        <ul>
          <li><router-link to="/menu-management">菜品管理</router-link></li>
          <li><router-link to="/merchant/order-management">订单管理</router-link></li>
          </ul>
      </nav>
      <div class="logout-section">
        <button @click="handleLogout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="header">
        <h1>{{ $route.meta.title || '商家后台' }}</h1>
        <div class="user-info">
          <span>欢迎，{{ authStore.user?.username }}</span>
        </div>
      </header>
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.merchant-dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar .logo {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav li {
  margin-bottom: 10px;
}

.sidebar nav a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background-color: #34495e;
}

.sidebar .logout-section {
  margin-top: auto; /* Push to the bottom */
  text-align: center;
}

.sidebar .logout-section button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar .logout-section button:hover {
  background-color: #c0392b;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.user-info span {
  font-size: 16px;
  color: #555;
}

.page-content {
  flex-grow: 1;
  padding: 30px;
  background-color: #f0f2f5;
}
</style>