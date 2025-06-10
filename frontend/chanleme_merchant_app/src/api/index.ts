// frontend/chanleme_merchant_app/src/api/index.ts
import api from './config'; // Axios 实例
import { authApi } from './auth';
import { orderApi } from './order';
// import { restaurantApi } from './restaurant'; // 如果商家端也需要操作餐厅信息

export {
  api,
  authApi,
  orderApi,
  // restaurantApi,
};