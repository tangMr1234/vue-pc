<template>
    <div style="position: relative;">
        <el-button type="text" v-if="data.link" style="position:absolute;right:10px;top:0;z-index:10;"
                   @click.native="jump(data.link)">{{data.link_name}}
        </el-button>
        <div :id="name" style="width:100%; height:100%;"></div>
    </div>
</template>

<script>
    import {LoadEchart} from '@/utils/tripartite'  //引入echart和echart皮肤

    export default {
        props: ["data", "name"],
        data() {
            return {
                chart: null
            }
        },
        methods: {
            jump(link) {
                this.$router.push(link);
            },
            drawColumnChart() {
                let _this = this;
                LoadEchart().then(LoadChart => {
                    _this.$nextTick(() => {
                        _this.$emit("load");
                    });
                    _this.chart = LoadChart.init(document.getElementById(_this.name), 'walden');
                    _this.chart.setOption(_this.data.option);
                    window.addEventListener("resize", function () {
                        _this.chart.resize();
                    });
                });
            },
        },
        created() {
            this.drawColumnChart();
        },
        watch: {
            data: function () {
                this.drawColumnChart();
            }
        }
    }
</script>
