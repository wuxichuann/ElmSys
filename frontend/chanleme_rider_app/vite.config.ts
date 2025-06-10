import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 5175, // **重要：为骑手端使用不同的端口，避免与用户端/商家端冲突**
    host: '0.0.0.0', // 允许局域网访问，如果需要
  },
  resolve: {
    alias: {
      // 如果你的项目有别名配置，可以在这里添加
      // '@': '/src',
    },
  },
});