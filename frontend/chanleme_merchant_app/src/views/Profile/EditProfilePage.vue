<template>
  <div class="edit-profile-page container">
    <h2>编辑个人信息</h2>
    <LoadingSpinner v-if="loading" />
    <ErrorDisplay v-if="error" :message="error" />
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <form @submit.prevent="handleSubmit" v-if="formData && !loading">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="formData.username" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="formData.email" />
      </div>
      <div class="form-group">
        <label for="phone">手机号:</label>
        <input type="tel" id="phone" v-model="formData.phone" />
      </div>

      <div v-if="formData.restaurant">
        <h3>编辑餐厅信息</h3>
        <div class="form-group">
          <label for="restaurantName">餐厅名称:</label>
          <input type="text" id="restaurantName" v-model="formData.restaurant.name" required />
        </div>
        <div class="form-group">
          <label for="restaurantAddress">餐厅地址:</label>
          <input type="text" id="restaurantAddress" v-model="formData.restaurant.address" required />
        </div>
        <div class="form-group">
          <label for="restaurantPhone">餐厅电话:</label>
          <input type="tel" id="restaurantPhone" v-model="formData.restaurant.phone" />
        </div>
        <div class="form-group">
          <label for="restaurantDescription">餐厅描述:</label>
          <textarea id="restaurantDescription" v-model="formData.restaurant.description"></textarea>
        </div>
        <div class="form-group">
          <label for="restaurantImageUrl">餐厅图片URL:</label>
          <input type="text" id="restaurantImageUrl" v-model="formData.restaurant.image_url" />
        </div>
      </div>


      <button type="submit" :disabled="submitting">
        {{ submitting ? '保存中...' : '保存修改' }}
      </button>
      <button type="button" @click="router.back()" class="cancel-button">取消</button>
    </form>
    <div v-else-if="!loading && !formData" class="no-data">无法加载编辑信息。</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userService } from '@/api/merchantApi';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorDisplay from '@/components/common/ErrorDisplay.vue';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    description?: string;
    image_url?: string;
  };
}

const formData = ref<Partial<UserProfile> | null>(null);
const loading = ref(true);
const submitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const fetchProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await userService.getProfile();
    formData.value = { ...response.data }; // 复制数据到表单
  } catch (err: any) {
    error.value = err.message || '获取个人信息失败';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  error.value = null;
  successMessage.value = null;
  try {
    // 构造发送到后端的数据。根据后端DTO决定哪些字段可以直接发送
    // 后端 users/profile 接口通常只处理用户基本信息，
    // 如果餐厅信息是通过嵌套对象提交，需要后端支持。
    // 如果后端是单独的商家信息更新接口，则需要拆分调用。
    // 这里假设后端 /users/profile 接口可以处理嵌套的 restaurant 对象更新
    const payload: any = {
      username: formData.value?.username,
      email: formData.value?.email,
      phone: formData.value?.phone,
    };
    if (formData.value?.restaurant) {
      payload.restaurant = {
        name: formData.value.restaurant.name,
        address: formData.value.restaurant.address,
        phone: formData.value.restaurant.phone,
        description: formData.value.restaurant.description,
        image_url: formData.value.restaurant.image_url,
      };
    }

    const response = await userService.updateProfile(payload);
    authStore.setUser(response.data); // 更新 Pinia store
    successMessage.value = '个人信息更新成功！';
  } catch (err: any) {
    error.value = err.message || '更新失败';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.edit-profile-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

h3 {
  margin-top: 30px;
  margin-bottom: 20px;
  color: #42b983;
  text-align: center;
  font-size: 1.6em;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: calc(100% - 22px); /* Adjust for padding and border */
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button[type="submit"] {
  background-color: #42b983;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #368e6b;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.no-data {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
</style>