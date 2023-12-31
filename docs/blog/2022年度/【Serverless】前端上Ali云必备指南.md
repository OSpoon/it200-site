# 【Serverless】前端上Ali云必备指南 

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

原本早就该写完了微信 SDK 授权服务上云计划由于对 Ali 云函数计算 FC 的不熟悉遇到了很多的坑，再前面的文章中还吐槽了一通。在服务顺利跑通后，这回实打实的来总结一下顺利上云的保守指南~

## 2. 创建函数计算应用/服务/函数

> 项目基于 Node.js 技术栈的 egg.js 服务端项目模板搭建授权服务

### 2.1 选择服务模板：

登陆Ali[云函数计算 FC 应用](https://link.juejin.cn/?target=https%3A%2F%2Ffcnext.console.aliyun.com%2Fapplications "https://fcnext.console.aliyun.com/applications")控制台，选择【通过模板创建应用】，在下面的选项选中Web开发框架后搜索 [\*\*Egg.js \*\*](https://link.juejin.cn/?target=https%3A%2F%2Fwww.eggjs.org%2Fzh-CN%2F "https://www.eggjs.org/zh-CN/")官方模板。 ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281431355.png)

### 2.2 立即创建：

> 由于在线 IDE 在简单尝试后感觉还是不太利于调试，尤其是对 egg.js 和函数计算 FC 都还不是很熟悉的伙伴不建议直接在在线 IDE 中开发。

#### ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281432284.png)2.2.1 部署类型：

我们选择经常使用的一个代码托管平台来【通过代码仓库部署】 ，【仓库用户/组织】在第一次使用的时候需要跳转到托管平台进行一次授权~

#### 2.2.2 触发方式：

【触发方式】可以选择当代码推送至 master 分之后拉取并构建，也可以选择发布 Release 后构建，我认为选择默认的代码推送 master 后构建是符合学习阶段的~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281432358.png)

#### 2.2.3 服务名&函数名：

【服务名】和【函数名】在每次创建的时候提供的默认名称都是一样的，这里我们必须要**重新命名**，**切记要重新命名**，否则会覆盖掉之前已经从在的服务和函数，重名在创建时未能触发校验的问题技术已经在工单回复会做评估了~

#### 2.2.4 等待创建：

创建应用包括了同步模板代码到你所选的托管仓库，在 Ali 函数计算 FC 开辟空间来创建应用，完成创建后开始执行部署工作~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281432446.png) 部署完成后在当前应用的详情页面或应用列表页面可以通过提供的域名访问Eggjs 提供的默认首页~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281432027.png)

### 2.3 必要的配置修改：

#### 2.3.1 自定义域名：

