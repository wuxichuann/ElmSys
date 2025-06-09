/**
 * @fileoverview 该文件包含了AuthService类，负责处理所有与用户认证相关的业务逻辑。
 * 包括用户注册、登录以及生成和验证JSON Web Tokens (JWT)。
 */


// 导入创建的数据库共享实例
import { prisma } from '../db/prisma';
// 导入数据传输对象(DTO)，用于定义和验证API的输入数据结构。
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
// 导入 bcrypt 库，用于安全地哈希和比较密码。
import * as bcrypt from 'bcrypt';
// 导入 jsonwebtoken 库，用于创建和验证JWT。
import * as jwt from 'jsonwebtoken';

/**
 * @interface JwtPayload
 * @description 表示JWT的有效载荷的结构，包含用于身份验证的基本用户信息。
 * @property {number} userId - 用户的唯一标识符。
 * @property {string} username - 用户的用户名。
 * @property {string} type - 用户的类型（例如：'admin'、'user'）。
 */
interface JwtPayload {
  userId: number;
  username: string;
  type: string;
}

/**
 * @description 将时间字符串（如 "1d", "7h", "30m"）转换为秒数。
 * @param timeStr - 要解析的时间字符串。
 * @returns {number} - 对应的总秒数。
 */
const parseTimeToSeconds = (timeStr: string): number => {
  const unit = timeStr.charAt(timeStr.length - 1).toLowerCase();
  const value = parseInt(timeStr.slice(0, -1), 10);

  if (isNaN(value)) {
    return 86400; // 默认返回1天的秒数作为安全备用
  }

  switch (unit) {
    case 'd': // 天
      return value * 24 * 60 * 60;
    case 'h': // 小时
      return value * 60 * 60;
    case 'm': // 分钟
      return value * 60;
    case 's': // 秒
      return value;
    default: // 如果格式不识别，也返回1天
      return 86400;
  }
};



/**
 * @class AuthService类
 * @description 封装了所有用户认证的业务逻辑。
 * 这个服务类是API控制器（Routes）和数据库模型之间的桥梁。
 */
export class AuthService {
  /**
   * @method register
   * @description 处理新用户的注册流程。
   * @param {RegisterDto} userData - 包含新用户信息的对象。
   * @returns {Promise<{ user: any; token: string }>} - 返回一个Promise，成功时解析为一个对象，包含用户信息和一个用于立即登录的JWT。
   * @throws {Error} - 如果用户名或手机号已存在，则抛出错误。
   */
  public async register(userData: RegisterDto): Promise<{ user: any; token: string }> {
    // 1. 检查用户名或手机号是否已在数据库中存在。
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username: userData.username }, { phone_number: userData.phone_number }],
      },
    });

    // 如果查询到了用户，说明信息重复，立即抛出错误，终止注册流程。
    if (existingUser) {
      throw new Error('用户名或手机号已存在');
    }

    // 2. 对用户提供的明文密码进行哈希加密。
    // `bcrypt.hash` 是一个异步操作；第二个参数 `10` 是“加盐轮数”，数值越高越安全，但计算也越慢，10是一个通用的安全值。
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. 在 `users` 表中创建一条新记录。
    const newUser = await prisma.users.create({
      data: {
        username: userData.username,
        password_hash: hashedPassword, // 存入的是加密后的密码哈希，而非明文密码。
        email: userData.email,
        phone_number: userData.phone_number,
        user_type: userData.user_type,
        full_name: userData.full_name,
      },
    });

    // 使用对象解构和剩余参数语法，创建一个不包含`password_hash`字段的新对象，确保绝不将密码哈希泄露到API响应中。
    const { password_hash, ...userWithoutPassword } = newUser;

    // 4. 为新注册的用户生成一个JWT，让他们可以立即登录。
    const token = this.generateToken(userWithoutPassword);

    // 返回经过处理的用户信息和生成的令牌。
    return { user: userWithoutPassword, token };
  }


  /**
   * @method login
   * @description 处理用户的登录验证流程。
   * @param {LoginDto} loginData - 包含用户登录凭证（标识符和密码）的对象。
   * @returns {Promise<{ user: any; token: string }>} - 返回一个Promise，成功时解析为一个对象，包含用户信息和用于后续请求的JWT。
   * @throws {Error} 如果用户不存在或密码不匹配，则抛出错误，错误信息是模糊的。
   */
  public async login(loginData: LoginDto): Promise<{ user: any; token: string }> {
    // 1. 根据用户提供的标识符（可以是用户名或手机号）在数据库中查找用户。
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ username: loginData.identifier }, { phone_number: loginData.identifier }],
      },
    });

    // 如果找不到用户或密码验证失败，都返回相同的错误信息。
    // 防止“用户枚举攻击”，即攻击者无法通过错误信息来判断一个用户名是否存在。
    if (!user) {
      throw new Error('账号或密码错误');
    }

    // 2. 验证用户输入的密码是否与数据库中存储的哈希匹配。
    // `bcrypt.compare` 会自动处理加盐，安全地进行比较。
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('账号或密码错误');
    }

    // 从返回给客户端的用户对象中移除密码哈希。
    const { password_hash, ...userWithoutPassword } = user;

    // 3. 登录成功，生成一个新的JWT。
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  /**
   * @method generateToken
   * @description 私有方法，用于根据用户信息生成JWT。
   * @param {any} user - 包含用户关键信息（如ID, 用户名, 类型）的对象。
   * @returns {string} - 返回签名后的JWT字符串。
   */
  private generateToken(user: any): string {
    // 1.定义JWT的“载荷”（Payload）：将要编码到令牌中的数据。
    // 只应包含必要且非敏感的信息，用于在后续请求中识别用户及其权限。
    const payload: JwtPayload = {
      userId: user.user_id,
      username: user.username,
      type: user.user_type,
    };

    // 2.从环境变量中读取JWT密钥和过期时间：如果环境变量未设置，则使用一个默认值（仅应在开发环境中使用）。
    const secret = process.env.JWT_SECRET || 'your-default-super-secret-key';
    const expiresInString = process.env.JWT_EXPIRES_IN || '1d';
    const expiresInSeconds = parseTimeToSeconds(expiresInString);//将字符串转换为秒数

    // 3. 定义签名选项，确保类型正确
    const options: jwt.SignOptions = {
      expiresIn: expiresInSeconds,
    };

    // 使用`jwt.sign`方法生成并签名令牌。
    return jwt.sign(payload, secret, options);
  }
}