<template>
    <el-container class="bighome" :style="'height:100%;overflow: hidden;visibility: '+ is_hidden" v-cloak>
        <!-- 导航 -->
        <el-header>
            <el-row>
                <!-- 顶部导航 or 菜单 -->
                <el-col :span="18">
                    <el-menu mode="horizontal" class="el-menu-demo" :default-active="$route.path"
                             background-color="#12609d" text-color="#fff" active-text-color="#39aef5" router
                             v-if="MenuData && MenuData!=''" menu-trigger="click">
                        <!-- 企业logo -->
                        <el-menu-item :index="MenuData.logo.path" class="no_hover" v-if="MenuData.logo">
                            <img :src="MenuData.logo.src" style="max-height:100%;height: 100%;" alt="">
                        </el-menu-item>
                        <template v-for="(item,index) in MenuData.route">
                            <!-- 二级或多级导航 -->
                            <el-submenu :index="index+''" v-if="item.children">
                                <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
                                <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                                    {{child.name}}
                                </el-menu-item>
                            </el-submenu>
                            <!-- 一级导航 -->
                            <el-menu-item v-if="!item.children&&!item.hidden" :index="item.path">
                                <i :class="item.icon"></i>{{item.name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                </el-col>
                <!-- 右侧杂项信息（头像用户名、全屏、消息等） -->
                <el-col :span="6" style="float:right;">
                    <lw-user :data="user" :is_message="is_message" ref="user"
                             style="float: right; max-width:100%;font-size: 16px;color:#fff;"></lw-user>
                </el-col>
            </el-row>
        </el-header>
        <!-- 路由切换的展示部分 -->
        <el-main class="lw_loading">
            <transition name="fade" mode="out-in">
                <router-view v-cloak :style="'visibility: '+ is_loading"></router-view>
            </transition>
        </el-main>
    </el-container>
</template>

<script>
    import lwUser from '@/components/lwUser'
    import {getMenu} from '@/api/api';

    export default {
        components: {lwUser},
        data() {
            return {
                is_hidden: "hidden",    //整体页面加载显示隐藏，防止加载时的闪烁
                is_loading: 0,  //路由切换部分的页面加载显示隐藏，防止加载时的闪烁
                MenuData: [],    //菜单数据
                user: {},
                is_message: false, //设置是否定时加载消息条数
            }
        },
        methods: {
            //开启或关闭局部loading
            loading() {
                this.is_loading = this.$utils.loading(this.myLoading, this, 'rgba(0, 0, 0, 0.6)');
            },
            // 加载菜单
            getMenus() {
                let _this = this;
                getMenu().then((res) => {
                    _this.MenuData = res.data;
                    //将菜单数组转成一维json保存到localStorage，以便在其他地方使用
                    let data = res.data.route;
                    localStorage.setItem("BigMenu", JSON.stringify(data));
                }).catch(function (error) {
                    _this.$message({
                        showClose: true,
                        message: "Menu菜单：" + error.message,
                        type: 'error'
                    });
                });
            }
        },
        created() {
            this.getMenus();
        },
        mounted() {
            let _this = this;
            _this.loading();   //局部loading,首次加载时加载loading，必须在mounted里面加载，否则会变成整页loading
            _this.$nextTick(() => {
                //主体框架页加载完成后显示框架页面
                _this.is_hidden = "visible";
            });
        },
        computed: {
            //计算变量赋值
            myLoading() {
                return this.$store.state.custom.is_loading
            }
        },
        watch: {
            //监听vuex的loading状态
            myLoading: function (newValue, oldValue) {
                this.loading();
            },
            "$route": function () {
                //通过监听路由判断菜单是否存在，如果不存在尝试重新加载
                if (!localStorage.getItem("BigMenu")) {
                    this.getMenus();
                }
            }
        },
        beforeDestroy() {
            localStorage.removeItem("BigMenu");
            this.$refs.user.$_notify_close();
            this.$refs.user.clearInterval();
        }
    };
</script>

<style src="../../styles/big_custom.css"></style>
