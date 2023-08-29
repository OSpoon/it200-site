# 案例体验HTTP2.0多路复用

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

HTTP协议经历了20多年的演进在2018年来到了HTTP3.0的时代，到现在时间HTTP2.0已经在大多数的主流站点得到了广泛的使用，可是你的网站升级到2.0版本了吗？今天就通过示例来演示如何从1.1版本升级到2.0版本，体验一下2.0版本的多路复用究竟能不能优化现有的站点呢？

## 1. 使用NodeJs实现HTTP2.0
在下面的网页中包含了24张图片，在HTTP1.1版本的时候受浏览器限制，同一域名同时发起的请求数量将限制在6~8次。在HTTP2.0采用多路复用替换的原来的机制，相同域名也只占用同一个TCP链接完成数据交换。
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTTP、HTTP2</title>
  </head>
  <body>
    <img width="30%" height="20%" src="images/1e2b54c596f813e44138769b2e76f169.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/5dce78ea79845fcf2f1b62dbf3acf620.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/7ad706b7e6e0442cea9d4e0347cd487d.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/9d90986693450e14afe74db3a05e336a.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/46f3da0e924a0b798bfe461759b8779c.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/47d28a384c0aefea2d4152a7805a132a.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/75c804f11e2f9b3d3ad9adf6f143ac22.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/94bddbdc4d93fcf58b9e46b3feabee8e.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/500e4caf9a5b392fac176bc8dae8fb40.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/86627adf5e44df12be9e7ee436b6a28d.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/ae8e846f6fd915c67e26ab59fb1bf655.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/c22e0ae61c5759134c46ef1a63fc746e.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/c45b5212ef77b3f9b16660faef173517.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/c540e2e5a1aa4209c92ab9a4a7e3018d.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/c5734d100410e544e91edbcb7608d8bc.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/cde25fb6bd5df4ff66930faece0779f5.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/cfc76fef4149c84ee6bb82a251171f60.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/d383e4bd00949edf2b301ffb7585e8aa.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/e240d3b230d4fe71f9ef64e0bf855c3b.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/e528b014d2c0a4b69b5e58c61bfe47e7.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/f917bfe3a042f91b4213d53b383ca1fa.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/08e5d3f7c7d9e46bf0072f3296147f55.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/887a346047f75aca61108f06f07de9cc.jpeg" alt="" srcset="" />
    <img width="30%" height="20%" src="images/3e12a1db86d48b881acbc2b7d24d995e.jpeg" alt="" srcset="" />
  </body>
</html>
```
### 1.1 编写HTTP1.1版本案例：
在NodeJs中http包默认使用的就是HTTP1.1版本协议，通过`createServer`函数实现默认和图片访问的两种响应方式：
```typescript
import http from "node:http";
import fs from "node:fs";
import cp from "node:child_process";

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    const html = fs.readFileSync("index.html");
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
    });
    res.write(html);
    res.end();
  } else if (url?.startsWith("/images/")) {
    const img = fs.readFileSync(`.${url}`);
    res.writeHead(200, {
      "content-type": "image/*",
    });
    res.write(img);
    res.end();
  }
});