如果你有阿里云的域名的话可以在【高级功能】-【域名管理】-【添加自定义域名】，在域名解析的时候通常解析二级域名而不是直接解析到主域名下，我的主域名是 [it200.cn](https://link.juejin.cn/?target=http%3A%2F%2Fit200.cn "http://it200.cn")，待解析的二级域名使用了 [wx.it200.cn](https://link.juejin.cn/?target=http%3A%2F%2Fwx.it200.cn "http://wx.it200.cn")。 路由配置选择刚创建的应用时填写的服务名和函数名，版本使用最新的LATSET版本~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281433580.png) **域名解析**简要说一下：当要使用一个自己的域名（自定义域名）去代替另一个域名（默认提供域名）时，记录类型需要选择 **CNAME**，**主记录**只需要填写二级部分，**解析线路**不需要修改，**记录值**就是被代理的域名，配置解析后你就可以稍等片刻去尝试访问了~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281433243.png)

#### 2.3.2 环境变量配置及函数中读取：

> 在对接微信 SDK 授权的时候需要使用到微信提供的安全秘钥和凭证信息，这些信息在部署服务的时候必须使用环境变量来配置，这样的信息是不适合放置到代码中的~

增加一个获取环境变量名为 **APPID** 的控制器并注册到名为 `env` 的路由对象中~

```
// 控制器
async getEnv() {
  const { ctx } = this;
  ctx.body = process.env.APPID;
}

// 路由配置
router.get('/env', controller.home.getEnv);

```

推送代码并等待重新部署后配置如下环境变量，环境变量在【服务列表】-【服务 xxx 详情】-【函数管理】-【函数详情】-【**函数配置**】中，正常通过访问[获取 ENV](https://link.juejin.cn/?target=http%3A%2F%2Fwx.it200.cn%2Fenv "http://wx.it200.cn/env")接口将会在浏览器中输出了配置的 **APPID** 对应的值~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281434454.png)

#### 2.3.3 函数触发器支持 POST：

使用过 Egg.js搭建服务的伙伴会知道 Egg.js 默认开启的 [CSRF](https://link.juejin.cn/?target=https%3A%2F%2Fwww.eggjs.org%2Fzh-CN%2Fcore%2Fsecurity%23%25E5%25AE%2589%25E5%2585%25A8%25E5%25A8%2581%25E8%2583%2581-csrf-%25E7%259A%2584%25E9%2598%25B2%25E8%258C%2583 "https://www.eggjs.org/zh-CN/core/security#%E5%AE%89%E5%85%A8%E5%A8%81%E8%83%81-csrf-%E7%9A%84%E9%98%B2%E8%8C%83") 安全策略，当我们发起 POST 请求后会肯快在控制台收到 403 拒绝访问的状态码，但当我去关闭 CSRF 策略后依然收到了 403 的状态码，一度我怀疑这个配置不允许修改，在咨询 ali 技术后知道要想使用 POST 方式来触发接口需要做单独的配置~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281434692.png) ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281434103.png)

## 3. 移植WxSDK 授权代码：

> 授权代码本地版本：`git clonne git@github.com:OSpoon/wechat4node.git`

### 3.1 必要依赖安装：

#### 3.1.1 crypto-js：

> npm i crypto-js

我们会使用到提供的 SHA1 算法来验证腾讯服务器发来的数据签名和计算签名提供给腾讯服务器来验证我们的数据可靠，代码见 `service` 文件夹~

#### 3.1.2 egg-cors：

> npm i egg-cors

安装后开启插件：

```
// plugin.ts
const plugin: EggPlugin = {
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

```

安装后配置插件，放开\*\* **[**CORS**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2016%2F04%2Fcors.html "https://www.ruanyifeng.com/blog/2016/04/cors.html")** \*\*限制：

```
// config.default.ts
config.cors = {
  origin: '*',
  allowMethods: 'GET, PUT, POST,DELETE, PATCH',
};

```

### 3.2 关闭 CSRF 安全策略：

CSRF 安全策略在前后端不分离的应用场景使用广泛，在前后端分离后通常使用 JWT 来实现授权过程，所以这里我们也不采用 CSRF 策略，我们通过配置来关闭~

```
// config.default.ts
config.security = {
  csrf: {
    enable: false, // 关闭csrf
  },
};

```

### 3.3 移植路由配置：

1.  checkOrigin：在微信公众平台主动发起的服务验证时使用；
2.  token：公众号相关 API 授权信息获取接口；
3.  ticket：公众号相关 API 票据数据获取接口；
4.  signature：公众号 JS-SDK 在初始化使用的授权信息获取接口；

```
router.get('/checkOrigin', controller.home.checkOrigin);
router.get('/token', controller.home.token);
router.get('/ticket', controller.home.ticket);
router.post('/signature', controller.home.signature);

```

### 3.4 移植控制器：

在控制器中只需要保留的入参、出参和执行逻辑的调用代码，其他它的具体业务逻辑均 `service` 层编写，异常处理和统一响应暂时不需要考虑~

```
async checkOrigin() {
  const { ctx } = this;
  const { signature, timestamp, nonce, echostr } = ctx.query;
  const result = await ctx.service.weChat.checkSignature(
    signature,
    timestamp,
    nonce,
  );
  ctx.body = result ? echostr : '';
}

async token() {
  const { ctx } = this;
  ctx.body = await ctx.service.weChat.getToken();
}

async ticket() {
  const { ctx } = this;
  ctx.body = await ctx.service.weChat.getTicket();
}

async signature() {
  const { ctx } = this;
  const { url } = ctx.request.body;
  ctx.body = await ctx.service.weChat.genSignature(url);
}

```

### 3.5 移植服务层：

在 app 目录下新建 `service/WeChat.js`并移植对应[代码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FOSpoon%2Fwechat4node%2Fblob%2F92c4d596c23c0b44c06075e83f853e20e9300385%2Fserver%2Fapp%2Fservice%2FWeChat.ts "https://github.com/OSpoon/wechat4node/blob/92c4d596c23c0b44c06075e83f853e20e9300385/server/app/service/WeChat.ts")~

#### 3.5.1 常量 APPID 和 APPSECRET 改为使用环境变量读取：

1.  `const APPID = process.env.APPID;`
2.  `const APPSECRET = process.env.APPSECRET;`

#### 3.5.1 对象缓存应用：

微信提供的 `access_token` 和 `ticket`都有频率限制，不适合每次都直接调用微信所提供的接口，我们在没有 Redis 等这种数据存储的情况下可以考虑使用对象缓存来实现`access_token`和`ticket`的缓存，实现接口的降频处理~

```
const cache = {
  token: {
    access_token: undefined,
    expires_in: 0,
    last_time: 0,
  },
  ticket: {
    ticket: undefined,
    expires_in: 0,
    last_time: 0,
  },
};

export default class WeChat extends Service {}

```

## 4. 验证云函数执行情况：

### 4.1 创建 Vue 项目：

1.  执行`yarn create vite` 创建；
2.  添加 js-sdk 脚本到 index.html：

```
<script src="http://res2.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

```

3.  安装axios完成接口数据交换；

### 4.2 移植前端代码：

重复的就不要再写了，copy 一下~

```
<script setup>
import { ref } from "vue";
import axios from "axios";
const message = ref("");
const status = ref("");
axios
  .post(`http://wx.it200.cn/signature`, {
    url: location.href.split("#")[0],
  })
  .then((res) => {
    const { appId, nonceStr, signature, timestamp } = res.data;
    console.log("[ res ] >", appId, nonceStr, signature, timestamp);
    wx.config({
      debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名
      jsApiList: ["updateAppMessageShareData"], // 必填，需要使用的 JS 接口列表
    });
    wx.error((res) => {
      message.value = res.errMsg;
    });
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList: ["updateAppMessageShareData"], // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        success: (res) => {
          wx.updateAppMessageShareData({
            title: "我的掘金", // 分享标题
            desc: "我在掘金输出前端知识~", // 分享描述
            link: "https://juejin.cn/user/3966693685871694", // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              "https://p9-passport.byteacctimg.com/img/user-avatar/71ca4682501063257d8413ff726105a0~300x300.images", // 分享图标
            success: function () {
              status.value = "设置成功";
            },
          });
        },
      });
    });
  });
</script>

```
```

<template>
  <h3 v-if="message">{{ message }}</h3>
  <h3 v-else>
    点击右上角=>分享给朋友
    <h5>{{ status }}</h5>
  </h3>
</template>

```

### 4.3 重新配置环境变量和触发器：

当我们把代码每次 push 到远程等待部署成功后，上一次配置的环境变量和触发器就丢失了，问题是由于代码库里面的 `s.yaml` 配置文件覆盖导致的，这个文件就留给有心的小伙伴研究研究怎么样~

### 4.4 验证云函数执行：

在微信开发者工具中正常打开前端项目页面后，会先直接 **token 获取**，**票据获取**，**合成验签**三步，在前端拿到验签数据后正常初始化 wx.config ，并提示授权成功~ ![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281435646.png)

## 5. 总结

微信 SDK 授权服务的上云就算是暂时搞定了，前前后后折腾的时间不短，尝试了多次，这一次是最顺利的，云函数在没有服务器的情况下对于前端开发者应该还是很友好的（相比于服务器操作来说），要不要一起来踩坑呢？后面还会对接上一篇的【消息通知】来实打实的将这个服务应用起来~