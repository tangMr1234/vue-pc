let home_index = "/home/index/ucenter-admin-feature";  //跳转系统首页,路由里有用到
let validate_router = "home";  //根据该值判断是在哪个系统
let BaseUrl = "https://dev4.coldyun.com"; //主要应用于请求(login页面)等等
let bdmap = {title: "客户地图", path: "/big/iframe/big-app-map-chinachart"};  //百度地图回到客户地图
let CODE_LoginException = [300, 399];  //需要重新登录的错误码
let CODE_AuthException = [400, 499]; //权限错误的错误码
// 判断是否开启cookie
if (!navigator.cookieEnabled) {
    alert("平台提醒：请打开你的浏览器的Cookie功能,否则无法正常使用！");
}