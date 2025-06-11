<template>
  <div class="not-found-page">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 这是一个静态页面，不需要特殊的脚本逻辑
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh; /* 确保在页面中央显示 */
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f8f8;
  color: #333;
}

.not-found-page h1 {
  font-size: 8em;
  margin-bottom: 20px;
  color: #e44d26; /* 醒目的颜色 */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.not-found-page p {
  font-size: 1.5em;
  margin-bottom: 30px;
}

.not-found-page a {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.not-found-page a:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>