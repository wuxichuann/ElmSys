import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 导入路由

createApp(App).use(router).mount('#app'); // 挂载 Vue 应用到 index.html 的 #app 元素