# Tinypng图片压缩非API

```
	import requests
    import json
    import os


    '''
    上传文件进行压缩并获取返回压缩后的图片地址
    '''
    def get_down_url(file_path):
        url = 'https://tinypng.com/web/shrink'
        with open(file_path, 'rb') as rf:
            data = rf.read()
            headers = {'user-agent':
                           'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) '
                           'AppleWebKit/537.36 (KHTML, like Gecko) '
                           'Chrome/68.0.3440.106 Mobile Safari/537.36'}
            resp = requests.post(url, data=data, headers=headers)
            print(json.loads(resp.text).get('error'))
            resp_json = json.loads(resp.text)
            (filepath, tempfilename) = os.path.split(file_path)
            (filename, extension) = os.path.splitext(tempfilename)
            yield resp_json.get('output')['url']+'/'+filename+extension


    '''
    下载指定地址图片到本地
    '''
    def down_img(url):
        (filepath, tempfilename) = os.path.split(url)
        (filename, extension) = os.path.splitext(tempfilename)
        print('start down : ' + filename + extension + ' ...')
        resp = requests.get(url)
        with open('to/'+filename+extension, 'wb') as wf:
            print('start save : ' + filename + extension + ' ...')
            wf.write(resp.content)
            print('save ok : ' + filename+extension)


    def start_task():
        paths = os.listdir('./from')
        print('start task')
        for item in paths:
            print('from : ' + item)
            urls = get_down_url('from/' + item)
            for url in urls:
                down_img(url)


    if __name__ == '__main__':
        start_task()
        ```
