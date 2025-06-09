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
 * @description 订单的相关业务逻辑。
 */
export class OrderService {

    // --------------顾客的订单处理--------------
    /**
     * @description 顾客创建订单，在一个数据库事务中执行，以保证数据一致性。
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


    // --------------商家的订单处理--------------
    /**
     * @description 商家获取其名下餐厅的新订单新订单列表（状态为 'placed'）。
     * @param {number} restaurantId - 商家所管理的餐厅ID。
     * @returns {Promise<any[]>} 返回包含顾客信息和订单详情的新订单列表，按下单时间升序排列。
     * - 仅返回属于该餐厅且状态为 'placed' 的订单。
     * - 每个订单包含下单顾客的姓名、手机号，以及订单项和对应菜品名称。
     */
    public async getNewOrdersForRestaurant(restaurantId: number) {
        return prisma.orders.findMany({
            // 1.筛选条件：属于该餐厅且状态为 'placed' 的订单
            where: {
                restaurant_id: restaurantId,
                status: 'placed',
            },
            // 2.前端展示：
            include: {
                // (1)下单的顾客信息
                users_orders_customer_idTousers: {
                    select: { full_name: true, phone_number: true }
                },
                // (2) 订单详情
                order_items: {
                    include: {
                        menu_items: {
                            select: { item_name: true }
                        }
                    }
                },
            },
            orderBy: {
                created_at: 'asc', // (3)最早的订单在前面
            },
        });
    }

    /**
     * @description 商家确认订单，将订单状态从 'placed' 更新为 'restaurant_confirmed'。
     * @param {number} restaurantId - 商家管理的餐厅ID
     * @param {number} orderId - 要确认的订单ID
     * @returns {Promise<any>} 更新后的订单信息
     * @throws {Error} 如果订单不存在或状态不正确，抛出错误
     * - 仅允许商家确认属于自己餐厅且状态为 'placed' 的订单。
     * - 更新成功后返回最新订单信息。
     */
    public async confirmOrder(restaurantId: number, orderId: number) {
        // 1.使用updateMany更新某一订单状态为“商家已确认”
        const result = await prisma.orders.updateMany({
            where: {
                order_id: orderId,
                restaurant_id: restaurantId,
                status: 'placed',
            },
            data: {
                status: 'restaurant_confirmed', // 更新状态为 "商家已确认"
            },
        });

        if (result.count === 0) {
            throw new Error('订单未找到或状态不正确，无法接单');
        }

        // 2.返回更新后的订单信息
        return prisma.orders.findUnique({ where: { order_id: orderId } });
    }

    // 未来可以添加更多商家订单管理方法，例如：
    // - 更新订单状态为 "备餐中" (preparing)
    // - 更新订单状态为 "待取餐" (ready_for_pickup)
    // - 查看历史订单 (getAllOrdersForRestaurant)
    // - 取消订单 (cancelOrderByRestaurant)



    // --------------骑手的订单处理--------------
    /**
     * @description 获取所有可供骑手接取的订单。
     * 实际业务中，可以根据地理位置、骑手评分等进行筛选，这里做简化处理。
     * @returns 返回可接订单列表，包含详细的取餐和送餐信息。
     */
    public async getAvailableOrdersForRider() {
        return prisma.orders.findMany({
            // 1.筛选条件：
            where: {
                // 在实际业务中，商家确认后可能还有备餐(preparing)阶段。
                // 为简化流程，我们查找 'restaurant_confirmed' 状态的订单。
                // 更完善的流程应查找 'ready_for_pickup' 状态。
                status: 'restaurant_confirmed',
                courier_id: null, // 关键条件：订单尚未被任何骑手接取
            },
            // 2.前端展示：
            select: {
                order_id: true,
                delivery_address: true, // 送餐地址
                total_amount: true,
                notes: true,
                created_at: true,
                restaurants: { // 包含关联的餐厅信息
                    select: {
                        restaurant_name: true,
                        address: true, // 取餐地址
                        phone_number: true,
                    }
                }
            },
            orderBy: {
                created_at: 'asc', // 优先展示最早创建的订单
            },
        });
    }

    /**
     * @description 骑手接取订单，一个原子操作以防并发问题。
     * @param courierId - 骑手用户ID，从JWT中获取。
     * @param orderId - 要接取的订单ID。
     * @returns 返回更新后的订单信息。
     */
    public async acceptOrder(courierId: number, orderId: number) {
        // 1.抢单
        // 使用 updateMany 来处理并发问题。
        // 这是一个原子性的 "find and update" 操作，防止多个骑手同时抢一单
        const result = await prisma.orders.updateMany({
            where: {
                order_id: orderId,
                status: 'restaurant_confirmed', // 确保订单状态是可接的
                courier_id: null, // 再次确认订单未被接取
            },
            data: {
                courier_id: courierId,        // 关联骑手ID
                status: 'out_for_delivery',   // 更新状态为“配送中”
                estimated_delivery_at: new Date(Date.now() + 30 * 60 * 1000), // 更新预计送达时间，e.g., 30分钟后
            },
        });

        // result.count 会返回被更新的记录数。
        // 如果为 0，意味着 where 条件没有匹配到任何记录，即订单已被其他骑手抢走或状态已改变。
        if (result.count === 0) {
            const error = new Error('抢单失败！订单可能已被其他骑手接取或状态已更新。');
            (error as any).statusCode = 409; // 409 Conflict 是一个很适合的HTTP状态码
            throw error;
        }

        // 2.操作成功后，返回完整的订单信息给前端
        return prisma.orders.findUnique({
            where: { order_id: orderId },
            include: { // 包含完整信息，方便骑手端直接使用
                restaurants: true,
                users_orders_customer_idTousers: {
                    select: { full_name: true, phone_number: true }
                }
            }
        });
    }
}
