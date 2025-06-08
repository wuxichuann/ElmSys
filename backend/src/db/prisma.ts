/**
 * @file 数据库客户端模块
 * @description 负责创建并导出一个全局共享的PrismaClient实例，确保整个应用程序只使用一个数据库连接池。
 */

import { PrismaClient } from '@prisma/client';


/**
 * @description 在TypeScript的全局命名空间中声明一个可选的`prisma`变量。
 * @why 在全局对象`globalThis`上安全地挂载PrismaClient实例。
 * @type {PrismaClient | undefined}
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * @constant {PrismaClient} prisma
 * @description 导出的全局PrismaClient实例。
 * @logic 防止在开发环境的热重载过程中重复创建PrismaClient实例。
 * 1. 检查 `globalThis.prisma`是否已经存在；
 * 2. 如果`globalThis.prisma`不存在，创建新实例 `new PrismaClient()。
 */
export const prisma = globalThis.prisma || new PrismaClient({
    // 如果需要，可以在这里添加日志配置等选项
    // log: ['query', 'info', 'warn', 'error'],
});

/**
 * @description 在非生产环境中，将创建的`prisma`实例存回全局对象。
 */
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}