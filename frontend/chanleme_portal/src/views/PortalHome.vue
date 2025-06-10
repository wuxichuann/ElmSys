<template>
  <div class="portal-container">
    <h1>欢迎来到馋了么！</h1>
    <p>请选择您的身份进入相应平台：</p>
    <div class="button-group">
      <a href="http://localhost:5173/" target="_blank" class="portal-button customer">
        <span class="icon">🛒</span>
        顾客入口
      </a>
      <a href="http://localhost:5174/" target="_blank" class="portal-button merchant">
        <span class="icon">🍽️</span>
        商家入口
      </a>
      <a href="http://localhost:5175/" target="_blank" class="portal-button rider">
        <span class="icon">🚴</span>
        骑手入口
      </a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.portal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  font-size: 3em;
  color: #4CAF50; /* Primary green color */
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666;
}

.button-group {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.portal-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 150px;
  padding: 20px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.3em;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.portal-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.portal-button .icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.customer {
  background: linear-gradient(135deg, #4CAF50 0%, #689F38 100%);
}
.customer:hover {
  background: linear-gradient(135deg, #689F38 0%, #4CAF50 100%);
}

.merchant {
  background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%);
}
.merchant:hover {
  background: linear-gradient(135deg, #FFA000 0%, #FFC107 100%);
}

.rider {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}
.rider:hover {
  background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
}
</style>