# Headers_Raw_To_Dict

'''
将浏览器复制后的请求头转为字典
'''


def headers_raw_to_dict(headers_raw):
    if headers_raw is None:
        return None
    headers = headers_raw.splitlines()
    headers_tuples = [header.split(b':', 1) for header in headers]

    result_dict = {}
    for header_item in headers_tuples:
        if not len(header_item) == 2:
            continue

        item_key = header_item[0].strip()
        item_value = header_item[1].strip()
        result_dict[item_key] = item_value

    return result_dict


if __name__ == '__main__':
    import requests

    headers = headers_raw_to_dict(b"""
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
        Accept-Encoding: gzip, deflate, br
        Accept-Language: zh-CN,zh;q=0.9
        Cache-Control: max-age=0
        Connection: keep-alive
        Host: httpbin.org
        Upgrade-Insecure-Requests: 1
        User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36
    """)

    resp = requests.get('https://httpbin.org/',headers=headers)
    print(resp)
