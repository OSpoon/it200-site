# webpack生成雪碧图案例

#### 使用到的插件是: `webpack-spritesmith`
#### 依赖项:

1. "webpack-spritesmith": "^1.1.0"
1. "webpack": "^4.29.6"
1. "webpack-cli": "^3.3.0"
#### 预设命令:

1. "build:dev": "npx webpack --mode development"
1. "build:prod": "npx webpack --mode production"
#### 配置webpack.config.js
##### 配置输出模板:
```javascript
// 定义输出模板函数
const templateFunction = function (data) {
    const shared = '.icon { background-image: url(I);background-size: Wpx Hpx;}'
        .replace('I', data.sprites[0].image)
        .replace('W', data.spritesheet.width)
        .replace('H', data.spritesheet.height)

    const perSprite = data.sprites.map(function (sprite) {
        return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
            .replace('N', sprite.name)
            .replace('W', sprite.width)
            .replace('H', sprite.height)
            .replace('X', sprite.offset_x)
            .replace('Y', sprite.offset_y);
    }).join('\n');

    return shared + '\n' + perSprite;
};
```
#### 配置SpritesmithPlugin插件:
```javascript
// 配置插件
new SpritesmithPlugin({
  // 指定处理的图片来源
  src: {
    // 目录
    cwd: path.resolve(__dirname, './src/ico'),
    // 图片类型
    glob: '*.png'
  },
  // 生成的文件夹路径
  target: {
    image: path.resolve(__dirname, './dist/sprite.png'),
    css: [
      [path.resolve(__dirname, './dist/sprite.css'), {
        format: 'function_based_template'
      }]
    ]
  },
  apiOptions: {
    cssImageRef: "sprite.png"
  },
  spritesmithOptions: {
    // 设置图片间的内边距
    padding: 20
  },
  // 自定义生成模板
  customTemplates: {
    'function_based_template': templateFunction
  },
})
```
#### 完整配置文件:
```javascript
const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

// 定义输出模板函数
const templateFunction = function (data) {
    const shared = '.icon { background-image: url(I);background-size: Wpx Hpx;}'
        .replace('I', data.sprites[0].image)
        .replace('W', data.spritesheet.width)
        .replace('H', data.spritesheet.height)

    const perSprite = data.sprites.map(function (sprite) {
        return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
            .replace('N', sprite.name)
            .replace('W', sprite.width)
            .replace('H', sprite.height)
            .replace('X', sprite.offset_x)
            .replace('Y', sprite.offset_y);
    }).join('\n');

    return shared + '\n' + perSprite;
};

// webpack导出配置信息
module.exports = {
    // 入口和出口此场景可忽略,编译抛error才加的不影响
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, './src/.ignore'),
        filename: 'index.js',
    },
    resolve: {
        modules: ["node_modules", "spritesmith-generated"]
    },
    plugins: [
        // 配置插件
        new SpritesmithPlugin({
            // 指定处理的图片来源
            src: {
                // 目录
                cwd: path.resolve(__dirname, './src/ico'),
                // 图片类型
                glob: '*.png'
            },
            // 生成的文件夹路径
            target: {
                image: path.resolve(__dirname, './dist/sprite.png'),
                css: [
                    [path.resolve(__dirname, './dist/sprite.css'), {
                        format: 'function_based_template'
                    }]
                ]
            },
            apiOptions: {
                cssImageRef: "sprite.png"
            },
            spritesmithOptions: {
                // 设置图片间的内边距
                padding: 20
            },
            // 自定义生成模板
            customTemplates: {
                'function_based_template': templateFunction
            },
        })
    ]
};
```
