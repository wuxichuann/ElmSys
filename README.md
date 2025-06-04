提交注意：
修改前先pull在push
如有冲突优先在本地解决
作出任何修改都要push

//aaaaaa
0.1
提交了初步代码，不能直接运行，只作为参考。
mysql.txt内容是本地数据库创建的内容。应当在本地创建数据库并且对server.js进行修改。后面如果实现服务器功能可以不用这么麻烦。
总之运行步骤大概是：
系统运行步骤
设置数据库：

安装MySQL并创建数据库和表

修改server.js中的数据库连接配置

启动后端服务：

bash
node server.js
访问前端页面：

直接在浏览器中打开index.html文件

或者使用VS Code的Live Server插件运行

全员提交通过

///////
user_frontend/
│
├── app/                      # 主应用目录
│   ├── __init__.py           # 应用初始化
│   ├── main.py               # 主应用入口
│   ├── models/               # 数据模型
│   │   ├── user.py           # 用户模型
│   │   ├── restaurant.py     # 商家模型
│   │   ├── order.py          # 订单模型
│   │   └── dish.py           # 菜品模型
│   ├── routes/               # 路由/控制器
│   │   ├── auth.py           # 认证相关路由
│   │   ├── restaurants.py    # 商家相关路由
│   │   ├── orders.py         # 订单相关路由
│   │   └── __init__.py
│   ├── services/             # 业务逻辑层
│   │   ├── auth_service.py   # 认证服务
│   │   ├── order_service.py  # 订单服务
│   │   └── __init__.py
│   ├── static/               # 静态文件(如果包含简单前端)
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── templates/            # 模板文件(如果使用服务端渲染)
│   │   ├── base.html
│   │   ├── login.html
│   │   └── ...
│   └── utils/                # 工具函数
│       ├── jwt_utils.py       # JWT工具
│       ├── response.py        # 响应格式化
│       └── __init__.py
│
├── config.py                 # 配置文件
├── requirements.txt          # 依赖列表
└── README.md                 # 项目说明