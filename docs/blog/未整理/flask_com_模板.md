# flask_com_模板

#### 目录结构
```
    |-apidoc|               (API文档)
    |-app|                  (程序包)
        |-templates|
        |-static|
        |-libs|             (自定义模块包)
            |-email.py
            |-token_auth.py
        |-web|               (WEB业务包)
            |-main|
                |-__init__.py
                |-errors.py
                |-forms.py
                |-views.py
            |-auth|
                |-__init__.py
                |-errors.py
                |-forms.py
                |-views.py
        |-api               (API包)
            |-v1
            |-v2
        |-models|            (模型包)
            |-user.py
            |-role.py
        |-__init__.py       (app初始化)
    |-migrations|           (数据库迁移脚本)
    |-tests/|               (单元测试)
        |-__init__.py
        |-test*.py
    |-venv|                 (Python 虚拟环境)
    |-requirements.txt      (依赖包)
    |-config.py             (存储配置)
    |-manage.py             (启动程序/程序任务)
```
##### 蓝图创建
```
    1.app/main/__init__.py：创建蓝本

        from flask import Blueprint
        main = Blueprint('main', __name__)
        from . import views, errors

    2.app/_init_.py：注册蓝本

        def create_app(config_name):
            # ...
            from .main import main as main_blueprint
            app.register_blueprint(main_blueprint)
            return app

    3.app/main/errors.py：蓝本中的错误处理程序

        from flask import render_template
        from . import main

        @main.app_errorhandler(404)
        def page_not_found(e):
            return render_template('404.html'), 404

        @main.app_errorhandler(500)
        def internal_server_error(e):
            return render_template('500.html'), 500

    4.app/main/views.py：蓝本中定义的程序路由

        from flask import render_template
        from . import main

        @main.route('/', methods=['GET', 'POST'])
        def index():
            return render_template('index.html')
```
##### 添加SQLAlchemy
```
    from flask_sqlalchemy import SQLAlchemy

    db = SQLAlchemy()
    
    db.init_app(app)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
```
##### 集成Python shell
```
    from flask_script import Shell, Manager
    from app import create_app, db
    from app.models import User, Role
    
    @manager.command
    def hello():
        print "hello"
    
    def make_shell_context():
        return dict(app=app, db=db, User=User, Role=Role)
    manager.add_command("shell", Shell(make_context=make_shell_context))
    
    python manage.py shell
```

##### 添加数据

```
    shell =>> db.create_all()

    from app.models import User, Role
    from app import db

    admin_role = Role(name='Admin')
    mod_role = Role(name='Moderator')
    user_role = Role(name='User')
    user_john = User(username='john', role=admin_role)
    user_susan = User(username='susan', role=mod_role)
    user_david = User(username='david', role=user_role)
    db.session.add_all([admin_role, mod_role,
                        user_role,user_john,
                        user_susan, user_david])
    db.session.commit()
 ```

##### Flask-Migrate实现数据库迁移

```
    from flask_migrate import Migrate, MigrateCommand

    migrate = Migrate(app, db)
    manager.add_command('db', MigrateCommand)
    
    init 子命令创建迁移仓库
        python manage.py db init
    
    migrate 子命令用来自动创建迁移脚本
        python manage.py db migrate -m "initial migration"
    
    更新数据库
        python manage.py db upgrade [--sql] [--tag TAG] [--x-arg ARG] <revision>
        
    回退数据库
        python manage.py db downgrade [--sql] [--tag TAG] [--x-arg ARG] <revision>
```

##### flask-mail邮件发送

```
    发送方法:

    from threading import Thread
    from flask import current_app, render_template
    from flask_mail import Message
    from . import mail


    def send_async_email(app, msg):
        with app.app_context():
            mail.send(msg)


    def send_email(to, subject, template, **kwargs):
        app = current_app._get_current_object()
        msg = Message(app.config['FLASKY_MAIL_SUBJECT_PREFIX'] + ' ' + subject,
                      sender=app.config['FLASKY_MAIL_SENDER'], recipients=[to])
        msg.body = render_template(template + '.txt', **kwargs)
        msg.html = render_template(template + '.html', **kwargs)
        thr = Thread(target=send_async_email, args=[app, msg])
        thr.start()
        return thr

    初始化配置
    from flask_mail import Mail
    mail = Mail()
    mail.init_app(app)

    添加邮件模板
    templates->email->xxx.html

    执行发送:
    from ..models import User
    from ..email import send_email
    send_email('1825203636@qq.com', '确认业务开通邮件','email/confirm')
```

##### flask-apidoc生成接口文档

```
  依赖环境
    
    npm install apidoc -g
    
    pip install flask-apidoc
    
  manage.py项目启动脚本配置
  
    from views import app
    from flask_apidoc.commands import GenerateApiDoc
    from flask_script import Manager
    
    manager = Manager(app)
    manager.add_command('apidoc', GenerateApiDoc())
    
    if __name__ == "__main__":
        manager.run()
  
  apidoc.json配置
    
    {
      "name": "Flask REST API",
      "version": "1.0.0",
      "description": "A Flask REST API example",
      "title": "A Flask REST API example",
      "url" : "http://localhost:5000"
    }
   
  视图函数文档注释说明示例
  
    """
     @api {post} /api/v1/token 获取Token
     @apiVersion 1.0.0
     @apiName get_token
     @apiGroup Token

     @apiParam {String} account  (必须) 用户邮箱
     @apiParam {String} secret (必须) 用户密码
     @apiParam {String} type (必须) 客户端类型
     @apiParam {String} nickname (必须) 用户昵称

     @apiParamExample {json} 请求-示例:
      {
          "account":"111@qq.com",
          "secret":"123456",
          "type":100,
          "nickname":"USER1"
      }

     @apiSuccess (回参) {String} token 返回令牌

     @apiSuccessExample {json} 成功-响应:
      {
	    "token": ""
      }

     @apiErrorExample {json} 失败-响应:
      {
        "error_code": 1000,
        "msg": {
            "type": [
                "99 is not a valid ClientTypeEnum"
            ]
        },
        "request": "POST /api/v1/token"
      }
     """
```

  生成RESTful风格接口文档

```
    python manage.py apidoc
```
