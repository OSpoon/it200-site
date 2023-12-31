# Dart语法入门

[TOC]

## Dart数据类型
#### Number
```dart
num age = 12;
int a = 15;
double b = 16;
```

#### String
```dart
String name = '张三';
String name2 = '''
      张三张三张三张三张三
      张三张三张三张三张三
      张三张三张三张三张三
      张三张三张三张三张三
    ''';
```

#### Boolean
```dart
bool isShow = false;
```

#### List
```dart
List<int> list = [1, 2, 3];
var list2 = [1, 2, 3];
```

#### Map
```dart
Map<String, String> map = <String, String>{
    '小明': '26',
    '小红': '23',
  };
var map2 = <String, String>{
    '小明': '26',
    '小红': '23',
  };
var map3 = {
    '小明': '26',
    '小红': '23',
  };
```

## Dart函数

#### main函数
```dart
void main(List<String> arguments) {

}
```

#### 可选命名参数函数 {}
```dart
void running({String name,int distance}){
  print('${name} run ${distance}');
}

void main(List<String> arguments) {
  running(name: '夏明',distance: 200);
}
```

#### 可选位置参数函数 []
```dart
void running([String name, int distance]) {
  print('${name} run ${distance}');
}

void main(List<String> arguments) {
  running('夏明', 200);
}
```

#### 函数默认值 =
```dart
void running([String name='小红', int distance = 300]) {
  print('${name} run ${distance}');
}

void main(List<String> arguments) {
  running('小明');
}
```

#### 函数做参数的函数 (fun){}
```dart
void running(Function callback, [String name = '小红', int distance = 300]) {
  callback('${name} run ${distance}');
}

void callback(String message) {
  print(message);
}

void main(List<String> arguments) {
  running(callback, '小明');
}
```

#### 匿名函数 (){}
```dart
void running(Function callback, [String name = '小红', int distance = 300]) {
  callback('${name} run ${distance}');
}

void main(List<String> arguments) {
  //参数1为匿名函数
  running((message) {
    print(message);
  }, '小明');

  //简写,参数1为匿名函数
  running((message) => print(message), '小明');
}
```

## Dart面向对象 特征:封装 继承 多态 抽象

##### 类
```dart
class Person {
    
}
```

##### 静态变量/静态方法 static
```dart
class Person {
  //定义静态变量
  static const String TYPE = "人类";

  //定义静态方法
  static String getType() {
    return "人类";
  }
}

void main(List<String> arguments) {
  //调用静态变量
  Person.getType();
  //调用静态方法
  Person.TYPE;
}
```

##### 枚举类型 enum

```dart
///定义枚举
enum PersonType{
  xiaoWang,
  xiaoZhang
}

void main(List<String> arguments) {
  //获取定义枚举中所有项
  print(PersonType.values);
  //获取定义枚举中的指定项
  print(PersonType.xiaoWang);
}
```

##### 成员变量/成员方法/对象类型

```dart
class Person {
  String name;

  void run() {
    print('${name} person run');
  }
}


void main(List<String> arguments) {
  //普通操作
  Person person = Person();
  person.name = '张三';
  person.run();

  //级联操作
  Person person2 = Person()
    ..name='zhangsan'
    ..run();

  //输出类型
  print(person2.runtimeType.toString());
}

```

##### 声明构造方法 可省略{}和{}中的this.xxx=xxx;

```dart
class Person {
  String name;
  int age;

  //全写版本
  Person(name, age){
    this.name = name;
    this.age = age;
  }

  //简写版本
  Person(this.name, this.age);
}
```

##### 命名构造方法(无重载概念) 可使用:类名.别名(){}定义

```dart
class Person {
  String name;
  int age;

  //命名构造方法1
  Person.name(this.name);

  //命名构造方法2
  Person.age(this.age);
}
```

##### 非默认构造方法 父类无默认构造方法的情况下,子类要显示调用 子类名.别名() : super.别名(){}
```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);
}

class XiaoMing extends Person{
  
  //显示调用(super)
  XiaoMing(String name, int age) : super(name, age);
  
}
```

##### 初始化列表(构造函数执行前执行) 类名.别名(): 赋值, 赋值...{print('命名构造函数执行')}

