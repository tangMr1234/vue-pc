<template>
    <div class="login">
        <div v-if="is_show">
            <el-button type="primary" @click="jump()">登录成功，进入系统 ({{count}})</el-button>
        </div>
        <div v-else>
            <el-button type="primary" @click="login()">您已退出，点此登陆</el-button>
        </div>
    </div>
</template>

<script>
    import {requestLogin} from '@/api/api';

    export default {
        data() {
            return {
                access: null,
                local_url: '',
                count: '',
                timer: null,
                is_show: true
            };
        },
        methods: {
            jump() {
                if (this.access) {
                    this.$cookie.set('access', this.$route.query.access, 1);
                    this.$router.push('/');
                } else {
                    alert("请登录一下吧！");
                }
            },
            login() {
                top.location.href = BaseUrl + '/init/app/login/login/?back_url=' + this.local_url;
            },
            auto_jump() {
                this.$cookie.set('access', this.$route.query.access, 1);
                const TIME_COUNT = 3;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.$router.push('/');
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000)
                }
            }
        },
        created() {
            localStorage.clear();
            sessionStorage.clear();
            this.$cookie.delete('access');

            this.local_url = Base64.encode(top.location.href);
            if (this.$route.query.access)
                this.access = this.$route.query.access;
            else if (this.$cookie.get('access'))
                this.access = this.$cookie.get('access');

            // 获取 axios 里判断登出后设置的localstorage
            if (!localStorage.getItem("is_login")) {
                if (this.access) {
                    this.is_show = true;
                    this.auto_jump();
                } else {
                    this.is_show = false;
                }
            } else {
                localStorage.removeItem("is_login");
                this.is_show = false;
            }
            this.$nextTick(() => {
                this.NProgressDone(); //调用main中的的方法关闭进度条，404页面同用，home和bigHome里的页面采用vuex关闭
            });
        },
        watch: {
            '$route'(to) {
                this.local_url = Base64.encode(top.location.href);
            },
        },
    }
</script>

<style scoped lang="scss">
    .login {
        text-align: center;
        position: fixed;
        top: 50%;
        left: 0;
        right: 0;
        margin: -20px auto 0;
    }
</style>
