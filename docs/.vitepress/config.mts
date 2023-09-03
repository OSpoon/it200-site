import { defineConfig } from "vitepress";
import { sidebar } from "./sidebarConfig.mjs";
import { nav } from "./navConfig.mjs";
import { pagefindPlugin } from "vitepress-plugin-pagefind";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/it200-site/",
  title: "爱学习IT200.cn",
  description: "🏅InfoQ签约作者",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "爱学习IT200.cn",
    externalLinkIcon: true,
    docFooter: {
      prev: " 上一页",
      next: "下一页",
    },
    nav: await nav(),
    sidebar: await sidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/ospoon" },
      { icon: "discord", link: "https://discord.gg/gqD6fGm3" },
    ],
    outlineTitle: "目录:",
    outline: "deep",
    search: {
      provider: "local",
    },
    footer: {
      copyright:
        'Copyright © <a target="_blank" href="https://beian.miit.gov.cn">晋ICP备15003329号-3</a>',
    },
  },
  vite: {
    plugins: [pagefindPlugin({
      customSearchQuery(input){
        // 将搜索的每个中文单字两侧加上空格
        return input.replace(/[\u4e00-\u9fa5]/g, ' $& ')
        .replace(/\s+/g,' ')
        .trim();
      }
    })],
  },
});
