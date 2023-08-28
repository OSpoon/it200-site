# Babel 插件开发&访问节点

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

整理一下 Babel 插件开发时用得到的转换操作相关的 API~

## 2. 访问节点

### 2.1 获取子节点的Path：

我们在处理节点的属性之前必须要拿到节点对象才能进行操作，我们使用`path.node.property`来访问属性~

```JavaScript
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}

```

我们还可以使用 path 内置的 get 函数来指定属性名获取属性值~

```JavaScript
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}

```

### 2.2 检查节点的类型：

检查节点的类型我们可以使用内置的工具类函数`isXxx()`~

```JavaScript
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}

```

我们在检查类型的时候还可以顺便检查其中的某些属性是否达到预期~

```JavaScript
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}

// 简化前的代码
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}

```

### 2.3 检查路径（Path）类型：

路径具有相同的方法检查节点的类型~

```JavaScript
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}

// 等价于
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}

```

### 2.4 检查标识符（Identifier）是否被引用：

```JavaScript
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}

// 或者

Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}

```

### 2.5 找到特定的父路径：

向上查找特定节点可以使用~

```JavaScript
path.findParent((path) => path.isObjectExpression());

```

如果也需要遍历当前节点~

```JavaScript
path.find((path) => path.isObjectExpression());

```

查找最接近的父函数或程序~

```JavaScript
path.getFunctionParent();

```

向上遍历语法树，直到找到在列表中的父节点路径~

```JavaScript
path.getStatementParent();

```

### 2.6 获取同级路径：

如果一个路径是在一个 `Function`／`Program`中的列表里面，它就有同级节点。

*   使用`path.inList`来判断路径是否有同级节点，
*   使用`path.getSibling(index)`来获得同级路径,
*   使用 `path.key`获取路径所在容器的索引,
*   使用 `path.container`获取路径的容器（包含所有同级节点的数组）
*   使用 `path.listKey`获取容器的key

这些API用于 babel-minify 中使用的 transform-merge-sibling-variables 插件.

```JavaScript
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2

```
```JavaScript
export default function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // if the current path is pathA
        path.inList // true
        path.listKey // "body"
        path.key // 0
        path.getSibling(0) // pathA
        path.getSibling(path.key + 1) // pathB
        path.container // [pathA, pathB, pathC]
      }
    }
  };
}

```

### 2.7 停止遍历：

当我们遍历完成目的后应该尽早结束而不是继续遍历下去~

```JavaScript
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}

```

如果您在顶级路径中进行子遍历，则可以使用2个提供的API方法~

`path.skip()`跳过遍历当前路径的子路径~

`path.stop()`完全停止遍历~

```JavaScript
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});

```