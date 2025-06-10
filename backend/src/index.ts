// src/index.ts
import 'reflect-metadata';

import express, { Request, Response } from 'express';
import http from 'http'; // 导入原生的 http 模块
import { socketService } from './services/socket.service'; // 导入SocketService单例
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './api/auth.routes'; // 导入auth路由
import restaurantRoutes from './api/restaurant.routes';
import orderRoutes from './api/order.routes';

dotenv.config(); // 加载.env文件

const app = express();
const httpServer = http.createServer(app); // 创建一个 HTTP 服务器实例
const PORT = process.env.PORT || 3001;

// 关键：初始化 Socket.IO 服务并传入 HTTP 服务器实例**
socketService.initialize(httpServer);

app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON请求体

// 使用路由，并添加/api前缀
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('馋了么餐饮服务平台后端 API 准备就绪!');
});

httpServer.listen(PORT, () => {
  console.log(`✅ 后端服务已启动，运行在 http://localhost:${PORT}`);
});