```dart
class Person {
  String name;
  int age;

  Person()
      : this.name = '张三',
        this.age = 26 {
    print('构造函数执行...');
  }
}

void main(List<String> arguments) {
  //实例化未进行赋值
  Person person = Person();
  print("person name : ${person.name}, age : ${person.age}");
}

```


##### 重定向构造方法 命名构造函数调用同名构造函数 类名.别名(参数1):this.类名(参数1,默认1,默认2)

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  Person.name(name) : this(name, 23);
}
```


##### 常量构造方法 定义: 1. cosnt 类名(参数) 2. static final 类名 instance = const 类名(值);

```dart
//类内信息均设置为不可变
class Person {
  final String name;
  final int age;
  static final Person instance = const Person('张三', 23);

  const Person(this.name, this.age);
}

void main(List<String> arguments) {
  Person person = Person.instance;
  person.name;
  person.age;
}

```

##### 工厂构造方法 factory 类名(){return }

```dart
//避免相同name的对象生成
class Logger {
  String name;

  static final Map<String, Logger> _person = <String, Logger>{};

  factory Logger(name) {
    return _person.putIfAbsent(name, () => Logger._internal(name));
  }

  Logger._internal(this.name);

  void log() {
    print("log ${name}");
  }
}
```

##### 继承 extends

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);
}

class XiaoMing extends Person{
  
  //显示调用(super)
  XiaoMing(String name, int age) : super(name, age);
  
}
```

##### 重写 @override

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void run() {
    print("${name} person run");
  }
}

class XiaoMing extends Person {
  //显示调用(super)
  XiaoMing(String name, int age) : super(name, age);
  
  //重写父类run方法
  @override
  void run() {
    //如需要可调用父类run函数
    super.run();
    //做小明Run的事
  }
}
```

##### 重写操作符(为两个对象增加比较方法) bool operator 操作符(){return}

```dart
class Person {
  String name;
  int age;

  @override
  bool operator ==(Object other) =>
      //类型一致且年龄一致,这里的'=='被赋值成同龄人
      other is Person && age == other.age;
}
```

##### 重写noSuchMethod 直观提示

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void run() {
    print("${name} person run");
  }

  @override
  dynamic noSuchMethod(Invocation invocation) {
    print('正在执行Person中的${invocation.memberName}无效');
  }

}

void main(List<String> arguments) {
  
  //接收时类型未知(动态类型),指明类型调用不存在的方法语法检测不通过
  dynamic person = Person('张三', 23);
  person.runrun();
}

```

##### 多态:必要条件->继承->重写->父类引用指向子类对象

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void run() {
    print("${name} person run");
  }

}

class XiaoMing extends Person{
  XiaoMing(String name, int age) : super(name, age);

  @override
  void run() {
    print("${name} 百米 run");
  }
}

void main(List<String> arguments) {
  Person xiaoming = XiaoMing('小明', 23);
  xiaoming.run();
}
```

##### 抽象类 asbtract 定义规范又继承的子类来全部实现

```dart
//抽象类不能被实例化
abstract class Movement{
  void running();

  void swimming();

  void tugOfWar();
}

//所有抽象类的方法均要重写
class Person extends Movement{
  String name;
  int age;

  Person(this.name, this.age);

  @override
  void running() {
    // TODO: implement running
  }

  @override
  void swimming() {
    // TODO: implement swimming
  }

  @override
  void tugOfWar() {
    // TODO: implement tugOfWar
  }

}
```

##### 接口 implements关键词实现 全部实现
```dart
abstract class Movement {
  void running();

  void swimming(){
    print('abstract swimming');
  }
}

class Person {
  String name;
  int age;

  Person(this.name, this.age);

}

class XiaoMing extends Person implements Movement {
  XiaoMing(String name, int age) : super(name, age);

  @override
  void running() {
    // TODO: implement running
  }

  @override
  void swimming() {
    // TODO: implement swimming
  }
  
}
```

```dart
class XiaoMing  implements Movement,Person{

  //实现接口中的全部方法
  @override
  void running() {
    // TODO: implement running
  }

  @override
  void swimming() {
    // TODO: implement swimming
  }

  @override
  void tugOfWar() {
    // TODO: implement tugOfWar
  }

  @override
  int age;

  @override
  String name;

}
```

##### 混入(mixin) 定义使用mixin 实现使用with

```dart
mixin Movement {
  void running() {
    print('mixin running');
  }
}

class Person {
  String name;
  int age;

  Person(this.name, this.age);
  
}

