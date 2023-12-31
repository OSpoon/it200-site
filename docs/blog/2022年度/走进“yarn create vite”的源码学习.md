# 走进“yarn create vite”的源码学习

:::tip
>🎄Hi~ 大家好，我是小鑫同学，资深 IT 从业者，InfoQ 的签约作者，擅长前端开发并在这一领域有多年的经验，致力于分享我在技术方面的见解和心得
:::

我们在编程学习的过程中也会写一些项目的模板，这样的模板在后期其实并没有进行很好的管理，以至于下次再来回顾或使用的时候还需要从“零”开始，在使用过 [Vite](https://github.com/vitejs/vite) 来创建项目后顺便拿看了一下仓库中`create-vite`包中的源码，得到了很好的启发~

## 2. 走进“yarn create vite”的源码
### 2.1 Vite 创建项目的方式：

1. 终端交互方式创建项目；
2. 终端指定模版创建项目；
#### 2.1.1 终端交互方式创建项目：
相比于以往的 CLI 工具提供的创建项目都需要优先手动安装 CLI 工具后再执行对应的创建命令，另一种就是 Vite 目前采用的直接通过包管理器内置命令使用统一的规范来实现项目的快速创建；
如果你使用 YARN：
```javascript
# yarn
yarn create vite
```
接下来就可以按终端提示进行项目名称的录入和项目模板的选择了~
#### 2.1.2 终端指定模版创建项目：
如果我们很明确内置的模板选项的话我们可以在终端执行时同时录入项目名称和模板名称更快速的创建项目；
```javascript
# yarn
yarn create vite my-vue-app --template vue
```
备注：使用“`.`”来在当前目录创建项目；
### 2.2 源码分析：

1. 终端参数解析；
2. 交互收集数据；
3. 目录初始化；
4. 拷贝模板文件夹；
5. 重写 `gitignore` 名称；
6. 重写 `package` 字段；
7. 后续操作提示；
#### 2.2.1 终端参数解析：
通过 [minimist](https://www.npmjs.com/package/minimist) 模块将终端参数解析为对象形式：
```javascript
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })
```
通过读取对象属性来得到 argTargetDir 和 argTemplate 两个参数：
```javascript
const argTargetDir = formatTargetDir(argv._[0])
const argTemplate = argv.template || argv.t
```
#### 2.2.2 交互收集数据：
通过交互收集的数据包括：projectName、overwrite、packageName、framework、variant：
**projectName**：默认值是 defaultTargetDir ，对应的值是`vite-project`，当通过终端解析到 argTargetDir 后将跳过此步骤；
```javascript
{
  type: argTargetDir ? null : 'text',
  name: 'projectName',
  message: reset('Project name:'),
  initial: defaultTargetDir,
  onState: (state) => {
    targetDir = formatTargetDir(state.value) || defaultTargetDir
  }
}
```
**overwrite**：在确认好 targetDir 参数后，我们要看 targetDir 对应的文件夹是否存在或是文件夹中是否有文件，要提示用户是否需要情况或终端操作；
```javascript
{
  type: () =>
    !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
  name: 'overwrite',
  message: () =>
    (targetDir === '.'
      ? 'Current directory'
      : `Target directory "${targetDir}"`) +
    ` is not empty. Remove existing files and continue?`
},
{
  type: (_, { overwrite }: { overwrite?: boolean }) => {
    if (overwrite === false) {
      throw new Error(red('✖') + ' Operation cancelled')
    }
    return null
  },
  name: 'overwriteChecker'
}
```
**packageName**：packageName 的值通过 **路径** 和 **targetDir **来确定，在终端交互收集数据的时候需要对值做格式的校验来确定合法性；
```javascript
// 确定项目名称
const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

// 校验项目名称合法性
{
  type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
  name: 'packageName',
  message: reset('Package name:'),
  initial: () => toValidPackageName(getProjectName()),
  validate: (dir) =>
    isValidPackageName(dir) || 'Invalid package.json name'
}
```
**framework**：如果终端已获取到 argTemplate 参数，且已内置该模板将跳过这步，否则将进行预置模板配置的解析并选择；
```javascript
{
  type:
    argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
  name: 'framework',
  message:
    typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
      ? reset(
          `"${argTemplate}" isn't a valid template. Please choose from below: `
        )
      : reset('Select a framework:'),
  initial: 0,
  choices: FRAMEWORKS.map((framework) => {
    const frameworkColor = framework.color
    return {
      title: frameworkColor(framework.display || framework.name),
      value: framework
    }
  })
}
```
**variant**：通过上一步得到的 framework 参数将确定这个步的配置，因为同样的 framework 看一配置多种 variant ；
```javascript
{
  type: (framework: Framework) =>
    framework && framework.variants ? 'select' : null,
  name: 'variant',
  message: reset('Select a variant:'),
  choices: (framework: Framework) =>
    framework.variants.map((variant) => {
      const variantColor = variant.color
      return {
        title: variantColor(variant.display || variant.name),
        value: variant.name
      }
    })
}
```
#### 2.2.3 目录初始化：
目录如果不存在的话我们需要创建对应的目录，因为在前期收集参数可能是个目录，这儿创建的时候需要递归创建，但是当目录存在且有内容的时候我们就需要清空掉里面的文件了，但是在清空的时候我们要考虑当时目录可能已经被版本管理过了，所以需要对`.git`目录过滤掉，这样才更完整；
```javascript
const root = path.join(cwd, targetDir)

if (overwrite) {
  emptyDir(root)
} else if (!fs.existsSync(root)) {
  fs.mkdirSync(root, { recursive: true })
}
```
#### 2.2.4 拷贝模板文件夹：
模板拷贝的时候需要过滤掉`package.json`，我们会在后面单独进行处理；
```javascript
const files = fs.readdirSync(templateDir)
for (const file of files.filter((f) => f !== 'package.json')) {
  write(file)
}
```
#### 2.2.5 重写 `gitignore` 名称：
在上一步的模板文件夹拷贝的时候已经用到了这个函数，我们这里关系第二行中的关键对象 renameFiles ，实际上就是要将 _gitignore 重命名为 .gitignore ，因为在模板中直接使用 .gitignore 可能就导致关节的文件被丢失掉了；
```javascript
const write = (file: string, content?: string) => {
  const targetPath = path.join(root, renameFiles[file] ?? file)
  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    copy(path.join(templateDir, file), targetPath)
  }
}
```
#### 2.2.6 重写 `package` 字段：
最后来输出 package.json ，需要改变里面的内容，尤其是重要的项目名称，命名规范也是为了符合 package 中 name 的规则；
```javascript
const pkg = JSON.parse(
  fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
)

pkg.name = packageName || getProjectName()

write('package.json', JSON.stringify(pkg, null, 2))
```
#### 2.2.7 后续操作提示：
在模板拷贝完毕后项目的创建阶段也就结束了，接着就是判断在终端执行的包管理器来提示用户下一步的操作了~
```javascript
const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

switch (pkgManager) {
  case 'yarn':
    console.log('  yarn')
    console.log('  yarn dev')
    break
  default:
    console.log(`  ${pkgManager} install`)
    console.log(`  ${pkgManager} run dev`)
    break
}
```
## 3. 总结
在源码中还支持了第三方模板通过自定义命令来创建项目，关键词可以搜索 `customCommand` ，整体源码是很简单的，你准备好为自己创建一套模板管理工具了吗~