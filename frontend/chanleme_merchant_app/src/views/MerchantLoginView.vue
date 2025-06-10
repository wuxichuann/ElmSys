<template>
  <div class="auth-container">
    <h2>商家登录</h2>
    <form @submit.prevent="handleLogin">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="form-group">
        <label for="identifier">账号:</label>
        <input id="identifier" v-model="formData.identifier" type="text" placeholder="用户名或手机号" required />
      </div>

      <div class="form-group">
        <label for="password">密码:</label>
        <input id="password" v-model="formData.password" type="password" placeholder="密码 (至少6位)" required />
      </div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '立即登录' }}
      </button>
    </form>
    <p class="switch-link">
      还没有商家账号？<router-link to="/register">立即注册</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const formData = reactive({
  identifier: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await axios.post('/auth/login', formData);
    
    const { token, user } = response.data;

    // 关键步骤：存储JWT和用户信息，注意使用不同的key
    localStorage.setItem('merchant_jwt_token', token);
    localStorage.setItem('merchant_user_info', JSON.stringify(user));

    alert('商家登录成功！');
    router.push('/'); // 登录成功后跳转到商家首页
  } catch (error: any) {
    console.error('商家登录失败:', error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || '登录失败，请检查账号或密码。';
    } else {
      errorMessage.value = '网络错误，请稍后再试。';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 样式与 MerchantRegisterView.vue 共享 */
.auth-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 24px;
}

.form-group {
  text-align: left;
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input {
  display: block;
  width: calc(100% - 20px);
  padding: 12px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #218838;
}

button[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: left;
  font-size: 14px;
}

.switch-link {
  margin-top: 25px;
  color: #666;
}

.switch-link a {
  color: #28a745;
  text-decoration: none;
  font-weight: bold;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>