class XiaoMing extends Person with Movement {
  XiaoMing(String name, int age) : super(name, age);
}

void main(List<String> arguments) {
  XiaoMing xiaoming = XiaoMing('小明', 23);
  //running是XiaoMing混入Movement得到的方法
  xiaoming.running();
}
```

##### 异常-抛出
```dart
void running([String name = '小红', int distance = 300]) {
  print('${name} run ${distance}');
  throw Exception("程序异常退出");
  //简写
  //throw "程序异常退出";
}
```

##### 异常-捕获-Try-Catch
```dart
void main(List<String> arguments) {
  try{
    running('小明');
  }catch(e,t){
    print("error:::${e.toString()}");
    print("track:::${t.toString()}");
  }
}
```

##### 异常-捕获-Try-On-Catch
```dart
void main(List<String> arguments) {
  try {
    test();
    test1();
  } on FormatException catch (e) {
    print("error FormatException:::${e.toString()}");
  } on Exception catch (e) {
    print("error Exception:::${e.toString()}");
  } catch (e, t) {
    print("error:::${e.toString()}");
    print("track:::${t.toString()}");
  }
}
```

##### 异常-重新抛出异常
```dart
void main(List<String> arguments) {
  try {
    running();
  } catch (e, t) {
    //重新抛出异常
    rethrow;
  }finally{
    print("释放资源");
  }
}
```

##### 异常-自定义异常
```dart
//抽象类相当于Java中的接口 需要使用implements实现
class MyException implements Exception{

  final String message;

  //可选参数
  MyException([this.message]);

  //??运算符message为空取后者
  @override
  String toString() => message ?? "MyException";

}
```

##### 异常-枚举-实例
```dart
//如果函数内部处理为异步并且需要接收返回值,使用`Future`关键字
Future httpRequest() async {
  try {
    var url = "https://www.baidu.com";
    http.get(url).then((data) {
      if (data.statusCode == 200) {
        return data;
      } else if (data.statusCode == 404) {
        throw StatusException(status: StatusEnum.STATUS_404);
      } else if (data.statusCode == 500) {
        throw StatusException(status: StatusEnum.STATUS_500);
      } else {
        throw StatusException(status: StatusEnum.DEFAULT);
      }
    });
  } catch (e) {
    return print("error::: ${e}");
  }
}

//定义状态枚举
enum StatusEnum { DEFAULT, STATUS_404, STATUS_500 }

//定义异常
class StatusException implements Exception {
  StatusEnum status;

  StatusException({this.status});

  @override
  String toString() {
    switch (status) {
      case StatusEnum.STATUS_404:
        return "页面未找到";
        break;
      case StatusEnum.STATUS_500:
        return "服务器发生异常";
        break;
      case StatusEnum.DEFAULT:
        return "未知异常";
    }
  }
}
```

##### List 不唯一,按序插入,操作索引
```dart
List<String> list = ['张三', '李四', '王五'];
//常用属性
list.length;//长度
list.reversed;//反序
list.isEmpty;//空
list.isNotEmpty;//非空

//常用方法
list.add('赵柳');//增加元素
list.addAll(['夏明','小红']);//增加多个元素
list.indexOf('小赵');//返回元素索引,找不到返回-1
list.remove(value);//按值删除
list.removeAt(index)//按索引删除
list.insert(index, element)//按索引插入元素
list.insertAll(index, iterable)//按索引插入多个元素
list.toList()//其他类型转List
list.join('_')//将List按指定元素拼接xx_yy_vv
```

##### Set 唯一,无序
```dart
Set<String> set = {'张三', '李四', '王五'};
//常用属性
set.length;//长度
set.isEmpty;//空
set.isNotEmpty;//非空
set.first;//首元素
set.last;//尾元素

//常用方法
set.add('赵柳');//增加元素
set.addAll({'夏明','小红'});//增加多个元素
set.toString();//按字符串形式输出
set.join('-');//将Set按指定元素拼接
set.contains('夏利');//包含指定元素
set.containsAll(other);//包含一些元素
set.elementAt(index);//返回指定索引的元素
set.remove(value);//按值删除
set.removeAll(elements)//按索引删除
set.clear();//清空数据
```

##### Map Key-Value
```dart
Map<String, int> map = <String, int>{
    '张三': 18,
    '李四': 20,
    '王五': 25,
};
//常用属性
map.hashCode;
map.isEmpty;
map.keys;
map.values;
map.length;

