# 📢利用Vite插件助力证书安装

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

在以前的一篇文章中讲述了在前端开发时通过配置自签名证书来完成必须使用HTTPS协议才能工作的功能。那么当你同时需要在手机端预览的时候，可能就要将公钥证书也安装到手机上了，但无论你通过什么方式将证书发送到手机中都不如我写的这个`Vite`插件使用着方便，那么一起来看一下我是怎么做的~

## 2. 添加调试Vite环境配置
在Vue.js开发时一般都在程序中通过`debugger`关键字来中断程序进行调试就可以搞定大多数的问题，但很少会直接断点调试构建脚本，那么请按照下面的4步来配置调试环境，以便更好的完成后面插件的开发~

1. 在项目根目录创建名为`.vscode/launch.json`调试环境配置文件；
2. 在调试窗口右下角点击添加配置，并选择 `Node.js：Launch via NPM`；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011647779.png)

3. 调整增加的 `Launch via NPM` 配置以适合当前项目：

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011647696.png)

4. 在`vite.config.ts`的起始位置打断点后通过调试窗口运行 `Launch via NPM` 配置，运行成功后将停留的目标断点处；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011648587.png)

到这里就成功进入断点了，怎么样，你配置好了吗~ 🤺
## 3. Vite插件模板及基本配置
首先我们在项目根目录下增加名为`plugins/vite-plugin-certificate-install.ts`的插件文件；
```typescript
import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

export type Options = {
    path: string,
    pem: string,
}

const certificateInstall = (options: Options) => {

  	const { path: _path, pem: _pem } = options;

    let config: ResolvedConfig;

    return {
        // 1、指定插件名称
        name: 'vite-plugin-certificate-install',
        // 2、指定插件在serve时运行，默认serve和build均运行
        apply(_, { command }) {
            return command === 'serve'
        },
        // 3、存储最终解析的配置
        configResolved(_config) {
            config = _config
        },
        // 4、配置开发服务器钩子
        configureServer(server: ViteDevServer) {
            server.middlewares.use((req, res, next) => {

            })
        },
    } as Plugin;
}

export default certificateInstall;
```
接着安装插件到`vite.config.ts`，**ts**环境受`tsconfig.json`文件限制，可能需要将编写的脚本显示的添加到`include`配置中：
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 1、导入插件
import certificateInstall from './plugins/vite-plugin-certificate-install';

export default defineConfig({
    plugins: [
        vue(),
        // 2、安装插件 
        certificateInstall({ path: './keys', pem: 'agent2.pem' })
    ]
})
```
```json
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  // 新增
  "include": ["vite.config.ts", "./plugins/vite-plugin-certificate-install.ts"]
}
```
到这里最基础的插件已经准备并安装好了~
## 4. 编写开发服务器中间件
**编码说明：**

1. 证书文件受浏览器影响直接访问可能至会渲染出证书内容而不能触发移动设备安装。
2. 只获取resolvedUrls中的network选项是因为移动设备通过统一网络进行获取，local地址将无法在移动设备直接访问，所以local兼容无意义。
### 4.1 重写printUrls函数：
重写printUrls函数，扩展其支持输出安装证书的二维码；
```json
// 保存一份内置的printUrls函数；
const _print = server.printUrls;
// 重写printUrls函数，扩展功能；
server.printUrls = () => {
    _print();
    // 获取 network 中的地址用于合成url后生成二维码
    const host = server.resolvedUrls?.network[0];
    if (host) {
        console.log(`${bold('Install Root Certificate on a Mobile Device ⤦')}`);
        qrcode.generate(`${host}__certificate/`, { small: true });
    } else {
        console.log(`${green('Failed to get the network address.')}`);
    }
}
```
### 4.2 编写开发服务中间件：
拦截执行的安装证书请求，并读取证书文件后写回移动设备；
```json
server.middlewares.use((req, res, next) => {
    const { method, originalUrl } = req;
    if (method === 'GET' && originalUrl === '/__certificate/') {
        const pemPath = path.resolve(_path, _pem);
        if (!fs.existsSync(pemPath)) throw new Error(`Make sure that '${pemPath}' exists.`);
        const pem = fs.readFileSync(path.resolve(_path, _pem));
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `filename=${_pem}`,
        })
        res.end(pem);
    } else {
        next();
    }
})
```
### 4.3 准备签名文件后启动Vite开发服务：
在项目根目录的`keys`目录下放置`agent2.pem`证书，执行`npm run dev`启动Vite开发服务：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309011649393.png)
## 5. Vite插件打包分发
在插件打包时我们还是要考虑到使用者非TypeScript开发环境，所以需要转为JavaScript后进行分发，tsup模块利用esbuild在不需要任何配置的情况下就可以对Ts进行编译。
需要在项目中安装tsup到开发依赖，请不要直接通过npx使用，可能会因为找不到typescript模块而终止掉部分编译流程；
安装后使用如下命令编译插件，需要指定入口文件、出口目录、编译.d.ts文件、输出模块类型选项：
```shell
tsup ./plugins/vite-plugin-certificate-install.ts --outDir output --dts --format cjs,esm
```
## 6. 利用脚手架快速搭建Vite插件：
`generator-vite-plugin`基于Yeoman的Vite插件生成器：
**全局安装 yeoman 和 generator**
```shell
$ npm i -g yo
$ npm i -g generator-vite-plugin
```
**运行生成器**
```shell
$ yo vite-plugin
```
## 7. 总结
利用Vite提供的开发服务器钩子，我们实现了固定地址的拦截，并将自签名证书写回到手机端并触发证书安装。还通过重写Vite内置的printUrls函数实现了服务启动后将证书获取地址的二维码打印到终端，在最后还提供了`generator-vite-plugin`插件来快速编写Vite插件，欢迎体验使用~