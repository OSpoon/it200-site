# 在实践中学习类型定义、类型覆盖、CSS Modules

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

在做一些新的项目时考虑使用 Vite、Vuejs、Less、TypeScript 这些依赖库的构建项目基础，在编写组件时使用 TSX 来获得更好的类型体验，其中在 Less 模块的使用遇到了一个很好解决但初次遇到感觉又无从下手的坑，看我是怎么陷进去的~

## 1. 搭建一个基础项目，准备复现

1. 使用npm、yarn 或 pnpm 拉取一份 Vite 仓库最新的 Vue+Ts 的项目模板（如：`npm create vite`）；
2. 安装`@vitejs/plugin-vue-jsx`，并配置插件到 `vite.config.ts`;

```jsx
...
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [
		..., 
		vueJsx()
	],
});
```

1. 删除原 App.vue 的内容，并替换为下面这段最简单的 TSX 组件代码，注意一并修改 main.ts 中的 App 组件导入：

```jsx
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    return () => <div>TSX Component</div>;
  },
});
```

```jsx
import { createApp } from 'vue'
import './style.css'

// 省略源代码中的.vue后缀
import App from './App'

createApp(App).mount('#app')
```

1. 安装 Less 依赖并增加一个使用 less 定义的样式类：

```jsx
// 1. pnpm i -D less

// 2. index.less
.container {
    width: 400px;
    height: 280px;
    background: #ccc;
}
```

```jsx
import { defineComponent } from "vue";

// 导入 less 样式类
import './index.less';

export default defineComponent({
  name: "App",
  setup() {
    return () => <div class="container">TSX Component</div>;
  },
});
```

## 2. 类型识别错误&正确识别

上面是导入 less 模块的其中一种方式，我们通常还会使用另外一种 CSS Module 的方式，代码如下：

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281556945.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281556945.png)

在 VSCode 中会发现在第 7 行出现了错误提示：`类型“string”上不存在属性“container”。ts(2339)`，可以看到这个 less 模块被识别成了字符串类型，那当然是不可以的，不能满足【对象.属性】的使用形式；

### 2.1 类似问题：

在不使用 Vite 脚手架而选择直接创建这样的项目的时候你可能就遇到了 TypeScript 其实是不认识什么是`.vue`组件的，在导入的时候就会告诉你“`无法找到模块“./components/xxx.vue”的声明文件。”`

为了识别`.vue`组件，就需要用到下面这段代码来告诉 TypeScript 如何对待这样的文件；

```jsx
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

Less 模块也不是 TypeScript 可以识别的类型，那么势必存在通知 TypeScript 识别`.less`模块的一段声明代码；

### 2.2 第一次尝试百度检索：

通过百度检索 TSX、Less、模块类型等关键词你会得到解决这个问题的第一步，那就是尝试自己定义一段识别 `.less` 模块的代码：

```jsx
declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}
```

当我尝试将这段代码放到`vite-env.d.ts`文件中（`.vue`就在这儿定义的）时却没有得到我预期的结果，但是明明类型错误的提示有 ts 发出，Vue文件也是这样识别的，那为啥 Less 模块会识别错误呢？检索的关键词不应该有错误的~

### 2.3 在源码中查找线索：

尝试在查看导入的 less 模块的定义文件是你会看到如下的截图，在 vite 源码中已经预先定义了识别 less 模块的代码，在`node_modules/vite/client.d.ts`：

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281559365.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281559365.png)

```jsx
declare module '*.less' {
  const css: string
  export default css
}
```

怪不得一开始居然只是识别错了类型而不是不认识 less 模块，原来 Vite 已经都定义好了一套基础的声明文件，那现在就需要搞清楚我们新写的那段代码为啥没有生效了~

### 2.4 在 Vite 官网找到了不生效的原因

[https://cn.vitejs.dev/guide/features.html#typescript](https://cn.vitejs.dev/guide/features.html#typescript)

通过下面的介绍我们可以知道，如果你要是定义一个新的类型的声明可以在三斜线注释的下面继续编写，但是你要覆盖*`vite/client`*中已经定义过的就需要再三斜线上面编写了；

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281600863.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281600863.png)

在调整了less 模块类型声明的位置后，类型识别错误的现象就已经解决了，但是 less 模块并没有得到解析，页面也没有渲染出该有的样式。

> 小结：在第二节中通过发现 less 模块类型识别的错误联想到了 Ts 识别 vue 模块需要做类型的声明定义，并通过百度检索得到了一份 less 模块类型声明的代码片段，再 Vite 文档的支持下成功覆盖掉默认声明的类型，至此这个知识点就告一段落，接着就是让 less 模块在 CSS Module 形式下正式生效。
> 

## 3. 如何正确使用CSS modules

在 Vite 文档中其实描述了我们应该如何来使用 CSS modules，在 Vite 内部已经进行了适配，我们只需要按照固定的规则命名并安装对应的预处理器即可；

[https://cn.vitejs.dev/guide/features.html#css](https://cn.vitejs.dev/guide/features.html#css)

1. 修改 `style.less`文件名为 `style.module.less`；
2. 去除`vite-env.d.ts`文件中关于`.less`的声明（不再需要覆盖）；

再次回到`client.d.ts`文件发现，Vite 其实已经定义过了，只是我们一开始的命名规则匹配到了**Pure Css Chunk** ；

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281602804.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281602804.png)

## 4. 两个不怎么成功的尝试

### 4.1 尝试更改 CSS Modules 文件命名格式：

在源码中找到了下面这块代码，内部使用正则来确定了如何识别一块 CSS 为模块或非模块，但是我并没有找到可以通过选项来控制这块逻辑的变化：

```jsx
// css.ts

