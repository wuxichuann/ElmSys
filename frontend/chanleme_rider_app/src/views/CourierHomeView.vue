<template>
  <div class="rider-home-container">
    <h1>欢迎来到馋了么骑手平台！</h1>
    <p>这里是您的骑手首页，可以查看待接订单。</p>
    <div v-if="riderInfo">
      <p>当前登录骑手: {{ riderInfo.username }} ({{ riderInfo.user_type }})</p>
      <button @click="logout">退出登录</button>
    </div>
    <div v-else>
      <router-link to="/login">骑手登录</router-link> | 
      <router-link to="/register">骑手注册</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const riderInfo = ref<any>(null);

onMounted(() => {
  const storedRiderInfo = localStorage.getItem('rider_user_info'); // 注意不同的 key
  if (storedRiderInfo) {
    riderInfo.value = JSON.parse(storedRiderInfo);
  }
});

const logout = () => {
  localStorage.removeItem('rider_jwt_token'); // 注意不同的 key
  localStorage.removeItem('rider_user_info'); // 注意不同的 key
  riderInfo.value = null;
  router.push('/login');
};
</script>

<style scoped>
.rider-home-container {
  text-align: center;
  margin-top: 50px;
  background-color: #f8f8ff; /* 不同的背景色以区分 */
  padding: 30px;
  border-radius: 8px;
}
button {
  padding: 8px 15px;
  background-color: #007bff; /* 不同的按钮颜色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
button:hover {
  background-color: #0069d9;
}
</style>