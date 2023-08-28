# 【入门教程】Rollup模块打包器整合

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

Rollup 是一个用于 JavaScript 的模块打包器，它将小段代码编译成更大更复杂的东西，例如库或应用程序。它对 JavaScript 的 ES6 修订版中包含的代码模块使用新的标准化格式，而不是以前的特殊解决方案，例如 CommonJS 和 AMD。 ES 模块让您可以自由无缝地组合您最喜欢的库中最有用的单个函数。这最终将在任何地方本地实现，但 Rollup 让您今天就可以做到。————《rollupjs.org》

## 特点：

1.  选用ES6标准模块化格式；
2.  支持静态分析导入代码进行Tree-Shaking。

## 兼容：

1.  支持导入CommonJs模块；
2.  方便使用到CommonJS模块的工具，如：Node.js、webpack。

## ES 模块语法：

思维导图地址：[es模块语法](https://link.juejin.cn/?target=https%3A%2F%2Fwww.processon.com%2Fview%2Flink%2F625fda48f346fb0727870787 "https://www.processon.com/view/link/625fda48f346fb0727870787")

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281459718.png)

## 快速开始：

### 常见编译输出风格：

| 命名 | 风格 | 适用 |
| --- | --- | --- |
| iife | 立即执行函数 | 浏览器 |
| cjs | CommonJs | NodeJs |
| umd | 通用模块定义 | 浏览器/NodeJs |

### 编译案例演示：

rollup采用ES6标准模块化格式

#### 定义一个待编译的ES6模块：

```
// 文件名：main.js
const main = {
    hello: () => {
        console.log('Hello');
    },
    world: () => {
        console.log('World');
    },
};
export default main;

```

#### 编译为IIFE风格：

##### 命令示例：

```
rollup <入口文件> --file <输出文件> --name <输出模块名称> --format <输出模块类型>

```

注意：name为推荐选项，未指明打包后的模块名称，虽然打包产物可以正常加载但无法触发执行。

##### 编译命令：

```
rollup .\main.js --file bundle.iife.js --name myBundle --format iife

```

##### 输出产物：

```
// 文件名：bundle.iife.js
var myBundle = (function () {
    'use strict';

    const main = {
        hello: () => {
            console.log('Hello');
            return 'Hello';
        },
        world: () => {
            console.log('World');
            return 'World';
        },
    };

    return main;

})();

```

##### 在浏览器中使用：

```
<head>
    <script src="../bundle.iife.js"></script>
</head>

<body>
    <script>
        myBundle.hello();
    </script>
</body>

```

#### 编译为CJS风格：

##### 命令示例：

```
rollup <入口文件> --file <输出文件> --exports <导出模式> --format <输出模块类型>

```

注意：exports为推荐选项，当使用默认导出时将抛出警告，建议使用命名导出。

##### 编译命令：

```
rollup .\main.js --file bundle.cjs.js --exports auto --format cjs

```

##### 输出产物：

```
// 文件名：bundle.cjs.js
'use strict';

const main = {
    hello: () => {
        console.log('Hello');
    },
    world: () => {
        console.log('World');
    },
};

module.exports = main;

```

##### 在Node环境中使用：

```
const main = require('../bundle.cjs.js');
console.log(main.hello());

```

#### 编译为UMD风格：

##### 命令示例：

```
rollup <入口文件> --file <输出文件> --name <输出模块名称> --format <输出模块类型>

```

注意：name为必填项，缺少后将抛出异常，打包产物在没有模块加载的环境将无法使用。

##### 编译命令：

```
rollup main.js --file bundle.umd.js  --name myBundle --format umd

```

##### 输出产物：

```
// 文件名：bundle.umd.js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myBundle = factory());
})(this, (function () { 'use strict';

    const main = {
        hello: () => {
            console.log('Hello');
        },
        world: () => {
            console.log('World');
        },
    };

    return main;

}));

```

##### 在浏览器中使用：

