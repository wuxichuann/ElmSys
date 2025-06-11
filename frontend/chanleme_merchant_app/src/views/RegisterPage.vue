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
        <label for="userEmail">您的邮箱:</label>
        <input type="email" id="userEmail" v-model="userEmail" required />
      </div>

      <div class="form-group">
        <label for="userPhoneNumber">您的手机号:</label>
        <input type="tel" id="userPhoneNumber" v-model="userPhoneNumber" required />
      </div>

      <hr style="margin: 20px 0; border-color: #eee;"> <h3>餐厅信息</h3>
      <div class="form-group">
        <label for="restaurantName">餐厅名称:</label>
        <input type="text" id="restaurantName" v-model="restaurantName" required />
      </div>
      <div class="form-group">
        <label for="restaurantAddress">餐厅地址:</label>
        <input type="text" id="restaurantAddress" v-model="restaurantAddress" required />
      </div>
      <div class="form-group">
        <label for="restaurantPhone">餐厅联系电话:</label>
        <input type="text" id="restaurantPhone" v-model="restaurantPhone" required />
      </div>
      <div class="form-group">
        <label for="restaurantDescription">餐厅描述:</label>
        <textarea id="restaurantDescription" v-model="restaurantDescription"></textarea>
      </div>
      <div class="form-group">
        <label for="restaurantImageUrl">餐厅图片URL (此字段在后端 DTO 中不存在，不会被发送):</label>
        <input type="text" id="restaurantImageUrl" v-model="restaurantImageUrl" disabled style="background-color: #f0f0f0;"/>
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
import { authService } from '@/api/merchantApi';

// 从 src/types/auth.ts 中导入这些类型
import { UserType, RestaurantDataDto, RegisterDto, RegisterRestaurantDto } from '@/types/auth';


// 前端表单数据绑定
const identifier = ref('');
const password = ref('');
const confirmPassword = ref('');

// 新增：用户邮箱和手机号
const userEmail = ref('');
const userPhoneNumber = ref('');

// 餐厅信息
const restaurantName = ref('');
const restaurantAddress = ref('');
const restaurantPhone = ref('');
const restaurantDescription = ref('');
const restaurantImageUrl = ref(''); // 此字段在后端 DTO 中不存在，不会被发送

const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致！';
    return;
  }

  loading.value = true;
  try {
    // 严格按照 RegisterRestaurantDto 结构构建 payload
    const registerPayload: RegisterRestaurantDto = {
      user: {
        username: identifier.value, // 用户名
        password: password.value,
        email: userEmail.value, // 用户填写邮箱
        phone_number: userPhoneNumber.value, // 用户填写手机号
        user_type: UserType.RESTAURANT_ADMIN, // 固定为商家用户类型
        full_name: restaurantName.value || `商家-${identifier.value}`, // 真实姓名，可从餐厅名称或用户名派生
      },
      restaurant: {
        restaurant_name: restaurantName.value, // 精确匹配 DTO
        description: restaurantDescription.value || '这家餐厅暂无详细描述。', // 必填，提供默认值
        address: restaurantAddress.value,
        phone_number: restaurantPhone.value, // 精确匹配 DTO (餐厅的联系电话)
        opening_hours: '每日 09:00 - 22:00', // 必填，提供默认值
      },
    };

    await authService.registerRestaurant(registerPayload);

    alert('注册成功，请登录！');
    router.push('/login');
  } catch (err: any) {
    if (err.response && err.response.data) {
      if (err.response.data.errors && err.response.data.errors.length > 0) {
        // 尝试解析并显示具体的验证错误信息
        const validationErrors = err.response.data.errors
          .map((e: any) => {
            if (e.constraints) {
              return Object.values(e.constraints).join('; ');
            }
            // 如果没有 constraints，可能是嵌套对象的错误
            if (e.children && e.children.length > 0) {
                return e.children.map((child: any) => {
                    if (child.constraints) {
                        return Object.values(child.constraints).join('; ');
                    }
                    return '';
                }).filter(Boolean).join('; ');
            }
            return e.message;
          })
          .filter(Boolean) // 过滤掉空字符串
          .join('; ');
        error.value = `注册失败：${validationErrors || err.response.data.message}`;
      } else {
        error.value = err.response.data.message || '注册失败，请重试。';
      }
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
/* 样式部分保持不变 */
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