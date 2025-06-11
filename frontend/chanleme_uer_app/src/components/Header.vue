<template>
  <header class="app-header">
    <nav>
      <router-link to="/" class="logo-link">馋了么</router-link>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/cart">购物车 ({{ cartStore.totalItems }})</router-link>
        <router-link to="/orders">我的订单</router-link>
      </div>

      <div class="auth-section">
        <span v-if="authStore.isAuthenticated" class="auth-status">
          欢迎，{{ authStore.user?.username || '用户' }}！
          <router-link to="/profile" class="profile-link">个人中心</router-link>
          <button @click="logout" class="logout-btn">退出</button>
        </span>
        <span v-else class="auth-status">
          <router-link to="/login" class="auth-link">登录</router-link>
          <span class="auth-separator">|</span>
          <router-link to="/register" class="auth-link">注册</router-link>
        </span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login'); // 登出后跳转到登录页
};
</script>

<style scoped>
.app-header {
  background-color: #3498db;
  color: white;
  padding: 15px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.app-header nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}
.logo-link {
  font-size: 1.8em;
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin-right: 40px;
}
.nav-links a {
  color: white;
  text-decoration: none;
  margin-right: 25px;
  font-weight: 500;
  transition: text-decoration 0.2s ease;
}
.nav-links a:hover {
  text-decoration: underline;
}
.auth-section {
  display: flex;
  align-items: center;
}
.auth-status {
  font-size: 0.95em;
  display: flex;
  align-items: center;
}
.profile-link, .auth-link {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  font-weight: 500;
}
.profile-link:hover, .auth-link:hover {
  text-decoration: underline;
}
.auth-separator {
  margin: 0 5px;
  color: rgba(255, 255, 255, 0.7);
}
.logout-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 15px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}
</style>