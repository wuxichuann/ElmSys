<template>
  <div class="auth-container">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="identifier">用户名 / 手机号:</label>
        <input type="text" id="identifier" v-model="identifier" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? '登录中...' : '登录' }}
      </button>
      <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
      <p>
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter 用于登录成功后的跳转
import { useAuthStore } from '@/stores/authStore'; // 注意路径，这里应该是 @/stores/authStore

// 根据后端 LoginDto 定义，确保一致性
interface LoginDto {
  identifier: string;
  password: string;
}

const authStore = useAuthStore();
const router = useRouter(); // 获取 router 实例

const identifier = ref('');
const password = ref('');

const handleLogin = async () => {
  const loginData: LoginDto = {
    identifier: identifier.value,
    password: password.value,
  };
  try {
    await authStore.login(loginData);
    // 登录成功后，authStore.login 会将 token 和 user 存入 store
    // 并且我们通常会跳转到首页或其他受保护的页面
    router.push('/'); // 登录成功后跳转到首页
  } catch (err) {
    // 错误已在 store 中处理并设置到 error 状态，这里可以不额外处理
    // authStore.error 会自动显示在模板中
    console.error('登录组件捕获到错误:', err);
  }
};
</script>

<style scoped>
/*
 * 直接包含 LoginPage 的所有通用样式。
 */
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

input[type="text"],
input[type="password"],
input[type="email"],
input[type="tel"],
select {
  width: calc(100% - 20px); /* 减去 padding，使其在 full width 时不会超出 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; /* Ensures padding doesn't affect total width */
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

p {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

/* 确保 router-link 的样式通过 a 标签正确作用 */
a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>