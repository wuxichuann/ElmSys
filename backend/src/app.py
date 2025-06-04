from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}}) # 允许前端Origin

    # 导入并注册蓝图 (Blueprints)
    from routes.shop_routes import shop_bp
    from routes.menu_routes import menu_bp
    from routes.order_routes import order_bp

    app.register_blueprint(shop_bp, url_prefix='/api/merchant/<int:merchant_id>/shop')
    app.register_blueprint(menu_bp, url_prefix='/api/merchant/<int:merchant_id>/menu')
    app.register_blueprint(order_bp, url_prefix='/api/merchant/<int:merchant_id>/orders')

    # 简单的根路由
    @app.route('/')
    def index():
        return "Welcome to Chanele Merchant Backend!"

    # 错误处理示例
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback() # 回滚数据库事务
        return jsonify({"message": "Internal server error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all() # 在应用上下文中创建所有定义的表
    app.run(debug=True, port=8081) # 调试模式，端口8081