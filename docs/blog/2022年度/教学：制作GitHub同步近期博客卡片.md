---
title: 教学：制作 GitHub 同步近期博客卡片
date: '2022-11-15 21:33'
sidebar: 'auto'
categories:
 - 实战案例
tags:
 - Github
 - Node
---

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

:::tip
这几天看到有小伙伴将自己近期更新的博客同步显示到了GitHub主页，这么有趣的小卡片我是一定要尝试一把的，完整的教程我已经整理好了，一起搞起来吧~
:::

<!-- more -->

> 大家好，我是[小鑫同学](https://it200.cn/)。一位长期从事**前端开发**的编程爱好者，**我信奉编程最重要的是分享**。请跟随小鑫同学的步伐，一起带你畅游不一样的前端世界~


这几天看到有小伙伴将自己近期更新的博客同步显示到了GitHub主页，这么有趣的小卡片我是一定要尝试一把的，完整的教程我已经整理好了，一起搞起来吧~
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668515823729-8fbd1a4a-4d82-45cf-9b98-d292140b8191.png#averageHue=%23fbfaf9&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=889&id=u30294b12&margin=%5Bobject%20Object%5D&name=image.png&originHeight=889&originWidth=1898&originalType=binary&ratio=1&rotation=0&showTitle=false&size=248832&status=done&style=none&taskId=u5a74b0ff-b4b6-46b2-801e-a9d1c2e10b2&title=&width=1898)
## 2. 开始教程
### 2.1 实现流程：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668510461179-a9adf4ab-712a-4dc8-9d34-dc8c145df0a4.png#averageHue=%23f7f8f9&clientId=uf74140ce-b8c1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=200&id=u2c328614&margin=%5Bobject%20Object%5D&name=image.png&originHeight=200&originWidth=760&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33853&status=done&style=none&taskId=uca6c8e86-a073-4db4-b100-1a4e5a44a78&title=&width=760)
Github的主页装修主要讲的就是主页的Markdown文档，当我们访问Github的主页时，Markdown内嵌的`img`标签就会对文章卡片接口发起请求，经服务器对博客站点提供的`RSS`数据解析转换并生成卡片数据（`svg`）返回到Github，完成了博客卡片的一次渲染过程；
### 2.2 环境配置：

- Vercel部署：[https://vercel.com/](https://vercel.com/)
- 依赖模块：
| axios | 发起请求用来转换RSS数据（XML to JSON） |
| --- | --- |
| art-template | Html模板引擎快速生成SVG数据 |
| @vercel/node | 实现博客卡片接口 |

- 目录结构主要由api、generators、parsers组成：
```
github-readme-recent-article  
├─ api                        
│  └─ blog                    
│     └─ [index].ts           
├─ generators                 
│  ├─ index.ts                
│  ├─ logo.ts                 
│  └─ template.html           
├─ parsers                    
│  └─ index.ts                
├─ logo.png                   
├─ package-lock.json          
├─ package.json               
├─ readme.md                  
└─ vercel.json
```
## 3. 开始编码
### 3.1 编写分析器：
> 分析器主要用来解析博客站点提供的RSS数据。并返回指定序号的文章数据，用来生成一张文章卡片~

提供`getArticle`函数获取指定序号的文章数据，其中使用到在线服务`https://api.rss2json.com/v1/api.json?{rss_url}`来转换RSS数据，因为我们操作JSON要不XML更加的方便：
```typescript
import axios from 'axios';

export const getArticle = async (index) => {
  // 通过在线服务将RSS默认的xml数据转换为JSON格式
  const originUrl = 'https://it200.cn/rss.xml';
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${originUrl}`;
  const { data: { items } } = await axios.get(rssUrl);
  const { title, pubDate: date, link: url, description } = items[
    index || 0
    ];
  return {
    title: title.length > 20 ? title.substring(0, 20) + ' ...' : title,
    url,
    date,
    description:
      description
      .replace(/<h3>.*<\/h3>|<figcaption>.*<\/figcaption>|<[^>]*>/gm, '')
      .substring(0, 30) + '...',
  };
}
```
### 3.2 编写文章卡片生成器：
> 由接口返回的数组组合成完成的SVG数据

文章卡片数据是一个SVG字符串组成，这样的话使用`art-template`模块将是一个不错的选择，通过导出的`template`函数很方便的获取的完整SVG数据来返回到Github：
```typescript
import template from "art-template";
import {logo} from "./logo";

export const genArticleCard = (options: {
    title: string,
    url: string,
    date: string,
    description: string,
}) => {
    const { title, url, date, description } = options;
    return template(`${__dirname}/template.html`, {
        logo,
        title,
        url,
        date,
        description,
    });
}
```
`art-template`模块同样使用的是`Mustache`语法：
```html
<svg fill="none" width="500" height="100" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        ...
      </style>
      <div class="container">
        <img src="{{logo}}" />
        <div>
          <h3>{{title}}</h3>
          <small>{{date}}</small>
          <p>{{description}}</p>
        </div>
      </div>
    </div>
  </foreignObject>
</svg>
```
注意：在使用时发现`Logo`在`Github`渲染时出现了跨域的现象，所以我选择直接使用`base64`字符串来替换；
### 3.3 编写接口：
> 我们选择部署到`Vercel`，接口编写使用`Vercel`的规则；

在项目根目录的配置文件中标明了接口的`ROOT`地址，`[index]`对应着请求时传递的文章序号参数：

- 接口地址定义：`api\blog\[index].ts`
- 接口实际地址：`[https://root-url/blog/0](https://github-readme-recent-article.vercel.app/blog/0)`
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```
解析请求参数中的`index`传到解析器中获取指定的文章数据，再将文章数据交由卡片生成器组装数据并返回到请求方：
```typescript
import { NowRequest, NowResponse } from '@vercel/node';
import { getArticle } from '../../parsers/index';
import { genArticleCard } from '../../generators';

export default async (req: NowRequest, res: NowResponse) => {
  const { query: { index } } = req;
  const { title, url, date, description } = await getArticle(index);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.send(
    genArticleCard({
      title,
      url,
      date,
      description,
    })
  );
}
```
### 3.4 `Vercel`部署：
访问[https://vercel.com/new](https://vercel.com/new)页面开始新项目的部署，第一次部署完成后，后续将自动进行部署：
选择你要部署的项目，比如说我刚创建的第一个项目，点击`import`：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668517891256-9217a53d-c836-41ca-a63a-41965a95668e.png#averageHue=%23f9f9f9&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=913&id=u016a813b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=913&originWidth=1899&originalType=binary&ratio=1&rotation=0&showTitle=false&size=159543&status=done&style=none&taskId=u80f0daa1-ab31-4135-bff8-c1bfd4b38a7&title=&width=1899)
不需要做更多的设置可以直接点击`Deploy`开始部署：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668517914689-c064ba51-16ba-4b96-89a2-bd6f24ca80b1.png#averageHue=%23faf9f9&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=867&id=u8208017e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=867&originWidth=1898&originalType=binary&ratio=1&rotation=0&showTitle=false&size=70941&status=done&style=none&taskId=u6c4a1c21-3552-402d-95d9-5b0c88be359&title=&width=1898)
部署完成后就得到了项目的访问地址，如分配给我这个项目的[github-readme-recent-article.vercel.app](https://github-readme-recent-article.vercel.app/)：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668518010643-27956853-cf92-4190-ae4e-aaff41fbdf88.png#averageHue=%23fafafa&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=910&id=ua9f42205&margin=%5Bobject%20Object%5D&name=image.png&originHeight=910&originWidth=1902&originalType=binary&ratio=1&rotation=0&showTitle=false&size=87084&status=done&style=none&taskId=u15a85ed6-84a4-4b17-89c9-83df22274fa&title=&width=1902)
通过`get`形式获取序号`0`所对应的文章卡片：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668518118795-49af7fd7-2f1a-4048-acc0-2763ccfaa195.png#averageHue=%23fcfbfb&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=356&id=u41d3512f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=356&originWidth=913&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28634&status=done&style=none&taskId=uaf773501-f3b8-4f5e-b678-5bc17b15b1a&title=&width=913)
## 4. 更新Github主页：
> 加入如下的内容来获取近3篇写的博客的卡片吧~

```markdown
#### 🚀 近期笔记

<a target="_blank" href="https://it200.cn/">
  <img src="https://github-readme-recent-article.vercel.app/blog/0">
</a>

<a target="_blank" href="https://it200.cn/">
  <img src="https://github-readme-recent-article.vercel.app/blog/1">
</a>

<a target="_blank" href="https://it200.cn/">
  <img src="https://github-readme-recent-article.vercel.app/blog/2">
</a>
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2373519/1668518321172-193dc039-21fe-4539-8736-ce35ef33225b.png#averageHue=%23fbfafa&clientId=ub1b69c7f-1eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=765&id=u8747c51d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=765&originWidth=905&originalType=binary&ratio=1&rotation=0&showTitle=false&size=94288&status=done&style=none&taskId=u95b7809b-2842-49b5-a11a-2f1195fc998&title=&width=905)
## 3. 总结
使用了`120`行左右的代码就实现了这个文章卡片在Github主页的展示，完整的代码已经上传至Github，欢迎你也尝试一下这个小巧的功能~
> 本文项目已推送至GitHub，欢迎克隆演示：`git clone git@github.com:OSpoon/github-readme-recent-article.git`


---

**如果看完觉得有收获，欢迎点赞、评论、分享支持一下。你的支持和肯定，是我坚持写作的动力~**
最后可以关注我@小鑫同学。欢迎[点此扫码加我](https://it200.cn/)交流，共同进步（还可以帮你**fix**🐛）~
