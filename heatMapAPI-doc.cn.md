文档说明

---

[中文API文档说明](https://github.com/PT-FED/pt-heatmap-api-demo/blob/master/heatMapAPI-doc.cn.md)
[日本のAPIドキュメント](https://github.com/PT-FED/pt-heatmap-api-demo/blob/master/heatMapAPI-doc.jp.md)

### https://reportv3.ptengine.jp/API/v1/heatMap/get

* #### 返回值

返回一个JSON:

```
    {
        "status":"success",
        "content"{
            "url":"/API/v1/heatMap/533286fa53b98a46f8d0d02364d45aac/heatMapAPI.html"
        }
    }
```
当`status=fail`表示当前请求失败。具体原因可查看`contetn`或者`errorCode`.

* #### method: GET

* #### token验证:
在request headers中添加header:
```
    'PT-heatmap-Authorization': 'your token' 
```
没有传递这个token会被拒绝请求,返回403.
token不对也会被拒绝请求。
* #### 参数

1. ##### url 必选参数。

要查看的热图底图url。
> 在请求时, 最好 encodeURIComponent(url).

```
    url = http%3A%2F%2Fwww.test.com
```

2. ##### startTime 必选参数。

10位的时间戳。
查询数据的开始时间。

```
    startTime = 1487088000
```

3. ##### endTime 必选参数。

10位的时间戳。
查询数据的结束时间。
最终获取的为`startTime` 与 `endTime` 两个日期之间的数据

```
    endTime = 1489593600
```

4. ##### terminal 必选参数

选择展示底图的终端类型,只可以是三个值: 
* `PC`
* `Smartphone`
* `Tablet`
不区分大小写。如果传递错误的参数会拒绝请求。
这个参数影响`最终获取的数据`。如 `terminal=Smartphone`则只查询Smartphone下产生的数据

```
    terminal = PC || Smartphone || Tablet
```

5. ##### heatMapType 必选参数

选择热图类型,只可以三个值: 

* `click`
* `attention`
* `analysis`

不区分大小写。如果传递错误的参数会拒绝请求。

```
    heatMapType = click || attention || analysis
```

### 如何使用这个API

>建议在服务器端发起请求,这样会保证token的安全性。
浏览器端只组合参数发送到你的服务器，如 选择哪个页面查看哪个时间段的数据、查看终端类型或者热图类型等等。并等请求完毕之后，让iframe去加载返回的url。

在请求API之后，浏览器端使用`iframe`嵌入的方式去加载返回的`url`。

建议操作步骤如下:

1. 浏览器端选择好参数传递给服务器，在服务器端组合好token与参数，由你的服务器发送请求到https://reportv3.ptengine.jp/API/v1/heatMap/get

2. ptengine做出响应之后，将结果返回到浏览器。

3. 浏览器判断返回结果的成功与失败，并由你自己去决定怎么处理后续的提示。

4. 如果返回结果`status===success`,那么就可以将`content.url`嵌入到`iframe.src`。在loading结束之后，你就会看到你想看的内容了。
```
    document.getElementById("myIframe").src = https://reportv3.ptengine.jp/API/v1/heatMap/533286fa53b98a46f8d0d02364d45aac/heatMapAPI.html
```