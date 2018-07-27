import 'babel-polyfill'
// import Vue from 'vue'
// import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App'
import store from './vuex/store'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes/routes'
import utils from '@/utils/communal'

// import 'font-awesome/css/font-awesome.min.css'

let Base64 = require('js-base64').Base64;
let VueCookie = require('vue-cookie');

// Vue.use(ElementUI);
Vue.use(VueRouter);
// Vue.use(Vuex);
Vue.use(VueCookie);

//进度条配置，关闭右侧旋转圆环等
NProgress.configure({showSpinner: false, minimum: 0.15});

//定义全局关闭顶部进度条的方法
Vue.prototype.NProgressDone = function () {
    NProgress.done();
};

Vue.prototype.$utils = utils;

let router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    NProgress.start(); //进度条
    store.state.custom.is_loading = true;  //局部loading状态
    //判断是否登录并且是否在登录页面
    if (!VueCookie.get('access') && to.path != '/login') {
        next({path: '/login'});
        NProgress.done();
    }
    else {
        next();
        //首先判断to.params路由里面的参数是否存在，再判断当前在哪个系统，后台传入的数组有没有相匹配的值，没有就进入404页面
        // if (to.params && to.params.url && to.params.url != '') {
        //     if (to.path.indexOf(validate_router) > 0) {
        //         let HomeMenu = JSON.parse(localStorage.getItem("HomeMenu"));
        //         if (HomeMenu) {
        //             let HomeRoutePath = utils.traverse(HomeMenu.route, to.path.split("?")[0], "path");
        //             let HomeUserPath = utils.traverse(HomeMenu.user.route, to.path.split("?")[0], "path");
        //             if (!HomeRoutePath && !HomeUserPath) {
        //                 next({path: '/404'});
        //             } else {
        //                 next();
        //             }
        //         } else {
        //             next();
        //         }
        //     } else {
        //         let BigMenu = JSON.parse(localStorage.getItem("BigMenu"));
        //         if (BigMenu) {
        //             let BigPath = utils.traverse(BigMenu, to.path.split("?")[0], "path");
        //             (!BigPath) ? (to.path != "/404") ? next({path: '/404'}) : next() : next();
        //         } else {
        //             next();
        //         }
        //     }
        // } else {
        //     next();
        // }
    }
});

router.afterEach(transition => {
    // NProgress.done();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

