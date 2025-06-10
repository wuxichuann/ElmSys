<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// 这里可以留空，或者添加一些全局的布局、导航等
</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  color: #333;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>