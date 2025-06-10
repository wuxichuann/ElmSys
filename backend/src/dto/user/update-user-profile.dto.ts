import { IsOptional, IsString, IsUrl, MaxLength, IsEmail, Matches } from 'class-validator';

/**
 * @class UpdateUserProfileDto
 * @description 定义更新用户(顾客、商家、骑手)基本资料时，API允许接收的字段和验证规则。
 *              【简化模式】: 允许修改邮箱和手机号，无需额外验证。
 */
export class UpdateUserProfileDto {
    /**
     * @property {string} [full_name] - 用户的真实姓名或昵称。
     */
    @IsOptional()
    @IsString({ message: '姓名必须是字符串' })
    @MaxLength(100, { message: '姓名长度不能超过100个字符' })
    full_name?: string;

    /**
     * @property {string} [avatar_url] - 用户的头像URL。
     */
    @IsOptional()
    @IsUrl({}, { message: '头像必须是有效的URL地址' })
    avatar_url?: string;

    /**
     * @property {string} [default_address] - 顾客的默认收货地址。
     */
    @IsOptional()
    @IsString({ message: '地址必须是字符串' })
    default_address?: string;

    /**
     * @property {string} [email] - 【新增】用户的新电子邮箱地址。
     * @description 注意：由于是简化模式，后端不会发送验证邮件。
     *              但会检查格式和唯一性。
     */
    @IsOptional()
    @IsEmail({}, { message: '请输入有效的邮箱地址' })
    email?: string;

    /**
     * @property {string} [phone_number] - 【新增】用户的新手机号码。
     * @description 注意：由于是简化模式，后端不会发送短信验证码。
     *              但会检查格式和唯一性。
     */
    @IsOptional()
    @IsString({ message: '手机号必须是字符串' })
    // 可以添加一个简单的手机号格式正则，比如中国的11位手机号
    // @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号码' })
    phone_number?: string;
}