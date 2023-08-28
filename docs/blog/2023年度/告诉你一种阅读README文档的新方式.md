# 告诉你一种阅读README文档的新方式

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

最近在[开发教程集合](https://document.it200.cn/#/)的首页设置成了 **Markmap** 的风格，我可以在首页查看开发教程的完整大纲，还可以通过每个节点快速跳转到对应的章节，下图就是首页 **Markmap** 部分。

![开发教程集合首页](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202308222235624.png)

在[开发教程集合](https://document.it200.cn/#/)的影响下，我发现这可能对于阅读开源项目的 **README** 文档来说是个不错的体验，因为一些长期维护的开源项目的 **README** 文档的内容是很多的，在小小的屏幕中翻找起来也是很费劲的。比如你想在 [rollup-awesome](https://github.com/rollup/awesome) 查找一个合适的 **Plugin** ，但你不是很清楚 **Rollup** 现在提供了哪些 **Plugin** ，那你应该会通过搜索 [rollup-awesome](https://github.com/rollup/awesome) 的 **README** 文档或者快速浏览来寻找你可能需要的 **Plugin**。

基于阅读 **README** 文档的困难，我在 [Vercel](https://vercel.com/) 部署了一个 [PMM](https://github.com/ospoon/pmm) 的前端项目，通过将需要阅读的开源项目的 `username` 和 `resp` 提供给 **PMM**，**PMM** 就会将 **README** 文档的内容渲染成 **Markmap** 的风格。为了方便阅读，在 [PMM](https://github.com/ospoon/pmm) 中提供了一份用在油猴插件上的脚本，将一个快捷菜单添加到开源项目主页。现在的 [rollup-awesome](https://pmm-rust.vercel.app/?username=rollup&resp=awesome) 将渲染成了下图的 **Markmap** 的风格，同时你清晰的看到了 [rollup-awesome](https://pmm-rust.vercel.app/?username=rollup&resp=awesome) 提供了 **12** 类 **Plugin** 的支持。

![rollup-awesome-markmap](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202308222306003.png)

## PMM 项目分析

**PMM** 全称 **Preview Mark Map**，目的就是要将一份规范的开源项目的 **README** 文档渲染成 **Markmap** 风格。完成 **PMM** 项目需要做下面的两项工作：

1. 获取开源项目的 **README** 文档；
2. 解析并渲染 **README** 文档为 **Markmap** 风格；

### 获取开源项目的 **README** 文档

下面是 **rollup** 提供的 **awesome** 项目的 **README** 文档的访问地址，通过这个地址可以获取完整的 **README** 文档的文本内容，这个地址中只有 **rollup** 和 **awesome** 是变量，**rollup** 指定的是 **username** ，**awesome** 指的是 **resp**。

```
https://raw.githubusercontent.com/rollup/awesome/master/README.md
```

所以我只需要拿到一个开源项目的 username 和 resp 就可以构建一个 GET 请求来获取 README 文档的文本内容，到目前我搞清楚了如何获取到开源项目的 **README** 文档。所以在 [PMM](https://github.com/ospoon/pmm) 项目提供了一个 `loadGithubMarkdown(username, resp)` 函数来加载指定开源项目的 **README** 文档。

```javascript
export const loadGithubMarkdown = (username: string, resp: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(`https://raw.githubusercontent.com/${username}/${resp}/master/README.md`)
      .then((response) => response.text())
      .then((text) => resolve(text))
      .catch((error) => reject(error))
  })
}
```

### 解析 **README** 文档

解析 **README** 文档的目的是要获取 **Markmap** 的源数据，这里需要用到一个开源的模块 `markmap-lib` ，通过 `markmap-lib` 模块导入一个 **Transformer** 对象并进行实例化，再调用 **Transformer** 实例提供的 `transform(md)` 函数就可以完成 **README** 文档的解析。

```javascript
import { Transformer } from 'markmap-lib'
import type { ITransformResult } from 'markmap-lib'

export const transform = (
  svg: string | SVGElement,
  makrdownContent: string,
  jsonOptions?: IMarkmapJSONOptions | undefined
): Markmap => {
  const transformer: Transformer = new Transformer()
  const transformResult: ITransformResult = transformer.transform(makrdownContent)
}
```

### 渲染为 **Markmap** 风格

渲染为 **Markmap** 风格同样需要一个开源模块 `markmap-view` 的支持，需要从 `markmap-view` 模块导入 `Markmap` 对象，`Markmap` 对象提供的静态函数 `create(el, options, data)` ，可以一步将解析的数据渲染到页面。

```javascript
import { Transformer } from 'markmap-lib'
import type { ITransformResult } from 'markmap-lib'
import { Markmap, deriveOptions } from 'markmap-view'
import type { IMarkmapJSONOptions } from 'markmap-common'

export const transform = (
  svg: string | SVGElement,
  makrdownContent: string,
  jsonOptions?: IMarkmapJSONOptions | undefined
): Markmap => {
  const transformer: Transformer = new Transformer()
  const transformResult: ITransformResult = transformer.transform(makrdownContent)
  const markmapOptions = deriveOptions(jsonOptions)
  return Markmap.create(svg, markmapOptions, transformResult.root)
}
```

PS：封装的 `transform()` 函数提供了 `Markmap.create()` 相同的选项，便于在使用时进行配置微调。

### 在 App 组件完成函数的调用

在 **App** 组件中要做这么几件事情：
1. 解析 `window.location` 得到 `username` 和 `resp`；
2. 调用 `loadGithubMarkdown` 获取文本内容；
3. 调用 `transform` 解析并渲染 **Markmap**；

```javascript
export const parseQueryParams = (paramContent: string) => {
  const params = paramContent
    .slice(1)
    .split('&')
    .map((v) => {
      const [key, value] = v.split('=')
      return {
        [key]: value
      }
    })
  const result = params.reduce((preValue, currentValue) => {
    const key = Object.keys(currentValue)[0]
    const value = currentValue[key]
    preValue[key] = value
    return preValue
  }, {})
  return result
}
```

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { loadGithubMarkdown, transform, setToolbar, parseQueryParams } from './tool/pmm'

onMounted(async () => {
  const { username, resp } = parseQueryParams(window.location.search)
  const markdownContent = await loadGithubMarkdown(username, resp)
  const mm = transform('#markmap', markdownContent, {
    initialExpandLevel: 2
  })
  setToolbar('app', mm)
})
</script>

<template>
  <svg id="markmap"></svg>
</template>
```

### 提供便捷体验（1）

**Markmap** 默认支持拖拽和缩放，这对于在一般尺寸的屏幕上使用起来还是会有些不便，所以提供了固定在右下角的 **Toolbar** ，**Toolbar** 功能的实现依赖 `markmap-toolbar` 模块，下面是设置 **Toolbar** 的函数。

```javascript
export const setToolbar = (app: string, markmap: Markmap) => {
  const toolbar: Toolbar = Toolbar.create(markmap)
  toolbar.setBrand(false)
  document.querySelector(`#${app}`)?.append(toolbar?.el)
}
```

当然元素的位置需要你设置一小段 **CSS**：

```css
.mm-toolbar {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
}
```

### 提供便捷体验（2）

经过上面的步骤 [PMM](https://github.com/ospoon/pmm) 项目就可以构建部署了，[Vercel](https://vercel.com/) 对于部署这样的项目来说或许是一个不错的选择。

当目前为止，你就可以将想要查看的开源项目的 `username` 和 `resp` 拼接成一个 **PMM** 项目分析中所述的地址就可以阅读 **Markmap** 风格的文档了。

如果你使用过油猴插件，那么通过使用我编写的 **JavaScript** 脚本为你所浏览的开源项目主页插入一个 **PreviewMarkmap** 菜单就可以跳过手动拼接访问地址的步骤。

```javascript
// ==UserScript==
// @name         Preview Mark Map
// @namespace    https://github.com/
// @version      0.1
// @description  添加 PreviewMarkMap 菜单到Github项目的README.md后。
// @author       小鑫同学
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const rootUrl = 'https://pmm-rust.vercel.app';
    const titleBox = document.querySelector('#readme h2.Box-title');
    const [ username, resp ] = window.location.pathname.slice(1).split('/');
    const pmm = document.createElement('a');
    pmm.id = 'previewMarkmap';
    pmm.textContent = "PreviewMarkmap";
    pmm.target = "_blank";
    pmm.style.marginLeft = '10px';
    pmm.href = `${rootUrl}?username=${username}&resp=${resp}`;
    titleBox.appendChild(pmm);
})();
```

## PMM 项目体验

* 访问：https://pmm-rust.vercel.app/?username=vuejs&resp=awesome-vue

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202308221743165.png)

* 访问：https://pmm-rust.vercel.app/?username=vitejs&resp=awesome-vite

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202308221743075.png)

* 访问：https://pmm-rust.vercel.app/?username=rollup&resp=awesome

![](https://temp-files-20221205.oss-cn-hangzhou.aliyuncs.com/picgo/202308221743802.png)

## PMM 项目总结

对我来说 [PMM](https://github.com/ospoon/pmm) 项目通过改变传统的 **README** 文档的阅读方式使得我可以更加方便的对整个开源项目有个结构化的了解，对于 **README** 文档内容的查找也提供了便利，[PMM](https://github.com/ospoon/pmm) 项目目前来说还只是第一个版本的验证，对于规范的 **README** 文档渲染 **Markmap** 效果良好，但依旧会存在一些未知的问题，对于油猴插件在不生效的情况下还请刷新页面，有熟悉油猴插件编写的小伙伴可以提供一个靠谱的脚本。




