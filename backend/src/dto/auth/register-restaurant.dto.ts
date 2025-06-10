import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterDto } from './register.dto'; // 我们将复用基础的用户信息DTO

/**
 * @class RestaurantDataDto
 * @description 定义餐厅信息的数据结构
 */
class RestaurantDataDto {
    /**
     * @property {string} restaurant_name - 餐厅名称
     */
    @IsString({ message: '餐厅名称必须是字符串' })
    @IsNotEmpty({ message: '餐厅名称不能为空' })
    restaurant_name!: string;

    /**
     * @property {string} description - 餐厅描述
     */
    @IsString()
    @IsNotEmpty({ message: '餐厅描述不能为空' })
    description!: string;

    /**
   * @property {string} address - 餐厅地址
   */
    @IsString()
    @IsNotEmpty({ message: '餐厅地址不能为空' })
    address!: string;

    /**
     * @property {string} phone_number - 餐厅联系电话
     */
    @IsString()
    @IsNotEmpty({ message: '餐厅联系电话不能为空' })
    phone_number!: string;

    /**
     * @property {string} opening_hours - 餐厅营业时间
     */
    @IsString()
    @IsNotEmpty({ message: '营业时间不能为空' })
    opening_hours!: string;

    // 其他可选的餐厅字段...
}

/**
 * @class RegisterRestaurantDto
 * @description 组合用户信息和餐厅信息的商家注册数据传输对象
 */
export class RegisterRestaurantDto {
    /**
     * @property 嵌套验证用户信息
     * @type {RegisterDto}
     * @throws {Error} 如果用户信息无效
     */
    @ValidateNested()
    @Type(() => RegisterDto) // 告诉 class-transformer 如何转换
    user!: RegisterDto;

    /**
     * @property 嵌套验证餐厅信息
     * @type {RestaurantDataDto}
     * @throws {Error} 如果餐厅信息无效
     */
    @ValidateNested()
    @Type(() => RestaurantDataDto)
    restaurant!: RestaurantDataDto;
}
