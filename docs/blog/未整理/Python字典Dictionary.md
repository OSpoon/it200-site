# Python字典Dictionary

### Python字典Dictionary
##### 特点: 1.可变容器模型;
#####      2.存储任意类型对象;
#####      3.key不一定唯一,如重复按最后出现的计算;
#####      4.键必须不可变，所以可以用数字，字符串或元组充当，所以用列表就不行
##### 格式:{'k1':'v1','k2':'v2','k3':'v3'}

#### 基本操作
#### 定义一个字典

	dict = {'Name': 'Zara', 'Age': 7, 'Class': 'First'};

#### 输出

	try:
	    # 正常输出
	    print("dict['Name']: ", dict['Name'])
	    # 当key不存在时会抛出KeyError异常
	    print("dict['Alice']: ", dict['Alice'])
	except KeyError as e:
	    print('您访问的'+str(e)+'key不存在')

#### 修改/添加

	dict['Age'] = 8 # 修改键Age的值为8
	print('修改Age后的字典内容 : {0}'.format(dict))
	dict['School'] = "DPS School" # 添加新的数据到当前字典
	print('添加School后的字典内容 : {0}'.format(dict))

	del dict['Name'] # 删除键是'Name'的条目
	print('删除Name后的字典内容 : {0}'.format(dict))
	dict.clear()     # 清空词典所有条目
	print('清空字典后的字典内容 : {0}'.format(dict))
	del dict        # 删除词典
	try:
	    print('删除字典后的字典中Name内容 : {0}'.format(dict['Name']))
	except TypeError as e:
	    print(e)

#### 内置函数/方法

	dict = {'Name': 'OSpoon', 'Age': 4, 'Class': 'Last'};
	dict1 = {'Name': 'Zara', 'Age': 7, 'Class': 'First'};
	dict2 = {'Name': 'Spoon', 'Age': 10, 'Class': 'Last'};

##### 1.内置函数
##### 1.1字典元素个数 len(dict)

	print('当前字典长度 : {0}'.format(len(dict)))

##### 1.2输出字典可打印的字符串 str(dict)

	print('当前字典按Str输出 : {0}'.format(str(dict)))

##### 1.3变量类型 type(variable)

	print('当前变量类型 : {0}'.format(type(dict)))

#### 2.内置方法
##### 2.1 删除字典内所有元素 dict.clear()
##### 2.2.1 对象之间赋值时是按引用传递的

	dict = {'Name': 'OSpoon', 'Age': 4, 'Class': 'Last'};
	dict2 = dict
	dict.pop('Name')
	print('原始dict id : {0}'.format(id(dict)))
	print('赋值后dict id : {0}'.format(id(dict2)))
	print('原始dict : {0}'.format(dict))
	print('赋值后dictd : {0}'.format(dict2))

###### 2.2.2 copy.copy 浅拷贝 只拷贝父对象，不会拷贝对象的内部的子对象

	dict = {'Name': ['zhangsan','lisi'], 'Age': 4, 'Class': 'Last'};
	dict2 = dict.copy()
	dict['Name'].remove('zhangsan')
	print('原始dict id : {0}'.format(id(dict)))
	print('浅拷贝后dict id : {0}'.format(id(dict2)))
	print('原始dict : {0}'.format(dict))
	print('浅拷贝后dict : {0}'.format(dict2))

###### 2.2.3 copy.deepcopy 深拷贝 拷贝对象及其子对象

	from copy import deepcopy
	dict = {'Name': ['zhangsan','lisi'], 'Age': 4, 'Class': 'Last'};
	dict2 = deepcopy(dict)
	dict['Name'].remove('zhangsan')
	print('原始dict id : {0}'.format(id(dict)))
	print('深拷贝后dict id : {0}'.format(id(dict2)))
	print('原始dict : {0}'.format(dict))
	print('深拷贝后dict : {0}'.format(dict2))

###### 2.3 创建一个新字典，以序列 seq 中元素做字典的键，val 为字典所有键对应的初始值 dict.fromkeys(seq[, val])

	seq = ('Google', 'Runoob', 'Taobao')
	dict = dict.fromkeys(seq)
	print("dict.fromkeys(seq[, val]) : %s" % str(dict))
	dict = dict.fromkeys(seq, 10)
	print("dict.fromkeys(seq[, val]) : %s" % str(dict))

###### 2.4 返回指定键的值，如果值不在字典中返回default值 dict.get(key, default=None)

	dict = {'Name': 'OSpoon', 'Age': 4, 'Class': 'Last'}
	print("dict.get(key, default=None) : %s" %  dict.get('Age'))
	print("dict.get(key, default=None) : %s" %  dict.get('Sex', "Never"))

###### 2.5 以列表返回可遍历的(键, 值) 元组数组 dict.items()

	dict= {'name': '菜鸟', 'alexa': 10000, 'url': 'www.runoob.com'}
	print('dict.items() : {0}'.format(dict.items()))
	# 遍历字典列表
	for key,values in  dict.items():
	    print(key,values)

###### 2.6 以列表返回一个字典所有的键 dict.keys()

	print('dict.keys() : {0}'.format(dict.keys()))

###### 2.7 和get()类似, 但如果键不存在于字典中，将会添加键并将值设为default 	dict.setdefault(key, default=None)

	dict= {'name': '菜鸟', 'alexa': 10000, 'url': 'www.runoob.com'}
	dict.setdefault('Age', '10')
	print('dict.setdefault(key, default=None) : {0}'.format(dict))

###### 2.8 把字典dict2的键/值对更新到dict里 dict.update(dict2)

	dict= {'name': '菜鸟', 'alexa': 10000, 'url': 'www.runoob.com'}
	dict2= {'name': '菜鸟大大', 'alexa': 20000, 'url': 'www.baidu.com'}
	dict.update(dict2)
	print('更新后的dict内容 : {0}'.format(dict))

###### 2.9 以列表返回字典中的所有值 dict.values()

	dict= {'name': '菜鸟', 'alexa': 10000, 'url': 'www.runoob.com'}
	print('dict.values() : {0}'.format(dict.values()))

###### 2.10 删除字典给定键 key 所对应的值，返回值为被删除的值。key值必须给出。 否则，返回default值。 pop(key[,default])

	dict= {'name': '菜鸟', 'alexa': 10000, 'url': 'www.runoob.com'}
	print('dict.pop(key) : {0}'.format(dict.pop('name')))



