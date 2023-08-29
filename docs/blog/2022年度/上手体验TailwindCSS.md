# 上手体验TailwindCSS

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

     在热火朝天的前端框架演进的进程中，大多数的人都把目光关注到了 JavaScript / TypeScript 的身上，TailwindCSS作为最有争议但也是最受欢迎的一个 CSS 框架的产品我们也来看一下它到底好不好用，有什么优势~

### 快速开始：

#### 创建 vite + vue-ts 项目：

```
yarn create vite

```

#### 安装 Tailwind CSS 依赖：

```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

```

#### 生成 tailwind 和 postcss 配置文件：

```
npx tailwindcss init -p

```

**tailwindcss 3.x 版本的配置文件：**

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {},
    container: {
      center: true,
    }
  },
  plugins: [],
}

```

#### 在全局样式文件中导入tailwind

src\\styles\\index.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;

```

src\\styles\\index.scss

```
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

```

**全局样式文件在main.ts中导入：**

```
import { createApp } from 'vue'
import App from './App.vue'

// 导入全局样式文件
import './styles/index.scss'

createApp(App).mount('#app')

```

#### 安装VSCode插件

1.  [Tailwind CSS IntelliSense](https://link.juejin.cn/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dbradlc.vscode-tailwindcss "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss")支持自动完成、语法高亮、悬停预览、语法分析功能。
2.  [PostCSS Language Support](https://link.juejin.cn/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dcsstools.postcss "https://marketplace.visualstudio.com/items?itemName=csstools.postcss")支持css未知规则如tailwind中的 `@tailwind`、`@apply`、`@screen`。

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290911227.png)

3.  在`.vue`、.`html`文件中使用`@apply`仍提示未知规则，建议在已安装以上插件后再添加工作区配置禁止掉这个提示：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290911745.png)

```
{
    "css.lint.unknownAtRules": "ignore"
}

```

#### 安装 cssnano 压缩 css：

```
yarn add -D cssnano

```

**配置插件：**

```
module.exports = {
  plugins: {
    // 其他插件

    // cssnano 按需加到插件列表末尾
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}

```

### 浏览器支持状况：

     在Chrome、Firefox、Edge 和 Safari 的最新稳定版本适配良好，但由于部分API不支持IE全部版本，所以强烈不建议在IE浏览器使用。

### 核心概念

#### 功能类优先

在一组受约束的原始功能类的基础上构建复杂的组件。

##### 使用Tailwind内置的功能类来实现下图的卡片样式：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290911798.png)

1.  实现基础元素准备：

```
<!-- 设置flex布局、交叉轴对齐方式、背景色、圆角、阴影、内边距、子元素间距、最大宽度、水平居中 -->
<div class="">
    <!-- flex布局时禁止收缩 -->
    <div class="">
        <!-- 设置图像的宽度、高度 -->
        <img class="" src="./assets/logo.png" alt="" />
    </div>
    <!-- flex布局时禁止收缩 -->
    <div class="">
        <!-- 设置字体大小、权重、颜色 -->
        <div class="">ChitChat</div>
        <!-- 设置字体颜色 -->
        <p class="">You have a new messaeg!</p>
    </div>
</div>

```

2.  根据注释添加对应的内置功能类：

```
<div class="flex items-center bg-white rounded-xl shadow-md p-6 space-x-4 max-w-sm mx-auto">
    <div class="flex-shrink-0">
        <img class="w-12 h-12" src="./assets/logo.png" alt="" />
    </div>
    <div class="flex-shrink-0">
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-500">You have a new messaeg!</p>
    </div>
</div>

```

##### 使用Tailwind的优势：

1.  省去了以外为了定义 class 名称带来的烦恼；
2.  省去了重复定义 css 造成的样式文件增大；
3.  避免了 css 修改造成了未知样式错乱带来问题；

##### 与传统内联样式相比的优势：

1.  实现的 UI 全部基于一套预定义功能类实现，UI 更加一致；
2.  使用内置的功能类可以轻松实现内联样式无法实现的响应式布局和元素状态等。

##### 提高可维护性的办法：

     从上面的例子可以看出，使用 Tailwind 后代码的风格趋于内联样式的编写，也带来的阅读的烦恼，解决这样的问题提供了下面两个常用的方法：

1.  抽取相同、类似的布局为公共组件、模板，提高复用性；
2.  对于没有必要或不应该提取为组件的简单元素，可以使用@apply抽象CSS类，就跟我们以前编写 class 一样来组合 Tailwind 功能类；

#### 响应式设计

     下面的两张设计图是在不同浏览器尺寸的下分别应该显示的样式，在 Tailwind 中提倡移动端优先的理念，我们应该使用不带任何断点的功能类来实现移动端应该显示的风格，在浏览器尺寸变化到下一个断点的时候来调整为 PC 端显示的布局。

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290912798.png)

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290912165.png)

##### 内置断点：

| **断点前缀** | **最小宽度** | **CSS** |
| --- | --- | --- |
| sm | 640px | @media (min-width: 640px) { ... } |
| md | 768px | @media (min-width: 768px) { ... } |
| lg | 1024px | @media (min-width: 1024px) { ... } |
| xl | 1280px | @media (min-width: 1280px) { ... } |
| 2xl | 1536px | @media (min-width: 1536px) { ... } |

##### 响应式布局实现：

下面的代码注释和 clss 设置的功能类相对应：

```
<!-- 移动端优先设置：最大宽度、容器居中、背景色、圆角、阴影 -->
<!-- MD断点处改变：最大宽度 -->
<div class="max-w-md mx-auto bg-yellow-50 rounded-xl shadow-md md:max-w-2xl">
  <!-- 移动端优先默认设置 -->
  <!-- MD断点处改变：flex布局 -->
  <div class="md:flex">
    <!-- 移动端优先默认设置 -->
    <!-- MD断点处改变：禁止布局收缩 -->
    <div class="md:flex-shrink-0">
      <!-- 移动端优先设置：固定高度、100%宽度、原比例裁剪、顶部圆角 -->
      <!-- MD断点处改变：100%高度、固定宽度、取消顶部圆角、设置左边圆角 -->
      <img
           class="h-48 w-full object-cover md:h-full md:w-48 rounded-t-xl md:rounded-t-none md:rounded-l-xl"
           src="https://images.unsplash.com/photo-1637734433731-621aca1c8cb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=404&q=80"
           alt="Man looking at item at a store"
           />
    </div>
    <!-- 设置：容器内边距 -->
    <div class="p-8">
      <!-- 设置：字体大小、间距、权重、颜色 -->
      <div class="text-sm tracking-wide font-semibold text-indigo-500">Case Study</div>
      <!-- 设置：块元素、顶部外边距、字体大小、权重、颜色 -->
      <a class="block mt-1 text-lg font-medium text-black" href="#">
        Finding customers for your new business
      </a>
      <!-- 设置：顶部外边距、字体颜色 -->
      <p class="mt-2 text-slate-500">
        Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to
        find your first customers.
      </p>
    </div>
  </div>
</div>

```

##### 添加自定义断点：

自定义的断点可能更加符合自己项目的使用习惯，用新定义的替换到默认的断点前缀即可：

```
/** tailwind.config.js */
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    }
}

```

### 总结：

     一开始使用 TailwindCSS 确实会有一些别扭，但是当我们在开发一些无法使用 UI 库的项目是就不得不面临编写大量 css 文件，还得考虑响应式布局，黑暗模式等等，但是这些对于 TailwindCSS 来说将是简单的，TailwindCSS 的下载量也决定了它也是绝对受欢迎的一个产品。
