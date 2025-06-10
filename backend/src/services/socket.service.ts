import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

// 这个类将管理所有与Socket.IO相关的逻辑
export class SocketService {
    private static instance: SocketService;
    private io!: SocketIOServer;

    // 使用一个 Map 来存储 userId 和其对应的 socketId
    // 这样我们就可以根据用户ID向特定用户发送消息
    private userSocketMap: Map<number, string> = new Map();

    private constructor() {
        // 私有构造函数，确保单例模式
    }

    // 获取 SocketService 的单例
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    // 初始化 Socket.IO 服务器并附加到 HTTP 服务器上
    public initialize(httpServer: HttpServer): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*", // 在生产环境中，应配置为你的前端域名
                methods: ["GET", "POST"],
            },
        });

        // 监听客户端连接事件
        this.io.on('connection', (socket: Socket) => {
            console.log(`[Socket] A user connected: ${socket.id}`);

            // 监听客户端发送的 'register' 事件，用于关联 userId 和 socketId
            socket.on('register', (userId: number) => {
                console.log(`[Socket] Registering user ${userId} with socket ${socket.id}`);
                this.userSocketMap.set(userId, socket.id);
            });

            // 监听客户端断开连接事件
            socket.on('disconnect', () => {
                console.log(`[Socket] User disconnected: ${socket.id}`);
                // 当用户断开连接时，从 Map 中移除他们的记录
                for (const [userId, socketId] of this.userSocketMap.entries()) {
                    if (socketId === socket.id) {
                        this.userSocketMap.delete(userId);
                        break;
                    }
                }
            });
        });
    }

    // 发送事件给特定用户
    public emitToUser(userId: number, event: string, data: any): boolean {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            console.log(`[Socket] Emitting event '${event}' to user ${userId} (socket ${socketId})`);
            this.io.to(socketId).emit(event, data);
            return true;
        }
        console.log(`[Socket] User ${userId} not connected, cannot emit event '${event}'`);
        return false;
    }

    // 广播事件给所有连接的客户端 (例如，有新订单可供所有骑手抢单)
    public broadcast(event: string, data: any): void {
        console.log(`[Socket] Broadcasting event '${event}' to all clients`);
        this.io.emit(event, data);
    }
}

// 导出单例，方便在其他地方使用
export const socketService = SocketService.getInstance();