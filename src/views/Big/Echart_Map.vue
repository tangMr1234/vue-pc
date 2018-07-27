<!-- svg地图 -->
<template>
    <section>
        <el-row class="bdMap_warp">
            <el-col :span="18" style="position: relative;height:100%;">
                <!-- svg的样式 -->
                <div v-html="style"></div>
                <!-- svg全部的地图 -->
                <div style="width:80%;height:100%;margin:auto;" ref="svg_embed"
                     v-show="svg_em" v-html="svgMap"></div>
                <!-- svg点击后的单点地图 -->
                <div style="height:750px;width:1000px;margin:auto;position: absolute;top:0;left:0;right:0;bottom:0;"
                     v-show="!svg_em">
                    <div v-show="frame_show" style="width:100%;height:100%;">
                        <!-- 关闭按钮 -->
                        <a @click="goback" class="el-icon-circle-close-outline"
                           style="color:red;font-size:40px;position:absolute;right:0;top:0;z-index:999;cursor: pointer;">
                        </a>
                        <!-- 打开的单个地图 -->
                        <iframe :src="svg_big_src" id="svg-big" @load="load_frame" frameborder="0" width="100%"
                                height="100%"></iframe>
                        <!-- 单个地图上的点 -->
                        <div v-if="pointData&&pointData!=''" v-for="item in pointData" @click="pointClick(item.url)"
                             :id="item.id" :style="'top:'+item.svg_map_y+'%;left:'+item.svg_map_x+'%;'"
                             class="point_act">
                            <img :src="svgmapIcon" style="width:20px;vertical-align: middle;" alt="">
                            <span style="vertical-align: middle;">{{item.title}}</span>
                        </div>
                    </div>
                </div>
            </el-col>
            <!-- 右侧表格数据 -->
            <el-col :span="6" class="mapListLoading scroll_top"
                    :style="is_mapListLoading?'overflow: hidden':'overflow-x: hidden'">
                <!-- 卡片表格 -->
                <lw-card v-for="(data,index) in table_Data"
                         :key="index"
                         :data="data"
                         style="background: transparent;color:#fff;margin-bottom:20px;">
                    <div slot="content">
                        <lw-table class="map_table" :data="data" :tableList="tableList"></lw-table>
                    </div>
                </lw-card>
            </el-col>
        </el-row>
    </section>
</template>

