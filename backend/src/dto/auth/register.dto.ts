// 从 'class-validator' 库中导入需要的验证装饰器。
// 每个装饰器都代表一个验证规则。
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

// 从自己定义的常量文件中导入 UserType 枚举。
// 这是为了确保传入的 user_type 必须是 'customer', 'courier', 'restaurant_admin' 中的一个。
import { UserType } from '../../constants/user-type.enum';


/**
 * @class RegisterDto
 * @description 定义“用户注册”时，API期望接收的数据结构和验证规则。
 */
export class RegisterDto {
  /**
   * @property {string} username - 用户的登录名，必须唯一。
   * @decorator @IsString() - 确保必须是一个字符串，否则返回指定的错误消息'用户名必须是字符串'。
   * @decorator @IsNotEmpty() - 确保不能为空，否则返回指定的错误消息 '账号不能为空'。
   */
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username!: string;

  /**
   * @property {string} password - 用户设置的密码，明文形式。
   * @description 在DTO层接收明文密码，加密操作将在Service层进行。
   * @decorator @IsString()
   * @decorator @MinLength() - 确保密码的最小长度是6个字符。
   */
  @IsString()
  @MinLength(6, { message: '密码至少需要6位' })
  password!: string;

  /**
   * @property {string} email - 用户的电子邮箱地址，必须唯一。
   * @decorator @IsEmail() - 确保'email'的值符合标准的邮箱格式。
   */
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  /**
   * @property {string} phone_number - 用户的手机号码，必须唯一。
   * @decorator @IsString()
   * @decorator @IsNotEmpty() - 确保手机号字段不为空。
   * @type {string}
   */
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  phone_number!: string;

  /**
   * @property {UserType} user_type - 用户的类型。
   * @decorator @IsEnum(UserType) - 确保该字段的值必须是 UserType 枚举中定义的成员之一。
   * @enum {'customer' | 'courier' | 'restaurant_admin'}
   */
  @IsEnum(UserType, { message: '无效的用户类型' })
  user_type!: UserType;
  
  /**
   * @property {string} full_name - 用户的真实姓名。
   * @decorator @IsString()
   * @decorator @IsNotEmpty()
   * @type {string}
   */
  @IsString()
  @IsNotEmpty({ message: '真实姓名不能为空' })
  full_name!: string;
}