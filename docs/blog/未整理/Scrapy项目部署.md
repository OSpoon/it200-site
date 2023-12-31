# Scrapy项目部署

## Scrapyd-DOC

[TOC]

### 安装

```
pip  install  scrapyd
```

### API

#### daemonstatus.json

##### 检查服务的负载状态

示例请求：

```
curl http://localhost:6800/daemonstatus.json
```

响应示例：

```
{ "status": "ok", "running": "0", "pending": "0", "finished": "0", "node_name": "node-name" }
```

#### addversion.json

##### 将项目添加到项目中，如果项目不存在则创建项目

参数：

- `project` （字符串，必填） - 项目名称
- `version` （字符串，必填） - 项目版本
- `egg` （file，required） - 包含项目代码的Python egg

示例请求：

```
curl http://localhost:6800/addversion.json -F project=myproject -F version=r23 -F egg=@myproject.egg
```

响应示例：

```
{"status": "ok", "spiders": 3}
```

#### schedule.json

##### 运行爬虫返回作业ID

参数：

- `project` （字符串，必填） - 项目名称
- `spider` （字符串，必填） - 蜘蛛名称
- `setting` （字符串，可选） - 运行蜘蛛时使用的Scrapy设置
- `jobid` （字符串，可选） - 用于标识作业的作业ID，覆盖默认生成的UUID
- `_version` （string，optional） - 要使用的项目版本
- 任何其他参数都作为spider参数传递

示例请求：

```
curl http://localhost:6800/schedule.json -d project=myproject -d spider=somespider
```

响应示例：

```
{"status": "ok", "jobid": "6487ec79947edab326d6db28a2d86511e8247444"}
```

#### cancel.json

##### 停止爬虫。如果作业处于待处理状态，则会将其删除。如果作业正在运行，它将被终止。

参数：

- `project` （字符串，必填） - 项目名称
- `job` （字符串，必填） - 作业ID

示例请求：

```
curl http://localhost:6800/cancel.json -d project=myproject -d job=6487ec79947edab326d6db28a2d86511e8247444
```

响应示例：

```
{"status": "ok", "prevstate": "running"}
```

#### listprojects.json

##### 获取上传到此Scrapy服务器的项目列表

示例请求：

```
curl http://localhost:6800/listprojects.json
```

响应示例：

```
{"status": "ok", "projects": ["myproject", "otherproject"]}
```

#### listversions.json

##### 获取某些项目可用的版本列表。版本按顺序返回，最后一个版本是当前使用的版本

参数：

- `project` （字符串，必填） - 项目名称

示例请求：

```
curl http://localhost:6800/listversions.json?project=myproject
```

响应示例：

```
{"status": "ok", "versions": ["r99", "r156"]}
```

#### listspiders.json

##### 获取某个项目的最后一个（除非被覆盖）版本中可用的蜘蛛列表

参数：

- `project` （字符串，必填） - 项目名称
- `_version` （string，optional） - 要检查的项目的版本

示例请求：

```
curl http://localhost:6800/listspiders.json?project=myproject
```

响应示例：

```
{"status": "ok", "spiders": ["spider1", "spider2", "spider3"]}
```

#### listjobs.json

##### 获取某个项目的待处理，正在运行和已完成的作业列表

参数：

- `project` （字符串，选项） - 将结果限制为项目名称

示例请求：

```
curl http://localhost:6800/listjobs.json?project=myproject | python -m json.tool
```

响应示例：

```
{
    "status": "ok",
    "pending": [
        {
            "project": "myproject", "spider": "spider1",
            "id": "78391cc0fcaf11e1b0090800272a6d06"
        }
    ],
    "running": [
        {
            "id": "422e608f9f28cef127b3d5ef93fe9399",
            "project": "myproject", "spider": "spider2",
            "start_time": "2012-09-12 10:14:03.594664"
        }
    ],
    "finished": [
        {
            "id": "2f16646cfcaf11e1b0090800272a6d06",
            "project": "myproject", "spider": "spider3",
            "start_time": "2012-09-12 10:14:03.594664",
            "end_time": "2012-09-12 10:24:03.594664"
        }
    ]
}
```

