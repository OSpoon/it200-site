# 🧩 Vue 深入组件开发☞#依赖注入#

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

## 学习内容：

-   依赖注入的使用方式；
-   依赖注入的类型约束；
-   避免响应式数据被随意更改；
-   Symbol对象的应用场景。

## 依赖注入：

当我们的组件只需要子父组件之间传递数据的时候我们可以通过 Props 来满足，这个是没有任何问题的。你可以看到下面这个示意图，当我们的组件出现的层级大于 2 以后，也就是我们常说的爷孙组件之间的数据传递，但是在中间的组件也需要提供支持才能满足数据的顺利传输，当中间的组件层级增多就需要维护更多的与其不是特别关注的内容。为了解决这样的应用场景所以提供了依赖注入的模式。



![props-v1.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291022695.gif)

下面的这张图解释了我们可以在 Root 组件通过 provide 来注入数据，在 DeepChild 组件中通过 Inject 来注入对应的 key，就可以将数据顺利的从 Root 传递到 DeepChild。

![props-v2.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291023358.gif)

## 使用 Provide 定义数据：

在组合式 API 中使用 provide() 函数来在 Root 组件定义需要给后代组件提供的数据，provide 的参数1 可以是一个字符串或者是一个 Symbol 对象（后面会说），参数 2 可以是任意类型的数据包括响应式的对象：



在下面的代码中提供了 message 为 key，text 为内容的数据给后代组件：

```
<script setup lang="ts">
import { ref, provide } from "vue";
import Container from "./components/Container.vue";

const text = ref("hello");
// TODO 通过provide函数提供一个 Key 为 message,value 为响应式的 text 数据.
provide(/* 注入名 */ "message", /* 值 */ text);
</script>

<template>
  <input type="text" v-model="text" />
  <container></container>
</template>
```

注：当我们在根组件使用依赖注入时就可以在任意组件接收到这个数据了，在开发 Vue 插件的时候你可以尝试使用 ~

## 使用 Inject 输入数据 key：

### 注入一个 key：

在 DeepChild 组件中通过 inject() 函数来传入指定数据的 key 来得到 Root 组件中的响应式 text，而且这个响应式对象不会被解包，得到的数据对象依然保持着响应式链接。

在下面的代码中我们通过点击输出按钮得到了 message 的数据，是一个 **RefImpl** 对象：

```
<script setup lang="ts">
import { inject } from "vue";
const message = inject("message");

const log = () => {
  console.log(message);
};
</script>

<template>
  <button @click="log">输出</button>
</template>
```

### 使用默认值：

当我们在 DeepChild 组件所注入时使用 key 是一个没有在 Root 组件所提供的时候，那么我们就需要使用到默认值了，需要通过 inject 函数的参数 2 来指定：

```
const message = inject("message", "你好");
```

注：当默认值是通过函数的得到的时候，我们需要考虑使用工厂函数的形式来创建默认值，从而避免副作用的产生。

### 依赖注入时遇到响应式数据有什么注意的？

上面的例子我们就直接传递的响应式的 text 对象，那在 Root 组件的后代组件中每一个都有可能会对这个响应式的数据做更改，为了保证更改函数的统一管理，Vue 建议我们在定义将响应式数据的变更与 provide 定义在一起，也可以说在哪定义的响应式数据就在哪更改它。



在下面的代码中我们在 Root 组件提供了 updateText 函数来更新 text 的值，同样需要将这个函数也通过 provide 提供给后代组件使用：

```
<script setup lang="ts">
import { ref, provide } from "vue";
import Container from "./components/Container.vue";

const text = ref("hello");
// TODO 通过provide函数提供一个 Key 为 message,value 为响应式的 text 数据.
provide(
  /* 注入名 */ "message",
  /* 值 */ {
    text,
    updateText,
  }
);

function updateText() {
  text.value = "hello world~";
}
</script>
```


因为我们使用到了 TypeScript，所以推断我们的 messageObj 对象（我们注入已改为对象）上不存在 text 属性和 updateText函数，

```
<script setup lang="ts">
import { inject } from "vue";

const messageObj = inject("message");

const log = () => {
  //@ts-ignore
  console.log(messageObj.text);
};

//@ts-ignore
const change = messageObj.updateText;
</script>

<template>
  <button @click="log">输出</button>
  <button @click="change">更改</button>
</template>
```

### 祭出readonly：

在上面的改造中我们千辛万苦把改变响应式数据的函数提到了 Root 组件，但是万一有人不守规则怎么办？在这个场景下我们就需要限制这个响应式数据在提供给后代组件时仅为只读状态，当你尝试在后代组件修改时 Vue 会发出警告：Set operation on key "value" failed: target is readonly.

```
provide(
  "message",
  {
    text: readonly(text),
    updateText,
  }
);
```

### 发挥 TypeScript 类型的作用：

我们前面使用 @ts-ignore 跳过了对应下一行 TS 对我们发出的错误提示，这里我们就来为 provide 何 inject 来补充其类型发挥 Ts 类型的作用：

在注入的时候应为我们的 text 和 updateText 都是可以推断出来的特定类型，所以可以省略掉，但我们可以使用 as 关键字来明示出来：

```
provide(
  "message",
  {
    text: readonly(text),
    updateText,
  } as {
    text: Readonly<Ref<string>>;
    updateText: () => void;
  }
);
```

注：在下一个小结还有另一种方式约束类型哦~

在 inject 注入的时候同样可以使用 as 关键字来明确这个数据的类型，也可是使用泛型约束（无法使用对象解构，无法配置 undefined）：

```
const { text, updateText } = inject("message") as {
  text: Readonly<Ref<string>>;
  updateText: () => void;
};
```

## Symbol 在依赖注入时的使用：

Symbol 作为一个出场率极低的对象在这就派上它的用场，我们在使用 provide 向后代组件提供数据的时候 key 一定的不能重复了，这个场景与 Symbol 对象的特点是完美契合的，虽然我们可以将所以的 key 放到同一个 ts 文件进行管理，但是使用 Symbol 来作为 key 是再好不过了。

在 keys.ts 中定义一个新的 messageKey：

```
import { InjectionKey, Ref } from "vue";

export const message = Symbol() as InjectionKey<{
  text: Readonly<Ref<string>>;
  updateText: () => void;
}>;
```

```
import { message } from "./keys";

const text = ref("hello");

function updateText() {
  text.value = "hello world~";
}

provide(message, {
  text: readonly(text),
  updateText,
});
```

```
import { message } from "../keys";

const { text, updateText } = inject(message) as {
  text: Readonly<Ref<string>>;
  updateText: () => void;
};
```

## 结语：

本篇通过对 Vue 文档的再熟悉并使用组合式 API 来演示了依赖注入的使用方式和一些注意事项，希望在后续开发中可以有所体现，实践是巩固技术的良好途径。明天继续~