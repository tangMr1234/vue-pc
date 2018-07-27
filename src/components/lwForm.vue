<template>
    <el-form v-if="data && data !=''" :model="data" ref="Form"
             :label-width="(!data.form_items.inline)?'110px':''"
             :inline="data.form_items.inline" :label-position="data.form_items.labelPosition"
             :size="data.form_items.size"
             @submit.native.prevent>
        <el-form-item v-for="(items, index) in data.form_items.list" :key="index"
                      :label-width="(!items.label||items.label=='')?'0':''"
                      v-show="(typeof(items.show) !== 'undefined')?items.show:true"
                      :prop="'form_items.list.' + index + '.default'">
            <!-- 用插槽插入label -->
            <div slot="label" v-if="items.label&&items.label!=''">
                <div v-if="items.required"><span style="color:red">* </span> {{items.label+'：'}}</div>
                <div v-else>{{items.label+'：'}}</div>
            </div>
            <el-col :span="24">
                <!-- radio组和checkbox组 -->
                <div v-if="items.type == 'ForList'" class="one">
                    <components :is="items.component" v-model="items.default" :border="items.is_border"
                                :disabled="items.disabled">
                        <components :is="items.components" v-for="(data, index) in items.list" :key="index"
                                    :label="(data.label&&data.label!='')?data.label:''"
                                    :style="items.component=='el-radio-group'||items.component=='el-checkbox-group'?'':'margin: 0 0 5px 15px;'">
                        </components>
                    </components>
                </div>
                <!-- 无list数据的类型主要用于下拉选择 -->
                <div v-else-if="items.type == 'NoForList'" class="two">
                    <components :is="items.component" v-model="items.default"
                                :disabled="items.disabled"
                                :clearable="items.is_clearable" :placeholder="items.placeholder"
                                :multiple="items.is_multiple" :collapse-tags="items.is_collapse"
                                :filterable="items.is_filterable" style="width: 100%;" :size="items.size">
                        <el-option
                                v-for="item in items.list"
                                :key="item.label"
                                :label="(item.label&&item.label!='')?item.label:''"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </components>
                </div>
                <!-- 一般都加载这个 -->
                <div v-else class="three">
                    <!-- 自定义类型的input -->
                    <div v-if="items.component == 'el-input-zdy'" class="zdy_input">
                        <el-input placeholder="请输入内容" v-model="items.default"
                                  class="input-with-select" :size="items.size">
                            <el-select v-if="items.list&&items.list!=''" v-model="items.model" slot="prepend"
                                       placeholder="请选择">
                                <el-option v-for="(data, index) in items.list" :key="index"
                                           :label="(data.label&&data.label!='')?data.label+'：':''"
                                           :value="data.value"></el-option>
                            </el-select>
                            <el-button v-if="items.is_button" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                    <!-- 正常类型的加载 -->
                    <div v-else>
                        <components :is="items.component" :title="items.title" :description="items.description"
                                    :show-icon="items.show_icon" :closable="items.closable"
                                    v-model="items.default" :border="items.is_border"
                                    :disabled="items.disabled" :placeholder="items.placeholder"
                                    :clearable="items.is_clearable" :min="items.min" :max="items.max"
                                    :step="items.step" :precision="items.precision" :options="items.list"
                                    :expand-trigger="items.trigger" :show-all-levels="items.is_show_levels"
                                    :change-on-select="items.is_change" :filterable="items.is_filterable"
                                    :active-text="items.active_text" :inactive-text="items.inactive_text"
                                    :show-tooltip="items.is_show_tooltip" :show-stops="items.is_show_stops"
                                    :show-input="items.is_show_input" :vertical="items.is_vertical"
                                    :height="items.height"
                                    :picker-options="(items.quike)?(items.quike=='pickerOptions1')?pickerOptions1:pickerOptions2:items.list"
                                    :range-separator="items.separator" :start-placeholder="items.start_placeholder"
                                    :end-placeholder="items.end_placeholder" :is-range="items.is_range"
                                    :type="items.types" :unlink-panels="items.is_unlink" :size="items.size"
                                    :input-size="items.size" @change="handleChange" style="width: 100%;"></components>
                    </div>
                </div>
            </el-col>
        </el-form-item>
        <el-form-item>
            <slot name="button"></slot>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        props: ["parent_data", "data"],
        data() {
            return {
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                // Form: [
                //     {
                //         component: "el-input",
                //         type: "NoList",
                //         title: "输入框：",
                //         default: "你好！",
                //         disabled: false,
                //         placeholder: "请输入内容",
                //         is_clearable: true, //输入框的close按钮
                //         types: "text",
                //         size: "medium"
                //     },
                //     {
                //         component: "el-input-zdy",
                //         type: "NoList",
                //         title: "多样输入框：",
                //         default: "hi！",
                //         disabled: false,
                //         placeholder: "请输入内容",
                //         is_clearable: true, //输入框的close按钮
                //         types: "text",
                //         is_button: true, //显示右侧按钮
                //         list: [
                //             {label: "11", value: "aaa"},
                //             {label: "ss11", value: "aassa"},
                //         ],
                //         model: "11",
                //         size: "medium",
                //     },
                //     {
                //         component: "el-select",
                //         type: "NoForList",
                //         title: "下拉多选框：",
                //         default: "黄金糕",
                //         list: [{
                //             value: '选项1',
                //             label: '黄金糕'
                //         }, {
                //             value: '选项2',
                //             label: '双皮奶',
                //             disabled: true
                //         }, {
                //             value: '选项3',
                //             label: '蚵仔煎'
                //         }, {
                //             value: '选项4',
                //             label: '龙须面'
                //         }, {
                //             value: '选项5',
                //             label: '北京烤鸭'
                //         }],
                //         disabled: false,
                //         is_clearable: true,
                //         placeholder: "请选择XXX",
                //         is_multiple: "multiple", //是否为多选，为单选去掉该属性
                //         is_collapse: true, //多选时是否隐藏多余的选项
                //         is_filterable: true, //开启输入搜索
                //         size: "medium"
                //     },
                //     {
                //         component: "el-select",
                //         type: "NoForList",
                //         title: "下拉单选框：",
                //         default: "黄金糕",
                //         list: [{
                //             value: '选项1',
                //             label: '黄金糕'
                //         }, {
                //             value: '选项2',
                //             label: '双皮奶',
                //             disabled: true
                //         }, {
                //             value: '选项3',
                //             label: '蚵仔煎'
                //         }, {
                //             value: '选项4',
                //             label: '龙须面'
                //         }, {
                //             value: '选项5',
                //             label: '北京烤鸭'
                //         }],
                //         disabled: false,
                //         is_clearable: true,
                //         placeholder: "请选择XXX",
                //         is_collapse: true, //多选时是否隐藏多余的选项
                //         is_filterable: true, //开启输入搜索
                //         size: "medium"
                //     },
                //     {
                //         component: "el-radio-group",
                //         components: "el-radio",
                //         type: "ForList",
                //         title: "单选组：",
                //         default: "1",
                //         list: [
                //             {id: 1, label: "打一波广告"},
                //             {id: 2, label: "打二波广告"},
                //             {id: 3, label: "打三波广告"},
                //             {id: 4, label: "打四波广告"}
                //         ],
                //         is_border: false, // 是否是有边框的radio
                //         disabled: false,
                //     },
                //     {
                //         component: "el-checkbox-group",
                //         components: "el-checkbox",
                //         type: "ForList",
                //         title: "多选组：",
                //         default: ["2"],
                //         list: [
                //             {id: 1, label: "打1波广告"},
                //             {id: 2, label: "打2波广告"},
                //             {id: 3, label: "打3波广告"},
                //             {id: 4, label: "打4波广告"}
                //         ],
                //         disabled: false,
                //     },
                //     {
                //         component: "el-cascader",
                //         type: "Other",
                //         title: "级联选择：",
                //         default: ['zujian', 'data', 'tag'],
                //         list: [{
                //             value: 'zhinan',
                //             label: '指南',
                //             children: [{
                //                 value: 'shejiyuanze',
                //                 label: '设计原则',
                //                 disabled: true,
                //                 children: [{
                //                     value: 'yizhi',
                //                     label: '一致'
                //                 }, {
                //                     value: 'fankui',
                //                     label: '反馈'
                //                 }, {
                //                     value: 'xiaolv',
                //                     label: '效率'
                //                 }, {
                //                     value: 'kekong',
                //                     label: '可控'
                //                 }]
                //             }, {
                //                 value: 'daohang',
                //                 label: '导航',
                //                 children: [{
                //                     value: 'cexiangdaohang',
                //                     label: '侧向导航'
                //                 }, {
                //                     value: 'dingbudaohang',
                //                     label: '顶部导航'
                //                 }]
                //             }]
                //         }, {
                //             value: 'zujian',
                //             label: '组件',
                //             children: [{
                //                 value: 'basic',
                //                 label: 'Basic',
                //                 children: [{
                //                     value: 'layout',
                //                     label: 'Layout 布局'
                //                 }, {
                //                     value: 'color',
                //                     label: 'Color 色彩'
                //                 }, {
                //                     value: 'typography',
                //                     label: 'Typography 字体'
                //                 }, {
                //                     value: 'icon',
                //                     label: 'Icon 图标'
                //                 }, {
                //                     value: 'button',
                //                     label: 'Button 按钮'
                //                 }]
                //             }, {
                //                 value: 'form',
                //                 label: 'Form',
                //                 children: [{
                //                     value: 'radio',
                //                     label: 'Radio 单选框'
                //                 }, {
                //                     value: 'checkbox',
                //                     label: 'Checkbox 多选框'
                //                 }, {
                //                     value: 'input',
                //                     label: 'Input 输入框'
                //                 }, {
                //                     value: 'input-number',
                //                     label: 'InputNumber 计数器'
                //                 }, {
                //                     value: 'select',
                //                     label: 'Select 选择器'
                //                 }, {
                //                     value: 'cascader',
                //                     label: 'Cascader 级联选择器'
                //                 }, {
                //                     value: 'switch',
                //                     label: 'Switch 开关'
                //                 }, {
                //                     value: 'slider',
                //                     label: 'Slider 滑块'
                //                 }, {
                //                     value: 'time-picker',
                //                     label: 'TimePicker 时间选择器'
                //                 }, {
                //                     value: 'date-picker',
                //                     label: 'DatePicker 日期选择器'
                //                 }, {
                //                     value: 'datetime-picker',
                //                     label: 'DateTimePicker 日期时间选择器'
                //                 }, {
                //                     value: 'upload',
                //                     label: 'Upload 上传'
                //                 }, {
                //                     value: 'rate',
                //                     label: 'Rate 评分'
                //                 }, {
                //                     value: 'form',
                //                     label: 'Form 表单'
                //                 }]
                //             }, {
                //                 value: 'data',
                //                 label: 'Data',
                //                 children: [{
                //                     value: 'table',
                //                     label: 'Table 表格'
                //                 }, {
                //                     value: 'tag',
                //                     label: 'Tag 标签'
                //                 }, {
                //                     value: 'progress',
                //                     label: 'Progress 进度条'
                //                 }, {
                //                     value: 'tree',
                //                     label: 'Tree 树形控件'
                //                 }, {
                //                     value: 'pagination',
                //                     label: 'Pagination 分页'
                //                 }, {
                //                     value: 'badge',
                //                     label: 'Badge 标记'
                //                 }]
                //             }, {
                //                 value: 'notice',
                //                 label: 'Notice',
                //                 children: [{
                //                     value: 'alert',
                //                     label: 'Alert 警告'
                //                 }, {
                //                     value: 'loading',
                //                     label: 'Loading 加载'
                //                 }, {
                //                     value: 'message',
                //                     label: 'Message 消息提示'
                //                 }, {
                //                     value: 'message-box',
                //                     label: 'MessageBox 弹框'
                //                 }, {
                //                     value: 'notification',
                //                     label: 'Notification 通知'
                //                 }]
                //             }, {
                //                 value: 'navigation',
                //                 label: 'Navigation',
                //                 children: [{
                //                     value: 'menu',
                //                     label: 'NavMenu 导航菜单'
                //                 }, {
                //                     value: 'tabs',
                //                     label: 'Tabs 标签页'
                //                 }, {
                //                     value: 'breadcrumb',
                //                     label: 'Breadcrumb 面包屑'
                //                 }, {
                //                     value: 'dropdown',
                //                     label: 'Dropdown 下拉菜单'
                //                 }, {
                //                     value: 'steps',
                //                     label: 'Steps 步骤条'
                //                 }]
                //             }, {
                //                 value: 'others',
                //                 label: 'Others',
                //                 children: [{
                //                     value: 'dialog',
                //                     label: 'Dialog 对话框'
                //                 }, {
                //                     value: 'tooltip',
                //                     label: 'Tooltip 文字提示'
                //                 }, {
                //                     value: 'popover',
                //                     label: 'Popover 弹出框'
                //                 }, {
                //                     value: 'card',
                //                     label: 'Card 卡片'
                //                 }, {
                //                     value: 'carousel',
                //                     label: 'Carousel 走马灯'
                //                 }, {
                //                     value: 'collapse',
                //                     label: 'Collapse 折叠面板'
                //                 }]
                //             }]
                //         }, {
                //             value: 'ziyuan',
                //             label: '资源',
                //             children: [{
                //                 value: 'axure',
                //                 label: 'Axure Components'
                //             }, {
                //                 value: 'sketch',
                //                 label: 'Sketch Templates'
                //             }, {
                //                 value: 'jiaohu',
                //                 label: '组件交互文档'
                //             }]
                //         }],
                //         disabled: false,
                //         placeholder: "请选择XXX",
                //         trigger: "click", //用什么方式打开联动，click or hover
                //         is_show_levels: true, //是否显示联动的多级
                //         is_change: true, //可选择至任意一级
                //         is_filterable: true,
                //         size: "medium"
                //     },
                //     {
                //         component: "el-switch",
                //         type: "NoList",
                //         title: "开关：",
                //         default: false,
                //         disabled: false,
                //         inactive_text: "左",
                //         active_text: "右",
                //     },
                //     {
                //         component: "el-slider",
                //         type: "NoList",
                //         title: "滑块：",
                //         default: 0,
                //         disabled: false,
                //         is_show_tooltip: true, //是否显示tooltip
                //         step: 10, //可选设置每次滑动距离
                //         is_show_stops: true, //是否显示断点
                //         is_show_input: true, //是否带计数器
                //         size: "medium"
                //     },
                //     {
                //         component: "el-slider",
                //         type: "NoList",
                //         title: "滑块：",
                //         default: 0,
                //         disabled: false,
                //         is_show_tooltip: true, //是否显示tooltip
                //         is_vertical: false, //是否为竖向
                //         height: "100px", //竖向必须设置高度
                //     },
                //     {
                //         component: "el-input-number",
                //         type: "NoList",
                //         title: "计数器：",
                //         default: 1,
                //         disabled: false,
                //         min: 1,
                //         max: 100,
                //         step: 5, //设置每次点击增加或减少多少
                //         precision: 1, //允许小数点并设置成多少位
                //         size: "medium"
                //     },
                //     {
                //         component: "el-time-select",
                //         type: "NoList",
                //         title: "自定义时间：",
                //         default: "",
                //         disabled: false,
                //         placeholder: "选择时间",
                //         list: {start: '00:00', step: '00:05', end: '23:59'}, //设置开始结束以及间隔的时间
                //         size: "medium"
                //     },
                //     {
                //         component: "el-date-picker",
                //         type: "NoList",
                //         title: "日期选择器：",
                //         default: "",
                //         disabled: false,
                //         placeholder: "选择时间",
                //         list: {selectableRange: '00:00:00 - 23:59:59'},
                //         start_placeholder: "开始时间",
                //         end_placeholder: "结束时间",
                //         separator: "至",
                //         is_range: true, //是否开启日期范围选择
                //         quike: "pickerOptions1", //是否有快捷栏目
                //         size: "medium"
                //     },
                //     {
                //         component: "el-date-picker",
                //         type: "NoList",
                //         title: "月份选择器：",
                //         default: "",
                //         disabled: false,
                //         placeholder: "选择月份",
                //         types: "month",   //"week  or  month or year or date or dates 分别可选月或周或者年，默认是date日期，dates是可多选日期"
                //         size: "medium"
                //     },
                //     {
                //         component: "el-date-picker",
                //         type: "NoList",
                //         title: "双日期选择器：",
                //         default: "",
                //         disabled: false,
                //         placeholder: "日期",
                //         start_placeholder: "开始时间",
                //         end_placeholder: "结束时间",
                //         separator: "至",
                //         is_range: true, //是否开启日期范围选择
                //         quike: true, //是否有快捷栏目
                //         types: "daterange",
                //         is_unlink: true, //是否关闭联动
                //         quike: "pickerOptions2", //是否有快捷栏目
                //         size: "medium"
                //     },
                //     {
                //         component: "el-time-picker",
                //         type: "NoList",
                //         title: "时间选择器：",
                //         default: new Date(2018, 6, 10, 18, 20),
                //         disabled: false,
                //         placeholder: "选择时间",
                //         list: {selectableRange: '00:00:00 - 23:59:59'},
                //         start_placeholder: "开始时间",
                //         end_placeholder: "结束时间",
                //         separator: "至",
                //         is_range: true, //是否开启日期范围选择
                //         size: "medium"
                //     },
                // ]
            };
        },
        methods: {
            //表单的change事件
            handleChange(value) {
                // console.log(value);
            },
            //重置表单
            resetForm() {
                this.$refs["Form"].resetFields();
            },
            submit() {
                let obj = {};
                let arr = [];
                for (var i = 0; i < this.data.form_items.list.length; i++) {
                    if (this.data.form_items.list[i].required && (this.data.form_items.list[i].default == null || this.data.form_items.list[i].default == "")) {
                        arr.push(this.data.form_items.list[i].label);
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='color:red;'>[" + arr + "]</span>必填",
                            type: 'warning'
                        });
                    } else {
                        if (this.data.form_items.list[i].default !== "" && this.data.form_items.list[i].default !== null) {
                            obj[this.data.form_items.list[i].name] = this.data.form_items.list[i].default;
                        }
                    }
                }

                let para = {
                    param: this.parent_data.type,
                    data: obj
                };
                return para;
            }
        }
    };
</script>

<style>
    .zdy_input .el-select .el-input {
        width: 100px;
    }

    .zdy_input .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>