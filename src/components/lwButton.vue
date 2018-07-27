<template>
    <el-row v-if="data&&data!=''">
        <components v-for="(item, index) in data" :key="index"
                    :is="item.component" :size="item.size" :class="item.size=='tiny'?'btn_xs':''" :type="item.type"
                    :icon="item.icon" :disabled="item.disabled" @click="handle(item)"
                    :loading="item.is_loading"
                    :native-type="item.name == 'search'||item.name == 'submit'?'submit':'button'"
                    :trigger="item.list&&item.list!=''?item.trigger:''" style="margin-top:1px;margin-bottom:1px;">
            <!-- 下拉按钮 -->
            <el-button v-if="item.list&&item.list!=''" :type="item.type" :size="item.size"
                       :class="item.size=='tiny'?'btn_xs':''">
                {{item.text}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu v-if="item.list&&item.list!=''" slot="dropdown">
                <el-dropdown-item v-for="(data, index) in item.list" :key="index"
                                  @click.native="handle(data)">{{data.label}}
                </el-dropdown-item>
            </el-dropdown-menu>
            <!-- 普通按钮 -->
            {{!item.list||item.list==''?item.text:""}}
        </components>
    </el-row>
</template>

<script>
    export default {
        props: ["data"],
        data() {
            return {};
        },
        methods: {
            handle(items) {
                this.$emit("button_click", items);
                this.$emit("get_item");    //获取表格里操作行的id
            }
        }
    };
</script>