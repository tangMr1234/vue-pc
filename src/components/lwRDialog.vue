<template>
    <el-dialog custom-class="el-dialog_new" :visible.sync="visible"
               @close="$emit('update:show', false)" :show="show"
               :close-on-click-modal="false" @closed="closed" :fullscreen="is_fullscreen"
               :class="is_fullscreen?'lw_dialog_custom':'lw-dialog-warp'">
        <!-- 标题 -->
        <div slot="title">{{parentToChild.title}}
            <span style="padding-right:30px;color:#666;float:right;">
            <i class="cursor_pointer iconfont" :class="is_fullscreen?'icon-caozuo_suoxiao':'icon-caozuo_quanpingfangda'"
               @click="zoom" :title="is_fullscreen?'缩小':'放大'"></i>
            </span>

        </div>
        <!-- 内容 -->
        <div style="height:100%;">
            <div v-html="parentToChild.data">
                {{parentToChild.data}}
            </div>
            <slot name="html"></slot>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'child',
        data() {
            return {
                visible: this.show,
                is_fullscreen: false
            };
        },
        props: ["parentToChild", "show"],
        watch: {
            show() {
                this.visible = this.show;
            }
        },
        method: {
            show: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            zoom() {
                this.is_fullscreen = !this.is_fullscreen;
            },
            closed() {
                this.is_fullscreen = false;
                this.$emit("dislogClose");
            }
        }
    };
</script>

<style lang="scss">
    .lw-dialog-warp {
        left: auto;
        width: 62%;
        overflow: hidden;
        .el-dialog_new {
            width: auto;
            margin: 0 !important;
            height: 100vh;
        }
    }

    .lw_dialog_custom {
        .el-dialog_new {
            width: 98%;
            height: 96%;
            top: 2%;
            overflow: hidden;
        }
    }

    .lw-dialog-warp, .lw_dialog_custom {
        .el-dialog__header {
            padding: 15px 20px;
            background: #F8F8F8;
            border-bottom: 1px solid #eee;
        }
        .el-dialog__headerbtn {
            top: 15px;
        }
        .el-dialog__body {
            overflow-x: hidden;
            height: calc(100% - 109px);
        }
    }
</style>
