from app import db
from models import Shop

class ShopService:
    @staticmethod
    def get_shop_info_by_merchant_id(merchant_id):
        shop = Shop.query.filter_by(merchant_id=merchant_id).first()
        return shop

    @staticmethod
    def update_shop_info(merchant_id, data):
        shop = Shop.query.filter_by(merchant_id=merchant_id).first()
        if not shop:
            return None # 或者抛出自定义异常

        shop.name = data.get('name', shop.name)
        shop.address = data.get('address', shop.address)
        shop.phone = data.get('phone', shop.phone)
        shop.opening_hours = data.get('opening_hours', shop.opening_hours)
        shop.announcement = data.get('announcement', shop.announcement)
        shop.image_url = data.get('image_url', shop.image_url)
        db.session.commit()
        return shop

    @staticmethod
    def update_shop_status(merchant_id, status):
        shop = Shop.query.filter_by(merchant_id=merchant_id).first()
        if not shop:
            return None

        if status not in ['OPEN', 'CLOSED']:
            raise ValueError("Invalid shop status. Must be 'OPEN' or 'CLOSED'.")

        shop.status = status
        db.session.commit()
        return shop