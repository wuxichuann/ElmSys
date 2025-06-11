// src/stores/cartStore.ts
import { defineStore } from 'pinia';

// 定义购物车单个商品项的类型
export interface CartItem {
    productId: number;     // 商品的唯一ID，与后端 MenuItem 的 item_id (或 menu_item_id) 保持一致，应为 number
    productName: string;   // 商品名称
    price: number;
    quantity: number;
    imageUrl?: string;
    restaurantId: number;    // 该商品所属的餐厅ID，应为 number
    restaurantName: string;  // 该商品所属的餐厅名称
}

// 定义购物车 store 的状态类型
export interface CartState {
    items: CartItem[];
    restaurantId: number | null;   // 购物车当前所属餐厅的ID，明确为 number | null
    restaurantName: string | null; // 购物车当前所属餐厅的名称
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => {
        // 从 localStorage 读取时进行类型转换
        const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as CartItem[];
        const storedRestaurantId = localStorage.getItem('cartRestaurantId');
        const storedRestaurantName = localStorage.getItem('cartRestaurantName');

        return {
            items: storedItems,
            // 从 localStorage 读取的字符串转换为 number，如果不存在则为 null
            restaurantId: storedRestaurantId ? Number(storedRestaurantId) : null,
            restaurantName: storedRestaurantName,
        };
    },
    getters: {
        totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
        cartTotal: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
        // 你也可以重新加回 isEmpty getter
        isEmpty(): boolean {
            return this.items.length === 0;
        }
    },
    actions: {
        // addItem 接收的参数类型更灵活，以处理来自路由参数（string）或 API 响应（number）的情况
        addItem(item: { productId: string | number; productName: string; price: number; quantity: number; imageUrl?: string; restaurantId: string | number; restaurantName: string }) {
            // 立即将传入的 productId 和 restaurantId 转换为 number 类型
            const incomingProductId = typeof item.productId === 'string' ? Number(item.productId) : item.productId;
            const incomingRestaurantId = typeof item.restaurantId === 'string' ? Number(item.restaurantId) : item.restaurantId;

            // 检查转换结果是否是有效的数字
            if (isNaN(incomingProductId) || isNaN(incomingRestaurantId)) {
                console.error('尝试添加购物车商品时，商品ID或餐厅ID无效:', item);
                return; // 阻止添加无效商品
            }

            // 如果购物车是空的，或者来自同一餐厅，则直接添加
            // 这里的比较现在是 number 对 number
            if (this.restaurantId === null || this.restaurantId === incomingRestaurantId) {
                const existingItem = this.items.find(i => i.productId === incomingProductId);

                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    // 确保推入的商品符合 CartItem 接口的 number 类型
                    this.items.push({
                        productId: incomingProductId,
                        productName: item.productName,
                        price: item.price,
                        quantity: item.quantity,
                        imageUrl: item.imageUrl,
                        restaurantId: incomingRestaurantId,
                        restaurantName: item.restaurantName,
                    });
                }
                this.restaurantId = incomingRestaurantId;
                this.restaurantName = item.restaurantName;
                this.saveCart();
            } else {
                // 如果购物车已有其他餐厅的商品，这里可以抛出错误或执行清空操作
                // 在 RestaurantDetailPage.vue 中通常会通过 confirm 提示用户
                console.warn('购物车中已有其他餐厅商品，请先清空购物车');
                // 为了确保逻辑完整，如果用户确认清空，应该在这里清空
                // 暂时不在此处进行清空确认，因为通常在 UI 层面处理
            }
        },
        // updateItemQuantity 的 productId 参数改为 number
        updateItemQuantity(productId: number, quantity: number) {
            const item = this.items.find(i => i.productId === productId);
            if (item) {
                if (quantity <= 0) {
                    this.items = this.items.filter(i => i.productId !== productId);
                } else {
                    item.quantity = quantity;
                }
                this.saveCart();
            }
        },
        // removeItem 的 productId 参数改为 number
        removeItem(productId: number) {
            this.items = this.items.filter(item => item.productId !== productId);
            if (this.items.length === 0) {
                this.clearCart(); // 如果购物车空了，清空餐厅信息
            }
            this.saveCart();
        },
        clearCart() {
            this.items = [];
            this.restaurantId = null;
            this.restaurantName = null;
            this.saveCart(); // 清空后也要保存到 localStorage
        },
        saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            if (this.restaurantId !== null) { // 只有当 restaurantId 不为 null 时才保存
                // 将 number 转换为 string 存储到 localStorage
                localStorage.setItem('cartRestaurantId', String(this.restaurantId));
                localStorage.setItem('cartRestaurantName', this.restaurantName || '');
            } else {
                // 如果购物车空了，确保从 localStorage 移除相关项
                localStorage.removeItem('cartRestaurantId');
                localStorage.removeItem('cartRestaurantName');
            }
        },
    },
});