import { type DefaultTheme } from "vitepress";

import fs from "fs-extra";
import path from "node:path";

const paths = ["blog", "document", "navigation"];

export async function sidebar(): Promise<DefaultTheme.Sidebar> {
  const sidebar = paths
    .map((p) => {
      const root = path.resolve(__dirname, `../${p}`);
      const items = fs
        .readdirSync(root)
        .filter((pname) => fs.lstatSync(`${root}/${pname}`).isDirectory())
        .map((dirname) => {
          return {
            text: dirname,
            collapsed: true,
            base: `/${p}/${dirname}/`,
            items: fs.readdirSync(`${root}/${dirname}`).map((filename) => {
              return {
                text: filename.slice(0, -3),
                link: filename.slice(0, -3),
              };
            }),
          };
        });
      return {
        [p]: {
          base: `/${p}/`,
          items: items,
        },
      };
    })
    .reduce((curVuale, preValue) => {
      const key = Object.keys(preValue)[0];
      curVuale[key] = preValue[key];
      return curVuale;
    }, {});
  return sidebar;
}
