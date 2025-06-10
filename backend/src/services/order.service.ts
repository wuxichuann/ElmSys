/**
 * @file OrderService.ts
 * @description 处理与订单相关的业务逻辑，包括创建订单、校验菜品有效性和计算订单总金额等操作。
 * @module OrderService
 */

import { prisma } from '../db/prisma';
import { Prisma, menu_items } from '@prisma/client';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { socketService } from './socket.service'; // 导入 SocketService 单例

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
            // (1)创建新订单
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

            // (2)触发 WebSocket 事件 【修改】
            // 找到餐厅老板的用户ID
            const restaurant = await tx.restaurants.findUnique({
                where: { restaurant_id: newOrder.restaurant_id },
                select: { owner_user_id: true }
            });
            if (restaurant && restaurant.owner_user_id) {
                // 向该商家推送 'new_order' 事件
                socketService.emitToUser(restaurant.owner_user_id, 'new_order', newOrder);
            }

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
            select: {
                // (1) 订单核心信息
                order_id: true,
                total_amount: true,
                status: true,
                payment_status: true, // [新增] 支付状态
                payment_method: true,
                notes: true,          // [新增] 顾客备注
                delivery_address: true, // [新增] 配送地址
                created_at: true,

                // (2) 关联的顾客信息 (保持不变)
                users_orders_customer_idTousers: {
                    select: {
                        full_name: true,
                        phone_number: true
                    }
                },

                // (3) 关联的订单详情 (结构优化)
                order_items: {
                    select: {
                        // [新增] 直接从 order_items 表中获取数量和购买时价格
                        quantity: true,
                        price_at_purchase: true,
                        // 关联的菜品信息
                        menu_items: {
                            select: {
                                item_name: true,
                                image_url: true // [新增] 也可以返回图片，UI更丰富
                            }
                        }
                    }
                },
            },

            // 3. 排序 (保持不变)
            orderBy: {
                created_at: 'asc', // 最早的订单在前面
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
                restaurant_id: restaurantId, // 安全校验：必须是自己的餐厅
                status: 'placed',            // 状态校验：必须是'placed'状态
            },
            data: {
                status: 'restaurant_confirmed', // 更新状态为 "商家已确认"
            },
        });

        // 2.检查操作结果并提供明确的错误
        // 如果 count 为 0，说明 where 条件没有匹配到任何记录。
        if (result.count === 0) {
            // (1)先检查订单是否存在:
            const orderExists = await prisma.orders.findUnique({
                where: { order_id: orderId },
                select: { status: true }
            });

            if (!orderExists) {
                const error = new Error('操作失败：订单不存在。');
                (error as any).statusCode = 404; // Not Found
                throw error;
            } else {
                // (2)如果订单存在，那失败的原因就是状态不对或权限不足。
                const error = new Error(`操作失败：订单当前状态为 "${orderExists.status}" 或您无权操作。`);
                (error as any).statusCode = 409; // Conflict or 403 Forbidden
                throw error;
            }
        }

        // 3.获取更新后的完整订单信息并触发事件 ---
        const updatedOrder = await prisma.orders.findUnique({
            where: { order_id: orderId },
            select: {
                // (1) 订单核心信息
                order_id: true,
                total_amount: true,
                status: true, // 这是更新后的新状态
                payment_status: true,
                payment_method: true,
                notes: true,
                delivery_address: true,
                created_at: true,
                updated_at: true, // [新增] 返回更新时间
                customer_id: true,

                // (2) 关联的顾客信息
                users_orders_customer_idTousers: {
                    select: {
                        full_name: true,
                        phone_number: true
                    }
                },

                // (3) 关联的订单详情
                order_items: {
                    select: {
                        quantity: true,
                        price_at_purchase: true,
                        menu_items: {
                            select: {
                                item_name: true,
                                image_url: true
                            }
                        }
                    }
                },

                // (4) 关联的餐厅信息 (这对于推送给骑手端尤其重要)
                restaurants: {
                    select: {
                        restaurant_id: true,
                        restaurant_name: true,
                        address: true, // 取餐地址
                        phone_number: true,
                    }
                }
            }
        });

        if (updatedOrder) {
            // 4.触发 WebSocket 事件 ---
            socketService.emitToUser(updatedOrder.customer_id, 'order_status_update', updatedOrder);
            socketService.broadcast('new_available_order', updatedOrder);
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
                total_amount: true,
                created_at: true,

                delivery_address: true, // 送餐地址
                restaurants: { // 包含关联的餐厅信息
                    select: {
                        restaurant_name: true,
                        address: true, // 取餐地址
                        phone_number: true,
                    }
                },

                notes: true,
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
        return prisma.$transaction(async (tx) => {
            // --- 步骤 1: 查找并锁定订单，同时获取通知所需的ID ---
            const orderToAccept = await tx.orders.findUnique({
                where: { order_id: orderId },
                select: {
                    status: true,
                    courier_id: true,
                    customer_id: true, // 获取顾客ID，用于通知顾客
                    restaurants: {     // 获取餐厅信息
                        select: {
                            owner_user_id: true // 获取商家ID，用于通知商家
                        }
                    }
                }
            });

            // --- 步骤 2: 严格的业务规则校验 ---
            if (!orderToAccept) {
                const error = new Error('订单不存在');
                (error as any).statusCode = 404;
                throw error;
            }
            if (orderToAccept.status !== 'restaurant_confirmed') {
                const error = new Error(`无法接单，订单当前状态为: ${orderToAccept.status}`);
                (error as any).statusCode = 409;
                throw error;
            }
            if (orderToAccept.courier_id !== null) {
                const error = new Error('操作失败，该订单已被其他骑手接取');
                (error as any).statusCode = 409; // 409 Conflict
                throw error;
            }

            // --- 步骤 3: 更新订单，关联骑手并变更状态 ---
            const updatedOrder = await tx.orders.update({
                where: {
                    order_id: orderId,
                },
                data: {
                    courier_id: courierId,
                    status: 'out_for_delivery',
                    estimated_delivery_at: new Date(Date.now() + 30 * 60 * 1000), // e.g., 30分钟后
                },
                // 定义最终返回给 API 调用者(即抢单成功的骑手)的完整数据结构
                select: {
                    order_id: true,
                    status: true,
                    delivery_address: true,
                    total_amount: true,
                    notes: true,
                    estimated_delivery_at: true,
                    // 包含完整的顾客、骑手和餐厅信息
                    users_orders_customer_idTousers: { select: { full_name: true, phone_number: true } },
                    users_orders_courier_idTousers: { select: { user_id: true, full_name: true, phone_number: true } },
                    restaurants: { select: { restaurant_name: true, address: true, phone_number: true } },
                }
            });

            // --- 步骤 4: 触发 WebSocket 事件 ---
            // 1. 向下单的顾客推送状态更新事件
            socketService.emitToUser(orderToAccept.customer_id, 'order_status_update', updatedOrder);

            // 2. 向商家推送状态更新事件 (需要校验 owner_user_id 是否存在)
            const ownerId = orderToAccept.restaurants?.owner_user_id;
            if (ownerId) {
                socketService.emitToUser(ownerId, 'order_status_update', updatedOrder);
            }

            // --- 步骤 5: 返回更新后的订单给抢单成功的骑手 ---
            return updatedOrder;
        });
    }
}