//常用方法
map.toString();
map.addAll({'赵柳':30});
map.containsKey('张三');
map.containsValue(3);
map.remove(key);
map.clear();

//迭代

map.forEach((key, value) {
    print(key + ' - ' + value.toString());
});

for(var key in map.keys){
    map.putIfAbsent(key, (){
      return 30;
    });
    print(map[key]);
}
```

##### 泛型
```dart
<T>
```

##### Future 延迟任务,耗时任务
```dart
import 'dart:io';

void main(List<String> arguments) {
  print('start');

  Future.delayed(Duration(seconds: 3),(){
    print('延迟任务');
  });

  //优先级高
  Future((){
    sleep(Duration(seconds: 5));
    print('耗时任务');
  });

  print('end');
}
```

##### Future 创建
```dart
void main(List<String> arguments) {
  print('start');

  Future(() => print('async task'));

  Future.sync(() => print('sync task'));

  Future.microtask(() => print('microtask task'));

  Future.delayed(Duration(seconds: 1),() => print('delayed task'));
  
  Future fu = Future.value("Future的值为30");
  Future.wait([fu,fu,fu]);

  print('end');
}

```

##### Future then
```dart
void main(List<String> arguments) {
  print('start');

  Future fu = Future.value("Future的值为30");
  fu.then((value) => print(value));

  print('end');
}
```

##### Stream创建periodic
```dart
import 'dart:async';

int callBack(int value){
  return value;
}

createStream() async{

  Stream<int> stream = Stream.periodic(Duration(seconds: 1),callBack);

  await for(var i in stream){
    print(i);
  }
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream创建fromFuture,fromFutures,fromIterable
```dart
import 'dart:async';

import 'dart:io';

createStream1() async {
  print('start test');

  Future<String> future = Future(() {
    return '异步任务';
  });

  Stream<String> stream = Stream.fromFuture(future);

  await for (var s in stream) {
    print(s);
  }

  print('end test');
}

createStream2() async {
  print('start test');

  Future<String> future1 = Future(() {
    sleep(Duration(seconds: 3));
    return '异步任务1';
  });

  Future<String> future2 = Future(() {
    return '异步任务2';
  });

  Future<String> future3 = Future(() {
    sleep(Duration(seconds: 5));
    return '异步任务3';
  });

  Stream<String> stream = Stream.fromFutures([future1, future2, future3]);

  await for (var s in stream) {
    print(s);
  }

  print('end test');
}

createStream3() async {
  print('start test');

  Stream<int> stream = Stream.fromIterable([1,2,3,4,5]);

  await for (var i in stream) {
    print(i);
  }

  print('end test');
}

void main(List<String> arguments) async {
  createStream3();
}
```


##### Stream操作take
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Duration interval = Duration(seconds: 1);

  Stream<int> stream = Stream.periodic(interval, (data) => data);

  /// 取10次
  /// stream = stream.take(10);

  /// 按条件取内容
  stream = stream.takeWhile((data) {
    return data < 8;
  });

  await for (var i in stream) {
    print(i);
  }
}

void main(List<String> arguments) {
  createStream();
}
```
##### Stream操作skip
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Duration interval = Duration(seconds: 1);

  Stream<int> stream = Stream.periodic(interval, (data) => data);

  stream = stream.take(10);

  //跳过
  //stream = stream.skip(2);

  //按条件跳过
  stream = stream.skipWhile((element) => element<5);

  await for (var i in stream) {
    print(i);
  }
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream操作toList
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Duration interval = Duration(seconds: 1);

  Stream<int> stream = Stream.periodic(interval, (data) => data);

  stream = stream.take(10);

  //toList
  List<int> listData = await stream.toList();

  for (int i in listData) {
    print(i);
  }
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream操作where
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Stream<int> stream = Stream.periodic(Duration(seconds: 1), callBack);

  /// where
  stream = stream.where((event) => event > 2);
  stream = stream.where((event) => event < 6);

  await for (var i in stream) {
    print(i);
  }
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream操作length
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Duration interval = Duration(seconds: 1);

  Stream<int> stream = Stream.periodic(interval, (data) => data);

  stream = stream.take(10);

  //length
  var allEvents = await stream.length;

  print(allEvents);
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream操作监听
```dart
import 'dart:async';

