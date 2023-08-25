import { type DefaultTheme } from "vitepress";

export function sidebarLogicFlow(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "LogicFlow流程图编辑框架",
      base: "/document/LogicFlow流程图编辑框架/",
      items: [
        {
          text: "01 LogicFlow安装与准备工作",
          link: "01LogicFlow安装与准备工作",
        },
        {
          text: "02 LogicFlow自定义业务节点",
          link: "02LogicFlow自定义业务节点",
        },
        {
          text: "03 LogicFlow自定义边（Edge）",
          link: "03LogicFlow自定义边（Edge）",
        },
        { text: "04 LogicFlow更多配置选项", link: "04LogicFlow更多配置选项" },
        { text: "05 LogicFlow插件用前准备", link: "05LogicFlow插件用前准备" },
        { text: "06 LogicFlow内置插件使用", link: "06LogicFlow内置插件使用" },
        { text: "07 LogicFlow内置菜单插件", link: "07LogicFlow内置菜单插件" },
      ],
    },
  ];
}

export function sidebarTsup(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "构建工具tsup入门",
      base: "/document/构建工具tsup入门/",
      items: [
        {
          text: "01 构建工具tsup入门第一部分",
          link: "01构建工具tsup入门第一部分",
        },
        {
          text: "02 构建工具tsup入门第二部分",
          link: "02构建工具tsup入门第二部分",
        },
        {
          text: "03 构建工具tsup入门第三部分",
          link: "03构建工具tsup入门第三部分",
        },
        {
          text: "04 构建工具tsup入门第四部分",
          link: "04构建工具tsup入门第四部分",
        },
      ],
    },
  ];
}

export function sidebarPinia(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Pinia符合直觉的状态管理",
      base: "/document/Pinia符合直觉的状态管理/",
      items: [
        { text: "01 教程前言", link: "01教程前言" },
        { text: "02 模板项目", link: "02模板项目" },
        { text: "03 定义Store", link: "03定义Store" },
        { text: "04 State常见操作", link: "04State常见操作" },
        { text: "05 Getter常见操作", link: "05Getter常见操作" },
        { text: "06 Action常见操作", link: "06Action常见操作" },
        { text: "07 Pinia插件开发", link: "07Pinia插件开发" },
      ],
    },
  ];
}

export function sidebarVueDecorator(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Vuejs装饰器风格开发教程",
      base: "/document/Vuejs装饰器风格开发教程/",
      items: [
        { text: "01 教程前言", link: "01教程前言" },
        { text: "02 模板项目", link: "02模板项目" },
        { text: "03 类组件详解", link: "03类组件详解" },
        { text: "04 类属性详解", link: "04类属性详解" },
        { text: "05 类方法详解", link: "05类方法详解" },
        { text: "06 钩子函数", link: "06钩子函数" },
        { text: "07 类组件属性", link: "07类组件属性" },
        { text: "08 计算属性", link: "08计算属性" },
        { text: "09 事件派发", link: "09事件派发" },
        { text: "10 侦听器", link: "10侦听器" },
        { text: "11 模板引用", link: "11模板引用" },
        { text: "12 依赖注入", link: "12依赖注入" },
        { text: "13 数据双向绑定", link: "13数据双向绑定" },
        { text: "14 组合式API应用", link: "14组合式API应用" },
        { text: "15 自定义装饰器", link: "15自定义装饰器" },
      ],
    },
  ];
}

export function sidebarBlog(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "2023 年度",
      collapsed: false,
      base: "/blog/2023/",
      items: [
        {
          text: "告诉你一种阅读README文档的新方式",
          link: "告诉你一种阅读README文档的新方式",
        },
      ],
    },
  ];
}

export function sidebarDocument(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "LogicFlow流程图编辑框架",
      collapsed: false,
      base: "/document/LogicFlow流程图编辑框架/",
      items: [
        {
          text: "01 LogicFlow安装与准备工作",
          link: "01LogicFlow安装与准备工作",
        },
        {
          text: "02 LogicFlow自定义业务节点",
          link: "02LogicFlow自定义业务节点",
        },
        {
          text: "03 LogicFlow自定义边（Edge）",
          link: "03LogicFlow自定义边（Edge）",
        },
        { text: "04 LogicFlow更多配置选项", link: "04LogicFlow更多配置选项" },
        { text: "05 LogicFlow插件用前准备", link: "05LogicFlow插件用前准备" },
        { text: "06 LogicFlow内置插件使用", link: "06LogicFlow内置插件使用" },
        { text: "07 LogicFlow内置菜单插件", link: "07LogicFlow内置菜单插件" },
      ],
    },
    {
      text: "构建工具tsup入门",
      collapsed: true,
      base: "/document/构建工具tsup入门/",
      items: [
        {
          text: "01 构建工具tsup入门第一部分",
          link: "01构建工具tsup入门第一部分",
        },
        {
          text: "02 构建工具tsup入门第二部分",
          link: "02构建工具tsup入门第二部分",
        },
        {
          text: "03 构建工具tsup入门第三部分",
          link: "03构建工具tsup入门第三部分",
        },
        {
          text: "04 构建工具tsup入门第四部分",
          link: "04构建工具tsup入门第四部分",
        },
      ],
    },
    {
      text: "Pinia符合直觉的状态管理",
      collapsed: true,
      base: "/document/Pinia符合直觉的状态管理/",
      items: [
        { text: "01 教程前言", link: "01教程前言" },
        { text: "02 模板项目", link: "02模板项目" },
        { text: "03 定义Store", link: "03定义Store" },
        { text: "04 State常见操作", link: "04State常见操作" },
        { text: "05 Getter常见操作", link: "05Getter常见操作" },
        { text: "06 Action常见操作", link: "06Action常见操作" },
        { text: "07 Pinia插件开发", link: "07Pinia插件开发" },
      ],
    },
    {
      text: "Vuejs装饰器风格开发教程",
      collapsed: true,
      base: "/document/Vuejs装饰器风格开发教程/",
      items: [
        { text: "01 教程前言", link: "01教程前言" },
        { text: "02 模板项目", link: "02模板项目" },
        { text: "03 类组件详解", link: "03类组件详解" },
        { text: "04 类属性详解", link: "04类属性详解" },
        { text: "05 类方法详解", link: "05类方法详解" },
        { text: "06 钩子函数", link: "06钩子函数" },
        { text: "07 类组件属性", link: "07类组件属性" },
        { text: "08 计算属性", link: "08计算属性" },
        { text: "09 事件派发", link: "09事件派发" },
        { text: "10 侦听器", link: "10侦听器" },
        { text: "11 模板引用", link: "11模板引用" },
        { text: "12 依赖注入", link: "12依赖注入" },
        { text: "13 数据双向绑定", link: "13数据双向绑定" },
        { text: "14 组合式API应用", link: "14组合式API应用" },
        { text: "15 自定义装饰器", link: "15自定义装饰器" },
      ],
    },
  ];
}
