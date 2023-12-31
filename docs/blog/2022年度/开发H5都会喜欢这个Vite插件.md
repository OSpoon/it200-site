# 开发H5都会喜欢这个Vite插件

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

> 在开发小程序的时候经常会通过手机扫描小程序开发工具生成的二维码来快速在手机上打开正在开发的小程序进行功能调试，但是在H5开发时却还是通过聊天软件来粘贴地址，费时费力，所以我将编写一个Vite插件来支持终端显示二维码的功能。

## 1. Vite插件开发辅助

开发Vite插件建议使用开源项目[generator-vite-plugin](https://github.com/OSpoon/generator-vite-plugin)，可以通过简单了两步操作实现一个Vite插件开发的基本环境,还贴心的配置了调试脚本方便第一次开发插件时手忙脚乱；

### 1.1 安装generator-vite-plugin：

```bash
$ npm i -g yo
$ npm i -g generator-vite-plugin
```

### 1.2 生成Vite插件基本环境：

```bash
$ yo vite-plugin
```

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211202145430.gif)

## 2. DevQRCode插件开发

通过第一步已经生成了`vite-plugin-dev-qrcode` 插件的基本状态，这里要介绍几个基本的前提要素：

1. 手机端需要和电脑端处于同一局域网环境；
2. 手机端必须使用局域网分配的IP访问H5页面，Local地址无效；
3. Vite默认启动不提供Network地址，需要增加`--host` 参数，插件中默认已配置；

### 2.1 获取Vite启动后分配的URLs：

`vite`命令执行后会在终端启动一个开发服务器，并分配给我们访问该服务的地址，所以这里要关注的就是`configureServer` 这个钩子函数，通过该函数提供的`server` 对象可以获取到该服务的相关信息；

在`server`对象的`ViteDevServer` 类型定义中看到如下参数，在`server.listen` 之后urls将会打印到终端，这正是我要找的属性；

```tsx
/**
 * The resolved urls Vite prints on the CLI. null in middleware mode or
 * before `server.listen` is called.
 */
resolvedUrls: ResolvedServerUrls | null;
```

### 2.2 溯源Vite如何终端输出信息：

上一步知道了urls如何获取，这一步要解决的就是vite到底是如何输出urls到终端的？在Vite源码的`packages/vite/src/node/server/index.ts` 文件中有如下这段函数，可以看出这个函数将`resolvedUrls` 内容进行了打印，在加上`ViteDevServer` 类型定义中对该函数的注释，就完全锁定了这个就是我的目标函数；

```tsx
printUrls() {
  if (server.resolvedUrls) {
    printServerUrls(
      server.resolvedUrls,
      serverConfig.host,
      config.logger.info
    )
  } else if (middlewareMode) {
    throw new Error('cannot print server URLs in middleware mode.')
  } else {
    throw new Error(
      'cannot print server URLs before server.listen is called.'
    )
  }
}
```

```tsx
/**
 * Print server urls
 */
printUrls(): void;
```

### 2.3 生成二维码并在适时打印到终端：

生成的二维码要同urls一同输出，保持一致，这里要使用到扩展的手段来让`server.printUrls` 得到支持，类似的手段在Vue2的数组响应式实现中也有体现，不知道你是否还有印象；

具体的二维码生成使用到了`qrcode-terminal` 模块，丰富的样式输出使用`kolorist`模块，具体代码如下：

```tsx
configureServer(server: ViteDevServer) {
  const _print = server.printUrls;
  server.printUrls = () => {
    _print();
    const host = server.resolvedUrls?.network[0];
    if (host) {
      console.log(`${bold("Scan QR code to open quickly. ⤦")}`);
      qrcode.generate(`${host}`, { small: true });
    } else {
      console.log(
        `  ${green("➜")}  ${yellow("Failed to get the network address.")}`
      );
    }
  };
}
```

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211202145448.gif)

## 总结：

实现这个插件仅仅使用了十几行代码，期间翻阅了Vite插件的开发文档和源码，分别找到了开发服务器的相关钩子函数拿到了Vite打印的urls信息，并通过扩展`printUrls` 函数在保证原始逻辑正常执行的情况下增加二维码输出的功能。怎么样，这个插件你会写了吗？尝试一下吧~