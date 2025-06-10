/**
 * @fileoverview 菜品服务模块 (menu.service.ts)
 * @description
 * 该文件定义了 `MenuService` 类，封装了所有与餐厅菜品管理相关的业务逻辑。
 * 它负责处理菜品的创建(Create)、读取(Read)、更新(Update)和删除(Delete)操作，
 * 并确保所有操作都经过了严格的权限校验，即商家只能管理自己餐厅的菜品。
 * @module services/menu
 */

import { prisma } from '../db/prisma';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dto/menu/menu-item.dto';

/**
 * @class MenuService
 * @description 封装了所有菜品管理的CRUD业务逻辑。
 */
export class MenuService {

    /**
     * @private
     * @method verifyItemOwnership
     * @description 一个私有的辅助函数，用于验证指定菜品是否属于指定的餐厅。
     *              这是所有更新和删除操作前必须执行的安全检查。
     * @param {number} restaurantId - 发起操作的商家所拥有的餐厅ID。
     * @param {number} itemId - 目标菜品的ID。
     * @returns {Promise<any>} 如果验证通过，返回该菜品对象。
     * @throws {Error} 如果菜品不属于该餐厅或菜品不存在，则抛出一个带404状态码的错误。
     */
    private async verifyItemOwnership(restaurantId: number, itemId: number) {
        const item = await prisma.menu_items.findFirst({
            where: {
                item_id: itemId,
                restaurant_id: restaurantId // 关键校验：确保 restaurant_id 匹配
            }
        });

        // 如果找不到匹配的记录，说明该菜品要么不存在，要么不属于这个商家。
        if (!item) {
            const error = new Error('菜品未找到或您无权操作');
            (error as any).statusCode = 404; // 使用 404 Not Found 更为语义化
            throw error;
        }
        return item;
    }

    /**
     * @method createMenuItem
     * @description 为指定的餐厅创建一个新的菜品。
     * @param {number} restaurantId - 要添加菜品的餐厅ID。
     * @param {CreateMenuItemDto} data - 包含新菜品信息的DTO对象。
     * @returns {Promise<any>} 返回新创建的菜品对象。
     */
    public async createMenuItem(restaurantId: number, data: CreateMenuItemDto) {
        // 使用展开语法将传入的菜品数据和 restaurantId 合并到 data 对象中，
        // 然后调用 Prisma 的 create 方法。
        return prisma.menu_items.create({
            data: { ...data, restaurant_id: restaurantId }
        });
    }

    /**
     * @method getMenuItems
     * @description 获取指定餐厅的所有菜品列表。
     * @param {number} restaurantId - 餐厅的ID。
     * @returns {Promise<any[]>} 返回该餐厅的菜品对象数组，按创建时间降序排列。
     */
    public async getMenuItems(restaurantId: number) {
        return prisma.menu_items.findMany({
            where: { restaurant_id: restaurantId },
            orderBy: { created_at: 'desc' } // 最新的菜品显示在最前面，便于管理
        });
    }

    /**
     * @method updateMenuItem
     * @description 更新一个已存在的菜品信息。
     * @param {number} restaurantId - 发起操作的商家的餐厅ID。
     * @param {number} itemId - 要更新的菜品的ID。
     * @param {UpdateMenuItemDto} data - 包含要更新字段的DTO对象。
     * @returns {Promise<any>} 返回更新后的菜品对象。
     */
    public async updateMenuItem(restaurantId: number, itemId: number, data: UpdateMenuItemDto) {
        // 步骤 1: 在执行任何更新操作前，必须先验证所有权。
        await this.verifyItemOwnership(restaurantId, itemId);

        // 步骤 2: 验证通过后，执行更新。
        // Prisma 的 update 方法只会更新 `data` 对象中提供的字段。
        return prisma.menu_items.update({
            where: { item_id: itemId },
            data: data
        });
    }

    /**
     * @method deleteMenuItem
     * @description 删除一个指定的菜品。
     * @param {number} restaurantId - 发起操作的商家的餐厅ID。
     * @param {number} itemId - 要删除的菜品的ID。
     * @returns {Promise<any>} 返回被删除的菜品对象。
     */
    public async deleteMenuItem(restaurantId: number, itemId: number) {
        // 步骤 1: 同样，删除前必须先验证所有权。
        await this.verifyItemOwnership(restaurantId, itemId);

        // 步骤 2: 验证通过后，执行删除。
        return prisma.menu_items.delete({
            where: { item_id: itemId }
        });
    }
}