```
<head>
    <script src="../bundle.umd.js"></script>
</head>

<body>
    <div id="content"></div>
    <script>
        const output = myBundle.hello();
        document.getElementById("content").innerHTML = output
    </script>
</body>

```

##### 在Node环境中使用：

```
const main = require('../bundle.umd.js');
console.log(main.hello());

```

## 使用配置文件：

虽然在命令行可以完成大量的编译配置，但是同样提供了通过配置文件的方式来进行简化。

使用配置文件说明：

1.  使用ES6模块导出风格编写配置文件：建议将扩展名修改成.mjs，执行期间会快速转换为CommonJS使用。
2.  使用CommonJs模块导出风格编写配置文件：将扩展名修改成.cjs，NodeJs13+将阻止Rollup进行转义。
3.  使用ts来编写配置文件：需要在执行命令时指定configPlugin为typescript。

#### 典型配置文件：

下面是一个典型的使用ES6模块默认导出风格的配置，将main.js文件编译为CommonJs模块风格，输出到bundle.js中。

```
// 文件名称：rollup.config.js
export default {
    input: 'main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs',
        exports: 'auto'
    },
};

```

#### 多入口，多出口配置文件：

下面是一个支持同时编译多个入口文件，且支持同时编译成多种模块风格的参考配置：

```
export default [
  {
    input: 'main-a.js',
    output: {
      file: 'dist/bundle-a.js',
      format: 'cjs'
    }
  },
  {
    input: 'main-b.js',
    output: [
      {
        file: 'dist/bundle-b1.js',
        format: 'cjs'
      },
      {
        file: 'dist/bundle-b2.js',
        format: 'es'
      }
    ]
  }
];

```

#### 异步创建配置文件：

支持我们通过异步的形式创建配置文件，例如我们的配置文件放置在云端，我们就可以通过fetch来获取不同的配置后再进行编译：

```
import fetch from 'node-fetch';
export default fetch('<某个远程服务或文件返回实际配置>');

// or
export default Promise.all([fetch('get-config-1'), fetch('get-config-2')]);

```

#### 使用配置文件：

通过命令的config选项来指明配置文件。

##### 显示执行

```
rollup --config my.config.js

```

##### 隐式执行

执行顺序：rollup.config.mjs -> rollup.config.cjs -> rollup.config.js

```
rollup --config

```

#### 自定义命令行选项：

在下面的配置文件中我们导入了两份提前写好的不同环境的配置文件，我们通过接收命令行传入的“configDebug”选项来选择使用哪一个配置文件进行执行。默认情况下命令行传入的选项的优先级最高，当然也可以在解析到传入的选项后进行拦截删除。

```
// rollup.config.js
import defaultConfig from './rollup.default.config.js';
import debugConfig from './rollup.debug.config.js';

export default commandLineArgs => {
  if (commandLineArgs.configDebug === true) {
    return debugConfig;
  }
  return defaultConfig;
};

```

#### 编程提示：

Rollup附带了TypeScript类型，可以通过IDE的智能提示和JSDoc进行编写时的提示。也可以使用Rollup提供的帮助程序完成，如下：

```
// rollup.config.js
import { defineConfig } from 'rollup';

export default defineConfig({
  // ...
});

```

#### Node 13+注意事项：

1.  只能从 CommonJS 插件中获得默认导出；
2.  无法直接导入 JSON 文件使用；

```
// load-package.cjs
module.exports = require('./package.json');

// rollup.config.mjs
import pkg from './load-package.cjs';
...

```

#### 配置大全：

