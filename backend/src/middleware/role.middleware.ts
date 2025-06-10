/**
 * @fileoverview 角色权限检查中间件 (role.middleware.ts)
 * @description 定义了用于验证用户角色的可复用Express中间件。
 */

import { Response, RequestHandler, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware'; // 导入扩展后的请求类型
import { UserType } from '../constants/user-type.enum';

/**
 * @function checkRole
 * @description 一个中间件工厂函数，它接收一个所需角色类型，并返回一个用于检查该角色的Express中间件。
 * @param {UserType} requiredType - 访问该路由所必须的用户角色。
 * @returns {RequestHandler} 一个标准的Express请求处理函数（中间件）。
 * 
 * @example
 * // 在路由定义中使用
 * router.get('/admin-only', checkRole(UserType.RESTAURANT_ADMIN), (req, res) => { ... });
 */
export const checkRole = (requiredType: UserType): RequestHandler => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // 检查从 authMiddleware 附加的 req.user 对象及其 type 属性
        if (req.user?.type !== requiredType) {
            // 如果用户类型不匹配，返回 403 Forbidden 错误
            res.status(403).json({ message: '权限不足，禁止访问' });
            return;
        }
        // 权限校验通过，将请求传递给下一个处理程序
        next();
    };
};