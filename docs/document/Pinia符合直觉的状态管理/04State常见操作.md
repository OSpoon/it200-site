## 构建 Store

首先在 `store` 文件夹新增存储用户状态的 `user` 文件夹，在 `user` 内新增 `index.ts` 文件用来编写 `useUserStore` 函数。

```typescript
import { defineStore } from 'pinia';
import { state } from './state';


export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      ...state,
    }
  }
});
```

其中将一份导入此模块的 `state` 对象结构并传入了 `defineStore` 函数 `state` 的位置；

接着就是定义这份被导入的 `state` 对象，我们在 `user` 目录新增 `state.ts` 文件，其中为了保持类型支持推理，应该为 `state` 声明合适的类型。

```typescript
export type IUserState = {
  count: number;
  name: string;
  isAdmin: boolean;
  items: Array<{ name: string; path: string }>;
  hasChange: boolean;
};

export const state: IUserState  = {
  count: 0,
  name: 'Eduardo',
  isAdmin: true,
  items: [],
  hasChange: true,
}
```

## 访问 State

访问 `state` 指的是我们可以通过访问 `store` 实例来支持读写 `store` 的状态。

```typescript
const userStore = useUserStore();

const increment = () => {
  userStore.count++;
}
```

[^注]: 这里可以操作的是已经在 store 中声明的状态，不可以通过实例访问的形式增加一个新的状态。

## 重置State

重置 `state` 可以将已经发生变更的状态恢复为初始状态，需要使用 `store` 对象提供的 `$reset` 函数，

```typescript
const userStore = useUserStore();

const reset = () => {
  userStore.$reset();
}
```

[^注]: 在 **pinia** 的英文文档中提到，在 **Setup Stores** 中，你需要自行实现 `$reset()` ，也就是你可以提供一个名为`$reset`的 `action`，自行将 `state` 赋值为初始值；

## 更新State

更新 `state` 可以同时为定义的 `state` 的部分状态进行更新，这比支持访问 `state` 要更高效。

```typescript
const userStore = useUserStore();

const patch = () => {
  userStore.$patch({
    count: userStore.count + 1,
    name: 'DTO',
  })
}
```

对于数组类型状态的操作还可以通过回调函数的形式进行高效的状态更新，避免在数组的添加、移除或 `splice` 操作时创建新的数组来接收。

```typescript
const userStore = useUserStore();

const patch = () => {
  userStore.$patch((state) => {
    state.items.push({ name: 'home', path: '/path'});
    state.hasChange = true;
  })
}
```

[^注]: 如果你要将`store` 中所定义的状态全部更新，那么依然要使用`$patch`函数，避免直接修改`state` 丢失响应性。

## 订阅State

订阅 `state` 可以在状态发生变化后及时的得到消息，并且通过回调的 `mutation` 来对这一次状态变更进行分析和处理。

```typescript
const userStore = useUserStore();

userStore.$subscribe((mutation, state) => {
  console.log(mutation.type);
  console.log(mutation.storeId);
  console.log(mutation.payload);
})
```

`mutation` 中提供了三个属性，通过这三个属性可以分析得到对于这次状态变化的方式等信息。

| 属性    | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| storeId | 通过 **ID** 来对变更的 `state` 进行分类，明确变更来自哪个 **Store** |
| type    | 通过 **Type** 来区分这次变更是通过**Store** 实例直接修改（`direct`）的，还是通过`$patch`对象修改（`patch object`）的，还是通过`$patch`回调函数修改（`patch function`）的 |
| payload | 当 **Type** 为 `patch object` 时，`payload` 可以拿到本次变更最新的状态 |

这是一个最简单的应用订阅 State 的示例：

```typescript
const userStore = useUserStore();

userStore.$subscribe((_, state) => {
  localStorage.setItem('user', JSON.stringify(state));
})
```

[^注]: 对于订阅 `state`，它提供的 `$subscribe` 函数支持在参数 2 的位置添加一个 `detached` 选项，如果`detached` 开启，那么在绑定订阅函数的组件被卸载后订阅函数将依然生效，反之将随着组件的销毁被同时销毁。