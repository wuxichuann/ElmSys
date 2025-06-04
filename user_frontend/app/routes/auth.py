from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.utils.response import success, error
from app.utils.jwt_utils import generate_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    用户登录接口
    POST /api/auth/login
    请求参数: { "username": "用户手机号/邮箱", "password": "密码" }
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # 验证用户
    user = AuthService.authenticate(username, password)
    if not user:
        return error('用户名或密码错误', 401)
    
    # 生成JWT token
    token = generate_token(user.id)
    return success({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'phone': user.phone
        }
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    用户注册接口
    POST /api/auth/register
    请求参数: { "username": "用户名", "phone": "手机号", "password": "密码" }
    """
    data = request.get_json()
    try:
        user = AuthService.create_user(
            username=data.get('username'),
            phone=data.get('phone'),
            password=data.get('password')
        )
        return success({'id': user.id}, '注册成功', 201)
    except ValueError as e:
        return error(str(e), 400)