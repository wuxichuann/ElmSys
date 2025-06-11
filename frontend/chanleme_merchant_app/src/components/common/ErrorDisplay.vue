<template>
  <div class="error-display">
    <p><strong>错误:</strong> {{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.error-display {
  background-color: #ffe0e0;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}
</style>