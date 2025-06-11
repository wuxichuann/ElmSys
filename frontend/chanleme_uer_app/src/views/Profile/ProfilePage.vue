<template>
  <div class="profile-page">
    <h2>个人信息</h2>

    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="userProfile" class="profile-details-card">
      <div class="profile-item">
        <strong>用户名:</strong> <span>{{ userProfile.username }}</span>
      </div>
      <div class="profile-item">
        <strong>姓名:</strong> <span>{{ userProfile.full_name || '未设置' }}</span>
      </div>
      <div class="profile-item">
        <strong>手机号:</strong> <span>{{ userProfile.phone_number || '未设置' }}</span>
      </div>
      <div class="profile-item">
        <strong>邮箱:</strong> <span>{{ userProfile.email || '未设置' }}</span>
      </div>
      <div class="profile-item">
        <strong>默认地址:</strong> <span>{{ userProfile.default_address || '未设置' }}</span>
      </div>
      <div class="profile-item">
        <strong>头像:</strong>
        <img v-if="userProfile.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="profile-avatar" />
        <span v-else>未设置</span>
      </div>

      <div class="profile-actions">
        <button @click="router.push('/profile/edit')" class="action-btn">修改个人信息</button>
        <button @click="router.push('/profile/change-password')" class="action-btn">修改密码</button>
      </div>
    </div>
    <div v-else-if="!loading">未能加载个人信息</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// !!! 确保这里导入了 User 类型 !!!
import { authService, type User } from '@/api/userApi';
import { useAuthStore } from '@/stores/authStore';

// !!! 移除这里多余的 UserProfile 接口定义 !!!
// interface UserProfile { /* ... 移除此部分 ... */ }

const router = useRouter();
const authStore = useAuthStore();

// userProfile 已经正确声明为 User 类型
const userProfile = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchUserProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await authService.getProfile();
    userProfile.value = response.data; // 这里的 response.data 应该匹配 User 类型
    authStore.setUser(response.data); // 更新store中的用户信息
  } catch (err: any) {
    error.value = err.message || '获取个人信息失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 优先从store加载，如果store没有，再从API获取
  if (authStore.user) {
    userProfile.value = authStore.user;
    loading.value = false;
  } else {
    fetchUserProfile();
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.profile-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.profile-details-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}
.profile-item {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
  display: flex;
  align-items: center;
}
.profile-item:last-child {
  border-bottom: none;
}
.profile-item strong {
  min-width: 80px;
  color: #555;
}
.profile-item span {
  color: #333;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
  border: 2px solid #eee;
}
.profile-actions {
  margin-top: 30px;
  text-align: center;
}
.action-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin: 0 10px;
  transition: background-color 0.3s ease;
}
.action-btn:hover {
  background-color: #0056b3;
}
</style>