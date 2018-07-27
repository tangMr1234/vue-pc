<template>
    <section>
        <el-row>
            <!-- 顶部工具条 -->
            <el-col class="toolbar mb10" :style="searchList && searchList!=''?'padding-bottom: 0':''">
                <div v-if="searchList!=''&& searchList!=null">
                    <components is="lwForm" :parent_data="parent_data" :data="searchList" ref="filter">
                        <lw-button slot="button"
                                   :data="searchList['button_items']"
                                   @button_click="buttonAllEvent"
                                   type="filter">
                        </lw-button>
                    </components>
                </div>
                <!-- 没有搜索数据就显示页面名 -->
                <div v-else>{{route}}</div>
            </el-col>
            <!-- 表格列表 -->
            <el-col>
                <div :style="'height:'+ table_height + 'px;'" ref="table_top_height">
                    <lw-table :data="tableListData" :tableLoading="List_Loading" :tableList="tableList"
                              @tableEdit="buttonAllEvent" style="width:100%;" id="table" ref="table">
                    </lw-table>
                </div>
            </el-col>
            <!-- 底部工具条 -->
            <el-col>
                <div class="lw-clearfix toolbar mt10" ref="footbar_height">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.page"
                            :page-sizes="pagination.page_sizes"
                            :page-size="pagination.limit"
                            :total="pagination.total"
                            layout="total, sizes, prev, pager, next, jumper"
                            style="float:right;">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 调用dialog组件（右侧半屏或者全屏显示） -->
        <lw-r-dialog :show.sync="FormShow" :parentToChild="parent_data" class="lwLoading"
                     @dislogClose="dialog_close = false" ref="public_dailog">
            <components slot="html" v-if="FormData && FormData!=''" :is="component" :parent_data="parent_data"
                        :data="FormData" :dialog_close="dialog_close" @button_click="buttonAllEvent" ref="form">
                <lw-button slot="button" :data="FormData['button_items']" @button_click="buttonAllEvent" type="form">
                </lw-button>
            </components>
        </lw-r-dialog>
    </section>
</template>

