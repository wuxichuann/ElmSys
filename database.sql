-- 设置字符集，确保中文支持
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0; -- 临时禁用外键检查，方便批量插入，最后开启

-- ----------------------------
-- 1. 表结构 `users` (用户信息表)
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID', -- 唯一标识符/可用于登录
  `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '用户密码',
  `email` VARCHAR(100) UNIQUE COMMENT '电子邮箱',
  `phone_number` VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号码', --可用于登录/联系
  `user_type` ENUM('customer', 'courier', 'restaurant_admin') NOT NULL COMMENT '用户类型',
  `full_name` VARCHAR(100) COMMENT '真实姓名',
  `avatar_url` VARCHAR(255) COMMENT '用户头像',
  `default_address` TEXT COMMENT '顾客默认收货地址',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- ----------------------------
-- 2. 表结构 `restaurants` (餐厅信息表)
-- ----------------------------
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `restaurant_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '餐厅ID', --唯一标识符
  `owner_user_id` INT COMMENT '餐厅所有者/管理员用户ID',
  `restaurant_name` VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  `description` TEXT COMMENT '餐厅描述',
  `address` TEXT NOT NULL COMMENT '餐厅地址',
  --`latitude` DECIMAL(10,8) COMMENT '纬度',
  --`longitude` DECIMAL(11,8) COMMENT '经度',
  `phone_number` VARCHAR(20) NOT NULL COMMENT '餐厅联系电话',
  `logo_url` VARCHAR(255) COMMENT '餐厅Logo图片',
  `opening_hours` VARCHAR(100) COMMENT '营业时间', -- 格式 "09:00-21:00"
  `is_active` BOOLEAN DEFAULT TRUE COMMENT '是否营业中',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅信息表';

-- ----------------------------
-- 3. 表结构 `menu_items` (菜品信息表)
-- ----------------------------
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '菜品ID', --唯一标识符
  `restaurant_id` INT NOT NULL COMMENT '所属餐厅ID',
  `item_name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `description` TEXT COMMENT '菜品描述',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `category` VARCHAR(50) COMMENT '菜品分类 ', --(如主食,饮品)
  `image_url` VARCHAR(255) COMMENT '菜品图片',
  `is_available` BOOLEAN DEFAULT TRUE COMMENT '是否可售',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品信息表';

-- ----------------------------
-- 4. 表结构 `orders` (订单信息表)
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID', --唯一标识符
  `customer_id` INT NOT NULL COMMENT '顾客用户ID',
  `restaurant_id` INT NOT NULL COMMENT '餐厅ID',
  `courier_id` INT COMMENT '配送骑手ID',
  `delivery_address` TEXT NOT NULL COMMENT '配送地址',
  --`delivery_latitude` DECIMAL(10,8) COMMENT '配送地址纬度',
  --`delivery_longitude` DECIMAL(11,8) COMMENT '配送地址经度',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` ENUM('pending_payment', 'placed', 'restaurant_confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled', 'refunded') NOT NULL COMMENT '订单状态',
  `payment_method` VARCHAR(50) COMMENT '支付方式',
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  `notes` TEXT COMMENT '用户备注',
  `estimated_delivery_at` TIMESTAMP NULL DEFAULT NULL COMMENT '预计送达时间',
  `delivered_at` TIMESTAMP NULL DEFAULT NULL COMMENT '实际送达时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间 (下单时间)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`courier_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单信息表';

