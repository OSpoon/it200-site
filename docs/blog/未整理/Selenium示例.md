# Selenium示例

示例 :

```
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

# 驱动位置
path = 'C:\\Users\\zhanxiaolin-n22\\PycharmProjects\\flask_demo\\chromedriver.exe'
browser = webdriver.Chrome(executable_path=path)
# 加载地址
browser.get("http://localhost:8888/#/")

# 登录
def login():
    # 账号密码输入
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[3]/div[1]/div[1]/input').send_keys('1301000942')
    time.sleep(1)
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[3]/div[2]/div[1]/input').send_keys('043617')
    time.sleep(1)
    # 记住密码
    browser.find_element_by_xpath('/html/body/div[1]/div[1]/div/div[3]/div[3]/input').click()
    time.sleep(1)
    # 登录
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[3]/div[5]/input').click()

# 选择模块
def xuanze_model():
    try:
        WebDriverWait(browser, 120).until(
            # 在线投保dom中加载完毕
            EC.presence_of_element_located((By.XPATH, '//*[@id="home"]/div[1]/div[4]/ul/li[1]'))
        )
    finally:
        print('模块选择')
    # 在线投保
    browser.find_element_by_xpath('//*[@id="home"]/div[1]/div[4]/ul/li[1]').click()
    time.sleep(1)
    browser.implicitly_wait(60)

# 选择产品
def xuanze_page():
    try:
        WebDriverWait(browser, 120).until(
            EC.text_to_be_present_in_element(
                (By.XPATH, '/html/body/div/div[1]/div/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]/p[1]'),
                '光大永明吉瑞宝两全保险')
        )
    finally:
        print('产品选择')
    # 选择产品
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]').click()
    time.sleep(1)
    browser.implicitly_wait(60)

# 基本信息页面
def jiben_page():
    try:
        WebDriverWait(browser, 120).until(
            #产品信息已获取
            EC.text_to_be_present_in_element(
                (By.XPATH, '/html/body/div/div[1]/div/div[4]/div/div[4]/div[2]/ul/li[1]/span'),
                '光大永明吉瑞宝两全保险')
        )
    finally:
        print('基本信息填写')
    # 输入信息
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[4]/div/div[2]/div[2]/ul/li[1]/p[2]/input').send_keys(
        '张三')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 打开关系选择
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[4]/div/div[3]/div[1]/div').click()
    time.sleep(1)
    # 选择关系
    browser.find_element_by_xpath('//*[@class="mbsc-sc-itm   mbsc-btn-e"][1]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 确定关系
    browser.find_element_by_xpath('/html/body/div[2]/div/div[2]/div/div/div[4]/div[2]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 立即投保
    browser.find_element_by_xpath('/html/body/div/div[1]/div/div[4]/div/div[12]/div/div[2]/div').click()

# 详情页面
def xiangqing_page():
    try:
        WebDriverWait(browser, 120).until(
            #产品信息已获取
            EC.text_to_be_present_in_element_value(
                (By.XPATH, '//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[1]/p[2]/input'),
                '张三')
        )
    finally:
        print('详细信息填写')
    # 输入证件号
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[3]/p[2]/input').send_keys(
        '110101198001010010')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 勾选有效期
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[4]/div[2]/p[1]/input').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 点击婚姻选择
    browser.find_element_by_xpath('//*[@class="nationality"][7]/div/input').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 选择婚姻
    browser.find_element_by_xpath('//*[@class="mbsc-sc-whl-sc"]/div[42]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 确认婚姻
    browser.find_element_by_xpath('/html/body/div[2]/div/div[2]/div/div/div[4]/div[2]/div').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 联系地址
    browser.find_element_by_xpath('//*[@id="adress"]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    #省
    browser.find_element_by_xpath('//*[@id="content"]/div[4]/div[5]/div/p').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 市
    browser.find_element_by_xpath('//*[@id="content"]/div[4]/ul/li').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 县
    browser.find_element_by_xpath('//*[@id="content"]/div[4]/div[4]/a/div[2]/div[2]/input').send_keys(
        '管庄县')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 确定联系地址
    browser.find_element_by_xpath('//*[@id="content"]/div[4]/div[6]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 街道
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[10]/p[2]/input').send_keys(
        '管庄街道')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 社区
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[11]/p[2]/input').send_keys(
        '管庄社区')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 详细地址
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[12]/p[2]/input').send_keys(
        '管庄详细地址')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 邮编
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[13]/p[2]/input').send_keys(
        '100000')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 邮箱
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[14]/p[2]/input').send_keys(
        '1825203636@qq.com')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 手机号
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[15]/p[2]/input').send_keys(
        '13792032439')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 工作单位
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[17]/p[2]/input').send_keys(
        '丰台办公地点')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 年收入
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[2]/ul/li[18]/p[2]/input').send_keys(
        '10')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 点击银行选择
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[16]/ul/li[2]/div').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 选择银行
    browser.find_element_by_xpath('//*[@class="mbsc-sc-whl-sc"]/div[42]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 确认银行
    browser.find_element_by_xpath('/html/body/div[2]/div/div[2]/div/div/div[4]/div[2]/div').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 银行卡号
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[2]/div/div/div[16]/ul/li[3]/p[2]/input').send_keys(
        '402791123123123123')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 详细信息页面填写完成下一步
    browser.find_element_by_xpath('//*[@id="content"]/div[6]/div[7]/div[2]/div').click()

# 告知页面录入
def gaozhi_page():
    try:
        WebDriverWait(browser, 120).until(
            #产品信息已获取
            EC.text_to_be_present_in_element(
                (By.XPATH, '//*[@id="content"]/div[2]/div/div[2]/div/div[1]/p[1]'),
                '1')
        )
    finally:
        print('告知填写')
    # 输入身高
    browser.find_element_by_xpath('//*[@id="content"]/div[2]/div/div[2]/div/div[1]/div/input[1]').send_keys(
        '172')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 输入体重
    browser.find_element_by_xpath('//*[@id="content"]/div[2]/div/div[2]/div/div[1]/div/input[2]').send_keys(
        '62')
    time.sleep(1)
    browser.implicitly_wait(60)
    # 勾选确认
    browser.find_element_by_xpath('//*[@id="content"]/div[2]/div/div[25]/p/input').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    # 告知页面填写完成下一步
    browser.find_element_by_xpath('//*[@id="content"]/div[5]/div[3]/button').click()

# 业务人员报告书
def baogaoshu_page():
    try:
        WebDriverWait(browser, 120).until(
            #产品信息已获取
            EC.text_to_be_present_in_element_value(
                (By.XPATH, '//*[@id="reportBookCtl1"]/div[2]/div[7]/input[1]'),
                '1')
        )
    finally:
        print('报告书填写')
    #途径
    browser.find_element_by_xpath('//*[@id="jiashu"]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    #目的
    browser.find_element_by_xpath('//*[@id="chuxu"]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    #来源
    browser.find_element_by_xpath('//*[@id="reportBookCtl1"]/div[2]/div[7]/input[2]').send_keys(
        '打工')
    time.sleep(1)
    browser.implicitly_wait(60)
    #总资产
    browser.find_element_by_xpath('//*[@id="reportBookCtl1"]/div[2]/div[7]/input[3]').send_keys(
        '100')
    time.sleep(1)
    browser.implicitly_wait(60)
    #是否
    browser.find_element_by_xpath('//*[@id="thirdId_0"]').click()
    time.sleep(1)
    browser.implicitly_wait(60)
    browser.find_element_by_xpath('//*[@id="content"]/div[4]/div[3]/button').click()
    print('填写完毕')

login()
xuanze_model()
xuanze_page()
jiben_page()
xiangqing_page()
gaozhi_page()
baogaoshu_page()
```

