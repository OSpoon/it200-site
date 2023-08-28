# 利用fs-extra实现yarn create tlist创建项目

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

## 1. 前言


这一篇我们翻版一下 `create-vite`，将以后整理的项目模板集中管理，方便在需要的时候快速创建使用~

## 2. 利用fs-extra实现"yarn create tlist"创建项目
资源拷贝我们采用`fs-extra`模块实现~
### 2.1 模板资源拷贝：
在模板资源拷贝时部分文件是需要我们特殊处理的，所以这部分文件在资源拷贝时就暂时过滤掉，`fs-extra`模块中的`copySync`就提供了过滤文件的功能~
路径匹配的时候我们可以使用`path`模块中的`parse`函数转为对象后可以更好的操作~
```javascript
export const fileIgnore = ['package.json', '_gitignore'];

fsExtra.copySync(templateDir, targetDir, {
  filter: (src, dest) => {
    return !fileIgnore.find(
      (f) => f === `${path.parse(src).name}${path.parse(src).ext}`
    );
  },
});
```
### 2.2 文本文件拷贝：
`_gitignore`文件需要再输出时进行重命名操作，但没有找到可以直接实现重命名的函数，所以就通过分别读写两步实现。普通文本文件使用`fs-extra`模块中的`readFileSync`读取，在输出到新文件名的文件中~
```javascript
const gitignoreInfo = fsExtra.readFileSync(
  path.resolve(templateDir, "_gitignore")
);
fsExtra.outputFile(path.join(root, ".gitignore"), gitignoreInfo);
```
### 2.3 JSON 文件拷贝：
`package.json` 读取后我们需要重写内容后再输出，`fs-extra`模块中的`readJsonSync`函数可以直接读取为 JSON 对象，我们在修改对象后再次通过`outputJSONSync`输出 JSON 对象即可，在`outputJSONSync`提供的选项中指定`spaces=2`输出非在一行的 JSON 文件~
```javascript
const pkg = fsExtra.readJsonSync(path.resolve(templateDir, "package.json"));
pkg.name = packageName || getProjectName();
fsExtra.outputJSONSync(path.join(root, "package.json"), pkg, {
  spaces: 2,
});
```
## 3. 总结
"yarn create tlist"的主要逻辑除去参数的收集以外就是模板的拷贝两块了，这里通过利用`fs-extra`实现了模板拷贝，`fs-extra`函数的支持还是挺不错的，拷贝文件还考虑到了支持过滤的功能，挺不错~

> 本文项目已推送至GitHub，欢迎克隆演示：`git clone git@github.com:OSpoon/create-tlist.git`