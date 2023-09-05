import { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  ...DefaultTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { router } = ctx;
    router.onAfterRouteChanged = (to: string) => {
      if (window["_hmt"]) {
        window["_hmt"].push(["_trackPageview", decodeURIComponent(to)]);
      }
    };
  },
};
