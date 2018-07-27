<template>
    <section style="height:calc(100vh - 142px);width:100%;overflow: hidden;">
        <el-row style="height:100%;width:100%;">
            <!-- 侧栏 -->
            <el-col span="4" style="height:100%;">
                <el-alert
                        type="info"
                        show-icon
                        :title="header"
                        :closable="false"
                        style="margin-bottom:5px;">
                </el-alert>
                <div class="lw_warp lw_left_scrollbar" style="height:calc(100% - 34px);">
                    <ul class="nav">
                        <li v-for="(data,index) in left_data" :key="index" @click="leftMenu_handleClick(data)">
                            <a :class="data.name == leftMenu_select?'lw_leftMenu_active':''">{{data.title}}</a>
                        </li>
                    </ul>
                </div>
            </el-col>
            <!-- 手风琴列表 -->
            <el-col span="20" class="lw_warp lwLoading">
                <el-collapse v-model="activeNames" @change="handleChange" style="margin-left: 20px;">
                    <el-collapse-item v-for="(item, index) in data" :name="i" :key="index">
                        <template slot="title">
                            <span v-for="(tag,index) in item.tags"
                                  :key="index" v-html="tag" style="margin-right:5px;"></span>
                            <b>{{item.title}}</b>
                        </template>
                        <!-- 手风琴隐藏显示的数据部分 -->
                        <el-row>
                            <el-col span="20" class="lw_content">
                                <div>{{item.description}}</div>
                            </el-col>
                            <el-col span="4" style="text-align:right;">
                                <el-button size="mini" type="primary" style="margin-right:20px;">操作</el-button>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {getCom} from "@/api/api";

    export default {
        data() {
            return {
                leftMenu_select: null, //默认选中
                left_data: [], //左侧菜单数据
                header: null, //左侧菜单上的栏目信息
                data: [],  //右侧数据
            };
        },
        methods: {
            // 菜单的点击切换事件
            leftMenu_handleClick(data) {
                if (this.leftMenu_select != data.name) {
                    this.getData(data.url);
                    this.leftMenu_select = data.name;
                }
            },
            //加载数据
            getData(url) {
                let _this = this;
                let part_loading = _this.$utils.part_loading(".lwLoading");
                _this.data = [];
                getCom(url).then((res) => {
                    _this.data = res.data.data.list;
                    _this.$nextTick(() => {
                        part_loading.close();
                        _this.$store.state.custom.is_loading = false;
                    });
                }).catch(function (error) {
                    _this.$store.state.custom.is_loading = false;
                    part_loading.close();
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
            //加载菜单
            getLeftMenu() {
                let _this = this;
                getCom("/bpms/app/archive_product/tabs").then((res) => {
                    let data = res.data.data;
                    _this.left_data = data.tabs.list;
                    _this.header = data.header;
                    _this.leftMenu_select = data.tabs.list[0].name;
                    _this.getData(_this.left_data[0].url);
                }).catch(function (error) {
                    _this.$store.state.custom.is_loading = false;
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
        },
        created() {
            this.getLeftMenu();
        }
    };
</script>

<style lang="scss" scoped>
    .lw_warp {
        height: 100%;
        overflow-x: hidden;
        .lw_content {
            color: #666;
            padding: 0 20px;
        }
        ul, li {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
        ul.nav {
            background: url(../../assets/shad2.png) no-repeat;
            background-size: 100% 100%;
            li {
                margin: 0 0 5px 0;
                cursor: pointer;
                a {
                    background-repeat: no-repeat;
                    background-image: url(../../assets/border.png);
                    background-color: #FFFFFF;
                    color: #174867;
                    padding: 7px 15px 7px 15px;
                    display: block;
                    text-decoration: none;
                    border-right: 1px solid #E3E3E3;
                    border-bottom: 1px solid #E3E3E3;
                    border-top: 1px solid #E3E3E3;
                    box-shadow: 2px 2px 4px #EDEDED;
                    &:hover, &.lw_leftMenu_active {
                        background: #ebebeb url(../../assets/border.png) no-repeat;
                        color: #67a5cd;
                    }
                }
            }
        }
    }

    /*滚动条样式*/
    .lw_left_scrollbar {
        &::-webkit-scrollbar {
            width: 0;
        }
        &:hover::-webkit-scrollbar { /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }
    }
</style>