<script type="es6">
    import lwCard from '@/components/lwCard'
    import lwTable from '@/components/lwTable'
    import {getCharts} from '@/api/api';

    export default {
        components: {lwCard, lwTable},
        data() {
            return {
                svg_em: true,
                svg_big_src: "",
                pointData: [],
                svgMap: null,
                style: null,
                pk: null,
                param: null,
                frame_show: false,
                svgmapIcon: null,
                is_mapListLoading: true, //设置右侧列表加载中的loading动画显隐
                table_Data: [], //表格数据
                tableList: {
                    is_stripe: false, //是否为斑马纹
                    height: true,
                }, //表格配置
                goBackUrl: null, //返回到全部地图时右侧数据刷新
            }
        },
        methods: {
            //frame的显示隐藏
            load_frame() {
                this.frame_show = true;
            },
            //svg点击的公用部分
            svg_public(id) {
                this.getPoint(id);
                this.svg_em = false;
                this.svg_big_src = "//big.coldyun.com/statics/svg/" + this.param + "/" + id + ".svg";
            },
            //给svg绑定click事件
            svgClick() {
                let _this = this;
                var oSvg = _this.$refs.svg_embed;
                var aPath = oSvg.getElementsByTagName('path');
                var aText = oSvg.getElementsByTagName('text');
                for (var i = 0; i < aPath.length; i++) {
                    //svg块点击
                    aPath[i].onclick = function () {
                        let id = this.id; //this指当前点击的svg部分，不能用_this
                        _this.svg_public(id);
                    };
                    //svg块上面文字的点击事件
                    aText[i].onclick = function () {
                        let id = this.innerHTML; //this指当前点击的svg部分，不能用_this
                        _this.svg_public(id);
                    };
                    //鼠标进入时的fill颜色填充
                    aText[i].onmouseenter = function () {
                        document.getElementById(this.innerHTML).setAttribute('style', 'fill:yellow');
                    };
                    //鼠标离开时fill填充还原
                    aText[i].onmouseout = function () {
                        document.getElementById(this.innerHTML).removeAttribute('style');
                    };
                }
            },
            //svg单个地图返回全部地图
            goback() {
                this.svg_em = true;
                this.getTableData(this.goBackUrl);
            },
            //svg单个地图上的点的点击事件
            pointClick(url) {
                this.getTableData(url);
                this.getTableData(url);
            },
            // 点击地图点加载完成后不管返回什么均执行这里
            load_end(mapListLoading) {
                mapListLoading.close();
                this.is_mapListLoading = false;
                this.$store.state.custom.is_loading = false;
            },
            //初始化&&获取svg全部的地图
            getSvgMap() {
                let _this = this;
                _this.is_mapListLoading = true;
                getCharts("/" + _this.$route.params.url.replace(/-/g, "/")).then((res) => {
                    _this.getTableData(res.data.url);
                    _this.goBackUrl = res.data.url;
                    _this.svgMap = res.data.list.svg_code;
                    _this.style = res.data.list.css_code;
                    _this.pk = res.data.pk;
                    _this.param = res.data.list[res.data.pk];
                    _this.$nextTick(() => {
                        _this.svgClick();
                        _this.is_mapListLoading = false;
                    });
                }).catch(function (error) {
                    _this.is_mapListLoading = false;
                    _this.$store.state.custom.is_loading = false;
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
            getTableData(url) {
                let _this = this;
                _this.$utils.set_scrollTop("", "scroll_top", 0);
                _this.is_mapListLoading = true;
                let mapListLoading = _this.$utils.part_loading(".mapListLoading", "", "rgba(0,0,0,.8)");
                getCharts(url).then((res) => {
                    res.data["lists"] ? _this.table_Data = res.data["lists"] : _this.table_Data.push(res.data);
                    _this.$nextTick(() => {
                        _this.load_end(mapListLoading);
                    });
                }).catch(function (error) {
                    _this.load_end(mapListLoading);
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
            //获取单个地图上的点的数据
            getPoint(name) {
                let _this = this;
                _this.pointData = [];
                let url = "/" + _this.$route.params.url.replace(/-/g, "/") + (_this.pk ? "?" + _this.pk + "=" : "") + (_this.param ? _this.param + "/" + name : name);
                getCharts(url).then((res) => {
                    _this.pointData = res.data;
                }).catch(function (error) {
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            }
        },
        created() {
            this.getSvgMap();
            this.svgmapIcon = bdmapIcon;
        }
    }
</script>

<style lang="scss">
    path, text {
        cursor: pointer;
    }

    .point_act {
        cursor: pointer;
        position: absolute;
        font-size: 17px;
        color: #000;
        line-height: normal;
        text-shadow: 0 0 1px currentColor, -1px -1px 1px #fff, 0 -1px 1px #fff, -1px 0 1px #fff, 1px -1px 1px #fff, 1px 0 1px #fff, 1px 1px 1px #fff, 0 1px 1px #fff, -1px 1px 1px #fff, -1px -1px 1px #fff, -1px -1px 1px #fff, -1px 0 1px #fff, -1px -1px 1px #fff, 0 -1px 1px #fff, 1px -1px 1px #000, 1px -1px 1px #000, 1px -1px 1px #000, 1px 0 1px #000, 1px 1px 1px #fff, 1px 1px 1px #fff, 1px 1px 1px #fff, 0 1px 1px #fff, -1px 1px 1px #fff, -1px 1px 1px #fff, -1px 1px 1px #fff;
    }

    .mapListLoading {
        position: relative;
        height: 100%;
        padding: 0 5px;
    }

    .bdMap_warp {
        width: 100%;
        height: calc(100% - 63px);

        .card_breadcrumb {
            padding: 24px 10px;
        }

    }

    .bighome .bdMap_warp {
        position: fixed !important;
        top: 73px;
        left: 0;
        .card_breadcrumb {
            span {
                color: #fff !important;
            }
        }
    }
</style>
