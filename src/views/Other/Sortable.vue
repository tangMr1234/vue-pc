<template>
    <div>
        <el-row :gutter="20">
            <el-col span="8">
                <el-card>
                    <div slot="header">拖拽到右侧添加</div>
                    <div style="height: 360px;">
                        <ul id="todoList" class="lw-admin-draggable-list">
                            <li v-for="(item, index) in todoArray" :key="index"
                                :data-index="index">
                                <div>{{ item.content }}</div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col span="8">
                <el-card>
                    <div slot="header">拖拽到左侧删除（被禁止拖动排序）</div>
                    <div style="height: 360px;">
                        <ul id="doList" class="lw-admin-draggable-list"></ul>
                    </div>
                </el-card>
            </el-col>
            <el-col span="8">
                <el-card>
                    <div slot="header">JSON树</div>
                    <div style="height: 360px;overflow-x:hidden;">
                        <pre>{{doArray}}</pre>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';

    export default {
        data() {
            return {
                todoArray: [], //系统的
                doArray: [], //我的
            };
        },
        mounted() {
            for (let i = 0; i < 30; i++) {
                this.todoArray.push(
                    {
                        id: i,
                        content: "排序排序排序" + i,
                    }
                )
            }
            //拖动插件的配置项
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };
            let _this = this;
            let todoList = document.getElementById('todoList');
            Sortable.create(todoList, {
                group: {
                    name: 'list',
                    pull: true
                },
                animation: 120,
                ghostClass: 'placeholder-style',
                fallbackClass: 'lw-admin-cloned-item',
                onRemove(event) {
                    _this.doArray.splice(event.newIndex, 0, _this.todoArray[event.item.getAttribute('data-index')]);
                }
            });
            let doList = document.getElementById('doList');
            Sortable.create(doList, {
                group: {
                    name: 'list',
                    pull: true
                },
                sort: false,
                filter: '.lw-admin-draggable-delete',
                animation: 120,
                fallbackClass: 'lw-admin-cloned-item',
                onRemove(event) {
                    _this.doArray.splice(event.oldIndex, 1);
                }
            });
            _this.$nextTick(() => {
                _this.$store.state.custom.is_loading = false;
            });
        }
    };
</script>

<style scoped lang="scss">
    ul, li {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .lw-admin-draggable-list {
        height: 100%;
        overflow-x: hidden;
        li {
            padding: 9px;
            border: 1px solid #e7ebee;
            border-radius: 3px;
            margin-bottom: 5px;
            cursor: pointer;
            position: relative;
            transition: all .2s;
            &:hover {
                color: #87b4ee;
                border-color: #87b4ee;
                transition: all .2s;
                .lw-admin-draggable-delete {
                    display: block;
                }
            }
        }
    }

    .lw-admin-draggable-delete {
        height: 100%;
        position: absolute;
        right: -8px;
        top: 0px;
        display: none;
    }

    .placeholder-style {
        display: block !important;
        color: transparent;
        border-style: dashed !important;
    }

    .delte-item-animation {
        opacity: 0;
        transition: all .2s;
    }
</style>
