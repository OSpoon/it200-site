---
title: 🧩 Vue 深入组件开发☞#异步组件#
date: '2022-06-14 21:15'
sidebar: 'auto'
categories:
 - Vue
tags:
 - Component
 - Asynchronous
---

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

:::tip
在前端开发中提到按需加载我们通常指的是路由配置的时候通过 webpack 提供的 import 函数来异步加载页面级别的组件，当路由被实际访问的时候才去加载对应组件的资源。但随着页面组件内部的模块划分增加，要想保持优秀的页面加载效率我们不得不考虑页面组件内部进行按需加载，那么在 Vue 中defineAsyncComponent()方法为我们提供了这样的能力。
:::

<!-- more -->

## 1. 前言
------

大家好，我是[小鑫同学](https://it200.cn/ "https://it200.cn/")。一位从事过**Android开发**、**混合开发**，现在长期从事**前端开发**的编程爱好者，**我觉得在编程之路上最重要的是知识的分享，所谓三人行必有我师**。所以我开始在社区持续输出我所了解到、学习到、工作中遇到的各种编程知识，欢迎有想法、有同感的伙伴加我[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")微信交流~

## 写作背景：

在前端开发中提到按需加载我们通常指的是路由配置的时候通过 **webpack** 提供的 **import** 函数来异步加载页面级别的组件，当路由被实际访问的时候才去加载对应组件的资源。但随着页面组件内部的模块划分增加，要想保持优秀的页面加载效率我们不得不考虑页面组件内部进行按需加载，那么在 **Vue** 中`defineAsyncComponent()`方法为我们提供了这样的能力。

## API 示例：

### 实现异步组件加载：

```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

### 添加加载&错误状态：

```
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

## 按需异步组件实验案例：

### 演示项目结构

下面是这次实验项目的组件结构，在 **App** 组件中依次导入 **TitleComp**、**BannerComp**、**NoticeComp**、**FavoriteListComp**，在 **App** 预览模式下可以看到页面已经被撑满了一屏，我们还有一个 **TodoListComp** 组件因为内部存在很多的**资源**、**子组件**，所以考虑在不需要与它**发生交互**的时候就不要加载相关资源。

```
├─App.vue
├─env.d.ts
├─main.ts
├─useLazyComp.js
├─components
|     ├─BannerComp.vue      
|     ├─FavoriteListComp.vue
|     ├─NoticeComp.vue      
|     ├─TitleComp.vue       
|     ├─TodoListComp.vue    
|     ├─forge
|     |   ├─CompOne.vue     
|     |   ├─CompThree.vue   
|     |   └─CompTwo.vue      
|     ├─common
|     |   ├─ErrorComp.vue   
|     |   └─LoadingComp.vue  
├─assets
|   └─logo.png
```

### 封装useLazyComp函数：

使用组合式函数来封装一个公用的异步加载组件工具，入参需要提供包裹 **TodoListComp** 的容器 **target** 和 组件实际导入的 **Uri**，出参需要提供需要展示的**控制标识**和异步导入的**组件对象**。

1.  **defineAsyncComponent**：实现组件异步加载；
1.  **useIntersectionObserver**：监听指定DOM是否出现在视口；

```
import { ref, defineAsyncComponent } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import ErrorComp from './components/common/ErrorComp.vue';
import LoadingComp from './components/common/LoadingComp.vue';

export function useLazyComp(target, compUri) {
    const isVisible = ref(false);

    const AsyncComp = defineAsyncComponent({
        loader: () => import(/*@vite-ignore*/ compUri),
        delay: 200,
        timeout: 15 * 1000,
        loadingComponent: LoadingComp,
        errorComponent: ErrorComp,
    });

    const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
        if (isIntersecting) {
            stop(); // 当dom出现后目的达成，停止监听并修改isVisible为可展示状态
            isVisible.value = isIntersecting;
        }
    });

    return { isVisible, AsyncComp };
}
```

### 使用useLazyComp函数：

在 **App** 中使用 **useLazyComp** 实现 **TodoListComp** 按需异步加载，因为导出的组件名都是 **AsyncComp**，所以在对象解构的时候进行重命名操作，方便在 **template** 使用：

```
<script setup lang="ts">
// 同步加载的组件
import TitleComp from "./components/TitleComp.vue";
import BannerComp from "./components/BannerComp.vue";
import NoticeComp from "./components/NoticeComp.vue";
import FavoriteListComp from "./components/FavoriteListComp.vue";

import { ref } from "vue";
import { useLazyComp } from "./useLazyComp.js";

const todoListRef = ref(null);
// TODO 调用useLazyComp函数按需加载TodoListComp组件
const { isVisible, AsyncComp: AsyncTodoListComp } = useLazyComp(
  todoListRef,
  "./components/TodoListComp.vue"
);
</script>

<template>
  <TitleComp />
  <BannerComp />
  <NoticeComp />
  <FavoriteListComp />
  <div ref="todoListRef">
    <AsyncTodoListComp v-if="isVisible" />
  </div>
</template>
```

完整示例代码：<https://stackblitz.com/edit/vitejs-vite-9qberl?file=README.md>

## 结语：

在 VueUse 中提供了很多实用的工具函数，有关于浏览器、传感器、动画、状态、等等，我们可以选择使用，在本次的案例中就使用了`useIntersectionObserver()`来实现 DOM 出现在视口的监听，强烈推荐~

* * *

**如果看完觉得有收获，欢迎点赞、评论、分享支持一下。你的支持和肯定，是我坚持写作的动力~**

最后可以关注我@小鑫同学。欢迎[点此扫码加我微信](https://it200.cn/ "https://it200.cn/")[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")交流，共同进步（还可以帮你**fix**🐛）~