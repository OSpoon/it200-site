在类组件中可以使用 `@Setup` 装饰器来对组合式 **API** 进行描述，这样就可以在类组件中使用组合式 **API** 了。

这里我们使用 **06钩子函数** 中的代码，因为 `router` 在 Vuejs3 开发中往往会选择使用组合式 API 的风格。通过使用 `@Setup` 引入组合式 **API** `useRouter`，来实现导航的切换。

```vue
<script lang="ts">
import { Component, Setup, Vue } from 'vue-facing-decorator'
import { useRouter, Router } from 'vue-router'

@Component
export default class App extends Vue {
  @Setup(() => useRouter())
  router!: Router;

  goto(path: string) {
    this.router.push({ path });
  }
  
}
</script>

<template>
  <div>
   <p>
      <a @click='goto("/")'>Go to Home</a>
      <a @click='goto("/about")'>Go to About</a>
    </p>
    <router-view></router-view>
  </div>
</template>
```

