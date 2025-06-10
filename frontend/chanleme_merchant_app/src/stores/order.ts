// // frontend/chanleme_merchant_app/src/stores/order.ts
// import { defineStore } from 'pinia';
// import { orderApi } from '../api';
// import { Order, OrderStatus, UpdateOrderStatusDto } from '../types/order';

// export const useOrderStore = defineStore('order', {
//   state: () => ({
//     newOrders: [] as Order[], // 状态为 'placed' 的订单
//     processingOrders: [] as Order[], // 状态为 'accepted', 'preparing' 的订单
//     historyOrders: [] as Order[], // 状态为 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected' 的订单
//     loading: false,
//     error: null as string | null,
//   }),
//   actions: {
//     async fetchNewOrders() {
//       this.loading = true;
//       this.error = null;
//       try {
//         this.newOrders = await orderApi.fetchOrdersByStatus('placed');
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to fetch new orders.';
//         console.error('Fetch new orders error:', err);
//       } finally {
//         this.loading = false;
//       }
//     },
//     async fetchProcessingOrders() {
//       this.loading = true;
//       this.error = null;
//       try {
//         // 后端可能需要支持查询多个状态，或者前端自己过滤
//         const allProcessing = await orderApi.fetchOrdersByStatus('all'); // 假设后端支持 'all' 或在前端过滤
//         this.processingOrders = allProcessing.filter(order =>
//           ['accepted', 'preparing'].includes(order.status)
//         );
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to fetch processing orders.';
//         console.error('Fetch processing orders error:', err);
//       } finally {
//         this.loading = false;
//       }
//     },
//     async fetchHistoryOrders() {
//       this.loading = true;
//       this.error = null;
//       try {
//         const allHistory = await orderApi.fetchOrdersByStatus('all'); // 假设后端支持 'all' 或在前端过滤
//         this.historyOrders = allHistory.filter(order =>
//           ['ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected'].includes(order.status)
//         );
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to fetch history orders.';
//         console.error('Fetch history orders error:', err);
//       } finally {
//         this.loading = false;
//       }
//     },

//     async updateOrderStatus(orderId: number, status: UpdateOrderStatusDto['status']) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
//         // 更新 Pinia Store 中的订单状态和列表
//         this.moveOrderBetweenLists(updatedOrder);
//         return updatedOrder;
//       } catch (err: any) {
//         this.error = err.response?.data?.message || 'Failed to update order status.';
//         console.error('Update order status error:', err);
//         throw err;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // 辅助方法：在不同订单列表之间移动订单
//     moveOrderBetweenLists(updatedOrder: Order) {
//       // 从所有列表中移除旧版本
//       this.newOrders = this.newOrders.filter(o => o.order_id !== updatedOrder.order_id);
//       this.processingOrders = this.processingOrders.filter(o => o.order_id !== updatedOrder.order_id);
//       this.historyOrders = this.historyOrders.filter(o => o.order_id !== updatedOrder.order_id);

//       // 根据新状态添加到相应的列表中
//       if (updatedOrder.status === 'placed') {
//         this.newOrders.push(updatedOrder);
//       } else if (['accepted', 'preparing'].includes(updatedOrder.status)) {
//         this.processingOrders.push(updatedOrder);
//       } else if (['ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected'].includes(updatedOrder.status)) {
//         this.historyOrders.push(updatedOrder);
//       }
//       // 排序以确保新添加的订单在顶部 (可选)
//       this.newOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
//       this.processingOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
//       this.historyOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
//     },

//     // Socket.IO 接收到新订单时的处理
//     addNewOrder(order: Order) {
//       if (order.status === 'placed') {
//         this.newOrders.unshift(order); // 新订单放前面
//       }
//     },
//     // Socket.IO 接收到订单更新时的处理
//     updateOrderFromSocket(updatedOrder: Order) {
//       this.moveOrderBetweenLists(updatedOrder);
//     }
//   },
// });
// src/stores/order.ts
import { defineStore } from 'pinia';
import { getNewOrdersApi, getInProgressOrdersApi, getHistoryOrdersApi, confirmOrderApi, updateOrderStatusApi } from '../api/order';
import { Order, AllowedRestaurantStatus, UpdateOrderStatusDto } from '../types/order';

