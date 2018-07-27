<template>
    <div :id="mapId" class="bdMap"></div>
</template>

<script>
    import {BDMap} from '@/utils/tripartite'

    export default {
        props: ["data"],
        data() {
            return {
                mapId: null,
            }
        },
        methods: {
            loadMap() {
                let _this = this;
                _this.mapId = "map" + "_" + (new Date()).valueOf() + "_" + Math.floor(Math.random() * 10000);  //用时间戳和随机数生成地图id
                // 通过utils里的BDMap.js调用百度地图API功能，加载百度地图
                BDMap().then(BMap => {
                    let map = new BMap.Map(_this.mapId);
                    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
                    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
                    map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
                    map.centerAndZoom(_this.data.center_address, _this.data.map_level);  // 初始化地图,用城市名设置地图中心点

                    let icon_width = typeof(_this.data.icon_width) != "undefined" ? _this.data.icon_width : 20;
                    let icon_height = typeof(_this.data.icon_height) !== "undefined" ? _this.data.icon_height : 20;
                    let myIcon;
                    if (_this.data.icon && _this.data.icon != '') {
                        myIcon = new BMap.Icon(_this.data.icon, new BMap.Size(icon_width, icon_height));  //自定义点
                    }
                    _this.$nextTick(() => {
                        _this.getBoundary(map, _this.data.points, myIcon);
                    });
                });
            },
            //地图区域描边
            getBoundary(map, data, myIcon) {
                let _this = this;
                var bdary = new BMap.Boundary();
                bdary.get(_this.data.center_address, function (rs) {       //获取行政区域
                    map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 3,
                            strokeColor: "#0000ff",
                            fillColor: "none"
                        }); //建立多边形覆盖物
                        map.addOverlay(ply);  //添加覆盖物
                    }
                    //加载点
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].coordinate != "") {
                            _this.addpointByStationXy(data[i], map, myIcon);
                        } else {
                            _this.addpointByStationName(data[i], map, myIcon);
                        }
                    }
                });
            },
            // getBoundary(map) {
            //     let bdary = new BMap.Boundary();
            //     bdary.get(_this.data.center_address, function (rs) {       //获取行政区域
            //         // map.clearOverlays();        //清除地图覆盖物
            //         //添加遮罩层
            //         //思路：利用行政区划点的集合与外围自定义东南西北形成一个环形遮罩层
            //         //1.获取选中行政区划边框点的集合  rs.boundaries[0]
            //         let strs = new Array();
            //         strs = rs.boundaries[0].split(";");
            //         let EN = "";    //行政区划东北段点的集合
            //         let NW = ""; //行政区划西北段点的集合
            //         let WS = ""; //行政区划西南段点的集合
            //         let SE = ""; //行政区划东南段点的集合
            //         let pt_e = strs[0]; //行政区划最东边点的经纬度
            //         let pt_n = strs[0]; //行政区划最北边点的经纬度
            //         let pt_w = strs[0]; //行政区划最西边点的经纬度
            //         let pt_s = strs[0]; //行政区划最南边点的经纬度
            //         let n1 = ""; //行政区划最东边点在点集合中的索引位置
            //         let n2 = ""; //行政区划最北边点在点集合中的索引位置
            //         let n3 = ""; //行政区划最西边点在点集合中的索引位置
            //         let n4 = ""; //行政区划最南边点在点集合中的索引位置
            //         //2.循环行政区划边框点集合找出最东南西北四个点的经纬度以及索引位置
            //         for (let n = 0; n < strs.length; n++) {
            //             let pt_e_f = parseFloat(pt_e.split(",")[0]);
            //             let pt_n_f = parseFloat(pt_n.split(",")[1]);
            //             let pt_w_f = parseFloat(pt_w.split(",")[0]);
            //             let pt_s_f = parseFloat(pt_s.split(",")[1]);
            //             let sPt = new Array();
            //             try {
            //                 sPt = strs[n].split(",");
            //                 let spt_j = parseFloat(sPt[0]);
            //                 let spt_w = parseFloat(sPt[1]);
            //                 if (pt_e_f < spt_j) {   //东
            //                     pt_e = strs[n];
            //                     pt_e_f = spt_j;
            //                     n1 = n;
            //                 }
            //                 if (pt_n_f < spt_w) {  //北
            //                     pt_n_f = spt_w;
            //                     pt_n = strs[n];
            //                     n2 = n;
            //                 }
            //                 if (pt_w_f > spt_j) {   //西
            //                     pt_w_f = spt_j;
            //                     pt_w = strs[n];
            //                     n3 = n;
            //                 }
            //                 if (pt_s_f > spt_w) {   //南
            //                     pt_s_f = spt_w;
            //                     pt_s = strs[n];
            //                     n4 = n;
            //                 }
            //             }
            //             catch (err) {
            //                 alert(err);
            //             }
            //         }
            //         //3.得出东北、西北、西南、东南四段行政区划的边框点的集合
            //         if (n1 < n2) {     //第一种情况 最东边点在索引前面
            //             for (let o = n1; o <= n2; o++) {
            //                 EN += strs[o] + ";"
            //             }
            //             //判断西北
            //             if (n2 < n3) {
            //                 for (let o = n2; o <= n3; o++) {
            //                     NW += strs[o] + ";"
            //                 }
            //             } else {
            //                 for (let o = n2; o < strs.length; o++) {
            //                     NW += strs[o] + ";"
            //                 }
            //                 for (let o = 0; o <= n3; o++) {
            //                     NW += strs[o] + ";"
            //                 }
            //             }
            //             for (let o = n3; o <= n4; o++) {
            //                 WS += strs[o] + ";"
            //             }
            //             //判断东南
            //             if (n4 < n1) {
            //                 for (let o = n4; o <= n1; o++) {
            //                     SE += strs[o] + ";"
            //                 }
            //             } else {
            //                 for (let o = n4; o < strs.length; o++) {
            //                     SE += strs[o] + ";"
            //                 }
            //                 for (let o = 0; o <= n1; o++) {
            //                     SE += strs[o] + ";"
            //                 }
            //             }
            //         }
            //         else {   //第二种情况 最东边点在索引后面
            //             for (let o = n1; o < strs.length; o++) {
            //                 EN += strs[o] + ";"
            //             }
            //             for (let o = 0; o <= n2; o++) {
            //                 EN += strs[o] + ";"
            //             }
            //             for (let o = n2; o <= n3; o++) {
            //                 NW += strs[o] + ";"
            //             }
            //             for (let o = n3; o <= n4; o++) {
            //                 WS += strs[o] + ";"
            //             }
            //             for (let o = n4; o <= n1; o++) {
            //                 SE += strs[o] + ";"
            //             }
            //         }
            //         //4.自定义外围边框点的集合
            //         let E_JW = "170.672126, 39.623555;";            //东
            //         let EN_JW = "170.672126, 81.291804;";       //东北角
            //         let N_JW = "105.913641, 81.291804;";        //北
            //         let NW_JW = "-169.604276,  81.291804;";     //西北角
            //         let W_JW = "-169.604276, 38.244136;";       //西
            //         let WS_JW = "-169.604276, -68.045308;";     //西南角
            //         let S_JW = "114.15563, -68.045308;";            //南
            //         let SE_JW = "170.672126, -68.045308 ;";         //东南角
            //         //4.添加环形遮罩层
            //         let ply1 = new BMap.Polygon(EN + NW + WS + SE + E_JW + SE_JW + S_JW + WS_JW + W_JW + NW_JW + EN_JW + E_JW,
            //             {strokeColor: "none", fillColor: "none", strokeOpacity: 0.8, fillOpacity: 0.8}); //建立多边形覆盖物
            //         map.addOverlay(ply1);  //遮罩物是半透明的，如果需要纯色可以多添加几层
            //         //5. 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
            //         let ply = new BMap.Polygon(rs.boundaries[0], {
            //             strokeWeight: 3,
            //             strokeColor: "#0000ff",
            //             fillColor: ""
            //         });
            //         map.addOverlay(ply);
            //         // map.setViewport(ply.getPath());    //调整视野
            //     });
            // },
            //根据坐标加载点
            //根据坐标轴加载点
            addpointByStationXy(data, map, myIcon) {
                let _this = this;
                let marker = new BMap.Marker(new BMap.Point(data["baidu_y"], data["baidu_x"]), {icon: myIcon});
                // let a_infoWindow = new BMap.InfoWindow('<b class="cursor_pointer" onclick="markerclick(' + data["name"] + ",'" + data["url"] + "'" + ')" style="font-size:14px;">' + data["name"] + '</b><br><p>' + data["address"] + '.');
                let a_infoWindow = new BMap.InfoWindow('<b class="cursor_pointer">' + data["name"] + '</b><br><p>' + data["address"] + '.');
                marker.addEventListener("click", function () {
                    this.openInfoWindow(a_infoWindow);
                    _this.$emit("marker_click", data["name"], data["url"]);
                });
                map.addOverlay(marker);
                marker.setAnimation(BMAP_ANIMATION_DROP); //设置点的动画,在addOverlay之后加载
            },
            // 根据name加载点
            addpointByStationName(data, map, myIcon) {
                let _this = this;
                let keyword = data["full_name"] + data["address"] + data["name"];
                let localSearch = new BMap.LocalSearch(map);
                localSearch.setSearchCompleteCallback(function (searchResult2, x) {
                    let a_poi = searchResult2.getPoi(0);
                    let a_marker;
                    if (typeof(a_poi) == 'undefined') return;
                    a_marker = new BMap.Marker(new BMap.Point(a_poi.point.lng, a_poi.point.lat), {icon: myIcon});  // 创建标注，为要查询的地方对应的经纬度
                    map.addOverlay(a_marker);
                    a_marker.setAnimation(BMAP_ANIMATION_DROP); //设置点的动画,在addOverlay之后加载
                    // let info = '<b class="cursor_pointer" onclick="markerclick(' + data["name"] + ",'" + data["url"] + "'" + ')">' + data["name"] + '</b><br><p>' + data["address"] + '.';
                    let info = '<b class="cursor_pointer">' + data["name"] + '</b><br><p>' + data["address"] + '.';
                    let a_infoWindow = new BMap.InfoWindow(info);
                    a_marker.addEventListener("click", function (e) {
                        this.openInfoWindow(a_infoWindow);
                        _this.$emit("marker_click", data["name"], data["url"]);
                    });
                });
                localSearch.search(keyword);
            }
        },
        created() {
            let _this = this;
            _this.$nextTick(() => {
                _this.loadMap();
            });
            //地图标注打开的infoWindow弹窗的title的点击事件
            // window.markerclick = function (name, url) {
            //     要执行的方法
            // }
        },
        watch: {
            "data": function () {
                this.loadMap();
            }
        }
    }
</script>

<style lang="scss">
    .bdMap {
        width: 100%;
        height: 100%;
    }

    .bdMap .cursor_pointer {
        color: #409EFF;
        cursor: pointer;
    }
</style>
