<template>
  <div class="change-password-page">
    <h2>修改密码</h2>
    <form @submit.prevent="handleSubmit" class="password-form">
      <div class="form-group">
        <label for="oldPassword">旧密码:</label>
        <input type="password" id="oldPassword" v-model="form.oldPassword" required />
      </div>
      <div class="form-group">
        <label for="newPassword">新密码:</label>
        <input type="password" id="newPassword" v-model="form.newPassword" required minlength="6" />
        <small class="hint">密码至少需要6位</small>
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">确认新密码:</label>
        <input type="password" id="confirmNewPassword" v-model="form.confirmNewPassword" required />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? '修改中...' : '确认修改' }}
        </button>
        <button type="button" @click="router.back()" class="cancel-btn">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// !!! 修正：将 userService 替换为 authService !!!
import { authService } from '@/api/userApi';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  if (form.newPassword.length < 6) {
    error.value = '新密码长度至少为6位';
    loading.value = false;
    return;
  }

  if (form.newPassword !== form.confirmNewPassword) {
    error.value = '两次输入的新密码不一致';
    loading.value = false;
    return;
  }

  try {
    // !!! 修正：调用 authService.changePassword !!!
    await authService.changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    successMessage.value = '密码修改成功，请重新登录！';
    // 密码修改成功后，强制用户重新登录
    authStore.clearToken();
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err: any) {
    error.value = err.message || '密码修改失败，请检查旧密码或网络连接';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 样式保持不变 */
.change-password-page {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}
.password-form {
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
.form-group .hint {
  font-size: 0.85em;
  color: #888;
  margin-top: 5px;
  display: block;
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
  background-color: #007bff;
  color: white;
}
.form-actions button[type="submit"]:hover {
  background-color: #0056b3;
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