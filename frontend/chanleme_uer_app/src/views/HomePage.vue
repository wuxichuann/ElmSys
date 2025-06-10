<template>
  <div class="home-page">
    <Header />
    <div class="container">
      <h1>美味尽在掌中</h1>
      <div class="search-bar">
        <input type="text" v-model="searchKeyword" placeholder="搜索餐厅名称或菜品" @keyup.enter="handleSearch" />
        <button @click="handleSearch">搜索</button>
      </div>

      <div class="restaurants-grid">
        <div v-if="isLoading" class="loading-spinner">加载中...</div>
        <div v-else-if="restaurants.length === 0" class="no-results">
          没有找到符合条件的餐厅。
        </div>
        <div v-else v-for="restaurant in restaurants" :key="restaurant.restaurant_id" class="restaurant-card">
          <router-link :to="`/restaurants/${restaurant.restaurant_id}`">
            <img :src="restaurant.logo_url || 'https://via.placeholder.com/150/FFC0CB/000000?text=No+Logo'" alt="Restaurant Logo" class="restaurant-logo" />
            <h3>{{ restaurant.restaurant_name }}</h3>
            <p class="description">{{ restaurant.description }}</p>
            <p class="address">{{ restaurant.address }}</p>
            <p class="hours">营业时间: {{ restaurant.opening_hours }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { restaurantApi } from '../api';
import { Restaurant, SearchRestaurantDto } from '../types/restaurant.ts';
import Header from '../components/Header.vue'; // 假设你有一个公共 Header 组件

const restaurants = ref<Restaurant[]>([]);
const isLoading = ref(true);
const searchKeyword = ref('');

const fetchRestaurants = async (params?: SearchRestaurantDto) => {
  isLoading.value = true;
  try {
    const response = await restaurantApi.getRestaurants(params);
    // 后端如果返回分页数据 { data: [], total: ... }，则取 response.data
    // 如果只返回数组，则直接使用 response
    restaurants.value = Array.isArray(response) ? response : response.data;
  } catch (error) {
    console.error('获取餐厅列表失败:', error);
    restaurants.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  const params: SearchRestaurantDto = {};
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value;
  }
  fetchRestaurants(params);
};

onMounted(() => {
  fetchRestaurants();
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  flex-grow: 1; /* Make container take available space */
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.search-bar input {
  width: 500px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #007bff;
}

.search-bar button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.restaurant-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-card a {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 20px;
}

.restaurant-logo {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.restaurant-card h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.restaurant-card p {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.restaurant-card .description {
  height: 40px; /* Limit description height */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Keep description on one line */
}

.restaurant-card .address {
  font-weight: bold;
}

.loading-spinner, .no-results {
  grid-column: 1 / -1; /* Span all columns */
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 50px;
}
</style>