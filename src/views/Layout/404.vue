<template>
    <div style="background:#f0f2f5;height:100%;">
        <div class="LW-http404">
            <div class="pic-404">
                <img class="pic-404__parent" :src="img_404" alt="404">
                <img class="pic-404__child left" :src="img_404_cloud" alt="404">
                <img class="pic-404__child mid" :src="img_404_cloud" alt="404">
                <img class="pic-404__child right" :src="img_404_cloud" alt="404">
            </div>
            <div class="bullshit">
                <div class="bullshit__oops">警告!</div>
                <div class="bullshit__info">版权所有
                    <a class='link-type' href='//www.shckit.com/' target='_blank'>{{company}}</a>
                </div>
                <div class="bullshit__headline">{{ message }}</div>
                <div class="bullshit__info">请检查您输入的网址是否正确，或者联系我们寻求帮助 <span
                        style="color:#1482f0;">服务热线：{{tel_phone}}</span><br>点击以下按钮返回...
                </div>
                <a @click="$router.push('/')" class="bullshit__return-home">
                    <el-button type="primary" round>返回首页</el-button>
                </a>
                <el-button type="primary" round class="bullshit__return-home" @click="$router.go(-1)">返回上一页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import img_404 from '@/assets/404_images/404.png'
    import img_404_cloud from '@/assets/404_images/404_cloud.png'

    export default {
        data() {
            return {
                img_404,
                img_404_cloud,
                message: '这个页面不存在或出错了或者无权访问......',
                tel_phone: "400-681-5218",
                company: "冷王智能科技",
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.NProgressDone();
            });
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .LW-http404 {
        position: fixed;
        overflow: hidden;
        width: 920px;
        height: 350px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        .pic-404 {
            position: relative;
            float: left;
            width: 600px;
            overflow: hidden;
            &__parent {
                width: 100%;
            }
            &__child {
                position: absolute;
                &.left {
                    width: 80px;
                    top: 17px;
                    left: 220px;
                    opacity: 0;
                    animation-name: cloudLeft;
                    animation-duration: 2s;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                    animation-delay: 1s;
                }
                &.mid {
                    width: 46px;
                    top: 10px;
                    left: 420px;
                    opacity: 0;
                    animation-name: cloudMid;
                    animation-duration: 2s;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                    animation-delay: 1.2s;
                }
                &.right {
                    width: 62px;
                    top: 100px;
                    left: 500px;
                    opacity: 0;
                    animation-name: cloudRight;
                    animation-duration: 2s;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                    animation-delay: 1s;
                }
                @keyframes cloudLeft {
                    0% {
                        top: 17px;
                        left: 220px;
                        opacity: 0;
                    }
                    20% {
                        top: 33px;
                        left: 188px;
                        opacity: 1;
                    }
                    80% {
                        top: 81px;
                        left: 92px;
                        opacity: 1;
                    }
                    100% {
                        top: 97px;
                        left: 60px;
                        opacity: 0;
                    }
                }
                @keyframes cloudMid {
                    0% {
                        top: 10px;
                        left: 420px;
                        opacity: 0;
                    }
                    20% {
                        top: 40px;
                        left: 360px;
                        opacity: 1;
                    }
                    70% {
                        top: 130px;
                        left: 180px;
                        opacity: 1;
                    }
                    100% {
                        top: 160px;
                        left: 120px;
                        opacity: 0;
                    }
                }
                @keyframes cloudRight {
                    0% {
                        top: 100px;
                        left: 500px;
                        opacity: 0;
                    }
                    20% {
                        top: 120px;
                        left: 460px;
                        opacity: 1;
                    }
                    80% {
                        top: 180px;
                        left: 340px;
                        opacity: 1;
                    }
                    100% {
                        top: 200px;
                        left: 300px;
                        opacity: 0;
                    }
                }
            }
        }
        .bullshit {
            position: relative;
            float: left;
            width: 300px;
            overflow: hidden;
            &__oops {
                font-size: 32px;
                font-weight: bold;
                line-height: 40px;
                color: #1482f0;
                opacity: 0;
                margin-bottom: 20px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
            }
            &__headline {
                font-size: 20px;
                line-height: 24px;
                color: #1482f0;
                opacity: 0;
                margin-bottom: 10px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.1s;
                animation-fill-mode: forwards;
            }
            &__info {
                font-size: 13px;
                line-height: 21px;
                color: grey;
                opacity: 0;
                margin-bottom: 30px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.2s;
                animation-fill-mode: forwards;
            }
            &__return-home {
                display: block;
                float: left;
                opacity: 0;
                margin-right: 10px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.3s;
                animation-fill-mode: forwards;
            }
            @keyframes slideUp {
                0% {
                    transform: translateY(60px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        }
    }
</style>