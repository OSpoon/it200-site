## 基础示例

在定义 **Store** 时需要用到 **pinia** 模块提供的 `defineStore()`， `defineStore()` 的参数 1 需要传入一个应用程序中唯一的**ID**，这个 **ID**会与 **devtools** 进行关联，defineStore() 的返回值需要注意的是我们应该按照组合式函数的风格进行命名（`useXxxStore`）如：`useAlertsStore`、`useCounterStore`等。

```typescript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {});
```

`defineStore()` 的参数 2 可以接收两种类型值，一种是 `options` 对象、另一种是 `setup` 函数。

| Pinia  | options 对象 | setup 函数 |
| ------ | ------------ | ---------- |
| state  | data         | ref()      |
| getter | computed     | computed() |
| action | methods      | function() |

## 完善 Store 配置

`options` 对象配置示例：

```typescript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({count: 0}),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    }
  }
});
```

`setup` 函数配置示例：

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref<number>(0);

  const double = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, double, increment }
});
```

## 使用 Store 共享状态

在根组件准备两个看似并不相关的组件，用来验证跨横线组件数据（状态）的传递；

```vue
<script setup lang="ts">
import Left from './components/Left.vue';
import Right from './components/Right.vue';
</script>

<template>
  <div class="container">
    <Left></Left>
    <Right></Right>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 300px;
  gap: 10px;
}
</style>
```

在 **Left** 组件中通过执行 `store` => `actions` 中定义的逻辑函数来更新状态；

```vue
<script setup lang="ts">
import { useCounterStore } from '../store/index';

const store = useCounterStore();

const update = () => {
  store.increment();
}
</script>

<template>
  <div class="container">
    更新状态区：
    <p><button @click="update">更变</button></p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  border: 1px solid red;
  flex: 1;
  flex-direction: column;
}
</style>
```

在 **Right** 组件中读取 `store` 中的 `getters`，下面示例中的两种方式都是均有响应性的；

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useCounterStore } from '../store/index';

const store = useCounterStore();
const doubleValue = computed(() => store.double);
</script>

<template>
  <div class="container">
    同步状态区：
    <p>执行使用Store：{{ store.double }}</p>
    <p>声明变量使用：{{ doubleValue }}</p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  border: 1px solid red;
  flex: 1;
  flex-direction: column;
}
</style>
```

## 保证 Store 中属性的响应性

在 **Pinia** 的文档中描述了对于我们在使用 `store` 时不应该直接对 `store` 进行解构操作，那将破话 `store` 中存储的状态将会失去响应性。

如何保证 `store` 中存储状态的响应性还能使用解构来展开所存储的状态呢？这时候就需要引入一个 `pinia` 提供的 API：`storeToRefs()`，它将为响应式的状态创建引用，当只读取 store 中的状态而不操作 `action` 时将很有用，因为 `action` 作为用来更新 `store` 中数据状态的函数是不具有响应性的，所以可以通过结构 `store` 直接获取并使用。

```vue
<script setup lang="ts">
import { useCounterStore } from '../store/index';

const store = useCounterStore();
const { increment } = store;
</script>

<template>
  <div class="container">
    更新状态区：
    <p><button @click="increment">更变</button></p>
  </div>
</template>
```

```vue
<script setup lang="ts">
import { useCounterStore } from '../store/index';
import { storeToRefs } from 'pinia';

const store = useCounterStore();
const { double } = storeToRefs(store);
</script>

<template>
  <div class="container">
    同步状态区：
    <p>执行使用Store：{{ store.double }}</p>
    <p>声明变量使用：{{ double }}</p>
  </div>
</template>
```