下面是摘录自[rollupjs.org](https://link.juejin.cn/?target=https%3A%2F%2Frollupjs.org%2Fguide%2Fen%2F%23configuration-files "https://rollupjs.org/guide/en/#configuration-files")，的配置大全：

```
export default {
  // 核心输入选项
  external,
  input, // conditionally required
  plugins,

  // 高级输入选项
  cache,
  onwarn,
  preserveEntrySignatures,
  strictDeprecations,

  // danger zone
  acorn,
  acornInjectPlugins,
  context,
  moduleContext,
  preserveSymlinks,
  shimMissingExports,
  treeshake,

  // 实验性的配置
  experimentalCacheExpiry,
  perf,

  // 必需的(可以是一个数组，用于多个输出)
  output: {
    // 核心输出选项
    dir,
    file,
    format, // required
    globals,
    name,
    plugins,

    // 高级输出选项
    assetFileNames,
    banner,
    chunkFileNames,
    compact,
    entryFileNames,
    extend,
    footer,
    hoistTransitiveImports,
    inlineDynamicImports,
    interop,
    intro,
    manualChunks,
    minifyInternalExports,
    outro,
    paths,
    preserveModules,
    preserveModulesRoot,
    sourcemap,
    sourcemapExcludeSources,
    sourcemapFile,
    sourcemapPathTransform,
    validate,

    // danger zone
    amd,
    esModule,
    exports,
    externalLiveBindings,
    freeze,
    indent,
    namespaceToStringTag,
    noConflict,
    preferConst,
    sanitizeFileName,
    strict,
    systemNullSetters
  },

  watch: {
    buildDelay,
    chokidar,
    clearScreen,
    skipWrite,
    exclude,
    include
  }
};

```

#### 命令行参数大全：

下面是摘录自[rollupjs.org](https://link.juejin.cn/?target=https%3A%2F%2Frollupjs.org%2Fguide%2Fen%2F%23configuration-files "https://rollupjs.org/guide/en/#configuration-files")，的命令行参数大全：

| 简写 | 命令 | 参数 | 用途 |
| --- | --- | --- | --- |
| \-c | \--config | filename | Use this config file (if argument is used but valueis unspecified, defaults to rollup.config.js) |
| \-d | \--dir | dirname | Directory for chunks (if absent, prints to stdout) |
| \-e | \--external | ids | Comma-separate list of module IDs to exclude |
| \-f | \--format | format | Type of output (amd, cjs, es, iife, umd, system) |
| \-g | \--globals | pairs | Comma-separate list of `moduleID:Global`pairs |
| \-h | \--help |  | Show this help message |
| \-i | \--input | filename | Input (alternative to ) |
| \-m | \--sourcemap |  | Generate sourcemap (`-m inline`for inline map) |
| \-n | \--name | name | Name for UMD export |
| \-o | \--file | output | Single output file (if absent, prints to stdout) |
| \-p | \--plugin | plugin | Use the plugin specified (may be repeated) |
| \-v | \--version |  | Show version number |
| \-w | \--watch |  | Watch files in bundle and rebuild on changes |
|  | \--amd.id | id | ID for AMD module (default is anonymous) |
|  | \--amd.autoId |  | Generate the AMD ID based off the chunk name |
|  | \--amd.basePath | prefix | Path to prepend to auto generated AMD ID |
|  | \--amd.define | name | Function to use in place of `define` |
|  | \--assetFileNames | pattern | Name pattern for emitted assets |
|  | \--banner | text | Code to insert at top of bundle (outside wrapper) |
|  | \--chunkFileNames | pattern | Name pattern for emitted secondary chunks |
|  | \--compact |  | Minify wrapper code |
|  | \--context | variable | Specify top-level `this`value |
|  | \--entryFileNames | pattern | Name pattern for emitted entry chunks |
|  | \--environment | values | Settings passed to config file (see example) |
|  | \--no-esModule |  | Do not add \_\_esModule property |
|  | \--exports | mode | Specify export mode (auto, default, named, none) |
|  | \--extend |  | Extend global variable defined by --name |
|  | \--no-externalLiveBindings |  | Do not generate code to support live bindings |
|  | \--failAfterWarnings |  | Exit with an error if the build produced warnings |
|  | \--footer | text | Code to insert at end of bundle (outside wrapper) |
|  | \--no-freeze |  | Do not freeze namespace objects |
|  | \--no-hoistTransitiveImports |  | Do not hoist transitive imports into entry chunks |
|  | \--no-indent |  | Don't indent result |
|  | \--no-interop |  | Do not include interop block |
|  | \--inlineDynamicImports |  | Create single bundle when using dynamic imports |
|  | \--intro | text | Code to insert at top of bundle (inside wrapper) |
|  | \--minifyInternalExports |  | Force or disable minification of internal exports |
|  | \--namespaceToStringTag |  | Create proper `.toString`methods for namespaces |
|  | \--noConflict |  | Generate a noConflict method for UMD globals |
|  | \--outro | text | Code to insert at end of bundle (inside wrapper) |
|  | \--preferConst |  | Use `const`instead of `var`for exports |
|  | \--no-preserveEntrySignatures |  | Avoid facade chunks for entry points |
|  | \--preserveModules |  | Preserve module structure |
|  | \--preserveModulesRoot |  | Put preserved modules under this path at root level |
|  | \--preserveSymlinks |  | Do not follow symlinks when resolving files |
|  | \--no-sanitizeFileName |  | Do not replace invalid characters in file names |
|  | \--shimMissingExports |  | Create shim variables for missing exports |
|  | \--silent |  | Don't print warnings |
|  | \--sourcemapExcludeSources |  | Do not include source code in source maps |
|  | \--sourcemapFile | file | Specify bundle position for source maps |
|  | \--stdin=ext |  | Specify file extension used for stdin input |
|  | \--no-stdin |  | Do not read "-" from stdin |
|  | \--no-strict |  | Don't emit `"use strict";`in the generated modules |

## 编译完整版流程：

### 准备基础环境：

1.  安装rollup，并使用rollup命令验证；
2.  创建目录，准备内容；

```
src
├─── main.js
└─── foo.js

```
```
// src/main.js
import foo from './foo.js';
export default function () {
    console.log(foo);
}

```
```
// src/foo.js
export default 'hello world!';

```

3.  只编译，不输出到文件：

执行命令：rollup src/main.js -f cjs

```
// 输出内容
'use strict';

var foo = 'hello world!';

function main () {
    console.log(foo);
}

module.exports = main;

```

4.  编译并输出到bundle文件：

执行命令：rollup src/main.js -o bundle.js -f cjs

```
// 输出内容
'use strict';

var foo = 'hello world!';

function main () {
    console.log(foo);
}

module.exports = main;

```

5.  在node中使用这个bundle文件：

```
node
> var myBundle = require('./bundle.js');
> myBundle();
'hello world!'

```

### 使用配置文件：

创建rollup.config.js配置文件，执行命令缩短为：rollup -c。

```
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};

```

### 使用插件：

[awesome](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frollup%2Fawesome "https://github.com/rollup/awesome")

#### 为了安装插件需要更新项目环境:

1.  初始化目录：npm init -y；
2.  安装处理JSON文件的开发依赖：@rollup/plugin-json；

#### 更新main.js，支持读取package.json：

```
import { version } from '../package.json';

export default function () {
  console.log('version ' + version);
}

```

#### 更新配置文件，配置安装的@rollup/plugin-json插件：

```
// rollup.config.js
import json from '@rollup/plugin-json';

export default {
  ...
  plugins: [json()]
};

```

#### 再次编译并在node中使用：

编译后的产物将只包含使用到得version，体现了Tree-Shaking的作用。

```
'use strict';

var version = "1.0.0";

function main () {
    console.log('version ' + version);
}

module.exports = main;

```
```
node
> var myBundle = require('./bundle.js');
> myBundle();
version 1.0.0

```

### 使用针对输出的插件：

#### 使用rollup-plugin-terser插件对输出内容压缩：

```
// rollup.config.js
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'bundle.js',
            format: 'cjs',
        },
        // 针对iife风格的输出处理
        {
            file: 'bundle.min.js',
            format: 'iife',
            name: 'version',
            plugins: [terser()],
        },
    ],
    plugins: [json()],
};

```

#### iife风格的输出产物将被压缩成一行：

```
var version=function(){"use strict";return function(){console.log("hello world!"),console.log("version 1.0.0")}}();

```