int callBack(int value) {
  return value;
}

createStream() async {
  Duration interval = Duration(seconds: 1);

  Stream<int> stream = Stream.periodic(interval, (data) => data);

  stream = stream.take(5);
  
/// listen
//  stream.listen((data) {
//    print(data);
//  }, onError: (error) {
//    print(error);
//  }, onDone: () {
//    print('onDone');
//  }, cancelOnError: false);


/// forEach
//  stream.forEach((element) {
//    print(element);
//  });
}

void main(List<String> arguments) {
  createStream();
}
```

##### Stream操作transform
```dart
import 'dart:async';

void testTransform() async {
  Stream stream = Stream<int>.fromIterable([111, 222, 333]);

  var st =
      StreamTransformer<int, String>.fromHandlers(handleData: (data, sink) {
    if (data == 333) {
      sink.add("输入正确");
    } else {
      sink.add("输入错误");
    }
  });

  stream.transform(st).listen((event) {
    print(event);
  }, onError: (error) {
    print(error);
  });
}

void main(List<String> arguments) {
  testTransform();
}

```

##### StreamController单订阅流
```dart
import 'dart:async';

void main(List<String> arguments) {
  StreamController<String> controller = StreamController();

  controller.stream.listen((event) {
    print(event);
  });

  controller.sink.add("aaa");
  controller.add("bbb");
  controller.add("ccc");
  controller.close();
}

```

##### StreamController多订阅流 
> broadcast

```dart
import 'dart:async';

void main(List<String> arguments) {
  StreamController<String> controller = StreamController.broadcast();

  controller.stream.listen((event) {
    print("1::: " + event);
  });

  controller.stream.listen((event) {
    print("2::: " + event);
  });

  controller.sink.add("aaa");

  controller.close();
}
```

> asBroadcastStream

```dart
import 'dart:async';

void main(List<String> arguments) {
  StreamController<String> controller = StreamController();

  Stream stream = controller.stream.asBroadcastStream();

  stream.listen((event) {
    print("1::: " + event);
  });

  stream.listen((event) {
    print("2::: " + event);
  });

  controller.sink.add("aaa");

  controller.close();
}

```

##### Bloc设计模式详解
```dart

```

##### 元数据-常见
```dart
@deprecated
  
@override
  
@required
```

##### 元数据-自定义

反射:https://www.jianshu.com/p/d68278d19f79

```dart
import 'dart:mirrors';

//类元数据
class Todo {
  final String name;
  final String content;

  const Todo(this.name, this.content);
}

//方法元数据
class Get {
  final String value;

  const Get({this.value});
}

//方法参数元数据
class Query {
  final String value;

  const Query({this.value});
}

@Todo('spoon', 'Test')
class Test {
  @Get(value: 'domSomething')
  void domSomething(@Query(value: 'param') String param) {
    print('do something');
  }
}

void getWorkAnnotation() {
  //标记元数据的类Test
  ClassMirror classMirror = reflectClass(Test);
  // 获取 class 上的元数据
  classMirror.metadata.forEach((metadata) {
    //判断类型
    if (metadata.reflectee is Todo) {
      print(metadata.reflectee.name + ' ==> ' + metadata.reflectee.content);
    }
  });

  //获取 field 和 method 上的元数据
  classMirror.declarations.forEach((Symbol key, DeclarationMirror value) {
    //是否是method
    if (value is MethodMirror) {
      //方法名称判断
      if (value.simpleName == #domSomething) {
        //遍历元数据
        value.metadata.forEach((metadata) {
          if (metadata.reflectee is Get) {
            print(metadata.reflectee.value);
          }
        });

        // 获取方法中参数上的元数据
        value.parameters.forEach((param) {
          //遍历元数据
          param.metadata.forEach((metadata) {
            if (metadata.reflectee is Query) {
              if (metadata.reflectee.value == null) {
                print(
                    'args name ==> ' + MirrorSystem.getName(param.simpleName));
              } else {
                print(metadata.reflectee.value);
              }
            }
          });
        });
      }
    }
  });
}

void main(List<String> arguments) {
  getWorkAnnotation();
}
```

##### 库重名
```dart
import '' as new-name
```

##### 库显示隐藏成员
```dart
//仅导入xxx
import '' show xxx
//除xxx以外全部导出
import '' hide xxx
```




