// frontend/chanleme_merchant_app/src/api/menu.ts
import api from './index'; // 导入 default 导出的 axios 实例
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

export const menu = {
  // 获取所有菜品
  getMenuItems: (): Promise<MenuItem[]> => {
    return api.get('/merchant/menu-items').then(res => res.data);
  },
  // 新增菜品
  createMenuItem: (data: CreateMenuItemDto): Promise<MenuItem> => {
    return api.post('/merchant/menu-items', data).then(res => res.data);
  },
  // 更新菜品
  updateMenuItem: (id: number, data: UpdateMenuItemDto): Promise<MenuItem> => {
    return api.patch(`/merchant/menu-items/${id}`, data).then(res => res.data);
  },
  // 删除菜品
  deleteMenuItem: (id: number): Promise<void> => {
    return api.delete(`/merchant/menu-items/${id}`).then(res => res.data);
  },
  // 切换可售状态 (简写)
  toggleMenuItemAvailability: (id: number, is_available: boolean): Promise<MenuItem> => {
    return api.patch(`/merchant/menu-items/${id}`, { is_available }).then(res => res.data);
  }
};