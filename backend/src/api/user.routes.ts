/**
 * @fileoverview 用户个人信息相关的API路由模块 (user.routes.ts)
 * @description 该文件定义了与用户个人资料管理相关的API端点，
 *              包括获取、更新个人信息和修改密码。
 *              所有端点都需要用户登录认证。
 */

import { Router, Response, RequestHandler, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';
import { UpdateUserProfileDto } from '../dto/user/update-user-profile.dto';
import { ChangePasswordDto } from '../dto/user/change-password.dto';

// 创建一个新的路由实例和用户服务实例
const router = Router();
const userService = new UserService();

// =================================================================
// --- 业务逻辑处理程序 (Handlers) ---
// =================================================================

/**
 * @description 处理获取当前登录用户个人资料的请求。
 */
const getProfileHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // req.user.userId 来自于 authMiddleware 解码JWT的结果
        const userProfile = await userService.getUserProfile(req.user.userId);

        if (!userProfile) {
            // 理论上，如果token有效，用户必然存在。这是一个防御性检查。
            res.status(404).json({ message: '用户未找到' });
            return;
        }

        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};

/**
 * @description 处理更新当前登录用户个人资料的请求。
 */
const updateProfileHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. 将请求体转换为 DTO 实例以进行验证
    const updateUserDto = plainToInstance(UpdateUserProfileDto, req.body);
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
        res.status(400).json({ message: '输入数据有误', errors });
        return;
    }

    // 2. 如果请求体为空对象，直接返回成功，避免不必要的数据库操作
    if (Object.keys(updateUserDto).length === 0) {
        res.status(200).json({ message: '没有提供需要更新的数据' });
        return;
    }

    try {
        // 3. 调用服务层方法
        const updatedUser = await userService.updateUserProfile(req.user.userId, updateUserDto);
        res.status(200).json({ message: '个人资料更新成功', user: updatedUser });
    } catch (error) {
        // 4. 将业务逻辑错误（如唯一性冲突）传递给全局错误处理器
        next(error);
    }
};

/**
 * @description 处理修改当前登录用户密码的请求。
 */
const changePasswordHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. DTO 转换与验证
    const changePasswordDto = plainToInstance(ChangePasswordDto, req.body);
    const errors = await validate(changePasswordDto);

    if (errors.length > 0) {
        res.status(400).json({ message: '输入数据有误', errors });
        return;
    }

    try {
        // 2. 调用服务层方法
        await userService.changePassword(req.user.userId, changePasswordDto);
        // 3. 成功响应
        res.status(200).json({ message: '密码修改成功！建议您重新登录以确保安全。' });
    } catch (error) {
        // 4. 将业务逻辑错误（如旧密码不正确）传递给全局错误处理器
        next(error);
    }
};

// =================================================================
// --- 路由定义 (Route Definitions) ---
// =================================================================

// 所有 /api/users/ 下的路由都需要先通过 authMiddleware 进行登录验证
router.use(authMiddleware);

/**
 * @route   GET /api/users/profile
 * @group   Users - 用户个人信息
 * @description 获取当前登录用户的详细个人资料。
 * @access  Private (All roles)
 * @returns {object} 200 - 用户的个人信息。
 */
router.get('/profile', getProfileHandler);

/**
 * @route   PATCH /api/users/profile
 * @group   Users - 用户个人信息
 * @description 更新当前登录用户的个人资料（如姓名、头像、地址、邮箱、手机号）。
 * @access  Private (All roles)
 * @body {UpdateUserProfileDto} - 包含要更新字段的对象。
 * @returns {object} 200 - 更新成功，返回更新后的用户信息。
 * @returns {object} 400 - 请求体验证失败。
 * @returns {object} 409 - 邮箱或手机号冲突 (由全局错误处理器处理)。
 */
router.patch('/profile', updateProfileHandler);

/**
 * @route   PATCH /api/users/change-password
 * @group   Users - 用户个人信息
 * @description 修改当前登录用户的密码。
 * @access  Private (All roles)
 * @body {ChangePasswordDto} - 包含旧密码和新密码。
 * @returns {object} 200 - 密码修改成功。
 * @returns {object} 400 - 请求体验证失败或旧密码不正确 (由全局错误处理器处理)。
 */
router.patch('/change-password', changePasswordHandler);


export default router;