# MongoDB使用

##### 下载地址

```
https://www.mongodb.com/download-center/community
```

##### Mac启动命令

```
sudo mongod -config /Users/zhangxin/Documents/mongodb/mongodb/etc/mongod.conf
```

##### 连接Mongo

```
进入shell命令：mongo
```

##### 第一次创建管理员

```
use admin
db.createUser(
  {
    user: "admin",
    pwd: "admin",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
#结果
Successfully added user: {
    "user" : "admin",
    "roles" : [
        {
            "role" : "userAdminAnyDatabase",
            "db" : "admin"
        }
    ]
}
```

##### 验证管理员

```
db.auth('admin','admin')
show users
db.system.users.find()
```

##### 添加普通用户

```
use testdb
db.createUser(
	{
        user:"test",
        pwd: "123456",
        roles: [{ role: "readWrite", db: "testdb"}]
    }
)

Successfully added user: {
        "user" : "test",
        "roles" : [
                {
                        "role" : "readWrite",
                        "db" : "testdb"
                }
        ]
}
```

##### 超级管理员创建

```
use admin
db.createUser(
  {
    user: "root",
    pwd: "root",
    roles: [ { role: "root", db: "admin" } ]
  }
)
```

##### 正确退出mongo服务

```
use admin;
db.shutdownServer();
```

