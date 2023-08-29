# 搞一搞明白Vitepress的文档渲染基础

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

**Vitepress**的文档渲染目的就是将程序员日常所写的**Markdown**文件编译为**Html**文件，并添加了更多的插件来丰富**MD**文件的功能，就比如说**Vuejs**组件在**MD**文件中渲染等等，为了我们可以在使用**Vitepress**的时候可以更随心所欲的定制一些功能，我们要先搞一搞明白**Vitepress**是如何将**MD**文档渲染成**HTML**的~
### 看完可以明白这3点？

- [x] MD文档转HTML文档流程；
- [x] 如何支持代码块高亮；
- [x] 如何实现自定义容器；

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290938725.png)
[演示地址](https://www.awesomescreenshot.com/video/11781022?key=2451152c019ed7ecb5aa1dcacff7bd4b)
## 2. 实现MD文档转HTML文档
### 2.1 请按如下项目结构准备我们的实验环境~
```
├─markdown-it-demo
│  ├─src
│  │  ├─index.ts
│  │  ├─temp.md
│  ├─index.html
└─ └─package.json
```
### 2.2 利用markdown-it模块实现文档转换：
> markdown-it 是目前比较通用的MD语法解析模块，快速且易于扩展，遵循COmmonMark规范，且有大量的社区插件~

1. 执行安装模块命令：`pnpm i markdown-it @types/markdown-it -D`；
2. 导入`markdown-it`模块并实例化**md**对象；
```typescript
import markdownIt from "markdown-it";

// 实例化md-it对象
const md = new markdownIt();
```

3. 通过`fs-extra`模块读取放置在`src`下的`temp.md`文件，读取后的**Buffer**数组通过`toString()`转为字符串；
```typescript
const rawMd = fs.readFileSync(path.resolve(__dirname, "temp.md")).toString();
```

4. 利用**md**对象的`render`函数来讲`rawMd`进行转换；
```typescript
const output = md.render(rawMd);
```

5. 转换完成后将`output`内容输出到`index.html`文件中；
```typescript
fs.writeFileSync(path.resolve(__dirname, "../index.html"), `
${output}
`);
```

6. 在转换完成后可以利用`child_process.exec(root-path)`自动在浏览器打开index.html文档；
## 3. 实现MD支持代码块高亮
> 代码块高亮所使用的模块时**highlight.js**，该模块同时内置了很多常见的代码块样式文件可供选择~

### 3.1 第一步改造markdownIt对象的构造函数：
`highlight`属性配置的函数传入**code片段**和**代码方言**两部分，通过在**hljs**库中查找对应的**方言**来利用**hljs**库实现代码的快速高亮，当无法查找到对应的**方言**时将返回仅仅转义后的**html**片段~
```typescript
const md = new markdownIt({
    highlight: (str: string, lang: string) => {
        const defaultCode: string = `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
            } catch (__) {
                return defaultCode;
            }
        }
        return defaultCode;
    }
});
```
### 3.2 第二部整合output内容和高亮样式文本：
第一步的操作仅仅完成了由**code片段**到**html**结构的转换，但是完成高亮还需要**样式**配合渲染，我们这里可以通过在输出**output**内容到**index.html**时将**hljs**中喜欢的样式文档路径传入到**html**文件来加载~
```typescript
const output = md.render(rawMd);
const styles = `
<link rel="stylesheet" href="./node_modules/highlight.js/styles/a11y-dark.css">
`;
// 输出html文本
fs.writeFileSync(path.resolve(__dirname, "../index.html"), `
${styles}
${output}
`);
```
更多的样式文档可以在`./node_modules/highlight.js/styles`选择~
## 4. 实现MD支持自定义容器
> 自定义容器是MD文档默认并不支持的一种语法，在Vuejs的文档有很多的应用，实现自定义容易需要用到`markdown-it-container`模块~

1. `markdownIt`通过插件的形式利用`markdown-it-container`来实现自定义容器，通过配置`validate`来做渲染前的语法校验，通过`render`函数来组中容器部分的`HTML`结构~
```
::: warning
*here be dragons*
:::

↓↓↓↓↓↓↓↓↓↓转换为↓↓↓↓↓↓↓↓↓↓

<div class="warning">
<em>here be dragons</em>
</div>
```
```typescript
md.use(require("markdown-it-container"), "warning", {
    validate: (params: string) => {
        return params.trim().match(/^warning+(.*)$/m);
    },
    render: (tokens: Array<Token>, idx: number) => {
        const m = tokens[idx].info.trim().match(/^warning+(.*)$/m);
        if (tokens[idx].nesting === 1) {
            return `<div class="warning">${md.utils.escapeHtml(m ? m[1] : '')}`
        } else {
            return '</div>\n';
        }
    }
})
```
提示：通过`tokens[idx]`取到的数据如下图所示~
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290939092.png)

2. 上面的处理依旧是**MD**到**HTML**结构的转换，在自定义容器的时候我们预留的**css**名称，我们还是需要在输出`index.html`文件的时候自定义样式文档~
```typescript
const output = md.render(rawMd);
const styles = `
<link rel="stylesheet" href="./node_modules/highlight.js/styles/a11y-dark.css">
<style>
    .warning{
        margin: 28px 0;
        padding: 10px 14px 4px 22px;
        border-radius: 8px;
        overflow-x: auto;
        transition: color .5s,background-color .5s;
        position: relative;
        font-size: 14px;
        line-height: 1.6;
        font-weight: 500;
        color: #0000008c;
        background-color: #f9f9f9;
        border: 1px solid #ffc517;
    }
    .hljs {
        padding: 5px 8px;
        border-radius: 5px;
    }
</style>
`;
// 输出html文本
fs.writeFileSync(path.resolve(__dirname, "../index.html"), `
${styles}
${output}
`);
```
## 5. 总结
通过使用`markdown-it`、`highlight.js`、`markdown-it-container`模块实现了**Markdown**到**HTML**的文档转换，代码块高亮和自定义容器，**VItepress**搭建的组件库文档中的组件渲染和源码展示功能就需要用到自定义容器的解析和组装自定义的**Vue**组件实现高级功能~
> 本文项目已推送至GitHub，欢迎克隆演示：`git clone [https://github.com/OSpoon/awesome-examples.git](https://github.com/OSpoon/awesome-examples.git)`