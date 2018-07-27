<template>
    <el-container class="custom_home" :style="'height:100%;overflow: hidden;visibility: '+ is_hidden" v-cloak>
        <!--左侧菜单-->
        <el-aside class="el-menu-vertical-demo outer-container"
                  :style="!isCollapse?'width:200px;':'width:60px;'">
            <div class="inner-container"
                 :style="!isCollapse?'width:200px;':'width:60px;'">
                <!-- 企业logo与名称 -->
                <div class="logo" v-if="user['entity']">
                    <img :src="user['entity']['logo']" v-if="user['entity']['logo']" alt="">
                    <span v-show="!isCollapse&&is_hide_text"
                          v-if="user['entity']['name']">{{user.entity.name}}</span>
                </div>
                <!-- 菜单 -->
                <el-menu v-if="MenuData&&MenuData!=''" mode="vertical" :default-active="$route.path"
                         background-color="#304156" text-color="#fff" :collapse="isCollapse" unique-opened ref="menu">
                    <template v-for="(item,index) in MenuData['route']">
                        <!-- 多子级菜单 -->
                        <el-submenu :index="index+''" v-if="item.children">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span v-show="is_hide_text" slot="title">{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                          style="padding-left: 60px;" v-show="is_hide_text"
                                          @click="add(child.name, child.path)">
                                <span slot="title">{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                        <!-- 只有一级的菜单 -->
                        <el-menu-item v-else :index="item.path" @click="add(item.name, item.path)">
                            <i :class="item.icon"></i><span v-show="is_hide_text" slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
        </el-aside>
        <!-- 右边布局 -->
        <el-container>
            <!-- 导航 -->
            <el-header height="60px">
                <el-row>
                    <el-col span="13">
                        <!-- 菜单显示隐藏的按钮 -->
                        <i class="iconfont" :class="isCollapse?'icon-zhankai':'icon-shouqi'"
                           @click="is_Collapse" style="vertical-align: middle;cursor: pointer;"></i>
                        <!-- 面包屑 -->
                        <el-breadcrumb separator-class="el-icon-arrow-right"
                                       style="line-height:60px;display: inline-block;vertical-align: middle;margin-left:10px;">
                            <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path" :to="item.path">
                                {{item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <!-- 右侧杂项信息 -->
                    <el-col span="11">
                        <components :is="user_component" :data="user['user']" :is_message="is_message" @add="add"
                                    ref="user" style="float: right; max-width:100%;font-size: 16px;"></components>
                    </el-col>
                </el-row>
            </el-header>
            <!-- 顶部标签栏 -->
            <div class="NavTab">
                <components :is="component" ref="NavTabs" :data="dynamicTags"></components>
            </div>
            <!-- 路由切换的页面展示部分 -->
            <el-main class="lw_loading">
                <transition name="fade" mode="out-in">
                    <router-view v-cloak :style="'opacity: '+ is_loading"></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import lwUser from '@/components/lwUser'
    import lwTab from '@/components/lwTab'
    import {getHomeMenu} from "@/api/api";

    export default {
        components: {lwUser, lwTab},
        data() {
            return {
                MenuData: null, //菜单
                dynamicTags: [],  //顶部导航菜单
                breadcrumb: [], //面包屑
                is_hidden: "hidden",  //整体页面加载时防止闪动
                is_loading: 0,  //路由视图部分切换时防止页面闪动
                isCollapse: false,     //开启侧栏菜单收缩
                is_hide_text: true,   //防止侧边栏收缩展开时文字闪动
                user: [],  //顶部右侧 我的 数据
                is_message: true, //设置是否定时加载消息条数
                component: null, //组件加载
                user_component: null, //组件加载
            }
        },
        methods: {
            //侧栏菜单显示隐藏
            is_Collapse() {
                this.is_hide_text = !this.is_hide_text;
                setTimeout(() => {
                    this.isCollapse = !this.isCollapse;
                }, 10);
                setTimeout(() => {
                    this.is_hide_text = !this.is_hide_text;
                }, 290);
            },
            //开启或关闭局部loading
            loading() {
                this.is_loading = this.$utils.loading(this.myLoading, this, '');
            },
            //加载面包屑
            loadBreadcrumb(data) {
                let _this = this;
                let srr = [{name: "冷链监测系统"}];
                let routes = data.filter(item => item.path == _this.$route.path);
                let children = data.filter(item => item.children);
                if (routes && routes != "") {
                    _this.breadcrumb = srr.concat(routes);
                } else {
                    children.forEach(function (item, index) {
                        item["children"].forEach(function (item1, index1) {
                            if (item1.path == _this.$route.path) {
                                let arr1 = [{name: item.name}, item1];
                                _this.breadcrumb = srr.concat(arr1);
                            }
                        });
                    });
                }
            },
            //调用NavTabs组件里的方法新增标签
            add(name, path) {
                this.$refs.NavTabs.add(name, path);
            },
            // 加载菜单
            getMenus() {
                let _this = this;
                getHomeMenu().then((res) => {
                    let data = res.data;
                    _this.MenuData = _this.user = data;
                    if (data && data != "") {
                        localStorage.setItem("HomeMenu", JSON.stringify(data));
                        let dyTag = _this.$utils.traverse(data.route, true, "is_home");
                        _this.dynamicTags = [{
                            name: dyTag.name,
                            path: dyTag.path,
                            is_home: dyTag.is_home,
                        }];
                        let tags = _this.$utils.traverse(data.route, _this.$route.path, "path");
                        let users = _this.$utils.traverse(data.user.route, _this.$route.path, "path");
                        _this.component = "lwTab";
                        _this.loadBreadcrumb(data.route);
                        //主体框架页加载完成后显示框架页面
                        _this.$nextTick(() => {
                            if (tags) {   //临时使用
                                _this.add(tags.name, tags.path);
                            } else if (users) {
                                _this.add(users.name, users.path);
                            }
                            // else {
                            //     _this.$router.push("/");
                            // }
                            _this.is_hidden = "visible";
                            setTimeout(() => {
                                _this.user_component = "lwUser";
                            }, 300);
                        });
                    }
                }).catch(function (error) {
                    _this.$message({
                        showClose: true,
                        message: "Menu菜单：" + error.message + "，请重新登录！",
                        type: 'error',
                        onClose: function () {
                            _this.$store.state.custom.is_loading = false;
                            _this.$router.push("/login");
                        }
                    });
                });
            }
        },
        created() {
            this.getMenus();
            this.loading();
        },
        computed: {
            //计算变量赋值
            myLoading() {
                return this.$store.state.custom.is_loading
            }
        },
        watch: {
            "$route": function () {
                this.loadBreadcrumb(this.MenuData.route);
                if (!localStorage.getItem("HomeMenu")) {
                    this.getMenus();
                }
            },
            //监听vuex的loading状态
            myLoading: function (newVal, oldVal) {
                this.loading();
            }
        },
        beforeDestroy() {
            localStorage.removeItem("HomeMenu");
            this.$refs.user.$_notify_close();
            this.$refs.user.clearInterval();
        }
    };
</script>

<style lang="scss" src="../../styles/home_custom.scss" scoped></style>
