# Flutter之provider4主题切换应用

##### 安装:
```dart
dependencies:
  provider: ^4.0.5
```

##### 构造主题切换ChangeNotifier

```dart
import 'package:flutter/material.dart';

class ThemeChange with ChangeNotifier {
  ThemeData _themeData;
  ThemeMode _mode;

  //获取当前主题
  ThemeData get theme => _themeData;
  //获取当前主题类型
  ThemeMode get mode => _mode;

  /**
   * 根据传入的类型初始化主题
   */
  ThemeChange(ThemeMode mode) {
    _mode = mode;
    if (mode == ThemeMode.dark) {
      _themeData = ThemeData.dark();
    } else {
      _themeData = ThemeData.light();
    }
  }

  void change() {
    if(_mode == ThemeMode.light){
      _mode = ThemeMode.dark;
      _themeData = ThemeData.dark();
      print('dark');
    }else{
      _mode = ThemeMode.light;
      _themeData = ThemeData.light();
      print('light');
    }
    //通知数据变化
    notifyListeners();
  }
}
```

##### 安装ChangeNotifierProvider到根Widget

```dart
ChangeNotifierProvider<ThemeChange>(
  create: (_) =>
  //初始化主题
  ThemeChange(ThemeMode.dark),
  child: MyApp(),
),
```

##### 获取初始化后的主题

```dart
Provider.of<ThemeChange>(context,listen: true).theme
```

##### 切换主题

```dart
Provider.of<ThemeChange>(context, listen: false).change();
```

##### 动态获取当前主题

```dart
FlatButton(
  onPressed: () {
    Provider.of<ThemeChange>(context, listen: false).change();
  },
  child: Consumer(
    builder:
        (BuildContext context, ThemeChange theme, Widget child) {
      //动态获取当前主题
      String result = "切换为";
      if (theme.mode == ThemeMode.dark) {
        result += "白色主题";
      } else {
        result += "暗色主题";
      }
      return Text(result);
    },
  ),
),
```

##### 完整代码

```dart
import 'package:flutter/material.dart';
import 'package:flutter_provider_switch_theme/theme_change.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider<ThemeChange>(
      create: (_) => ThemeChange(ThemeMode.dark),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Provider 切换主题',
      theme: Provider.of<ThemeChange>(context, listen: true).theme,
      home: MyHomePage(title: 'Flutter Provider 切换主题'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            FlatButton(
              onPressed: () {
                Provider.of<ThemeChange>(context, listen: false).change();
              },
              child: Consumer(
                builder:
                    (BuildContext context, ThemeChange theme, Widget child) {
                  String result = "切换为";
                  if (theme.mode == ThemeMode.dark) {
                    result += "白色主题";
                  } else {
                    result += "暗色主题";
                  }
                  return Text(result);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```




