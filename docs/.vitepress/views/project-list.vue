<template>
  <div class="container">
    <div class="layout-page">
      <h3 class="project-tier">Projects</h3>
      <div class="project-grid">
        <div
          class="project-grid-item"
          v-for="project in projects.values"
          :key="project.pLink"
        >
          <a class="project-grid-link" :href="project.pLink" target="_blank">
            <div class="project-box">
              <div class="project-wrap">
                <img class="project-icon" :src="project.pIcon" />
                <h2 class="project-name">{{ project.pName }}</h2>
              </div>
              <div class="project-details">{{ project.pDetails }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
const projects = reactive({
  values: [
    {
      pIcon: "https://github.githubassets.com/favicons/favicon.png",
      pName: "cross-platform-components",
      pLink: "https://github.com/OSpoon/cross-platform-components",
      pDetails: "您可以基于本工程构建跨技术栈/无框架的组件，满足个性化需求。",
    },
    {
      pIcon: "https://github.githubassets.com/favicons/favicon.png",
      pName: "var-conv",
      pLink: "https://github.com/OSpoon/var-conv",
      pDetails: "一款适用于VSCode IDE的代码变量名称快速转换工具",
    },
    {
      pIcon: "https://github.githubassets.com/favicons/favicon.png",
      pName: "generator-vite-plugin",
      pLink: "https://github.com/OSpoon/generator-vite-plugin",
      pDetails: "基于Yeoman的Vite插件生成器。",
    },
  ],
});
</script>
<style scoped>
.container {
  padding: 24px;
}

.layout-page {
  margin: 0 auto;
  max-width: 1152px;
}

.project-tier {
  border-radius: 16px 16px 0 0;
  padding: 13px 0 11px;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: center;
  letter-spacing: 1px;
  line-height: 24px;
  width: 100%;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  margin: 35px auto 20px auto;
}

.project-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: -8px;
}

.project-grid-item {
  padding: 8px;
  background-color: transparent;
  transition: none;
}

.project-grid-link {
  height: 158px;
  display: flex;
  background-color: var(--vp-c-bg-soft);
  transition: background-color 0.25s;
}

.project-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.project-wrap {
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.project-icon {
  width: 32px;
  height: 32px;
  filter: grayscale(1);
  transition: filter 0.25s;
}
.project-name {
  font-size: 18px;
  font-weight: 500;
  margin-left: 10px;
}

.project-details {
  padding: 0 15px;
  padding-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (min-width: 640px) {
  .container {
    padding: 0 48px;
  }
  .project-grid-item {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .project-grid-item {
    width: calc(100% / 2);
  }
}

@media (min-width: 960px) {
  .container {
    padding: 0 64px;
  }

  .project-grid-item {
    width: calc(100% / 2);
  }
}

@media (min-width: 1024px) {
  .project-grid-item {
    width: calc(100% / 3);
  }
}
</style>
