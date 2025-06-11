<template>
  <div id="app">
    <header class="app-header">
      <nav>
        <router-link to="/">首页</router-link>
        <template v-if="currentApp === 'user'">
          <router-link to="/cart">购物车</router-link>
          <router-link to="/orders">我的订单</router-link>
        </template>
        <template v-else-if="currentApp === 'merchant'">
          <router-link to="/dishes">菜品管理</router-link>
        </template>
        <template v-else-if="currentApp === 'rider'">
          <router-link to="/tasks">我的任务</router-link>
        </template>

        <router-link to="/profile">个人中心</router-link>

        <span v-if="authStore.isAuthenticated" class="auth-status">
          欢迎，{{ authStore.user?.username || '用户' }}！
          <button @click="logout">退出</button>
        </span>
        <span v-else class="auth-status">
          <router-link to="/login">登录</router-link> |
          <router-link to="/register">注册</router-link>
        </span>
      </nav>
    </header>
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 根据当前路由判断是哪个应用，用于控制导航显示
const currentApp = computed(() => {
  if (route.path.startsWith('/merchant')) return 'merchant'; // 示例，实际应根据应用名称判断
  if (route.path.startsWith('/rider')) return 'rider'; // 示例
  return 'user';
});

const logout = () => {
  authStore.clearToken();
  authStore.clearUser();
  router.push('/login');
};
</script>

<style>
/* 基本样式，您可以根据需要美化 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  color: #333;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-header {
  background-color: #3498db;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.app-header nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header nav a {
  color: white;
  text-decoration: none;
  margin-right: 20px;
  font-weight: bold;
}
.app-header nav a:hover {
  text-decoration: underline;
}
.auth-status {
  margin-left: auto;
}
.auth-status button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
.app-content {
  flex-grow: 1;
  padding: 20px;
}
</style>