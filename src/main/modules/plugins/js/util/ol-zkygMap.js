/**
 * ol3以上版本，集成对外API服务图层封装工具
 * @author 龚正坤
 * @version 1.0.0
 * @description 集成对外API服务图层封装工具
 */

var zkygMap = {};   // 封装工具根命名空间
zkygMap.base = {};  // 基本参数，一般不建议修改
zkygMap.default = {};  // 默认参数，可以安全修改
zkygMap.util = {};  // 工具方法
zkygMap.apiInfoUtil = {};  // API信息处理方法
zkygMap.layer = {}; // 图层构建方法

zkygMap.default.viewProjCode = 'EPSG:3857';    // 地图视图默认坐标系，EPSG:4326|EPSG:3857
zkygMap.default.layerAttributions = 'Data © <a target="_blank" href="http://www.chinarsgeo.com/">中科遥感科技集团有限公司</a>'; // 图层默认属性
zkygMap.default.wmtsRequestEncoding = 'KVP';   // wmts服务默认请求编码方式，KVP|REST
zkygMap.default.resnumSeparator = ',';   // 分辨率范围（缩放层级范围）resnum参数的分隔符
zkygMap.default.map = undefined;    // 可以通过维护这个参数指向地图，WMS查询功能会自动向地图上注册查询事件（getFeatureInfoCallback参数则执行执行查询请求，否则getGetFeatureInfoUrlHandle只构建查询URL，不执行查询请求）
zkygMap.default.getFeatureInfoFormats = 'application/json';   // getFeatureInfo查询请求默认响应格式，text/plain|application/vnd.ogc.gml|application/vnd.ogc.gml/3.1.1|text/html|application/json|text/javascript
zkygMap.default.getFeatureInfoEvent = 'singleclick';    // 默认地图上触发getFeatureInfo查询的ol地图事件名称
zkygMap.default.getFeatureInfoFeatureCount = 1; // 默认getFeatureInfo查询请求最多返回要素数量限制
zkygMap.default.getFeatureInfoPointerMoveCursor = 'pointer';    // 开启getFeatureInfo查询功能后，设置监测图层非透明地方的鼠标样式

// 令牌定时维护池，关键字是令牌请求地址，值是对应的周期调用函数setInterval返回的ID
zkygMap.base.tokenPool = {};
// 认证授权，授权类型对应的参数关键字
zkygMap.base.authKey = {
    'key': 'ak',    // 密钥型认证授权的参数关键字
    'token': 'token'    // 令牌型认证授权的参数关键字
};

// GeoServer坐标系默认对应瓦片矩阵集标识
zkygMap.base.geoserverDefaultTileMatrixSet = {
    "EPSG:4326": "EPSG:4326",
    "EPSG:3857": "EPSG:900913",
    "EPSG:900913": "EPSG:900913"
};
// 瓦片矩阵起算原点
zkygMap.base.origin = {
    "EPSG:4326": [-180, 90],
    "EPSG:3857": [-20037508.3428, 20037508.3428]
};
// 坐标系地理范围
zkygMap.base.projExtent = {
    "EPSG:4326": [-180, -90, 180, 90],
    "EPSG:3857": [-20037508.3428, -20037508.3428, 20037508.3428, 20037508.3428]
};
 // 计算分辨率数组时的起始分辨率
zkygMap.base.calcResBegin = {
    "EPSG:4326": 1.40625, // wmts中对应level '00'，0.703125*2
    "EPSG:3857": 156543.03392804097 // wmts中对应level '00'
};
// 计算比例尺分母数组时的起始比例尺分母
zkygMap.base.calcScaleDenominatorBegin = {
    "EPSG:4326": 295829355.455*2, // wmts中对应level '00'，DPI=96
    "EPSG:3857": 295829355.455*2 // wmts中对应level '00'，DPI=96
};
 // 基本分辨率数组
zkygMap.base.resll = [0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.0003433227539062,0.0001716613769531,0.0000858306884766,0.0000429153442383,0.0000214576721191,0.0000107288360596,0.0000053644180298,0.0000026822090149,0.0000013411045074,0.0000006705522537,0.0000003352761269];
zkygMap.base.resmc = [156543.03392804097,78271.51696402048,39135.75848201024,19567.87924100512,9783.93962050256,4891.96981025128,2445.98490512564,1222.99245256282,611.49622628141,305.748113140705,152.8740565703525,76.43702828517625,38.21851414258813,19.109257071294063,9.554628535647032,4.777314267823516,2.388657133911758,1.194328566955879,0.5971642834779395,0.29858214173896974];
zkygMap.base.projCode2BaseResMap =  {
    "c": zkygMap.base.resll.slice(0, 18),   // 0-17
    "EPSG:4326": zkygMap.base.resll.slice(0, 18),   // 0-18
    "w": zkygMap.base.resmc.slice(1, 19),   // 1-18
    "EPSG:3857": zkygMap.base.resmc,    // 0-19
    "EPSG:900913": zkygMap.base.resmc    // 0-19
};
// 天地图资源类型与默认标题映射关系
zkygMap.base.tdtType2TitleMap = {
	//以_c结尾的为wgs84坐标系投影（经纬度）,以_w结尾的为球面墨卡托投影坐标系
    "vec_c": "街道地图_WGS84",
    "img_c": "影像地图_WGS84",
    "ter_c": "地形地图_WGS84",
    "cva_c": "中文标注_WGS84",
    "eva_c": "英文标注_WGS84",
    "cia_c": "影像中文标注_WGS84",
    "eia_c": "影像英文标注_WGS84",
    "cta_c": "地形中文标注_WGS84",
    "vec_w": "街道地图_Web墨卡托",
    "img_w": "影像地图_Web墨卡托",
    "ter_w": "地形地图_Web墨卡托",
    "cva_w": "中文标注_Web墨卡托",
    "eva_w": "英文标注_Web墨卡托",
    "cia_w": "影像中文标注_Web墨卡托",
    "eia_w": "影像英文标注_Web墨卡托",
    "cta_w": "地形中文标注_Web墨卡托"
};

/**
 * 数组查找
 * @param {Array.<VALUE>} arr - 需要执行搜索的数组
 * @param {function(VALUE, number, ?) : boolean} func - 相等判断函数
 * @param {boolean|undefined} [isReturnIndex=false] - 是否返回索引，默认范围值
 * @template VALUE
 * @return {number|VALUE} - 搜索结果索引（无时返回-1）或元素（无时返回null）
 */
zkygMap.util.arrFind = function (arr, func, isReturnIndex) {
    var length = arr.length >>> 0;
    var value;
    for (var i = 0; i < length; i++) {
        value = arr[i];
        if (func(value, i, arr)) {
            return isReturnIndex ? i : value;
        }
    }
    return isReturnIndex ? -1 : null;
};

/**
 * 将字符串转换成字符串数组，自动去掉首尾的中括号
 * @param {string} str - 源字符串
 * @param {string|undefined} [separator=','] - 分隔符
 * @return {string[]} - 结果字符串数组
 */
zkygMap.util.string2StringArr = function(str, separator){
    if(typeof(str) !== 'string') return str;
    var strArr = str;
    separator = separator || ',';
    if(strArr[0] === '['){ // 去掉首尾的中括号
        strArr = strArr.slice(1, strArr.length-1);
    }
    if(separator === ' '){
        strArr = strArr.split(separator);
    }else{
        strArr = strArr.replace(/ /gm, '').split(separator);
    }
    return strArr;
};
/**
 * 将字符串转换成整数数组，自动去掉首尾的中括号
 * @param {string} str - 源字符串
 * @param {string|undefined} [separator=','] - 分隔符
 * @return {number[]} - 结果整数数组
 */
zkygMap.util.string2IntArr = function(str, separator){
    if(typeof(str) !== 'string') return str;
    var strArr = str;
    separator = separator || ',';
    if(strArr[0] === '['){ // 去掉首尾的中括号
        strArr = strArr.slice(1, strArr.length-1);
    }
    if(separator === ' '){
        strArr = strArr.split(separator);
    }else{
        strArr = strArr.replace(/ /gm, '').split(separator);
    }
    for(var i=strArr.length; i--;){
        strArr[i] = parseInt(strArr[i]);
    }
    return strArr;
};
/**
 * 将字符串转换成浮点数组，自动去掉首尾的中括号
 * @param {string} str - 源字符串
 * @param {string|undefined} [separator=','] - 分隔符
 * @return {double[]} - 结果浮点数组
 */
zkygMap.util.string2FloatArr = function(str, separator){
    if(typeof(str) !== 'string') return str;
    var strArr = str;
    separator = separator || ',';
    if(strArr[0] === '['){ // 去掉首尾的中括号
        strArr = strArr.slice(1, strArr.length-1);
    }
    if(separator === ' '){
        strArr = strArr.split(separator);
    }else{
        strArr = strArr.replace(/ /gm, '').split(separator);
    }
    for(var i=strArr.length; i--;){
        strArr[i] = parseFloat(strArr[i]);
    }
    return strArr;
};

/**
 * 将ol要素数组或几何对象数据进行重投影
 * @param {ol.Feature[]|ol.Feature|ol.geom.Geometry[]|ol.geom.Geometry} features - 源要素或源几何对象或其数组
 * @param {ol.ProjectionLike} srcProj - 源要素或源几何对象坐标系
 * @param {ol.ProjectionLike} destProj - 目标坐标系
 * @return {ol.Feature[]|ol.geom.Geometry[]} - 重投影后的要素或几何对象数组
 */
zkygMap.util.reProjFeatures = function(features, srcProj, destProj){
    if(!features || !srcProj || !destProj) return features;
    if(features instanceof ol.Feature || features instanceof ol.geom.Geometry){
        features = [features];
    }
    if(features instanceof Array && srcProj !== destProj){
        for(var i=features.length; i--;){
            var feature = features[i];
            if(feature instanceof ol.Feature){
                feature.setGeometry(feature.getGeometry().transform(srcProj, destProj));
            }else if(feature instanceof ol.geom.Geometry){
                feature = feature.transform(srcProj, destProj)
            }
        }
    }
    return features;
}

/**
 * 将对象转换成查询字符串参数形式
 * @param {Object} obj - 对象
 * @returns {string} - 转换结果字符串
 */
zkygMap.util.obj2StrForAjaxParams = function(obj) {
    if (typeof(obj) === "object") {
        var arr = [];
        for (var i in obj){
            var str = i + "=" + obj[i];
            arr.push(str);
        }
        obj = encodeURI(arr.join("&"));
    }
    return obj;
}
/**
 * 扩展且覆盖已存在的属性
 * @description 拷贝source的所有属性到destination；
 *              source中值为undefined的属性不会拷贝到destination；
 *              会覆盖destination已有的同名属性。
 */
