<template>
    <section>
        <!-- anchor必须传递，表示的是锚点对应的class(比如这个class="lwAnchor"需要进行配置)-->
        <lwAnchorTab :leftMenuData="anchor_data" anchor=".lwAnchor" style="height:calc(100vh - 142px);">
            <el-card v-for="(items, index) in data" :key="index" class="lwAnchor" style="margin-bottom:20px;">
                <div slot="header">{{items.label}}</div>
                <div>
                    <div v-for="(item, index) in ceshi" :key="index">
                        <el-row v-for="n in item.content" :gutter="10">
                            <el-col span="5">
                                <el-form ref="form" :model="form" label-width="100px">
                                    <el-form-item :label="n.label+'：'">
                                        <span v-if="!n.is_edit">{{n.value}}</span>
                                        <el-input v-if="n.is_edit" v-model="n.value" size="mini"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col span="2">
                                <el-button type="text" @click="n.is_edit=!n.is_edit"> {{n.is_edit?"确定":"修改"}}
                                </el-button>
                                <el-button type="text" @click="n.is_edit=!n.is_edit;$refs['form'].resetFields()"
                                           v-if="n.is_edit">
                                    取消
                                </el-button>
                            </el-col>

                        </el-row>
                    </div>
                </div>
            </el-card>
        </lwAnchorTab>
    </section>
</template>
<script>
    import lwAnchorTab from "@/views/Other/Anchor_Tab"

    export default {
        components: {lwAnchorTab},
        data() {
            return {
                anchor_data: [],
                data: [],
                is_edit: true,
                ceshi: [],
            };
        },
        mounted() {
            this.ceshi = [{
                id: 1,
                content: [
                    {
                        label: "类型",
                        value: "呼叫",
                        is_edit: false,
                    },
                    {
                        label: "操作员工",
                        value: "老王",
                        is_edit: false,
                    }, {
                        label: "员工电话",
                        value: "11111",
                        is_edit: false,
                    }
                ],
            }];
            for (let i = 1; i <= 10; i++) {
                this.anchor_data.push({id: i, label: "菜单" + i});
                let obj = {};
                // let arr = [];
                for (let j = 1; j <= 10; j++) {
                    obj = {label: "内容" + j, value: "text" + j};
                    // arr.push(obj);
                }
                this.data.push({id: i, label: "菜单" + i});
            }
            this.$nextTick(() => {
                this.$store.state.custom.is_loading = false;
            });
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
