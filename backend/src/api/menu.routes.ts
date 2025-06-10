/**
 * @fileoverview 菜品管理相关的API路由模块 (menu.routes.ts)
 * @description
 * 该文件定义了所有与商家菜品管理 (CRUD) 相关的API端点。
 * 它采用了将路由定义(Router)与业务逻辑处理程序(Handler)分离的模式，
 * 以提高代码的可读性和可维护性。
 */

import { Router, Response, RequestHandler, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserType } from '../constants/user-type.enum';
import { MenuService } from '../services/menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dto/menu/menu-item.dto';

// =================================================================
// --- 业务逻辑处理程序 (Handlers / Controllers) ---
// =================================================================

const menuService = new MenuService();

/**
 * @description 处理创建新菜品的请求。
 */
const createMenuItemHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const createDto = plainToInstance(CreateMenuItemDto, req.body);
    const errors = await validate(createDto);
    if (errors.length > 0) {
        res.status(400).json({ message: '输入数据有误', errors });
        return;
    }

    try {
        const menuItem = await menuService.createMenuItem(req.user.restaurantId, createDto);
        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

/**
 * @description 处理获取商家所有菜品列表的请求。
 */
const getMenuItemsHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const items = await menuService.getMenuItems(req.user.restaurantId);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

/**
 * @description 处理更新指定菜品信息的请求。
 */
const updateMenuItemHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
        res.status(400).json({ message: '无效的菜品ID格式' });
        return;
    }

    const updateDto = plainToInstance(UpdateMenuItemDto, req.body);
    const errors = await validate(updateDto);
    if (errors.length > 0) {
        res.status(400).json({ message: '输入数据有误', errors });
        return;
    }
    // 如果更新请求体为空，则直接返回成功，避免数据库操作
    if (Object.keys(updateDto).length === 0) {
        res.status(200).json({ message: '没有提供需要更新的数据' });
        return;
    }

    try {
        const updatedItem = await menuService.updateMenuItem(req.user.restaurantId, itemId, updateDto);
        res.status(200).json(updatedItem);
    } catch (error) {
        next(error);
    }
};

/**
 * @description 处理删除指定菜品的请求。
 */
const deleteMenuItemHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
        res.status(400).json({ message: '无效的菜品ID格式' });
        return;
    }

    try {
        await menuService.deleteMenuItem(req.user.restaurantId, itemId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// =================================================================
// --- 路由定义 (Router Definition) ---
// =================================================================

const router = Router();

/**
 * @const isRestaurantAdmin
 * @description 一个中间件数组，组合了登录验证和商家角色检查。
 */
const isRestaurantAdmin: RequestHandler[] = [
    authMiddleware,
    checkRole(UserType.RESTAURANT_ADMIN)
];

// 将权限中间件应用到所有 /api/menu-items/ 下的路由
router.use(...isRestaurantAdmin);

/**
 * @route   POST /api/menu-items
 * @route   GET /api/menu-items
 * @description 菜品列表的路由，支持创建(POST)和获取(GET)。
 */
router.route('/')
    .post(createMenuItemHandler)
    .get(getMenuItemsHandler);

/**
 * @route   PATCH /api/menu-items/:id
 * @route   DELETE /api/menu-items/:id
 * @description 特定菜品的路由，支持更新(PATCH)和删除(DELETE)。
 */
router.route('/:id')
    .patch(updateMenuItemHandler)
    .delete(deleteMenuItemHandler);

export default router;