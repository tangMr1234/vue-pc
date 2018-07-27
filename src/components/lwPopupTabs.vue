<template>
    <div v-if="tabs && tabs.list" ref="tab_Pane">
        <el-tabs v-model="tabs.value" :tab-position="tabs['tab_position']" :type="tabs.type" @tab-click="handleClick"
                 class="tab_scroll" style="height:calc(100vh - 142px);overflow: hidden;">
            <el-tab-pane
                    v-for="(item, index) in tabs.list"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                    style="">
                <el-row :gutter="10">
                    <el-col v-for="(items, index) in item.data.table_items" :key="index" :span="items.span">
                        <!-- 加载表格 -->
                        <lw-card v-if="item.data.table_items&&item.data.table_items!=''"
                                 :data="items"
                                 style="margin-bottom:15px;">
                            <components slot="content" is="lwTable"
                                        :data="items"
                                        :parent_data="parent_data"
                                        :tableList="tableList" ref="get_data">
                            </components>
                        </lw-card>
                    </el-col>
                    <el-col v-if="item.data.form_items&&item.data.form_items!=''" :span="item.data.form_items.span">
                        <!-- 加载表单和按钮 -->
                        <lw-card :data="item" style="margin-bottom:15px;">
                            <components slot="content" is="lwForm" :data="item.data" :parent_data="parent_data"
                                        :tableList="tableList" ref="get_data">
                                <lw-button slot="button" :data="item.data.button_items" @button_click="button_click"
                                           type="filter" v-if="item.data.button_items"></lw-button>
                            </components>
                        </lw-card>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import lwTable from "@/components/lwTable"
    import lwForm from "@/components/lwForm"
    import lwCard from '@/components/lwCard'
    import lwButton from "@/components/lwButton"
    import {getFeatureList} from "@/api/api";

    export default {
        props: ["data", "parent_data", "dialog_close"],
        components: {lwTable, lwForm, lwButton, lwCard},
        data() {
            return {
                //表格部分配置
                tableList: {
                    is_stripe: true,
                    height: true
                }, //表格传递的数据
                tabs: [],  //tab数据
                change: [],  //用做判断是否加载
                url: null, //请求的url
            }
        },
        methods: {
            button_click(name, b) {
                this.$nextTick(() => {
                    let param = {
                        path: this.url,
                        data: this.$refs["get_data"].filter(item => item.submit)[0].submit()
                    };
                    this.$emit("button_click", name, b, param);
                });
            },
            handleClick(tab, event) {
                this.load_tabsData(tab.name);
            },
            load_tabsData(value) {
                let _this = this;
                if (_this.change.filter(item => item == value) == "") {
                    let part_loading = this.$utils.part_loading(".el-dialog");
                    _this.change.push(value);
                    let selected = _this.tabs.list.filter(item => item.name == value);
                    _this.url = selected[0]['url'];
                    getFeatureList({path: selected[0]['url']}).then((res) => {
                        let data = res.data.data;
                        selected[0].data = data;
                        part_loading.close();
                        _this.$utils.set_scrollTop("", "el-tab-pane", 0);
                    }).catch(function (error) {
                        selected[0].data = {
                            list: null, option: null, column: null
                        };
                        _this.$message({
                            showClose: true,
                            message: "弹出层：" + error.message,
                            type: "error",
                        });
                        part_loading.close();
                    });
                }
            },
            // 父组件调用的加载方法
            load() {
                if (this.dialog_close) {
                    this.change = [];
                }
                this.tabs = this.data.tab_itms;
                this.load_tabsData(this.tabs.value);
            }
        }
    }
</script>

<style>
    .tab_scroll .el-tabs__content {
        height: calc(100% - 56px);
    }

    .tab_scroll .el-tab-pane {
        height: 100%;
        overflow-x: hidden;
    }
</style>
