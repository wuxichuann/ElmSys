import { IsEnum } from 'class-validator';


/**
 * 定义商家可以手动将订单更新到的状态。
 * 枚举值对应数据库中订单状态字段的 ENUM 值。
 */
export enum AllowedRestaurantStatus {
    /**
     * 订单状态：制作中
     * 表示餐厅已确认订单并开始准备餐品
     */
    PREPARING = 'preparing',

    /**
     * 订单状态：可取餐
     * 表示餐品已准备好，骑手可以来取餐
     */
    READY_FOR_PICKUP = 'ready_for_pickup'
}

/**
 * 数据传输对象（DTO）：用于接收前端传来的订单状态更新请求
 * 该 DTO 确保商家只能将订单状态更新为允许的值
 */
export class UpdateOrderStatusDto {
    /**
     * 要更新的目标订单状态
     * 必须是 AllowedRestaurantStatus 枚举中的一个有效值
     *
     * @IsEnum 验证装饰器：
     * - 第一个参数指定允许的枚举类型
     * - 第二个参数为校验失败时返回的错误信息
     */
    @IsEnum(AllowedRestaurantStatus, { message: '无效的目标状态' })
    status!: AllowedRestaurantStatus; // 使用非空断言操作符表示该字段必填
}