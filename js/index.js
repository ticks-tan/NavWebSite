// 主页 js 代码，主要用于动态添加网站和侧边导航栏

// 创建左边的白线
function createLeftLine(){
    const div = document.createElement("div");
    div.classList.add("left_top_line");
    return div;
}

// 左边标签列表项目类，封装成类，方便调用
class LeftCategory {
    // 图片名称，分类标签，点击跳转的id
    constructor(image, name, id) {
        // 分类图标
        this.img = image;
        // 分类名称
        this.name = name;
        // 点击后会滚动到 id 处
        this.id = id;
    }

    // 动态创建一个分类节点
    createObj(){
        // 外部盒子
        const box = document.createElement("div");
        // 添加类名，应用样式
        box.classList.add("left_category_item");
        // 创建图标
        const image = document.createElement("img");
        image.src = this.img;

        const txt = document.createElement("a");
        txt.classList.add("color_foreground");
        txt.innerHTML = this.name;
        // 实现点击页面会滚动到指定位置
        txt.href = "#" + this.id;

        box.append(image);
        box.append(txt);
        return box;
    }
}

// 右边分类标签，封装成类
class RightCategory
{
    // 标签名称，对应id,便于左边点击跳转
    constructor(name, id) {
        // 分类名称
        this.name = name;
        // 分类 ID
        this.id = id;
    }

    createObj(){
        const box = document.createElement("div");
        box.classList.add("right_content_category_box");
        box.id = this.id;

        const img_box = document.createElement("div");
        img_box.classList.add("right_category_img");
        const img = document.createElement("img");
        img.src = "img/tag.png";
        img_box.append(img);

        const txt = document.createElement("div");
        txt.classList.add("right_category_txt");
        txt.classList.add("color_foreground");
        txt.innerHTML = this.name;

        box.append(img_box);
        box.append(txt);
        return box;
    }

}


// 右边单个项目，封装成类
class RightItem
{
    constructor(img, name, des, url) {
        // 网站图标
        this.img = img;
        // 网站名称
        this.name = name;
        // 网站描述
        this.des = des;
        // 网站链接
        this.url = url;
    }

    createObj(){
        const box = document.createElement("div");
        box.classList.add("right_content_item");
        // html本质是 xml 文档，可以设置自定义属性，这里自定义 URL ，方便后面点击事件获取URL
        box.setAttribute("url", this.url);

        const box_left = document.createElement("div");
        box_left.classList.add("right_content_left");
        const img = document.createElement("img");
        img.src = this.img;
        box_left.append(img);

        const box_right = document.createElement("div");
        box_right.classList.add("right_content_right");
        const name = document.createElement("div");
        name.classList.add("right_content_name");
        name.innerHTML = this.name;
        box_right.append(name);
        const des = document.createElement("div");
        des.classList.add("right_content_des");
        des.innerHTML = this.des;
        box_right.append(des);

        box.append(box_left);
        box.append(box_right);

        // 设置点击事件，点击后跳转指定url处
        box.onclick = function (){
            window.open(box.getAttribute("url"));
        }

        return box;
    }
}

// 右边一个类别容器，类里面存储了一个类别的所有项目
class RightItemBox
{
    constructor() {
        // 存储具体项目的数组
        this.array = [];
    }

    // 添加一个新项目
    addItem(img, name, des, url){
        // 构造一个项目并添加到数组中
        const item = new RightItem(img, name, des, url);
        this.array.push(item.createObj());
    }

    // 清空数组
    clear(){
        // 数组长度清0,会自动截断后面的，元素会被垃圾回收
        this.array.length = 0;
    }

    // 创建一个box容器，里面自动添加具体项目
    createObj(){
        const box = document.createElement("div");
        box.classList.add("right_content_item_box");

        // 遍历数组取出元素并添加
        let len = this.array.length;
        for (let i = 0; i < len; ++i){
            box.append(this.array[i]);
        }
        return box;
    }
}

// HTTP 请求简单封装，为了获取配置文件
class HttpClient {
    constructor() {
    }

    // 发送 GET 请求，并传入一个毁掉函数，请求成功会调用回调函数
    get(url, call){
        // 打开一个 http 请求
        const http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function (){
            // 请求成功
            if (http_request.readyState === 4 && http_request.status === 200){
                if (call != null){
                    call(http_request.responseText);
                }
            }
        }
        http_request.open("GET", url, true);
        http_request.send(null);
    }
}

// 解析 Json 并添加元素，配置文件为 JSON 格式，方便编写也方便解析
function loadData(){
    // 左边项目
    const left_box = document.getElementById("left_category_box_id");
    // 右边项目
    const right_box = document.getElementById("right_content_box_id");
    // logo提示
    const logo_text = document.getElementById("logo_text_id");
    // 一言 语句
    const one_word = document.getElementById("one_word_id");

    // Http 请求客户端
    const http_client = new HttpClient();

    // 根域名路径
    const local_url = window.prototype + "//" + window.location.host;
    console.log(local_url + "/");

    // 发送GET请求获取配置文件（这里不用自己获取根域名～）
    http_client.get("/data/config.json", function (response) {
        // response就是服务器返回的数据
        const box = new RightItemBox();

        // 下面是正是解析部分
        const json = JSON.parse(response);
        if (json != null){
            // 设置一言和 logo文字
            if (logo_text != null && json.logoText){
                logo_text.innerHTML = json.logoText;
            }
            if (one_word != null && json.oneWord){
                one_word.innerHTML = json.oneWord;
            }
            // 获取 data
            const data = json.data;
            if (data && data instanceof Array){
                // 遍历 data ，取出每一个分类
                const len = data.length;
                for (let i = 0; i < len; ++i){
                    const cat = data[i];
                    if (cat instanceof Object && cat.category && cat.image && cat.id){
                        // 添加左边的分类
                        const category_item = new LeftCategory(cat.image, cat.category, cat.id);
                        left_box.append(category_item.createObj());
                        // 添加右边分类
                        const right_category_item = new RightCategory(cat.category, cat.id);
                        right_box.append(right_category_item.createObj());
                    }

                    const content = cat.content;
                    if (content && content instanceof Array){
                        // 遍历分类下的每个具体项目
                        let len1 = content.length;
                        for (let j = 0; j < len1; ++j){
                            const item = content[j];
                            if (item.name && item.image && item.description && item.url){
                                box.addItem(item.image, item.name, item.description, item.url);
                            }
                        }
                        // 添加分类，并清空已有内容
                        right_box.append(box.createObj());
                        box.clear();
                    }
                }
            }
        }
    });

}

// 初始化浮动按钮点击事件和滚动事件
function initFloatButton(){
    const float_button = document.getElementById("float_button");

    if (float_button != null) {
        // 获取距离窗口顶部距离
        let top_size = window.scrollY;
        // 添加滚动监听
        window.addEventListener("scroll", function () {
            let top = window.scrollY;
            if (top - top_size > 200) {
                // 大于一定值，显示浮动按钮
                setTimeout(function (){
                    float_button.style.display = "block";
                }, 10);
            } else {
                setTimeout(function (){
                    float_button.style.display = "none";
                }, 10);
            }
        });

        // 添加点击事件
        float_button.onclick = function (){
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior : "smooth"
            });
        }
    }
}

