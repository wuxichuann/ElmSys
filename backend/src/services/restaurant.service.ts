/**
 * @file 商家服务模块 (restaurant.service.ts)
 * @description
 * 该文件定义了 `RestaurantService` 类，负责处理与商家服务（浏览商家列表、浏览商家详情和菜品列表
 * 、支持搜索）相关的业务逻辑。
 * @module services/restaurant
 */

// 导入创建的数据库共享实例
import { prisma } from '../db/prisma';
import { SearchRestaurantDto } from '../dto/restaurant/search-restaurant.dto';


/**
 * @class RestaurantService类
 * @description 封装了与商家及其菜单相关的业务逻辑。
 */
export class RestaurantService {
    /**
     * @description 获取所有营业中的餐厅列表
     *  @returns {Promise<Array<object>>} 一个解析为餐厅对象数组的Promise。
     */
    public async getAllActiveRestaurants() {
        return prisma.restaurants.findMany({
            // 1.筛选条件：必须是营业中的餐厅
            where: { is_active: true },
            // 2.选择必要信息：前端展示列表时所必需的字段
            select: {
                restaurant_id: true,
                restaurant_name: true,
                description: true,
                address: true,
                logo_url: true,
                opening_hours: true,
            },
        });
    }

    /**
     * @description 根据提供的餐厅ID，获取单个餐厅的完整详细信息，以及其所有可售菜品。
     * @param {number} restaurantId - 需要查询的餐厅的唯一ID。
     * @returns {Promise<object|null>} - 一个解析为单个餐厅对象的 Promise。
     * 包含餐厅的所有字段，以及一个名为 `menu_items` 的数组（所有可售的菜品）。
     */
    public async getRestaurantDetails(restaurantId: number) {
        return prisma.restaurants.findUnique({
            // 1.筛选条件：商家ID
            where: { restaurant_id: restaurantId },
            // 2.使用include加载餐厅菜品
            include: {
                menu_items: {
                    where: { is_available: true }, //只加载可售的菜品
                },
            },
        });
    }

    /**
     * @description 根据多种条件动态搜索餐厅列表，并支持分页。
     * @param {SearchRestaurantDto} queryParams - 包含搜索关键词、菜品分类、分页等信息的查询对象。
     * @returns {Promise<{data: object[], total: number}>} 返回包含餐厅列表、总记录数和分页信息的对象。
     */
    public async searchRestaurants(queryParams: SearchRestaurantDto) {
        const { keyword, category, page = 1, pageSize = 10 } = queryParams;

        // 1.筛选条件：使用展开语法和短路逻辑，一次性构建where对象
        const whereClause = {
            // (1)搜索营业中的餐厅
            is_active: true,
            // (2)按搜索关键词查询：如果keyword存在，则展开OR条件
            ...(keyword && {
                OR: [
                    { restaurant_name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            }),
            // （3）按菜品分类查询：如果category存在，则展开menu_items条件
            ...(category && {
                menu_items: {
                    some: {
                        category: {
                            equals: category,
                        },
                        is_available: true,
                    },
                },
            }),
        };

        // 2.使用事务同时查询餐厅列表和总记录数
        const [restaurants, total] = await prisma.$transaction([
            // (1)查询符合条件的餐厅列表
            prisma.restaurants.findMany({
                // 筛选条件
                where: whereClause,
                // 前端展示列表时所必需信息
                select: {
                    restaurant_id: true,
                    restaurant_name: true,
                    description: true,
                    address: true,
                    logo_url: true,
                    opening_hours: true,
                },
                // 跳过前面(page - 1) * pageSize条记录
                skip: (page - 1) * pageSize,
                // 取当前页的记录数量
                take: pageSize,
            }),
            // (2)查询符合条件的餐厅总数
            prisma.restaurants.count({ where: whereClause }),
        ]);

        // 返回包含餐厅列表、总记录数和分页信息的对象
        return { data: restaurants, total, page, pageSize };
    }

}