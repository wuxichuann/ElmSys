/**
 * @file OrderService.ts
 * @description 处理与订单相关的业务逻辑，包括创建订单、校验菜品有效性和计算订单总金额等操作。
 * @module OrderService
 */

import { prisma } from '../db/prisma';
import { Prisma, menu_items } from '@prisma/client';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * @class OrderService
 * @description 处理下单的业务逻辑。
 */
export class OrderService {
    /**
     * @description 用户创建订单，在一个数据库事务中执行，以保证数据一致性。
     * @param {number} userId - 发起请求的用户ID (从JWT中获取)。
     * @param {CreateOrderDto} orderData - 经过验证的订单数据。
     * @returns {Promise<any>} 创建成功后的订单信息。
     * @throws {Error} 如果订单中包含无效、已下架或不属于该餐厅的菜品，将抛出错误。
     */
    public async createOrder(userId: number, orderData: CreateOrderDto) {
        const { restaurantId, items, deliveryAddress, notes, paymentMethod } = orderData;

        // --- 1. 数据校验和价格计算 ---
        // 获取请求的菜品ID数组
        const itemIds = items.map(item => item.itemId);

        // 从数据库中查找请求的菜品
        const menuItemsInDB = await prisma.menu_items.findMany({
            where: {
                item_id: { in: itemIds },
                restaurant_id: restaurantId, // 安全校验：确保所有菜品都属于指定的餐厅
                is_available: true,
            },
        });

        // 如果数据库中找到的与用户请求的数量不一致，出错
        if (menuItemsInDB.length !== itemIds.length) {
            throw new Error('部分菜品不可售');
        }

        // --- 2. 计算总价和构建订单详情 ---
        let totalAmount = new Decimal(0); // 初始化总金额为0
        const orderItemsToCreate = items.map(Item => {
            // 查找数据库中对应的菜品
            const menuItem = menuItemsInDB.find((mi: menu_items) => mi.item_id === Item.itemId);
            // 这个检查理论上不会失败，因为上面已经验证过长度了
            if (!menuItem) throw new Error(`内部错误：无法找到菜品ID ${Item.itemId}`);

            // 计算小计并累加到总金额
            const subtotal = menuItem.price.mul(Item.quantity);
            totalAmount = totalAmount.add(subtotal);

            // 返回要创建的订单项数据
            return {
                item_id: Item.itemId,
                quantity: Item.quantity,
                price_at_purchase: menuItem.price,
                subtotal: subtotal,
            };
        });

        // --- 3. 使用数据库事务写入数据 ---
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 创建新订单
            const newOrder = await tx.orders.create({
                data: {
                    customer_id: userId,
                    restaurant_id: restaurantId,
                    delivery_address: deliveryAddress,
                    total_amount: totalAmount,
                    notes: notes,
                    payment_method: paymentMethod,
                    status: 'placed',         // 初始状态为 "已下单"
                    payment_status: 'paid',   // 简化处理，假设下单即支付成功
                    // 使用 Prisma 的嵌套写入功能，同时创建关联的 order_items
                    order_items: {
                        create: orderItemsToCreate,
                    },
                },
                // 在返回结果中包含订单的详细商品信息
                include: {
                    order_items: true,
                },
            });

            return newOrder; // 返回新创建的订单信息
        });
    }
}
