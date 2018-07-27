//加载echarts和echarts主题
export function LoadEchart() {
    return new Promise(function (resolve, reject) {
        let arr = ["//cdn-static.coldyun.net/public/echart-4.1.0/echarts.min.js", "//cdn-static.coldyun.net/public/echart-4.1.0/echart-theme.js"];
        seriesLoadScripts(arr, function () {
            resolve(echarts);
        });
    })
}

//加载百度地图
export function BDMap(mapUrl) {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            if (mapUrl && mapUrl != "" && mapUrl != null && mapUrl != "undefind") {
                seriesLoadScripts(mapUrl, function () {
                    resolve(BMap);
                });
            } else {
                resolve(BMap);
            }
        }
        // 异步加载百度地图api
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//api.map.baidu.com/api?v=2.0&ak=GzGStHdTgf1Z774pqvWPITMR&callback=init&s=1";
        script.onerror = reject;
        document.head.appendChild(script);
    })
}

//判断脚本是否加载完成
function seriesLoadScripts(scripts, callback) {
    if (typeof(scripts) != "object") var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(), last = scripts.length - 1, recursiveLoad = function (i) {
        s[i] = document.createElement("script");
        s[i].setAttribute("type", "text/javascript");
        s[i].onload = s[i].onreadystatechange = function () {
            if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (i != last) recursiveLoad(i + 1); else if (typeof(callback) == "function") callback();
            }
        }
        s[i].setAttribute("src", scripts[i]);
        HEAD.appendChild(s[i]);
    };
    recursiveLoad(0);
}
