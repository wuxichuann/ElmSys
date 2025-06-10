<script setup lang="ts">
// App.vue 作为根组件，通常会包含 router-view 来渲染路由匹配到的组件
// 但在这个简单的门户应用中，我们可以直接导入 PortalHome 并渲染
import PortalHome from './views/PortalHome.vue';
</script>

<template>
  <PortalHome />
</template>

<style>
/* 可选的全局样式 */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>