from app import db
from sqlalchemy import Enum
import datetime

class Shop(db.Model):
    __tablename__ = 'shops'
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    opening_hours = db.Column(db.String(255))
    announcement = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    status = db.Column(Enum('OPEN', 'CLOSED'), default='CLOSED', nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'merchant_id': self.merchant_id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'opening_hours': self.opening_hours,
            'announcement': self.announcement,
            'image_url': self.image_url,
            'status': self.status
        }

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('shops.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(100))
    is_available = db.Column(db.Boolean, default=True, nullable=False) # 上架/下架
    stock = db.Column(db.Integer, default=-1) # -1 表示无限库存

    def to_dict(self):
        return {
            'id': self.id,
            'shop_id': self.shop_id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'image_url': self.image_url,
            'category': self.category,
            'is_available': self.is_available,
            'stock': self.stock
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('shops.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    order_time = db.Column(db.DateTime, default=datetime.datetime.now, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(Enum('PENDING', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'),
                       default='PENDING', nullable=False)
    rejection_reason = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'shop_id': self.shop_id,
            'user_id': self.user_id,
            'order_time': self.order_time.isoformat(),
            'total_amount': float(self.total_amount),
            'status': self.status,
            'rejection_reason': self.rejection_reason
        }