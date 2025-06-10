<template>
  <div class="merchant-home-container">
    <h1>欢迎来到馋了么商家管理平台！</h1>
    <p>这里是您的商家管理首页。</p>
    <div v-if="merchantInfo">
      <p>当前登录商家: {{ merchantInfo.username }} ({{ merchantInfo.user_type }})</p>
      <button @click="logout">退出登录</button>
    </div>
    <div v-else>
      <router-link to="/login">商家登录</router-link> | 
      <router-link to="/register">商家注册</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const merchantInfo = ref<any>(null);

onMounted(() => {
  const storedMerchantInfo = localStorage.getItem('merchant_user_info'); // 注意不同的 key
  if (storedMerchantInfo) {
    merchantInfo.value = JSON.parse(storedMerchantInfo);
  }
});

const logout = () => {
  localStorage.removeItem('merchant_jwt_token'); // 注意不同的 key
  localStorage.removeItem('merchant_user_info'); // 注意不同的 key
  merchantInfo.value = null;
  router.push('/login');
};
</script>

<style scoped>
.merchant-home-container {
  text-align: center;
  margin-top: 50px;
  background-color: #f0f8ff; /* 不同的背景色以区分 */
  padding: 30px;
  border-radius: 8px;
}
button {
  padding: 8px 15px;
  background-color: #28a745; /* 不同的按钮颜色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
button:hover {
  background-color: #218838;
}
</style>