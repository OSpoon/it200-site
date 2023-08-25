## 构建 Action

**Store** 中的 `action` 相当于**Component** 中的 `method`，`action` 是编写业务逻辑做合理的地方。`action` 同 `getter` 均可以使用 `this` 访问整个 `store` 实例，特殊的事在 `action` 中可以执行异步的 API。

下面通过定义一个异步的 `action` 来获取服务器存储的用户数据，并将这些数据存储到 `userStore` 中；

```typescript
import { defineStore } from 'pinia';
import { mande } from 'mande';

const api = mande('https://jsonplaceholder.typicode.com/users');

export type IUserState = {
  users: Array<{
    id: number;
    name: string;
    username: string;
    email: string;
  }>;
};

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({ users: [] }),
  actions: {
    async getUsers() {
      try {
        this.users = await api.get();
      } catch (err) {
        console.log(err);
      }
    },
  },
});
```

## 使用 Action

因为 `action` 只是一个普通函数，所以可以通过 `store` 实例直接使用也可以解构实例通过函数名使用，但在下面的示例中为保证 `state` 的响应性，使用到了 `pinia` 提供的 `storeToRefs` 函数。

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from './stores/user-store';

const userStore = useUserStore();
const { users } = storeToRefs(userStore);
onMounted(() => {
  userStore.getUsers();
})
</script>

<template>
  <div>
    <ul>
      <li v-for="item in users">
        {{item.name}} / {{item.username}} / {{item.email}}
      </li>
    </ul>
  </div>
</template>
```

## 订阅 Action

action 同 state 一样是支持我们进行订阅操作的，在订阅 action 的函数中提供了action 的 name、store 实例、传递给 action 的参数组、还有处理完成（after）和拒绝处理（onError）的回调。

```typescript
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

[^注]: 上面这段代码来着 Pinia 文档对于订阅 Action 提供的示例。

同样也支持脱离所在组件生命周期进行订阅；

```typescript
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$onAction(callback, true)
</script>
```

[^注]: 上面这段代码来着 Pinia 文档对于订阅 Action 提供的示例。

