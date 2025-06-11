<template>
  <div class="edit-profile-page">
    <h2>修改个人信息</h2>
    <form @submit.prevent="handleSubmit" class="profile-form">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>
      <div class="form-group">
        <label for="fullName">姓名:</label>
        <input type="text" id="fullName" v-model="form.fullName" />
      </div>
      <div class="form-group">
        <label for="phoneNumber">手机号:</label>
        <input type="tel" id="phoneNumber" v-model="form.phoneNumber" />
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="form.email" />
      </div>
      <div class="form-group">
        <label for="address">地址:</label>
        <input type="text" id="address" v-model="form.address" />
      </div>
      <div class="form-group">
        <label for="avatarUrl">头像URL:</label>
        <input type="text" id="avatarUrl" v-model="form.avatarUrl" />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? '保存中...' : '保存修改' }}
        </button>
        <button type="button" @click="router.back()" class="cancel-btn">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
// 确保导入了 authService 和 User 类型
import { authService, type User } from '@/api/userApi';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// !!! 修改 form 对象，添加 fullName，并确保其他字段也准备好接收值 !!!
const form = reactive({
  username: '',
  fullName: '',   // 新增：用于绑定姓名输入框
  phoneNumber: '',
  email: '',
  address: '',
  avatarUrl: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const fetchUserProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await authService.getProfile();
    // !!! 修改：将后端返回的下划线命名字段映射到 form 的驼峰命名字段 !!!
    form.username = response.data.username || '';
    form.fullName = response.data.full_name || '';     // 映射 full_name
    form.phoneNumber = response.data.phone_number || ''; // 映射 phone_number
    form.email = response.data.email || '';
    form.address = response.data.default_address || ''; // 映射 default_address
    form.avatarUrl = response.data.avatar_url || '';     // 映射 avatar_url
  } catch (err: any) {
    error.value = err.message || '加载个人信息失败';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;
  try {
    // !!! 关键修改：构建一个符合后端期望的下划线命名对象 !!!
    const updateData: Partial<User> = { // 使用 Partial<User> 确保类型安全
      username: form.username,
      full_name: form.fullName,       // 转换 fullName 为 full_name
      phone_number: form.phoneNumber, // 转换 phoneNumber 为 phone_number
      email: form.email,
      default_address: form.address,  // 转换 address 为 default_address
      avatar_url: form.avatarUrl,     // 转换 avatarUrl 为 avatar_url
      // 不需要发送 userType, id 等字段，因为它们通常不能由用户直接修改
    };

    const response = await authService.updateProfile(updateData);
    authStore.setUser(response.data); // 更新store中的用户信息
    successMessage.value = '个人信息更新成功！';
    // 可以在几秒后自动跳转回 profile 页面
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  } catch (err: any) {
    console.error('更新个人资料失败:', err); // 打印详细错误信息
    error.value = err.message || '更新失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 如果store中已有用户信息，优先使用，否则从API获取
  if (authStore.user) {
    form.username = authStore.user.username || '';
    form.fullName = authStore.user.full_name || '';       // 映射 full_name
    form.phoneNumber = authStore.user.phone_number || ''; // 映射 phone_number
    form.email = authStore.user.email || '';
    form.address = authStore.user.default_address || '';  // 映射 default_address
    form.avatarUrl = authStore.user.avatar_url || '';     // 映射 avatar_url
    loading.value = false; // 因为是从store加载，所以不算加载中
  } else {
    fetchUserProfile();
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.edit-profile-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.profile-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}
.form-group input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}
.form-actions {
  text-align: right;
  margin-top: 30px;
}
.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}
.form-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}
.form-actions button[type="submit"]:hover {
  background-color: #218838;
}
.form-actions button[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.cancel-btn {
  background-color: #6c757d;
  color: white;
}
.cancel-btn:hover {
  background-color: #5a6268;
}
.error-message {
  color: #dc3545;
  margin-top: 10px;
  text-align: center;
}
.success-message {
  color: #28a745;
  margin-top: 10px;
  text-align: center;
}
</style>