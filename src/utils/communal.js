import {Loading} from 'element-ui';

let loading;
export default {
    //Home与bigHome的页面loading
    loading: function (myLoading, _this, background) {
        if (myLoading) {
            loading = Loading.service({
                lock: true,
                text: "Loading...",
                background: background,
                target: document.querySelector('.lw_loading') || document.querySelector('.el-main')
            });
            return 0;
        } else {
            if (loading && loading != '') {
                loading.close();
                _this.NProgressDone();
                return 1;
            }
        }
    },
    //局部loading
    part_loading: function (className, text, background) {
        let loading = Loading.service({
            lock: true,
            text: text || "Loading...",
            background: background || "rgba(255, 255, 255, 1)",
            target: document.querySelector(className)
        });
        return loading;
    },
    //递归方法（应用于各页面判断值是否存在）
    traverse: function (Data, ID, key) {
        if (Data && Data.length) {
            let Deep, T, F;
            for (F = Data.length; F;) {
                T = Data[--F];
                if (ID === T[key]) return T;
                if (T.children) {
                    Deep = this.traverse(T.children, ID, key);
                    if (Deep) return Deep
                }
            }
        }
    },
    //设置滚动条位置
    set_scrollTop: function (id, className, value) {
        if (id) {
            document.getElementById(id).getElementsByClassName(className)[0].scrollTop = value;
        } else {
            document.getElementsByClassName(className)[0].scrollTop = value;
        }
    },
    //设置表格容器的高度或者设置某个容器的高度
    set_height: function (divTop, divBottom) {
        let body_height = document.documentElement.clientHeight;
        let distance_Top = divTop ? divTop.getBoundingClientRect().top : 0;
        let distance_bottom = divBottom ? divBottom.offsetHeight : 0;
        return body_height - distance_Top - distance_bottom;
    }
}