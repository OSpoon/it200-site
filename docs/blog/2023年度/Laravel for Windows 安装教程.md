# Laravel for Windows 安装教程

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

**Laravel** 是基于 **PHP** 的全栈 **Web** 应用框架， 具有渐进式、可扩展和社区化的特点，符合现代化开发框架的特点。
## 必要依赖环境：
创建 **Laravel** 项目所必须依赖的环境包括：[PHP](https://www.php.net/)（基础环境） 和 [Composer](https://getcomposer.org/)（包管理器），在 **Laravel** 新的版本中引入了 **Vitejs** 的模块，所以可以的话最好同时将 [Nodejs](https://nodejs.org/en) 也一起安装。
### 安装并配置 PHP for window：

1. 首先在 [PHP：Downloads](https://windows.php.net/download) 下载最新版本的 **PHP** 环境 **ZIP** 包并全部解压；
2. 接着将解压后的路径添加到系统环境变量的 **Path** ，方便任意位置执行 `php` 命令；
3. 最后在任意位置打开 **终端** ，输入`php -v`后成功输入 **PHP** 版本信息，说明 **PHP** 环境配置就绪。 

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308311636501.png)
### 安装并配置 Composer for window：

1. 首先在 [Composer：downloads](https://getcomposer.org/download/) 下载 **Composer-Setup.exe **可执行文件**；**
2. 接着运行 **Composer-Setup.exe** 可执行文件，期间不需要更改任何选项；
3. 最后重新打开一个 **终端** 窗口，输入 `composer` 后将看到 **Composer** 的版本信息和可以操作的命令。

![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308311637705.png)
## 创建 First Laravel 项目：
有两种方式可以创建 **Laravel** 项目，分别是使用 `composer` 和 `laravel`，接下来将分别演示两种创建项目的方式，并处理创建项目中遇到的一些坎坷。
### 使用 Composer 创建：

- 执行命令：`composer create-project laravel/laravel example-app`；
- 解决创建中断时提示 **php** 版本不匹配及缺少 **fileinfo** 扩展的问题：
```shell
Your requirements could not be resolved to an installable set of packages.

  Problem 1
    - laravel/framework[v10.10.0, ..., v10.21.0] require league/flysystem ^3.8.0 -> satisfiable by league/flysystem[3.8.0, ..., 3.15.1].
    - league/flysystem[3.3.0, ..., 3.14.0] require league/mime-type-detection ^1.0.0 -> satisfiable by league/mime-type-detection[1.0.0, ..., 1.13.0].
    - league/flysystem[3.15.0, ..., 3.15.1] require league/flysystem-local ^3.0.0 -> satisfiable by league/flysystem-local[3.15.0].
    - league/mime-type-detection[1.0.0, ..., 1.3.0] require php ^7.2 -> your php version (8.2.10) does not satisfy that requirement.
    - league/mime-type-detection[1.4.0, ..., 1.13.0] require ext-fileinfo * -> it is missing from your system. Install or enable PHP's fileinfo extension.
    - league/flysystem-local 3.15.0 require ext-fileinfo * -> it is missing from your system. Install or enable PHP's fileinfo extension.
    - Root composer.json requires laravel/framework ^10.10 -> satisfiable by laravel/framework[v10.10.0, ..., v10.21.0].

To enable extensions, verify that they are enabled in your .ini files:
    - C:\php-8.2.10-nts-Win32-vs16-x64\php.ini
You can also run `php --ini` in a terminal to see which files are used by PHP in CLI mode.
Alternatively, you can run Composer with `--ignore-platform-req=ext-fileinfo` to temporarily ignore these required extensions.
```

   1. 暂时忽略版本不匹配的问题；
   2. 启用 **fileinfo** 扩展：回到 **PHP** 的目录，找到 `php.ini`文件，搜索 `;extension=fileinfo`并去除第一位的`;`即开启扩展；
   3. 在终端打开`example-app`手动执行 `composer install`命令，等待后顺利执行成功。
- 启动项目：执行`php artisan serve`后将默认占用 8000 端口运行服务，访问 [http://127.0.0.1:8000](http://127.0.0.1:8000) 即可看到页面信息。
### 使用 Laravel 创建：

- 首先全局安装 **laravel** ：`composer global require laravel/installer`；
- 接着执行创建命令：执行`laravel new example-app`后根据提示选择合适的选项完成项目创建；
- 最后还是启动项目：执行`php artisan serve`，访问 [http://127.0.0.1:8000](http://127.0.0.1:8000) 即可。
