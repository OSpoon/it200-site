# 【uniCloud】云对象的应用与提升

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

uniCloud 是 DCloud 联合阿里云、腾讯云，为开发者提供的基于 serverless 模式和 js 编程的云开发平台。

### 优势：

> 从前端程序员的角度来说可以使用熟悉的 JavaScript 代码来轻松搞定后台整体业务，目前阿里云版本的仍可以免费使用，白嫖的事还是需要干一干的。

## 云对象入门：

> 云对象的出现使得我们从面向网络接口编程变成了面向对象编程，我们只关心对象的定义和操作，节省了实体类到 JSON 数据的转换，网络接口的编写。在调用的时候我们也只是想往常导入模块一样将这个云对象导入，后续的操作就是常见的对象操作了。

### 创建云对象的步骤：

#### 1. 使用 HbuilderX 创建 uni-app 项目，并勾选启用uniCloud，注意勾选阿里云版本。

#### 2. 创建云服务空间，需要我们跳转到 [web 控制台](https://unicloud.dcloud.net.cn/cloud/function)自行创建：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281437391.png)

#### 3. 关联云服务空间，当刷新到刚创建的云服务空间后就可以关联到项目了：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281437504.png)

#### 4. 右击项目中uniCloud-aliyun/cloudfunctions目录创建云对象：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281437118.png)

#### 5. 为新建的 todo 云对象添加一个 add 方法：

代码示例同官方文档

在这个函数中我们接收一个 title 和一个 content 字段，在判断两者均不为空的时候提示创建成功。

```
module.exports = {
    add(title, content) {
        title = title.trim()
        content = content.trim()
        if (!title || !content) {
            return {
                    errCode: 'INVALID_TODO',
                    errMsg: 'TODO标题或内容不可为空'
            }
        }
        // ...其他逻辑
        return {
            errCode: 0,
            errMsg: '创建成功'
        }
    }
}
```

### 调用云对象的步骤：

#### 1. 编写一个触发 add 的按钮，并在 add 函数中导入云对象“uniCloud.importObject('')”；

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281437795.png)

#### 2. HBuilderX 自动提示了我们刚才编写的云对象，我们选择即可；

#### 3. 导入 todo 云对象后调用云对象内置的 add 函数，注意云对象函数的执行也属于异步操作；

```
methods: {
  async add() {
    const todo = uniCloud.importObject('todo');
    const res = await todo.add("php", "天下第一");
    uni.showToast({
      title: res.errMsg
    })
  }
}
```

### 优化一下上面的代码：

1.  导入云对象的代码只执行一次即可，所以提到外部；
1.  使用async/await后要及时补充异常处理；

```
<script>
const todo = uniCloud.importObject('todo');
export default {
    data() {
        return {
                title: 'Hello'
        }
    },
    methods: {
        async add() {
            try {
                const res = await todo.add("php", "天下第一");
                uni.showToast({
                        title: res.errMsg
                })
            } catch (e) {
                uni.showToast({
                        title: '创建失败',
                        content: e.errMsg,
                        showCancel: false
                })
            }
        }
    }
}
</script>
```

### 调试一把：

#### 1. 将 uni-app 项目运行到内置浏览器：

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281438404.png)

#### 2. 点击添加后在控制台就看到了发送到云对象的参数和返回的结果了：

注意：这里默认启动勾选的是连接本地云函数，在下面h5 运行控制台中可以切换为云端云函数（部署后切换）。

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281438411.png)

### 总结特点：

1.  使用云对象后逻辑更加清晰，这也是面向对象的一大特点吧；
1.  代码更加的精简了，去除了以往的一些转换等操作；
1.  由框架接管了统一的响应体规范，避免了接口联调的烦恼；
1.  HBuilderX 的优秀表现使得编写和调用云对象得到了更好的代码提示。

### 注意：

目前的云对象是不支持通过 URL 和定时执行的，以往我们开发的一些云函数很多情况需要支持这两种方式的调用，所以这个有所区别，官网显示后续会补充，一起期待吧~

## 云对象的拦截：

