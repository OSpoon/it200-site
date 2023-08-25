## 插件功能

**Pinia** 支持我们通过插件的形式来进行功能的扩展，那么可以扩展的功能就包括以下所列举的：

1. 为 `store` 添加新的属性
2. 为 `store` 添加新的选项
3. 为 `store` 添加新的方法
4. 封装现有的方法
5. 改变或取消 `action`
6. 实现副作用：如本地存储
7. 仅应用于特定的 `store`

## 基础插件实现

在 **Pinia** 中的插件就是一个普通的函数，通过 **Pinia** 提供的 `use` 函数将插件进行挂载。编写的插件函数可以得到一个 `context` 参数，通过 `context` 参数可以获取到 `pinia` 实例、`store` 实例、`options` 选项，在 **Vue3** 中还可以得到 `createApp()` 返回的 **App** 实例。

插件上下文：

```typescript
export const MyPiniaPlugin = (context) => {
  console.log(context.app);
  console.log(context.options);
  console.log(context.pinia);
  console.log(context.store);
};
```

挂载插件：

```typescript
import { MyPiniaPlugin } from './plugins';

const pinia = createPinia();
pinia.use(MyPiniaPlugin);
```

### 扩展 Store 属性

为 store 扩展属性可以使用两种方式，一种方式是通过上下文得到 store ，为其直接增加新的属性；另一种是在插件函数中通过返回对象的形式增加新的属性。

```typescript
export const MyPiniaPlugin = () => {
  return {
    hello: 'world',
  }
};

export const MyPiniaPlugin2 = ({store}) => {
  store.hello = 'world';
};
```

新增到 `store` 上的属性同样是具有响应性的，因为每个 `store` 都被 `reactive` 包装，但当我们需要新的一些外部的对象实例或非响应式的属性时，可以使用 `markRaw()` 包装。

```typescript
import { markRaw } from 'vue'
// 根据你的路由器的位置来调整
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

[^注]: 上面这段代码来着 Pinia 文档对于添加外部属性提供的示例。

### 订阅 state 和 action

插件提供的上下文可以得到 `store`，那么通过 `store` 自然可以对 `state` 和 `action` 进行订阅。

```
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```

[^注]: 面这段代码来着 Pinia 文档对于订阅提供的示例。

### 添加新的选项

自定义插件的一个关键环节就是对定义专属于插件的一些选项进行控制，这里添加选项包括两种方式：

一种方式是通过扩展 `defineStore()` 的参数二，来为指定的 `store` 添加新的选项；

```typescript
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
  // 直接添加到 defineStore 的参数 2 中
  myPluginOptions: {
    key: '123456'
  }
});
```

```typescript
export const MyPiniaPlugin = (context) => {
  const { options } = context;
  // 读取添加的选项
  console.log(options.myPluginOptions);
};
```

另一种方式是通过将插件函数包装到另一个函数，通过外层函数接收插件全局的选项。

```typescript
// 挂载插件时添加选项
pinia.use(MyPiniaPlugin({key: '123456'}));
```

```typescript
// 通过包装插件函数，接收插件选项
export const MyPiniaPlugin = (options) => {
  return (context) => {
    console.log(context);
    console.log(options);
  }
};
```

## 持久化插件实战

**pinia-plugin-persistedstate** 是适用于 **Pinia** 的持久化存储插件，使用简单且高度可定制，可以控制 store 是否开启持久化存储，也可以选择存储的方案（[`localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)、[sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)）,还可以选择或者重写数据序列化的方案（`zipson`、`JSON`）。

### 案例描述

通过实现记住账号密码的功能来验证我们复刻的 **pinia-plugin-persistedstate** 插件是否可以正常工作，记住账号、密码也是大多数网站或 App 所具备的功能，一般在存储是会优先选择 `localStorage`、`sessionStorage`, 同时将账号密码存储到 **Pinia** 的 `store` 中还可以为后续在平台进行显示或修改提供便利。

### 项目准备

在用户点击登录按钮时将用户名和密码同步到 `store`，并在组件完成挂载后通过 `store` 存储的账号密码对组件中申明的属性进行初始化赋值。