#### delversion.json

##### 删除项目版本。如果给定项目没有更多可用版本，则该项目也将被删除

参数：

- `project` （字符串，必填） - 项目名称
- `version` （字符串，必填） - 项目版本

示例请求：

```
curl http://localhost:6800/delversion.json -d project=myproject -d version=r99
```

响应示例：

```
{"status": "ok"}
```

#### delproject.json

##### 删除项目及其所有上载的版本

参数：

- `project` （字符串，必填） - 项目名称

示例请求：

```
curl http://localhost:6800/delproject.json -d project=myproject
```

响应示例：

```
{"status": "ok"}
```

### 配置文件

##### Scrapyd在以下位置搜索配置文件，并按顺序解析它们，最新的配置文件具有更高的优先级：

- `/etc/scrapyd/scrapyd.conf` （UNIX）
- `c:\scrapyd\scrapyd.conf` （视窗）
- `/etc/scrapyd/conf.d/*` （按字母顺序排列，Unix）
- `scrapyd.conf`
- `~/.scrapyd.conf` （用户主目录）

##### 配置文件支持以下选项（请参阅[示例中的](https://scrapyd.readthedocs.io/en/latest/config.html#config-example)默认值）。

###### HTTP_PORT

HTTP JSON API将侦听的TCP端口。默认为`6800`。

###### bind_address

网站和json webservices将侦听的IP地址。默认为`127.0.0.1`（localhost）

###### max_proc

将启动的最大并发Scrapy进程数。如果未设置或`0`将使用系统中可用的cpus数乘以`max_proc_per_cpu`选项中的值。默认为`0`。

###### max_proc_per_cpu

每个cpu将启动的最大并发Scrapy进程数。默认为`4`。

###### 调试

是否启用调试模式。默认为`off`。启用调试模式时，如果处理JSON API调用时出错，则将返回完整的Python回溯（作为纯文本响应）。

###### eggs_dir

将存储项目egg的目录。

###### dbs_dir

将存储项目数据库的目录（包括蜘蛛队列）。

###### logs_dir

将存储Scrapy日志的目录。如果要禁用存储日志，请将此选项设置为空，如下所示：

```
logs_dir  =
```

###### items_dir

0.15版本的新功能。

将存储Scrapy项目的目录。默认情况下禁用此选项，因为您需要使用数据库或源导出程序。将其设置为非空会导致通过覆盖scrapy设置将已删除的项目源存储到指定的目录`FEED_URI`。

###### jobs_to_keep

0.15版本的新功能。

每个蜘蛛保留的已完成作业数。默认为`5`。这指的是日志和项目。

此设置`logs_to_keep`在以前的版本中命名。

###### finished_to_keep

版本0.14中的新功能。

要在启动器中保留的已完成进程数。默认为`100`。这仅反映在网站/作业端点和相关的json webservices上。

###### POLL_INTERVAL

用于轮询队列的间隔，以秒为单位。默认为`5.0`。可以是浮点数，如`0.2`

## Scrapyd-Client

### 安装：

```
pip install scrapyd-client
```

### 运行

1. 将 **scrapyd-deploy** 拷贝到scrapy项目于scrapy.cfg同级

2. 修改scrapy.cfg内容

3. ```
   [settings]
   default = cnblogSpider.settings

   [deploy:100]
   url = http://localhost:6800/
   project = cnblogSpider

   username = admin
   password = admin
   ```

1. 启动

   ```
   scrapyd
   ```

2. 发布

   ```
   scrapyd-deploy <deploy名称> -p <项目名称> -v <版本号>
   ```

3. 运行

   ```
   curl http://127.0.0.1:6800/schedule.json -d project=cnblogSpider -d spider=anjuke
   ```
