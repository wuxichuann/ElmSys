// // frontend/chanleme_merchant_app/src/stores/menu.ts
// import { defineStore } from 'pinia';
// import { menuApi } from '../api';
// import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

// export const useMenuStore = defineStore('menu', {
//   state: () => ({
//     menuItems: [] as MenuItem[],
//     loading: false,
//     error: null as string | null,
//   }),
//   actions: {
//     async fetchMenuItems() {
//       this.loading = true;
//       this.error = null;
//       try {
//         this.menuItems = await menuApi.getMenuItems();
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to fetch menu items.';
//         console.error('Fetch menu items error:', err);
//       } finally {
//         this.loading = false;
//       }
//     },
//     async createMenuItem(data: CreateMenuItemDto) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const newItem = await menuApi.createMenuItem(data);
//         this.menuItems.push(newItem);
//         return newItem;
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to create menu item.';
//         console.error('Create menu item error:', err);
//         throw err; // Re-throw to allow component to catch
//       } finally {
//         this.loading = false;
//       }
//     },
//     async updateMenuItem(id: number, data: UpdateMenuItemDto) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const updatedItem = await menuApi.updateMenuItem(id, data);
//         const index = this.menuItems.findIndex(item => item.id === id);
//         if (index !== -1) {
//           this.menuItems[index] = updatedItem;
//         }
//         return updatedItem;
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to update menu item.';
//         console.error('Update menu item error:', err);
//         throw err;
//       } finally {
//         this.loading = false;
//       }
//     },
//     async deleteMenuItem(id: number) {
//       this.loading = true;
//       this.error = null;
//       try {
//         await menuApi.deleteMenuItem(id);
//         this.menuItems = this.menuItems.filter(item => item.id !== id);
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to delete menu item.';
//         console.error('Delete menu item error:', err);
//         throw err;
//       } finally {
//         this.loading = false;
//       }
//     },
//     async toggleMenuItemAvailability(id: number, is_available: boolean) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const updatedItem = await menuApi.toggleMenuItemAvailability(id, is_available);
//         const index = this.menuItems.findIndex(item => item.id === id);
//         if (index !== -1) {
//           this.menuItems[index].is_available = updatedItem.is_available; // 只更新状态
//         }
//         return updatedItem;
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to toggle item availability.';
//         console.error('Toggle availability error:', err);
//         throw err;
//       } finally {
//         this.loading = false;
//       }
//     }
//   },
// });
// src/stores/menu.ts
import { defineStore } from 'pinia';
import { getMenuItemsApi, createMenuItemApi, updateMenuItemApi, deleteMenuItemApi } from '../api/menu';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

interface MenuState {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuItems: [],
    loading: false,
    error: null,
  }),
  actions: {
    /**
     * @action fetchMenuItems
     * @description 从后端获取所有菜品列表。
     */
    async fetchMenuItems() {
      this.loading = true;
      this.error = null;
      try {
        this.menuItems = await getMenuItemsApi();
      } catch (err: any) {
        this.error = err.response?.data?.message || '获取菜品失败。';
        console.error('获取菜品失败:', err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action addMenuItem
     * @description 添加新菜品。
     * @param {CreateMenuItemDto} itemData - 新菜品数据。
     */
    async addMenuItem(itemData: CreateMenuItemDto) {
      this.loading = true;
      this.error = null;
      try {
        const newItem = await createMenuItemApi(itemData);
        this.menuItems.unshift(newItem); // 添加到列表开头
      } catch (err: any) {
        this.error = err.response?.data?.message || '添加菜品失败。';
        console.error('添加菜品失败:', err);
        throw err; // 抛出错误以便组件处理
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action updateMenuItem
     * @description 更新现有菜品。
     * @param {number} itemId - 菜品ID。
     * @param {UpdateMenuItemDto} itemData - 更新数据。
     */
    async updateMenuItem(itemId: number, itemData: UpdateMenuItemDto) {
      this.loading = true;
      this.error = null;
      try {
        const updatedItem = await updateMenuItemApi(itemId, itemData);
        const index = this.menuItems.findIndex(item => item.item_id === itemId);
        if (index !== -1) {
          this.menuItems[index] = updatedItem; // 更新列表中的菜品
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || '更新菜品失败。';
        console.error('更新菜品失败:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * @action deleteMenuItem
     * @description 删除菜品。
     * @param {number} itemId - 菜品ID。
     */
    async deleteMenuItem(itemId: number) {
      this.loading = true;
      this.error = null;
      try {
        await deleteMenuItemApi(itemId);
        this.menuItems = this.menuItems.filter(item => item.item_id !== itemId); // 从列表中移除
      } catch (err: any) {
        this.error = err.response?.data?.message || '删除菜品失败。';
        console.error('删除菜品失败:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
