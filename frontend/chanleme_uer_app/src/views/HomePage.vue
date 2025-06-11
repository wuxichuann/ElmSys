<template>
  <div class="homepage">
    <Header />
    <div class="container">
      <h2>所有餐厅</h2>
      <div v-if="isLoading" class="loading-spinner">加载中...</div>
      <div v-else-if="error" class="error-message">
        错误: {{ error }}
      </div>
      <div v-else-if="restaurants && restaurants.length > 0" class="restaurant-grid">
        <div v-for="restaurant in restaurants" :key="restaurant.restaurant_id" class="restaurant-card">
          <router-link :to="`/restaurants/${restaurant.restaurant_id}`">
            <img :src="restaurant.logo_url || 'https://via.placeholder.com/200/FFC0CB/000000?text=No+Logo'" alt="Restaurant Logo" class="restaurant-logo" />
            <h3>{{ restaurant.restaurant_name }}</h3>
            <p class="description">{{ restaurant.description }}</p>
            <p class="address">{{ restaurant.address }}</p>
            <p class="hours">营业时间: {{ restaurant.opening_hours }}</p>
          </router-link>
        </div>
      </div>
      <div v-else class="no-restaurants">
        抱歉，目前没有可用的餐厅。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { restaurantService } from '@/api/userApi'; // 确保路径正确
import Header from '@/components/Header.vue'; // 确保路径正确

// 假设后端列表接口返回的ID是 'restaurant_id' 且是数字类型
// 根据最新的控制台日志，这个接口定义是正确的
interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  description: string;
  address: string;
  opening_hours: string;
  logo_url?: string;
  phone_number: string;
}

const restaurants = ref<Restaurant[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 如果你在模板中使用了 searchKeyword，这里必须声明它。否则，如果模板中没有使用，可以删除这一行。
// const searchKeyword = ref(''); 

const fetchRestaurants = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await restaurantService.getRestaurants();

    // !!! 最核心的修复在这里：直接使用 response.data，因为它本身就是数组 !!!
    // 移除之前的 Array.isArray(response.data.data) 检查
    if (response.data && Array.isArray(response.data)) { // 检查 response.data 是否存在且是数组
      restaurants.value = response.data; // 直接赋值 response.data
      console.log('Homepage: 成功获取并设置餐厅数据:', restaurants.value);
    } else {
      // 如果 response.data 不是数组，则认为数据格式不正确
      console.error('Homepage: API 响应数据格式不符合预期:', response.data);
      error.value = '服务器返回数据格式不正确，或没有餐厅数据。';
      restaurants.value = []; // 清空餐厅数据，避免后续访问 undefined 报错
    }

  } catch (err: any) {
    console.error('Homepage: 获取餐厅列表失败:', err);
    error.value = err.message || '获取餐厅列表失败';
    restaurants.value = []; // 出现错误时也清空数据
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRestaurants();
});
</script>

<style scoped>
/* 样式部分保持不变 */
.homepage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  flex-grow: 1;
}

h2 {
  text-align: center;
  font-size: 36px;
  color: #333;
  margin-bottom: 30px;
}

.loading-spinner, .error-message, .no-restaurants {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 50px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.restaurant-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.restaurant-card a {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.restaurant-logo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.restaurant-card h3 {
  font-size: 24px;
  color: #333;
  margin: 15px 15px 5px;
  text-align: center;
}

.restaurant-card .description,
.restaurant-card .address,
.restaurant-card .hours {
  font-size: 15px;
  color: #666;
  margin: 0 15px 10px;
  line-height: 1.5;
}

.restaurant-card .description {
  flex-grow: 1;
}
</style>