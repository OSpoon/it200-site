# 🚀使用“release-it”一气呵成：version、tag、changelog 。。。

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

使用release-it可以进行版本管理，并通过默认提供的配置文件、三方插件和Hooks等功能执行测试、构建、发布等项目内置的任何命令，并进行发布~

## 功能列表：

1. 支持版本号升级；
2. 支持Git提交、打Tag、推送；
3. 支持使用Hooks执行测试或构建等命令；
4. 支持在GIthub发布版本；
5. 支持生成变更日志；
6. 支持发布到NPM仓库；
7. 支持插件扩展功能；
8. ...

## 2. 基本功能验证：
> 创建一个空的项目来演示release-it的使用方法

### 2.1 安装release-it：

1. 安装模块：`npm i -D release-it`；
2. 添加脚本：
```json
{
  "scripts": {
    "release": "release-it"
  }
}
```
### 2.2 运行release-it：

1. 初次运行`npm run release`，可能会提示 Not authenticated with npm. Please `npm login` and try again. ，因为你没有登录NPM账号，因为它想帮助你将此项目自动发布至NPM仓库；
2. 登录NPM提示：登录NPM需要注意切换NPM官方地址，可以使用NRM管理方便切换，登录NPM需要主要双因素验证~
3. 再次运行`npm run release`后在终端执行了以下几个过程：
```
a. 询问发布版本号如何递增；
b. 询问是否发布到NPM并进行NPM动态验证码验证；
c. 询问提交版本x.y.z；
d. 如果发现你没有任何跟踪的文件会提示通过git add <file>...来跟踪文件；
e. 询问是否打Tag；
f. 询问是否推送到远程仓库；
```
### 2.3 运行截图&结果：

1. 执行`npm run release`后终端截图：

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291015050.png)

2. 发布在**Github**上增加了`tag`并增加了`tag`对应的`release`版本：

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291015570.png)

3. 在NPM仓库看到`0.0.2`版本的包已经成功发布：

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291015719.png)
### 2.4 简单总结一下：
通过运行`release-it`命令成功更新了项目版本号、推送到NPM，增加对应版本的TAG并推送到了Github，还增加了对应的release版本，使用`release-it`节省了很多我们需要单独操作的一些步骤。
## 3. 规范/查看 changelog：
> 为了更好的支持release-it模块可以生成规范的changelog，我们可以安装`git-cz`模块在终端通过交互的模式实现~

### 3.1 规范changelog的生成规则：

1. 安装模块：`npm i -D git-cz`；
2. 添加脚本：
```json
{
  "scripts": {
    "commit": "git-cz"
  }
}
```

3. 运行`npm run commit`前请将变更文件添加暂存；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291015439.png)
### 3.2 使用release-it查看changelog：
> 因为changelog文件只有在使用`release-it`命令后才会去发生变更，仅仅是为了查看而不需要发布可以按下面命令操作~

执行命令：`npx release-it --changelog`；
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291015343.png)
执行命令：`npx release-it --release-version`；可以查看下一个该发布的版本号；
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291016388.png)
## 4. 友好的持续集成：
> 在前面执行release-it命令是我们使用的是默认的交互模式来由我们手动确定每一步的操作，在CI过程中我们需要改变一下这样的交互方式

### 4.1 应用配置文件实现部分功能的调整：
> 在第一次执行release-it命令是使用的就是其默认配置，可以看到默认配置已经非常完善了，但是我们往往还是需要通过配置来实现更加符合自己项目的定义，这时候就需要在项目根目录添加一个.release-it.json文件来完成个性化配置~

下面的示例中我们默认关闭了向NPM发布包的过程，更多配置可以参考[release-it.json](https://github.com/release-it/release-it/blob/master/config/release-it.json)~
```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "commit": true,
    "tag": true,
    "push": true
  },
  "github": {
    "release": true
  },
  "npm": {
    "publish": false
  }
}
```
### 4.2 启用CI模式：

1. 使用`--ci`选项启用CI模式，在持续集成时将不在进行交互操作；
2. 使用`--only-version`选项将仅通过交互来确认版本，其余过程自动完成；
### 4.3 再次执行release-it：

1. 添加变更文件到暂存；
2. 执行git-cz：`npm run commit`；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291016324.png)

3. 再次执行`release-it`：

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291016355.png)

4. 点击最后生成的GitHub Release地址后跳转到下面页面，我们只需要点击一下就可以完成版本发布了~

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291016788.png)
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291016843.png)
## 5. 生成CHANGELOG.md：
> 在前面的操作过程中我们成功的生成的主流的changelog内容，但是缺少一下汇总的MD文件，我们通过一个插件来完成这件事情~

1. 安装模块：`npm i -D @release-it/conventional-changelog`；
2. 配置插件到`.release-it.json`：
```json
{
  ...
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "preset": {
        "name": "conventionalcommits",
        "header": "# Changelog",
        "types": [
          { "type": "feat", "section": "Features" },
          { "type": "fix", "section": "Bug Fixes" },
          { "type": "chore", "hidden": true },
          { "type": "docs", "hidden": true },
          { "type": "style", "hidden": true },
          { "type": "refactor", "hidden": true },
          { "type": "perf", "hidden": true },
          { "type": "test", "hidden": true }
        ]
      }
    }
  }
}
```

3. 增加对应的模块后我们尝试在`src/index.js`再增加一个函数，并将这一切统统提交到`git`仓库，只有feat和fix两种标识的变更会被记录到CHANGELOG.md文件中；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291017467.png)
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291017102.png)
更多插件可以查看[release-it Plugins](https://github.com/release-it/release-it#plugins)~
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291017358.png)
## 6. 总结
上面我们演示了使用`release-it`的很多功能，基本可以完成我们大多数项目的自动发布、打Tag、生成变更日志等工作，在[release-it Plugins](https://github.com/release-it/release-it#plugins)中还提供了一些比较不错的插件可以试用一下，比如说 [lerna-changelog](https://github.com/release-it-plugins/lerna-changelog) 和 [workspaces](https://github.com/release-it-plugins/workspaces) 等，期待在pnpm管理项目中尝试一下~
> 本文项目已推送至GitHub，欢迎克隆演示：`git clone https://github.com/OSpoon/release-it-demo.git`