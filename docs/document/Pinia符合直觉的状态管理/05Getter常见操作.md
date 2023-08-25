## 构建 Getter

**Getter** 就等于是在 `store` 中增加的一个计算属性，大多数情况 `getter` 仅依赖 `state`，但也可以依赖于其他的 `getter`。因此你可以在普通函数中使用 `this` 来访问这个 `store` 的实例，但需要注意的是普通函数额外要注意提供必要的、明确的返回类型。

首先调整 `IUserState `的内容看起来很适合 Getter 案例：

```typescript
export type IUserState = {
  firstName: string;
  lastName: string;
};

export const state: IUserState  = {
  firstName: 'John',
  lastName: 'Wilson',
}
```

接着还是在 `user` 文件夹中新增 `getters.ts` 文件，用来添加和 `user state` 相关的 `getter`，在下面的代码中添加了使用箭头函数编写的 `fullName`，同时使用普通函数编写了 `lowerName`，并且在 `lowerName` 中使用了 `fullName`。

```typescript
import type { IUserState } from './state';

export const getters = {
  fullName: (state: IUserState) => state.firstName + ' / ' + state.lastName,
  lowerName(): string {
    // @ts-ignore
    return this.fullName.toLocaleLowerCase();
  },
};
```

## 向 Getter 传递参数

在编写 `getter` 时使用了箭头函数或普通函数，但这里 **Getter** 只是一个**Pinia** 中的一个计算属性，所以不可以直接向 **Getter** 传递任何的参数，这也是上面的代码中增加了 `@ts-ignore` 的原因，但我们可以通过 `getter` 返回一个函数，该函数就可以接收任意参数了。

```typescript
import type { IUserState } from './state';

export enum NameStyle {
  LowerCase = 'LowerCase',
  UpperCase = 'UpperCase',
}

export const getters = {
  transform: (state: IUserState) =>  {
    return (style: NameStyle) => state.lastName[`toLocale${style}`]();
  }
};
```

```vue
<script setup lang="ts">
import { useUserStore } from '../store/user/index';
import { NameStyle } from '../store/user/getters';
const userStore = useUserStore();
</script>

<template>
	<p>transform：{{ userStore.transform(NameStyle.LowerCase) }}</p>
</template>
```
