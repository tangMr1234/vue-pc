<template>
    <div style="width:100%;height:100%;">
        <el-row class="bdMap_warp">
            <!-- 左侧地图 -->
            <el-col :span="18" style="height:100%;">
                <components :is="component" :data="MapData" @marker_click="loadInfo"></components>
            </el-col>
            <!-- 右侧表格数据 -->
            <el-col :span="6" class="mapListLoading scroll_top"
                    :style="is_mapListLoading?'overflow: hidden':'overflow-x: hidden'">
                <!-- 面包屑 -->
                <el-breadcrumb separator="/" class="card_breadcrumb">
                    <el-breadcrumb-item v-if="!data || data == ''" :to="{path:bdmap['path']}">{{bdmap["title"]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item
                            @click.native="judgement() ? load_data():''"
                            :class="judgement() ? 'cursor' : '' ">
                        {{city}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-if="judgement()">{{points}}</el-breadcrumb-item>
                </el-breadcrumb>
                <!-- 卡片表格 -->
                <lw-card v-for="(data,index) in table_Data"
                         :key="index"
                         :data="data"
                         style="background: transparent;color:#fff;margin-top:20px;">
                    <div slot="content">
                        <lw-table class="map_table" :data="data" :tableList="tableList"></lw-table>
                    </div>
                </lw-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import lwCard from '@/components/lwCard'
    import lwTable from '@/components/lwTable'
    import lwBdMap from '@/components/lwBdMap'
    import {getCharts} from '@/api/api'

    export default {
        props: ["data"],
        components: {lwCard, lwTable, lwBdMap},
        data() {
            return {
                component: null, //为了能使地图正确得到数据使用动态组件的方法
                MapData: {}, //地图数据
                city: null, //面包屑“市”部分
                points: null,   //选中的点在面包屑上的展示
                table_Data: [], //表格数据
                tableList: {
                    is_stripe: false, //是否为斑马纹
                    height: true,
                }, //表格配置
                bdmap: {   //通过config里定义的值来赋值
                    path: bdmap.path,
                    title: bdmap.title
                },
                back_city_Url: null, //保存返回市的请求的url
                is_mapListLoading: true, //设置右侧列表加载中的loading动画显隐
            }
        },
        methods: {
            //判断
            judgement() {
                return (this.points && this.points != '' && this.points !== null) ? true : false;
            },
            //点击地图标注加载地图右侧信息（组件地图的“标注”点击后调用该方法）
            loadInfo(name, url) {
                this.points = name;
                this.getData(url);
            },
            // 重载全市的列表数据
            load_data() {
                this.points = null;
                this.getData(this.back_city_Url);
            },
            // 点击地图点加载完成后不管返回什么均执行这里
            load_end(mapListLoading) {
                mapListLoading.close();
                this.is_mapListLoading = false;
                this.table_Data = [];
            },
            getData(url) {
                let _this = this;
                _this.$utils.set_scrollTop("", "scroll_top", 0);
                _this.is_mapListLoading = true;
                let mapListLoading;
                if (_this.data && _this.data != "") {
                    mapListLoading = _this.$utils.part_loading(".mapListLoading", "", "rgba(255,255,255,.8)");
                } else {
                    mapListLoading = _this.$utils.part_loading(".mapListLoading", "", "rgba(0,0,0,.8)");
                }
                getCharts(url).then((res) => {
                    _this.load_end(mapListLoading);
                    res.data["lists"] ? _this.table_Data = res.data["lists"] : _this.table_Data.push(res.data);
                }).catch(function (error) {
                    _this.load_end(mapListLoading);
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
            //首次加载地图与列表
            loadMap() {
                let _this = this, _param;
                if (typeof(_this.data) !== 'undefined' && _this.data != "" && _this.data.url != "") {
                    _param = _this.data.url;
                } else {
                    if (window.location.href.split("?")[1]) {
                        _param = "/" + _this.$route.params.url.replace(/-/g, "/") + "?" + window.location.href.split("?")[1];
                    } else {
                        _param = "/" + _this.$route.params.url.replace(/-/g, "/");
                    }
                }
                getCharts(_param).then((res) => {
                    _this.MapData = res.data;
                    _this.component = "lwBdMap";
                    _this.back_city_Url = res.data.url;
                    _this.load_data();
                    _this.city = res.data["center_address"];
                    _this.$store.state.custom.is_loading = false;
                }).catch(function (error) {
                    _this.$store.state.custom.is_loading = false;
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            }
        },
        created() {
            let _this = this;
            _this.loadMap();
        },
        watch: {
            "$route": function () {
                this.loadMap();
            }
        }
    }
</script>

<style lang="scss">
    .mapListLoading {
        position: relative;
        height: 100%;
        padding: 0 5px;
    }

    .bdMap_warp {
        width: 100%;
        height: 100%;
        .card_breadcrumb {
            padding: 15px 10px 0 10px;
        }
    }

    .bighome .bdMap_warp {
        position: fixed !important;
        height: calc(100% - 63px);
        top: 63px;
        left: 0;
        .card_breadcrumb {
            span {
                color: #fff !important;
            }
        }
    }

    .card_breadcrumb .cursor .el-breadcrumb__inner {
        cursor: pointer !important;
    }

    .map_table {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
