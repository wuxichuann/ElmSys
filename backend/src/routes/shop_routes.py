from flask import Blueprint, request, jsonify
from services.shop_service import ShopService

shop_bp = Blueprint('shop', __name__)

# 获取店铺信息
@shop_bp.route('/', methods=['GET'])
def get_shop_info(merchant_id):
    shop = ShopService.get_shop_info_by_merchant_id(merchant_id)
    if shop:
        return jsonify(shop.to_dict()), 200
    return jsonify({"message": "Shop not found"}), 404

# 更新店铺信息
@shop_bp.route('/', methods=['PUT'])
def update_shop_info(merchant_id):
    data = request.json
    shop = ShopService.update_shop_info(merchant_id, data)
    if shop:
        return jsonify(shop.to_dict()), 200
    return jsonify({"message": "Shop not found or update failed"}), 404

# 更新店铺营业状态
@shop_bp.route('/status', methods=['PUT'])
def update_shop_status(merchant_id):
    data = request.json
    status = data.get('status')
    if not status:
        return jsonify({"message": "Status is required"}), 400
    try:
        shop = ShopService.update_shop_status(merchant_id, status)
        if shop:
            return jsonify(shop.to_dict()), 200
        return jsonify({"message": "Shop not found or update failed"}), 404
    except ValueError as e:
        return jsonify({"message": str(e)}), 400