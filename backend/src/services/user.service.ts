/**
 * @fileoverview 用户服务模块 (user.service.ts)
 * @description 该文件定义了 `UserService` 类，负责处理所有与用户个人信息管理相关的业务逻辑，
 *              包括获取个人资料、更新基本信息、修改密码等。
 */

import { prisma } from '../db/prisma';
import * as bcrypt from 'bcrypt';
import { UpdateUserProfileDto } from '../dto/user/update-user-profile.dto';
import { ChangePasswordDto } from '../dto/user/change-password.dto';
import { UserType } from '../constants/user-type.enum';

/**
 * @class UserService
 * @description 封装了用户个人信息管理的业务逻辑。
 */
export class UserService {

    /**
     * @description 获取指定用户ID的公开个人信息。
     * @param {number} userId - 要查询的用户ID。
     * @returns {Promise<any | null>} 返回一个不含密码的用户对象，如果用户不存在则返回 null。
     */
    public async getUserProfile(userId: number) {
        return prisma.users.findUnique({
            where: { user_id: userId },
            // 使用 select 精确控制返回的字段，确保密码哈希绝不泄露
            select: {
                user_id: true,
                username: true,        //用户名
                email: true,           //邮箱
                phone_number: true,    //电话
                user_type: true,
                full_name: true,       //姓名
                avatar_url: true,      //头像
                default_address: true, //默认地址
                created_at: true,
            }
        });
    }

    /**
     * @description 更新指定用户的个人资料。
     * 如果更新邮箱或手机号，会进行唯一性检查。
     *  如果用户不是顾客，会自动忽略 `default_address` 字段。
     * @param {number} userId - 要更新的用户ID。
     * @param {UpdateUserProfileDto} data - 包含要更新字段的对象。
     * @returns {Promise<any>} 返回更新后的、不含密码的用户信息。
     * @throws {Error} 如果新的邮箱或手机号已被其他用户占用，则抛出带状态码的错误。
     */
    public async updateUserProfile(userId: number, data: UpdateUserProfileDto) {

        // --- 步骤 1: 根据用户类型处理特定字段 ---
        const currentUser = await this.getUserProfile(userId);
        if (!currentUser) {
            const error = new Error('用户不存在');
            (error as any).statusCode = 404;
            throw error;
        }

        // 如果尝试更新地址的用户不是顾客，则从待更新数据中移除该字段
        if (currentUser.user_type !== UserType.CUSTOMER && data.default_address !== undefined) {
            delete (data as Partial<UpdateUserProfileDto>).default_address;
        }

        // --- 步骤 2: 检查唯一性冲突 ---
        // 仅当请求中包含 email 或 phone_number 时才执行此检查
        if (data.email || data.phone_number) {
            const orConditions = [];
            if (data.email) {
                orConditions.push({ email: data.email });
            }
            if (data.phone_number) {
                orConditions.push({ phone_number: data.phone_number });
            }

            // 查找除了当前用户之外，是否有其他用户占用了新的邮箱或手机号
            const conflictCheck = await prisma.users.findFirst({
                where: {
                    NOT: { user_id: userId }, // 排除当前用户自身
                    OR: orConditions,
                },
                select: { email: true, phone_number: true }
            });

            if (conflictCheck) {
                if (conflictCheck.email === data.email) {
                    const error = new Error('该邮箱地址已被占用');
                    (error as any).statusCode = 409; // 409 Conflict
                    throw error;
                }
                if (conflictCheck.phone_number === data.phone_number) {
                    const error = new Error('该手机号码已被占用');
                    (error as any).statusCode = 409;
                    throw error;
                }
            }
        }

        // --- 步骤 3: 执行更新操作 ---
        return prisma.users.update({
            where: { user_id: userId },
            data: data, // Prisma 只会更新 DTO 中实际传入的字段
            select: {
                user_id: true,
                username: true,
                email: true,
                phone_number: true,
                user_type: true,
                full_name: true,
                avatar_url: true,
                default_address: true,
            }
        });
    }

    /**
     * @description 修改指定用户的登录密码。
     * @param {number} userId - 要修改密码的用户ID。
     * @param {ChangePasswordDto} data - 包含旧密码和新密码的对象。
     * @returns {Promise<void>} 操作成功时不返回任何内容。
     * @throws {Error} 如果用户不存在、旧密码不正确，则抛出带状态码的错误。
     */
    public async changePassword(userId: number, data: ChangePasswordDto): Promise<void> {
        // 1. 获取用户当前的密码哈希
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: { password_hash: true }
        });

        if (!user) {
            const error = new Error('用户不存在');
            (error as any).statusCode = 404;
            throw error;
        }

        // 2. 验证旧密码是否正确
        const isOldPasswordValid = await bcrypt.compare(data.oldPassword, user.password_hash);
        if (!isOldPasswordValid) {
            const error = new Error('旧密码不正确');
            (error as any).statusCode = 400; // Bad Request
            throw error;
        }

        // 3. 将新密码哈希化
        const newHashedPassword = await bcrypt.hash(data.newPassword, 10);

        // 4. 更新数据库中的密码哈希
        await prisma.users.update({
            where: { user_id: userId },
            data: {
                password_hash: newHashedPassword
            }
        });
        // 成功时无需返回数据
    }
}