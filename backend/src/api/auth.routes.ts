/**
 * @fileoverview 认证相关的API路由模块
 * @description 该文件定义了所有与用户认证相关的API端点，包括用户注册和登录。
 * 它接收客户端的HTTP请求，使用DTO对请求体进行验证，
 * 然后调用相应的AuthService方法来处理业务逻辑,
 * 最后根据处理结果向客户端返回 JSON 响应。
 * @requires express - 用于创建路由
 * @requires AuthService - 处理认证业务逻辑的服务
 * @requires RegisterDto - 注册接口的数据传输对象和验证规则
 * @requires LoginDto - 登录接口的数据传输对象和验证规则
 * @requires class-validator - 用于验证 DTO
 * @requires class-transformer - 用于将普通对象转换为类实例
 */

import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterRestaurantDto } from '../dto/auth/register-restaurant.dto';
import { UserType } from '../constants/user-type.enum';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

const router = Router();
const authService = new AuthService();

// ------------------- 业务逻辑处理程序 (Handlers) -------------------

/**
 * 处理用户（顾客、骑手）注册请求的 RequestHandler。
 * @param req - Express 请求对象，请求体应包含用户注册信息。
 * @param res - Express 响应对象。
 * @param next - Express next 中间件函数，用于错误处理。
 */
const registerHandler: RequestHandler = async (req, res, next) => {
  // 1. 将请求体转换为 RegisterDto 类的实例
  const registerDto = plainToInstance(RegisterDto, req.body);

  // 2. 验证 DTO
  const errors = await validate(registerDto);
  if (errors.length > 0) {
    res.status(400).json({ message: '输入数据有误', errors });
    return;
  }

  // 3.安全检查：防止通过此通用接口注册商家
  if (registerDto.user_type === UserType.RESTAURANT_ADMIN) {
    res.status(400).json({ message: '商家注册请使用专用接口' });
    return;
  }

  try {
    // 3. 调用服务层处理业务逻辑
    const { user, token } = await authService.register(registerDto);
    // 4. 成功响应
    res.status(201).json({ message: '注册成功', user, token });
  } catch (error) {
    // 5. 捕获业务逻辑错误，并将其传递给 Express 的错误处理流程
    next(error);
  }
};


/**
 * 处理商家注册并创建餐厅请求的 Handler。
 * @param req - Express 请求对象。
 * @param res - Express 响应对象。
 * @param next - Express next 中间件函数。
 */
const registerRestaurantHandler: RequestHandler = async (req, res, next) => {
  // 1. 将请求体转换为 RegisterDto 类的实例
  const registerRestaurantDto = plainToInstance(RegisterRestaurantDto, req.body);

  // 2. 验证 DTO
  const errors = await validate(registerRestaurantDto);
  if (errors.length > 0) {
    res.status(400).json({ message: '输入数据有误', errors });
    return;
  }

  try {
    // 3. 调用服务层处理业务逻辑
    const { user, token } = await authService.registerRestaurantAdmin(registerRestaurantDto);
    // 4. 成功响应
    res.status(201).json({ message: '商家注册及其名下餐厅创建成功', user, token });
  } catch (error) {
    // 5. 捕获业务逻辑错误，并将其传递给 Express 的错误处理流程
    next(error);
  }
};

/**
 * 处理用户登录请求的 RequestHandler。
 * @param req - Express 请求对象，请求体应包含用户登录凭证。
 * @param res - Express 响应对象。
 * @param next - Express next 中间件函数，用于错误处理。
 */
const loginHandler: RequestHandler = async (req, res, next) => {
  // 1. 将请求体转换为 LoginDto 类的实例
  const loginDto = plainToInstance(LoginDto, req.body);

  // 2. 验证 DTO
  const errors = await validate(loginDto);
  if (errors.length > 0) {
    res.status(400).json({ message: '输入数据有误', errors });
    return;
  }

  try {
    // 3. 调用服务层处理业务逻辑
    const { user, token } = await authService.login(loginDto);
    // 4. 成功响应
    res.status(200).json({ message: '登录成功', user, token });
  } catch (error) {
    // 5. 捕获业务逻辑错误，并将其传递给 Express 的错误处理流程
    next(error);
  }
};


// ------------------- 路由定义 -------------------

/**
 * @route   POST /api/auth/register
 * @group   Authentication - 用户认证接口
 * @description 通用注册接口，用于顾客(customer)和骑手(courier)。
 * @param {RegisterDto.model} request.body.required - 注册信息。
 * @returns {object} 201 - 注册成功。
 * @returns {object} 400 - 请求体验证失败。
 * @returns {object} 409 - 注册冲突 (由全局错误处理器处理)。
 */
router.post('/register', registerHandler);

/**
 * @route   POST /api/auth/register/restaurant
 * @group   Authentication - 用户认证接口
 * @description 商家专用注册接口，同时创建餐厅。
 * @param {RegisterRestaurantDto.model} request.body.required - 包含用户和餐厅的注册信息。
 * @returns {object} 201 - 商家和餐厅创建成功。
 */
router.post('/register/restaurant', registerRestaurantHandler);

/**
 * @route   POST /api/auth/login
 * @group   Authentication - 用户认证接口
 * @description 用户登录接口。
 * @param {LoginDto.model} request.body.required - 用户登录凭证。
 * @returns {object} 200 - 登录成功。
 * @returns {object} 400 - 请求体验证失败。
 * @returns {object} 401 - 认证失败 (由全局错误处理器处理)。
 */
router.post('/login', loginHandler);

export default router;