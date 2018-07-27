/************ *  主结构框架 * ************/
const Login = resolve => require(["@/views/Layout/Login.vue"], resolve);     //登陆
const NotFound = resolve => require(["@/views/Layout/404.vue"], resolve);   //404，页面未找到
const Home = resolve => require(["@/views/Layout/Home.vue"], resolve);     //主框架，包括左侧菜单与头部导航和右下视图
const BigHome = resolve => require(["@/views/Layout/BigHome.vue"], resolve); //大屏主框架，包括下方视图
const Form = resolve => require(["@/views/Home/Form.vue"], resolve); //表单

/************ * 视图区域 * ************/
const Main = resolve => require(["@/views/Home/Index.vue"], resolve);            //系统首页
const Home_List = resolve => require(["@/views/Home/List.vue"], resolve);       //公用带头部搜索+按钮+弹出表单+分页的模板页

/************ *  big大屏 * ************/
const Big = resolve => require(["@/views/Big/Index.vue"], resolve);    //大屏首页
const Frame = resolve => require(["@/views/Big/Frame.vue"], resolve);  // frame
const MapList = resolve => require(["@/views/Big/MapList.vue"], resolve);  // frame2
const Company = resolve => require(["@/views/Big/Company.vue"], resolve);  // list and chart组合页面
const Echart_Map = resolve => require(["@/views/Big/Echart_Map.vue"], resolve);  // 地图

const Left_Tab = resolve => require(["@/views/Other/Left_Tab.vue"], resolve);  // tab菜单
const Anchor_Tab = resolve => require(["@/views/Other/Anchor_Tab.vue"], resolve);  // 锚点tab菜单
const Sortable = resolve => require(["@/views/Other/Sortable.vue"], resolve);  // 拖动

const Upload = resolve => require(["@/views/Other/Upload.vue"], resolve);  // 图片上传
const ceshi = resolve => require(["@/views/Layout/ceshi.vue"], resolve);  // 测试


let routes = [
    {
        path: "/login",
        component: Login,
        name: "登录界面",
        hidden: true
    },
    /*********** 系统路由 ***********/
    {
        path: "/",
        component: Home,
        name: "冷链监测系统",
        redirect: home_index,    //Config.js中配置
        children: [
            {path: "/home/index/:url", component: Main, name: "系统首页"},
            {path: "/home/list/:url", component: Home_List, name: "表格列表模板"},
            {path: "/home/form/:url", component: Form, name: "表单"},
            {path: "/upload", component: Upload, name: "上传"},
            {path: "/left_tab", component: Left_Tab, name: "tab菜单"},
            {path: "/anchor_tab", component: Anchor_Tab, name: "锚点tab菜单"},
            {path: "/sortable", component: Sortable, name: "拖动"},

            {path: "/ceshi", component: ceshi, name: "测试"},
        ]
    },
    /*********** 大屏部分的路由 ***********/
    {
        path: "/",
        component: BigHome,
        name: "冷链监测系统-大屏",
        redirect: "/big/multi_chart/:url",
        children: [
            {path: "/big/multi_chart/:url", component: Big, name: "首页"},
            {path: "/big/iframe/:url", component: Frame, name: "地图总览"},
            {path: "/big/bdMap/:url", component: MapList, name: "地图总览2"},
            {path: "/big/svgmap/:url", component: Echart_Map, name: "区域地图"},
            {path: "/big/grid_chart/:url", component: Company, name: "列表和图表"},
            {path: "/big/refresh/:url", component: Company, name: "定时刷新"},
        ]
    },
    /*********** 其他 ***********/
    {
        path: "/404",
        component: NotFound,
        name: "错误界面",
        hidden: true
    },
    {
        path: "*",
        hidden: true,
        redirect: {path: "/404"}
    },
];

export default routes;
