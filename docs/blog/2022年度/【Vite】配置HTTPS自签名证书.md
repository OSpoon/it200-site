# 【Vite】配置HTTPS自签名证书

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

在学习开发 **WebRTC** 相关的项目的时候是需要使用到 **HTTPS** 安全协议才能正常工作的，所以我们需要在 **Vite** 构建的项目中启用 **HTTPS** 协议并且配置证书文件，在生产环境是需要申请商用版证书（付费）的，我们在本地开发的工程中可以使用自签名的证书来搞定。

## 如何启用 HTTPS：

### 仅启用 HTTPS：

**Vite** 构建的项目默认是使用的 **HTTP** 协议，我们需要在 **vite** 的配置文件进行配置启用，下图是我在 **vite** 文档中找到的截图：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281419650.png)

我们可以在将这个属性配置为 **true** 来开启 **HTTPS** 协议，配置后并重启服务就可以看到在 **CLI** 中提示的服务地址变成了 **HTTPS** ，当你在浏览器打开这个地址的时候你会发现被浏览器拦截了，证书无效。

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281420264.png)

### 配置证书说明：

仅仅启用了 **HTTPS** 无法满足我们的要求（修改浏览器设置为不保护除外），我们还需要配置有效的证书才可以，`server.https`除了支持 **Boolean** 类型以外，还支持传入一个 `https.createServer`的选项，下图是 **vite** 文档引导到 **Nodejs** 的参数说明，key 和 cert 分别对应着安全秘钥和证书文件：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281420070.png)

## 生成自签名证书文件：

生成证书的主要工具是使用使用 **OpenSSL** 来操作一堆命令生成，我们这里推荐一个非常简单的生成证书的方式，就是下图中排名第一的这个开源项目：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281420854.png)

### 在 Mac 中使用 mkcert：

1.  通过 **brew** 安装 **mkcert**：

```
brew install mkcert
```

注：在 **linux** 中可以使用 **apt**、**yum**等安装，在 **windows** 中可以支持下载 **exe** 文件并拖拽到终端后执行对应的命令。

2.  使用 **-install** 命令安装证书到系统中，也可以通过**-uninstall** 来移除这个证书，我们可以在 mkcert 后增加不同的 location 来生成秘钥和证书文件：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281420360.png)

### 生成证书和秘钥文件：

1.  在项目目录下新建并进入 keys 目录：`mkdir keys && cd keys`；
1.  执行生成命令：`mkcert localhost 127.0.0.1`；
1.  下图提示我们生成成功了，证书文件 `localhost+1.pem` 和秘钥文件 `localhost+1-key.pem`；

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281421766.png)

## 在 Vite 中配置证书文件：

#### 调整证书和秘钥文件名：

我们将生成到 keys 文件夹中的秘钥和证书文件修改成NodeJs 文档中`  https.createServer `示例的文件名称：

1.  localhost+1.pem **=>** agent2-cert.pem；
1.  localhost+1-key.pem => agent2-key.pem；

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281421323.png)

### 安装证书：

在终端执行 `mkcert -install`，输入密码验证，成功后得到如下提示：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281421921.png)

### 调整 Vite 配置文件：

使用 fs 模块分别读取证书和秘钥文件，并配置到 https 属性：

```
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync('keys/agent2-key.pem'),
      cert: fs.readFileSync('keys/agent2-cert.pem')
    },
  },
});
```

再次启动服务浏览器的页面刷新后将一切正常访问了，并且在浏览器中查看证书也是正常的了：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281421387.png)

## 结语：

在本地开发或调试的时候或多或少会使用到 **HTTPS** 协议，我们使用了简单方便的开源 **mkcert** 完成了证书的生成，通过查看 **vite** 文档成功启用了 **https**，接下来就愉快的编码吧。