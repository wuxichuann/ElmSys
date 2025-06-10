<script setup lang="ts">
import { defineProps } from 'vue';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  description: string;
  logo_url?: string;
  address: string;
  phone_number: string;
  opening_hours?: string;
  is_active: boolean;
  // ... 其他餐厅属性
}

defineProps<{
  restaurant: Restaurant;
}>();
</script>

<template>
  <router-link :to="`/restaurants/${restaurant.restaurant_id}`" class="card-link">
    <div class="restaurant-card">
      <img 
        :src="restaurant.logo_url || 'https://via.placeholder.com/300x200.png?text=No+Image'" 
        :alt="restaurant.restaurant_name"
        class="card-image"
      />
      <div class="card-content">
        <h3>{{ restaurant.restaurant_name }}</h3>
        <p class="description">{{ restaurant.description }}</p>
        <div class="info-row">
            <span class="info-label">地址:</span>
            <span class="info-value">{{ restaurant.address }}</span>
        </div>
        <div class="info-row" v-if="restaurant.opening_hours">
            <span class="info-label">营业时间:</span>
            <span class="info-value">{{ restaurant.opening_hours }}</span>
        </div>
        <div class="status-indicator" :class="{ 'active': restaurant.is_active, 'inactive': !restaurant.is_active }">
            {{ restaurant.is_active ? '营业中' : '休息中' }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}

.restaurant-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards are same height in grid */
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-image {
  width: 100%;
  height: 180px; /* Consistent image height */
  object-fit: cover;
  display: block;
  border-bottom: 1px solid #eee;
}

.card-content {
  padding: 15px;
  flex-grow: 1; /* Allow content to take up available space */
  display: flex;
  flex-direction: column;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5em;
}

.description {
  font-size: 0.9em;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  flex-grow: 1; /* Allow description to grow */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 0.9em;
    color: #555;
}

.info-label {
    font-weight: bold;
    margin-right: 8px;
    color: #444;
}

.status-indicator {
    font-size: 0.85em;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    margin-top: 10px;
    align-self: flex-start; /* Align to the start of the flex container */
}

.status-indicator.active {
    background-color: #e6ffe6;
    color: #28a745;
    border: 1px solid #28a745;
}

.status-indicator.inactive {
    background-color: #ffe6e6;
    color: #dc3545;
    border: 1px solid #dc3545;
}
</style>