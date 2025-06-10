import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class CreateMenuItemDto
 * @description 创建新菜品时的数据传输对象和验证规则。
 *              【已按新要求修改】：除了图片URL，所有字段都不能为空。
 */
export class CreateMenuItemDto {
    /**
     * @property {string} item_name - 菜品名称。
     */
    @IsString({ message: '菜品名称必须是字符串' })
    @IsNotEmpty({ message: '菜品名称不能为空' })
    item_name!: string;

    /**
     * @property {string} description - 菜品描述。
     */
    @IsString({ message: '菜品描述必须是字符串' })
    @IsNotEmpty({ message: '菜品描述不能为空' })
    description!: string;

    /**
     * @property {number} price - 菜品价格。
     */
    @Type(() => Number) // 确保从请求体中接收的值能被正确转换为数字类型
    @IsNumber({}, { message: '价格必须是数字' })
    @Min(0, { message: '价格不能为负数' })
    @IsNotEmpty({ message: '价格不能为空' })
    price!: number;

    /**
     * @property {string} category - 菜品分类。
     */
    @IsString({ message: '菜品分类必须是字符串' })
    @IsNotEmpty({ message: '菜品分类不能为空' })
    category!: string;

    /**
     * @property {string} [image_url] - 菜品图片URL，这是唯一可选的字段。
     */
    @IsOptional() // 表示这个字段可以不存在于请求体中
    @IsUrl({}, { message: '图片地址必须是有效的URL' })
    image_url?: string;

    /**
     * @property {boolean} is_available - 是否可售。
     */
    @IsBoolean({ message: '可售状态必须是布尔值' })
    @IsNotEmpty({ message: '可售状态不能为空' })
    is_available!: boolean;
}

// UpdateMenuItemDto 保持不变，因为更新时所有字段都应该是可选的。
export class UpdateMenuItemDto {
    @IsOptional() @IsString() item_name?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0) price?: number;
    @IsOptional() @IsString() category?: string;
    @IsOptional() @IsUrl() image_url?: string;
    @IsOptional() @IsBoolean() is_available?: boolean;
}