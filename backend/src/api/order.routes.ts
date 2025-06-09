import { Router, Response, RequestHandler, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { validate } from 'class-validator';

const router = Router();
const orderService = new OrderService();

// --- 业务逻辑处理程序 (Handler) ---

const createOrderHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const createOrderDto = plainToInstance(CreateOrderDto, req.body);
    const errors = await validate(createOrderDto);

    if (errors.length > 0) {
        res.status(400).json({ message: '输入数据错误', errors });
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

// --- 路由定义 ---

/**
 * @route   POST /api/orders
 * @group   Orders - 订单管理
 * @description 用户创建新订单。需要用户登录认证。
 * @body {CreateOrderDto} - 订单信息。
 * @returns {object} 201 - 订单创建成功。
 * @returns {object} 400 - 请求体数据验证失败。
 * @returns {object} 401 - 用户未认证。
 * @returns {Error}  500 - 服务器内部错误。
 */
router.post('/', authMiddleware, createOrderHandler);

export default router;