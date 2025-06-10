// frontend/chanleme_merchant_app/src/stores/menu.ts
import { defineStore } from 'pinia';
import { menuApi } from '../api';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../types/menu';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [] as MenuItem[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchMenuItems() {
      this.loading = true;
      this.error = null;
      try {
        this.menuItems = await menuApi.getMenuItems();
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch menu items.';
        console.error('Fetch menu items error:', err);
      } finally {
        this.loading = false;
      }
    },
    async createMenuItem(data: CreateMenuItemDto) {
      this.loading = true;
      this.error = null;
      try {
        const newItem = await menuApi.createMenuItem(data);
        this.menuItems.push(newItem);
        return newItem;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create menu item.';
        console.error('Create menu item error:', err);
        throw err; // Re-throw to allow component to catch
      } finally {
        this.loading = false;
      }
    },
    async updateMenuItem(id: number, data: UpdateMenuItemDto) {
      this.loading = true;
      this.error = null;
      try {
        const updatedItem = await menuApi.updateMenuItem(id, data);
        const index = this.menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
          this.menuItems[index] = updatedItem;
        }
        return updatedItem;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update menu item.';
        console.error('Update menu item error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteMenuItem(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await menuApi.deleteMenuItem(id);
        this.menuItems = this.menuItems.filter(item => item.id !== id);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete menu item.';
        console.error('Delete menu item error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async toggleMenuItemAvailability(id: number, is_available: boolean) {
      this.loading = true;
      this.error = null;
      try {
        const updatedItem = await menuApi.toggleMenuItemAvailability(id, is_available);
        const index = this.menuItems.findIndex(item => item.id === id);
        if (index !== -1) {
          this.menuItems[index].is_available = updatedItem.is_available; // 只更新状态
        }
        return updatedItem;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to toggle item availability.';
        console.error('Toggle availability error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  },
});