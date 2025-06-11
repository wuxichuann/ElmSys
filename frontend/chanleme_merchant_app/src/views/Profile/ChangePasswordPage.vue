<template>
  <div class="change-password-page container">
    <h2>修改密码</h2>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label for="oldPassword">旧密码:</label>
        <input type="password" id="oldPassword" v-model="oldPassword" required />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码:</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">确认新密码:</label>
        <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '修改中...' : '确认修改' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <button type="button" @click="router.back()" class="cancel-button">返回</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userService } from '@/api/merchantApi';
import { useAuthStore } from '@/stores/authStore'; // 假设修改密码成功后可能需要更新 auth 状态

const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const handleChangePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    error.value = '两次输入的新密码不一致';
    return;
  }
  if (newPassword.value.length < 6) {
    error.value = '新密码长度至少需要6位';
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await userService.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    successMessage.value = '密码修改成功！请重新登录。';
    // 密码修改成功后，强制用户重新登录以使新token生效
    authStore.clearToken();
    authStore.clearUser();
    setTimeout(() => {
      router.push('/login');
    }, 2000); // 2秒后跳转到登录页
  } catch (err: any) {
    error.value = err.message || '密码修改失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.change-password-page {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="password"] {
  width: calc(100% - 22px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  box-sizing: border-box;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.success-message {
  color: #28a745;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>