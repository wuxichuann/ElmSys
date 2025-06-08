/**
 * @enum {string} UserType
 * @description 定义了系统中所有可能的用户角色类型。
 * 这个枚举确保了在代码中使用的用户类型值是一致和受控的，
 * 避免了因手写字符串（如 "customer"）可能导致的拼写错误。
 */

export enum UserType {
    /**
     * 普通顾客。
     * 这类用户可以浏览菜品、下单、查看订单状态等。
     */
    CUSTOMER = 'customer',
  
    /**
     * 骑手。
     * 这类用户可以查看待接订单、接单、更新配送状态等。
     */
    COURIER = 'courier',
  
    /**
     * 商家。
     * 这类用户可以管理餐厅信息、增删改查菜品、处理订单、查看数据统计等。
     */
    RESTAURANT_ADMIN = 'restaurant_admin',
  }