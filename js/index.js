// 主页 js 代码，主要用于动态添加网站和侧边导航栏

// 创建左边的白线
function createLeftLine(){
    const div = document.createElement("div");
    div.classList.add("left_top_line");
    return div;
}

// 左边标签列表项目类
class LeftCategory {
    // 图片名称，分类标签，点击跳转的id
    constructor(image, name, id) {
        this.img = image;
        this.name = name;
        this.id = id;
    }

    // 动态创建一个分类节点
    createObj(){
        const box = document.createElement("div");
        box.classList.add("left_category_item");
        const image = document.createElement("img");
        image.src = this.img;

        const txt = document.createElement("a");
        txt.classList.add("color_foreground");
        txt.innerHTML = this.name;
        txt.href = "#" + this.id;

        box.append(image);
        box.append(txt);
        return box;
    }
}

// 右边分类标签
class RightCategory
{
    // 标签名称，对应id,便于左边点击跳转
    constructor(name, id) {
        this.name = name;
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


// 右边单个项目
class RightItem
{
    constructor(img, name, des, url) {
        this.img = img;
        this.name = name;
        this.des = des;
        this.url = url;
    }

    createObj(){
        const box = document.createElement("div");
        box.classList.add("right_content_item");
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

        // 设置点击事件
        box.onclick = function (){
            window.open(box.getAttribute("url"));
        }

        return box;
    }
}

// 右边一个类别容器
class RightItemBox
{
    constructor() {
        this.array = [];
    }

    // 添加一个新项目
    addItem(img, name, des, url){
        const item = new RightItem(img, name, des, url);
        this.array.push(item.createObj());
    }

    // 清空数组
    clear(){
        // 数组长度清0,会自动截断后面的，元素会被垃圾回收
        this.array.length = 0;
    }

    // 创建一个box容器，里面包含元素
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

// HTTP 请求简单封装
class HttpClient {
    constructor() {
    }

    get(url, call){
        // 打开一个 http 请求
        const http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function (){
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


// 解析 Json

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

    // 请求
    http_client.get("/data/config.json", function (response) {
        const box = new RightItemBox();
        const json = JSON.parse(response);
        if (json != null){
            // 设置一言和logo
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
                        right_box.append(box.createObj());
                        box.clear();
                    }
                }
            }
        }
    });

}