```vue
<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { useLoginFormStore } from './stores/login-from';
  const loginFormStore = useLoginFormStore();
  
  const loginForm = reactive({
    username: '',
    password: '',
  });
  
  const login = () => {
    loginFormStore.$patch({
      username: loginForm.username,
      password: loginForm.password,
    })
  };

  onMounted(() => {
    loginForm.username = loginFormStore.username;
    loginForm.password = loginFormStore.password;
  })
</script>

<template>
  <h3>登录</h3>
  <p>用户名：<input v-model="loginForm.username" /></p>
  <p>密码：<input v-model="loginForm.password" /></p>
  <p><button @click="login">记住密码登录</button></p>
  <h3>当前用户</h3>
  <p>用户名：{{loginFormStore.username}} 密码：{{loginFormStore.password}}</p>
</template>
```

定义合适的 store：

```typescript
import { defineStore } from 'pinia';

export const useLoginFormStore = defineStore('loginForm', {
  state: () => {
    return {
      username: '',
      password: '',
    };
  }
});
```

编写一个空的（插件）函数：

```typescript
export default function (context: any) {

}
```

导入并注册插件：

```typescript
import piniaPluginPersistedstate from './stores/pinia-plugin-persistedstate'

pinia.use(piniaPluginPersistedstate)
```

### 插件功能列表

1. 支持选择数据持久化方案；
2. 支持配置数据序列化方案；
3. 数据恢复前后提供 Hook 函数；

### 插件开发过程

通过功能列表设计插件所需要的选项如下配置：

| Store 选项    | 描述               |
| ------------- | ------------------ |
| key           | 标记存储的唯一 ID  |
| storage       | 选择数据持久化方案 |
| serializer    | 配置数据序列化方案 |
| beforeRestore | 数据恢复前 Hook    |
| afterRestore  | 数据恢复后 Hook    |

配置 **LoginFromStore** 的相关选项：

```typescript
import { defineStore } from 'pinia';

export const useLoginFormStore = defineStore('loginForm', {
  state: () => {
    return {
      username: '',
      password: '',
    };
  },
  persist: {
    key: 'loginForm',
    storage: sessionStorage,
    serializer: {
      deserialize: JSON.parse,
      serialize: JSON.stringify,
    },
    beforeRestore: (ctx) => {
      console.log(`即将恢复 '${ctx.store.$id}'`);
    },
    afterRestore: (ctx) => {
      console.log(`刚刚恢复完 '${ctx.store.$id}'`);
    },
  },
});
```

解构插件上线文获取 `options` 和 `store`，通过 `store` 订阅 `state` 的变化，将 state 进行持久化存储；

```typescript
export default function (context: any) {
  const { options, store } = context;
  const { persist } = options;

  // 订阅 state 变化，将 state 进行持久化
  store.$subscribe(
    (_, state: any) => {
      persistState(state, persist);
    },
    {
      detached: true,
    }
  );
}
```

通过选项中配置的持久化方案和数据序列化方案组合 `persistState` 函数：

```typescript
function persistState(state: any, persistence: any) {
  const { storage, serializer, key } = persistence;
  storage.setItem(key, serializer.serialize(state));
}

// 相当于下面的代码

function persistState(state: any, persistence: any) {
  const { key } = persistence;
  sessionStorage.setItem(key, JSON.stringify(state));
}
```

在订阅前，也就是插件被挂载后做数据的恢复：

```typescript
export default function (context: any) {
  const { options, store } = context;
  const { persist } = options;

  // 恢复疏浚
  hydrateStore(store, persist);

  store.$subscribe(
    (_, state: any) => {
      persistState(state, persist);
    },
    {
      detached: true,
    }
  );
}
```

提取到待恢复的数据后要更新到 `store`：

```typescript
function hydrateStore(store: any, persistence: any) {
  const { storage, serializer, key } = persistence;
  const fromStorage = storage.getItem(key);
  if (fromStorage) {
    store.$patch(serializer.deserialize(fromStorage));
  }
}
```

### 添加 Hook 函数

只需要在 hydrateStore 执行函数即可：

```
export default function (context: any) {
  const { options, store } = context;
  const { persist } = options;

  if (!persist) return;

  const { beforeRestore, afterRestore } = persist;

  // 即将恢复
  if (beforeRestore) beforeRestore(context);

  hydrateStore(store, persist);
  
  // 刚刚恢复完
  if (afterRestore) afterRestore(context);

  store.$subscribe(
    (_, state: any) => {
      persistState(state, persist);
    },
    {
      detached: true,
    }
  );
}
```

[^注]: 核心的持久化功能就已经完成了，可以点击 https://1024code.com/codecubes/fhwcmyi 进行案例尝试，复刻的原因是要熟悉 Pinia 插件开发，所以相比原插件，我们的插件缺少了全局选项的支持，缺少了异常情况的处理，及更强的多中存储方案的同时支持等。

