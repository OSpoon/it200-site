# 构建工具Gulp-lesson5

:::tip
这一节我们将从下面这一段代码开始增加内容，来看一下 gulp 的一些产能常用插件和使用的方式。
:::

<!-- more -->

## 前言

大家好，我是[小鑫同学](https://it200.cn/ "https://it200.cn/")。一位从事过**Android开发**、**混合开发**，现在长期从事**前端开发**的编程爱好者，**我觉得在编程之路上最重要的是知识的分享，所谓三人行必有我师**。所以我开始在社区持续输出我所了解到、学习到、工作中遇到的各种编程知识，欢迎有想法、有同感的伙伴加我[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")微信交流~

Gulp 插件列表：<https://gulpjs.com/plugins/>

这一节我们将从下面这一段代码开始增加内容，来看一下 gulp 的一些产能常用插件和使用的方式。

```
const { src, dest } = require("gulp");

function build() {
  return src("src/*.js").pipe(dest("output"));
}

exports.default = build;
```

## [gulp-rename](https://github.com/hparra/gulp-rename)：

可以便捷的在输出编译产物到文件中时对文件命名进行调整，已适应不同的场景。

```
const rename = require("gulp-rename");
```

### 使用固定命名输出：

安装管道：`rename('main.js')`；

```
function build() {
  return src("src/*.js")
  .pipe(rename('main.js'))
  .pipe(dest("output"));
}
```

### 增加特定的标识：

为 rename 的参数提供一个函数，在执行到这个函数时会传入一个 path 对象，包含dirname、basename、extname三个属性，我们这里动态修改basename，为其增加一个当前编译的时间。需要注意的是 return 的结果需要包含 path 完整的三个属性，未修改的我们可以使用结构来赋值。

```
function build() {
  const localTime = new Date().toLocaleTimeString();
  return src("src/*.js")
    .pipe(
      rename(function (path) {
        return {
          ...path,
          basename: `${path.basename}-${localTime}`,
        };
      })
    )
    .pipe(dest("output"));
}
```

还有一个方式就是我们直接修改传入的 path 的值而不去 return 一个全新的对象。

```
function build() {
  const localTime = new Date().toLocaleTimeString();
  return src("src/*.js")
    .pipe(
      rename(function (path) {
        path.basename += `-${localTime}`;
      })
    )
    .pipe(dest("output"));
}
```

## [gulp-uglify](https://github.com/terinjokes/gulp-uglify/)：

可以在我们构建 JavaScript 代码后进行压缩来减小输出产物的体积。

```
const uglify = require('gulp-uglify');
```

```
function build() {
  const localTime = new Date().toLocaleTimeString();
  return src("src/*.js")
  .pipe(uglify())
  .pipe(dest("output"));
}
```

## [gulp-sass](https://github.com/dlmanning/gulp-sass)：

将我们编写的 sass 文件编译为浏览器可以正常识别的 css 文件，我们要同时安装 sass 和 gulp-sass 插件。

```
const sass = require('gulp-sass')(require('sass'));
```

下面的代码是 sass 教程的第一块内容，将变量插入到最后编译的结果中。

```
$nav-color: #F90;
nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}

//编译后

nav {
  width: 100px;
  color: #F90;
}
```

改变我们的 build 任务函数后执行 gulp 得到的产物与👆🏻教程得到了一直的内容：

```
function build() {
  return src("src/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("output/css"));
}
```

## [gulp-open](https://github.com/stevelacy/gulp-open)：

支持我们在编译后打开一个文件或 URL，往往在开发过程中使用的 CLI 都提供了这样的一个功能，方便我们在启动项目后就默认给我们打开了首页。

```
const open = require('gulp-open');
```

```
function build() {
  return src("src/index.html").pipe(open());
}
```

我们还可以增加参数来适配不同的操作系统：

```
const browser =
  os.platform() === "linux"
    ? "google-chrome"
    : os.platform() === "darwin"
    ? "google chrome"
    : os.platform() === "win32"
    ? "chrome"
    : "firefox";

function build() {
  return src("src/index.html").pipe(open({ app: browser }));
}
```

上面的案例我们打开了通过 src 执行的输入的文件路径，我们还可以指定 uri 来打开指定的地址：

```
function build() {
  return src("src/*js").pipe(open({ uri: "http://vp.it200.cn" }));
}
```

## 结语：

我们这里介绍了几个还比较常见的插件，更多的编译场景可以查找合适的插件来使用，我们也可以编写符合特定场景的插件。明天我们继续学习。

* * *

**如果看完觉得有收获，欢迎点赞、评论、分享支持一下。你的支持和肯定，是我坚持写作的动力~**

最后可以关注我@小鑫同学。欢迎[点此扫码加我微信](https://it200.cn/ "https://it200.cn/")[fe-xiaoxin](https://it200.cn/ "https://it200.cn/")交流，共同进步（还可以帮你**fix**🐛）~