<template>
  <div class="order-success-container">
    <div class="success-icon">🎉</div>
    <h1>下单成功！</h1>
    <p>您的订单已成功提交，请耐心等待餐厅确认和骑手配送。</p>
    <p>感谢您的订购，美味即将送达！</p>
    <div class="actions">
      <router-link to="/" class="back-home-btn">返回首页</router-link>
      </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.order-success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 50px auto;
}

.success-icon {
  font-size: 5em;
  margin-bottom: 30px;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

h1 {
  color: #4CAF50;
  font-size: 3em;
  margin-bottom: 20px;
}

p {
  color: #555;
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 15px;
}

.actions {
  margin-top: 40px;
  display: flex;
  gap: 20px;
}

.back-home-btn, .view-orders-btn {
  display: inline-block;
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1em;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-home-btn:hover, .view-orders-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.view-orders-btn {
  background-color: #6c757d;
}

.view-orders-btn:hover {
  background-color: #5a6268;
}
</style>