<template>
    <!-- 表格 -->
    <el-table :class="table_setting(data['table_setting'],'auto_height', false)?'auto_height':''"
              :data="data.list"
              :stripe="table_setting(data['table_setting'],'stripe', true)"
              :element-loading-background="tableList.loading_bg"
              :size="table_setting(data['table_setting'],'size', 'mini')"
              :span-method="arraySpanMethod"
              border
              highlight-current-row v-loading="tableLoading"
              :show-header="table_setting(data['table_setting'],'show_header', true)"
              :height="table_setting(data['table_setting'],'scroll_bar','100%')" ref="table" style="width: 100%">
        <el-table-column sortable header-align="left" :align="table_setting(data['table_setting'],'align', 'left')"
                         v-for="item in data.column" :key="item.field"
                         :label="item.title"
                         :prop="item.field"
                         :min-width="item.width || '130'">
            <template slot-scope="scope">
                <span v-html="scope.row[item.field]"></span>
            </template>
        </el-table-column>
        <!-- 操作按钮列 -->
        <el-table-column v-if="data.option && data.option!=''"
                         :label="data.option.title"
                         :fixed="data.option.fixed || 'right'"
                         :width="data.option.button_items.length*80"
                         align="center">
            <template slot-scope="scope">
                <lw-button :data="filter_data(data, scope.$index)"
                           @button_click="$_button_click"
                           @get_item="$_get_row(scope.$index, scope.row)">
                </lw-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import lwButton from '@/components/lwButton'

    export default {
        props: ["data", "tableLoading", "tableList"],
        components: {lwButton},
        data() {
            return {
                items: null,
            };
        },
        methods: {
            //判断字段是否存在并设置默认值
            table_setting(a, b, c) {
                return (typeof(a) !== 'undefined') ? (typeof(a[b]) !== 'undefined') ? a[b] : c : c;
            },
            //合并行
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (row.colspan) {
                    if (columnIndex % row.colspan[1] === 0) {
                        return row.colspan;
                    } else {
                        return [0, 0];
                    }
                }
            },
            // 获取行号和传递值
            $_button_click(items) {
                this.items = items;
            },
            $_get_row(a, b) {
                this.tableClick(b);
            },
            tableClick(b) {
                this.$nextTick(() => {
                    this.$emit('tableEdit', this.items, b);
                });
            },
            //通过过滤按钮数据替换按钮
            filter_data(items, index) {
                return items.list[index].button_option || this.data.option.button_items;
            },
            // 去除表格的排序
            clear_table_method() {
                this.$refs.table.clearSort();
            }
        }
    };
</script>

<style lang="scss">
    .auto_height {
        height: calc(100% - 30px);
        .el-table__body-wrapper, table {
            height: 100%;
        }
    }
</style>