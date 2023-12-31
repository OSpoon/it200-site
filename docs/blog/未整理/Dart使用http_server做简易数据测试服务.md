# Dart使用http_server做简易数据测试服务

#### 初始化目录
1. 增加`main.dart`,服务配置,接口处理
2. 增加`data.dart`,返回前端的数据
3. 增加`pubspec.yaml`,项目配置
    ```dart
    name: dart_server
    description: Dart数据测试服务
    dependencies:
        http_server: ^0.9.6
    ```
4. 如使用VSCode,注意`program`内容需指向`main.dart`
    ```json
    {
        // 使用 IntelliSense 了解相关属性。 
        // 悬停以查看现有属性的描述。
        // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [
            {
                "name": "Dart",
                "program": "main.dart",
                "request": "launch",
                "type": "dart"
            }
        ]
    }
    ```
5. 安装依赖`pub get`

#### 配置

1. `data.dart`中通过定义不通数据返回的变量即可
2. `main.dart`
    ```dart
    import 'dart:convert';
    import 'dart:io';
    import 'data.dart';

    main() async {
        //配置IP和端口
        var requestServer = await HttpServer.bind('192.168.199.163', 9090);
        print('服务启动成功');
        //处理请求
        await for(HttpRequest request in requestServer){
            handleMessage(request);
        }
    }

    //处理请求
    void handleMessage(HttpRequest request){
        try{
            if(request.method == "GET"){
            handleGET(request);
            }else if(request.method == "POST"){
            handlePOST(request);
            }
        }catch(e){
            print('服务器发生异常: $e');
        }
    }

    //处理GET请求
    void handleGET(HttpRequest request){
        //获取请求参数
        var action = request.uri.queryParameters['action'];
        //判断action区分接口
        if(action == 'getProducts'){
            //接收Get参数
            var page = request.uri.queryParameters['page'];
            print('获取产品数据...$page');
            request.response
            ..statusCode=HttpStatus.ok
            ..write(json.encode(products)) //返回数据到前端
            ..close();
        }
    }

    //处理POST请求
    void handlePOST(HttpRequest request){
        //TODO
    }
    ```
    
    ```dart
    //响应码
    abstract class HttpStatus {
        //继续
        static const int continue_ = 100;
        //交换协议
        static const int switchingProtocols = 101;
        //可以
        static const int ok = 200;
        //已创建
        static const int created = 201;
        //认可的
        static const int accepted = 202;
        //非授权信息
        static const int nonAuthoritativeInformation = 203;
        //没有内容
        static const int noContent = 204;
        //重置内容
        static const int resetContent = 205;
        //部分内容
        static const int partialContent = 206;
        //多项选择
        static const int multipleChoices = 300;
        //永久迁移
        static const int movedPermanently = 301;
        //已发现
        static const int found = 302;
        //临时迁移
        static const int movedTemporarily = 302; // Common alias for found.
        //查看其它
        static const int seeOther = 303;
        //未修改的
        static const int notModified = 304;
        //使用代理
        static const int useProxy = 305;
        //暂时重定向
        static const int temporaryRedirect = 307;
        //请求失败
        static const int badRequest = 400;
        //没有授权
        static const int unauthorized = 401;
        //要求付款
        static const int paymentRequired = 402;
        //被禁止
        static const int forbidden = 403;
        //未找到
        static const int notFound = 404;
        //请求方法不允许
        static const int methodNotAllowed = 405;
        //不接受
        static const int notAcceptable = 406;
        //需要代理身份认证
        static const int proxyAuthenticationRequired = 407;
        //请求超时
        static const int requestTimeout = 408;
        //冲突
        static const int conflict = 409;
        //过去了
        static const int gone = 410;
        //长度要求
        static const int lengthRequired = 411;
        //先决条件失败
        static const int preconditionFailed = 412;
        //请求实体过大
        static const int requestEntityTooLarge = 413;
        //请求地址过长
        static const int requestUriTooLong = 414;
        //非支持的媒体类型
        static const int unsupportedMediaType = 415;
        //请求范围不可满足
        static const int requestedRangeNotSatisfiable = 416;
        //期望失败
        static const int expectationFailed = 417;
        //升级要求
        static const int upgradeRequired = 426;
        //内部服务器错误
        static const int internalServerError = 500;
        //未实现
        static const int notImplemented = 501;
        //网关坏了
        static const int badGateway = 502;
        //服务不可用
        static const int serviceUnavailable = 503;
        //网关超时
        static const int gatewayTimeout = 504;
        //http版本不支持
        static const int httpVersionNotSupported = 505;
        // 连接超时
        static const int networkConnectTimeoutError = 599;
    }
    ```
    
