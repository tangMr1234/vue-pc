<template>
    <section>
        <div class="chart" style="height: calc(100vh - 100px);">
            <el-carousel indicator-position="outside" :interval="interval" trigger="click" style="height:100%;"
                         height="calc(100% - 26px)" :autoplay="false">
                <el-carousel-item v-for="(data,index) in IndexData" :key="index">
                    <el-row :gutter="15" style="height:100%;">
                        <el-col v-for="(item,index) in data" :key="index" :span="item.span"
                                :style="'height: '+ item.vh +'%;'">
                            <!-- echart -->
                            <el-card v-if="item.component&&item.component=='lwEchart'"
                                     style="height: calc(100% - 15px);">
                                <components :is="item.component" :data="item" :name="item.name" @load="load()"
                                            style="width:100%;height:100%;"></components>
                            </el-card>
                            <!-- card -->
                            <lw-card v-else-if="item.component&&item.component=='lwCard'"
                                     :data="item" :name="item.name"
                                     style="height: calc(100% - 15px);"
                                     @load="load()">
                            </lw-card>
                            <!-- table -->
                            <lw-card v-else :data="item"
                                     @load="load()" style="height: calc(100% - 15px);">
                                <!--<div slot="content">-->
                                <components :is="item.component" class="map_table" :data="item"
                                            :tableList="tableList" slot="content"></components>
                                <!--</div>-->
                            </lw-card>
                        </el-col>
                    </el-row>
                </el-carousel-item>
            </el-carousel>
        </div>
    </section>
</template>

<script>
    import {getCharts} from '@/api/api';

    export default {
        components: {
            lwEchart: () => import('@/components/lwEchart'),
            lwCard: () => import('@/components/lwCard'),
            lwTable: () => import('@/components/lwTable'),
        },
        data() {
            return {
                IndexData: [],
                interval: 10000,
                tableList: {
                    height: true,
                }, //表格配置
            }
        },
        created() {
            this.getChart();
        },
        methods: {
            load() {
                this.$nextTick(() => {
                    this.$store.state.custom.is_loading = false;
                });
            },
            getChart() {
                let _this = this;
                getCharts("/" + _this.$route.params.url.replace(/-/g, "/") + '/chart').then((res) => {
                    _this.IndexData = res.data["chart_items"];
                    _this.interval = res.data["interval"];
                }).catch(function (error) {
                    _this.load();
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            }
        },
        watch: {
            "$route": function (newValue, oldValue) {
                this.IndexData = [];
                this.getChart();
            }
        }
    }
</script>

<style lang="scss">
    .chart {
        .el-card {
            margin: 10px 0 5px;
            background: transparent;
            color: #fff;
            overflow: visible;
        }

        .el-card__body {
            height: calc(100% - 40px);
        }
    }
</style>
