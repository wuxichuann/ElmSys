// frontend/chanleme_merchant_app/src/api/index.ts
import apiInstance from './config';
import { auth } from './auth';
import { menu } from './menu'; // 新增导入
import { order } from './order';

export default apiInstance;

export const authApi = auth;
export const menuApi = menu; // 新增导出
export const orderApi = order;
