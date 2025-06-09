/**
 * @fileoverview 订单相关的API路由模块
 * @description 定义了所有与订单相关的API端点，包括用户下单、商家接单、骑手抢单等。
 */

import { Router, Response, RequestHandler, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserType } from '../constants/user-type.enum';
import { prisma } from '../db/prisma';

const router = Router();
const orderService = new OrderService();

// =================================================================
// --- 辅助函数：权限检查 ---
// =================================================================

/**
 * 创建一个用于检查用户角色的中间件。
 * @param requiredType - 所需的用户类型。
 * @returns 返回一个 Express 中间件函数。
 */
const checkRole = (requiredType: UserType): RequestHandler => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user?.type !== requiredType) {
            res.status(403).json({ message: '权限不足，禁止访问' });
            return;
        }
        next();
    };
};


// =================================================================
// --- 业务逻辑处理程序 (Handlers) ---
// =================================================================

// --- 用户端 Handlers ---
/**
 * 处理创建订单的请求。
 */
const createOrderHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const createOrderDto = plainToInstance(CreateOrderDto, req.body);
    const errors = await validate(createOrderDto);

    if (errors.length > 0) {
        res.status(400).json({ message: '请求数据格式错误', errors });
        return;
    }

    try {
        // 从 authMiddleware 中安全地获取用户ID
        const userId = req.user.userId;
        if (!userId) {
            res.status(401).json({ message: '无法获取用户信息，请重新登录' });
            return;
        }

        const newOrder = await orderService.createOrder(userId, createOrderDto);
        res.status(201).json({ message: '下单成功！', order: newOrder });
    } catch (error) {
        // 将业务逻辑层抛出的错误传递给全局错误处理器
        next(error);
    }
};


// --- 商家端 Handlers ---
/**
 * 处理商家获取新订单列表的请求。
 */
const getNewOrdersHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. 从 JWT (req.user) 中直接获取餐厅 ID
    const restaurantId = req.user.restaurantId;

    // 2. 安全校验
    if (!restaurantId) {
        // 理论上，如果商家能登录，token里就应该有restaurantId。如果没有，说明是异常情况。
        res.status(404).json({ message: '未找到您管理的餐厅信息，请重新登录或联系客服' });
        return;
    }

    try {
        // 3. 调用服务层方法
        const orders = await orderService.getNewOrdersForRestaurant(restaurantId);
        res.status(200).json(orders);
    } catch (error) {
        // 4. 传递错误
        next(error);
    }
};

/**
 * 处理商家确认接单的请求。
 * @param req - Express 请求对象，已通过认证和角色检查。
 * @param res - Express 响应对象。
 * @param next - Express next 中间件函数。
 */
const confirmOrderHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. 从 JWT (req.user) 中直接获取餐厅 ID
    const restaurantId = req.user.restaurantId;

    // 2. 安全校验
    if (!restaurantId) {
        res.status(404).json({ message: '未找到您管理的餐厅信息' });
        return;
    }

    try {
        // 3. 验证并解析路径参数
        const orderId = parseInt(req.params.id, 10);
        if (isNaN(orderId)) {
            res.status(400).json({ message: '无效的订单ID格式' });
            return;
        }

        // 4. 调用服务层方法
        const updatedOrder = await orderService.confirmOrder(restaurantId, orderId);
        res.status(200).json({ message: '接单成功', order: updatedOrder });
    } catch (error) {
        // 5. 传递错误
        next(error);
    }
};


// --- 骑手端 Handlers ---
/**
 * 处理骑手获取可接订单列表的请求。
 */
const getAvailableOrdersHandler: RequestHandler = async (req, res, next) => {
    try {
        const orders = await orderService.getAvailableOrdersForRider();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

/**
 * 处理骑手接单（抢单）的请求。
 */
const acceptOrderHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // 1. 从JWT中获取骑手ID
        const courierId = req.user.userId;

        // 2. 验证并解析路径参数
        const orderId = parseInt(req.params.id, 10);
        if (isNaN(orderId)) {
            res.status(400).json({ message: '无效的订单ID格式' });
            return;
        }

        // 3. 调用服务层方法处理抢单逻辑
        const updatedOrder = await orderService.acceptOrder(courierId, orderId);
        res.status(200).json({ message: '抢单成功！', order: updatedOrder });
    } catch (error) {
        // 4. 传递业务逻辑层抛出的错误（如抢单失败）
        next(error);
    }
};

// =================================================================
// --- 路由定义 (Route Definitions) ---
// =================================================================

// --- 用户下单路由 ---
/**
 * @route   POST /api/orders
 * @group   Orders - 用户下单
 * @description 用户创建新订单，需要用户登录认证。
 * @access  Private (Customer)
 * @body {CreateOrderDto} - 订单信息。
 * @returns {object} 201 - 订单创建成功。
 * @returns {object} 400 - 请求体数据验证失败。
 * @returns {object} 401 - 用户未认证。
 */
router.post('/', authMiddleware, createOrderHandler);


// --- 商家订单管理路由 ---
/**
 * @route   GET /api/orders/restaurant/new
 * @group   Orders - 商家订单管理
 * @description 商家获取其名下的新订单列表 (状态为 'placed')。
 * @access  Private (Restaurant Admin)
 * @returns {Array<object>} 200 - 新订单列表。
 * @returns {object} 403 - 权限不足。
 * @returns {object} 404 - 未在JWT中找到餐厅信息。
 */
router.get(
    '/restaurant/new',
    authMiddleware, // 1. 验证登录
    checkRole(UserType.RESTAURANT_ADMIN), // 2. 验证角色
    getNewOrdersHandler // 3. 执行业务逻辑
);

/**
 * @route   PATCH /api/orders/:id/confirm
 * @group   Orders - 商家订单管理
 * @description 商家确认接单，将订单状态从 'placed' 更新为 'restaurant_confirmed'。
 * @access  Private (Restaurant Admin)
 * @param {number} id.path.required - 要确认的订单ID。
 * @returns {object} 200 - 接单成功，返回更新后的订单信息。
 * @returns {object} 400 - 订单ID无效。
 * @returns {object} 403 - 权限不足。
 * @returns {object} 404 - 订单无法被接取或未在JWT中找到餐厅信息。
 */
router.patch(
    '/:id/confirm',
    authMiddleware, // 1. 验证登录
    checkRole(UserType.RESTAURANT_ADMIN), // 2. 验证角色
    confirmOrderHandler // 3. 执行业务逻辑
);

// --- 骑手订单管理路由 ---
/**
 * @route   GET /api/orders/rider/available
 * @group   Orders - 骑手订单管理
 * @description 骑手获取可接取的订单列表（订单广场）。
 * @access  Private (Courier)
 * @returns {Array<object>} 200 - 可接订单列表。
 * @returns {object} 403 - 权限不足。
 */
router.get(
    '/rider/available',
    authMiddleware,
    checkRole(UserType.COURIER),
    getAvailableOrdersHandler
);

/**
 * @route   PATCH /api/orders/:id/accept
 * @group   Orders - 骑手订单管理
 * @description 骑手接取（抢）一个订单。
 * @access  Private (Courier)
 * @param {number} id.path.required - 要接取的订单ID。
 * @returns {object} 200 - 抢单成功，返回更新后的订单信息。
 * @returns {object} 400 - 订单ID无效。
 * @returns {object} 403 - 权限不足。
 * @returns {object} 409 - 抢单失败（由全局错误处理器处理）。
 */
router.patch(
    '/:id/accept',
    authMiddleware,
    checkRole(UserType.COURIER),
    acceptOrderHandler
);



export default router;