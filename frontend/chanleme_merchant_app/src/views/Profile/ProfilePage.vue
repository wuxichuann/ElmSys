<template>
  <div class="profile-page container">
    <h2>个人信息</h2>
    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />

    <div v-if="userProfile && !loading" class="profile-details card">
      <p><strong>用户名:</strong> {{ userProfile.username }}</p>
      <p><strong>邮箱:</strong> {{ userProfile.email || '未设置' }}</p>
      <p><strong>手机号:</strong> {{ userProfile.phone || '未设置' }}</p>
      <p><strong>创建时间:</strong> {{ new Date(userProfile.created_at).toLocaleDateString() }}</p>
      <p><strong>更新时间:</strong> {{ new Date(userProfile.updated_at).toLocaleDateString() }}</p>

      <div v-if="userProfile.restaurant" class="restaurant-info">
        <h3>餐厅信息</h3>
        <p><strong>餐厅名称:</strong> {{ userProfile.restaurant.name }}</p>
        <p><strong>餐厅地址:</strong> {{ userProfile.restaurant.address }}</p>
        <p><strong>餐厅电话:</strong> {{ userProfile.restaurant.phone || '未设置' }}</p>
        <p><strong>餐厅描述:</strong> {{ userProfile.restaurant.description || '未设置' }}</p>
        <img v-if="userProfile.restaurant.image_url" :src="userProfile.restaurant.image_url" alt="餐厅图片" class="restaurant-image" />
      </div>

      <div class="profile-actions button-group">
        <button @click="goToEditProfile">编辑个人信息</button>
        <button @click="goToChangePassword">修改密码</button>
      </div>
    </div>
    <div v-else-if="!loading" class="no-profile">无法加载个人信息。</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userService } from '@/api/merchantApi'; // 使用商家端的 userService
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  restaurant?: { // 商家特有字段
    id: string;
    name: string;
    address: string;
    phone?: string;
    description?: string;
    image_url?: string;
  };
  // ...其他个人信息字段
}

const userProfile = ref<UserProfile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const fetchProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await userService.getProfile();
    userProfile.value = response.data;
    authStore.setUser(response.data); // 更新 Pinia store 中的用户数据
  } catch (err: any) {
    error.value = err.message || '获取个人信息失败';
  } finally {
    loading.value = false;
  }
};

const goToEditProfile = () => {
  router.push('/profile/edit');
};

const goToChangePassword = () => {
  router.push('/profile/change-password');
};

onMounted(() => {
  // 尝试从 store 获取，如果 store 中没有，再请求
  if (authStore.currentMerchantUser) {
    userProfile.value = authStore.currentMerchantUser;
    loading.value = false;
  } else {
    fetchProfile();
  }
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.profile-details {
  padding: 25px;
  text-align: left;
}

.profile-details p {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #555;
}

.profile-details p strong {
  color: #333;
  display: inline-block;
  min-width: 90px;
}

.restaurant-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #eee;
}

.restaurant-info h3 {
  color: #42b983;
  margin-bottom: 15px;
  font-size: 1.6em;
  text-align: center;
}

.restaurant-image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 20px auto 0;
  border: 1px solid #ddd;
}

.profile-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.profile-actions button {
  padding: 10px 20px;
  font-size: 1.1em;
  border-radius: 5px;
}

.profile-actions button:first-of-type {
  background-color: #007bff;
}

.profile-actions button:first-of-type:hover {
  background-color: #0056b3;
}

.profile-actions button:last-of-type {
  background-color: #6c757d;
}

.profile-actions button:last-of-type:hover {
  background-color: #5a6268;
}

.no-profile {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style>