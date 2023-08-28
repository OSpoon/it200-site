持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第2天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468)
### 写作背景
Gulp 在编写时和其他构建工具的最大区别就是 Gulp 基于编码而非配置，编码的基础单元又是任务，在上一节学习后我们就可以先一个任务了，那么这一节就详细了解一些任务再 Gulp 中的重要作用吧。
### 任务：
在 Gulp 中任务按访问的形式可以分为公开任务和私有任务，在使用 gulp 执行构建时读取的就是公开任务列表，所以说我们需要通过 gulp 命令来执行的时候就需要将这个任务导出，就代码这个任务是公开的了。有一些不需要直接通弄过 Gulp 命令执行的任务就不用导出就是私有任务了。

通过下面的代码示例来看一下按访问形式划分的任务：
```javascript
const { series } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```
在上面的任务定义中，可已看到 build 任务最终有被导出，所以说 build 是一个公开任务，clean 任务并没有导出，但是被装到了 series 中，但它依然是一个私有任务。
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281109351.png)
注：代码内容来自 gulp 官网；在以前的版本 gulp 是允许使用_task_ 函数来注册任务的，同样这个特性也有保留，以便我们在无法使用导出模块的语法的特殊状况下使用。
### 组合任务：
任务按组合的方式可以分为串行任务和并行任务，在 Gulp 中暴露了 series 和 parallel 来将任务进行组合，并且支持组合嵌套，比如说多个并行的任务中的每个任务都可能是一个串行任务或并行任务。

**下面的代码演示了串行任务的组合方式：**
```javascript
const { series } = require('gulp');

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
```
注：代码内容来自 gulp 官网；

**下面的代码演示了并行任务的组合方式：**
```javascript
const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```
注：代码内容来自 gulp 官网；

**下面的代码演示了相互组合的任务形式：**
```javascript
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```
注：代码内容来自 gulp 官网；

### 结语：
灵活的任务组合方式在构建过程中一定要比配置的编写更加轻松，明晚继续学。
