<template>
    <section>
        <iframe :src="url" frameborder="0" width="100%"
                class="frame" @load="isLoading"></iframe>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                url: null
            }
        },
        methods: {
            isLoading() {
                this.$nextTick(() => {
                    this.$store.state.custom.is_loading = false;
                });
            }
        },
        created() {
            this.url = BaseUrl + "/" + this.$route.params.url.replace(/-/g, "/");
        },
        watch: {
            "$route": function () {
                this.isLoading();
            }
        }
    }
</script>

<style>
    .bighome .frame {
        position: fixed;
        top: 63px;
        left: 0;
        height: calc(100% - 63px);
    }
</style>