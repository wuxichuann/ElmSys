import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url'; // 用于路径解析

// https://vitejs.dev/config/
export default defineConfig({
  // 1. 插件配置
  plugins: [
    vue(), // 启用 Vue 3 单文件组件支持
  ],

  // 2. 开发服务器配置 (dev server options)
  server: {
    port: 5173, // 前端开发服务器端口，你可以根据需要修改
    host: 'localhost', // 监听的主机
    // proxy: {
    //   // 如果你的后端在不同的端口或域名，可以使用代理转发 API 请求
    //   // 例如：所有以 /api 开头的请求都会被转发到 http://localhost:3000
    //   '/api': {
    //     target: 'http://localhost:3001', // 你的后端服务地址
    //     changeOrigin: true, // 改变源，使得后端认为请求来自其自身，避免CORS问题
    //     // rewrite: (path) => path.replace(/^\/api/, ''), // 如果后端没有 /api 前缀，需要重写路径
    //   },
    // },
  },

  // 3. 构建配置 (build options)
  build: {
    outDir: 'dist', // 打包输出目录
    assetsDir: 'assets', // 静态资源目录
    sourcemap: false, // 是否生成 sourcemap，生产环境建议关闭以减小包体积
    // rollupOptions: {
    //   // Rollup 特定配置，例如配置外部依赖、输出格式等
    // },
  },

  // 4. 路径别名配置 (resolve aliases)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 将 @ 别名指向 src 目录
      // 例如，你可以在组件中这样导入：import MyComponent from '@/components/MyComponent.vue';
    },
  },

  // 5. CSS 预处理器配置 (CSS preprocessor options)
  css: {
    preprocessorOptions: {
      // 例如，如果你使用 Sass/SCSS
      // scss: {
      //   additionalData: `@import "@/styles/variables.scss";` // 全局注入变量
      // },
    },
  },

  // 6. 其他可选配置
  // base: '/', // 部署时的公共基础路径，如果你的应用部署在子路径下，例如 /my-app/
  // envDir: './env', // .env 文件的目录，默认为项目根目录
});