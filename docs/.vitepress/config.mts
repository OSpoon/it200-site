import { defineConfig } from "vitepress";
import { sidebar } from "./sidebarConfig.mjs";
import { nav } from "./navConfig.mjs";

import { RssPlugin, RSSOptions } from "vitepress-plugin-rss";
const baseUrl = "https://ospoon.github.io";
const RSS: RSSOptions = {
  title: "前端小鑫同学",
  baseUrl,
  copyright: "Copyright © 晋ICP备15003329号-3",
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/it200-site/",
  title: "前端小鑫同学",
  description: "🏅InfoQ签约作者",
  lastUpdated: true,
  sitemap: {
    hostname: "https://it200.cn",
  },
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "前端小鑫同学",
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
    plugins: [RssPlugin(RSS)],
  },
});
