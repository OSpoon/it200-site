import { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  ...DefaultTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { router } = ctx;
    router.onAfterRouteChanged = (to: string) => {
      if (globalThis["_hmt"]) {
        globalThis["_hmt"].push(["_trackPageview", decodeURIComponent(to)]);
      }
    };
  },
};
