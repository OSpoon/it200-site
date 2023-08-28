# 【实战】自定义 Github Action 库

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

我有两个站点都采用的 AliOSS 对象存储来进行内容托管，我通常都是在本地编译出新的网站资源后通过执行发布 OSS 脚本来推送网站资源到 OSS 桶内，这种重复的工作做久了被迫就要进行自动化构建改造，这里我选择利用 Github 提供 workflows 来完成，我还会编写一个符合自己要求的 Action 库来辅助 workflows 工作，一起来看一下~

## 2. auto-push-oss Action
虽然在 Github 市场有推送 OSS 相关的 Action，但是我还是选择改造我运行了好多年的脚本来自定义符合自己要求的 Action 库。
**编写步骤：**

- [x] 添加依赖、编译脚本、**action.yml**配置
- [x] 编写自述文档
- [x] 编写`indnex.js`脚本
### 2.1 添加依赖、编译脚本、action.yml配置：
#### 2.1.1 添加必要依赖：
```yaml
"@actions/core": "^1.9.1"		// 读取 yml 参数
"@vercel/ncc": "^0.34.0"    // 打包脚本
"ali-oss": "^6.17.1"        // ali-oss依赖
```
#### 2.1.2 添加编译脚本：
```yaml
"build": "ncc build index.js --license licenses.txt"
```
#### 2.1.3 编写 action.yml 配置文件：
```yaml
name: "auto-push-oss"
description: "自动推动目录到 OSS"
# 定义输入参数
inputs:
  root:
    description: "待推送路径"
    required: true
  bucket:
    description: "oss bucket"
    required: true
  region:
    description: "oss region"
    required: true
  accessKeyId:
    description: "oss accessKeyId"
    required: true
  accessKeySecret:
    description: "oss accessKeySecret"
    required: true
runs:
  # 脚本运行环境（按官方文档给的12版本来使用）
  using: "node12"
  # 脚本执行入口（这里我们要用@vercel/ncc编译）
  main: "dist/index.js"
```
### 2.2 编写自述文档：
自述文档需要说明这个 Action 的主要作用、需要配置的参数和最小使用的例子~
#### 2.2.1 auto-push-oss
:::success
方便将常见的 Vue 项目,VuePress 项目构建到根目录的 dist 文件夹推送到指定从 oss 桶的根目录,特别适合在 oss 托管 VuePress 博客~
:::
#### 2.2.2 Inputs
| 参数 | 描述 |
| --- | --- |
| `root` | 待推送文件夹 |
| `bucket` | oss bucket |
| `region` | oss region |
| `accessKeyId` | oss accessKeyId |
| `accessKeySecret` | oss accessKeySecret |

#### 2.2.3 Example usage
```yaml
uses: OSpoon/auto-push-oss@main
with:
  root: public
  bucket: it200
  region: oss-cn-beijing
  accessKeyId: ${{secrets.accessKeyId}}
  accessKeySecret: ${{secrets.accessKeySecret}}
```
### 2.3 编写indnex.js脚本：
#### 2.3.1 提供`path`、`fs`、`ali-oss` 和获取 yml 参数的`@actions/core`依赖~
```javascript
const path = require("path");
const fs = require("fs");

const core = require("@actions/core");
const OSS = require("ali-oss");
```
#### 2.3.2 通过`@actions/core`提供的`getInput`来获取 yml 配置的参数变量~
```javascript
const root = core.getInput("root");
const bucket = core.getInput("bucket");
const region = core.getInput("region");
const accessKeyId = core.getInput("accessKeyId");
const accessKeySecret = core.getInput("accessKeySecret");
```
#### 2.3.3 OSS 推送文件主脚本
```javascript
// TODO 必要依赖

// TODO 接收输入参数

const client = new OSS({
  bucket,
  region,
  accessKeyId,
  accessKeySecret,
});

const rootPath = root || "dist";

const isHave = fs.existsSync(rootPath);
if (!isHave) {
  throw new Error("路劲不存在");
}

let filepaths = [];
let putCount = 0;

function readFileSync(filepath) {
  let files = fs.readdirSync(filepath);
  files.forEach((filename) => {
    let p = path.join(filepath, filename);
    let stats = fs.statSync(p);
    if (stats.isFile()) {
      filepaths.push(p);
    } else if (stats.isDirectory()) {
      readFileSync(p);
    }
  });
}

function put(filepath) {
  const p = filepath.replace(rootPath, "").substr(1);
  return client.put(p.replace("\\", "/"), filepath);
}

async function update() {
  try {
    // 递归获取所有待上传文件路径
    readFileSync(rootPath);
    let retAll = await filepaths.map((filepath) => {
      putCount++;
      console.log(`任务添加: ${path.basename(filepath)}`);
      return put(filepath);
    });
    Promise.all(retAll).then((res) => {
      const resAll = res.map((r) => {
        return r.res.statusCode === 200;
      });
      if (Object.keys(resAll).length === putCount) {
        console.log("发布成功");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

// 上传发布
update();
```
## 3. use auto-push-oss
下面这份配置就是将网站打包并推送 OSS 的工作流程，当监测到新代码 PUSH 到 Github 后就开始执行`auto-push-2-oss`工作流，分别是：

   - 第一步使用`actions/checkout@v2`拉取代码；
   - 第二步执行`npm install && npm run build`安装依赖并输出网站资源；
   - 第三步使用`OSpoon/auto-push-oss@main`推送网站资源到 OSS；

`auto-push-oss@main`需要配置我们在自述文档中提到的几个必要参数需要通过 with 配置，其中`accessKeyId`和`accessKeySecret`由于涉及到 OSS 的相关秘钥，不建议也不应该明文展示到 Github，所以需要使用到项目级别的环境变量。
```yaml
name: push-2-oss
on: [push]
jobs:
  auto-push-2-oss:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v2
      - name: install & build 
        run: npm install && npm run build
      - name: push public oss
        uses: OSpoon/auto-push-oss@main
        with:
          root: public
          bucket: it200
          region: oss-cn-beijing
          accessKeyId: ${{secrets.accessKeyId}}
          accessKeySecret: ${{secrets.accessKeySecret}}
```
## 3. 总结

编写完 Action 后成功也接入了 workflows ，往后就不再重复的执行构建命令和发布脚本了，只需要将修改的代码 PUSH 到 Github 后面的工作将自动完成~

本文项目已推送至GitHub，欢迎克隆演示：`git clone git@github.com:OSpoon/auto-push-oss.git`