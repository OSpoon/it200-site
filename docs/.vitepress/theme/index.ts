import { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  ...DefaultTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    const { router } = ctx;
    router.onAfterRouteChanged = (to: string) => {
      if (window["_hmt"]) {
        console.log(decodeURIComponent(to))
        window["_hmt"].push(["_trackPageview", decodeURIComponent(to)]);
      }
    };
  },
};
