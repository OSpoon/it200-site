# Flask服务配置

### 环境：ubuntu-14.04.3(预装python3.4)

#### 1.flask(Web框架)

#### 2.gunicorn(python Wsgi http server)
##### 1.安装
        sudo pip3 install gunicorn

##### 2.修改入口文件
          from werkzeug.contrib.fixers import ProxyFix
          app.wsgi_app = ProxyFix(app.wsgi_app)
          app.run()

##### 3.启动
        gunicorn -w 4 -b 127.0.0.1:8000 入口文件名:应用实例

#### 3.upstart(服务进程管理)

        myapp.conf (开机启动)
            '''
                description "flask app"

                start on runlevel [2345]
                stop on runlevel [!2345]

                respawn
                setuid root
                setgid www-data

                chdir /home/zhangxin/PycharmProjects/flaskApp # 指令被执行的目录

                exec gunicorn -b 0.0.0.0:8000 app:app
            '''
        1.目录： cd /etc/init
        2.启动：sudo start myapp
        3.状态：sudo status myapp
        4.停止：sudo stop myapp
        5.重启：sudo restart myapp

#### 4.nginx(代理服务)
##### 1.安装
        sudo apt-get install nginx

        /etc/nginx/sites-available

        sudo nano default
        '''
            server {
                listen 8899;
                server_name 127.0.0.1;
                location / {
                   proxy_pass  http://127.0.0.1:8000;
                   proxy_set_header Host $host;
                   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                }
            }
        '''
##### 2.重启
        sudo service nginx restart

#### 5.修改pip镜像地址：
        /home/<username>/.pip/pip.conf
        [global]
        index-url = http://mirrors.aliyun.com/pypi/simple/

#### 6.安装 pip3
        sudo apt-get install python3-pip

#### 7.pipreqs
##### 1.安装
        sudo pip3 install pipreqs

##### 2.生成
        pip3 freeze > requirements.txt

##### 3.执行
        sudo pip3 install -r requirements.txt
