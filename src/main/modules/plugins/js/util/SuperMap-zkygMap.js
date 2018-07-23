
/**
 * @requires SuperMap/Layer/WMS.js
 */

/**
 * Class: SuperMap.Layer.zkygWMS
 *  中科遥感服务图层类。
 *     用于显示由中科遥感发布的地图资源，使用<SuperMap.Layer.zkygWMS>的
 *
 *
 * 
 * Inherits from:
 *  - <SuperMap.Layer.CanvasLayer>
 */
SuperMap.Layer.zkygWMS = SuperMap.Class(SuperMap.Layer.WMS, {

    /**
     * 查询服务参数
     */
    INFOMAP: null,
    /**
     * popup 信息框
     */
    infoWindow: null,
    /**
     * 开启查询服务时需要传入地图对象
     */
    myMap: null,
    /**
     * 认证授权类型
     */
    authType: null,
    /**
     * 认证授权类型为令牌型时，记录获取令牌地址
     */
    tokenUrl:null,
     /**
      * 
     * Constructor: SuperMap.Layer.zkygWMS
     * 构造函数，实例化一个WMS的扩展类图层。
     *
     
     * Parameters:
     * name - {String} 图层标题，title
     * url - {Array(String) or String} 图层的服务地址，是数组也可以是单个url，前者支持多地图服务轮询出图，大大提高显示速度
     * params - {Object} 拥有键值对的对象。获取地图时查询字符串参数和参数值。
    *          layers - {String}  api服务名称，必填
    *          srs - {String}  api服务坐标系，必填
    *          format - {String}  加载的瓦片格式，选填
    *          service - {String}  ，选填
    *          version - {String}  ，选填
    *          request - {String}  ，选填
    *          tileHeight 瓦片的大小，选填
    *          tileWidth 瓦片的大小，选填
    *          queryInfo - {boolean} 需要提供信息产品查询服务时，该项为true。
                map - {Object} 需要提供信息产品查询服务时，地图对象必选
                info_format - {String} 需要提供信息产品查询服务时，期望查询结果格式，text/plain|application/vnd.ogc.gml|application/vnd.ogc.gml/3.1.1|text/html|application/json(默认)|text/javascript
                getFeatureInfo - {function} 获取到查询结果后的自定义后续操作，有默认操作。
            authType - {String} api服务有认证授权时该项必填，值为“key”(密钥型认证授权)或“token”(令牌型认证授权)
            value - {String} 认证授权的值，密钥型必填，token型选填（值为空时需要发送请求获取令牌）   
     * options - {Object} 在该类及其父类总开放的属性。
     *:
     *
     */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        //uppercase params

        var required = {
            layers: true,
            srs: true
        };
        for (var prop in required) {
            if (!(prop in params)) {
                throw new Error("Missing property '" + prop + "' in layer configuration.");
            }
        }

        var myParams = {};
        myParams.layers = params.layers;
        myParams.format = params.format == null ? "image/png" : params.format;
        myParams.srs = params.srs;
        myParams.service = params.service == null ? "WMS" : params.service;
        myParams.version = params.version == null ? "1.1.1" : params.version;
        myParams.request = params.request == null ? "GetMap" : params.request;
        myParams.styles = "";
        myParams.WIDTH = params.tileHeight == null ? 256 : params.tileHeight;
        myParams.HEIGHT = params.tileWidth == null ? 256 : params.tileWidth;

        myParams = SuperMap.Util.upperCaseObject(myParams);

        if(params.authType != null){
            if(params.authType != "key" && params.authType != "token"){
                throw new Error("Woring property 'authType' in layer configuration.");
            }
            if(params.authType == "key" && params.value != null){
                myParams.ak = params.value;
            }
            else if(params.authType == "key" && params.value == null){
                throw new Error("this layer has auth, Missing property 'value' in layer configuration.");
            }
            else if(params.authType == "token" && params.value != null){
                myParams.token = params.value;           
            }
        }

        newArguments.push(name, url, myParams, options);
        SuperMap.Layer.Grid.prototype.initialize.apply(this, newArguments);
        SuperMap.Util.applyDefaults(
                       this.params, 
                       SuperMap.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );
        this.authType = params.authType;
        if(params.authType == "token" && params.value == null){
            this.tokenUrl = params.tokenUrl;
        }
        var myThis = this;

        //拼接查询服务信息，注册点击事件
        if(params.queryInfo != null && params.map != null && params.queryInfo){            
            this.INFOMAP = {
                QUERY_LAYERS: params.layers,
                FEATURE_COUNT: 1,
                REQUEST: "GetFeatureInfo",
                INFO_FORMAT: params.info_format == null ? "application/json" : params.info_format
            };
            this.myMap = params.map;
            //when user want got getFeatureInfo to do something
            params.map.events.on({"click": function(e) {
                //获取当前点击位置的信息
                myThis.getFeatureInfo(e, myThis.INFOMAP.INFO_FORMAT, function(info) {
                    
                    if(params.getFeatureInfo != null && typeof(params.getFeatureInfo) == "function"){
                        params.getFeatureInfo(info);
                    }
                    else{
                        if(myThis.infoWindow){
                            myThis.infoWindow.hide();
                            myThis.infoWindow.destroy();
                        }
                        //add popup in map
                        //当前point的经纬度坐标=传入坐标-(当前页面高度-地图的高度)
                        var px1 = new SuperMap.Pixel(e.xy.x, e.xy.y);
                        var point1 = params.map.getLonLatFromPixel(px1);
                        var indexText = "";
                        for(var k = 0; k < info.features.length; k++){
                            var myIndo = info.features[k].properties;
                            for(var key in myIndo){
                                indexText += key + ": " + myIndo[key];
                            }
                        }
                        if(indexText.length <= 0){
                            indexText = "信息查询结果为空";
                        }
                        myThis.infoWindow = new SuperMap.Popup("chicken",
                            point1,
                            new SuperMap.Size(150,70),
                            indexText,
                            true);
                        myThis.infoWindow.closeOnMove = true;
                        params.map.addPopup(myThis.infoWindow);
                    }
                });
            }})            
        }
          

        if(this.params.FORMAT === "image/jpeg") {
            this.params.TRANSPARENT = false;
        }  
        else if(this.params.TRANSPARENT == null) {
            this.params.TRANSPARENT = true;
        }            

        


        //layer is transparent        
        if (!this.noMagic && this.params.TRANSPARENT && 
            this.params.TRANSPARENT.toString().toLowerCase() === "true") {
            
            // unless explicitly set in options, make layer an overlay
            if ( (options == null) || (options.isBaseLayer==false) ) {
                this.isBaseLayer = false;
            } 
            
            // jpegs can never be transparent, so intelligently switch the 
            //  format, depending on the browser's capabilities
            if (this.params.FORMAT === "image/jpeg") {
                this.params.FORMAT = SuperMap.Util.alphaHack() ? "image/gif"
                                                                 : "image/png";
            }
        }

    },  

    /**
     * 获取查询服务信息
     *  Parameters:
     *      e - {events} 点击监听事件的参数
     *      info_format - {String} 查询服务信息返回的类型
     *      callback  - {function} 获取查询服务信息后的回调方法
     */
    getFeatureInfo: function (e, info_format, callback){
        var dataType = 'json';
        if(info_format == 'text/plain'){
            dataType = 'text';
        }else if(info_format == 'application/vnd.ogc.gml' || info_format == 'application/vnd.ogc.gml/3.1.1'){
            dataType = 'xml';
        }else if(info_format == 'text/html'){
            dataType = 'html';
        }else if(info_format == 'text/javascript'){
            dataType = 'jsonp';
        }
        var QUERY_LAYERS = this.INFOMAP;
        if(QUERY_LAYERS == null || QUERY_LAYERS == undefined ||QUERY_LAYERS == ""){
             return "查询服务未设置";
        }      

        var newParams = this.INFOMAP;
        newParams.WIDTH = this.myMap.getSize().w;
        newParams.HEIGHT = this.myMap.getSize().h;
        newParams.INFO_FORMAT = info_format;
        if(parseFloat(this.params.VERSION) >= 1.3){
            newParams.CRS = this.params.SRS,
            newParams.I = e.clientX;
            newParams.J = e.clientY;
        }
        else{
            newParams.X = e.clientX;
            newParams.Y = e.clientY;
        }
        if(this.authType == "token" && this.params.token == null){
            //现有的令牌池中找该API的令牌
            for (var i = 0; i < zkyg.tokenPool.length; i++){
                if(zkyg.tokenPool[i].tokenUrl == this.tokenUrl && zkyg.tokenPool[i].layer == this.params.LAYERS){
                    newParams.token = zkyg.tokenPool[i].token;
                    break;
                }
            }
        }
        newParams.BBOX = this.getExtent().toBBOX(null, this.reverseAxisOrder());
        var url = this.getFullRequestString(newParams);     

        var obj = {
            dataType: dataType,
            url: url,
            success: function(data, textStatus, ajax){
                ajax = null;
                callback(data);
            },
            error: function(ajax, textStatus, responseText){
                console.error('查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText);
                return '查询请求出错:'+url+', textStatus:'+textStatus+', responseText:'+responseText;
                ajax = null;
            }
        }

        zkyg.util.ajax(obj);
    },

    
    /**
         * APIMethod: clone
         * 创建当前图层的副本
         * Parameters:
         * obj - {Object}
         * Returns:
         * {<SuperMap.Layer.ArcGIS93Rest>}
         */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new SuperMap.Layer.zkygWMS(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
        }

        //get all additions from superclasses
        obj = SuperMap.CanvasLayer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },
    
    
    /**
     * Method: getURL
     * 获取瓦片的URL。
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>} 瓦片的bounds。
     *
     * Returns:
     * {String} 瓦片的URL
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var imageSize = this.getImageSize();
        var newParams = {
            'WIDTH': imageSize.w,
            'HEIGHT': imageSize.h,
            // 'SRS': this.projection.getCode(),
            'BBOX': bounds.toBBOX()
        };
        if(this.authType == "token" && this.params.token == null){
            //现有的令牌池中找该API的令牌
            for (var i = 0; i < zkyg.tokenPool.length; i++){
                if(zkyg.tokenPool[i].tokenUrl == this.tokenUrl && zkyg.tokenPool[i].layer == this.params.LAYERS){
                    newParams.token = zkyg.tokenPool[i].token;
                    break;
                }
            }
        }

        // Now add the filter parameters.
        //设置图层筛选参数
        if (this.layerDefs) {
            var layerDefStrList = [];
            var layerID;
            for(layerID in this.layerDefs) {
                if (this.layerDefs.hasOwnProperty(layerID)) {
                    if (this.layerDefs[layerID]) {
                        layerDefStrList.push(layerID);
                        layerDefStrList.push(":");
                        layerDefStrList.push(this.layerDefs[layerID]);
                        layerDefStrList.push(";");
                    }
                }
            }
            if (layerDefStrList.length > 0) {
                newParams['LAYERDEFS'] = layerDefStrList.join("");
            }
        }
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },
    

    CLASS_NAME: "SuperMap.Layer.zkygWMS"
});




/**
 * @requires SuperMap/Layer/WMTS.js
 */

/**
 * Class: SuperMap.Layer.zkygWMTS
 
 * Inherits from:
 *  - <SuperMap.Layer.CanvasLayer>
 */
SuperMap.Layer.zkygWMTS = SuperMap.Class(SuperMap.Layer.WMTS, {
/**
     * Constructor: SuperMap.Layer.zkygWMTS
     * 创建该类的新实例。 
     *
     *
     * Parameters:
     * name - {String} 图层名称，如"世界地图"，必填。
     * config - {Object} 设置该类开放的属性。
     *      wmtsRestfulUrl - {Array(String) or String} REST方式的WMTS图层的服务地址，是数组也可以是单个url，前者支持多地图服务轮询出图，大大提高显示速度。
     *      wmtsKVPUrl - {Array(String) or String} KVP方式的WMTS图层的服务地址，是数组也可以是单个url，前者支持多地图服务轮询出图，大大提高显示速度。
     *      layer - {String} 图层标识符，必设参数。
     *      srs - {String} 图层坐标系，必设参数。
     *      tileMatrixSet - {String} 瓦片矩阵集标识符，必设参数
     *      tileWidth - {int} 瓦片大小，可选参数。
     *      tileHeight - {int} 瓦片大小，可选参数。
     *      resolutions - {Array(Number)} 分辨率数组，可选参数。
     *      origin - {String} 原点，可选参数。
     *      format - {String} 图片格式，可选参数。
     *      authType - {String} api服务有认证授权时该项必填，值为“key”(密钥型认证授权)或“token”(令牌型认证授权)
            value - {String} 认证授权的值，密钥型必填，token型选填（值为空时需要发送请求获取令牌）    
     *requestEncoding - {String} 请求方式，必设参数“REST”或“KVP”
     */
    initialize: function(name, config, requestEncoding) {
        var myUrl = "";
        //confirm required properties are supplied
        if(requestEncoding != null && requestEncoding == "REST"){
            var required = {
                wmtsRestfulUrl: true,
                layers: true,
                srs: true,
                tileMatrixSet: true
            };
            for (var prop in required) {
                if (!(prop in config)) {
                    throw new Error("Missing property '" + prop + "' in layer configuration.");
                }
            }
            myUrl = config.wmtsRestfulUrl;
        }
        else{
            var required = {
                wmtsKVPUrl: true,
                layers: true,
                srs: true,
                tileMatrixSet: true
            };
            for (var prop in required) {
                if (!(prop in config)) {
                    throw new Error("Missing property '" + prop + "' in layer configuration.");
                }
            }
            myUrl = config.wmtsKVPUrl;
            requestEncoding = "KVP";
        }

        myConfig = {
            url: myUrl,//REST请求url
            layer: config.layers,
            projection: config.srs,
            matrixSet: config.tileMatrixSet,
            style: "default",
            units: 'm',
            format: config.format == null ? "image/png" : config.format,
            requestEncoding: requestEncoding
        }
        
        if(config.tileWidth != null && config.tileHeight != null){
           myConfig.tileSize = new SuperMap.Size(config.tileWidth, config.tileHeight);
        }
        else{
            myConfig.tileSize = new SuperMap.Size(256,256);
        }
        if(config.origin != null){
            myConfig.tileOrigin = new SuperMap.LonLat(parseFloat(config.origin.split(",")[0]), parseFloat(config.origin.split(",")[1]));
        }
        else{
            if(config.srs == "EPSG:4326" || config.srs == "CRS:84" || config.srs == "EPSG:84"){
                myConfig.tileOrigin = new SuperMap.LonLat(-180, 90);
            }
            else{
                myConfig.tileOrigin = new SuperMap.LonLat(-20037508.342787,20037508.342787);
            }
        }
        //get resolutions by tileMatrixSet
        if (config.resolutions == null) {
            var srsi = config.tileMatrixSet.substring(0,2);
            var endIndex = 0;
            if (config.tileMatrixSet.length > 2)
                endIndex = parseInt(config.tileMatrixSet.substring(2));
            if (config.tileMatrixSet.length == 2) 
                endIndex = "ll" == srsi ? 18 : 19;
            
            var res0 = 156543.03394950466; 
            if (srsi == "ll") {
                res0 = 1.40625;
                endIndex = endIndex + 1;
            }
            var lods = [];
            for(var i=0; i <= endIndex; i++){
                var d = Math.pow(2, i);
                lods.push(parseFloat((res0/d).toFixed(8)));
            }
            myConfig.resolutions = lods; 
        }
        //join together with authType
        if(config.authType != null && config.authType == "key"){
            if(config.params == null){
                config.params = {};
            }
            config.params.ak = config.value;
        }
        else if(config.authType != null && config.authType == "token"){
            if(config.params == null){
                config.params = {};
            }
            //现有的令牌池中找该API的令牌
            for (var i = 0; i < zkyg.tokenPool.length; i++){
                if(zkyg.tokenPool[i].tokenUrl == config.tokenUrl && zkyg.tokenPool[i].layer == config.layers){
                    config.params.token = zkyg.tokenPool[i].token;
                    break;
                }
            }
        }

        config.params = SuperMap.Util.upperCaseObject(config.params);
        var args = [name, myConfig.url, config.params, myConfig];
        SuperMap.Layer.Grid.prototype.initialize.apply(this, args);       

        // determine format suffix (for REST)
        if (!this.formatSuffix) {
            this.formatSuffix = this.formatSuffixMap[this.format] || this.format.split("/").pop();            
        }
        //get matrixIds by matrixSet
        this.matrixIds = [];
        var endIndex = this.matrixSet.slice(2)|0;  // 瓦片矩阵标识最大层级索引
        if (endIndex === 0) {
            endIndex = this.matrixSet.slice(0, 2) == 'll' ? 18 : 19; // ll 相当于 ll18 ， mc 相当于 mc19
        }
        for(var i=0; i <= endIndex; i++){
            this.matrixIds[i] = {identifier: i<10 ? '0'+i : ''+i};
        }
        
    },


    /**
     * Method: getURL
     * 获取瓦片的URL。
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>} 瓦片的bounds。
     *
     * Returns:
     * {String} 瓦片的URL
     */
    getURL: function(bounds) {
        bounds = this.adjustBounds(bounds);
        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {            

            var center = bounds.getCenterLonLat();            
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
            var params;

            if (this.requestEncoding.toUpperCase() === "REST") {

                // include 'version', 'layer' and 'style' in tile resource url
                var context = {
                    // spec does not make clear if capital S or not
                    TileMatrixSet: this.matrixSet,
                    TileMatrix: this.matrix.identifier,
                    TileRow: info.row,
                    TileCol: info.col
                };
                
                if (SuperMap.Util.isArray(this.url)) {
                    url = this.selectUrl('', this.url);
                } else {
                    url = this.url;
                }                
                url = SuperMap.String.format(url.replace(/\{/g, "${"), context);

                // append optional dimension path elements
                if (this.params) {
                    for (var Key in this.params){
                        url += (url.lastIndexOf('?') === -1 ? '?' : '&') + Key + "=" + this.params[Key];
                    }
                }

            } else if (this.requestEncoding.toUpperCase() === "KVP") {

                // assemble all required parameters
                var params = {
                    SERVICE: "WMTS",
                    REQUEST: "GetTile",
                    VERSION: this.version,
                    LAYER: this.layer,
                    STYLE: this.style,
                    TILEMATRIXSET: this.matrixSet,
                    TILEMATRIX: this.matrix.identifier,
                    TILEROW: info.row,
                    TILECOL: info.col,
                    FORMAT: this.format
                };
                if (SuperMap.Credential.CREDENTIAL) {
                    params[SuperMap.Credential.CREDENTIAL.name] = SuperMap.Credential.CREDENTIAL.getValue();
                }

                url = SuperMap.Layer.Grid.prototype.getFullRequestString.apply(this, [params]);

            }
        }
        return url;    
    },

    /**
     * APIMethod: clone
     * 克隆此图层。
     * Parameters:
     * obj - {Object}
     * 
     * Returns:
     * {<SuperMap.Layer.WMTS>} 克隆 后的<SuperMap.Layer.WMTS>图层。
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new SuperMap.Layer.zkygWMTS(this.options);
        }
        //get all additions from superclasses
        obj = SuperMap.Layer.Grid.prototype.clone.apply(this, [obj]);
        // copy/set any non-init, non-simple values here
        return obj;
    },
    
    CLASS_NAME: "SuperMap.Layer.zkygWMTS"
});





