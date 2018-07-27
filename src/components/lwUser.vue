<template>
    <div class="user_nav">
        <!-- 开启或关闭浏览器全屏 -->
        <el-tooltip class="cursor_pointer" :content="isFullScreen?'退出全屏':'全屏'"
                    placement="bottom">
            <i :class="{ 'icon-tuichuquanping-copy':isFullScreen, 'icon-quanping':!isFullScreen, 'iconfont':true}"
               style="margin-right:20px;" @click="is_FullScreen"></i>
        </el-tooltip>
        <!-- 消息提示 -->
        <span class="cursor_pointer" style="margin-right:20px;" @click="open()" v-if="data&&data.info&&data.info!=''">
            <el-badge v-if="is_newMessage" is-dot style="height:16px;line-height:16px;">
                <i class="iconfont icon-xiaoxi1"></i>
            </el-badge>
        </span>
        <!-- 右侧头像用户名点击下拉操作按钮 -->
        <el-dropdown trigger="click" style="vertical-align: middle;" v-if="data&&data.info&&data.info!=''">
            <div class="el-dropdown-link cursor_pointer ellipsis" style="max-width: 240px;">
                <img :src="data.info.avatar" class="fa-border"
                     v-if="typeof(data.info.avatar)!=='undefined'&&data.info.avatar!=''"
                     style="display: inline-block;width:40px;height:40px;border-radius: 100%;padding:0;margin-right:5px;vertical-align: middle;"
                     :alt="data.info.title+'头像'">{{data.info.username}} <i class="iconfont icon-plus-select-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(data, index) in data.route" :key="index"
                                  @click.native="dropMenuClick(data)" :divided="data.divided">
                    {{data.name}}
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">
                    <i class="fa fa-power-off"></i> 退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import {getMessageCount} from '@/api/api';

    let notify;
    export default {
        props: ["data", "is_message"],
        data() {
            return {
                isFullScreen: false, //根据该值判断浏览器是否全屏
                message_count: "",    //消息条数获取
                is_newMessage: false, //判断是否有新消息
                is_open: true, //是否能打开消息弹出
            }
        },
        methods: {
            //头像与用户名点击下拉菜单
            dropMenuClick(data) {
                if (data.target && data.target != '') {
                    if (data.path != '') {
                        this.$router.push(data.path);
                    }
                } else {
                    if (data.path != '') {
                        this.$emit("add", data.name, data.path);
                    }
                }
            },
            // 退出登录
            logout: function () {
                this.$confirm('确认退出吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$_notify_close();
                    window.clearInterval(window.timer);
                    this.$router.push('/login');
                });
            },
            // 打开或关闭全屏
            is_FullScreen() {
                if (!this.isFullScreen) {
                    let de = document.documentElement;
                    if (de.requestFullscreen) {
                        de.requestFullscreen();
                    } else if (de.mozRequestFullScreen) {
                        de.mozRequestFullScreen();
                    } else if (de.webkitRequestFullScreen) {
                        de.webkitRequestFullScreen();
                    }
                } else {
                    let de = document;
                    if (de.exitFullscreen) {
                        de.exitFullscreen();
                    } else if (de.mozCancelFullScreen) {
                        de.mozCancelFullScreen();
                    } else if (de.webkitCancelFullScreen) {
                        de.webkitCancelFullScreen();
                    }
                }
            },
            //监听是否退出的全屏
            fullscreenchange() {
                let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
                (!isFull) ? this.isFullScreen = false : this.isFullScreen = true;
            },
            //消息图标的点击
            open() {
                if (this.is_open) {
                    this.getMessage("open");
                }
            },
            //判断是否打开了弹窗，如果是先关闭
            $_notify_close() {
                if (notify && notify != "") {
                    notify.close();
                }
            },
            //查看消息弹出
            $_notify(msg) {
                let _this = this;
                _this.is_open = false;
                //防止home与bighome切换时弹出多的notify
                _this.$_notify_close();
                if (_this.$route.path !== "/404" && _this.$route.path !== "/login") {
                    notify = this.$notify({
                        title: '提醒',
                        offset: 65,
                        message: msg,
                        iconClass: "fa fa-comment-o color-blue",
                        dangerouslyUseHTMLString: true,
                        onClose: function () {
                            _this.is_open = true;
                        }
                    });
                }
            },
            //获取消息条数
            getMessage(op) {
                let _this = this;
                getMessageCount().then((res) => {
                    if (res.data.data.message_count > 0) {
                        _this.is_newMessage = true;
                        _this.message_count = "您有 <span class='color-blue'>" + res.data.data.message_count + "</span> 条未读消息，请及时查看！";
                    } else {
                        _this.is_newMessage = false;
                        _this.message_count = "暂无新消息";
                    }
                    if (op == "open") {
                        _this.$_notify(_this.message_count);
                    } else {
                        if (_this.is_newMessage) {
                            let count = res.data.data.message_count - sessionStorage.getItem("message_count");
                            if (count > 0) {
                                _this.$_notify("您有 <span class='color-blue'>" + count + "</span> 新消息，共 <span class='color-blue'>" + res.data.data.message_count + "</span> 条未读！");
                            }
                        }
                    }
                    sessionStorage.setItem("message_count", res.data.data.message_count);
                }).catch(function (error) {
                    _this.is_newMessage = false;
                    _this.message_count = error.message;
                });
            },
            // 组件销毁时清除组件中的一些东西（定时器）
            clearInterval() {
                clearInterval(window.timer);
                document.removeEventListener("fullscreenchange", this.fullscreenchange);
                document.removeEventListener("mozfullscreenchange", this.fullscreenchange);
                document.removeEventListener("webkitfullscreenchange", this.fullscreenchange);
                document.removeEventListener("msfullscreenchange", this.fullscreenchange);
            }
        },
        created() {
            this.fullscreenchange();
            document.addEventListener("fullscreenchange", this.fullscreenchange);
            document.addEventListener("mozfullscreenchange", this.fullscreenchange);
            document.addEventListener("webkitfullscreenchange", this.fullscreenchange);
            document.addEventListener("msfullscreenchange", this.fullscreenchange);
            let _this = this;
            //通过捕捉F11按键，禁止按下事件调用自定义全屏方法
            document.onkeydown = function (e) {
                let key = window.event.keyCode;
                if (key == 122) { //捕捉F11键盘动作
                    e.preventDefault();  //阻止F11默认动作
                    _this.is_FullScreen();
                }
            }
            //通过判断设置，判断是否开启定时消息获取
            if (_this.is_message) {
                sessionStorage.setItem("message_count", 0);
                _this.getMessage();
                //使用定时器定时加载消息数量
                window.timer = setInterval(function () {
                    _this.getMessage();
                }, 60000);
            }
            window.addEventListener("offline", function () {
                _this.$message({
                    showClose: true,
                    message: "糟糕，断网了！",
                    type: 'error'
                });
            });
        }
    }
</script>

<style>
    .bighome .cursor_pointer {
        color: #fff;
    }

    .user_nav {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .color-blue {
        color: #20a0ff;
    }
</style>
