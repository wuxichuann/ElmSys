<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { restaurantApi } from '../api/restaurant.api';
import RestaurantCard from '../components/RestaurantCard.vue';
import { useAuthStore } from '../stores/auth.store'; // 导入认证 store

const restaurants = ref([]);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

const authStore = useAuthStore(); // 获取认证 store 实例

onMounted(async () => {
  try {
    const response = await restaurantApi.getAll();
    restaurants.value = response.data;
  } catch (error: any) {
    console.error("获取餐厅失败:", error);
    errorMessage.value = error.response?.data?.message || "加载餐厅失败，请稍后再试。";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="restaurants-page">
    <h1>发现餐厅</h1>
    
    <div class="auth-status">
      <p v-if="authStore.isLoggedIn">
        欢迎，{{ authStore.user?.username }}！
        <button @click="authStore.logout()">退出登录</button>
      </p>
      <p v-else>
        <router-link to="/login">登录</router-link> 或 
        <router-link to="/register">注册</router-link> 以开始点餐。
      </p>
    </div>

    <div v-if="isLoading" class="loading-message">正在加载餐厅信息...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="restaurants.length === 0" class="no-restaurants">暂无可用餐厅。</div>
    <div v-else class="restaurant-grid">
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.restaurant_id"
        :restaurant="restaurant"
      />
    </div>
  </div>
</template>

<style scoped>
.restaurants-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.auth-status {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
}

.auth-status p {
  margin: 0;
  color: #333;
}

.auth-status button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 15px;
  transition: background-color 0.3s ease;
}

.auth-status button:hover {
  background-color: #cf1322;
}

.auth-status a {
  color: #1890ff;
  text-decoration: none;
  font-weight: bold;
}

.auth-status a:hover {
  text-decoration: underline;
}

.loading-message, .no-restaurants, .error-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.error-message {
  color: #ff4d4f;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 600px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 响应式布局 */
  gap: 25px;
  justify-content: center; /* 居中网格 */
}
</style>