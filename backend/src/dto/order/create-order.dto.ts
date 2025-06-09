import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

/**
 * @class OrderItemDto
 * @description 表示订单中的单个菜品项，包括菜品ID和数量。
 */
class OrderItemDto {
    /**
     * @property {number} itemId - 菜品的唯一标识符，必须是整数。
     */
    @IsInt({ message: '菜品ID必须是整数' })
    itemId!: number;

    /**
     * @property {number} quantity - 菜品的数量，必须是正整数，至少为1。
     */
    @IsInt({ message: '数量必须是整数' })
    @Min(1, { message: '数量至少为1' })
    quantity!: number;
}

/**
 * @class CreateOrderDto
 * @description 表示创建订单所需的数据传输对象，包括餐厅ID、配送地址和订单项等信息。
 */
export class CreateOrderDto {
    /**
     * @property {number} restaurantId - 餐厅的唯一标识符，必须是整数。
     */
    @IsInt()
    restaurantId!: number;

    /**
     * @property {string} deliveryAddress - 外卖配送地址，不能为空，必须是字符串。
     */
    @IsString({ message: '配送地址必须是字符串' })
    @IsNotEmpty({ message: '配送地址不能为空' })
    deliveryAddress!: string;

    /**
     * @property {OrderItemDto[]} items - 订单中的菜品项数组，不能为空。
     * 关键：这是一个包含多个 OrderItemDto 的数组。
     * @example [{ itemId: 123, quantity: 2 }, { itemId: 456, quantity: 1 }]
     */
    @IsArray()
    @ValidateNested({ each: true }) // 对数组中的每个对象都进行验证
    @Type(() => OrderItemDto) // 使用 class-transformer 转换数组中的对象为 OrderItemDto 类型
    items!: OrderItemDto[];

    /**
     * @property {string} [notes] - 用户备注信息，可选。
     */
    @IsString()
    @IsOptional() // 备注是可选的
    notes?: string;

    /**
     * @property {string} [paymentMethod] - 支付方式，可选，简化处理。
     * @example "支付宝"
     */
    @IsString()
    @IsOptional()
    paymentMethod?: string;
}