zkygMap.util.extend = function(destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;
        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
/**
 * 扩展且不会发生覆盖
 * @description 拷贝from中所有在to中不存在的属性到to中，属性需要满足下面的条件：
 *              to[key] === undefined 或者
 *              from不是window.Event且key是from本身的属性且key不是to本身的属性。
 */
zkygMap.util.applyDefaults = function (to, from) {
    to = to || {};
    var fromIsEvt = typeof window.Event == "function"
                    && from instanceof window.Event;

    for (var key in from) {
        if (to[key] === undefined ||
            (!fromIsEvt && from.hasOwnProperty
             && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
            to[key] = from[key];
        }
    }
    if(!fromIsEvt && from && from.hasOwnProperty
       && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
        to.toString = from.toString;
    }
    return to;
};
/**
 * ajax请求封装
 * @param {Object} obj - ajax请求数据
 * @param {string} obj.url - 请求地址
 * @param {string|undefined} [obj.type=GET] - 请求方式，GET|POST，大小写无关
 * @param {string|undefined} [obj.async=true] - 是否使用异步请求
 * @param {string|undefined} [obj.dataType=HTML] - 期望的响应数据类型，HTML|text|XML|JSON|JSONP，大小写无关
 * @param {Object|undefined} [obj.data=null] - 传输的数据对象
 * @param {Function|undefined} [obj.beforeSend] - 请求发送前的回调函数，用来修改请求发送前ajax请求对象，在beforeSend函数中返回false将取消这个请求，functuon(ajax){}
 * @param {Function|undefined} [obj.success] - 请求成功回调方法，参数是响应文本，functuon(data){}
 * @param {Function|undefined} [obj.error] - 请求失败回调方法，参数是响应状态和响应文本，functuon(status, responseText){}
 */
zkygMap.util.ajax = function(obj) {
    if(!obj || !obj.url) return undefined;
    obj.type = obj.type === undefined ? 'GET' : obj.type.toUpperCase();   // 提交方式，默认为"GET"
    obj.async = obj.async === undefined ? true : obj.async; // 是否异步，默认为true(异步)
    obj.dataType = obj.dataType === undefined ? 'HTML' : obj.dataType.toUpperCase();    // 期望的响应数据类型
    obj.data = obj.data || null;    // 传输的数据
    
    if (window.XMLHttpRequest) {//非IE和IE9以上
        var ajax = new XMLHttpRequest();
    } else {//IE6-IE8
        var ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if(obj.dataType === 'JSONP'){   // JSONP类型
        if (typeof(obj.beforeSend) === 'function' && !obj.beforeSend(ajax)) return undefined; // 请求发送前的回调函数
        var callbackName = ('jsonp_' + Math.random()).replace(".", "");
        var oHead = document.getElementsByTagName('head')[0];
        obj.data = obj.data || {};    // 传输的数据
        obj.data.callback = callbackName;
        var ele = document.createElement('script');
        ele.type = "text/javascript";
        ele.onerror = function () {
            if (typeof(obj.error) === 'function') {
                obj.error(ajax, undefined, '请求失败');
            }
        };
        oHead.appendChild(ele);
        window[callbackName] = function (jsonData) {
            oHead.removeChild(ele);
            window[callbackName] = null;
            if (typeof(obj.success) === 'function') {
                obj.success(jsonData, 200, ajax);
            }
        };
        obj.data = zkygMap.util.obj2StrForAjaxParams(obj.data);
        obj.url += (obj.url.lastIndexOf('?') === -1 ? '?' : '&') + obj.data;
        ele.src = obj.url;
        return ajax;
    } else if (obj.type == "POST") {   // POST请求
        ajax.open(obj.type, obj.url, obj.async);
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        if (typeof(obj.beforeSend) === 'function' && !obj.beforeSend(ajax)) return undefined; // 请求发送前的回调函数
        ajax.send(obj.data);
    } else {    // GET请求
        if(obj.data){
            obj.data = zkygMap.util.obj2StrForAjaxParams(obj.data);
            obj.url += (obj.url.lastIndexOf('?') === -1 ? '?' : '&') + obj.data;
        }
        ajax.open(obj.type, obj.url, obj.async);
        if (typeof(obj.beforeSend) === 'function' && !obj.beforeSend(ajax)) return undefined; // 请求发送前的回调函数
        ajax.send();
    }
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) { // 完成响应数据接收
            if (ajax.status >= 200 && ajax.status < 300 || ajax.status == 304) {
                var data = undefined;
                if (obj.dataType === 'JSON') {
                    try {
                        if(ajax.responseText){
                            data = eval('(' + ajax.responseText + ')');
                        }
                    } catch (e) {
                        if (typeof(obj.error) === 'function') {
                            obj.error(ajax, ajax.status, '返回的json格式不正确');
                        }
                    }
                } else if (obj.dataType === 'XML') {
                    data = ajax.responseXML;
                } else {
                    data = ajax.responseText;
                }

                if (typeof(obj.success) === 'function') {
                    obj.success(data, ajax.status, ajax);
                }
            } else {
                if (typeof(obj.error) === 'function') {
                    obj.error(ajax, ajax.status, ajax.responseText);
                }
            }
        }
    }
    return ajax;
};

/**
* 根据瓦片矩阵集标识获取坐标系标识代码、坐标系四至范围、瓦片矩阵原点、瓦片矩阵标识数组、分辨率数据和比例尺分母数组等信息
* @param {string|undefined} [matrixSet=mc] - 瓦片矩阵集标识
* @param {boolean|undefined} [filter00For4326=true] - 是否过滤掉4326坐标的'00'的tileMatrix（'00'层实际没有数据，可以选择过滤掉）
* @returns {Object} lods
*          {string} lods.projCode - 坐标系标识代码
*          {double[]} lods.projExtent - 坐标系四至范围
*          {double[]} lods.origin - 瓦片矩阵原点
*          {string[]} lods.matrixIds - 瓦片矩阵标识数组
*          {double[]} lods.resolutions - 分辨率数组
*          {double[]} lods.scaleDenominators - 比例尺分母数组
*/
zkygMap.apiInfoUtil.getLodsInfo = function(matrixSet, filter00For4326){
    matrixSet = matrixSet || 'mc';
    if(filter00For4326 == undefined) filter00For4326 = true;

    var srsi = matrixSet.slice(0, 2);  // 坐标标识，这里ll表示4326（WGS84），mc表示3857（Web墨卡托）
    var endIndex = matrixSet.slice(2)|0;  // 瓦片矩阵标识最大层级索引
    if (endIndex === 0) {
        endIndex = srsi == 'll' ? 18 : 19; // ll 相当于 ll18 ， mc 相当于 mc19
    }
    var projCode = 'EPSG:3857';
    // 3857，level ['00','01',...,endIndex]
    // 4326不过滤'00'的tileMatrix时，++endIndex后，level ['00','01','02',...,endIndex]
    // 4326过滤'00'的tileMatrix时，level ['01','02',...,endIndex,endIndex+1]
    if (srsi == 'll') {
        projCode = 'EPSG:4326';
        if (!filter00For4326) { // 不过滤4326的'00'的tileMatrix时，level ['00','01','02',...,endIndex]
            endIndex = endIndex + 1;
        }
    }
    var projExtent = zkygMap.base.projExtent[projCode];
    var topLeftCorner = zkygMap.base.origin[projCode];
    var res0 = zkygMap.base.calcResBegin[projCode]; // level '00'
    var scale0 = zkygMap.base.calcScaleDenominatorBegin[projCode];  // level '00'

    var matrixIdArr = [], resArr = [], scaleDenominatorArr = [];

    for(var i=0; i <= endIndex; i++){
        var tileMatrix = i;  //瓦片矩阵标识，代表一个缩放层级，level ['00','01',...,endIndex]
        // 4326坐标的'00'的tileMatrix实际没有数据，可以过滤掉(可选)
        // 过滤掉4326的'00'的tileMatrix ---start
        if (srsi == 'll' && filter00For4326) { // 4326不使用'00'的tileMatrix时，level ['01','02',...,endIndex,endIndex+1]
            tileMatrix = tileMatrix + 1;
        }
        // 过滤掉4326的'00'的tileMatrix ---end
        resArr.push(res0 / Math.pow(2, tileMatrix));  // 分辨率
        scaleDenominatorArr.push(scale0 / Math.pow(2, tileMatrix));    // 比例尺分母
        matrixIdArr.push(
            tileMatrix<10 ? '0'+tileMatrix : ''+tileMatrix  // 瓦片矩阵标识
        );
    }
    return {
        projCode: projCode,
        projExtent: projExtent,
        origin: topLeftCorner,
        matrixIds: matrixIdArr,
        resolutions: resArr,
        scaleDenominators: scaleDenominatorArr
    };
};

/**
 * 根据API服务参数获取坐标系标识代码、坐标系四至范围、瓦片矩阵原点、瓦片矩阵标识数组、分辨率数据和比例尺分母数组等信息
 * @description 如果参数里面有matrixIds和resolutions信息，则直接从参数里面读取，如果没有则根据resnum计算
 * @param {Object} layerParams - API服务参数
 * @returns {Object} lods
 *          {string} lods.projCode - 坐标系标识代码
 *          {double[]} lods.projExtent - 坐标系四至范围
 *          {double[]} lods.origin - 瓦片矩阵原点
 *          {string[]} lods.matrixIds - 瓦片矩阵标识数组
 *          {double[]} lods.resolutions - 分辨率数组
 *          {double[]} lods.scaleDenominators - 比例尺分母数组
 */
zkygMap.apiInfoUtil.getLodsInfoForGwc = function(layerParams){
    layerParams.strProj = layerParams.strProj || 'EPSG:3857';
    var matrixSet = layerParams.matrixSet || (layerParams.serverType === 'gwc' ? layerParams.strProj+"_"+layerParams.layers :  zkygMap.base.geoserverDefaultTileMatrixSet[layerParams.strProj]);
    if(matrixSet == null) return null;
    layerParams.matrixSet = matrixSet;
    var projExtent = zkygMap.base.projExtent[layerParams.strProj];
    var topLeftCorner = zkygMap.util.string2FloatArr(layerParams.origin) || zkygMap.base.origin[layerParams.strProj];
    var matrixIds = [];
    var resolutions = [];
    var scaleDenominatorArr = [];
    if(layerParams.matrixIds && layerParams.resolutions){
        matrixIds = zkygMap.util.string2StringArr(layerParams.matrixIds);
        resolutions = zkygMap.util.string2FloatArr(layerParams.resolutions);
        scaleDenominatorArr = zkygMap.util.string2FloatArr(layerParams.scaleDenominators);
    }else{
        var resnums = zkygMap.util.string2IntArr(layerParams.resnum, zkygMap.default.resnumSeparator);
        var levels = resnums[1] - resnums[0] + 1;
        if(levels == 0) return null;
        var res0 = zkygMap.base.calcResBegin[layerParams.strProj]; // // zoom -1 : zoom 0
        var scale0 = zkygMap.base.calcScaleDenominatorBegin[layerParams.strProj]; // zoom -1 : zoom 0
        var minZoom = +resnums[0];
        var maxZoom = +resnums[1];
        var zoomOffset = layerParams.strProj == 'EPSG:4326' ? 1 : 0;
        for(var i=minZoom; i<=maxZoom; ++i){
            var zoom = i + zoomOffset;
            matrixIds.push(matrixSet+":" + (i-minZoom));
            resolutions.push(res0 / Math.pow(2, zoom));  // 分辨率
            scaleDenominatorArr.push(scale0 / Math.pow(2, zoom));    // 比例尺分母
        }
    }
	return {
        projCode: layerParams.strProj,
        projExtent: projExtent,
        origin: topLeftCorner,
        matrixIds: matrixIds,
        resolutions: resolutions,
        scaleDenominators: scaleDenominatorArr
    };
}

/**
 * 计算分辨率数组
 * @param {string|undefined} [projCode=EPSG:3857] - 坐标系代码，如EPSG:4326，EPSG:3857，默认与OL一致
 * @param {number|undefined} [minZoom=0] - 最小缩放层级，默认与OL一致
 * @param {number|undefined} [maxZoom=19|18] - 最大缩放层级，默认与OL兼容
 * @param {number|undefined} [zoomFactor=2] - 相邻分辨率计算因子，默认与OL兼容
 * @param {number|undefined} [res0=156543.03392804097|1.40625] - 起算分辨率，默认与OL兼容
 * @returns {double[]} - 返回分辨率数组
 */
zkygMap.apiInfoUtil.calcResolutions = function(projCode, minZoom, maxZoom, zoomFactor, res0){
    minZoom = minZoom|0;
    maxZoom = maxZoom|0;
    projCode = projCode || 'EPSG:3857';
    if (maxZoom === 0) {
        maxZoom = projCode == 'EPSG:4326' ? 18 : 19; // 4326 相当于zoom 0-18 ， 3857 相当于zoom 0-19
    }
    zoomFactor = zoomFactor || 2;
    var zoomOffset = 0;
    if(res0 == undefined){
        // ol中，默认情况，EPSG:4326坐标系下，zoom=0时，分辨率为1.40625/2，所以这里需要进行zoomOffset
        var res0 = zkygMap.base.calcResBegin[projCode]; // zoom -1 : zoom 0
        zoomOffset = projCode == 'EPSG:4326' ? 1 : 0;
    }
    var resolutions = [];
    for(var i=minZoom; i <= maxZoom; i++){
        var zoom = i + zoomOffset;
        resolutions.push(res0 / Math.pow(2, zoom));  // 分辨率
    }
    return resolutions;
};

/**
 * 获取图层分辨率数组，先resolutions参数，不然考虑根据resnum和坐标系生成，不然考虑根据matrixSet生成，最后按坐标系生成
 * @param {Object} layerParams 
 * @param {boolean|undefined} [filter00For4326=true]
 * @returns {double[]} - 返回分辨率数组
 */
zkygMap.apiInfoUtil.getResArr = function(layerParams, filter00For4326){
    var projCode = layerParams.strProj || 'EPSG:3857';
    var resolutions = layerParams.resolutions;
    if(resolutions){
        return zkygMap.util.string2FloatArr(resolutions);
    }else if(layerParams.resnum){
        var resnums = zkygMap.util.string2IntArr(layerParams.resnum, zkygMap.default.resnumSeparator);
        return zkygMap.apiInfoUtil.calcResolutions(projCode, +resnums[0], +resnums[1]);
    }
    if(layerParams.matrixSet){
        var lodsInfo = zkygMap.apiInfoUtil.getLodsInfo(layerParams.matrixSet, filter00For4326);
        return lodsInfo.resolutions;
    }
    return zkygMap.apiInfoUtil.calcResolutions(projCode);
};

/**
 * 根据图层参数获取地理范围（包括坐标系的地理范围和图层的地理范围）
 * @param {Object} layerParams - 图层服务参数
 * @returns {Object} - 返回{layerExtent,projExtent}
 */
zkygMap.apiInfoUtil.getExtent = function(layerParams){
    layerParams.strProj = layerParams.strProj || 'EPSG:3857';
    var maxExtent = zkygMap.base.projExtent[layerParams.strProj];
	var extent = layerParams.strExtent;
	if(!extent){
		extent = maxExtent;
	}else{
		extent = zkygMap.util.string2FloatArr(extent);
    }
    return {
        layerExtent: extent,    // 图层的地理范围
        projExtent: maxExtent   // 坐标系的地理范围
    };
};

/**
 * 根据图层参数获取指定类型的瓦片格网信息
 * @param {Object} layerParams - 图层服务参数
 * @param {string|undefined} [type=wms] - 类型，wms|wmts|tdt
 * @returns {Object} - 返回一个指定类型对应的瓦片格网信息对象
 */
zkygMap.apiInfoUtil.getTileGridInfo = function(layerParams, type){
    type = type || 'wms';
    var tileGridInfo = {};
    if(type == 'wmts'){ // WMTS
        var lodsInfo = null;
        if(layerParams.serverType === 'gwc' || layerParams.serverType === 'geoserver'){
            lodsInfo = zkygMap.apiInfoUtil.getLodsInfoForGwc(layerParams);
            tileGridInfo.origin = lodsInfo.origin;
            tileGridInfo.resolutions = lodsInfo.resolutions;
            tileGridInfo.matrixIds = lodsInfo.matrixIds;
        }else{  // 对外API
            var tileMatrixSet = layerParams.matrixSet;
            if(!tileMatrixSet){
                if(layerParams.strProj && layerParams.resnum){
                    tileMatrixSet =  layerParams.strProj === 'EPSG:3857' ? 'mc' : 'll';
                    var resnums = zkygMap.util.string2IntArr(layerParams.resnum, zkygMap.default.resnumSeparator);
                    if(resnums.length > 1){
                        var endZoom = +resnums[1];
                        tileMatrixSet = tileMatrixSet + (endZoom < 10 ? '0'+endZoom : ''+endZoom);
                    }
                }else{
                    tileMatrixSet =  'mc';
                }
            }
            layerParams.matrixSet = tileMatrixSet;
            lodsInfo = zkygMap.apiInfoUtil.getLodsInfo(layerParams.matrixSet);     // lods信息
            layerParams.strProj = layerParams.strProj || lodsInfo.projCode;
            tileGridInfo.origin = zkygMap.util.string2FloatArr(layerParams.origin) || lodsInfo.origin;
            if(layerParams.resolutions && layerParams.matrixIds){
                tileGridInfo.resolutions = zkygMap.util.string2FloatArr(layerParams.resolutions);
                tileGridInfo.matrixIds = zkygMap.util.string2StringArr(layerParams.matrixIds)
            }else{
                tileGridInfo.resolutions = lodsInfo.resolutions;
                tileGridInfo.matrixIds = lodsInfo.matrixIds;   
            }
        }
        tileGridInfo.extent = zkygMap.apiInfoUtil.getExtent(layerParams).layerExtent;	// 瓦片范围，此范围外面不会请求瓦片
    }else if(type == 'tdt'){    // 天地图资源
        var matrixSet = layerParams;
        var projCode = matrixSet=="c" ? "EPSG:4326" : "EPSG:3857";
        // var units = matrixSet=="c" ? "degrees" : "m";
        tileGridInfo.extent = zkygMap.base.projExtent[projCode];
        tileGridInfo.origin = zkygMap.base.origin[projCode];
        tileGridInfo.resolutions = zkygMap.base.projCode2BaseResMap[matrixSet];
        // var sIndex = matrixSet=="c" ? 0 : 1;
        // tileGridInfo.resolutions = zkygMap.apiInfoUtil.calcResolutions(projCode, sIndex, 17+sIndex);
        var matrixIds = [];
        for (var i=1; i<19; ++i) {
            matrixIds[i-1] = ""+i;  // ['1','2',...,'18']
        }
        tileGridInfo.matrixIds = matrixIds;
    }else{  // WMS
        layerParams.strProj = layerParams.strProj || 'EPSG:3857';
        tileGridInfo.extent = zkygMap.apiInfoUtil.getExtent(layerParams).layerExtent;	// 瓦片范围，此范围外面不会请求瓦片
        tileGridInfo.origin = zkygMap.util.string2FloatArr(layerParams.origin) || zkygMap.base.origin[layerParams.strProj]; // 瓦片起算原点，瓦片矩阵原点
        tileGridInfo.resolutions = zkygMap.apiInfoUtil.getResArr(layerParams);  // 分辨率数组，一个分辨率对应一个缩放层级
    }
    return tileGridInfo;
}

/**
 * 异步获取令牌，并处理
 * @param {string} url - 令牌请求地址
 * @param {Object|undefined} [layerParams] - API参数对象
 * @param {number|undefined} [maxTry=3] - 最大尝试请求次数（包括首次请求），默认三次
 * @param {boolean|undefined} [isMaintainHistory=false] - 是否维护关联的图层
 * @param {Function|undefined} [callbacks] - 请求成功或最大尝试请求次数失败后回调方法
 * @private
 */
zkygMap.layer._getToken = function(url, layerParams, maxTry, isMaintainHistory, callbacks){
    if(url){
        if(maxTry === undefined || maxTry === null) maxTry = 3;
        zkygMap.util.ajax({
            dataType: 'json',
            url: url,
            success: function(data, textStatus, ajax){
                if(data && data['token']){
                    if(layerParams) layerParams.authInfo.value = data['token'];
                    if(isMaintainHistory){ // 需要维护历史关联信息
                        zkygMap.base.tokenPool = zkygMap.base.tokenPool || {};
                        var maintainPool = zkygMap.base.tokenPool[url];
                        if(maintainPool){
                            if(layerParams) maintainPool['key'] = layerParams.authInfo.key;
                            maintainPool['value'] = data['token'];
                            var layersParams = maintainPool['layersParams'] || [];
                            var len = layersParams.length;
                            var id = maintainPool['setIntervalId'];
                            if(len === 0 && id){
                                clearInterval(id);
                                zkygMap.base.tokenPool[url] = undefined;
                                delete zkygMap.base.tokenPool[url];
                            }
                            var isUsed = false;
                            for (var i = len; i--; ) {
                                var params = layersParams[i];
                                if(params){
                                    isUsed = true;
                                    params.authInfo.value = data['token'];
                                }
                            }
                            if(!isUsed && id){
                                clearInterval(id);
                                zkygMap.base.tokenPool[url] = undefined;
                                delete zkygMap.base.tokenPool[url];
                            }
                        }
                    }
                }else{
                    console.error('获取令牌为空');
                    if(isMaintainHistory){ // 需要维护历史关联图层
                        zkygMap.base.tokenPool = zkygMap.base.tokenPool || {};
                        var maintainPool = zkygMap.base.tokenPool[url];
                        if(maintainPool){
                            var layersParams = maintainPool['layersParams'] || [];
                            var id = maintainPool['setIntervalId'];
                            if(layersParams.length === 0 && id){
                                clearInterval(id);
                                zkygMap.base.tokenPool[url] = undefined;
                                delete zkygMap.base.tokenPool[url];
                            }
                        }
                    }
                }
                if(typeof(callbacks) === 'function'){
                    callbacks(data);
                }
                ajax = null;
            },
            error: function(ajax, textStatus, responseText){
                if(maxTry--){
                    zkygMap.layer._getToken(url, layerParams, maxTry, isMaintainHistory, callbacks);
                }else{
                    if(isMaintainHistory){ // 需要维护历史关联图层
                        zkygMap.base.tokenPool = zkygMap.base.tokenPool || {};
                        var maintainPool = zkygMap.base.tokenPool[url];
                        if(maintainPool){
                            var layersParams = maintainPool['layersParams'] || [];
                            var id = maintainPool['setIntervalId'];
                            if(layersParams.length === 0 && id){
                                clearInterval(id);
                                zkygMap.base.tokenPool[url] = undefined;
                                delete zkygMap.base.tokenPool[url];
                            }
                        }
                    }
                    if(typeof(callbacks) === 'function'){
                        callbacks();
                    }
                    console.error('令牌请求出错, textStatus:'+textStatus+', responseText:'+responseText);
                }
                ajax = null;
            }
        });
    }
};
/**
 * 维护令牌
 * @param {Object} layerParams - API资源参数对象
 * @param {boolean|undefined} [procFirstToken=true] - 是否首次请求令牌
 */
zkygMap.layer.maintainToken = function(layerParams, procFirstToken){
    if(!layerParams || !layerParams.authInfo || layerParams.authInfo.type !== 'token' || !layerParams.authInfo.tokenUrl || !layerParams.authInfo.user || !layerParams.authInfo.pwd) return;
    if(procFirstToken === undefined) procFirstToken = true;
    var tokenUrl = layerParams.authInfo.tokenUrl + '?user='+layerParams.authInfo.user+'&pw='+layerParams.authInfo.pwd;
    if(!layerParams.authInfo.isApiStoreToken){  // 不是API仓库级别的令牌限制，即是API级别上的令牌限制
        tokenUrl += '&layers=' + layerParams.layers;
    }
    tokenUrl = encodeURI(tokenUrl);
    zkygMap.base.tokenPool = zkygMap.base.tokenPool || {};
    if(!zkygMap.base.tokenPool[tokenUrl]){  // 令牌维护池里面没有对应的记录
        zkygMap.base.tokenPool[tokenUrl] = {};
        zkygMap.base.tokenPool[tokenUrl]['layersParams'] = [layerParams]; // 关联到维护池
        if(procFirstToken) zkygMap.layer._getToken(tokenUrl, layerParams, null, true); // 首次请求
        var tokenTimeOut = 24*60*60*1000;
        zkygMap.base.tokenPool[tokenUrl]['setIntervalId'] = setInterval(function(){zkygMap.layer._getToken(tokenUrl, layerParams, null, true);}, tokenTimeOut);
    }else{
        if(zkygMap.base.tokenPool[tokenUrl]['value']) layerParams.authInfo.value = zkygMap.base.tokenPool[tokenUrl]['value'];
        // 关联到维护池
        zkygMap.base.tokenPool[tokenUrl]['layersParams'] = zkygMap.base.tokenPool[tokenUrl]['layersParams'] || [];
        var layersParams = zkygMap.base.tokenPool[tokenUrl]['layersParams'];
        var l = zkygMap.util.arrFind(layersParams, function(elt, index, array) {
            return elt === layerParams;
        });
        if(!l){ // 令牌维护池，相关令牌请求，还没有关联到layerParams，进行关联
            zkygMap.base.tokenPool[tokenUrl]['layersParams'].push(layerParams);
            if(procFirstToken) zkygMap.layer._getToken(tokenUrl, layerParams, null, true); // 首次请求
        }else if(procFirstToken && !layerParams.authInfo.value){    // 有关联，需要首次请求，且令牌为空
            zkygMap.layer._getToken(tokenUrl, layerParams, null, true); // 首次请求
        } 
    }
};
/**
 * 清理令牌维护
 * @param {Object|undefined} [layerParams] - API资源参数对象，为空时表示清理所有
 * @param {boolean|undefined} [justLink=true] - 是否只移除指定API资源参数对象的关联
 */
zkygMap.layer.cleanMaintainToken = function(layerParams, justLink){
    zkygMap.base.tokenPool = zkygMap.base.tokenPool || {};
    if(!layerParams){   // 清理维护
        for (var tokenUrl in zkygMap.base.tokenPool) {
            if(zkygMap.base.tokenPool[tokenUrl]){
                var id = zkygMap.base.tokenPool[tokenUrl]['setIntervalId'];
                if(id) clearInterval(id);
                zkygMap.base.tokenPool[tokenUrl]['layersParams'] = undefined;
                zkygMap.base.tokenPool[tokenUrl] = undefined;
                delete zkygMap.base.tokenPool[tokenUrl];
            }
        }
        return true;
    }
    if(!layerParams.authInfo || layerParams.authInfo.type !== 'token' || !layerParams.authInfo.tokenUrl || !layerParams.authInfo.user || !layerParams.authInfo.pwd) return true;
    if(justLink === undefined) justLink = true;
    var tokenUrl = layerParams.authInfo.tokenUrl + '?user='+layerParams.authInfo.user+'&pw='+layerParams.authInfo.pwd;
    if(!layerParams.authInfo.isApiStoreToken){  // 不是API仓库级别的令牌限制，即是API级别上的令牌限制
        tokenUrl += '&layers=' + layerParams.layers;
    }
    tokenUrl = encodeURI(tokenUrl);
    var maintainPool = zkygMap.base.tokenPool[tokenUrl];
    if(!maintainPool) return true;
    if(justLink){   // 只移除关联
        var layersParams = maintainPool['layersParams'];
        var index = zkygMap.util.arrFind(layersParams, function(elt, index, array) {
            return elt === layerParams;
        }, true);
        if(index !== -1){
            layersParams.splice(index, 1);
        }
    }else{  // 移除维护
        var id = maintainPool['setIntervalId'];
        if(id) clearInterval(id);
        maintainPool['layersParams'] = undefined;
        zkygMap.base.tokenPool[tokenUrl] = undefined;
        delete zkygMap.base.tokenPool[tokenUrl];
    }
    return true;
}

/**
 * 判断属性是否为可显示属性
 */
zkygMap.layer.isDisplayAttr = function(property){
    if(property === undefined || typeof(property) !== "string") return false;
    if(property.match(/fill_col|border_col|border_wid|opacity_fi|opacity_bo|OBJECTID|geometry/)){
        return false;
    }
    return true;
}

/**
 * 解析查询结果，处理成需要显示的格式
 * 
 * @param {string} title - 标题
 * @param {ol.Feature} feature - 查询结果要素
 * @returns {string} - Element字符串
 */
zkygMap.layer.parseFeatureAttr = function(title, feature){
    if(!feature) return '';
    var properties = feature.getProperties();
    if (!properties) {
        return '没有属性信息';
    }
    var div ='<table class="featureInfo">';
    // var div ='<table class="featureInfo"><caption class="featureInfo">' + title + '</caption>';
    div += '<tbody><tr><th>属性名称</th><th>属性值</th></tr>';
    for(var key in properties){
        if(zkygMap.layer.isDisplayAttr(key)){
            var tr = '<tr><td>' + key + '</td><td>' + properties[key] + '</td></tr>';
            div += tr;
        }
    }
    div += '</tbody></table></div>';
    return div;
};

/**
 * 创建popup覆盖对象
 * @param {Object|string} options - 选项参数对象或popup目标容器元素的id
 * @param {string} options.targetId - popup目标容器元素的id
 * @param {boolean|undefined} [options.close=true] - 是否使用默认的关闭链接按钮
 * @param {boolean|undefined} [options.autoPan=true] - popup的autoPan参数
 * @param {number|undefined} [options.duration=250] - popup的autoPanAnimation属性的autoPan参数
 * @param {ol.source.Vector|undefined} [options.vectorSource] - 关联矢量源，可用于高亮显示要素，关闭时会清空或移除矢量源里面的矢量要素
 * @param {boolean|undefined} [options.isClearFeaturesForClose=true] - ture表示关闭时清空关联矢量源中的所有要素，false表示关闭时只移除关联矢量源中popup.feature属性指定的要素
 * @param {ol.Map|undefined} [layerParams.map] - true，则会立即向map中添加popup覆盖对象
 * @returns {ol.Overlay} - popup覆盖对象
 */
zkygMap.layer.popup = function(options){
    if(typeof(options) === 'string'){
        var targetId = options;
        options = {};
        options.targetId = targetId;
    }else{
        options = options || {};
    }
    if(!options.targetId) return undefined;
    options.close = options.close === undefined ? true : options.close;
    options.isClearFeaturesForClose = options.isClearFeaturesForClose === undefined ? true : options.isClearFeaturesForClose;

    var container = document.getElementById(options.targetId);
    if(!container) return undefined;
    var clsName = container.className || '';
    container.className = clsName ? clsName+' ol-popup-feature' : 'ol-popup-feature';
    if(options.close){
        var closer = document.createElement('a');
        closer.className = 'ol-popup-feature-closer';
        closer.setAttribute('href', '#');
        container.appendChild(closer);
    }
    var content = document.createElement('div');
    container.appendChild(content);

    var autoPan = options.autoPan === undefined ? true : options.autoPan;
    var duration = options.duration === undefined ? 250 : options.duration;

    var popup = new ol.Overlay({
		element: container,
		autoPan: autoPan,
		autoPanAnimation: {
			duration: duration
		}
    });

    // 给poppup对象容器里面的内容DIV填充HTML内容
    popup.setContent = function(contentHTML){
        content.innerHTML = contentHTML || '';
    }

    popup.isClearFeaturesForClose = options.isClearFeaturesForClose;
    if(options.vectorSource){   // 关联矢量源，关闭时会清空或移除矢量源里面的矢量要素
        popup.vectorSource = options.vectorSource;
    }
    if(options.close){  // 增加关闭popup
        closer.onclick = function () {
            if(popup.vectorSource){
                if(popup.isClearFeaturesForClose) popup.vectorSource.clear();
                else if(popup.feature) popup.vectorSource.removeFeature(popup.feature);
            }
            popup.setPosition(undefined);
            closer.blur();
            return false;
        };
    }
    if(options.map) options.map.addOverlay(popup);
    
	return popup;
}

/**
 * 构建WMS-C瓦片图层
 * @param {Object} layerParams - 图层服务参数
 * 
 * @param {string} layerParams.layers - 图层资源标识，多个使用英文逗号分隔
 * 
 * @param {Object|undefined} [layerParams.authInfo] - 图层认证授权信息
 * @param {string|undefined} [layerParams.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [layerParams.authInfo.isApiStoreToken=false] - 认证授权限制是否是API仓库级别，此种类型的API仓库里面所有API可共用密钥或令牌
 * @param {string|undefined} [layerParams.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [layerParams.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），已实现自动维护令牌
 * @param {string|undefined} [layerParams.authInfo.tokenUrl] - 令牌型需要，获取令牌接口
 * @param {string|undefined} [layerParams.authInfo.user] - 令牌型需要，获取令牌接口，使用的用户名
 * @param {string|undefined} [layerParams.authInfo.pwd] - 令牌型需要，获取令牌接口，用户名对应的密码
 * 
 * @param {ol.Map|undefined} [layerParams.map=zkygMap.default.map] - 如果需要使用getFeatureInfo查询功能，则必须提供map对象
 * @param {boolean|undefined} [layerParams.getFeatureInfo=false] - 是否使用getFeatureInfo查询功能
 * @param {string|undefined} [layerParams.getFeatureInfoFormats=zkygMap.default.getFeatureInfoFormats] - 期望查询结果格式，getFeatureInfo查询请求响应格式，text/plain|application/vnd.ogc.gml|application/vnd.ogc.gml/3.1.1|text/html|application/json|text/javascript
 * @param {string|undefined} [layerParams.getFeatureInfoEvent=zkygMap.default.getFeatureInfoEvent] - 地图上触发getFeatureInfo查询的ol地图事件名称
 * @param {number|undefined} [layerParams.getFeatureInfoFeatureCount=zkygMap.default.getFeatureInfoFeatureCount] - getFeatureInfo查询请求最多返回要素数量限制
 * @param {ol.source.Vector|undefined} [layerParams.vectorSource] - 准备的矢量图层源，可用于高亮显示要素
 * @param {ol.Overlay|undefined} [layerParams.popup] - 准备的popup，可用于显示属性信息
 * @param {Function|undefined} [layerParams.getFeatureInfoCallback] - getGetFeatureInfoUrlHandle参数不存储时，自动发送getFeatureInfo查询请求，获取查询结果后的回调函数
 * @param {Function|undefined} [layerParams.getGetFeatureInfoUrlHandle] - 比getFeatureInfoCallback方式优先使用，构建getFeatureInfo查询URL后的处理函数，需要自己发送查询请求并进行处理
 * @param {boolean|undefined} [layerParams.getFeatureInfoPointerMove=false] - 开启getFeatureInfo查询功能后，是否使用图层非透明地方改变鼠标样式
 * @param {string|undefined} [layerParams.getFeatureInfoPointerMoveCursor=zkygMap.default.getFeatureInfoPointerMoveCursor] - 开启getFeatureInfo查询功能后，设置监测图层非透明地方的鼠标样式
 * @param {string|undefined} [layerParams.mapMoveCursor=] - 记录地图默认鼠标样式，默认使用map.getTargetElement().style.cursor获取
 * 
 * @param {string|undefined} [layerParams.title=layerParams.layers] - 图层标题
 * @param {string|undefined} [layerParams.url] - 服务URL，最低优先级
 * @param {string|undefined} [layerParams.wmsUrl=layerParams.url] - WMS服务URL，优先级是 layerParams.wmsUrl || layerParams.url
 * @param {string|undefined} [layerParams.strProj=EPSG:3857] - 图层坐标系，EPSG:3857|EPSG:4326
 * @param {string|undefined} [layerParams.resnum] - 分辨率范围或层级范围，格式: minZoom,maxZoom，用于自动生成resolutions参数
 * @param {string|undefined} [layerParams.resolutions=] - 分辨率（英文逗号分隔），默认根据坐标系和resnum参数自动生成，其他服务器默认还可以根据matrixSet参数自动生成，最后默认根据坐标系自动生成（EPSG:4326，生成0-18层的分辨率，EPSG:3857，生成0-19层的分辨率）
 * @param {string|undefined} [layerParams.origin=] - 瓦片集起算原点坐标，默认根据坐标系选择默认值zkygMap.base.origin
 * @param {string|undefined} [layerParams.strExtent=] - 图层瓦片地理范围，范围之外不请求数据，格式minx,miny,maxx,maxy（或left,bottom,right,top），默认根据坐标系选择坐标系最大地理范围zkygMap.base.projExtent
 * @param {boolean|undefined} [layerParams.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制
 * @param {string|undefined} [layerParams.strRenderExtent=layerParams.strExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）
 * @param {string|undefined} [layerParams.format=image/png] - 图层资源瓦片格式，image/png|image/jpeg
 * @param {string|undefined} [layerParams.style=] - 样式
 * @param {boolean|undefined} [layerParams.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [layerParams.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [layerParams.attributions=zkygMap.default.layerAttributions] - 图层属性
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @returns {ol.layer.Tile} - 返回一个ol瓦片图层对象
 */
zkygMap.layer.createWMSLayer = function(layerParams, isBL){
    if(!layerParams) return null;
    var tileGridInfo = zkygMap.apiInfoUtil.getTileGridInfo(layerParams, 'wms');
    var params = {
		'VERSION': '1.1.1',
		'LAYERS': layerParams.layers,
        'TRANSPARENT': true,
        'STYLE': layerParams.style || '',
		'FORMAT': layerParams.format || 'image/png',
		'SRS' : layerParams.strProj
	};
	if(layerParams.other_params){
        for (param in layerParams.other_params){
            params[param] = layerParams.other_params[param];
        }
    }
    if (layerParams.authInfo){  // 存在认证授权限制，密钥型key或令牌型token
        layerParams.authInfo.type = layerParams.authInfo.type.toLowerCase();
        layerParams.authInfo.key = layerParams.authInfo.key || zkygMap.base.authKey[layerParams.authInfo.type];
        if(layerParams.authInfo.type === 'key'){   // 密钥型，直接写在这（layerParams.authInfo.value为固定值）
            params[layerParams.authInfo.key] = layerParams.authInfo.value;
        }else if(layerParams.authInfo.type === 'token'){    // 令牌型，进行令牌维护
            zkygMap.layer.maintainToken(layerParams);
        }
    }
    var wmsSource = new ol.source.TileWMS({
        url: layerParams.wmsUrl || layerParams.url,
        projection: layerParams.strProj,
        crossOrigin: 'anonymous',
        attributions: layerParams.attributions !== undefined ? layerParams.attributions : zkygMap.default.layerAttributions,
        wrapX: !!layerParams.wrapDateLine,		// 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
        tileLoadFunction: function(imageTile, src) {
            if (layerParams.authInfo && layerParams.authInfo.type === 'token') {   // 令牌型，令牌存在有效期（layerParams.authInfo.value需要定时更新）
                // 令牌型认证授权需要在请求中添加令牌参数信息（实现方式不唯一），这里通过重写tileLoadFunction方法实现
                src += encodeURI('&' + layerParams.authInfo.key + '=' + layerParams.authInfo.value);
            }
            imageTile.getImage().src = src;
        },
        params: params,
        tileGrid : new ol.tilegrid.TileGrid(tileGridInfo)
    });

    var renderExtent = undefined;
    if(layerParams.isRenderExtentRestrict){
        var map = layerParams.map || zkygMap.default.map;
        renderExtent = zkygMap.util.string2FloatArr(layerParams.strRenderExtent) || tileGridInfo.extent;
        var viewProj = map && map.getView() && map.getView().getProjection().getCode() || zkygMap.default.viewProjCode;
        if(renderExtent && viewProj !== layerParams.strProj){
            renderExtent = ol.proj.transformExtent(renderExtent, layerParams.strProj, viewProj);
        }
    }
    
    // WMS瓦片图层
    var layer = new ol.layer.Tile({
        name: layerParams.layers,
        title: layerParams.title || layerParams.layers, // 图层显示名称
        baseLayer: !!isBL,		// 是否为底图模式（同一时刻只能显示一个底图图层）
        visible: !!layerParams.visibility,  // 初始可见
        // areaid: layerParams.areaid,
        extent: renderExtent, // 地理范围，图层范围之外的区域不渲染，必需是view坐标系下的坐标
        source: wmsSource
    });

    // 使用查询功能，只在前端layerParams['getFeatureInfoEvent']事件中构建查询url并调用处理方法layerParams['getGetFeatureInfoUrlHandle']，参数是查询请求，方法不执行请求
    if(layerParams['getFeatureInfo']){
        layerParams['getFeatureInfoFormats'] = layerParams['getFeatureInfoFormats'] || zkygMap.default.getFeatureInfoFormats;
        layerParams['getFeatureInfoEvent'] = layerParams['getFeatureInfoEvent'] || zkygMap.default.getFeatureInfoEvent;
        layerParams['getFeatureInfoFeatureCount'] = layerParams['getFeatureInfoFeatureCount'] || zkygMap.default.getFeatureInfoFeatureCount;
        var map = layerParams.map || zkygMap.default.map;
        if(map){   // map存在
            if(layerParams['getFeatureInfoCallback'] || layerParams['getGetFeatureInfoUrlHandle']){
                var getGetFeatureInfoAjax = null;
                // getFeatureInfo查询请求默认响应格式，text/plain|application/vnd.ogc.gml|application/vnd.ogc.gml/3.1.1|text/html|application/json|text/javascript
                var info_format = layerParams['getFeatureInfoFormats'];
                var dataType = 'json';
                if(info_format == 'text/plain'){
                    dataType = 'text';
                }else if(info_format == 'application/vnd.ogc.gml' || info_format == 'application/vnd.ogc.gml/3.1.1'){
                    dataType = 'xml';
                }else if(info_format == 'text/html'){
                    dataType = 'html';
                }else if(info_format == 'text/javascript'){
                    dataType = 'jsonp';
                }else{
                    dataType = 'json';
                }
                function getGetFeatureInfoUrlHandle(url, proj, coordinate, vectorSource, popup, map, dataType, info_format, callback){
                    if(getGetFeatureInfoAjax) {
                        getGetFeatureInfoAjax.abort();
                        getGetFeatureInfoAjax = null;
                    }
                    if(popup) popup.setPosition(undefined);	// 关闭popup
                    if(vectorSource) vectorSource.clear();	// 移除当前矢量源里面的所有要素
                    getGetFeatureInfoAjax = zkygMap.util.ajax({
                        dataType: dataType,
                        url: url,
                        success: function(data, textStatus, ajax){
                            if(callback) callback(data, info_format, proj, coordinate, vectorSource, popup, map);
                            ajax = null;
                        },
                        error: function(ajax, textStatus, responseText){
                            if(callback) callback();
                            console.error('查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText);
                            ajax = null;
                        }
                    });
                };

                map.on(layerParams['getFeatureInfoEvent'], function (evt) {
                    if(layer.getVisible()){
                        var view = map.getView();
                        var viewProj = view.getProjection();
                        var proj = ol.proj.get(layerParams.strProj);
                        var viewRes = view.getResolution();
                        // if(viewProj !== proj){
                        //     var z = view.getZoom();
                        //     // if(viewProj.getCode() === 'EPSG:3857'){
                        //     //     z = z+1;
                        //     //     // if(z > view.getMaxZoom()) z=view.getMaxZoom();
                        //     // }else{
                        //     //     z = z-1;
                        //     //     // if(z < view.getMinZoom()) z=view.getMinZoom();
                        //     // }
                        //     // viewRes = view.getResolutionForZoom(z);
                        //     viewRes = wmsSource.getTileGrid().getResolution(z);
                        // }
                        var url = wmsSource.getGetFeatureInfoUrl(
                            evt.coordinate, viewRes, viewProj, {
                                'INFO_FORMAT': info_format,
                                'FEATURE_COUNT': layerParams['getFeatureInfoFeatureCount'] 
                            }
                        );
                        if (layerParams.authInfo && layerParams.authInfo.type === 'token') {   // 令牌型，令牌存在有效期（layerParams.authInfo.value需要定时更新）
                            // 令牌型认证授权需要在请求中添加令牌参数信息
                            url += encodeURI('&' + layerParams.authInfo.key + '=' + layerParams.authInfo.value);
                        }
                        if(layerParams['getGetFeatureInfoUrlHandle']){  // 构建查询url并调用查询url处理方法
                            layerParams['getGetFeatureInfoUrlHandle'](url, proj, evt.coordinate, layerParams.vectorSource, layerParams.popup, map);
                        }else if(layerParams['getFeatureInfoCallback']){
                            getGetFeatureInfoUrlHandle(url, proj, evt.coordinate, layerParams.vectorSource, layerParams.popup, map, dataType, info_format, layerParams['getFeatureInfoCallback']);
                        }
                    }
                });
            }

            if(layerParams['getFeatureInfoPointerMove']){   // 是否使用鼠标移入图层非透明区域时改变鼠标样式，而透明区域使用地图上默认鼠标样式
                var defaultCursor = layerParams['mapMoveCursor'] === undefined ? map.getTargetElement().style.cursor : layerParams['mapMoveCursor'];
                map.on('pointermove', function (evt) {
                    if(layer.getVisible()){
                        if (evt.dragging) { return; }
                        var pixel = map.getEventPixel(evt.originalEvent);
                        var hit = map.forEachLayerAtPixel(
                            pixel,
                            function () { return true; },
                            undefined,
                            function(layerCandidate){return layerCandidate === layer}
                        );
                        map.getTargetElement().style.cursor = hit ? zkygMap.default.getFeatureInfoPointerMoveCursor : defaultCursor;
                    }
                });
            }
        }
    }
    return layer;
};

/**
 * 构建WMTS瓦片图层
 * @param {Object} layerParams - 图层服务参数
 * 
 * @param {string} layerParams.layers - 图层资源标识，多个使用英文逗号分隔
 * 
 * @param {Object|undefined} [layerParams.authInfo] - 图层认证授权信息
 * @param {string|undefined} [layerParams.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [layerParams.authInfo.isApiStoreToken=false] - 认证授权限制是否是API仓库级别，此种类型的API仓库里面所有API可共用密钥或令牌
 * @param {string|undefined} [layerParams.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [layerParams.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），已实现自动维护令牌
 * @param {string|undefined} [layerParams.authInfo.tokenUrl] - 令牌型需要，获取令牌接口
 * @param {string|undefined} [layerParams.authInfo.user] - 令牌型需要，获取令牌接口，使用的用户名
 * @param {string|undefined} [layerParams.authInfo.pwd] - 令牌型需要，获取令牌接口，用户名对应的密码
 * 
 * @param {string|undefined} [layerParams.title=layerParams.layers] - 图层标题
 * @param {string|undefined} [layerParams.requestEncoding=zkygMap.default.wmtsRequestEncoding] - 服务编码方式，KVP|REST，大小写无关
 * @param {string|undefined} [layerParams.url] - 服务URL，最低优先级
 * @param {string|undefined} [layerParams.wmtsUrl=layerParams.url] - WMTS服务URL
 * @param {string|undefined} [layerParams.wmtsKVPUrl=layerParams.wmtsUrl] - WMTS服务KVP编码方式的URL，优先级是 layerParams.wmtsKVPUrl || layerParams.wmtsUrl || layerParams.url
 * @param {string|undefined} [layerParams.wmtsRestfulUrl=layerParams.wmtsUrl] - WMTS服务REST编码方式的UR，优先级是 layerParams.wmtsRestfulUrl || layerParams.wmtsUrl || layerParams.url
 * @param {string|undefined} [layerParams.strProj=EPSG:3857] - 图层坐标系，EPSG:3857|EPSG:4326
 * @param {string|undefined} [layerParams.serverType=image/png] - 图层资源瓦片格式，image/png|image/jpeg
 * @param {string|undefined} [layerParams.serverType=] - 服务器类型，gwc|geoserver|any other，此参数用于根据不同的服务器类型生成服务参数，不所为图层对象的属性
 * @param {string|undefined} [layerParams.resnum] - 分辨率范围或层级范围，格式: minZoom,maxZoom，用于其它服务器默认结合strProj参数一起自动生成matrixSet参数
 * @param {string|undefined} [layerParams.matrixSet=] - 瓦片矩阵集标识，gwc|geoserver服务器根据坐标系选择默认值zkygMap.base.geoserverDefaultTileMatrixSet，其它服务器默认结合strProj参数一起自动生成
 * @param {string|undefined} [layerParams.matrixIds=] - 瓦片矩阵标识（英文逗号分隔），gwc|geoserver服务器默认根据坐标系和resnum参数自动生成，其它服务器默认根据matrixSet参数自动生成，当matrixIds和resolutions参数同时存在时优先使用
 * @param {string|undefined} [layerParams.resolutions=] - 分辨率（英文逗号分隔），gwc|geoserver服务器默认根据坐标系和resnum参数自动生成其它服务器默认根据matrixSet参数自动生成，当matrixIds和resolutions参数同时存在时优先使用
 * @param {string|undefined} [layerParams.scaleDenominators=] - 比例尺分母（英文逗号分隔），gwc|geoserver服务器默认根据坐标系和resnum参数自动生成，其它服务器默认根据matrixSet参数自动生成，当matrixIds和resolutions参数同时存在时优先使用
 * @param {string|undefined} [layerParams.origin=] - 瓦片矩阵起算原点坐标，默认根据坐标系选择默认值zkygMap.base.origin
 * @param {string|undefined} [layerParams.strExtent=] - 图层地理范围，范围之外不请求数据，格式minx,miny,maxx,maxy（或left,bottom,right,top），默认根据坐标系选择坐标系最大地理范围zkygMap.base.projExtent
 * @param {ol.Map|undefined} [layerParams.map=zkygMap.default.map] - 在使用前端渲染范围限制时，用于获取地图视图的坐标系
 * @param {boolean|undefined} [layerParams.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制
 * @param {string|undefined} [layerParams.strRenderExtent=layerParams.strExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）
 * @param {string|undefined} [layerParams.style=] - 样式
 * @param {boolean|undefined} [layerParams.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [layerParams.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [layerParams.attributions=zkygMap.default.layerAttributions] - 图层属性
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @returns {ol.layer.Tile} - 返回一个ol瓦片图层对象
 */
zkygMap.layer.createWMTSLayer = function(layerParams, isBL){
    if(!layerParams) return null;
    var tileGridInfo = zkygMap.apiInfoUtil.getTileGridInfo(layerParams, 'wmts');
    
    if (layerParams.authInfo){  // 存在认证授权限制，密钥型key或令牌型token
        layerParams.authInfo.type = layerParams.authInfo.type.toLowerCase();
        layerParams.authInfo.key = layerParams.authInfo.key || zkygMap.base.authKey[layerParams.authInfo.type];
        if(layerParams.authInfo.type === 'token'){    // 令牌型，进行令牌维护
            zkygMap.layer.maintainToken(layerParams);
        }
    }
    var requestEncoding = layerParams.requestEncoding || zkygMap.default.wmtsRequestEncoding;
    requestEncoding = requestEncoding.toUpperCase();
    var url = requestEncoding === 'KVP' ? (layerParams.wmtsKVPUrl || layerParams.wmtsUrl || layerParams.url) : (layerParams.wmtsRestfulUrl || layerParams.wmtsUrl || layerParams.url);
    
    var renderExtent = undefined;
    if(layerParams.isRenderExtentRestrict){
        var map = layerParams.map || zkygMap.default.map;
        renderExtent = zkygMap.util.string2FloatArr(layerParams.strRenderExtent) || tileGridInfo.extent;
        var viewProj = map && map.getView() && map.getView().getProjection().getCode() || zkygMap.default.viewProjCode;
        if(renderExtent && viewProj !== layerParams.strProj){
            renderExtent = ol.proj.transformExtent(renderExtent, layerParams.strProj, viewProj);
        }
    }

    
    // WMTS瓦片图层
    return new ol.layer.Tile({
        title: layerParams.title || layerParams.layers,	// 图层显示名称
        name: layerParams.layers,
        baseLayer: !!isBL,		// 是否为底图模式（同一时刻只能显示一个底图图层）
        visible: !!layerParams.visibility,  // 初始可见
        // areaid: layerParams.areaid,
        extent: renderExtent, // 地理范围，图层范围之外的区域不渲染，必需是view坐标系下的坐标
        source: new ol.source.WMTS({
            url: url,
            layer: layerParams.layers,
            crossOrigin: 'anonymous',
            projection: layerParams.strProj,
            format: layerParams.format || 'image/png',
            style: layerParams.style || '', // 样式
            requestEncoding: requestEncoding,
            wrapX: !!layerParams.wrapDateLine,		// 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
            matrixSet: layerParams.matrixSet,	// 图层的瓦片格网集名称
            tileLoadFunction: function(imageTile, src) {
                if (layerParams.authInfo && (layerParams.authInfo.type === 'key' || layerParams.authInfo.type === 'token')) {   // 密钥型或令牌型，令牌存在有效期（layerParams.authInfo.value需要定时更新）
                    // 令牌型认证授权需要在请求中添加令牌参数信息（实现方式不唯一），这里通过重写tileLoadFunction方法实现
                    src += encodeURI((requestEncoding === 'KVP' ? '&' : '?') + layerParams.authInfo.key + '=' + layerParams.authInfo.value);
                }
                imageTile.getImage().src = src;
            },
            attributions: layerParams.attributions !== undefined ? layerParams.attributions : zkygMap.default.layerAttributions,
            tileGrid: new ol.tilegrid.WMTS(tileGridInfo)
        })
    });

};

/**
 * 构建wmts的GetCapabilities请求地址
 * @param {string} url - 基本地址
 */
zkygMap.layer.getWMTSCapabilitiesURL = function(url, serverType, requestEncoding){
    if(!url) return url;
    var aUrl = url.toUpperCase();
    var aServerType = serverType && serverType.toLowerCase();
    if(!requestEncoding){
        if(!aServerType || aServerType!=='geoserver' || aServerType!=='gwc' || aServerType!=='tdt' || aServerType!=='geoservergwc'){
            if(aUrl.indexOf("/WMTS") > -1){
                requestEncoding = 'REST';
            }
        }
    }
    requestEncoding = requestEncoding && requestEncoding.toUpperCase() || 'KVP';
    if(requestEncoding === 'KVP'){
        if(aUrl.indexOf('SERVICE=WMTS') === -1){
            if(aUrl.indexOf("?") > -1){
                url = url + '&request=GetCapabilities&service=WMTS';
            }else{
                url = url + '?request=GetCapabilities&service=WMTS';
            }
        }
    }else{
        if(aUrl.indexOf('1.0.0/WMTSCAPABILITIES.XML') === -1){
            url = url + (url[url.length-1] === '/' ? '1.0.0/WMTSCapabilities.xml' : '/1.0.0/WMTSCapabilities.xml');
        }
    }
    return url;
};

/**
 * 根据WMTSCapabilities请求响应成功创建WMTS瓦片图层数组后的回调
 * @callback zkygMap.layer.wmtsLayerCapabilitiesCallback
 * @param {ol.layer.Tile[]} wmtsLayers - 成功创建WMTS瓦片图层后的回调函数，参数是WMTS瓦片图层数组
 */

/**
 * 内部方法（没有维护令牌），根据WMTSCapabilities请求响应创建指定的WMTS瓦片图层
 * @param {string} url - WMTSCapabilities请求的url
 * @param {string|undefined} [layer] - 图层标识，默认使用功能文档里面的第一个图层
 * @param {Object|undefined} [config] - 配置信息对象，可以包括WMTS服务参数和认证授权信息对象
 * 
 * @param {Object|undefined} [config.authInfo] - 图层认证授权信息
 * @param {string|undefined} [config.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [config.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [config.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），此方法没有维护令牌
 * 
 * @param {string|undefined} [config.matrixSet] - 瓦片矩阵集，默认从功能文档对应图层信息中使用第一个瓦片矩阵集标识
 * @param {string|undefined} [config.crossOrigin] - 图层的ol.source.WMTS中的crossOrigin属性
 * @param {string|undefined} [config.strProj] - 图层的坐标系，默认从功能文档解析
 * @param {string|undefined} [config.requestEncoding] - 编码方式，KVP或REST，默认从功能文档解析
 * @param {string|undefined} [config.style] - 样式，默认从功能文档解析
 * @param {string|undefined} [config.format] - 图层资源瓦片格式，image/png|image/jpeg，默认从功能文档解析
 * @param {boolean|undefined} [config.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [config.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [config.attributions=zkygMap.default.layerAttributions] - 图层属性
 * @param {ol.Map|undefined} [config.map=zkygMap.default.map] - 在使用前端渲染范围限制时，用于获取地图视图的坐标系
 * @param {boolean|undefined} [config.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制，此功能在ol压缩版中无法从ol.tilegrid.WMTS对象中获取地理范围extent
 * @param {string|undefined} [config.strRenderExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）,默认使用从功能文档解析的图层地理范围
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @param {zkygMap.layer.wmtsLayerCapabilitiesCallback} callbacks - 成功创建WMTS瓦片图层后的回调函数，参数是WMTS瓦片图层数组，没有指定图层则返回空数组
 * @private
 */
zkygMap.layer._createWMTSLayerByCapabilities = function(url, layer, config, isBL, callbacks){
    zkygMap.util.ajax({
        url: url,
		success: function(text, textStatus, ajax){
            if(!text){
                if(typeof(callbacks) === 'function'){
                    callbacks([]);
                }
            }
            var parser = new ol.format.WMTSCapabilities();
            var result = parser.read(text);
            var layers = result['Contents']['Layer'];
            if(!layers.length){
                if(typeof(callbacks) === 'function'){
                    callbacks([]);
                }
            }else{
                if(!layer) layer = layers[0]['Identifier'];
                var params = {layer: layer};
                if(config.matrixSet) params.matrixSet = config.matrixSet;
                if(config.crossOrigin !== undefined) params.crossOrigin = config.crossOrigin;
                var options = ol.source.WMTS.optionsFromCapabilities(result, params);
                if(!options){
                    if(typeof(callbacks) === 'function'){
                        callbacks([]);
                    }
                }else{
                    if(config.strProj) options.projection = config.strProj;
                    if(config.requestEncoding) options.requestEncoding = config.requestEncoding;
                    if(config.style !== undefined) options.style = config.style;
                    if(config.format) params.format = options.format;
                    if(config.wrapDateLine !== undefined) options.wrapX = config.wrapX;
                    options.attributions = config.attributions !== undefined ? config.attributions : zkygMap.default.layerAttributions;
                    var l = zkygMap.util.arrFind(layers, function(elt, index, array) {
                        return elt['Identifier'] == layer;
                    });
                    if(config.authInfo){
                        options.tileLoadFunction = function(imageTile, src) {
                            if (config.authInfo.type === 'key' || config.authInfo.type === 'token') {   // 密钥型或令牌型，令牌存在有效期（config.authInfo.value需要定时更新）
                                // 令牌型认证授权需要在请求中添加令牌参数信息（实现方式不唯一），这里通过重写tileLoadFunction方法实现
                                src += encodeURI((options.requestEncoding === 'KVP' ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value);
                            }
                            imageTile.getImage().src = src;
                        };
                    }

                    var renderExtent = undefined;
                    if(config.isRenderExtentRestrict){
                        var map = config.map || zkygMap.default.map;
                        renderExtent = zkygMap.util.string2FloatArr(config.strRenderExtent) || options.tileGrid.getExtent && options.tileGrid.getExtent();
                        var viewProj = map && map.getView() && map.getView().getProjection().getCode() || zkygMap.default.viewProjCode;
                        if(renderExtent && viewProj !== options.projection){
                            renderExtent = ol.proj.transformExtent(renderExtent, options.projection, viewProj);
                        }
                    }

                    var wmtsLayer = new ol.layer.Tile({
                        title: l['Title'],	// 图层显示名称
                        name: layer,
                        baseLayer: !!isBL,		// 是否为底图模式（同一时刻只能显示一个底图图层）
                        visible: !!config.visibility,  // 初始可见
                        extent: renderExtent, // 地理范围，图层范围之外的区域不渲染，必需是view坐标系下的坐标
                        source: new ol.source.WMTS(options)
                    });
                    if(typeof(callbacks) === 'function'){
                        callbacks([wmtsLayer]);
                    }
                }
            }
            ajax = null;
        }
    });
}
/**
 * 根据WMTSCapabilities请求响应创建指定的WMTS瓦片图层
 * @param {string} url - WMTSCapabilities请求的url
 * @param {string|undefined} [layer] - 图层标识，默认使用功能文档里面的第一个图层
 * @param {Object|undefined} [config] - 配置信息对象，可以包括WMTS服务参数和认证授权信息对象
 * 
 * @param {Object|undefined} [config.authInfo] - 图层认证授权信息
 * @param {string|undefined} [config.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [config.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [config.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），已实现自动维护令牌
 * @param {string|undefined} [config.authInfo.tokenUrl] - 令牌型需要，获取令牌接口
 * @param {string|undefined} [config.authInfo.user] - 令牌型需要，获取令牌接口，使用的用户名
 * @param {string|undefined} [config.authInfo.pwd] - 令牌型需要，获取令牌接口，用户名对应的密码
 * 
 * @param {string|undefined} [config.matrixSet] - 瓦片矩阵集，默认从功能文档对应图层信息中使用第一个瓦片矩阵集标识
 * @param {string|undefined} [config.crossOrigin] - 图层的ol.source.WMTS中的crossOrigin属性
 * @param {string|undefined} [config.strProj] - 图层的坐标系，默认从功能文档解析
 * @param {string|undefined} [config.requestEncoding] - 编码方式，KVP或REST，默认从功能文档解析
 * @param {string|undefined} [config.style] - 样式，默认从功能文档解析
 * @param {string|undefined} [config.format] - 图层资源瓦片格式，image/png|image/jpeg，默认从功能文档解析
 * @param {boolean|undefined} [config.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [config.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [config.attributions=zkygMap.default.layerAttributions] - 图层属性
* @param {ol.Map|undefined} [config.map=zkygMap.default.map] - 在使用前端渲染范围限制时，用于获取地图视图的坐标系
 * @param {boolean|undefined} [config.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制，此功能在ol压缩版中无法从ol.tilegrid.WMTS对象中获取地理范围extent
 * @param {string|undefined} [config.strRenderExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）,默认使用从功能文档解析的图层地理范围
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @param {zkygMap.layer.wmtsLayerCapabilitiesCallback} callbacks - 成功创建WMTS瓦片图层后的回调函数，参数是WMTS瓦片图层数组，没有指定图层则返回空数组
 */
zkygMap.layer.createWMTSLayerByCapabilities = function(url, layer, config, isBL, callbacks){
    if(!url) return;
    config = config || {};
    url = zkygMap.layer.getWMTSCapabilitiesURL(url, config.serverType, config.requestEncoding);
    if (!config.authInfo){
        zkygMap.layer._createWMTSLayerByCapabilities(url, layer, config, isBL, callbacks);
    }else{  // 存在认证授权限制信息
        config.authInfo.type = config.authInfo.type.toLowerCase();
        config.authInfo.key = config.authInfo.key || zkygMap.base.authKey[config.authInfo.type];
        if(config.authInfo.type === 'key'){ // 密钥型
            url += ((config.requestEncoding === 'KVP' || url.indexOf('?') !== -1) ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value;
            zkygMap.layer._createWMTSLayerByCapabilities(url, layer, config, isBL, callbacks);
        } else if(config.authInfo.type === 'token'){    // 令牌型，进行令牌维护
            var tokenUrl = config.authInfo.tokenUrl + '?user=' + config.authInfo.user + '&pw=' + config.authInfo.pwd;
            if(!config.authInfo.isApiStoreToken && layer){  // 不是API仓库级别的令牌限制，即是API级别上的令牌限制
                tokenUrl += '&layers=' + layer;
            }
            tokenUrl = encodeURI(tokenUrl);
            zkygMap.layer._getToken(tokenUrl, null, null, false, function(data){
                if(data && data['token']){
                    config.authInfo.value = data['token'];
                    zkygMap.layer.maintainToken(config, false);
                    url += encodeURI(((config.requestEncoding === 'KVP' || url.indexOf('?') !== -1) ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value);
                    zkygMap.layer._createWMTSLayerByCapabilities(url, layer, config, isBL, callbacks);
                }
            });
        } else {    // 认证授权限制类型为无
            zkygMap.layer._createWMTSLayerByCapabilities(url, layer, config, isBL, callbacks);
        }
    }
};

/**
 * 内部方法（没有维护令牌），根据WMTSCapabilities请求响应创建所有WMTS瓦片图层
 * @param {string} url - WMTSCapabilities请求的url
 * @param {Object|undefined} [config] - 配置信息对象，可以包括WMTS服务参数和认证授权信息对象
 * 
 * @param {Object|undefined} [config.authInfo] - 图层认证授权信息
 * @param {string|undefined} [config.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [config.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [config.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），已实现自动维护令牌
 * 
 * @param {string|undefined} [config.matrixSet] - 瓦片矩阵集，默认从功能文档对应图层信息中使用第一个瓦片矩阵集标识
 * @param {string|undefined} [config.crossOrigin] - 图层的ol.source.WMTS中的crossOrigin属性
 * @param {string|undefined} [config.strProj] - 图层的坐标系，默认从功能文档解析
 * @param {string|undefined} [config.requestEncoding] - 编码方式，KVP或REST，默认从功能文档解析
 * @param {string|undefined} [config.style] - 样式，默认从功能文档解析
 * @param {string|undefined} [config.format] - 图层资源瓦片格式，image/png|image/jpeg，默认从功能文档解析
 * @param {boolean|undefined} [config.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [config.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [config.attributions=zkygMap.default.layerAttributions] - 图层属性
 * @param {ol.Map|undefined} [config.map=zkygMap.default.map] - 在使用前端渲染范围限制时，用于获取地图视图的坐标系
 * @param {boolean|undefined} [config.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制，此功能在ol压缩版中无法从ol.tilegrid.WMTS对象中获取地理范围extent
 * @param {string|undefined} [config.strRenderExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）,默认使用从功能文档解析的图层地理范围
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @param {zkygMap.layer.wmtsLayerCapabilitiesCallback} callbacks - 成功创建所有WMTS瓦片图层后的回调函数，参数是WMTS瓦片图层数组，没有图层则返回空数组
 * @private
 */
zkygMap.layer._createWMTSLayersByCapabilities = function(url, config, isBL, callbacks){
    zkygMap.util.ajax({
        url: url,
        success: function(text, textStatus, ajax){
            if(!text){
                if(typeof(callbacks) === 'function'){
                    callbacks([]);
                }
            }
            var wmtsLayers = [];
            var parser = new ol.format.WMTSCapabilities();
            var result = parser.read(text);
            var layers = result['Contents']['Layer'];
            var len = layers.length;
            for(var i=0; i<len; i++){
                var layer = layers[i]['Identifier'];
                var title = layers[i]['Title'];
                var params = {layer: layer};
                if(config.matrixSet) params.matrixSet = config.matrixSet;
                if(config.crossOrigin !== undefined) params.crossOrigin = config.crossOrigin;
                var options = ol.source.WMTS.optionsFromCapabilities(result, params);
                if(options){
                    if(config.projection) options.projection = config.projection;
                    if(config.requestEncoding) options.requestEncoding = config.requestEncoding;
                    if(config.style !== undefined) options.style = config.style;
                    if(config.format) params.format = options.format;
                    if(config.wrapX !== undefined) options.wrapX = config.wrapX;
                    options.attributions = config.attributions !== undefined ? config.attributions : zkygMap.default.layerAttributions;
                    if(config.authInfo){
                        options.tileLoadFunction = function(imageTile, src) {
                            if (config.authInfo.type === 'key' || config.authInfo.type === 'token') {   // 密钥型或令牌型，令牌存在有效期（config.authInfo.value需要定时更新）
                                // 令牌型认证授权需要在请求中添加令牌参数信息（实现方式不唯一），这里通过重写tileLoadFunction方法实现
                                src += encodeURI((options.requestEncoding === 'KVP' ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value);
                            }
                            imageTile.getImage().src = src;
                        };
                    }

                    var renderExtent = undefined;
                    if(config.isRenderExtentRestrict){
                        var map = config.map || zkygMap.default.map;
                        renderExtent = zkygMap.util.string2FloatArr(config.strRenderExtent) || options.tileGrid.getExtent && options.tileGrid.getExtent();
                        var viewProj = map && map.getView() && map.getView().getProjection().getCode() || zkygMap.default.viewProjCode;
                        if(renderExtent && viewProj !== options.projection){
                            renderExtent = ol.proj.transformExtent(renderExtent, options.projection, viewProj);
                        }
                    }

                    var wmtsLayer = new ol.layer.Tile({
                        title: title,	// 图层显示名称
                        name: layer,
                        baseLayer: !!isBL,		// 是否为底图模式（同一时刻只能显示一个底图图层）
                        visible: !!config.visibility,  // 初始可见
                        extent: renderExtent, // 地理范围，图层范围之外的区域不渲染，必需是view坐标系下的坐标
                        source: new ol.source.WMTS(options)
                    });
                    wmtsLayers.push(wmtsLayer);
                }
            }
            if(typeof(callbacks) === 'function'){
                callbacks(wmtsLayers);
            }
            ajax = null;
        }
    });
};
/**
 * 根据WMTSCapabilities请求响应创建所有WMTS瓦片图层
 * @param {string} url - WMTSCapabilities请求的url
 * @param {Object|undefined} [config] - 配置信息对象，可以包括WMTS服务参数和认证授权信息对象
 * 
 * @param {Object|undefined} [config.authInfo] - 图层认证授权信息
 * @param {string|undefined} [config.authInfo.type] - 认证授权类型，密钥型或令牌型，key|token|none|any other，大小写无关
 * @param {string|undefined} [config.authInfo.key=ak|token] - 授权参数关键字，密钥型默认ak，令牌型默认token
 * @param {string|undefined} [config.authInfo.value=] - 授权参数对应的值，密钥型对应密钥（必需）或令牌型对应令牌，令牌存在有效期（layerParams.authInfo.value需要定时更新），已实现自动维护令牌
 * @param {string|undefined} [config.authInfo.tokenUrl] - 令牌型需要，获取令牌接口
 * @param {string|undefined} [config.authInfo.user] - 令牌型需要，获取令牌接口，使用的用户名
 * @param {string|undefined} [config.authInfo.pwd] - 令牌型需要，获取令牌接口，用户名对应的密码
 * 
 * @param {string|undefined} [config.matrixSet] - 瓦片矩阵集，默认从功能文档对应图层信息中使用第一个瓦片矩阵集标识
 * @param {string|undefined} [config.crossOrigin] - 图层的ol.source.WMTS中的crossOrigin属性
 * @param {string|undefined} [config.strProj] - 图层的坐标系，默认从功能文档解析
 * @param {string|undefined} [config.requestEncoding] - 编码方式，KVP或REST，默认从功能文档解析
 * @param {string|undefined} [layerParams.style] - 样式，默认从功能文档解析
 * @param {string|undefined} [layerParams.format] - 图层资源瓦片格式，image/png|image/jpeg，默认从功能文档解析
 * @param {boolean|undefined} [layerParams.visibility=false] - 是否初始显示
 * @param {boolean|undefined} [layerParams.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * @param {string|undefined} [layerParams.attributions=zkygMap.default.layerAttributions] - 图层属性
 * @param {ol.Map|undefined} [config.map=zkygMap.default.map] - 在使用前端渲染范围限制时，用于获取地图视图的坐标系
 * @param {boolean|undefined} [config.isRenderExtentRestrict=false] - 是否使用前端渲染范围限制，此功能在ol压缩版中无法从ol.tilegrid.WMTS对象中获取地理范围extent
 * @param {string|undefined} [config.strRenderExtent] - 图层在前端可渲染的地理范围，格式minx,miny,maxx,maxy（或left,bottom,right,top）,默认使用从功能文档解析的图层地理范围
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图
 * @param {zkygMap.layer.wmtsLayerCapabilitiesCallback} callbacks - 成功创建所有WMTS瓦片图层后的回调函数，参数是WMTS瓦片图层数组，没有图层则返回空数组
 */
zkygMap.layer.createWMTSLayersByCapabilities = function(url, config, isBL, callbacks){
    if(!url) return;
    config = config || {};
    url = zkygMap.layer.getWMTSCapabilitiesURL(url, config.serverType, config.requestEncoding);
    if (!config.authInfo){
        zkygMap.layer._createWMTSLayersByCapabilities(url, config, isBL, callbacks);
    }else{  // 存在认证授权限制信息
        config.authInfo.type = config.authInfo.type.toLowerCase();
        config.authInfo.key = config.authInfo.key || zkygMap.base.authKey[config.authInfo.type];
        if(config.authInfo.type === 'key'){ // 密钥型
            url += ((config.requestEncoding === 'KVP' || url.indexOf('?') !== -1) ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value;
            zkygMap.layer._createWMTSLayersByCapabilities(url, config, isBL, callbacks);
        } else if(config.authInfo.type === 'token'){    // 令牌型，进行令牌维护
            var tokenUrl = config.authInfo.tokenUrl + '?user=' + config.authInfo.user + '&pw=' + config.authInfo.pwd;
            tokenUrl = encodeURI(tokenUrl);
            zkygMap.layer._getToken(tokenUrl, null, null, false, function(data){
                if(data && data['token']){
                    config.authInfo.value = data['token'];
                    zkygMap.layer.maintainToken(config, false);
                    url += encodeURI(((config.requestEncoding === 'KVP' || url.indexOf('?') !== -1) ? '&' : '?') + config.authInfo.key + '=' + config.authInfo.value);
                    zkygMap.layer._createWMTSLayersByCapabilities(url, config, isBL, callbacks);
                }
            });
        } else {    // 认证授权限制类型为无
            zkygMap.layer._createWMTSLayersByCapabilities(url, config, isBL, callbacks);
        }
    }
};

/**
 * 构建天地图资源瓦片图层
 * @param {Object|string} options - 选项参数对象或天地图资源类型
 * @param {string|undefined} [options.type=vec_c] - 天地图资源类型，"vec_c"，"img_c"，"ter_c"，"cva_c"，"eva_c"，"cia_c"，"eia_c"，"cta_c"，"vec_w"，"img_w"，"ter_w"，"cva_w"，"eva_w"，"cia_w"，"eia_w"，"cta_w"
 * @param {string|undefined} [options.title] - 图层标题，默认从zkygMap.base.tdtType2TitleMap中获取对应类型的资源标题
 * @param {string|undefined} [options.format=tiles] - 图层资源瓦片格式，image/png|image/jpeg
 * @param {string|undefined} [options.style=default] - 样式
 * @param {boolean|undefined} [options.visibilityL=false] - 是否初始可见  
 * @param {boolean|undefined} [options.wrapDateLine=false] - 是否X轴使用环绕重复，日期变更线循环显示，只有在世界范围的地图上设为true
 * 
 * @param {boolean|undefined} [isBL=false] - 是否作为底图 
 * @returns {ol.layer.Tile} 返回一个ol瓦片图层对象 
 */
zkygMap.layer.createTDTLayer = function(options, isBL){
    if(typeof(options) === 'string'){
        var type = options;
        options = {};
        options.type = type;
    }else{
        options = options || {};
    }
    var type = options.type || "vec_c";
	var title = options.title || zkygMap.base.tdtType2TitleMap[type];
	
	var url="http://t0.tianditu.com/"+type+"/wmts";
	var typeArr = type.split("_");
	var layer = typeArr[0];
	var matrixSet = typeArr[1];
    var tileGridInfo = zkygMap.apiInfoUtil.getTileGridInfo(matrixSet, 'tdt');
	
    // WMTS瓦片图层
	return new ol.layer.Tile({
		title: title,
		baseLayer: !!isBL,		// 是否为底图模式（同一时刻只能显示一个底图图层）
		visible: !!options.visibility,
        // extent: tileGridInfo.extent, // 地理范围，图层范围之外的区域不渲染，必需是view坐标系下的坐标
		source: new ol.source.WMTS({
			url: url,
			layer: layer,
			projection: matrixSet=="c" ? "EPSG:4326" : "EPSG:3857",
			format: options.format || 'tiles',
			style: options.style || "default",	// 样式
			requestEncoding: 'KVP',
			wrapX: !!options.wrapDateLine,		// 日期变更线循环显示，只有在世界范围的地图上设为true
			matrixSet: matrixSet,	// 图层的瓦片格网集名称
			// attributions: [],
			tileGrid: new ol.tilegrid.WMTS(tileGridInfo)
		})
	});
};

/**
 * 根据授权码获取api服务详情信息
 * * @param {string} 授权码
 * * @param {string} 获取api详情信息的请求路径
 * * @param {function(success, data)} 回调方法，获取到api详情信息详情信息后通过回调函数返回
 */
zkygMap.getApiInfo = function(authCode, url, callback){
    if(authCode == null || authCode == "" || url == null || url == ""){
        alert("请传入授权码和请求地址");
        return;
    }

    zkygMap.util.ajax({
        dataType: 'JSONP',
        url: url,
        data : {authCode: authCode, getInfoType: 3},
        success: function(data, textStatus, ajax){
            ajax = null;
            if(data.code == 1){
                callback(true, data);
            }
            else{
                callback(false, '查询请求出错:' + data.msg);
            }
        },
        error: function(ajax, textStatus, responseText){
            ajax = null;
            if(typeof(callback) == 'function'){
                callback(false, '查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText);
           }
           else if(typeof(callback) == 'object' || typeof(callback) == 'undefined'){
               return '查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText;
           }
        }
    })
};

/**
 * 根据授权码获取已拼接好的ol.layer.tile列表
 * * @param {string} - authCode - 授权码
 * * @param {string} - url - 获取api详情信息的请求路径
 * * @param {string} - layerType - 拼接的图层类型：WMS/KVP/REST
 * * @param {string} - userName - 用户名：账号，用户名或手机号或邮箱，当api有认证授权且为令牌型，该项必填
 * * @param {string} - psd - 获取令牌的请求路径，当api有认证授权且为令牌型，该项必填
 * * @param {function(layerArr)} 回调方法，拼接好的图层信息通过回调函数返回
 */
zkygMap.getApiLayers = function(authCode, url, layerType, userName, psd, callback){
    if(authCode == null || authCode == "" || url == null || url == ""){
        alert("请传入授权码和请求地址");
        return;
    }
    zkygMap.getApiInfo(authCode, url, function(success, apiInfo){
        if(success){
            var layerArr = [];
            var vectorSource, vector;
            if(layerType == "WMSINFO"){
                // 准备接收高亮要素的图层
                vectorSource = new ol.source.Vector();
                vector = new ol.layer.Vector({
                    title: '选中要素',
                    source: vectorSource,
                    displayInLayerSwitcher: false,
                    style: new ol.style.Style({
                        image: new ol.style.Circle({	// 点样式
                            radius: 5,
                            fill: new ol.style.Fill({color: '#666666'}),
                            stroke: new ol.style.Stroke({color: '#bada55', width: 1})
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#f00',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255,0,0,0.1)'
                        }),
                        text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            fill: new ol.style.Fill({
                                color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#f00',
                                width: 3
                            })
                        })
                    })
                });
                zkygMap.default.map.addLayer(vector);
            }
            if(layerType == "WMS" || layerType == "WMSINFO"){
                for(var key in apiInfo){
                    if(key == "code"){
                        continue;
                    }
                    var layerInfo = apiInfo[key];                    
                    if(layerInfo.apiInfoMap.authType != null && layerInfo.apiInfoMap.authType == "token" && 
                        (userName == null || typeof(userName) != "string") && (psd == null || typeof(psd) != "string")){
                            alert("令牌型认证授权需要用户名密码");
                            return;
                    }
                    var joinupLayer = {};
                    joinupLayer.wmsUrl = layerInfo.WMSInfoMap.url;
                    joinupLayer.strProj = layerInfo.WMSInfoMap.srs;
                    joinupLayer.matrixSet = layerInfo.WMSInfoMap.tileMatrixSet;
                    joinupLayer.strExtent = layerInfo.WMSInfoMap.extent;
                    joinupLayer.format = layerInfo.WMSInfoMap.format;
                    joinupLayer.layers = layerInfo.WMSInfoMap.layers;
                    joinupLayer.title = layerInfo.apiInfoMap.title;
                    if(joinupLayer.matrixSet.length > 2){
                        joinupLayer.resnum = "0," + (joinupLayer.strProj == "EPSG:4326" ? joinupLayer.matrixSet.substring(2) : parseInt(joinupLayer.matrixSet.substring(2))+1)
                    }
                    else{
                        joinupLayer.resnum = "0," + (joinupLayer.strProj == "EPSG:4326" ? "18" : "19");
                    }
                    joinupLayer.visibility = false;
                    joinupLayer.isRenderExtentRestrict = true;
                    
                    if(layerInfo.apiInfoMap.authType != null){
                        var authInfo = {};
                        authInfo.type = layerInfo.apiInfoMap.authType;
                        if(layerInfo.apiInfoMap.authType == "token"){
                            authInfo.key = "token";
                            authInfo.value = "";
                            authInfo.tokenUrl = layerInfo.apiInfoMap.tokenUrl;
                            authInfo.user = userName;
                            authInfo.pwd = psd;
                        }
                        else if(layerInfo.apiInfoMap.authType == "key"){
                            authInfo.key = "ak";
                            authInfo.value = layerInfo.apiInfoMap.key;
                        }
                        joinupLayer.authInfo = authInfo;
                    }
                    if(isInfoMap){
                        joinupLayer.getFeatureInfo = true;	// 开启查询功能
                        // 准备触发查询的地图
                        joinupLayer.map = zkygMap.default.map;
                        joinupLayer.vectorSource = vectorSource;
                        joinupLayer.popup = zkygMap.layer.popup({targetId: 'popup', map: map});	// 准备显示的popup
                        joinupLayer.getFeatureInfoCallback = getFeatureInfoCallback;
                        joinupLayer.getFeatureInfoPointerMove = true;	// 使用图层非透明地方改变鼠标样式                        
                    }
                   var layer = zkygMap.layer.createWMSLayer(joinupLayer, false);
                    layerArr.push(layer);
                }
                callback(layerArr);
            }
            else if(layerType.toUpperCase() == "KVP" || layerType.toUpperCase() == "REST"){
                for(var key in apiInfo){
                    if(key == "code"){
                        continue;
                    }
                    var layerInfo = apiInfo[key];                    
                    if(layerInfo.apiInfoMap.authType != null && layerInfo.apiInfoMap.authType == "token" && 
                        (userName == null || typeof(userName) != "string") && (psd == null || typeof(psd) != "string")){
                            alert("令牌型认证授权需要用户名密码");
                            return;
                    }
                    var joinupLayer = {};
                    joinupLayer.title = layerInfo.apiInfoMap.title;
                    joinupLayer.requestEncoding = layerType;
                    if(layerType.toUpperCase() == "KVP"){
                        joinupLayer.wmtsKVPUrl = layerInfo.WMTSInfoMap.wmtsKVPUrl;
                    }
                    else if(layerType.toUpperCase() == "REST"){
                        joinupLayer.wmtsRestfulUrl = layerInfo.WMTSInfoMap.wmtsRestfulUrl;
                    }
                    joinupLayer.strProj = layerInfo.WMTSInfoMap.srs;
                    joinupLayer.format = layerInfo.WMTSInfoMap.format;
                    joinupLayer.matrixSet = layerInfo.WMTSInfoMap.tileMatrixSet;
                    joinupLayer.strExtent = layerInfo.WMTSInfoMap.extent;
                    joinupLayer.layers = layerInfo.WMTSInfoMap.layers;
                    if(joinupLayer.matrixSet.length > 2){
                        joinupLayer.resnum = "0," + (joinupLayer.strProj == "EPSG:4326" ? joinupLayer.matrixSet.substring(2) : parseInt(joinupLayer.matrixSet.substring(2))+1);
                    }
                    else{
                        joinupLayer.resnum = "0," + (joinupLayer.strProj == "EPSG:4326" ? "18" : "19");
                    }
                    joinupLayer.visibility = false;
                    joinupLayer.isRenderExtentRestrict = true;
                    
                    if(layerInfo.apiInfoMap.authType != null){
                        var authInfo = {};
                        authInfo.type = layerInfo.apiInfoMap.authType;
                        if(layerInfo.apiInfoMap.authType == "token"){
                            authInfo.key = "token";
                            authInfo.value = "";
                            authInfo.tokenUrl = layerInfo.apiInfoMap.tokenUrl;
                            authInfo.user = userName;
                            authInfo.pwd = psd;
                        }
                        else if(layerInfo.apiInfoMap.authType == "key"){
                            authInfo.key = "ak";
                            authInfo.value = layerInfo.apiInfoMap.key;
                        }
                        joinupLayer.authInfo = authInfo;
                    }                    
                   var layer = zkygMap.layer.createWMTSLayer(joinupLayer, false);
                   layerArr.push(layer);
                }
                callback(layerArr);
            }
        }
        else{
            alert("获取api信息失败,检查授权码和地址");
        }
    })

};
