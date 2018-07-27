<template>
    <section>
        <el-row :gutter="20" ref="Index_offsetTop">
            <!-- 第一列 -->
            <el-col :span="12">
                <el-card>
                    <div style="height:380px;">
                        <components :is="One_Component" :data="table_data" :tableList="tableList"></components>
                    </div>
                </el-card>
            </el-col>
            <!-- 第二列：地图 -->
            <el-col :span="12">
                <el-card style="position: relative;">
                    <!-- 按钮 -->
                    <div style="position: absolute;top:20px;right:20px;z-index:9;">
                        <el-button-group>
                            <lw-button :data="ButtonData" @button_click="button_click"></lw-button>
                        </el-button-group>
                    </div>
                    <!-- 地图 -->
                    <components :is="Two_Component" :data="MapData" style="height:380px;"></components>
                </el-card>
            </el-col>
        </el-row>
        <!-- 弹出层：地图全屏 -->
        <lw-r-dialog :show.sync="is_Show" v-bind:parentToChild="parent_data" ref="public_dailog" style="height:100%;">
            <map-list slot="html" :data="MapListData"></map-list>
        </lw-r-dialog>
    </section>
</template>

<script>
    import lwTable from "@/components/lwTable"
    import lwButton from "@/components/lwButton"
    import lwBdMap from "@/components/lwBdMap"
    import lwRDialog from "@/components/lwRDialog"
    import MapList from "@/views/Big/MapList"
    import {getCharts} from "@/api/api";

    export default {
        components: {lwTable, lwButton, lwBdMap, lwRDialog, MapList},
        data() {
            return {
                MapData: null,  //单个小地图的加载
                One_Component: "lwTable",
                Two_Component: null, //需要加载的组件，为了保证数据正常传递
                is_Show: false,  //弹出全屏地图的显隐
                table_data: {
                    list: [
                        {name: "移动客服", value: "<span class='lw-badge lw-badge-pill lw-badge-primary'>10086</span>"},
                        {name: "联通客服", value: "<span class='lw-badge lw-badge-pill lw-badge-danger'>10010</span>"},
                        {name: "电信客服", value: "<span class='lw-badge lw-badge-pill lw-badge-success'>10000</span>"},
                    ],
                    column: [
                        {
                            "field": "name",
                            "title": "名称",
                            "type": "string",
                            "form_type": "TYPE_INPUT"
                        },
                        {
                            "field": "value",
                            "title": "电话",
                            "type": "string",
                            "form_type": "TYPE_INPUT"
                        },
                    ]
                }, //表格数据
                tableList: {
                    loading_bg: null,
                },
                // 传递给maplist的数据
                MapListData: {
                    url: "/big/app/map/chinachartmap?city=闵行区"
                },
                //按钮数据
                ButtonData: [
                    {
                        component: "el-button",
                        size: "tiny",
                        type: "danger",
                        icon: "iconfont icon-quanping",
                        text: "全屏",
                        name: "fullScroll"
                    },
                    {
                        component: "el-button",
                        size: "tiny",
                        type: "success",
                        icon: "iconfont icon-icon-refresh",
                        text: "刷新",
                        name: "reload"
                    }
                ],
                //传递给dialog的数据
                parent_data: {
                    title: "详细地图",
                },
            };
        },
        methods: {
            button_click(items) {
                switch (items.name) {
                    case "fullScroll":  //全屏
                        this.bdMapFullScreen();
                        break;

                    case "reload":  //刷新
                        this.getBdMapData();
                        break;

                    default:
                }
            },
            //地图全屏事件
            bdMapFullScreen() {
                this.$refs["public_dailog"].zoom();
                this.is_Show = true;
            },
            //加载首页地图
            getBdMapData() {
                let _this = this;
                getCharts("/coldchain2/app/map/region?city=闵行区").then((res) => {
                    _this.MapData = res.data;
                    _this.Two_Component = "lwBdMap";
                    _this.$nextTick(() => {
                        _this.$store.state.custom.is_loading = false;
                    });
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
            this.getBdMapData();
        }
    }
</script>
