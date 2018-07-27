<template>
    <section v-if="option">
        <!-- 如果list无数据时 -->
        <el-row :gutter="20" v-if="IsInArray(option, 'lwEchart')&&!IsInArray(option, 'VList')">
            <el-col v-for="data in ChartData" :key="data.id" :span="data.span">
                <components :is="data.component" :data="data" :name="data.name" @load="load"
                            :style="'width:100%;height: calc('+ data.vh + 'vh - 100px);'"></components>
            </el-col>
        </el-row>
        <!-- 如果charts无数据时 -->
        <el-row :gutter="20" v-else-if="IsInArray(option, 'VList')&&!IsInArray(option, 'lwEchart')">
            <el-col :span="24">
                <v-list loading_bg="rgba(0, 0, 0, 0.5)" :search="false" :is_operate="false" :is_stripe="false"></v-list>
            </el-col>
        </el-row>
        <!-- 如果list和charts都有数据时 -->
        <el-row :gutter="20" v-else>
            <el-col :span="16">
                <v-list loading_bg="rgba(0, 0, 0, 0.5)" :search="false" :is_operate="false" :is_stripe="false"></v-list>
            </el-col>
            <el-col :span="8">
                <components v-for="data in ChartData" :key="data.id" :is="data.component"
                            :data="data" :name="data.name" @load="load"
                            :style="'width:100%;height: calc('+ data.vh + 'vh - 100px);'"></components>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {getCharts} from '@/api/api';

    export default {
        components: {lwEchart: () => import('@/components/lwEchart'), VList: () => import('@/views/Home/List')},
        data() {
            return {
                ChartData: [], //获取chart数据
                option: [],   //获取Menu里的部分配置项
            }
        },
        methods: {
            //判断数组中是否存在某值
            IsInArray(arr, val) {
                let testStr = ',' + arr.join(",") + ",";
                return testStr.indexOf("," + val + ",") != -1;
            },
            load() {
                this.$store.state.custom.is_loading = false;
            },
            //获取图表数据
            getChart() {
                let _this = this;
                getCharts("/" + _this.$route.params.url.replace(/-/g, "/") + '/chart').then((res) => {
                    _this.ChartData = res.data['chart_items'];
                }).catch(function (error) {
                    _this.load(); //改变vuex状态
                    _this.ChartData = [];
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
            //是否需要加载图表
            is_getChart() {
                let arr = JSON.parse(localStorage.getItem("HomeMenu"));
                let path = this.$utils.traverse(arr, this.$route.path, "path");
                if (path && path != "") {
                    if (path[0].option) {
                        this.option = path[0].option;
                        if (this.IsInArray(this.option, 'lwEchart')) {
                            this.getChart(path[0].name);
                        }
                    } else {
                        this.option = ["lwEchart", "VList"];
                        this.getChart(path[0].name);
                    }
                } else {
                    this.load();
                }
            }
        },
        created() {
            this.is_getChart();
        },
        watch: {
            '$route': 'is_getChart'
        }
    }
</script>
