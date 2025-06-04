from flask import Blueprint, request, jsonify
# 假设你有一个服务层或者数据库操作层来处理实际的业务逻辑
# 例如: from services.menu_service import (
#     add_dish, get_all_dishes, get_dish_by_id, update_dish, delete_dish
# )
# 为了简化，这里我们直接模拟一些数据和操作

menu_bp = Blueprint('menu_bp', __name__, url_prefix='/menus')

# 模拟数据存储（实际应用中会从数据库获取）
menu_data = [
    {"id": 1, "shop_id": 101, "name": "红烧肉", "price": 48.0, "description": "肥而不腻", "status": "active"},
    {"id": 2, "shop_id": 101, "name": "清炒时蔬", "price": 28.0, "description": "健康美味", "status": "active"},
    {"id": 3, "shop_id": 102, "name": "麻婆豆腐", "price": 35.0, "description": "麻辣鲜香", "status": "active"},
]
next_dish_id = 4

@menu_bp.route('/', methods=['POST'])
def add_new_dish():
    """
    添加新菜品
    """
    global next_dish_id
    data = request.json
    if not data or not all(k in data for k in ('shop_id', 'name', 'price')):
        return jsonify({"message": "Missing required fields"}), 400

    new_dish = {
        "id": next_dish_id,
        "shop_id": data['shop_id'],
        "name": data['name'],
        "price": data['price'],
        "description": data.get('description', ''),
        "status": data.get('status', 'active')
    }
    menu_data.append(new_dish)
    next_dish_id += 1
    # 实际应用中，这里会调用服务层的方法，将数据保存到数据库
    # result = add_dish(new_dish)
    return jsonify({"message": "Dish added successfully", "dish": new_dish}), 201

@menu_bp.route('/', methods=['GET'])
def get_all_menus():
    """
    获取所有菜品列表（或者根据 shop_id 筛选）
    """
    shop_id = request.args.get('shop_id', type=int)
    if shop_id:
        filtered_menus = [dish for dish in menu_data if dish['shop_id'] == shop_id]
        return jsonify(filtered_menus), 200
    # 实际应用中，这里会调用服务层的方法，从数据库获取数据
    # menus = get_all_dishes()
    return jsonify(menu_data), 200

@menu_bp.route('/<int:dish_id>', methods=['GET'])
def get_menu_by_id(dish_id):
    """
    根据菜品ID获取菜品详情
    """
    dish = next((d for d in menu_data if d["id"] == dish_id), None)
    if dish:
        # 实际应用中，这里会调用服务层的方法
        # dish = get_dish_by_id(dish_id)
        return jsonify(dish), 200
    return jsonify({"message": "Dish not found"}), 404

@menu_bp.route('/<int:dish_id>', methods=['PUT'])
def update_dish_info(dish_id):
    """
    更新菜品信息
    """
    data = request.json
    dish = next((d for d in menu_data if d["id"] == dish_id), None)
    if not dish:
        return jsonify({"message": "Dish not found"}), 404

    # 更新字段
    dish.update({
        "name": data.get('name', dish['name']),
        "price": data.get('price', dish['price']),
        "description": data.get('description', dish['description']),
        "status": data.get('status', dish['status'])
    })
    # 实际应用中，这里会调用服务层的方法，更新数据库
    # result = update_dish(dish_id, data)
    return jsonify({"message": "Dish updated successfully", "dish": dish}), 200

@menu_bp.route('/<int:dish_id>', methods=['DELETE'])
def delete_dish_by_id(dish_id):
    """
    删除菜品
    """
    global menu_data
    original_len = len(menu_data)
    menu_data = [d for d in menu_data if d["id"] != dish_id]
    if len(menu_data) < original_len:
        # 实际应用中，这里会调用服务层的方法，从数据库删除
        # result = delete_dish(dish_id)
        return jsonify({"message": "Dish deleted successfully"}), 200
    return jsonify({"message": "Dish not found"}), 404