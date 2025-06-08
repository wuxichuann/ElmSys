// 导入需要的装饰器和函数。
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * @class LoginDto
 * @description 定义用户登录时，API接口需要接收的数据结构和验证规则。
 */
export class LoginDto {
  /**
   * @property {string} identifier - 用户的登录标识符。
   * @description 这个字段可以接受两种类型的值：用户名或手机号码,提供了更灵活的登录方式。
   * @decorator @IsString() - 确保必须是一个字符串。
   * @decorator @IsNotEmpty() - 确保不能为空，否则返回指定的错误消息 '账号不能为空'。
   */
  @IsString()
  @IsNotEmpty({ message: '账号不能为空' })
  identifier!: string;

  /**
   * @property {string} password - 用户的登录密码。
   * @description 用于接收用户输入的明文密码，后端服务接收后将其与数据库中存储的加密的密码哈希（password_hash）进行比较，以验证用户身份。
   * @decorator @IsString()
   * @decorator @MinLength() - 要求 `password` 字符串的长度至少为6个字符，否则返回错误消息 '密码至少需要6位'。
   */
  @IsString()
  @MinLength(6, { message: '密码至少需要6位' })
  password!: string;
}