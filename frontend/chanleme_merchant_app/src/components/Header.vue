<script setup lang="ts">
// 你可以在这里定义Header组件的props和逻辑
</script>

<template>
  <header class="app-header">
    <h1>馋了么商家管理系统</h1>
    <nav>
      <slot></slot> </nav>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #42b983; /* Vue 绿色 */
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.app-header nav {
  /* 导航样式 */
}
</style>