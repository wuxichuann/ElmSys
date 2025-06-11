<template>
  <div class="login-container container">
    <h2>商家登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="identifier">账号 (用户名/手机号):</label>
        <input type="text" id="identifier" v-model="identifier" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p>
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService, userService } from '@/api/merchantApi'; // 导入 merchantApi 中的 authService
import { useAuthStore } from '@/stores/authStore';

const identifier = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await authService.login({
      identifier: identifier.value,
      password: password.value,
    });
    authStore.setToken(response.data.token);

    // 登录成功后获取用户资料并存储到 store
    const profileResponse = await userService.getProfile();
    authStore.setUser(profileResponse.data);

    router.push('/'); // 登录成功跳转到订单管理页
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查账号和密码';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: white;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: calc(100% - 20px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box; /* Ensures padding doesn't increase total width */
}

button {
  background-color: #42b983;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #368e6b;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

p {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

p a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

p a:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>