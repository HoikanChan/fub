var zkyg = {};
zkyg.util = {};  // 工具方法

zkyg.tokenPool = []; // 令牌定时维护池，关键字是图层名和令牌请求地址，

/**获取token
 * @param {String} username - 用户名
 * @param {String} psd - 密码
 * @param {String} layer - 图层名
 * @param {String} tokenUrl - 获取token的url
 * @return {String} 令牌
 */
zkyg.getToken = function(username, psd, layer, tokenUrl, callback){
    //现有的令牌池中找是否已存在该API的令牌
    for (var i = 0; i < zkyg.tokenPool.length; i++){
        if(zkyg.tokenPool[i].tokenUrl == tokenUrl && zkyg.tokenPool[i].layer == layer){
            if(typeof(callback) == 'function'){
                callback(zkyg.tokenPool[i].token);
            }
            else if(typeof(callback) == 'object' || typeof(callback) == 'undefined'){
                return zkyg.tokenPool[i].token;
            }
        }
    }

    //现有的令牌池中无该API的令牌，请求获取令牌
    var data = {USER: username, PW: psd, LAYER: layer};
    if(layer != ""){
        data.layers = layer;
    }
    var obj = {
        dataType: 'json',
        url: tokenUrl,
        data : data,
        success: function(data, textStatus, ajax){
            ajax = null;
            //定时，一天后更新该令牌
            var timer = window.setInterval(function(){zkyg.updataToken(tokenUrl, layer);}, 24 * 60 * 60 *1000);
            var tokenObj = {
                    layer: (layer == null || layer == undefined || layer.length <= 0)  ? "" : layer, 
                    tokenUrl : tokenUrl,
                    username : username,
                    psd : psd,
                    token: data.token, 
                    timer: timer
                };
            zkyg.tokenPool.push(tokenObj);
            if(typeof(callback) == 'function'){
                callback(data.token);
            }
            else if(typeof(callback) == 'object' || typeof(callback) == 'undefined'){
                return data.token;
            }
        },
        error: function(ajax, textStatus, responseText){
            ajax = null;
            console.error('查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText);
            callback('查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText);
        }
    };
    zkyg.util.ajax(obj);
};

/** 更新令牌
 * @param {String} layer - 图层名
 * @param {String} tokenUrl - 获取token的url
 * @return null
 */
zkyg.updataToken = function(tokenUrl, layer){
    for(var k = 0; k < zkyg.tokenPool.length; k++){
        if(zkyg.tokenPool[k].layer == layer && zkyg.tokenPool[k].tokenUrl == tokenUrl){
            window.clearInterval(zkyg.tokenPool[k].timer);
            var username, psd, layer, tokenUrl;
            username = zkyg.tokenPool[k].username;
            psd = zkyg.tokenPool[k].psd;
            layer = zkyg.tokenPool[k].layer;
            tokenUrl = zkyg.tokenPool[k].tokenUrl;
            zkyg.tokenPool.splice(k, 1);
            zkyg.getToken(username, psd, layer, tokenUrl);
        }
    }
};

/**获取API详情信息 
 *  @param {String} authCode - 授权码
 *  @param {String} url - 查询地址
 *  @return {obj} 
*/
zkyg.getApiInfo = function(authCode, url, username, psd, callback){
    if(authCode == null || authCode == ""){
        callback(false, "请传入授权码");
    }
    
    var obj = {
        dataType: 'JSONP',
        url: url,
        data : {authCode: authCode, getInfoType: 3},
        success: function(data, textStatus, ajax){
            ajax = null;
            var isToken = false;
            //遍历获取的API信息，token类型的直接请求获取令牌，写入tokenPool
            if(data.code == 1){
                var i = 0;
                for(var key in data){
                    if(key == "code"){
                        i++;
                        continue;
                    }
                    var apiInfo = data[key].apiInfoMap;
                    if(apiInfo != null && apiInfo.authType == "token"){
                        if(username == null || username == "" || psd == null || psd == ""){
                            callback(false, "请传入用户名密码");
                            return;
                        }
                        isToken = true;
                        zkyg.getToken(username, psd, apiInfo.name, apiInfo.tokenUrl, function(a){                            
                            i++;
                            if(i == Object.getOwnPropertyNames(data).length){
                                if(typeof(callback) == 'function'){
                                    callback(true, data);
                                }
                                else if(typeof(callback) == 'object' || typeof(callback) == 'undefined'){
                                    return data;
                                }
                            }
                        });
                    }
                    else{
                        break;
                    }
                }
            }
            //非令牌类型api直接返回拼接成图层
            if(!isToken){
                if(typeof(callback) == 'function'){
                    callback(true, data);
                }
                else if(typeof(callback) == 'object' || typeof(callback) == 'undefined'){
                    return data;
                }
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
    };
    zkyg.util.ajax(obj);
};

zkyg.automaticRelease = function(authCode, url, username, psd, releaseType, callback){
    zkyg.getApiInfo(authCode, url, username, psd, function(s, apiInfos){
        if(!s || apiInfos.code != 1 || apiInfos.length <= 1){
            callback([]);
            return;
        }

		var layerArr = [];
        if(releaseType == "WMS"){
            for(var layer in apiInfos){
                if(layer == "code"){
                    continue;
                }
			    var wms = apiInfos[layer].WMSInfoMap;
                var zkygWMS = new SuperMap.Layer.zkygWMS(
                    apiInfos[layer].apiInfoMap.title,
                    wms.url,
                    wms,
                    {}
                );	
			    layerArr.push(zkygWMS);	
            }
            callback(layerArr);
            return;
        }
        else if(releaseType == "KVP"){
            for(var layer in apiInfos){
                if(layer == "code"){
                    continue;
                }
			    var wmts = apiInfos[layer].WMTSInfoMap;
                var layer = new SuperMap.Layer.zkygWMTS(
                    "World",
                    wmts,
                    "KVP"
                );
			    layerArr.push(layer);	
            }
            callback(layerArr);
            return;
        }
        else if(releaseType == "REST"){
            for(var layer in apiInfos){
                if(layer == "code"){
                    continue;
                }
			    var wmts = apiInfos[layer].WMTSInfoMap;
                var layer = new SuperMap.Layer.zkygWMTS(
                    "World",
                    wmts,
                    "REST"
                );
			    layerArr.push(layer);	
            }
            callback(layerArr);
            return;
        }
    })
};



/**异步请求 
 *  @param {Object} obj - 请求参数对象
 *  @return {function} obj.success 请求成功执行的方法
 *  @return {function} obj.error 请求失败执行的方法
*/
zkyg.util.ajax = function(obj) {
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
        obj.data = zkyg.util.obj2StrForAjaxParams(obj.data);
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
            obj.data = zkyg.util.obj2StrForAjaxParams(obj.data);
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
 * 将对象转换成查询字符串参数形式
 * @param {Object} obj - 对象
 * @returns {string} - 转换结果字符串
 */
zkyg.util.obj2StrForAjaxParams = function(obj) {
    if (typeof(obj) === "object") {
        var arr = [];
        for (var i in obj){
            var str = i + "=" + obj[i];
            arr.push(str);
        }
        obj = encodeURI(arr.join("&"));
    }
    return obj;
};