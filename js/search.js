class ResultItem
{
    constructor(img, name, des, url) {
        this.img = img;
        this.name = name;
        this.des = des;
        this.url = url;
    }

    createObj(){
        const box = document.createElement("div");
        box.classList.add("result_item");
        box.setAttribute("url", this.url);

        const box_left = document.createElement("div");
        box_left.classList.add("result_content_left");
        const img = document.createElement("img");
        img.src = this.img;
        box_left.append(img);

        const box_right = document.createElement("div");
        box_right.classList.add("result_content_right");
        const name = document.createElement("div");
        name.classList.add("result_content_name");
        name.innerHTML = this.name;
        box_right.append(name);
        const des = document.createElement("div");
        des.classList.add("result_content_des");
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

// 搜索结果为空显示项目
function createResultEmptyItem()
{
    let item = new ResultItem("img/cry_face.png", "没有结果-_-",
        "没有结果就是最好的结果",
        "https://m.baidu.com/s?word=%E7%BD%91%E7%AB%99%E5%AF%BC%E8%88%AA");
    return item.createObj();
}

// Http客户端封装
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

// 搜索结果
function searchResult(q){
    // 判断是否为空
    if (q != null){
        let http_client = new HttpClient();
        let result_box = document.getElementById("result_box_id");
        let item_array = [];

        if (!result_box) return;
        let query = new RegExp("([a-z0-9A-Z ]*)" + "([" + q + "])+" + "([a-z0-9A-Z ]*)", "i");

        // 清空结果
        let child = result_box.firstElementChild;
        while (child){
            result_box.removeChild(child);
            child = result_box.firstElementChild;
        }
        http_client.get("/data/config.json", function (response){
            const json = JSON.parse(response);
            const json_data = json.data;
            if (json_data && json_data instanceof Array){
                const data_len = json_data.length;
                for (let i = 0; i < data_len; ++i){
                    const item_content = json_data[i].content;
                    if (item_content && item_content instanceof Array){
                        const content_len = item_content.length;
                        for (let j = 0; j < content_len; ++j){
                            const item_json = item_content[j];
                            if (item_json.name && item_json.image && item_json.description && item_json.url){
                                if (item_json.name.search(query) !== -1) {
                                    const item = new ResultItem(item_json.image, item_json.name,
                                        item_json.description, item_json.url);
                                    item_array.push(item.createObj());
                                }
                            }
                        }
                    }
                }
            }
            if (item_array.length > 0){
                const len = item_array.length;
                for (let i = 0; i < len; ++i){
                    result_box.append(item_array[i]);
                }
            }else {
                result_box.append(createResultEmptyItem());
            }
        });
    }
}

// 初始化输入框
function initSearchBox(){
    let search_input = document.getElementById("search_input_id");
    if (search_input){
        search_input.onkeydown = function (event){
            let ev = event || window.event;
            let code = ev.keyCode || ev.which || ev.code;
            if (code === 13){
                console.log(search_input.value);
                searchResult(search_input.value);
            }
        }
    }
}

// 检查 URl 判断是否从其他界面跳转
function checkUrl(){
    // 获取参数部分url --> ?search=xxx
    const params = decodeURI(window.location.search);
    const search_input = document.getElementById("search_input_id");
    let query = "";
    if (params.startsWith("?website=")){
        let pos = params.indexOf("=", 7);
        if (pos !== -1){
            query = params.slice(pos + 1);
        }
    }
    if (query.length > 0){
        // 设置输入框值
        if (search_input){
            search_input.value = query;
        }
        searchResult(query);
    }
}

// 初始化浮动按钮点击事件和滚动事件
function initFloatButton(){
    const float_button = document.getElementById("float_button_id");

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