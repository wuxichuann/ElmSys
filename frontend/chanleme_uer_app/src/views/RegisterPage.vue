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
        <label for="confirmPassword">确认密码:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="phoneNumber">手机号:</label> <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
      </div>
      <div class="form-group">
        <label for="fullName">真实姓名:</label> <input type="text" id="fullName" v-model="fullName" required />
      </div>
      <div class="form-group">
        <label for="userType">用户类型:</label> <select id="userType" v-model="userType" required>
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// 定义 UserType 枚举，根据后端 RegisterDto 中的 user_type 字段可能的值
// 注意：这里的枚举值要和后端 user-type.enum.ts 中的保持一致
enum UserType {
  CUSTOMER = 'customer',
  COURIER = 'courier',
  RESTAURANT_ADMIN = 'restaurant_admin', // 如果后端有这个类型，也需要加上
}

// !!! 重点修改这里 !!!
// 定义 RegisterDto 接口，现在与后端 `backend\src\dto\auth\register.dto.ts` 严格对应
interface RegisterDto {
  username: string;
  password: string;
  email: string;
  phone_number: string; // <-- 修改为下划线命名
  full_name: string;    // <-- 修改为下划线命名
  user_type: UserType;  // <-- 修改为下划线命名
}

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const phoneNumber = ref(''); // 这个 ref 变量名可以保持驼峰命名，它只用于前端的 v-model 绑定
const fullName = ref('');    // 这个 ref 变量名可以保持驼峰命名
const userType = ref<UserType>(UserType.CUSTOMER); // 这个 ref 变量名可以保持驼峰命名

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = '两次输入的密码不一致';
    return;
  }
  if (password.value.length < 6) {
    authStore.error = '密码至少需要6位';
    return;
  }
  
  // !!! 重点修改这里 !!!
  // 组装数据时，使用与后端 DTO 匹配的下划线命名
  const registerData: RegisterDto = {
    username: username.value,
    password: password.value,
    email: email.value,
    phone_number: phoneNumber.value, // <-- 使用 ref 变量的值，但字段名匹配后端
    full_name: fullName.value,      // <-- 使用 ref 变量的值，但字段名匹配后端
    user_type: userType.value,      // <-- 使用 ref 变量的值，但字段名匹配后端
  };

  try {
    await authStore.register(registerData);
    alert('注册成功！请登录。');
    router.push('/login');
  } catch (err: any) {
    console.error('注册组件捕获到错误:', err);
  }
};
</script>

<style scoped>
/* 样式部分保持不变 */
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
  box-sizing: border-box;
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

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>