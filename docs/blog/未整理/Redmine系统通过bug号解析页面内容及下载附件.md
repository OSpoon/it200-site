# Redmine系统通过bug号解析页面内容及下载附件

from requests_html import HTMLSession
from urllib.request import unquote
import os

'''
redmine系统通过bug号解析页面内容及下载附件
'''

base_url = ''
cookies = dict(
    _redmine_session='')
session = HTMLSession()


def get_bug(num):
    url_sit = base_url % num
    r = session.get(url_sit, cookies=cookies)
    print('BUG地址 : ', r.html, '\n\n')
    # 解析内容节点
    print('====================开始时间====================')
    print(r.html.xpath('//table[@class="attributes"]/tr[1]/td[2]/text()'), '\n\n')
    html = r.html.xpath('//div[@id="history"]/div')
    print('====================BUG描述====================')
    print(r.html.xpath('//div[@class="description"]/div[2]/p/text()'), '\n\n')
    print('====================更新记录====================')
    for item in html:
        print(item.xpath('//div/h4/a/text()'))
        print(item.xpath('//div/div/p/text()'), '\n\n')
    # 解析附件节点
    html = r.html.xpath('//div[@class="attachments"]/p/a/@href')
    if len(html) > 0:
        create_subsidiary_dir(num)
        for item in html:
            if 'download' in item:
                save_subsidiary('http://poopabc.vicp.cc:90' + item, num)
        print('下载完毕')


def create_subsidiary_dir(dirs):
    if not os.path.exists(dirs):
        os.mkdir(dirs)


def save_subsidiary(url, num):
    print('附件地址 ：', url)
    r = session.get(url, cookies=cookies)
    with open(num + '/' + unquote(os.path.basename(url), encoding='utf-8'), 'wb') as wf:
        wf.write(r.content)


if __name__ == '__main__':
    index = input('请输入BUG号\n')
    get_bug(index)

