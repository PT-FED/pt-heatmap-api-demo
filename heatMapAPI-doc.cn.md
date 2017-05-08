文档说明

---

### 嵌入式热图简介

嵌入式热图提供了一套接口供用户来使用热图服务。通过接口，用户可以不登录到产品内便可以使用热图。同时用户可以根据自己的需求来定制热图请求的方式及展示的页面。

### API使用方法与建议

>建议在服务器端发起请求,这样会保证token的安全性。
浏览器端只组合参数发送到你的服务器，如 选择哪个页面查看哪个时间段的数据、查看终端类型或者热图类型等等。并等请求完毕之后，让iframe去加载返回的url。

在请求API之后，浏览器端使用`iframe`嵌入的方式去加载返回的`url`。

建议操作步骤如下:

1. 浏览器端选择好参数传递给服务器，在服务器端组合好token与参数，由你的服务器发送请求到https://reportv3.ptengine.jp/API/v1/heatMap/get

2. ptengine做出响应之后，将结果返回到浏览器。

3. 浏览器判断返回结果的成功与失败，并由你自己去决定怎么处理后续的提示。

4. 如果返回结果`status===success`,那么就可以将`content.url`嵌入到`iframe.src`。在loading结束之后，你就会看到你想看的内容了。

> 注意!!! iframe.src的网络协议。如果你确保你的站点所有的资源都是`https`, 则可以使用`https://reportv3.ptengine.jp`。 如果你的资源含有`http`的资源, 那请不要使用https协议。因为浏览器的安全机制, 导致在`https`协议下 `http`协议的资源无法被加载!

```
    document.getElementById("myIframe").src = 'https://reportv3.ptengine.jp' + content.url;
```

### API: https://reportv3.ptengine.jp/API/v1/heatMap/get

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

一个字符串格式的日期 如: 2017/1/1。

查询数据的开始时间。

```
    startTime = '2017/1/1'
```

3. ##### endTime 必选参数。

一个字符串格式的日期 如: 2017/1/2。

查询数据的结束时间。

最终获取的为`startTime` 与 `endTime` 两个日期之间的数据

```
    endTime = '2017/1/2'
```

如 startTime='2017/1/1', endTime = '2017/1/2'表示要查询两天的数据(1号-2号产生的数据)。

4. ##### terminal 可选参数

默认值 `PC`
选择展示底图的终端类型,只可以是五个值: 

* `PC`
* `Smartphone`
* `Tablet`
* `Ohter`
* `All`

不区分大小写。如果传递错误的参数会拒绝请求。

> 这个参数影响`最终获取的数据`。如 `terminal=Smartphone`则只查询Smartphone下产生的数据

```
    terminal = PC || Smartphone || Tablet
```

5. ##### screen 可选参数

> 这个参数只有在 `terminal等于Smartphone或者Tablet`才有效。

设定在手机或者平板下的横竖屏。只有这两个设备才会有效。

当`terminal等于Smartphone或者Tablet`, 默认值 `V`

只可以是两个值

* `H` (horizontal, 竖屏)
* `V` (vertical, 横屏)

不区分大小写, 如果在`terminal等于Smartphone或者Tablet`时, 传递错误的参数会拒绝请求。

6. ##### heatMapType 可选参数
默认值 `click`
选择热图类型,只可以三个值: 

* `click`
* `attention`
* `analysis`

不区分大小写。如果传递错误的参数会拒绝请求。

```
    heatMapType = click || attention || analysis
```

* #### 返回值

无论请求结果对错，都会返回一个JSON:

```
    //成功
    {
        "status": "success",
        "content": {
            "url":"/API/v1/heatMap/533286fa53b98a46f8d0d02364d45aac/heatMapAPI.html"
        }
    }
    //失败
    {
        "status": "fail",
        "content": "start time can't be empty!"
    }
```
当`status=fail`表示当前请求失败。具体原因可查看`content`.

### 关于API校验

* URL验证：先验证URL的格式，不符合会返回错误提示。再验证这个url是否属于这个sid的domain(在ptengine -> setting > basic中的domain),不属于会返回错误提示。
* token验证：验证token存不存在。
* 时间验证：
    1. 必选参数,不可以为空
    2. 格式必选是 yyyy/MM/dd(比如: 2017/3/22)
    3. 验证时间跨度不能超过30天（跨度太长）
    4. endTime不可以早于startTime
    5. startTime 不能早于 热图数据存储的最大时间(比如储存90天,则startTime不能早于90天之前)
* 设备类型：请求值为空，默认为PC。验证是否是字段内设备（查询的设备有误）
* 热图类型：请求值为空，默认为点击热图。验证是否是字段内热图（查询的热图类型有误)

### 关于iframe与热图宽度

热图底图的宽度受选择的终端影响.下表说明了在不同终端设备下热图底图会呈现不同的宽度。

|设备|宽度|
|:--:|:--:|
|PC|1024px|
|Smartphone|480px|
|Tablet|1024px|

如果不想使用这种宽度，你可以给iframe设置name属性`name=pt_heatmap_api`,然后手动去设置`iframe的宽度`,这样ptengine热图会根据外层的iframe自适应宽度。