### 预处理器：

云对象内置了一个特殊的函数`_before`，它将在我们调用常规函数前优先执行，利用这样的特性，我们可以对云对象内的所有常规函数在执行前进行统一的拦截、鉴权、参数校验等。

### 后处理器：

另一个与之相对的后处理器函数是`_after`，我们可以利用后处理器来对响应的结果进行再加工处理。

### 案例改造：

我们对上面的案例进行改造，添加预/后处理器，记录 add 函数的执行时间，并将这个时间返回到 h5。

```
module.exports = {
    _before: function() {
        this.startTime = Date.now();
    },
    async add(title, content) {
        await new Promise((resolve) => {
            setTimeout(() => {
                    resolve();
            }, 100)
        })
        return {
            errCode: 0,
            errMsg: '创建成功'
        }
    },
    _after(error, result) {
        if (error) {
            throw error
        }
        result.timeCost = Date.now() - this.startTime
        return result
    }
}
```

![](https://picgo-2022.oss-cn-beijing.aliyuncs.com/202308281438433.png)

## 云对象的调用：

1.  客户端调用；
1.  云函数/云对象内调用；
1.  跨服务空间调用。

前面的两种方式是一样的，我们已经在客户端调用过两次了，这里我们看一下如何跨服务空间调用。

### 跨服务卡空间调用：

1.  客户端均支持阿里云和腾讯云两种方式；
1.  云端调用仅支持腾讯云；
1.  跨腾讯云服务空间调用的前提是同账号下。

下面的示例就是切换到指定空间的方式，拿到服务空间对应的对象后的操作是一样的：

```
const mycloud = uniCloud.init({
    provider: 'aliyun', // aliyun、tencent
    clientSecret: '', // aliyun 必须配置
    spaceId: '', // 服务空间ID
})
const todo = mycloud.importObject('todo');
const res = await todo.add('title demo', 'content demo')
```

**备注：** 云对象的参数在阿里云服务空间支持 1M 大小，腾讯云服务空间支持 6M 大小，我们还是要尽可能优化请求参数，避免大数据传输。

## 交互 UI 控制：

我们发现上面的示例执行的时候有一套内置的加载 UI，一起看看怎么回事。

### 不喜欢我要关闭：

我们在导入云对象的时候可以通过指定第一个选项参数来控制关闭这套 UI 的展示：

```
uniCloud.importObject('todo', {
    customUI: true // 配置为 true 取消自动展示的交互提示界面
})
```

### 还行微调一下吧：

我们可以对默认 UI 进行参数的微调，执行提示的文案、是否使用遮罩层、错误信息展示的方式、是否需要展示重试按钮。

```
uniCloud.importObject('todo', {
    customUI: false, // 是否取消自动展示的交互界面。默认为false，配置为true时取消自动展示的交互提示界面，以下配置均不再生效
    loadingOptions: { // loading相关配置
        title: '加载中...', // 显示的loading内的提示文字。默认值为：加载中...
        mask: true // 是否使用透明遮罩，配置为true时不可点击页面其他内容。默认值为：true
    },
    errorOptions: { // 错误界面相关配置
        type: 'modal', // 错误信息展示方式，可取值：modal（弹框，默认）、toast（toast消息框）。默认值为：modal
        retry: false // 是否展示重试按钮，仅在type为modal时生效。用户点击重试按钮时将重新请求调用的方法，默认为false
    }
})
```

## 总结：

uniCloud的服务器与客户端交互的方式有云函数、云对象、clientDB三种方式，但云对象的推出就将云函数抛到了一边，我们除了有数据库操作的时候优先使用 clientDB 的方式外，当我们遇到不宜在前端公开的业务逻辑的编写优先采用云对象。

这一篇我们从云服务空间的创建、云对象的创建、云对象的调用、云对象的统一拦截处理、云对象的 UI 控制等几个方便介绍的它的使用，我们在实际编写的时候也要调研对应服务空间的特点和支持的情况，就比如说我想使用 **puppeteer** 在云端事件网页截图，就受服务空间大小的限制无法使用。