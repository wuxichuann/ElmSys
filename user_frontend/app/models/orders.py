from flask import Blueprint, request, jsonify
from app.utils.jwt_utils import jwt_required
from app.services.order_service import OrderService
from app.utils.response import success

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@order_bp.route('/', methods=['POST'])
@jwt_required
def create_order():
    """
    创建订单
    POST /api/orders
    请求参数: {
        "restaurant_id": 商家ID,
        "items": [{"dish_id": 菜品ID, "quantity": 数量}],
        "address": "配送地址",
        "note": "备注"
    }
    """
    data = request.get_json()
    user_id = request.user_id  # 从JWT中获取
    
    try:
        order = OrderService.create_order(
            user_id=user_id,
            restaurant_id=data['restaurant_id'],
            items=data['items'],
            address=data.get('address'),
            note=data.get('note')
        )
        return success(order.to_dict(), '订单创建成功', 201)
    except ValueError as e:
        return error(str(e), 400)

@order_bp.route('/', methods=['GET'])
@jwt_required
def get_orders():
    """
    获取用户订单列表
    GET /api/orders
    """
    user_id = request.user_id
    orders = OrderService.get_user_orders(user_id)
    return success({
        'orders': [o.to_dict() for o in orders]
    })

@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required
def get_order(order_id):
    """
    获取订单详情
    GET /api/orders/:order_id
    """
    user_id = request.user_id
    order = OrderService.get_order_details(order_id, user_id)
    return success(order.to_dict())