# Requests基础使用

### Requests
    # 导入requests包
    import requests
######
    # get请求
    r = requests.get('https://www.toutiao.com/stream/widget/local_weather/data/?city=北京')
    # 输出文本内容
    print(r.text)
    # 获取响应时间
    print(r.elapsed.total_seconds())

    # get请求另一种传输传递方式
    params = {'city':'北京'}
    r = requests.get('https://www.toutiao.com/stream/widget/local_weather/data/',params = params)
    # 输出请求url
    print(r.url)

    # 如目标输出为json格式,可直接r.json()获取
    print(r.json())

    # 获取响应状态
    print(r.status_code)
    print(r.raise_for_status())

    #二进制响应内容 r.content
    r = requests.get('https://s3.pstatp.com/toutiao/resource/ntoutiao_web/static/image/logo_201f80d.png')
    print(r.content)
#####
    # 构建请求头
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'}
    # 构建cookies信息
    cookies = dict(UM_distinctid='1604dd6ab45326-0d04bee701d043-5c153d17-100200-1604dd6ab4642d',
                    uuid='w:801adc475a2b4d7d89a956990f5adbe6',
                    _ga='GA1.2.1751799382.1513134389',
                    tt_webid='6563439125842724355',
                    _gid='GA1.2.1115919896.1528169823',
                    __tasessionId='zhjw7xapz1528186542549',
                    CNZZDATA1259612802='148019660-1513131084-https%253A%252F%252Fmp.toutiao.com%252F%7C1528185611',
                    sso_uid_tt='3e254c23b9e9dd73574090da1d83121e',
                    sso_auth_status='ea58e734cde5e3d843db12f50a522d3e',
                    login_flag='558d8830c29cec66fb84914618363030',
                    sessionid='5efeca15735b2c05760dedf74d58d6ac',
                    uid_tt='299b51fc80c3b7044da26a62f502ce76',
                    sid_tt='5efeca15735b2c05760dedf74d58d6ac',
                    sid_guard='5efeca15735b2c05760dedf74d58d6ac|1528186567|15552000|Sun\054 02-Dec-2018 08:16:07 GMT',
                    toutiao_sso_user='fec1e23ffa30fcd7ece849a13ea4136b',
                    sso_login_status='0')
    # 构建请求数据信息
    data = {'mobile':'13728192837',
          'code':'111111',
          'captcha':'1231',
          'is_30_days_no_login':'false',
          'service':'https://www.toutiao.com/'}
    # 构建请求代理
    proxies = {'http://121.232.148.102:9000': 'http://115.223.196.126:9000'}
    # 发送请求
    try:
        r = requests.post('https://sso.toutiao.com/quick_login/', data=data, cookies=cookies, headers=headers,timeout=30,proxies=proxies)
        print(r.text)
    except (ConnectionError):
        print('连接超时...')
