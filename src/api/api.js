import axios from '@/api/axios';

let base = BaseUrl;

// 测试生物制品的api
// export const getPlistData = params => {
//     return axios.get("http://dev2.lengwang.net/lib/interfacepiats/getmlist?ownerid=1001", {params: params});
// };

//获取配置
export const getHomeMenu = params => {
    return axios.get(`${base}` + "/init/menu/web", {timeout: 60000}).then(res => res.data);
};

//获取消息条数
export const getMessageCount = params => {
    return axios.get(`${base}` + "/init/message/check");
};

//做某些方面（比如刷新需要默默进行某些操作）使用的请求
export const getRefer = params => {
    return axios.get(`${base}` + params);
};

//公用请求
export const getCom = params => {
    return axios.get(`${base}` + params);
};

//获取列表
export const getFeatureList = params => {
    let path = params.path;
    delete params.path;
    return axios.get(`${base}` + path, {params: params});
};

//操作类
export const getFromList = params => {
    return axios.get(`${base}` + params.path + ((params.id) ? "?" + params.key + "=" + params.id : ''));
};

//提交类
export const postFormList = params => {
    return axios.post(`${base}` + params.path + ((params.param) ? "/" + params.param : "") + ((params.id) ? "?" + params.key + "=" + params.id : ''), params.data);
};

/* 大屏数据获取 */
//获取配置
export const getMenu = params => {
    return axios.get(`${base}` + "/init/menu/big", {timeout: 60000}).then(res => res.data);
};

//公用获取charts数据
export const getCharts = params => {
    return axios.get(`${base}` + params, {timeout: 60000}).then(res => res.data);
};