interface OrderState {
  newOrders: Order[];
  inProgressOrders: Order[];
  historyOrders: Order[];
  loading: {
    new: boolean;
    inProgress: boolean;
    history: boolean;
    action: boolean; // 用于确认接单或更新状态
  };
  error: {
    new: string | null;
    inProgress: string | null;
    history: string | null;
    action: string | null;
  };
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    newOrders: [],
    inProgressOrders: [],
    historyOrders: [],
    loading: {
      new: false,
      inProgress: false,
      history: false,
      action: false,
    },
    error: {
      new: null,
      inProgress: null,
      history: null,
      action: null,
    },
  }),
  actions: {
    /**
     * @action fetchNewOrders
     * @description 获取新的订单列表。
     */
    async fetchNewOrders() {
      this.loading.new = true;
      this.error.new = null;
      try {
        this.newOrders = await getNewOrdersApi();
      } catch (err: any) {
        this.error.new = err.response?.data?.message || '获取新订单失败。';
        console.error('获取新订单失败:', err);
      } finally {
        this.loading.new = false;
      }
    },

    /**
     * @action confirmOrder
     * @description 商家确认接单。
     * @param {number} orderId - 订单ID。
     */
    async confirmOrder(orderId: number) {
      this.loading.action = true;
      this.error.action = null;
      try {
        const updatedOrder = await confirmOrderApi(orderId);
        // 从新订单列表中移除，添加到进行中订单列表
        this.newOrders = this.newOrders.filter(order => order.order_id !== orderId);
        this.inProgressOrders.unshift(updatedOrder); // 添加到进行中订单列表开头
      } catch (err: any) {
        this.error.action = err.response?.data?.message || '接单失败。';
        console.error('接单失败:', err);
        throw err;
      } finally {
        this.loading.action = false;
      }
    },

    /**
     * @action fetchInProgressOrders
     * @description 获取进行中订单列表。
     */
    async fetchInProgressOrders() {
      this.loading.inProgress = true;
      this.error.inProgress = null;
      try {
        this.inProgressOrders = await getInProgressOrdersApi();
      } catch (err: any) {
        this.error.inProgress = err.response?.data?.message || '获取进行中订单失败。';
        console.error('获取进行中订单失败:', err);
      } finally {
        this.loading.inProgress = false;
      }
    },

    /**
     * @action updateOrderStatus
     * @description 商家更新进行中订单的状态。
     * @param {number} orderId - 订单ID。
     * @param {AllowedRestaurantStatus} newStatus - 新的状态。
     */
    async updateOrderStatus(orderId: number, newStatus: AllowedRestaurantStatus) {
      this.loading.action = true;
      this.error.action = null;
      try {
        const data: UpdateOrderStatusDto = { status: newStatus };
        const updatedOrder = await updateOrderStatusApi(orderId, data);
        // 更新进行中订单列表中的对应订单
        const index = this.inProgressOrders.findIndex(order => order.order_id === orderId);
        if (index !== -1) {
          this.inProgressOrders[index] = { ...this.inProgressOrders[index], ...updatedOrder }; // 更新订单数据
        }
        // 如果状态变为 'delivered' 或 'cancelled' 等，将其从进行中列表移除，添加到历史订单
        if (['delivered', 'cancelled', 'refunded'].includes(updatedOrder.status)) {
          this.inProgressOrders = this.inProgressOrders.filter(order => order.order_id !== orderId);
          this.historyOrders.unshift(updatedOrder); // 添加到历史订单列表开头
        }

      } catch (err: any) {
        this.error.action = err.response?.data?.message || '更新订单状态失败。';
        console.error('更新订单状态失败:', err);
        throw err;
      } finally {
        this.loading.action = false;
      }
    },

    /**
     * @action fetchHistoryOrders
     * @description 获取历史订单列表。
     */
    async fetchHistoryOrders() {
      this.loading.history = true;
      this.error.history = null;
      try {
        this.historyOrders = await getHistoryOrdersApi();
      } catch (err: any) {
        this.error.history = err.response?.data?.message || '获取历史订单失败。';
        console.error('获取历史订单失败:', err);
      } finally {
        this.loading.history = false;
      }
    },

    /**
     * @action handleSocketNewOrder
     * @description 处理来自 WebSocket 的新订单通知。
     * @param {Order} newOrder - 新订单数据。
     */
    handleSocketNewOrder(newOrder: Order) {
      // 避免重复添加，如果列表中已存在，则不添加
      if (!this.newOrders.some(order => order.order_id === newOrder.order_id)) {
        this.newOrders.unshift(newOrder); // 将新订单添加到列表顶部
        // 可以触发通知，例如声音或桌面通知
        console.log('收到新订单:', newOrder.order_id);
      }
    },

    /**
     * @action handleSocketOrderStatusUpdate
     * @description 处理来自 WebSocket 的订单状态更新通知。
     * @param {Order} updatedOrder - 更新后的订单数据。
     */
    handleSocketOrderStatusUpdate(updatedOrder: Order) {
      // 检查并更新新订单列表
      let foundInNew = false;
      this.newOrders = this.newOrders.map(order => {
        if (order.order_id === updatedOrder.order_id) {
          foundInNew = true;
          return { ...order, ...updatedOrder };
        }
        return order;
      });
      // 如果新订单状态不再是 'placed'，则从新订单列表移除
      if (foundInNew && updatedOrder.status !== 'placed') {
        this.newOrders = this.newOrders.filter(order => order.order_id !== updatedOrder.order_id);
      }


      // 检查并更新进行中订单列表
      let foundInProgress = false;
      this.inProgressOrders = this.inProgressOrders.map(order => {
        if (order.order_id === updatedOrder.order_id) {
          foundInProgress = true;
          return { ...order, ...updatedOrder };
        }
        return order;
      });
      // 如果进行中订单状态变为 'delivered', 'cancelled', 'refunded'，则从进行中列表移除
      if (foundInProgress && ['delivered', 'cancelled', 'refunded'].includes(updatedOrder.status)) {
        this.inProgressOrders = this.inProgressOrders.filter(order => order.order_id !== updatedOrder.order_id);
        // 并添加到历史订单列表
        if (!this.historyOrders.some(order => order.order_id === updatedOrder.order_id)) {
            this.historyOrders.unshift(updatedOrder);
        }
      } else if (!foundInProgress && ['restaurant_confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(updatedOrder.status)) {
         // 如果不在进行中列表但状态是进行中，则添加到进行中列表 (例如，商家接单后，新订单就会变成进行中)
         if (!this.inProgressOrders.some(order => order.order_id === updatedOrder.order_id)) {
            this.inProgressOrders.unshift(updatedOrder);
         }
      }

      // 检查并更新历史订单列表
      let foundInHistory = false;
      this.historyOrders = this.historyOrders.map(order => {
        if (order.order_id === updatedOrder.order_id) {
          foundInHistory = true;
          return { ...order, ...updatedOrder };
        }
        return order;
      });
      // 如果更新的订单是已完成或已取消的状态，但之前不在历史订单中，则加入
      if (!foundInHistory && ['delivered', 'cancelled', 'refunded'].includes(updatedOrder.status)) {
        this.historyOrders.unshift(updatedOrder);
      }
      console.log('订单状态更新:', updatedOrder.order_id, updatedOrder.status);
    },
  },
});
