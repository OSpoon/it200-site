---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "前端小鑫同学"
  text: "🏅InfoQ签约作者"
  tagline: 专注前端技术布道，所有付出都将是沉淀，所有美好终会如期而至~
  image:
    src: /logo.png
    alt: 前端小鑫同学
  actions:
    - theme: brand
      text: 写作之路
      link: /blog/readme
    - theme: alt
      text: 系列开发教程
      link: /document/readme

features:
  - title: 💡 梦想
    details: 因一次编写自动登录游戏脚本而产生编程的兴趣，顾万物皆有裨益，万事皆可为师。
  - title: 🏗 经历
    details: 从一本厚重的《疯狂 Android 讲义》启蒙到应环境变化做一位前端程序员心路历程。
  - title: 🔑 方式
    details: 繁多的技术不可能靠记忆实现，做笔记和写博客是记录学习过程和分享学习成果的捷径。
  - title: 📦 沉淀
    details: 选择在 1024Code 平台以卡片的形式记录每一个案例，以集合的形式串联一个系列。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(40px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>