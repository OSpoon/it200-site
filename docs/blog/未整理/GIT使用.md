# GIT使用

[TOC]

#### 基本命令

| 命令                       | 解释                         |
| :------------------------- | :--------------------------- |
| mkdir gitdemo              | 创建gitdemo目录              |
| cd gitdemo                 | 进入gitdemo目录              |
| git init                   | 初始化                       |
| ls -a                      | 查看当前目录文件包含隐藏文件 |
| echo “内容” >> xxx.txt     | 输入内容到xxx文件            |
| git add test.txt           | 添加test.txt到暂存区         |
| git commit -m "提交信息"   | 提交修改信息                 |
| git status                 | 查看当前版本库               |
| git reset HEAD newday.txt  | 将此文件恢复工作区           |
| git checkout -- newday.txt | 回滚到修改前                 |
| git log                    | 查看提交日志                 |
| git reset --hard b7a3a3b60 | 回滚指定版本库               |
| git rm test2.txt           | 删除指定文件                 |

| 命令                            | 解释                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| git init                        | 初始化本地git环境                                            |
| git clone XXX                   | 克隆一份代码到本地仓库                                       |
| git pull                        | 把远程库的代码更新到工作台                                   |
| git pull --rebase origin master | * 强制把远程库的代码跟新到当前分支上面                       |
| git fetch                       | 把远程库的代码更新到本地库                                   |
| git add                         | 把本地的修改加到stage中                                      |
| git commit -m 'comments here'   | 把stage中的修改提交到本地库                                  |
| git push                        | 把本地库的修改提交到远程库中                                 |
| git branch -r/-a                | 查看远程分支/全部分支                                        |
| git checkout master/branch      | 切换到某个分支                                               |
| git checkout -b test            | 新建test分支                                                 |
| git checkout -d test            | 删除test分支                                                 |
| git merge master                | 假设当前在test分支上面，把master分支上的修改同步到test分支上 |
| git merge tool                  | 调用merge工具                                                |
| git stash                       | 把未完成的修改缓存到栈容器中                                 |
| git stash list                  | 查看所有的缓存                                               |
| git stash pop                   | 恢复本地分支到缓存状态                                       |
| git blame someFile              | 查看某个文件的每一行的修改记录（）谁在什么时候修改的）       |
| git status                      | 查看当前分支有哪些修改                                       |
| git log                         | 查看当前分支上面的日志信息                                   |
| git diff                        | 查看当前没有add的内容                                        |
| git diff --cache                | 查看已经add但是没有commit的内容                              |
| git diff HEAD                   | 上面两个内容的合并                                           |
| git reset --hard HEAD           | 撤销本地修改                                                 |
| echo $HOME                      | 查看git config的HOME路径                                     |
| export $HOME=/c/gitconfig       | 配置git config的HOME路径                                     |

来源: [https://www.cnblogs.com/allanli/p/git_commands.html](https://www.cnblogs.com/allanli/p/git_commands.html "来源")

#### 本地仓库

##### 一 准备工作

1.创建本地版本库

```
git init
```

2.添加work.txt到暂存区

```
git add work.txt
```

3.提交暂存区内容到版本库

```
git commit -m "提交提一天工作内容"
```

##### 二 临时变更需求

1.完成变更

2.添加work.txt到暂存区

```
git add work.txt
```

3.变更撤销（暂存区回滚）

```
git reset HEAD work.txt 还原暂存区
git checkout -- work.txt 还原工作区
```

##### 三 新需求接入

1.完成新需求

2.添加work.txt到暂存区

```
git add work.txt
```

3.提交暂存区内容到版本库

```
git commit -m "提交新需求内容"
```

4.需求撤销（版本库回滚）

```
git reset --hard 96f9ac717f6c9ed1eefab72746089bce39d65323
```

5.全功能撤销

```
git rm work.txt 删除工作区内容
git commit -m “功能撤销删除文件” 删除暂存区，版本库
```

#### 远程仓库

##### 一 配置SSH

```
cd ~/.ssh / cd .ssh/ 查看是否存在rsa
ssh-keygen -t rsa -C "zxin088@gmail.com" 创建公钥
cat id_rsa.pub 获取密钥
ssh -T git@github.com 检测连通
```

##### 二 添加远程仓库

1. or create a new repository on the command line

```
echo "# sublife_git" >> README.md	创建README.md文件
git init	初始化仓库
git add README.md	添加README.md到暂存区
git commit -m "first commit" 提交README.md到仓库
git remote add origin https://github.com/OSpoon/sublife_git.git 关联远程仓库
git push -u origin master 推送README.md到远程仓库
```

2. or push an existing repository from the command line

```
git remote add origin https://github.com/OSpoon/sublife_git.git 关联远程仓库
git push -u origin master 推送本地仓库内容至远程仓库
```

##### 三 克隆仓库

```
//拉取仓库
git clone git@github.com:OSpoon/sublife_git.git 拉取远程仓库
//变更内容
echo “clone demo” >> clone.txt
cat clone.txt
//添加暂存->提交版本库->推送远程仓库
git add clone.txt
git commit -m "first clone"
git push
```

##### 四 标签管理

| 命令                                 | 解释         |
| ------------------------------------ | ------------ |
| git tag                              | 查看所有标签 |
| git tag name                         | 创建标签     |
| git tag -a name -m "comment"         | 指定提交信息 |
| git tag -d name                      | 删除标签     |
| git push origin name                 | 标签发布     |
| git push origin :refs/tags/tagname | 删除远程标签 |

##### 五 分支管理

| 命令                   | 解释         |
| ---------------------- | ------------ |
| git branch feature_1   | 创建分支     |
| git branch             | 查看分支     |
| git checkout feature_1 | 切换指定分支 |

1. 合并分支到master主分支

   ```
   git checkout master 切回master分支
   git merge feature_1 合并feature_1到master
   git branch -d feature_1 删除废弃分支
   ```


#### 团队协作git操作流程

  来源: [https://www.cnblogs.com/allanli/p/git_commands.html](https://www.cnblogs.com/allanli/p/git_commands.html "来源")

##### 一 克隆一个全新的项目，完成新功能并且提交

1. git clone XXX //克隆代码库
2. git checkout -b test //新建分支
3. modify some files //完成修改
4. git add . //把修改加入stage中
5. git commit -m '' //提交修改到test分支
6. review代码
7. git checkout master //切换到master分支
8. git pull //更新代码
9. git checkout test //切换到test分支
10. git meger master //把master分支的代码merge到test分支
11. git push origin 分支名//把test分支的代码push到远程库

##### 二 目前正在test分支上面开发某个功能，但是没有完成。突然一个紧急的bug需要处理

1. git add . //把修改加入stage中
2. git stash //暂存当前修改内容
3. git checkout bugFixBranch //切换fix分支
4. git pull --rebase origin master 
5. fix the bug //修改bug
6. git add . //添加暂存区
7. git commit -m '' //提交版本库
8. git push //推送远程仓库
9. git checkout test //捡出test分支
10. git stash pop //弹出修改内容
11. continue new feature's development //继续开发test分支
