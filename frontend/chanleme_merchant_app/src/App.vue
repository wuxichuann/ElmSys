<template>
  <div id="merchant-app">
    <header v-if="authStore.isAuthenticated" class="app-header">
      <nav>
        <router-link to="/">订单管理</router-link>
        <router-link to="/dishes">菜品管理</router-link>
        <router-link to="/profile">个人信息</router-link>
        <button @click="logout" class="logout-button">退出登录</button>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.clearToken();
  authStore.clearUser();
  router.push('/login');
};
</script>

<style>
/* 全局样式可以放在这里，或在 main.css 中 */
#merchant-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.app-header {
  background-color: #42b983;
  padding: 15px 20px;
  color: white;
  display: flex;
  justify-content: center;
  gap: 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  transition: background-color 0.3s ease;
}

.app-header nav a.router-link-exact-active,
.app-header nav a:hover {
  background-color: #368e6b;
  border-radius: 4px;
}

.logout-button {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: white;
  color: #42b983;
}

.app-main {
  padding: 20px;
  margin-top: 80px; /* 留出顶部导航栏的空间 */
}

/* 基础表单和按钮样式 */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="number"],
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>