<!-- <template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// 这里可以留空，或者添加一些全局的布局、导航等
</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  color: #333;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
<!-- 
<script setup lang="ts">
import ShoppingCart from './components/ShoppingCart.vue';
import { useAuthStore } from './stores/auth.store'; // 导入认证 store
import { useRouter } from 'vue-router'; // 导入路由

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login'); // 登出后跳转到登录页
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <nav class="main-nav">
        <router-link to="/" class="nav-brand">馋了么</router-link>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <template v-if="authStore.isLoggedIn">
            <router-link to="/profile">个人中心</router-link>
            <span class="user-info">欢迎，{{ authStore.user?.username }}</span>
            <button @click="handleLogout" class="logout-btn">退出</button>
          </template>
          <template v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register">注册</router-link>
          </template>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <ShoppingCart />
  </div>
</template>

<style>
/* 全局样式 */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
  color: #333;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #4CAF50; /* 主题色 */
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  font-size: 1.8em;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
  padding: 5px 0;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #e6e6e6;
}

.user-info {
  font-size: 1em;
  color: #e6e6e6;
}

.logout-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #cf1322;
}

.app-main {
  flex-grow: 1; /* 让主内容区占据剩余空间 */
  padding-bottom: 20px; /* 为购物车留出底部空间 */
}
</style> -->

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑，Header组件已在各页面引入
</script>

<style>
/* 你可以在这里放置一些App级别的全局样式，或者在 index.css 中 */
</style>