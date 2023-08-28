持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第1天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468)
### Gulp 介绍
 Gulp 是基于定义的每个任务或任务组合来完成的一款构建工具，任务函数的编写一定的由于配置的体验，另外它基于 node 中强大的流的能力，可在内存中集中处理后再存入磁盘，加速构建。
### 文件处理：
每一个构建任务我们默认定义到 `gulpfile.js` 文件中，通过执行 `gulp --tasks` 可以查看到当前所定义的公共任务任务列表，通过执行 gulp 即可执行我们对外暴露的公共任务。
#### src 函数和 dest 函数：
**gulp** 对外暴露的 **src** 函数和 **dest** 函数对应就是我们待处理文件的入口和处理完成后文件的出口。**src **函数将输入的文件读取为一个 **stream** 对象，并运用了**stream **的主要特点  **pipe** 。

通过下面的代码指定了要编译的文件是当前目录下 src 内的 js 文件：
```javascript
const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

#### 导入转换插件：
构建工具仅提供了框架，我们要做的具体构建的需求还是要通过具体的插件来实现，我们这里安装下` gulp-babel`，并导入到 gulpfile 中。pipe 的应用使得我们可以在合适的位置安装一节（管道）来处理。所以我们在输出前使用管道来对 js 文件做语法转换。

通过下面的代码中安装操作 babel 的管道实现语法的转换：
```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```
#### 接着添加文件：
当我们在一个任务中进行了一部分的转换后，我们还可以安装一节管道来再次使用 src 函数导入部分文件来，一开始处理的 src/*js 和后添加的vendor/*.js 中的文件内容都会经过后面的管道进行处理。

下面的代码中对不需要进行语法转换的文件可以稍后加入任务再统一输入到后面的管道统一处理：
```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}
```
#### 分段输出：
在构建过程中我们可以将语法编译后的内容先输出一份，接着再输出一份被压缩混淆过的另一份资源，就不用我们每次编译都从头再来了，节省构建时间。

下面的代码分别生成了一份为混淆的版本和一份已混淆的版本，并且混淆的版本还做了重命名了处理：
```javascript
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```
### 结语：
以上了案例来自 Gulp 文档，流式的构建处理确实别有一番感觉，明晚继续学。
