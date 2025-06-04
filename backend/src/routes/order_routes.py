from flask import Blueprint, request, jsonify
import datetime

# 假设你有一个服务层或者数据库操作层来处理实际的业务逻辑
# 例如: from services.order_service import (
#     create_order, get_order_by_id, get_user_orders, update_order_status
# )
# 为了简化，这里我们直接模拟一些数据和操作

order_bp = Blueprint('order_bp', __name__, url_prefix='/orders')

# 模拟数据存储（实际应用中会从数据库获取）
orders_data = [
    {"id": 1, "user_id": 1, "shop_id": 101, "dishes": [{"dish_id": 1, "quantity": 1}],
     "total_price": 48.0, "status": "pending", "created_at": "2025-06-03T10:00:00Z"},
    {"id": 2, "user_id": 2, "shop_id": 102, "dishes": [{"dish_id": 3, "quantity": 2}],
     "total_price": 70.0, "status": "accepted", "created_at": "2025-06-03T11:30:00Z"},
]
next_order_id = 3

@order_bp.route('/', methods=['POST'])
def create_new_order():
    """
    创建新订单
    """
    global next_order_id
    data = request.json
    if not data or not all(k in data for k in ('user_id', 'shop_id', 'dishes', 'total_price')):
        return jsonify({"message": "Missing required fields"}), 400

    new_order = {
        "id": next_order_id,
        "user_id": data['user_id'],
        "shop_id": data['shop_id'],
        "dishes": data['dishes'], # [{"dish_id": 1, "quantity": 1}, ...]
        "total_price": data['total_price'],
        "status": "pending", # 初始状态为待处理
        "created_at": datetime.datetime.now().isoformat() + "Z"
    }
    orders_data.append(new_order)
    next_order_id += 1
    # 实际应用中，这里会调用服务层的方法，将数据保存到数据库
    # result = create_order(new_order)
    return jsonify({"message": "Order created successfully", "order": new_order}), 201

@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    """
    根据订单ID获取订单详情
    """
    order = next((o for o in orders_data if o["id"] == order_id), None)
    if order:
        # 实际应用中，这里会调用服务层的方法
        # order = get_order_by_id(order_id)
        return jsonify(order), 200
    return jsonify({"message": "Order not found"}), 404

@order_bp.route('/user/<int:user_id>', methods=['GET'])
def get_orders_by_user(user_id):
    """
    获取某个用户的所有订单
    """
    user_orders = [o for o in orders_data if o["user_id"] == user_id]
    # 实际应用中，这里会调用服务层的方法
    # user_orders = get_user_orders(user_id)
    return jsonify(user_orders), 200

@order_bp.route('/shop/<int:shop_id>', methods=['GET'])
def get_orders_by_shop(shop_id):
    """
    获取某个商家的所有订单
    """
    shop_orders = [o for o in orders_data if o["shop_id"] == shop_id]
    # 实际应用中，这里会调用服务层的方法
    # shop_orders = get_shop_orders(shop_id) # 假设有这个方法
    return jsonify(shop_orders), 200


@order_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """
    更新订单状态
    """
    data = request.json
    new_status = data.get('status')
    if not new_status:
        return jsonify({"message": "Status is required"}), 400

    order = next((o for o in orders_data if o["id"] == order_id), None)
    if not order:
        return jsonify({"message": "Order not found"}), 404

    # 实际应用中，这里可能需要根据业务逻辑进行状态流转校验
    valid_statuses = ["pending", "accepted", "in_delivery", "delivered", "cancelled"]
    if new_status not in valid_statuses:
        return jsonify({"message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

    order['status'] = new_status
    # 实际应用中，这里会调用服务层的方法，更新数据库
    # result = update_order_status(order_id, new_status)
    return jsonify({"message": "Order status updated successfully", "order": order}), 200