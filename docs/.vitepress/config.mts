import { defineConfig, type DefaultTheme } from "vitepress";
import {
  sidebarLogicFlow,
  sidebarTsup,
  sidebarPinia,
  sidebarVueDecorator,
  sidebarBlog,
  sidebarDocument,
} from "./sidebarConfig.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端小鑫同学",
  description: "🏅InfoQ签约作者",
  lastUpdated: true,
  sitemap: {
    hostname: 'https://it200.cn'
  },
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "前端小鑫同学",
    externalLinkIcon: true,

    docFooter: {
      prev: " 上一页",
      next: "下一页",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    sidebar: {
      "/blog/": {
        base: "/blog/",
        items: sidebarBlog(),
      },
      "/document/": {
        base: "/document/",
        items: sidebarDocument(),
      },
      "/document/LogicFlow流程图编辑框架/": {
        base: "/document/",
        items: sidebarLogicFlow(),
      },
      "/document/构建工具tsup入门/": {
        base: "/document/",
        items: sidebarTsup(),
      },
      "/document/Pinia符合直觉的状态管理/": {
        base: "/document/",
        items: sidebarPinia(),
      },
      "/document/Vuejs装饰器风格开发教程/": {
        base: "/document/",
        items: sidebarVueDecorator(),
      },
    },

    socialLinks: [
      // {
      //   icon: {
      //     svg: '<svg t="1692944762807" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1938" width="128" height="128"><path d="M692.699238 336.887706c11.619123 0 23.117414 0.831898 34.517504 2.108006C696.19497 194.549965 541.769728 87.227597 365.488742 87.227597 168.405197 87.227597 6.977229 221.535539 6.977229 392.107418c0 98.493235 53.707366 179.306803 143.459123 242.033357l-35.857101 107.840102 125.329408-62.837146c44.84311 8.861798 80.827085 18.002022 125.578138 18.002022 11.250688 0 22.40215-0.561766 33.469645-1.428582-7.001702-23.95351-11.06647-49.054208-11.06647-75.120947C387.891917 463.976243 522.3936 336.887706 692.699238 336.887706zM497.405542 232.406118c30.611456 0 55.425536 24.815206 55.425536 55.427379s-24.814182 55.426355-55.425536 55.426355c-30.613504 0-55.427584-24.815206-55.427584-55.426355S466.794086 232.406118 497.405542 232.406118zM246.567526 344.377344c-30.611456 0-55.427584-24.815206-55.427584-55.426355 0-30.611149 24.81623-55.426355 55.427584-55.426355 30.613504 0 55.428608 24.815206 55.428608 55.426355C301.996134 319.561114 277.18103 344.377344 246.567526 344.377344zM1017.379942 617.455821c0-143.330406-143.423283-260.165325-304.515686-260.165325-170.58089 0-304.924979 116.834918-304.924979 260.165325 0 143.57801 134.34409 260.158157 304.924979 260.158157 35.697459 0 71.712154-9.0112 107.569254-17.99895l98.340659 53.861683-26.969293-89.592525C963.769856 769.897677 1017.379942 698.309222 1017.379942 617.455821zM619.184947 577.275699c-21.799322 0-39.469466-17.673523-39.469466-39.471002 0-21.799526 17.671168-39.468954 39.469466-39.468954s39.469466 17.670451 39.469466 39.468954C658.656563 559.6032 640.983347 577.275699 619.184947 577.275699zM816.270541 579.514675c-21.80137 0-39.47049-17.672499-39.47049-39.468954 0-21.80055 17.670144-39.468954 39.47049-39.468954 21.798298 0 39.469466 17.669427 39.469466 39.468954C855.741133 561.842176 838.068941 579.514675 816.270541 579.514675z" fill="#6d6d72" p-id="1939"></path></svg>',
      //   },
      //   link: "https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308101716976.png",
      // },
      { icon: "github", link: "https://github.com/ospoon" },
    ],
    outlineTitle: "目录:",
    outline: "deep",
    search: {
      provider: "local",
    },
    footer: {
      message:
        '<a target="_blank" href="https://beian.miit.gov.cn">晋ICP备15003329号-3</a>',
      copyright:
        'Copyright © 2023-present <a target="_blank" href="https://github.com/OSpoon">前端小鑫同学</a>',
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: "写作之路",
      link: "/blog/2023/告诉你一种阅读README文档的新方式",
      activeMatch: "/blog/",
    },
    {
      text: "系列开发教程",
      items: [
        {
          text: "LogicFlow流程图编辑框架",
          link: "/document/LogicFlow流程图编辑框架/01LogicFlow安装与准备工作",
          activeMatch: "/document/LogicFlow流程图编辑框架/",
        },
        {
          text: "构建工具tsup入门",
          link: "/document/构建工具tsup入门/01构建工具tsup入门第一部分",
          activeMatch: "/document/构建工具tsup入门/",
        },
        {
          text: "Pinia符合直觉的状态管理",
          link: "/document/Pinia符合直觉的状态管理/01教程前言",
          activeMatch: "/document/Pinia符合直觉的状态管理/",
        },
        {
          text: "Vuejs装饰器风格开发教程",
          link: "/document/Vuejs装饰器风格开发教程/01教程前言",
          activeMatch: "/document/Vuejs装饰器风格开发教程/",
        },
      ],
    },
  ];
}