server.listen(8553, () => {
  console.log("> HTTP服务启动成功");
  cp.exec("start http://localhost:8553");
});
```
注：使用`child_process`模块在服务启动后自动打开默认浏览器并跳转到`[http://localhost:8553](http://localhost:8553)`；
### 1.2 编写HTTP2.0版本案例：
在使用HTTP2.0版本时需要同时支持HTTPS安全协议，我们就需要生成一份自签名证书，生成自签名证书可以使用[mkcert](https://github.com/FiloSottile/mkcert)开源项目：
```shell
# install mkcert from scoop
scoop bucket add extras
scoop install mkcert
```
注：安装时请注意要科学一点；

HTTP2.0版本协议在NodeJs中的http2模块中得到支持，使用时请注意NodeJs版本，我们在体验一些功能时做好切换NodeJs到较高的版本；

使用NodeJs中的http2模块实现案例，支持默认和图片访问的两种响应方式：
```typescript
import http2 from "node:http2";
import fs from "node:fs";
import cp from "node:child_process";

// 配置自签名证书
const server = http2.createSecureServer({
  key: fs.readFileSync("./keys/localhost-key.pem"),
  cert: fs.readFileSync("./keys/localhost.pem"),
});

server.on("error", (err) => console.log(err));

server.on("stream", (stream, headers) => {
  const path = headers[":path"];
  if (path === "/") {
    const html = fs.readFileSync("index.html");
    stream.respond({
      "content-type": "text/html; charset=utf-8",
      ":status": 200,
    });
    stream.write(html);
    stream.end();
  } else if (path?.startsWith("/images/")) {
    const img = fs.readFileSync(`.${path}`);
    stream.respond({
      "content-type": "image/*",
      ":status": 200,
    });
    stream.write(img);
    stream.end();
  }
});

server.listen(8443, () => {
  console.log("> HTTP2服务启动成功");
  cp.exec("start https://localhost:8443");
});
```
### 1.3 添加脚本并启动案例：
#### 1.3.1 添加两个版本的启动脚本：
```json
{
  "scripts": {
    "http": "npx esno ./server-http.ts",
    "http2": "npx esno ./server-http2.ts"
  }
}
```
#### 1.3.2 开启版本协议查看：
使用**Chrome**浏览器通过NetWork来观察网络请求情况时默认不支持协议版本的查看，或者查看不方便，这里可以启用一下：
![开启Chrome中协议版本查看.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291001746.gif)
#### 1.3.3 调整浏览器网络请求速度：
在浏览器中调整网速来模拟慢网络下数据加载，方便观察请求的访问情况；
![切换网络速度.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291001621.gif)
#### 1.3.4 查看HTTP1.1下网络请求数限制：
在1.1版本中很明显看到网络在分批加载并且后续的网络需要等待前面网络请求完成后开始；
![nodejs-http1.1版本请求观察.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291001905.gif)
#### 1.3.5 查看HTTP2.0下网络请求同时进行：
在2.0版本中看到几乎所有的请求都在同一时间发起，充分利用网络带宽的优势来同服务器进行数据的交换；
![nodejs-http2.0版本请求观察.gif](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291002438.gif)
## 2. 为Nginx开启HTTP2.0：
Nginx版本和OpenSSL版本都有一定的要求，在实战使用时请注意版本问题，目前我在Win本上使用的Nginx版本是`1.22.1`，OpenSSL版本是`1.1.1k  25 Mar 2021`；
```
nginx                                           
├─ conf                                         
│  ├─ ...                              
│  └─ nginx.conf                                   
├─ html                                         
│  ├─ images                                    
│  │  ├─ ...  
│  │  └─ f917bfe3a042f91b4213d53b383ca1fa.jpeg  
│  └─ index.html                                                             
└─ nginx.exe                                    
```
### 2.1 配置默认HTTP1.1版本：
```
server {
    listen       80;
    server_name  localhost;

    location / {
        root   html;
        index  index.html index.htm;
    }

    location /images/* {
        root   html;
    }
}
```
### 2.2 配置HTTP2.0版本和自签名证书：
```
server {
    listen 443 ssl http2;
    server_name  localhost;

    ssl_certificate ../../keys/localhost.pem;
    ssl_certificate_key ../../keys/localhost-key.pem;

    location / {
        root   html;
        index  index.html index.htm;
    }

    location /images/* {
        root   html;
    }
}
```
在启动Nginx服务后，重新观察`[http://localhost/](http://localhost/)`、`[https://localhost/](https://localhost/)`在NetWork请求情况可以得到了NodeJs版本相同的结果；
## 3. 已升级HTTP2.0版本网站：
### 3.1 百度图片搜索：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291002739.png)
### 3.2 微博主页：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291003088.png)
### 3.3. 今天头条主页：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291003300.png)
### 3.4 稀土掘金主页：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291003474.png)
### 3.5 InfoQ主页：
![image.png](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308291004596.png)
## 总结
通过案例对比似乎发现HTTP2.0版本的协议似乎并没有启到什么效果，但是网络的优化也需要方方面面的考虑，在主流网站几乎全部支持了HTTP2.0时候我觉得有必要考虑将自己还没有升级2.0的网站提上日程。
更好的体验HTTP2优势的案例参照：[https://http2.akamai.com/demo](https://http2.akamai.com/demo)；

本文项目已推送至GitHub，欢迎克隆演示：`git clone git@github.com:OSpoon/awesome-examples.git`