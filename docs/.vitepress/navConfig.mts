import { type DefaultTheme } from "vitepress";

import fs from "fs-extra";
import path from "node:path";

const blog = "blog";
const document = "document";

async function genNavItems(dir) {
  const root = path.resolve(__dirname, `../${dir}`);
  return await fs
    .readdirSync(root)
    .filter((pname) => fs.lstatSync(`${root}/${pname}`).isDirectory())
    .map((dirname) => {
      const files = fs.readdirSync(`${root}/${dirname}`);
      return {
        text: dirname,
        link: `/${dir}/${dirname}/${files[0] || ""}`,
        activeMatch: `/${dir}/${dirname}/`,
      };
    });
}

export async function nav(): Promise<DefaultTheme.NavItem[]> {
  return [
    {
      text: "写作之路",
      items: await genNavItems(blog),
    },
    {
      text: "系列开发教程",
      items: await genNavItems(document),
    },
  ];
}
