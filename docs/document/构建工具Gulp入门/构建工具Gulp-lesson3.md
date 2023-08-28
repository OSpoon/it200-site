持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第3天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468)
### 写作背景：
在前面两节提到的任务再 gulp 执行得到了相应的产物，但是当文件修改过后我们依然需要再次执行命令来进行构建，但是在开发过程中，gulp 同样支持我们通过 watch 来对文件进行监控，每当监控到文件变动就触发所关联的构建任务。这样的特性在编程开发中也是最为基础的功能支撑。
### 监控文件：
gulp 对外暴露了 watch 函数来提供文件监控的支持，如下所示：

1. 当 src 目录下的 css 文件有修改动作后将触发对应的css 构建任务；
2. 当 src 目录下的 js 文件有修改动作后将触发一组串行任务，先执行 clean 任务后在进行 javascript 任务；
```javascript
const { watch, series } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

// 可以只关联一个任务
watch('src/*.css', css);
// 或者关联一个任务组合
watch('src/*.js', series(clean, javascript));
```
注：上面的代码来自 gulp 官网；
在文件监控关联的任务更需要注意禁止使用同步任务，同步任务无法确定任务的完成情况，无法在文件变动后再次触发。

### 什么事件可以被监控：
在默认的情况下，文件的创建、更改、删除会触发关联任务的执行。但实际中可能需要监控更多的事件，watch 函数提供的第二个参数 events 将允许我们配置对应的事件，事件列表如：'add'、'addDir'、'change'、'unlink'、'unlinkDir'、'ready'、'error'，另外监控全部的事件可以使用'all'，但除'ready' 和 'error'外。
```javascript
const { watch } = require('gulp');

// 所有事件都将被监控
watch('src/*.js', { events: 'all' }, function(cb) {
  // body omitted
  cb();
});
```
注：上面的代码来自 gulp 官网；
### 立即执行：
在调用 watch 后所关联的任务默认不会立即触发执行，而是需要等第一次触发文件变化的事件后才执行，如果有需要在启动后就立即执行一次，watch 函数提供的参数 2 中支持选项 ignoreInitial 配置为 false 来支持。
```javascript
const { watch } = require('gulp');

// 关联的任务（task）将在启动时执行
watch('src/*.js', { ignoreInitial: false }, function(cb) {
  // body omitted
  cb();
});
```
注：上面的代码来自 gulp 官网；
### 队列应用：
gulp 默认在每次文件变化后都将触发关联任务的执行，短时间内的多次文件变化会将每个任务排队等待依次执行。如过不需要这个特性的支持可以通过 watch 函数的参数 2 选项使得 queue 为 false 来禁止。
```javascript
const { watch } = require('gulp');

// 每次文件修改之后关联任务都将执行（有可能并发执行）
watch('src/*.js', { queue: false }, function(cb) {
  // body omitted
  cb();
});
```
注：上面的代码来自 gulp 官网；
### 延迟应用：
watch 函数的参数 2 选项支持配置 delay 指定毫秒数来延迟在文件变化后触发关联任务的事件，使得我们的短时间内的多次修改启动大量的没有必要的任务。
```javascript
const { watch } = require('gulp');

// 文件第一次修改之后要等待 500 毫秒才执行关联的任务
watch('src/*.js', { delay: 500 }, function(cb) {
  // body omitted
  cb();
});
```

### 结语：
文件监听我在以前也写过一个类似文章来通过 nodejs 的 api 自行实现，可以往前翻一翻，明晚继续学。
