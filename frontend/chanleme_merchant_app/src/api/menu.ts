// // frontend/chanleme_merchant_app/src/api/menu.ts
// import api from './index'; // 导入 default 导出的 axios 实例
// import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

// export const menu = {
//   // 获取所有菜品
//   getMenuItems: (): Promise<MenuItem[]> => {
//     return api.get('/merchant/menu-items').then(res => res.data);
//   },
//   // 新增菜品
//   createMenuItem: (data: CreateMenuItemDto): Promise<MenuItem> => {
//     return api.post('/merchant/menu-items', data).then(res => res.data);
//   },
//   // 更新菜品
//   updateMenuItem: (id: number, data: UpdateMenuItemDto): Promise<MenuItem> => {
//     return api.patch(`/merchant/menu-items/${id}`, data).then(res => res.data);
//   },
//   // 删除菜品
//   deleteMenuItem: (id: number): Promise<void> => {
//     return api.delete(`/merchant/menu-items/${id}`).then(res => res.data);
//   },
//   // 切换可售状态 (简写)
//   toggleMenuItemAvailability: (id: number, is_available: boolean): Promise<MenuItem> => {
//     return api.patch(`/merchant/menu-items/${id}`, { is_available }).then(res => res.data);
//   }
// };
// src/api/menu.ts
// import apiClient from './config'; // 假设您已经配置了 apiClient，并包含了 JWT token
import apiClient from './config';

import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

/**
 * @function getMenuItemsApi
 * @description 获取商家所有菜品列表。
 * @returns {Promise<MenuItem[]>} 菜品数组。
 */
export const getMenuItemsApi = async (): Promise<MenuItem[]> => {
  const response = await apiClient.get('/menu-items');
  return response.data;
};

/**
 * @function createMenuItemApi
 * @description 创建新菜品。
 * @param {CreateMenuItemDto} data - 新菜品数据。
 * @returns {Promise<MenuItem>} 新创建的菜品对象。
 */
export const createMenuItemApi = async (data: CreateMenuItemDto): Promise<MenuItem> => {
  const response = await apiClient.post('/menu-items', data);
  return response.data;
};

/**
 * @function updateMenuItemApi
 * @description 更新菜品。
 * @param {number} itemId - 菜品ID。
 * @param {UpdateMenuItemDto} data - 更新数据。
 * @returns {Promise<MenuItem>} 更新后的菜品对象。
 */
export const updateMenuItemApi = async (itemId: number, data: UpdateMenuItemDto): Promise<MenuItem> => {
  const response = await apiClient.patch(`/menu-items/${itemId}`, data);
  return response.data;
};

/**
 * @function deleteMenuItemApi
 * @description 删除菜品。
 * @param {number} itemId - 菜品ID。
 * @returns {Promise<void>}
 */
export const deleteMenuItemApi = async (itemId: number): Promise<void> => {
  await apiClient.delete(`/menu-items/${itemId}`);
};
