<template>
    <el-card :class="data.header||data.link?'box-card no_padding':'box-card'" style="position:relative;">
        <div slot="header" v-if="data.header||data.link">
            <div class="clearfix"
                 style="position: relative;">
                <el-alert :title="data.header" :type="data.type?data.type:'primary'" :closable="false"
                          style="padding: 18px 20px;">
                </el-alert>
                <el-button type="text" v-if="data.link" style="position:absolute;right:10px;top:0;z-index:10;"
                           @click.native="jump(data.link)">{{data.link_name}}
                </el-button>
            </div>
        </div>
        <slot v-else></slot>
        <div v-if="data.content&&data.content!=''"
             :style="data.header||data.link?'text-align:center;position: absolute;transform: translate(-50%,-50%);top: 55%;left: 50%;':''">
            <span>{{data.title}}</span>
            <h1 :class="'el-tag--'+ data.content_type + ' content_text'" style="font-size:2em;">{{data.content}}</h1>
        </div>
        <slot name="content"></slot>
        <div class="bottom clearfix" style="position:absolute;bottom:20px;">
            <time style="color:#324d79">{{data.footer}}</time>
        </div>
    </el-card>
</template>

<script>
    export default {
        props: ["data"],
        data() {
            return {}
        },
        methods: {
            jump(link) {
                this.$router.push(link);
            },
            loadingClose() {
                this.$nextTick(() => {
                    this.$emit("load");
                });
            }
        },
        mounted() {
            this.loadingClose();
        },
        watch: {
            data: function () {
                this.loadingClose();
            }
        }
    }
</script>

<style>
    .no_padding .el-card__header {
        padding: 0;
    }

    .content_text {
        background: transparent;
    }

    .box-card .el-alert--primary {
        background: transparent;
        color: #409EFF;
    }
</style>