-- ----------------------------
-- 5. 表结构 `order_items` (订单详情表)
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `order_item_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单项ID',
  `order_id` INT NOT NULL COMMENT '所属订单ID',
  `item_id` INT NOT NULL COMMENT '菜品ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `price_at_purchase` DECIMAL(10,2) NOT NULL COMMENT '购买时单价',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计 (quantity * price_at_purchase)',
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`item_id`) REFERENCES `menu_items`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE -- 如果菜品被删除，订单项应保留历史记录，不应级联删除，但实际业务可能更复杂
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单详情表';

SET FOREIGN_KEY_CHECKS = 1; -- 开启外键检查

-- ----------------------------
-- 示例数据插入
-- ----------------------------

-- 1. 插入用户数据
INSERT INTO `users` (`username`, `password_hash`, `email`, `phone_number`, `user_type`, `full_name`, `avatar_url`, `default_address`) VALUES
('zhangsan', 'hashed_password_123', 'zhangsan@example.com', '13800138000', 'customer', '张三', 'http://example.com/avatars/zhangsan.jpg', '北京市朝阳区幸福小区1号楼'),
('lisi_courier', 'hashed_password_456', 'lisi@example.com', '13900139000', 'courier', '李四', 'http://example.com/avatars/lisi.jpg', NULL),
('wangwu_admin', 'hashed_password_789', 'wangwu@example.com', '13700137000', 'restaurant_admin', '王五', 'http://example.com/avatars/wangwu.jpg', NULL),
('zhaoliu', 'hashed_password_abc', 'zhaoliu@example.com', '13600136000', 'customer', '赵六', 'http://example.com/avatars/zhaoliu.jpg', '上海市浦东新区科技路88号');

-- 2. 插入餐厅数据 (假设王五是餐厅老板 user_id=3)
INSERT INTO `restaurants` (`owner_user_id`, `restaurant_name`, `description`, `address`, `phone_number`, `logo_url`, `opening_hours`, `is_active`) VALUES
(3, '王五的美味快餐', '提供各种中式快餐，经济实惠。', '北京市海淀区中关村大街1号', '010-88888888', 'http://example.com/logos/wangwu_restaurant.jpg', '10:00-22:00', TRUE),
(3, '王五的健康轻食', '专注健康沙拉和轻食。', '北京市朝阳区CBD国贸三期', '010-66666666', 'http://example.com/logos/wangwu_lightfood.jpg', '09:00-20:00', TRUE);

-- 3. 插入菜品数据 (假设 restaurant_id=1 是 "王五的美味快餐", restaurant_id=2 是 "王五的健康轻食")
INSERT INTO `menu_items` (`restaurant_id`, `item_name`, `description`, `price`, `category`, `image_url`, `is_available`) VALUES
(1, '宫保鸡丁饭', '经典川菜，鲜香麻辣。', 25.00, '主食套餐', 'http://example.com/items/gongbaojiding.jpg', TRUE),
(1, '可口可乐', '冰爽碳酸饮料。', 5.00, '饮品', 'http://example.com/items/cocacola.jpg', TRUE),
(2, '鸡胸肉沙拉', '低脂高蛋白，健身首选。', 38.00, '沙拉', 'http://example.com/items/chickensalad.jpg', TRUE),
(2, '鲜榨橙汁', '新鲜橙子榨取，富含VC。', 15.00, '饮品', 'http://example.com/items/orangejuice.jpg', TRUE);

-- 4. 插入订单数据 (假设张三 customer_id=1 下单, 李四 courier_id=2 配送)
INSERT INTO `orders` (`customer_id`, `restaurant_id`, `courier_id`, `delivery_address`, `total_amount`, `status`, `payment_method`, `payment_status`, `notes`, `estimated_delivery_at`) VALUES
(1, 1, 2, '北京市朝阳区幸福小区1号楼', 30.00, 'delivered', 'alipay', 'paid', '少放辣，多点米饭', NOW() - INTERVAL 1 HOUR),
(4, 2, NULL, '上海市浦东新区科技路88号', 53.00, 'placed', 'wechatpay', 'paid', '请尽快送达', NOW() + INTERVAL 30 MINUTE);

-- 5. 插入订单详情数据
-- 订单1 (order_id=1) 包含: 宫保鸡丁饭(item_id=1) x1, 可口可乐(item_id=2) x1
INSERT INTO `order_items` (`order_id`, `item_id`, `quantity`, `price_at_purchase`, `subtotal`) VALUES
(1, 1, 1, 25.00, 25.00),
(1, 2, 1, 5.00, 5.00);

-- 订单2 (order_id=2) 包含: 鸡胸肉沙拉(item_id=3) x1, 鲜榨橙汁(item_id=4) x1
INSERT INTO `order_items` (`order_id`, `item_id`, `quantity`, `price_at_purchase`, `subtotal`) VALUES
(2, 3, 1, 38.00, 38.00),
(2, 4, 1, 15.00, 15.00);