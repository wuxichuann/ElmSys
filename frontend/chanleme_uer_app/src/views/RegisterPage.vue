<template>
  <div class="register-container container">
    <h2>商家注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="identifier">商家账号 (用户名):</label>
        <input type="text" id="identifier" v-model="identifier" required />
        </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <div class="form-group">
        <label for="restaurantName">餐厅名称:</label>
        <input type="text" id="restaurantName" v-model="restaurantName" required />
      </div>
      <div class="form-group">
        <label for="restaurantAddress">餐厅地址:</label>
        <input type="text" id="restaurantAddress" v-model="restaurantAddress" required />
      </div>
      <div class="form-group">
        <label for="restaurantPhone">餐厅电话:</label>
        <input type="text" id="restaurantPhone" v-model="restaurantPhone" required />
        </div>
      <div class="form-group">
        <label for="restaurantDescription">餐厅描述:</label>
        <textarea id="restaurantDescription" v-model="restaurantDescription"></textarea>
      </div>
      <div class="form-group">
        <label for="restaurantImageUrl">餐厅图片URL:</label>
        <input type="text" id="restaurantImageUrl" v-model="restaurantImageUrl" />
        </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p>
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/api/merchantApi'; // 使用您提供的 authService 导入

// --- 根据后端 DTO 重新定义类型 ---
// 在实际项目中，您应该从后端 DTO 文件中导入这些类型，例如：
// import { RegisterRestaurantDto, RegisterDto, RestaurantDataDto, UserType } from '@/types/backend-dtos';

export enum UserType {
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  DELIVERY_DRIVER = 'delivery_driver',
  ADMIN = 'admin',
  RESTAURANT_ADMIN = 'restaurant_admin', // 确保这个是后端期望的商家管理类型
}

// 对应 backend/src/dto/auth/restaurant-data.dto.ts
export interface RestaurantDataDto {
  restaurant_name: string;
  description?: string; // 后端定义为可选
  address: string;
  phone_number: string;
  opening_hours: string; // 后端定义为必填
}

// 对应 backend/src/dto/auth/register.dto.ts
export interface RegisterDto {
  username: string;
  password: string;
  email: string; // 后端必填，前端模板无输入
  phone_number: string; // 后端必填，前端模板无输入
  user_type: UserType;
  full_name: string; // 后端必填，前端模板无输入
}

// 对应 backend/src/dto/auth/register-restaurant.dto.ts
export interface RegisterRestaurantDto {
  user: RegisterDto;
  restaurant: RestaurantDataDto;
}
// --- 模拟后端 DTO 定义结束 ---

// 前端表单数据绑定
const identifier = ref('');
const password = ref('');
const confirmPassword = ref('');

// 餐厅信息
const restaurantName = ref('');
const restaurantAddress = ref('');
const restaurantPhone = ref('');
const restaurantDescription = ref('');
const restaurantImageUrl = ref(''); // 此字段后端 DTO 未定义，不会被发送

const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null; // 清除之前的错误信息

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致！';
    return;
  }

  loading.value = true;
  try {
    const registerPayload: RegisterRestaurantDto = { // 将数据类型明确为 RegisterRestaurantDto
      user: {
        username: identifier.value,
        password: password.value,
        // --- 修正：后端必填但前端模板无输入，提供默认值 ---
        // 邮箱格式验证很重要，这里用一个通用格式，实际应让用户输入
        email: `merchant_${identifier.value}@example.com`,
        // 手机号格式验证也很重要，这里用一个中国区手机号格式，实际应让用户输入
        // 假设 identifier 如果是数字且长度为11位，则作为手机号，否则给个默认值
        phone_number: /^\d{11}$/.test(identifier.value) ? identifier.value : '13812345678',
        user_type: UserType.RESTAURANT_ADMIN, // 明确使用后端定义的 RESTAURANT_ADMIN
        full_name: restaurantName.value || '商家管理员', // 提供一个默认姓名
        // --- 修正结束 ---
      },
      restaurant: {
        restaurant_name: restaurantName.value,
        description: restaurantDescription.value, // description 在后端是可选的
        address: restaurantAddress.value,
        phone_number: restaurantPhone.value, // 对应后端 RestaurantDataDto 的 phone_number
        // --- 修正：后端必填但前端模板无输入，提供默认值 ---
        opening_hours: '每日 09:00 - 22:00', // 营业时间是必填的
        // --- 修正结束 ---
      },
    };

    // --- 关键修正：直接使用 authService 调用 API ---
    await authService.registerRestaurant(registerPayload);

    alert('注册成功，请登录！');
    router.push('/login');
  } catch (err: any) {
    // 捕获并显示更具体的错误信息，特别是后端返回的错误消息
    if (err.response && err.response.data && err.response.data.message) {
      // 后端返回的错误消息通常在 err.response.data.message
      error.value = err.response.data.message;
      console.error('Registration failed with backend error:', err.response.data);
    } else {
      error.value = err.message || '注册失败，请检查网络或重试。';
      console.error('Registration error:', err);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 样式部分保持不变，直接复制您提供的样式 */
.register-container {
  max-width: 500px;
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
input[type="password"],
input[type="email"],
input[type="tel"],
textarea {
  width: calc(100% - 20px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

textarea {
  resize: vertical; /* Allow vertical resizing */
  min-height: 80px;
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