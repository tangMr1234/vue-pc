// import Vue from 'vue'
import Vuex from 'vuex'
import index from './index.js'

// Vue.use(Vuex);

// 创建 store 实例
export default new Vuex.Store({
    modules: {
        custom: index
    }
})