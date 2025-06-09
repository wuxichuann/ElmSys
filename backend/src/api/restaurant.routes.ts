/**
 * @fileoverview 浏览商家、菜单相关的API路由模块
 * @description 该文件定义了所有与商家浏览和搜索相关的API端点。
 * 它负责接收客户端的HTTP请求，使用DTO对查询参数进行验证，
 * 然后调用 `RestaurantService` 中的方法来处理业务逻辑，
 * 最后将处理结果以JSON格式返回给客户端。
 * @requires express - 用于创建路由和处理HTTP请求/响应
 * @requires RestaurantService - 处理餐厅相关业务逻辑的服务
 * @requires SearchRestaurantDto - 餐厅搜索接口的数据传输对象和验证规则
 * @requires class-validator - 用于验证DTO
 * @requires class-transformer - 用于将普通对象转换为类实例
 */

import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SearchRestaurantDto } from '../dto/restaurant/search-restaurant.dto';

// 创建一个新的路由实例
const router = Router();
// 实例化餐厅服务
const restaurantService = new RestaurantService();

// ------------------- 业务逻辑处理程序 (Handlers) -------------------

/**
 * 处理获取餐厅列表（包括搜索和分页）的 RequestHandler。
 * 该处理程序智能地根据是否存在搜索参数来决定调用不同的服务方法。
 * @param {Request} req - Express 请求对象，可能包含搜索和分页的查询参数。
 * @param {Response} res - Express 响应对象。
 * @param {NextFunction} next - Express next 中间件函数，用于错误处理。
 */
const getRestaurantsHandler: RequestHandler = async (req, res, next) => {
    // 1.检查请求中是否包含任何用于搜索或分页的查询参数
    const hasSearchParams = req.query.keyword || req.query.category || req.query.page;

    try {
        // 2.1如果请求中包含查询参数
        if (hasSearchParams) {
            // --- 高级搜索和分页逻辑 ---
            const searchDto = plainToInstance(SearchRestaurantDto, req.query);
            const errors = await validate(searchDto);

            if (errors.length > 0) {
                // 如果查询参数不符合DTO的验证规则，返回400错误
                res.status(400).json({ message: '无效的查询参数', errors });
                return;
            }

            // 调用服务层进行搜索
            const result = await restaurantService.searchRestaurants(searchDto);
            res.status(200).json(result);
        }
        // 2.1如果请求中不包含查询参数
        else {
            // --- 默认获取所有餐厅的逻辑 ---
            const restaurants = await restaurantService.getAllActiveRestaurants();
            res.status(200).json(restaurants);
        }
    } catch (error) {
        // 3.将任何在服务层发生的错误传递给全局错误处理器
        next(error);
    }
};

/**
 * 处理根据商家ID获取单个商家详情的 RequestHandler。
 * @param {Request} req - Express 请求对象，URL参数中应包含餐厅ID。
 * @param {Response} res - Express 响应对象。
 * @param {NextFunction} next - Express next 中间件函数，用于错误处理。
 */
const getRestaurantByIdHandler: RequestHandler = async (req, res, next) => {
    try {
        // 1. 将URL参数中的商家ID转换为数字
        const restaurantId = parseInt(req.params.id, 10);

        // 2. 验证商家ID是否为有效数字
        if (isNaN(restaurantId)) {
            // 对于明确的客户端错误，可以直接响应，无需传递给next
            res.status(400).json({ message: '无效的餐厅ID格式' });
            return;
        }

        // 3. 调用服务层获取详情
        const details = await restaurantService.getRestaurantDetails(restaurantId);

        // 4. 如果服务层返回null，表示资源未找到
        if (!details) {
            res.status(404).json({ message: '餐厅未找到' });
            return;
        }

        // 5. 成功找到，返回200和数据
        res.status(200).json(details);
    } catch (error) {
        // 6. 将其他（如数据库连接失败等）内部错误传递给全局错误处理器
        next(error);
    }
};


// ------------------- 路由定义 (Route Definitions) -------------------

/**
 * @route   GET /api/restaurants
 * @group   Restaurants - 餐厅浏览与搜索
 * @description 获取餐厅列表。支持默认获取全部和带参数的高级搜索。
 * @param {string} [keyword] - 搜索关键词 (查询参数)
 * @param {string} [category] - 菜品分类 (查询参数)
 * @param {number} [page=1] - 页码 (查询参数)
 * @param {number} [pageSize=10] - 每页数量 (查询参数)
 * @returns {object} 200 - 成功获取餐厅列表。
 * @returns {object} 400 - 查询参数验证失败。
 * @returns {Error}  500 - 服务器内部错误 (由全局错误处理器处理)。
 */
router.get('/', getRestaurantsHandler);

/**
 * @route   GET /api/restaurants/:id
 * @group   Restaurants - 餐厅浏览与搜索
 * @description 根据ID获取单个餐厅的详细信息及其可售菜单。
 * @param {number} id.path.required - 餐厅的唯一ID。
 * @returns {object} 200 - 成功获取餐厅详情。
 * @returns {object} 400 - 餐厅ID格式无效。
 * @returns {object} 404 - 未找到指定ID的餐厅。
 * @returns {Error}  500 - 服务器内部错误 (由全局错误处理器处理)。
 */
router.get('/:id', getRestaurantByIdHandler);

export default router;