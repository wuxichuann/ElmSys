<template>
  <div class="not-found-page container">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 这是一个简单的静态页面，无需复杂逻辑
</script>

<style scoped>
.not-found-page {
  text-align: center;
  padding: 50px;
  margin-top: 50px;
}

h1 {
  font-size: 3em;
  color: #dc3545;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 30px;
}

a {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

a:hover {
  background-color: #0056b3;
}
</style>