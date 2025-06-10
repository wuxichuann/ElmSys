<!-- <template>
  <div class="login-page">
    <Header />
    <div class="login-container">
      <h2>商家登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="identifier">用户名 / 手机号:</label>
          <input type="text" id="identifier" v-model="identifier" required />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      <p class="register-link">
        还没有账号？<router-link to="/register-merchant">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { UserType } from '../types/auth'; // 导入 UserType 枚举
import Header from '../components/Header.vue';

const identifier = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const success = await authStore.login({ identifier: identifier.value, password: password.value });
    if (success) {
      if (authStore.user?.user_type === UserType.RESTAURANT_ADMIN) {
        router.push('/dashboard');
      } else {
        error.value = '您不是商家管理员账号，请使用正确的登录入口。';
        authStore.clearAuth(); // 清除非商家管理员的认证信息
      }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '登录失败，请检查账号和密码。';
    console.error('登录错误:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 样式与之前相同 */
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}
h2 {
  color: #333;
  margin-bottom: 25px;
}
.form-group {
  margin-bottom: 20px;
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
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 12px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover:not(:disabled) {
  background-color: #e64a19;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.error-message {
  color: #dc3545;
  margin-top: 15px;
  font-size: 14px;
}
.register-link {
  margin-top: 20px;
  font-size: 15px;
  color: #666;
}
.register-link a {
  color: #007bff;
  text-decoration: none;
}
.register-link a:hover {
  text-decoration: underline;
}
</style> -->
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';

const authStore = useAuthStore();
const router = useRouter();

// 虽然输入框的 v-model 仍然是 username，
// 但在发送数据时，我们会将其映射到 identifier
const username = ref(''); // 这个 ref 实际上对应后端 LoginDto 的 identifier
const password = ref('');
const loginError = ref<string | null>(null);

const handleLogin = async () => {
  loginError.value = null;
  
  // !!! 关键修改：将 'username' 字段名改为 'identifier' !!!
  const success = await authStore.login({ identifier: username.value, password: password.value });
  
  if (!success) {
    loginError.value = authStore.error;
  }
  // 成功后路由守卫会处理跳转
  // 注意：如果仪表盘路径不是 '/dashboard'，你需要修改 router.push 的目标
  // 例如：如果商家登录后去 /merchant/dashboard
  // if (success) {
  //   router.push('/merchant/dashboard'); 
  // }
};
</script>

<template>
  <div class="login-page">
    <Header>
      <router-link to="/register" class="header-link">注册商家和餐厅</router-link>
    </Header>
    <div class="login-container">
      <h2>商家登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </form>
      <p class="register-prompt">
        还没有账户和餐厅？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 你的样式保持不变 */
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

.form-group input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 400px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.register-prompt {
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #666;
}

.register-prompt a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-prompt a:hover {
  text-decoration: underline;
}

.header-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  margin-left: 20px;
}

.header-link:hover {
  text-decoration: underline;
}
</style>