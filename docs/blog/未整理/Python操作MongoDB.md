# Python操作MongoDB

#### pymongodb操作
#	![](https://i.imgur.com/FySOMGj.png)
#	![](https://i.imgur.com/J7nNjQo.png)

        mongod --auth --dbpath="/usr/local/mongodb/data" --logpath="/usr/local/mongodb/logs/mongod.log" --install
        #创建admin数据表
        use admin
        #创建管理用户的用户
        db.createUser(
          {
            user: "root",
            pwd: "123456",
            roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
          }
        )
        #认证
        db.auth('user','pass')
        #切换数据表
        use testdb
        #创建当前数据表的操作用户
        db.createUser(
          {
            user: "test",
            pwd: "123456",
            roles: [ { role: "readWrite", db: "testdb" } ]
          }
        )


###


    class MONGODB_CONFIG:
      HOST = "127.0.0.1"
      PORT = 27017
      DB_NAME = "testdb"
      USER_NAME = "test"
      PASSWORD = "123456"

    import config
    import pymongo
    # 创建连接对象 ''' mongodb://localhost:27017/ '''
    client = pymongo.MongoClient(host=config.MONGODB_CONFIG.HOST, port=config.MONGODB_CONFIG.PORT)
    # 连接数据库
    db = client[config.MONGODB_CONFIG.DB_NAME]
    db.authenticate(config.MONGODB_CONFIG.USER_NAME, config.MONGODB_CONFIG.PASSWORD,mechanism='SCRAM-SHA-1')
    # 连接表
    collection = db.news

###

    def init():
        #创建连接对象 ''' mongodb://localhost:27017/ '''
        client = pymongo.MongoClient(host='127.0.0.1',port=27017)
        #指定数据集(数据库名称) ''' client['test'] '''
        db = client.testDB
        #指定集合 ''' db['students'] '''
        return db.students

    #插入单条数据
    def insert(collection,student):
        result = collection.insert(student)
        print(result)

    #插入多条数据
    def insert(collection,students):
        result = collection.insert(students)
        print(result)

    #使用3.x推荐方法插入单条数据
    def insert_one(collection,student):
        result = collection.insert_one(student)
        print(result)
        print(result.inserted_id)

    #使用3.x推荐方法插入多条数据
    def insert_many(collection,students):
        result = collection.insert_many(students)
        print(result)
        print(result.inserted_ids)

    #查询单条数据
    def find_one(collection,args):
        result = collection.find_one(args)
        print(type(result))
        print(result)

    #查询多条数据
    def finds(collection,args):
        results = collection.find(args)
        print(type(results))
        print(results)
        for result in results:
            print(result)

    #查询记录数
    def count(collection,args):
        count = collection.find(args).count()
        print(count)

    #排序 ''' ASCENDING 升序  DESCENDING 降序 '''
    def sort(collection,args,cending):
        results = collection.find().sort(args, cending)
        print([result[args] for result in results])

    #偏移n位后查询
    def skip(collection,index):
        results = collection.find().skip(index)
        print([result['name'] for result in results])

    #获取n条记录
    def limit(collection,index):
        results = collection.find().limit(index)
        print([result['name'] for result in results])

    #更新数据库
    def update(condition,student):
        result = collection.update(condition, student)
        print(result)

    #删除数据 delete_one() delete_many()
    def remove(collection,args):
        result = collection.remove(args)
        print(result)
