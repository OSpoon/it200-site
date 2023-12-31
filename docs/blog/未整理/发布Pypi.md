# 发布Pypi

##### 1.创建项目

```
    目录结构：
    /example_pkg
      /example_pkg
        __init__.py
```
##### 2.编辑example_pkg/__init__.py
```
    name = "example_pkg"

    * 这只是为了可以在后面确认它是否正确安装
```
##### 3.创建包文件
```
    /example_pkg
      /example_pkg
        __init__.py
      setup.py
      LICENSE
      README.md
```
##### 4.创建的setup.py
```
    import setuptools

    with open("README.md", "r") as fh:
        long_description = fh.read()

    setuptools.setup(
        name="example_pkg",
        version="0.0.1",
        author="Example Author",
        author_email="author@example.com",
        description="A small example package",
        long_description=long_description,
        long_description_content_type="text/markdown",
        url="https://github.com/pypa/example-project",
        packages=setuptools.find_packages(),
        classifiers=(
            "Programming Language :: Python :: 3",
            "License :: OSI Approved :: MIT License",
            "Operating System :: OS Independent",
        ),
    )
```
##### 5.创建许可证 LICENSE
```
    Copyright (c) 2018 The Python Packaging Authority

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
```
##### 6.确认安装setuptools并wheel 安装了最新版本
```
    pip install --upgrade pip
    python3 -m pip install --upgrade setuptools wheel
```
##### 7.编译dist文件
```
    python3 setup.py sdist bdist_wheel

    dist/
      example_pkg-0.0.1-py3-none-any.whl
      example_pkg-0.0.1.tar.gz
```
##### 8.安装twine
```
    python3 -m pip install --upgrade twine
```
##### 9.运行Twine以上传dist
```
    twine upload dist/*

    twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```
##### 备注
```
    创建 .pypirc
    [distutils]
    index-servers =
      pypi
      pypitest

    [pypi]
    repository=https://pypi.python.org/pypi
    username=zhangxin
    password=Zx1234567890.

    [pypitest]
    repository=https://testpypi.python.org/pypi
    username=zhangxin
    password=Zx1234567890.


    发布地址(*创建账号后需要邮件激活)
    https://pypi.org/
    https://test.pypi.org/

    安装
    pip install --upgrade sp-utils
    ```