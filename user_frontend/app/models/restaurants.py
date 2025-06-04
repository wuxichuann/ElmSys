from flask import Blueprint, request, jsonify
from app.services.restaurant_service import RestaurantService
from app.utils.response import success

restaurant_bp = Blueprint('restaurants', __name__, url_prefix='/api/restaurants')

@restaurant_bp.route('/', methods=['GET'])
def get_restaurants():
    """
    获取商家列表
    GET /api/restaurants
    可选查询参数: category(分类), rating(最低评分), distance(最大距离)
    """
    category = request.args.get('category')
    min_rating = request.args.get('rating', type=float)
    max_distance = request.args.get('distance', type=float)
    keyword = request.args.get('keyword')
    
    restaurants = RestaurantService.get_restaurants(
        category=category,
        min_rating=min_rating,
        max_distance=max_distance,
        keyword=keyword
    )
    
    return success({
        'restaurants': [r.to_dict() for r in restaurants]
    })

@restaurant_bp.route('/<int:restaurant_id>/menu', methods=['GET'])
def get_menu(restaurant_id):
    """
    获取商家菜单
    GET /api/restaurants/:restaurant_id/menu
    """
    menu = RestaurantService.get_restaurant_menu(restaurant_id)
    return success({
        'restaurant': menu['restaurant'].to_dict(),
        'categories': menu['categories']
    })