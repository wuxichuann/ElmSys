// frontend/chanleme_merchant_app/src/api/index.ts
// import apiInstance from './config';
// import { auth } from './auth';
// import { menu } from './menu'; // 新增导入
// import { order } from './order';

// export default apiInstance;

// export const authApi = auth;
// export const menuApi = menu; // 新增导出
// export const orderApi = order;
// // src/api/index.ts

// src/api/index.ts (确认该文件内容是正确的)

export * from './auth';
export * from './menu';
export * from './order';
export * from './restaurant';
export * from './user'; // 确保这一行存在