/**
 * @fileoverview "馋了么" 平台后端应用主入口文件 (index.ts)
 * @description
 * 该文件负责：
 * 1. 导入所有必要的模块和库。
 * 2. 创建 Express 应用实例和 HTTP 服务器。
 * 3. 初始化并配置 Socket.IO 服务，用于实时通信。
 * 4. 设置所有全局中间件，如 CORS, JSON body parser。
 * 5. 挂载所有业务逻辑的路由模块 (auth, users, restaurants, orders, menu-items)。
 * 6. 定义一个全局错误处理器，用于捕获和响应服务层抛出的错误。
 * 7. 启动服务器并监听指定端口。
 */

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

// 导入所有路由模块
import authRoutes from './api/auth.routes';
import restaurantRoutes from './api/restaurant.routes';
import orderRoutes from './api/order.routes';
import menuRoutes from './api/menu.routes';      // ✅ 【新增】导入菜品管理路由
import userRoutes from './api/user.routes';      // ✅ 【新增】导入用户管理路由

// 导入实时通信服务
import { socketService } from './services/socket.service';

// 加载环境变量
dotenv.config();

// --- 1. 初始化应用和服务器 ---
const app = express();
const httpServer = http.createServer(app); // 使用 http 模块创建服务器，以便与 Socket.IO 共享
const PORT = process.env.PORT || 3001;

// --- 2. 初始化 Socket.IO ---
socketService.initialize(httpServer);

// --- 3. 设置全局中间件 ---
app.use(cors({ origin: '*' })); // 允许所有来源的跨域请求 (生产环境应配置具体域名)
app.use(express.json());       // 解析 application/json 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded 格式的请求体

// --- 4. 挂载所有API路由 ---
// 为每个路由模块设置一个基础路径前缀，这是 RESTful API 的最佳实践
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);              // ✅ 【新增】挂载用户个人信息路由
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuRoutes);         // ✅ 【新增】挂载菜品管理路由
app.use('/api/orders', orderRoutes);

// --- 5. 定义根路径和全局错误处理器 ---
// 一个简单的根路径，用于健康检查或欢迎信息
app.get('/', (req: Request, res: Response) => {
  res.send('"馋了么" 餐饮服务平台后端 API 准备就绪!');
});

// 全局错误处理中间件。必须有4个参数 (err, req, res, next) 才能被 Express 识别为错误处理器。
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err); // 在服务器控制台打印详细错误

  // 从错误对象中获取状态码和消息，如果不存在则使用默认值
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部发生错误';

  // 向客户端发送一个标准化的错误响应
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: message,
  });
});


// --- 6. 启动服务器 ---
// 使用 httpServer.listen 而不是 app.listen，确保 Socket.IO 正常工作
httpServer.listen(PORT, () => {
  console.log(`✅ "馋了么" 后端服务已启动，运行在 http://localhost:${PORT}`);
});