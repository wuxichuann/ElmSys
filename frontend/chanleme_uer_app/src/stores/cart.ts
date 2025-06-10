import { defineStore } from 'pinia';
import { CartItem } from '../types/order';
import { MenuItem } from '../types/restaurant';

interface CartState {
  items: CartItem[];
  restaurantId: number | null; // 购物车中的商品必须来自同一餐厅
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    restaurantId: null,
  }),
  getters: {
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    isEmpty: (state) => state.items.length === 0,
  },
  actions: {
    addItem(menuItem: MenuItem, quantity: number = 1) {
      // 如果购物车为空，或者新添加的商品来自同一餐厅
      if (this.isEmpty || this.restaurantId === menuItem.restaurant_id) {
        const existingItem = this.items.find(item => item.itemId === menuItem.item_id);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.items.push({
            itemId: menuItem.item_id,
            quantity: quantity,
            item_name: menuItem.item_name,
            price: menuItem.price,
            image_url: menuItem.image_url,
            restaurantId: menuItem.restaurant_id,
          });
        }
        this.restaurantId = menuItem.restaurant_id; // 设置当前购物车关联的餐厅ID
      } else {
        // 如果添加了不同餐厅的商品，清空购物车并添加新商品
        if (confirm('购物车中已有其他餐厅的商品，是否清空购物车并添加此商品？')) {
          this.clearCart();
          this.items.push({
            itemId: menuItem.item_id,
            quantity: quantity,
            item_name: menuItem.item_name,
            price: menuItem.price,
            image_url: menuItem.image_url,
            restaurantId: menuItem.restaurant_id,
          });
          this.restaurantId = menuItem.restaurant_id;
        } else {
          // 用户取消添加
          return;
        }
      }
    },
    removeItem(itemId: number) {
      this.items = this.items.filter(item => item.itemId !== itemId);
      if (this.isEmpty) {
        this.restaurantId = null; // 购物车清空后，重置餐厅ID
      }
    },
    updateQuantity(itemId: number, newQuantity: number) {
      const item = this.items.find(item => item.itemId === itemId);
      if (item) {
        if (newQuantity <= 0) {
          this.removeItem(itemId);
        } else {
          item.quantity = newQuantity;
        }
      }
    },
    clearCart() {
      this.items = [];
      this.restaurantId = null;
    },
  },
});