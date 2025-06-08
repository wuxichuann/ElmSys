// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth.routes'; // 导入auth路由

dotenv.config(); // 加载.env文件

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON请求体

// 使用路由，并添加/api前缀
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('馋了么餐饮服务平台后端 API 准备就绪!');
});

app.listen(PORT, () => {
  console.log(`✅ 后端服务已启动，运行在 http://localhost:${PORT}`);
});
