// frontend/chanleme_merchant_app/src/stores/order.ts
import { defineStore } from 'pinia';
import { orderApi } from '../api';
import { Order, OrderStatus, UpdateOrderStatusDto } from '../types/order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    newOrders: [] as Order[], // 状态为 'placed' 的订单
    processingOrders: [] as Order[], // 状态为 'accepted', 'preparing' 的订单
    historyOrders: [] as Order[], // 状态为 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected' 的订单
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchNewOrders() {
      this.loading = true;
      this.error = null;
      try {
        this.newOrders = await orderApi.fetchOrdersByStatus('placed');
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch new orders.';
        console.error('Fetch new orders error:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchProcessingOrders() {
      this.loading = true;
      this.error = null;
      try {
        // 后端可能需要支持查询多个状态，或者前端自己过滤
        const allProcessing = await orderApi.fetchOrdersByStatus('all'); // 假设后端支持 'all' 或在前端过滤
        this.processingOrders = allProcessing.filter(order =>
          ['accepted', 'preparing'].includes(order.status)
        );
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch processing orders.';
        console.error('Fetch processing orders error:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchHistoryOrders() {
      this.loading = true;
      this.error = null;
      try {
        const allHistory = await orderApi.fetchOrdersByStatus('all'); // 假设后端支持 'all' 或在前端过滤
        this.historyOrders = allHistory.filter(order =>
          ['ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected'].includes(order.status)
        );
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch history orders.';
        console.error('Fetch history orders error:', err);
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(orderId: number, status: UpdateOrderStatusDto['status']) {
      this.loading = true;
      this.error = null;
      try {
        const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
        // 更新 Pinia Store 中的订单状态和列表
        this.moveOrderBetweenLists(updatedOrder);
        return updatedOrder;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update order status.';
        console.error('Update order status error:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 辅助方法：在不同订单列表之间移动订单
    moveOrderBetweenLists(updatedOrder: Order) {
      // 从所有列表中移除旧版本
      this.newOrders = this.newOrders.filter(o => o.order_id !== updatedOrder.order_id);
      this.processingOrders = this.processingOrders.filter(o => o.order_id !== updatedOrder.order_id);
      this.historyOrders = this.historyOrders.filter(o => o.order_id !== updatedOrder.order_id);

      // 根据新状态添加到相应的列表中
      if (updatedOrder.status === 'placed') {
        this.newOrders.push(updatedOrder);
      } else if (['accepted', 'preparing'].includes(updatedOrder.status)) {
        this.processingOrders.push(updatedOrder);
      } else if (['ready_for_pickup', 'picked_up', 'delivered', 'cancelled', 'rejected'].includes(updatedOrder.status)) {
        this.historyOrders.push(updatedOrder);
      }
      // 排序以确保新添加的订单在顶部 (可选)
      this.newOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
      this.processingOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
      this.historyOrders.sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime());
    },

    // Socket.IO 接收到新订单时的处理
    addNewOrder(order: Order) {
      if (order.status === 'placed') {
        this.newOrders.unshift(order); // 新订单放前面
      }
    },
    // Socket.IO 接收到订单更新时的处理
    updateOrderFromSocket(updatedOrder: Order) {
      this.moveOrderBetweenLists(updatedOrder);
    }
  },
});