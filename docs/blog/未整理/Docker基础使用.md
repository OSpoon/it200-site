# Docker基础使用

#### Docker容器操作
###### 查看运行中容器
```
docker ps
```
###### 查看所有容器
```
docker ps -a
```
###### 创建指定名称的nginx容器
```
docker create --name=nginx nginx
```
###### 启动容器
```
docker start
```
###### 停止容器
```
docker stop
```
###### 创建+启动容器(后台)
```
docker run --name nginx1 -d -p 8080:80 nginx
```
###### 创建交互型容器
```
docker run --name ubuntu -it ubuntu /bin/bash
```
###### 创建导入的容器
```
docker run --name nginx1 -d -p 8080:80 5ad3bd0e67a9 nginx -g 'daemon off;'
```
###### 依附容器
```
docker attach
```
###### 容器内执行命令
```
docker exec -it id/name bash
```
###### 退出命令
```
exit 1
```
###### 查看容器信息
```
docker inspect id/name
```
###### 查看进程
```
docker top id/name
```
###### 查看日志
```
docker logs id/name
docker logs id/name -f //实时日志
```
###### 文件上传容器
```
docker cp index.html id/name:/usr/share/nginx/html/
```
###### 导出容器
```
docker export id/name > Documents/docker/nginx1.tar
```
###### 导入容器
```
cat Documents/docker/nginx1.tar | docker import - importnginx:lastest
```
###### 报错Error response from daemon: No command specified
```
执行`docker ps  --no-trunc`查看COMMAND信息运行docker run 加入COMMAND信息
```

#### Docker镜像操作
###### 镜像查看
```
docker images
```
###### 查找已托管至Docker Hub的镜像
```
docker search
```
###### 镜像删除
```
docker rmi
```
###### 创建本地镜像
```
docker commit -m "update index.html" --author='ospoon' 00eaf4764018 ospoon/nginx1:v1
```
###### Dockerfile
1. 创建Dockerfile文件
2. 编辑Dockerfile
```
# 指定基准镜像
FROM nginx
# 维护者信息
MAINTAINER ospoon "1825203636@qq.com"
# 执行命令
RUN echo 'hello docker!'>/usr/share/nginx/html/index.html
# 拷贝文件
COPY ./hello.html /usr/share/nginx/html/
```
3. 执行Dockerfile
在Dockerfile文件目录执行`docker build -t ospoon/nginx:v1 .`
