# 教学：制作 GitHub 同步近期博客卡片

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

这几天看到有小伙伴将自己近期更新的博客同步显示到了GitHub主页，这么有趣的小卡片我是一定要尝试一把的，完整的教程我已经整理好了，一起搞起来吧~
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290940063.png)
## 2. 开始教程
### 2.1 实现流程：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290942676.png)
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
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290943038.png)
不需要做更多的设置可以直接点击`Deploy`开始部署：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290944065.png)
部署完成后就得到了项目的访问地址，如分配给我这个项目的[github-readme-recent-article.vercel.app](https://github-readme-recent-article.vercel.app/)：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290944914.png)
通过`get`形式获取序号`0`所对应的文章卡片：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290944603.png)
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
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308290944791.png)
## 3. 总结
使用了`120`行左右的代码就实现了这个文章卡片在Github主页的展示，完整的代码已经上传至Github，欢迎你也尝试一下这个小巧的功能~
> 本文项目已推送至GitHub，欢迎克隆演示：`git clone git@github.com:OSpoon/github-readme-recent-article.git`