<script>
    import lwTable from "@/components/lwTable"
    import lwButton from "@/components/lwButton"
    import lwRDialog from "@/components/lwRDialog"
    import lwForm from "@/components/lwForm"
    import lwPopupTabs from "@/components/lwPopupTabs"
    import {getFeatureList, getFromList, postFormList, getRefer} from "@/api/api";

    export default {
        components: {lwTable, lwButton, lwRDialog, lwForm, lwPopupTabs},
        data() {
            return {
                route: null,   //当前页面的name
                searchList: null,  //顶部搜索栏需要传递的搜索表单数据
                tableListData: {},     //表格传递的数据
                tableList: {},      //表格的部分配置项，字段名不能修改
                List_Loading: false,   //表格加载时的loading
                table_height: 400,   //表格的初始高度，包括表头
                component: null,    //弹出的加载组件
                FormShow: false,  //右侧弹出组件是否显示
                FormData: null,   //弹出层的表单数据
                //传递给弹出子页面的数据
                parent_data: {
                    id: null,
                    title: null,
                    type: null,
                },
                //分页
                pagination: {
                    limit: null,
                    total: 0,
                    page: 1,
                    page_sizes: []
                },
                copy_pagination: {
                    limit: null,
                    total: 0,
                    page: 1,
                    page_sizes: []
                },
                searchForm: {},  //搜索提交的数据
                pk: null,  //刷新等操作需要提交的字段,重要字段
                submit_loading: false, //提交数据时dialog的loading
                dialog_close: true,
                path: "/" + this.$route.params.url.replace(/-/g, "/"), //获取数据或提交时请求的url
            }
        },
        methods: {
            /***** 调用公用方法设置table的高度 *****/
            setHeight() {
                this.$nextTick(() => {
                    this.table_height = this.$utils.set_height(this.$refs["table_top_height"], this.$refs["footbar_height"]) - 30; //因为底部有20px的间距和底部10px间距
                });
            },
            /***** 操作按钮 *****/
            buttonAllEvent(items, row, para) {
                let url;
                if (typeof(items['remote_url']) !== "undefined" && items['remote_url'] != "" && items['remote_url'] != null) {
                    url = items['remote_url'];
                } else if (typeof(items.local_url) !== "undefined" && items.local_url != '' && items.local_url != null) {
                    url = this.path + "/" + items.local_url;
                } else {
                    url = this.path;
                }
                switch (items.function) {
                    case "cancel":  //取消
                        this.buttonCancel();
                        break;
                    case "target":  //判断是否是打开新窗口的操作
                        let _param = "";
                        for (let i in items.options) {
                            _param += (i + "=" + items.options[i] + "&");
                        }
                        window.open(BaseUrl + "/options?" + _param.substr(0, _param.length - 1));
                        break;

                    case "remote":  //刷新、转移等需要axios请求的操作
                        let _params = "";
                        if (row && row[this.pk]) {
                            _params = "?" + this.pk + "=" + row[this.pk];
                        } else {
                            items.is_loading = true;
                            this.pagination = this.copy_pagination;
                        }
                        this.buttonRemote(url, items);
                        break;

                    case "search":  //搜索
                        this.pagination.page = 1;
                        this.searchForm = this.$refs.filter.submit().data;
                        this.getList();
                        break;

                    case "handle":   //新增 or 编辑 or 删除 or 复制 or 其他更多
                        this.buttonHandle(typeof(row) !== "undefined" && row != '' ? row[this.pk] : '', items, "【" + items.text + "】 " + this.route, url);
                        break;

                    case "popup":  //弹窗
                        this.buttonPopup(url, row.id);
                        break;

                    case "submit":  //提交
                        this.buttonSubmit(para);
                        break;
                    default:
                }
            },
            /***** （新增、编辑和删除的公用部分）的公用操作 *****/
            buttonHandle(id, items, title, url) {
                let part_loading = this.$utils.part_loading(".lwLoading");
                setTimeout(() => {
                    this.FormShow = true;
                    this.component = "lwForm";
                    this.parent_data = {
                        id: id,
                        type: items.local_url,
                        title: title
                    };
                    this.getPopupForm(part_loading, url);
                }, 100);
            },
            /***** 刷新按钮 *****/
            buttonRemote(para, items) {
                let _this = this;
                _this.List_Loading = true;
                _this.searchForm = {};
                _this.$refs.filter.resetForm(); //重置搜索
                if (para) {
                    getRefer(para).then((res) => {
                        _this.publicButtonRemote(_this.route + "：" + res.data.msg, "success", items);
                    }).catch(function (error) {
                        _this.publicButtonRemote(_this.route + "：" + error.message, "error", items);
                    });
                }
            },
            publicButtonRemote(msg, type, items) {
                this.message_show(msg, type);
                this.getList(items);
                this.$refs.table.clear_table_method(); //调用table页的方法清除一些table的操作
            },
            /***** 取消（关闭弹窗） *****/
            buttonCancel() {
                this.FormShow = false;
            },
            /***** 提交按钮(弹出层新增、修改、删除的提交按钮执行) *****/
            buttonSubmit(para) {
                let _this = this, _param, part_loading = _this.$utils.part_loading(".el-dialog_new");
                if (para) {
                    _param = para;
                    _param['key'] = _this.pk;
                } else {
                    _param = _this.$refs.form.submit();
                }
                _param["path"] = _this.path;
                postFormList(_param).then((res) => {
                    _this.submit_loading = false;
                    _this.$message({
                        showClose: true,
                        message: _this.route + "：" + res.data.msg,
                        type: 'success',
                        duration: 1000,
                        onClose() {
                            part_loading.close();
                            _this.buttonCancel();
                            _this.getList("submit");
                        }
                    });
                }).catch(function (error) {
                    part_loading.close();
                    _this.message_show(_this.route + "：" + error.message, "error");
                });
            },
            /***** 弹窗按钮的方法 *****/
            buttonPopup(url, rowId) {
                let _this = this, _param = {path: url};
                _param[_this.pk] = rowId;
                _this.parent_data = {id: rowId, type: ""};
                _this.$refs["public_dailog"].zoom();
                _this.component = "lwPopupTabs";
                _this.FormShow = _this.dialog_close = true;
                getFeatureList(_param).then((res) => {
                    let data = res.data.data;
                    _this.FormData = data;
                    _this.parent_data["title"] = data["info"];
                    _this.$nextTick(() => {
                        _this.$refs.form.load();
                    });
                }).catch(function (error) {
                    _this.message_show(_this.route + "：" + error.message, "error");
                });
            },
            /***** 通用的message弹窗 *****/
            message_show(msg, type) {
                this.$message({showClose: true, message: msg, type: type});
            },
            /***** 切换每页显示条数 *****/
            handleSizeChange(val) {
                this.public_CurrentChange("limit", val, "handleSizeChange");
            },
            /***** 分页切换 *****/
            handleCurrentChange(val) {
                this.public_CurrentChange("page", val);
            },
            public_CurrentChange(key, val, para) {
                this.List_Loading = true;
                this.pagination[key] = val;
                this.getList(para);
            },
            /***** 获取顶部搜索筛选的表单 *****/
            getSearch() {
                let _this = this;
                getFromList({path: _this.path + "/search"}).then((res) => {
                    _this.searchList = res.data.data;
                    _this.setHeight();
                }).catch(function (error) {
                    _this.searchList = null;
                    _this.setHeight();
                    _this.message_show(_this.route + "：" + error.message, "error");
                });
            },
            /***** 列表数据 *****/
            getList(param) {
                let _this = this;
                let _param = {
                    path: _this.path,
                    limit: _this.pagination.limit,
                    page: _this.pagination.page,
                    search: JSON.stringify(_this.searchForm)
                };
                _this.List_Loading = true;
                getFeatureList(_param).then((res) => {
                    let data = res.data.data;
                    _this.pk = data["pk"];
                    if (!param || param === "router") {
                        _this.$utils.set_scrollTop("table", "el-table__body-wrapper", "scrollTop", 0); //设置滚动条置顶
                    } else if (param.is_loading) {
                        _this.$utils.set_scrollTop("table", "el-table__body-wrapper", "scrollTop", 0); //设置滚动条置顶
                        param.is_loading = false; //关闭按钮loading
                    }
                    _this.pagination = {
                        total: parseInt(data.page.total),
                        page: parseInt(data.page.current_page),
                        limit: parseInt(data.page["page_size"]),
                        page_sizes: data.page.page_sizes
                    };
                    _this.tableListData = data['table_items'][0];
                    _this.$nextTick(() => {
                        setTimeout(() => {
                            _this.$store.state.custom.is_loading = _this.List_Loading = false;
                        }, 300)
                    });
                }).catch(function (error) {
                    if (param) {
                        _this.tableListData = {list: null, column: null, option: null}
                    }
                    _this.$store.state.custom.is_loading = _this.List_Loading = false;
                    _this.message_show(_this.route + "：" + error.message, "error");
                });
            },
            /***** 获取弹出表单 *****/
            getPopupForm(part_loading, url) {
                let _this = this;
                _this.FormData = null;
                let _param = {
                    path: url,
                    param: _this.parent_data.type,
                    id: _this.parent_data.id,
                    key: _this.pk,
                };
                getFromList(_param).then((res) => {
                    _this.FormData = res.data.data;
                    _this.$nextTick(() => {
                        part_loading.close();
                    });
                }).catch(function (error) {
                    _this.FormData = null;
                    _this.message_show(_this.route + "：" + error.message, "error");
                    part_loading.close();
                });
            },
            /***** 初始化获取搜索和列表 *****/
            getInit(para) {
                this.getSearch();
                this.getList(para);
            },
            //获取后台传递的路由
            get_route() {
                let ro = this.$utils.traverse(JSON.parse(localStorage.getItem("HomeMenu")).route, this.$route.path, "path");
                if (ro && ro != "" && ro["name"]) {
                    this.route = ro["name"];
                }
            }
        },
        created() {
            this.get_route();
            this.getInit();
        },
        mounted() {
            this.$nextTick(() => {
                const _this = this;
                _this.get_route();
                window.onresize = () => {
                    return (() => {
                        _this.setHeight();
                    })()
                };
            });
        },
        watch: {
            '$route'() {
                this.get_route();
                this.path = "/" + this.$route.params.url.replace(/-/g, "/");
                this.pagination = this.copy_pagination;
                this.searchForm = {};
                this.getInit("router");
            }
        }
    }
</script>
