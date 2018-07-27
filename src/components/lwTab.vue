<template>
    <section>
        <!-- 顶部标签栏 -->
        <div class="custom_tags">
            <el-row style="white-space: nowrap;">
                <el-col>
                    <el-tag v-for="(tag, index) in dynamicTags" :key="index" :closable="index==0 ? false:true"
                            :class="tag.path==$route.path?'tag_active':''" disable-transitions color="#fff"
                            @close="handleClose(tag)" @click.native="jump(tag.path)"
                            @contextmenu.prevent.native="openMenu(tag,$event)">
                        <i class="fa fa-circle" style="margin-right:8px;"></i>{{tag.name}}
                    </el-tag>
                </el-col>
            </el-row>
        </div>
        <!-- 顶部标签栏的右键功能 -->
        <ul class="contextmenu" :style="'left:'+left+'px;top:'+top+'px;'" v-show="visible">
            <li v-for="(o, index) in contextmenu" :key="index" @click="tag_close(o.value)">
                {{ o.label }}
            </li>
        </ul>
    </section>
</template>

<script>
    export default {
        props: ["data"],
        data() {
            return {
                selectedTag: {},   //选中的顶部导航标签
                visible: false,  //顶部菜单的右键功能是否显示
                left: 0,   //顶部菜单的右键功能的显示位置
                top: 0,
                contextmenu: [],  //顶部菜单的右键功能
                dynamicTags: [{
                    name: null,
                    path: null,
                    is_home: null,
                }],
                is_index: null,
            };
        },
        methods: {
            //顶部标签切换
            jump(link) {
                this.$router.push(link);
            },
            //顶部标签的关闭
            handleClose(tag) {
                if (tag.name !== this.is_index.name) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                    this.$router.push(this.dynamicTags[this.dynamicTags.length - 1].path);
                }
            },
            //顶部标签的关闭其他
            closeOther() {
                if (this.selectedTag.name == this.is_index.name) {
                    this.dynamicTags = [
                        {name: this.selectedTag.name, path: this.selectedTag.path}
                    ];
                } else {
                    this.dynamicTags = [
                        this.is_index,
                        this.selectedTag
                    ];
                }
                this.$router.push(this.selectedTag.path);
            },
            //顶部标签的关闭所有
            closeAll() {
                this.dynamicTags = [
                    this.is_index
                ];
                this.$router.push(this.is_index.path);
            },
            //鼠标右键操作顶部标签
            tag_close(id) {
                switch (id) {
                    case 1:   //关闭当前
                        this.handleClose(this.selectedTag);
                        break;

                    case 2:   //关闭其他
                        this.closeOther();
                        break;

                    case 3:   //关闭所有
                        this.closeAll();
                        break;

                    default:
                }
            },
            //动态增加顶部标签
            add(name, link) {
                this.$nextTick(() => {
                    if (this.dynamicTags.filter(item => item.path == link) == "") {
                        if (this.dynamicTags.length <= 5) {
                            let inputValue = {name: name, path: link};
                            if (inputValue) {
                                this.dynamicTags.push(inputValue);
                            }
                            this.$router.push(link);
                        } else {
                            this.$confirm('标签已超过最大打开数量，请先关闭一部分！(注：点击单个标签右侧关闭或使用单个标签的右键功能菜单关闭或使用下方按钮关闭)', '提示', {
                                confirmButtonText: '一键关闭',
                                cancelButtonText: '取消',
                                beforeClose: (action, instance, done) => {
                                    done();
                                }
                            }).then(() => {
                                this.tag_close(3);
                            }).catch(() => {

                            });
                        }
                    } else {
                        this.$router.push(link);
                    }
                });
            },
            //顶部标签的右键
            openMenu(tag, e) {
                this.visible = true;
                this.contextmenu = [
                    {label: "关闭其他", value: 2},
                    {label: "关闭所有", value: 3},
                ];
                if (tag.name != this.is_index.name) {
                    this.contextmenu.unshift({label: "关闭当前", value: 1});
                }
                this.selectedTag = tag;
                this.left = e.clientX;
                this.top = e.clientY;
            },
            closeMenu() {
                this.visible = false
            },
        },
        created() {
            this.dynamicTags = this.data;
            this.is_index = this.$utils.traverse(this.dynamicTags, true, "is_home");
        },
        watch: {
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
    };
</script>

<style lang="scss">
    .custom_home .el-tag {
        cursor: pointer;
        color: #495060;
        border: 1px solid #e9eaec;
        margin-right: 5px;
    }

    .el-tag i, .el-tag .el-icon-close {
        color: #e9eaec;
    }

    .tag_active, .tag_active i {
        color: #409EFF;
    }

    .el-tag .el-icon-close:hover {
        background-color: transparent;
        color: #409EFF;
    }

    .custom_tags {
        padding: 5px 5px 5px;
        box-shadow: 0 1px 7px rgba(0, 0, 0, 0.12) inset, 0 0 80px rgba(0, 0, 0, 0.04) inset;
        overflow-y: hidden;
        min-height: 31.7px;
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 10;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
        li {
            list-style-type: none;
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
</style>
