---
title: Node使用Express做简易数据测试服务
date: 2020-04-27 11:20:11
tags:
 - Node
 - Express
categories:
 - Node
---

# Node使用`express`做简易数据测试服务

#### 初始化项目
1. 执行 `npm init`
2. 添加启动服务命令`"start": "node app.js"`到`scripts`节点下,`npm start`就为配置后的启动命令
3. 添加依赖`"express": "^4.16.3"`到`dependencies`节点下
4. 安装依赖 `npm i`
    
#### 配置项目
1. 根目录创建`app.js`,初始化内容
    ```js
    //导入相关模块
    const express = require("express");
    const path = require("path");
    const app = express();

    //请根目录创建`public`文件夹,并添加`index.html`为首页面
    app.use(express.static(path.resolve(__dirname,"public")));

    //================↓=↓=↓=↓=↓=配置接口信息=↓=↓=↓=↓=↓================
    app.use("/getUserInfo",require("./router/userInfo"))
    //================↑=↑=↑=↑=↑=配置接口信息=↑=↑=↑=↑=↑================

    const port = 3000;
    //服务监听
    app.listen(port,()=>{
        console.log(`server running @http://localhost:${port}`);
    });

    module.exports = app;
    ```
2. 根目录创建`router`目录,初始化内容
    ```js
    //导入相关依赖
    const express = require("express");
    const router = express();

    //配置路由
    router.get("/",(req,res) => {

        //get请求参数读取
        //const shopId = req.query.shopId;
        //console.log(shopId);

        //组装返回数据
        let data = {
            "code":"0",
            "message":"success",
            "data":[
                {
                    "name":"张三",
                },
                {
                    "name":"李四",
                },
                {
                    "name":"王五",
                },
            ]
        };
        //发送需要返回到前端的数据
        res.send(data);
    });

    module.exports = router;
    ```
3. 复杂版POST请求
    ```js
    //导入相关依赖
    const express = require("express");
    const router = express();
    let bodyParser = require('body-parser');
    let urlencoderParser = bodyParser.urlencoded({extended:false});

    //拼装返回数据中的部分信息
    const base_url = "http://127.0.0.1:3000/images/goods/";

    //配置路由
    router.post("/",urlencoderParser,(req,res) => {
        //post请求参数读取
        let shopId = req.body.shopId;
        console.log(shopId);

        //组装返回数据
        let goods = {
            "code":"0",
            "message":"success",
            "data":[
                {
                    "name": "法国代购新款江疏影同款翻领修身中长裙春夏印花连衣裙",
                    "image": base_url + "001/cover.jpg",
                    "presentPrice": 98.88,
                    "goodsId": "001",
                    "oriPrice": 108.88
                }, {
                    "name": "柔美而精致~高贵而优雅~圆领金银丝春季毛衣羊毛开衫女短款白外套",
                    "image": base_url + "002/cover.jpg",
                    "presentPrice": 229.90,
                    "goodsId": "002",
                    "oriPrice": 320.99
                }
            ]
        };

        res.send(goods);
    });

    //发送需要返回到前端的数据
    module.exports = router;
    ```

4. 访问图片`http://localhost:3000/images/goods/001/1.jpg`
    ```js
    在public目录下增加images/goods/001目录并在001目录下添加名称为1.jpg图片
    ```


