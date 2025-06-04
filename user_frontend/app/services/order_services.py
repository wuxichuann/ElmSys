from app.models.order import Order
from app.models.dish import Dish
from app.models.restaurant import Restaurant
from app import db

class OrderService:
    @staticmethod
    def create_order(user_id, restaurant_id, items, address, note=None):
        # 验证商家是否存在
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            raise ValueError('商家不存在')
        
        # 验证菜品
        order_items = []
        total_amount = 0
        for item in items:
            dish = Dish.query.get(item['dish_id'])
            if not dish or dish.restaurant_id != restaurant_id:
                raise ValueError(f'菜品{item["dish_id"]}不存在或不属于该商家')
            
            if dish.stock < item['quantity']:
                raise ValueError(f'菜品{dish.name}库存不足')
            
            order_items.append({
                'dish': dish,
                'quantity': item['quantity'],
                'price': dish.price
            })
            total_amount += dish.price * item['quantity']
        
        # 创建订单
        order = Order(
            user_id=user_id,
            restaurant_id=restaurant_id,
            address=address,
            note=note,
            total_amount=total_amount,
            status='pending'  # 初始状态为待接单
        )
        
        # 保存订单和订单项
        db.session.add(order)
        db.session.flush()  # 获取order.id
        
        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                dish_id=item['dish'].id,
                quantity=item['quantity'],
                price=item['price']
            )
            db.session.add(order_item)
            # 减少库存
            item['dish'].stock -= item['quantity']
        
        db.session.commit()
        return order