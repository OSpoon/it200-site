# CLI新功能之多项目启动器

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

当你手头存在一些关联项目需要全部启动后协同工作的时候，如多个前端项目间有嵌套需求、前后（NodeJs）端项目等，就可以使用这么一个启动器来简化多个项目启动带来的重复工作。

## 统一约束：

1.  项目启动配置文件路径与待启动项目同级；
1.  多个待启动项目路径同级存放；
1.  待启动项目的执行脚本命名均使用“start”；

## 数据转换流程：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281409634.png)

## 引用类库：

| 类库名      | 功能       |
| -------- | -------- |
| chalk    | 美化日志输出   |
| inquirer | 收集用户输出信息 |
| shelljs  | 执行项目启动脚本 |

## 通用脚本编写：

读取主项目和各从项目的 **package.json** 文件得到启动项目的脚本，并将它们存放在统一的 **startScript** 数组；

```
const startScript = [];
const mainPackage = require(`./${pConfig.progects.main}/package.json`);

if (mainPackage.scripts.start) {
    startScript.push({
        name: pConfig.progects.main,
        runScript: mainPackage.scripts.start,
        isMain: true,
    });
    pConfig.progects.slave.forEach((slave) => {
        const slavePackage = require(`./${slave}/package.json`);
        if (slavePackage.scripts.start) {
            startScript.push({
                name: slave,
                runScript: slavePackage.scripts.start,
                isMain: false,
            });
        }
    });
}
```

使用 **inquirer** 来收集实际需要启动项目的选项，这里使用 checkbox 来组织问题，将 
**startScript** 转化成 **inquirer** 需要的格式：

| 参数      | 含义                                 |
| ------- | ---------------------------------- |
| name    | 各选项的名称。                            |
| value   | 各选项的值，这里我们将整个script当做value，方便后面使用。 |
| checked | 当script为主项目时，默认勾选。                 |

```
const choices = startScript.map((script) => {
    return {
        name: script.name,
        value: script,
        checked: script.isMain,
    };
});
```

****

**inquirer** 配置，**name** 在读取 **answers** 对象时使用：

```
inquirer.prompt([
  { 
    type: 'checkbox', 
    name: 'startProjects', 
    message: '需要启动的项目', 
    choices 
  }]).then((answers) => {
   // TODO 拿到选中的选项后异步执行启动各项目的脚本 
});
```

启动项目脚本的执行可以使用 **shelljs** 来方便的完成，在循环 **answers** 中的项目启动脚本的时候，我们根据不同的项目名称执行 `shell.cd()`进入到不同的项目内，在通过异步调用 `shell.exec(runScript, { async: true });`来真实的执行项目启动脚本。

需要在执行 `shell.exec()`后通过返回的 ChildProcess 对象来设置各项监听器：

```
const child = shell.exec(runScript, { async: true, silent: true, fatal: true });
child.stdout.on('data', (data) => {
  console.log(chalk.white.bgYellow.bold(` ${name} OUTPUT：\n`), data);
});
child.stderr.on('data', (data) => {
  console.log(chalk.white.bgYellow.bgRed(` ${name} ERROR：\n`), data);
});
```

## 结语：

当你手头存在一些关联项目需要全部启动后协同工作的时候，如多个前端项目间有嵌套需求、前后（NodeJs）端项目等，就可以使用这么一个启动器来简化多个项目启动带来的重复工作。
