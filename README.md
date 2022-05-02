### 一个简单的网站导航
这学期的选修课期末老师要求做一个自己想做的网页，
原本准备做一个博客网站，
但是我后端程序还不够稳定（Https）请求会出问题，加上Mysql驱动也没写了就暂时没弄了，
后来无意间看到了网站导航，就突发奇想自己也搞一个，这个还是比较有用的。

老师原来是要求不能用js的，但是我这个项目为了以后的扩展性必须用到js,
就同老师说了下，给同意了。

像这种网页导航用到的数据和样式都比较有规律，可以先写好样式，
然后通过js动态加载节点，对于网站的数据源，如果原先就写好不方便后期添加和修改，
我采用的json来加载数据源，方便后期添加和修改。

项目除了js不满足老师作业要求外其他基本满足，
主要结构如下，分别如下：

```mermaid
graph LR;
A(根目录) --- d(data);
d --- 里面有一个文件有用 `config.json`，这个json文件存放数据源;
A --> c(css);
c --> 存放样式文件;
A --> i(img);
i --> 存放网站导航的图片，如果图片有错误样式显示就会有问题;
A --> j(js);
j --> js文件夹，存放javascript脚本;
A --> index(index.html);
index-->主页;
A-->s(search.html);
s-->展示搜索结果;

```

- **data** : 里面有一个文件有用 `config.json`，这个json文件存放数据源
- **css** : 存放样式文件
- **img** : 存放网站导航的图片，如果图片有错误样式显示就会有问题
- **js** : js文件夹，存放javascript脚本
- index.html : 主页
- search.html : 展示搜索结果

json文件数据源格式比较简单:
```json
{
    "logoText": "Ticks的破导航(这里可以写上左上角的logo字样)", 
    "oneWord": "这里是上方的一言", 
    "data": [
        {
            "category": "常用工具(分类名称)", 
            "image": "img/xxx.png(img下的分类图片，显示在左边)", 
            "id": "category_id(分类id,主要用于点击左边可以跳转到指定区域)", 
            "content": [
                {
                    "name": "Google翻译(具体分类下的项目)", 
                    "image": "google_translate.png(同上)", 
                    "description": "中国式机器翻译(网站简要描述)", 
                    "url": "https://translate.google.cn/(网站地址，点击会跳转到这里)"
                }, 
                {
                    "name": "高德地图", 
                    "image": "gd_map.png", 
                    "description": "很好用的导航，适合路盲", 
                    "url": "https://www.amap.com/"
                }
            ]
        }
    ]
}
```

### 截图
![index界面截图](screenshot/index_screenshot.png)

### 注意
json文件格式一定要正确，里面图片名称也要正确，不然界面都会出现错误。

