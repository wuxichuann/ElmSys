<template>
  <div class="restaurant-detail-page">
    <Header />
    <div class="container">
      <div v-if="isLoading" class="loading-spinner">加载中...</div>
      <div v-else-if="!restaurant" class="error-message">
        餐厅信息加载失败或不存在。
      </div>
      <div v-else class="content-wrapper">
        <div class="restaurant-info">
          <img :src="restaurant.logo_url || 'https://via.placeholder.com/300/FFC0CB/000000?text=No+Logo'" alt="Restaurant Logo" class="detail-logo" />
          <h1>{{ restaurant.restaurant_name }}</h1>
          <p class="description">{{ restaurant.description }}</p>
          <p class="address">地址: {{ restaurant.address }}</p>
          <p class="phone">电话: {{ restaurant.phone_number }}</p>
          <p class="hours">营业时间: {{ restaurant.opening_hours }}</p>
        </div>

        <div class="menu-items-section">
          <h2>菜单</h2>
          <div v-if="restaurant.menu_items && restaurant.menu_items.length === 0" class="no-menu-items">
            该餐厅暂无菜品或菜品已售罄。
          </div>
          <div v-else class="menu-grid">
            <div v-for="item in restaurant.menu_items" :key="item.item_id" class="menu-item-card">
              <img :src="item.image_url || 'https://via.placeholder.com/100/ADD8E6/000000?text=No+Image'" alt="Menu Item Image" class="item-image" />
              <div class="item-details">
                <h4>{{ item.item_name }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <p class="item-price">¥{{ (typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')).toFixed(2) }}</p>
                <button @click="addToCart(item)" :disabled="!item.is_available">
                  {{ item.is_available ? '加入购物车' : '已售罄' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cartStore.totalItems > 0" class="cart-summary-fixed" @click="goToCart">
        <span>购物车 ({{ cartStore.totalItems }} 件)</span>
        <span>¥{{ cartStore.cartTotal.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { restaurantService } from '@/api/userApi';
import { RestaurantDetail, MenuItem } from '@/types/restaurant';
import { useCartStore } from '@/stores/cartStore';
import Header from '@/components/Header.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const restaurant = ref<RestaurantDetail | null>(null);
const isLoading = ref(true);

// !!! 核心修改：将从路由参数获取的 ID 立即转换为数字类型 !!!
const restaurantId = ref<number>(parseInt(route.params.id as string)); 

const fetchRestaurantDetails = async () => {
  isLoading.value = true;
  try {
    // 确保这里传入的是 number 类型
    const response = await restaurantService.getRestaurantById(restaurantId.value);
    restaurant.value = response.data;
  } catch (error) {
    console.error('获取餐厅详情失败:', error);
    restaurant.value = null;
  } finally {
    isLoading.value = false;
  }
};

const addToCart = (item: MenuItem) => {
  if (cartStore.restaurantId && cartStore.restaurantId !== restaurant.value?.restaurant_id) {
    if (!confirm('购物车中已有其他餐厅的商品，是否清空购物车并添加此商品？')) {
      return;
    }
    cartStore.clearCart();
  }
  
  cartStore.addItem({
    productId: item.item_id,
    productName: item.item_name,
    price: item.price,
    quantity: 1,
    imageUrl: item.image_url,
    restaurantId: restaurant.value?.restaurant_id || '',
    restaurantName: restaurant.value?.restaurant_name || '',
  });
  alert(`${item.item_name} 已加入购物车！`);
};

const goToCart = () => {
  router.push('/cart');
};

onMounted(() => {
  fetchRestaurantDetails();
});

// 监听路由参数变化，如果用户直接在 URL 中修改了 ID，重新加载数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    // !!! 核心修改：在 watch 中也进行类型转换 !!!
    restaurantId.value = parseInt(newId as string); 
    fetchRestaurantDetails();
  }
});
</script>

<style scoped>
/* 样式部分保持不变 */
.restaurant-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  flex-grow: 1;
  position: relative;
}

.loading-spinner, .error-message, .no-menu-items {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 50px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.restaurant-info {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.detail-logo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 4px solid #eee;
}

.restaurant-info h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.restaurant-info p {
  font-size: 18px;
  color: #555;
  margin-bottom: 8px;
}

.menu-items-section {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.menu-items-section h2 {
  text-align: center;
  font-size: 30px;
  color: #333;
  margin-bottom: 25px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.menu-item-card {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex-shrink: 0;
  border-right: 1px solid #eee;
}

.item-details {
  padding: 15px;
  flex-grow: 1;
}

.item-details h4 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}

.item-details .item-description {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-details .item-price {
  font-size: 18px;
  color: #e44d26;
  font-weight: bold;
  margin-bottom: 15px;
}

.item-details button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}

.item-details button:hover:not(:disabled) {
  background-color: #218838;
}

.item-details button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cart-summary-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff5722;
  color: white;
  padding: 15px 25px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.3s;
}

.cart-summary-fixed:hover {
  background-color: #e64a19;
}
</style>