const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)($|\\?)`
const cssLangRE = new RegExp(cssLangs)
const cssModuleRE = new RegExp(`\\.module${cssLangs}`)
const commonjsProxyRE = /\?commonjs-proxy/

export const isCSSRequest = (request: string): boolean =>
  cssLangRE.test(request)

...

async renderChunk(code, chunk, opts) {
    let chunkCSS = ''
    let isPureCssChunk = true
    const ids = Object.keys(chunk.modules)
    for (const id of ids) {
      if (
        !isCSSRequest(id) ||     // false
        cssModuleRE.test(id) ||  // false 
        commonjsProxyRE.test(id) // false
      ) {
        isPureCssChunk = false
      }
      if (styles.has(id)) {
        chunkCSS += styles.get(id)
      }
    }
	...
}
```

在 Vitejs 插件的仓库，你会发现一个可以安装插件来使用 CSS Modules 命名自由，不过还是不要随意打破这个公共约定吧~

### 4.2 一个不融洽的 Ts Server Plugin：

`typescript-plugin-css-modules`是一个可以在编写 CSS Modules 代码时得到更好的代码提示插件Ts Server，下面的这张图可以说明一切；

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281602141.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281602141.png)

使用这个插件需要两步操作：

1. 配置插件到 `tsconfig.json`：

```json
{
  "compilerOptions": {
    ...
    "plugins": [{ "name": "typescript-plugin-css-modules" }]
  }
}
```

1. 配置插件到 Ts Server：

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281603568.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281603568.png)

但是由于一些插件相互干扰的原因，你可能在 Vue 项目中不能很好的使用到这个插件：

1. Volar 作为 Vuejs 目前组要推荐的编码插件，在插件文档要推荐使用接管模式来使用 Volar 而不是再去安装另外一个插件，启用接管模式就必须要关闭掉****JavaScript 和 TypeScript 的语言功能****插件，那么就没办法做上面第二步的配置；
2. 关闭接管模式的情况，我们就需要安装****TypeScript Vue Plugin (Volar)****插件获得更多的编码支持，但是由于 Volar 的Ts 服务没有加载 `tsconfig.json` 中的插件，所以配置后也不会生效；

如果想使用`typescript-plugin-css-modules`插件来得到编写 CSS 时的代码提示，我现在只能是：

1. 停止使用 Volar 的接管模式；
2. 禁用 ****TypeScript Vue Plugin (Volar)**** 插件；

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281604473.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281604473.png)

![https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281605847.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202211281605847.png)

## 总结：

通过一个简单的案例来讲述了模块类型定义和覆盖的方式，并找到了正确使用 CSS Modules 的方法，虽然在最后尝试去除`.module` 和融合`typescript-plugin-css-modules`插件时选择了放弃，在过度的探索中可能会出现更多的坑，会陷得更深，所以我选择适可而止了。