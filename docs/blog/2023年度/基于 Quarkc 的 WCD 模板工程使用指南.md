# 基于 Quarkc 的 WCD 模板工程使用指南

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

[web-component-development](https://github.com/OSpoon/web-component-development) 是基于 **Quarkc** 跨端组件的开发模板工程,您可以基于本工程构建跨技术栈/无框架的组件，满足个性化需求。

相比于 **Quarkc** 提供的 `template-quarkc-component-ts` 模板做了如下调整:

| 序号 | 描述                             |
| ---- | -------------------------------- |
| 1    | 调整 npm run build 为批量构建    |
| 2    | 新增 npm run new 创建组件        |
| 3    | 增加 unocss 原子 CSS 配置        |
| 4    | 替换测试套件为 @web/test-runnner |

## 获取 WCD 模板工程

1. 拉取代码

```shell
git clone https://github.com/OSpoon/web-component-development.git
```

2. 初始化并启动开发服务

```shell
cd web-component-development
npm install
npm run dev
```

## WCD 模板工程目录

```
quarkc-component-development       
├─ components                    
│  ├─ MyComponent                待开发组件文件夹 
│  │  ├─ __tests__               组件单元测试文件
│  │  │  └─ index.test.js          
│  │  ├─ demo                    组件预览调试文件件
│  │  │  ├─ index.html             
│  │  │  └─ index.vue.html         
│  │  ├─ index.less              组件样式文件(重要) 
│  │  ├─ index.tsx               组件逻辑文件(重要)   
│  │  └─ vite-env.d.ts                          
├─ coverage                      单元测试数据统计
├─ dist                          组件构建产物输出文件夹
│  ├─ MyComponent                  
│  │  ├─ types                     
│  │  │  └─ index.d.ts             
│  │  ├─ index.js                  
│  │  ├─ index.umd.js              
│  │  └─ package.json                         
├─ plop-templates                组件及组件单元测试模板      
├─ scripts                         
│  └─ components-script.ts       组件批量构建文件  
├─ README.es-US.md                 
├─ README.md                       
├─ coverage.png                    
├─ github.png                      
├─ index.html                                   
├─ package.json                    
├─ plopfile.cjs                    
├─ tsconfig.json                   
├─ uno.config.ts                   
├─ vite.config.ts                  
├─ web-test-runner.config.mjs      
└─ web-test-runner.plugins.mjs     
```

## 组件开发流程

基于 **WCD** 模板工程演示完整的组件开发流程, 案例组件来源 **Quarkd** 跑马灯组件.

### 快速创建 MyMarquee 组件

1. 在终端输入 `npm run new` 命令, 根据提示选择 `component` 选项;

2. 根据提示输入组件名 `my marquee`, 确认后即可生成;

```jsx
@customElement({
  tag: "my-marquee",
  style,
})
class MyMarquee extends QuarkElement {
  render() {
    return (<></>);
  }
}
```

PS: 上述代码片段是对生成组件精简后的核心部分.

### 着手编写 MyMarquee 组件

1. 使用 `render` 函数编写组件 UI;
2. 使用 `property` 申明组件属性;
3. 导出组件 `interface` 便于构建生成类型;
4. `animation` 动画属性


#### 1. 编写组件 UI

在 **Quarkc** 中需要在 `render` 函数中编写 `tsx/jsx` 来描述 **UI** , 需要对元素做 **DOM** 操作时可以为其声明一个由 `createRef()` 函数创建的变量.

```jsx
import { createRef } from "quarkc";

titleRef: any = createRef();

render() {
    return (
      <span
        ref={this.titleRef}
        class="my-marquee-title"
      >
        {this.title}
      </span>
    );
}
```

#### 2. 填充组件样式

组件样式由 `@customElement()` 装饰器负责与组件渲染相关联.

要实现跑马灯效果需要编写关键帧动画及控制动画播放的行为, 在关键帧动画中通过 `transform` 实现在 `X` 轴上的移动, 并控制动画线性播放且无限循环.

```css
:host {
  flex: 1 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #ee8c02;
  font-size: 14px;
}

:host .my-marquee-title {
  width: auto;
  padding: 0 4px;
  white-space: nowrap;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes my-marquee-animation {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}
```

#### 3. 扩展组件属性

组件属性可以支持在使用时一定程度上的定制, 在跑马灯组件中支持传入显示的内容, 播放的速度, 播放的方向并且使用 `interface` 定义.

```typescript
export interface Props {
  title: string;
  speed?: number;
  reverse?: boolean;
}
```

在组件中申明的具有 `@property()` 装饰器的属性即为 **组件属性** .

```jsx
import { property } from "quarkc";

@customElement({
  tag: "my-marquee",
  style,
})
class MyMarquee extends QuarkElement {
  @property()
  title = "";

  @property()
  speed = "50";

  @property({ type: Boolean })
  reverse = false;
}
```

#### 4. 让组件开始工作

在组件中 `componentDidMount` 生命周期钩子函数触发时表示组件 **DOM** 已经完成挂载, 这个就是组件开始工作的触发条件.

```jsx
componentDidMount(): void {
    this.start();
}
```

在组件中 `start()` 函数是让组件开始工作( **动画播放** )的核心函数, 根据使用者传入的组件属性数据动态调整动画播放的方向及播放的速度.

```jsx
start = () => {
    const container = this;
    const text = this.titleRef.current;

    if (container.offsetWidth >= text.offsetWidth) {
      text.style.removeProperty("animation-duration");
      text.style.removeProperty("animation-name");
      return;
    }

    const initial = !text.style.animationName;

    if (initial) {
      text.style.paddingLeft = `${container.offsetWidth}px`;
    }

    text.style.animationDirection = this.reverse ? "reverse" : "normal";
    text.style.animationDuration = `${Math.round(
      text.offsetWidth / Number(this.speed)
    )}s`;
    text.style.animationName = "my-marquee-animation";
};
```

### 组件预览和调试

在 `npm run dev` 启动后, 你可以在浏览器通过 `http://127.0.0.1:5173/` 地址预览到组件的渲染效果, 通过左侧的导航切换不同的组件.

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202309120929434.png)

