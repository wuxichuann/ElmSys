import { prisma } from '../db/prisma';
import { Prisma, menu_items } from '@prisma/client';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';


export class OrderService {
    /**
     * 用户创建订单。
     * 该方法在一个数据库事务中执行，以保证数据一致性。
     * @param userId - 发起请求的用户ID (从JWT中获取)。
     * @param orderData - 经过验证的订单数据。
     * @returns 创建成功后的订单信息。
     */
    public async createOrder(userId: number, orderData: CreateOrderDto) {
        const { restaurantId, items, deliveryAddress, notes, paymentMethod } = orderData;

        // --- 1. 数据校验和价格计算 ---
        const itemIds = items.map(item => item.itemId);
        const menuItemsInDB = await prisma.menu_items.findMany({
            where: {
                item_id: { in: itemIds },
                restaurant_id: restaurantId, // 安全校验：确保所有菜品都属于指定的餐厅
                is_available: true,
            },
        });

        // 如果数据库中找到的可用菜品数量与用户请求的不一致，说明有菜品无效
        if (menuItemsInDB.length !== itemIds.length) {
            throw new Error('订单中包含无效、已下架或不属于该餐厅的菜品');
        }

        // --- 2. 计算总价和构建订单详情 ---
        let totalAmount = new Decimal(0);
        const orderItemsToCreate = items.map(cartItem => {
            const dbItem = menuItemsInDB.find((mi: menu_items) => mi.item_id === cartItem.itemId);
            // 这个检查理论上不会失败，因为上面已经验证过长度了
            if (!dbItem) throw new Error(`内部错误：无法找到菜品ID ${cartItem.itemId}`);

            const subtotal = dbItem.price.mul(cartItem.quantity);
            totalAmount = totalAmount.add(subtotal);

            return {
                item_id: cartItem.itemId,
                quantity: cartItem.quantity,
                price_at_purchase: dbItem.price,
                subtotal: subtotal,
            };
        });

        // --- 3. 使用数据库事务写入数据 ---
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const newOrder = await tx.orders.create({
                data: {
                    customer_id: userId,
                    restaurant_id: restaurantId,
                    delivery_address: deliveryAddress,
                    total_amount: totalAmount,
                    notes: notes,
                    payment_method: paymentMethod,
                    status: 'placed',        // 初始状态为 "已下单"
                    payment_status: 'paid', // 简化处理，假设下单即支付成功
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

            return newOrder;
        });
    }
}