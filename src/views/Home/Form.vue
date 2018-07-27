<template>
    <section>
        <lw-form :parent_data="parent_data"
                 :data="FormData" :dialog_close="dialog_close" @button_click="$_button_click" ref="form">
            <!--<lw-button slot="button" :data="FormData['button_items']" @button_click="$_button_click"-->
            <!--type="form"></lw-button>-->
        </lw-form>
    </section>
</template>

<script>
    import lwForm from "@/components/lwForm"
    import lwButton from "@/components/lwButton"
    import {getCom} from "@/api/api";

    export default {
        components: {lwForm, lwButton},
        data() {
            return {
                FormData: null,
                //传递给弹出子页面的数据
                parent_data: {
                    id: "",
                    title: "",
                    type: ""
                },
            }
        },
        methods: {
            $_button_click() {
                alert(1);
            },
            getData() {
                let _this = this;
                getCom("/" + this.$route.params.url.replace(/-/g, "/")).then((res) => {
                    _this.FormData = res.data.data;
                    _this.$nextTick(() => {
                        _this.$store.state.custom.is_loading = false;
                    });
                }).catch(function (error) {
                    _this.$store.state.custom.is_loading = false;
                    _this.$message({
                        showClose: true,
                        message: error.message,
                        type: 'error'
                    });
                });
            },
        },
        created() {
            this.getData();
        }
    }
</script>