### 组件单元测试

在创建组件时已经配套生成了一根单元测试文件, 接下来的单元测试就从 `components/MyMarquee/__tests__/index.test.js` 开始.

当然还可以再次在终端输入 `npm run new` 根据提示创建组件对应的单元测试文件.

1. 模拟用户使用数据

```js
const data = {
  title: "2022年我们见证了很多技术的新发展新变化",
  speed: "100",
  reverse: true,
};
```

2. 挂载自定义组件

```js
import { fixture } from "@open-wc/testing";
import "../../../dist/MyMarquee/index";
el = await fixture(
    `<my-marquee 
        title=${data.title}
    >
    </my-marquee>`
);
```

3. 确认属性值一致

```js
expect(el.title).to.equal(data.title);
```

4. 下面是对其他组件属性的单元测试案例

```js
describe("<my-marquee />", async () => {

  it("property title", async () => {
    el = await fixture(
      `<my-marquee 
        title=${data.title}
      >
      </my-marquee>`
    );
    expect(el.title).to.equal(data.title);
  });

  it("property speed", async () => {
    el = await fixture(
      `<my-marquee 
        title=${data.title}
        speed=${data.speed}
      >
      </my-marquee>`
    );
    expect(el.speed).to.equal(data.speed);
  });

  it("property reverse", async () => {
    el = await fixture(
      `<my-marquee 
        title=${data.title}
        reverse=${data.reverse}
      >
      </my-marquee>`
    );
    expect(el.reverse).to.equal(data.reverse);
  });
});
```
PS: 第一次运行 `npm run test` 时因为未编译生成 `dist` 目录, 将优先进行一次编译.

想了解更多信息，请参考：https://quarkc.hellobike.com/#/zh-CN/docs/publishing