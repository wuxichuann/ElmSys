import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()], // 启用 Vue 插件
  server: {
    port: 5170, // 为门户分配一个新端口，确保不与其他应用冲突
    host: '0.0.0.0', // 允许从其他设备访问
  },
  resolve: {
    alias: {
      // 如果你希望使用 @ 作为 src 目录的别名，可以这样配置：
      // '@': '/src',
    },
  },
});