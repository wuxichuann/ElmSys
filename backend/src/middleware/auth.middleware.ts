/**
 * @fileoverview 认证中间件
 * @description 这个中间件用于保护那些需要登录才能访问的接口。
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

/**
 * @interface AuthenticatedRequest接口
 * @description 扩展Express的原生Request接口，新增可选`user`属性存储从JWT中解码出的用户信息
 * @extends {Request}
 */
export interface AuthenticatedRequest extends Request {
    user?: any;
}

/**
 * @description Express中间件，用于验证JWT并保护路由。
 * @param {AuthenticatedRequest} req - Express 的请求对象，已被扩展以包含 `user` 属性。
 * @param {Response} res - Express 的响应对象，用于向客户端发送响应。
 * @param {NextFunction} next - Express 的 next 函数，用于将请求传递到处理链的下一个环节。
 * @returns {void | Response} 如果验证失败，则直接返回一个 JSON 响应；如果成功，则不返回任何内容，而是调用 `next()`。
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 从请求头获取 'Authorization' 字段
    const authHeader = req.headers.authorization;

    // 1.检查请求头是否存在以及格式是否为 'Bearer '开头：
    // 如果请求头或令牌不存在，它会返回 401 Unauthorized 错误。
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: '认证失败：缺少或格式错误的令牌' });
        return;
    }

    // 分割字符串'Bearer <token>'，获取令牌部分
    const token = authHeader.split(' ')[1];

    try {
        // 从环境变量中获取JWT密钥，如果未设置则使用一个默认的（生产环境中不推荐）
        const secret = process.env.JWT_SECRET || 'your-default-super-secret-key';

        // 2.如果存在，使用环境变量中的`JWT_SECRET`验证并解码令牌：
        // 如果令牌无效，此行会抛出错误。
        const decoded = jwt.verify(token, secret);

        // 3.验证成功后，将令牌中解码后的用户信息负载附加到请求对象`req`上：
        req.user = decoded;

        // 4.令牌有效，将请求传递/控制权给下一个中间件或路由处理器
        next();
    } catch (error) {
        // 5.如果令牌无效（如已过期或签名不匹配），返回 401 Unauthorized 错误。
        // 捕获 jwt.verify 抛出的错误（如 TokenExpiredError, JsonWebTokenError）
        res.status(401).json({ message: '认证失败：无效的令牌' });
        return;
    }
};