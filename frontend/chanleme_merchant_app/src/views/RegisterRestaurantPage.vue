<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import { RegisterDto, UserType } from '../types/auth'; 

const authStore = useAuthStore();
const router = useRouter();

// 用户账户信息
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const fullName = ref('');
const phoneNumberUser = ref(''); // 用户手机号
const userType = ref<UserType>(UserType.MERCHANT); // 默认为商家

// 餐厅信息
const restaurantName = ref('');
const description = ref('');
const address = ref('');
const phoneNumberRestaurant = ref(''); // 餐厅电话号码
const openingHours = ref('');

const registerError = ref<string | null>(null);
const registerSuccess = ref<string | null>(null);
const loading = ref(false);

const handleRegister = async () => {
  registerError.value = null;
  registerSuccess.value = null;

  if (password.value !== confirmPassword.value) {
    registerError.value = '两次输入的密码不一致！';
    return;
  }

  loading.value = true;
  try {
    const registerData = {
      user: {
        username: username.value,
        password: password.value,
        email: email.value,
        phone_number: phoneNumberUser.value,
        // user_type: userType.value,
        user_type: 'restaurant_admin', // 对应 RegisterDto 中的 user_type
        full_name: fullName.value, // <<< 新增：对应 RegisterDto 中的 full_name
      },
      restaurant: {
        restaurant_name: restaurantName.value,
        description: description.value,
        address: address.value,
        phone_number: phoneNumberRestaurant.value,
        opening_hours: openingHours.value,
      },
    };

    const success = await authStore.registerMerchantAndRestaurant(registerData);
    if (success) {
      registerSuccess.value = '注册成功！正在跳转至仪表盘...';
      // 注册成功后，因为已经获取了 token，可以直接跳转到仪表盘
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      registerError.value = authStore.error;
    }
  } catch (err: any) {
    registerError.value = err.response?.data?.message || '注册失败，请重试。';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-page">
    <Header>
      <router-link to="/login" class="header-link">返回登录</router-link>
    </Header>
    <div class="register-container">
      <h2>注册商家账户并创建餐厅</h2>
      <form @submit.prevent="handleRegister">
        <h3>账户信息</h3>
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="phone-number-user">用户手机号:</label>
          <input type="tel" id="phone-number-user" v-model="phoneNumberUser" required />
        </div>
        
        <div class="form-group">
            <label for="fullName">真实姓名:</label>
            <input id="fullName" v-model="fullName" type="text" required /> 
       </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">确认密码:</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required />
        </div>
        <div class="form-group">
        <label for="userType">用户类型:</label>
        <select type="user_type" id="userType" v-model="userType" required>
          <option :value="UserType.MERCHANT">商家</option>
          </select>
      </div>

        <h3>餐厅信息</h3>
        <div class="form-group">
          <label for="restaurant-name">餐厅名称:</label>
          <input type="text" id="restaurant-name" v-model="restaurantName" required />
        </div>
        <div class="form-group">
          <label for="description">描述:</label>
          <textarea id="description" v-model="description"></textarea>
        </div>
        <div class="form-group">
          <label for="address">地址:</label>
          <input type="text" id="address" v-model="address" required />
        </div>
        <div class="form-group">
          <label for="phone-number-restaurant">餐厅电话号码:</label>
          <input type="tel" id="phone-number-restaurant" v-model="phoneNumberRestaurant" required />
        </div>
        <div class="form-group">
          <label for="opening-hours">营业时间:</label>
          <input type="text" id="opening-hours" v-model="openingHours" placeholder="例如：09:00 - 22:00" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册商家和餐厅' }}
        </button>
        <p v-if="registerError" class="error-message">{{ registerError }}</p>
        <p v-if="registerSuccess" class="success-message">{{ registerSuccess }}</p>
      </form>
      <p class="login-prompt">
        已有账户？<router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.register-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 2rem;
  width: 100%;
  max-width: 600px; /* 适当增加最大宽度以容纳更多字段 */
  margin: 0 auto; /* 居中 */
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

h3 {
  color: #555;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  width: 100%;
  text-align: left;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

button {
  background-color: #2196F3;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1.5rem; /* 增加与上方表单的间距 */
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  background-color: #1976D2;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
  width: 100%;
}

.success-message {
  color: green;
  margin-top: 1rem;
  font-size: 0.9rem;
  width: 100%;
}

.login-prompt {
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #666;
  width: 100%;
}

.login-prompt a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-prompt a:hover {
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
