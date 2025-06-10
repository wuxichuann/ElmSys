<template>
  <div class="auth-container">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required minlength="6" />
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="phoneNumber">手机号:</label>
        <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
      </div>
      <div class="form-group">
        <label for="fullName">真实姓名:</label>
        <input type="text" id="fullName" v-model="fullName" required />
      </div>
      <div class="form-group">
        <label for="userType">用户类型:</label>
        <select id="userType" v-model="userType" required>
          <option :value="UserType.CUSTOMER">顾客</option>
          <option :value="UserType.COURIER">骑手</option>
          </select>
      </div>
      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? '注册中...' : '注册' }}
      </button>
      <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
      <p>
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { RegisterDto, UserType } from '../types/auth'; // 确保 UserType 从这里导入

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const email = ref('');
const phoneNumber = ref('');
const fullName = ref('');
const userType = ref<UserType>(UserType.CUSTOMER); // 默认为顾客

const handleRegister = async () => {
  const registerData: RegisterDto = {
    username: username.value,
    password: password.value,
    email: email.value,
    phone_number: phoneNumber.value,
    full_name: fullName.value,
    user_type: userType.value,
  };
  try {
    await authStore.register(registerData);
  } catch (err) {
    // 错误已在 store 中处理
  }
};
</script>

<style scoped>
/*
  注意：由于你选择了直接复制，此处的样式是 LoginPage.vue 中包含的所有通用样式。
  如果 LoginPage.vue 中有你不需要在 RegisterPage.vue 中使用的特定样式，
  你需要手动移除它们。
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
  width: calc(100% - 20px);
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

/* 注意：在 <style scoped> 中直接写 router-link 会将其视为一个 HTML 标签。
   Vue Router 的 <router-link> 是一个组件，它的样式通常通过类名来控制。
   我已在上面提供的 LoginPage.vue 中修复了这个问题，改用全局 a 标签样式或明确的类。
   为了保持一致性，这里我也做了修改，确保链接样式能正常作用。
*/
a { /* 这里的 'a' 选择器会作用于 <router-link> 渲染出来的 <a> 标签 */
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>