<template>
    <div class="business_box" v-if="showMe">
        <section style="height:100%;">
            <el-row :gutter="20" style="height:100%;">
                <!-- 滚动tab -->
                <el-col span="4" style="height:100%;">
                    <ul class="business_left business_scroll" ref="businessLeft">
                        <li v-for="(item, index) in leftMenuData" :key="index"
                            @click="leftControlRightScroll(index)"
                            :class='{active_ia:index == 0}'>
                            <div>{{item.label}}</div>
                        </li>
                    </ul>
                </el-col>
                <!-- 内容 -->
                <el-col span="20" style="height:100%;">
                    <div class="business_scroll" ref="ullist">
                        <slot></slot>
                    </div>
                </el-col>
            </el-row>
        </section>
    </div>
</template>
<script>
    export default {
        props: ["leftMenuData", "anchor"],
        data() {
            return {
                showMe: false,
                is_leftClick: false,
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.$store.state.custom.is_loading = false;
                this.showMe = true;
            });
        },
        watch: {
            showMe: function (value) { // value就是showMe
                if (value) {
                    this.$nextTick(() => {
                        this.init();
                    });
                }
            }
        },
        methods: {
            // 初始化
            init() {
                this.rightControlLeftClass();
            },
            checkScroll() {
                let active = document.querySelectorAll('li.active_ia')[0].offsetTop;
                let doc = this.$refs.businessLeft.scrollTop;
                let docHeight = this.$refs.businessLeft.clientHeight;
                console.log(docHeight);
                console.log(doc);
                if (active < doc || active >= (doc + docHeight)) {
                    this.$refs.businessLeft.scrollTop = active;
                }
            },
            // 右列表控制左列表样式
            rightControlLeftClass() {
                let leftUl = this.$refs.businessLeft;
                let leftLI = leftUl.getElementsByTagName('li');
                let rightUl = this.$refs.ullist;
                let ti = rightUl.querySelectorAll(this.anchor);
                let asIndex = 0;
                rightUl.addEventListener('scroll', () => {
                    // 当前scrollTop
                    let thisST = rightUl.scrollTop;
                    for (let i = 0; i < ti.length; i++) {
                        if (thisST >= ti[i].offsetTop) {
                            asIndex = i;
                        }
                    }
                    // 给左目录列表所有的li去掉激活样式
                    for (let j = 0, x = leftLI.length; j < x; j++) {
                        leftLI[j].classList.remove('active_ia');
                    }
                    // 当前滚动到的li加激活样式
                    leftLI[asIndex].classList.add('active_ia');
                    if (!this.is_leftClick) {
                        this.checkScroll();
                    }
                }, false);
            },
            // 左列表点击控制右列表滚动
            leftControlRightScroll(index) {
                this.is_leftClick = true;
                let scrollMove = (ele, target) => {
                    // 根据当前scrollTop与目标点距离算出单次改变量
                    let vector = Math.round((target - ele.scrollTop) / 10);
                    let scrollTimer = setInterval(() => {
                        ele.scrollTop += vector;
                        // 超出目标点后 或者 已经滚动到底清空定时器
                        // 上滑(scrollTop>=目标点 且 vector为正) 或 下滑(scrollTop <= 目标点 且 vector为负)或 滑到最底
                        if (((ele.scrollTop >= target) && vector > 0) || ((ele.scrollTop <= target) && vector < 0) || ((ele.scrollTop + ele.clientHeight + 1) >= ele.scrollHeight)) {
                            // 原来状态+1 正确激活当前左栏状态，当前未+1是由于线条关系
                            ele.scrollTop = target;
                            clearInterval(scrollTimer);
                            this.is_leftClick = false;
                        }
                    }, 1000 / 100);
                };
                let rightUl_ = this.$refs.ullist;
                // 右列表应该滚动到的标题的offsetTop
                let rightTo_ = rightUl_.querySelectorAll(this.anchor)[index].offsetTop;
                scrollMove(rightUl_, rightTo_);
            }
        }
    };
</script>

<style lang="scss">
    ul, li {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .business_box {
        width: 100%;
        height: 100%;
        /* 商品 */
        .business_scroll {
            overflow-y: auto;
            height: 100%;
            &.business_left {
                &::-webkit-scrollbar {
                    width: 0;
                }
                &:hover::-webkit-scrollbar { /*滚动条整体样式*/
                    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
                    height: 4px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background: rgba(0, 0, 0, 0.2);
                }
                &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
                    border-radius: 5px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background: rgba(0, 0, 0, 0.2);
                }
                li {
                    padding: 10px;
                    position: relative;
                    border-bottom: 1px solid #dcdcdc;
                    position: relative;
                    cursor: pointer;
                    background: #eee;
                }
                li.active_ia {
                    background: #f8f8f8;
                    &:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: .1rem;
                        height: 100%;
                        background: #3190e8;
                    }
                }
            }
        }
    }
</style>
