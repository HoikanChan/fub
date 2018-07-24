
var pageSize = 12;
var $cityInput;
function init_city_select($inputE) {
	var html = "";
	html += '<div class="provinceCityAll">';
	html += '<div class="tabs clearfix">';
	html += '<ul>';
	html += '<li><a tb="provinceAll" id="provinceAll" class="current">省份</a></li>';
	html += '<li><a tb="cityAll" id="cityAll">城市</a></li>';
	// html += '<li><a tb="countyAll" id="countyAll">区/县</a></li>';
	html += '</ul>';
	html += '</div>';
	html += '<div class="con">';
	html += '<div class="provinceAll">';
	html += '<div class="pre"><a><span class="glyphicon glyphicon-menu-left"></span></a></div>';
	html += '<div class="list"><ul></ul></div>';
	html += '<div class="next"><a><span class="glyphicon glyphicon-menu-right"></span></a></div>';

	html += '</div>';
	html += '<div class="cityAll">';
	html += '<div class="pre"><a><span class="glyphicon glyphicon-menu-left"></span></a></div>';
	html += '<div class="list"><ul></ul></div>';
	html += '<div class="next"><a><span class="glyphicon glyphicon-menu-right"></span></a></div>';
	html += '</div>';
	html += '<div class="province-comfime clear"><span>确定</span></div>';
	// html += '<div class="countyAll">';
	// html += '<div class="pre"><a></a></div>';
	// html += '<div class="list"><ul></ul></div>';
	// html += '<div class="next"><a></a></div>';
	// html += '</div>';
	html += '</div>';
	html += '</div>';
	$(".provinceCityAll").remove();
	$("body").append(html);
	if (!allProvince) {
		getAllProvince();
	}
	if (!allCity) {
		getAllCity();
	}
	if (!allCounty) {
		getAllCounty();
	}
	$(document).on("click",function(event){
		$(".provinceCityAll").hide();
	});
	$(".provinceCityAll").on("click", function(event) {
			event.stopPropagation();
	});
	$(".province-comfime span").on("click", function(event) {
		$(".provinceCityAll").hide();
		var id = $(".province-comfime span").attr("id");
		var name =$(".province-comfime span").attr("title");
		$("#area-select").attr("area-id",id);
		$("#area-select").val(name)
		console.log("123")
});

	$inputE.on("click", function(event){
		$cityInput = $(this);
		$(".provinceCityAll").css({
			"left": $(this).offset().left + "px",
			"top": $(this).offset().top + $(this).height() + 3 + "px",
		}).toggle();
		getProvinceCityCounty($cityInput);
		event.stopPropagation();
	});
	$(".provinceCityAll .tabs li a").on("click", function(){
		if ($(this).attr("tb") == "cityAll" && $(".provinceAll .list .current").length < 1) {
			return;
		};
		// if ($(this).attr("tb") == "countyAll" && $(".cityAll .list .current").length < 1) {
		// 	return;
		// };
		$(this).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
		$(".provinceCityAll .con").find("." + $(this).attr("tb")).show().siblings().hide();
	});

	var provicelist = [];
 var citylist = [];
	$({type:1})._Ajax({
		url: "sys/region/getAreaByType",
		success: function (result) {
						if (result.code==0) {
							var data = 	result.list
							for(var i=0;i<data.length;i++){
								provicelist += '{"id":"' + data[i].agencyId +'","name":"'+ data[i].name +'"},';
							}
							provicelist = "["+provicelist+"]";
							provicelist = provicelist.replace(",]","]");
					sessionStorage.setItem("province",provicelist)
						}
		}
	
	}); 
	$({type:2})._Ajax({
		url: "sys/region/getAreaByType",
		success: function (result) {
						if (result.code==0) {
							var datas = 	result.list
							for(var i=0;i<datas.length;i++){
								citylist += '{"provinceId":"' + datas[i].parentId +'","name":"'+ datas[i].name +'","id":"'+datas[i].id+'"},';
							}
							citylist = "["+citylist+"]";
							citylist = citylist.replace(",]","]");
					sessionStorage.setItem("city",citylist)
						}
		}
	
	}); 

}

function getProvinceCityCounty($cityInput) {
	if ($cityInput) {
		$(".provinceAll .list ul").empty();
		$(".cityAll .list ul").empty();
		// $(".countyAll .list ul").empty();
		
		var pccName = $cityInput.val().split("-");
		if (pccName.length == 3) {
			var provinceName = pccName[0];
			var provinceId;
			var provinceIndex;
			$.each(allProvince, function(i){
				if (this.name == provinceName) {
					provinceId = this.id;
					provinceIndex = i;
					return;
				}
			});
			
			var cityName = pccName[1];
			var cityId;
			var cityIndex;
			if (provinceId) {
				var prvinceAllCity = allCityMap.get(id);
				$.each(prvinceAllCity, function(i){
					if (this.name == cityName) {
						cityId = this.id;
						cityIndex = i;
						return;
					}
				});
			}
			
			var countyName = pccName[2];
			var countyId;
			var countyIndex;
			if (cityId) {
				var cityAllcounty = allCountyMap.get(cityId);
				$.each(cityAllcounty, function(i){
					if (this.name == countyName) {
						countyId = this.id;
						countyIndex = i;
						return;
					}
				});
			}
			
			if (countyId) {
				var currentProvincePage = Math.ceil((provinceIndex + 1) / pageSize);
				var currentCityPage = Math.ceil((cityIndex + 1) / pageSize);
				var currentCountyPage = Math.ceil((countyIndex + 1) / pageSize);
				provincePage(currentProvincePage);
				cityPage(provinceId, currentCityPage);
				countyPage(cityId, currentCountyPage);
				var prvinceName = $("#" + provinceId).addClass("current");
				var cityName = $("#" + cityId).addClass("current");
				var countyName = $("#" + countyId).addClass("current");
				// $("#countyAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
				// $(".provinceCityAll .con .countyAll").show().siblings().hide();
				return;
			}
		}
	}
	viewProvince();
}

function viewProvince() {
	$(".provinceCityAll .con .provinceAll").show().siblings().hide();
	$("#provinceAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
	provincePage(1);
}



function provincePage(currentProvincePage) {
	$(".provinceAll .pre a, .provinceAll .next a").removeClass("can");
	var totalPage = Math.ceil(allProvince.length / pageSize);
	if (totalPage > 1) {
		if (currentProvincePage == 1) {
			$(".provinceAll .pre a").removeClass("can").removeAttr("onclick");
			$(".provinceAll .next a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage+1) + ");");
		} else if (currentProvincePage > 1 && currentProvincePage < totalPage) {
			$(".provinceAll .pre a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage-1) + ");");
			$(".provinceAll .next a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage+1) + ");");
		} else {
			$(".provinceAll .pre a").addClass("can").attr("onclick", "provincePage(" + (currentProvincePage-1) + ");");
			$(".provinceAll .next a").removeClass("can").removeAttr("onclick");
		}
	} else {
		$(".provinceAll .pre a").removeClass("can").removeAttr("onclick");
		$(".provinceAll .next a").removeClass("can").removeAttr("onclick");
	}
	var start = (currentProvincePage - 1) * pageSize;
	var end = currentProvincePage  * pageSize;
	if (currentProvincePage == totalPage) {
		end = allProvince.length;
	}
	var html = "";
	for (var i = start; i < end; i++) {		
		var provinceName = allProvince[i].name;
		if (provinceName == '内蒙古自治区') {
			provinceShortName = '内蒙古';
		} else if (provinceName == '黑龙江省') {
			provinceShortName = '黑龙江';
		} else {
			provinceShortName = provinceName.substr(0, 2);
		}
		var provinceId = allProvince[i].id;
		html += '<li><a onclick="viewCity(\'' + provinceId + '\');" id="' + provinceId + '" title="' + provinceName + '">' + provinceShortName + '</a></li>';
	
	}
	$(".provinceAll .list ul").html(html);
	
}

function viewCity(provinceId) {
	$("#" + provinceId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
	var proname = $("#"+provinceId).attr("title");
	$(".provinceCityAll .con .cityAll").show().siblings().hide();
	$("#cityAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
$(".province-comfime span").attr("id",provinceId);
$(".province-comfime span").attr("title",proname);
	cityPage(provinceId, 1);
	$(".province-comfime").show()
}



function cityPage(provinceId, currentCityPage) {
	var provinceAllCity = allCityMap.get(provinceId);
	var totalPage = Math.ceil(provinceAllCity.length / pageSize);
	$(".cityAll .pre a, .cityAll .next a").removeClass("can");
	if (totalPage > 1) {
		if (currentCityPage == 1) {
			$(".cityAll .pre a").removeClass("can").removeAttr("onclick");
			$(".cityAll .next a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage+1) + ");");
		} else if (currentCityPage > 1 && currentCityPage < totalPage) {
			$(".cityAll .pre a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage-1) + ");");
			$(".cityAll .next a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage+1) + ");");
		} else {
			$(".cityAll .pre a").addClass("can").attr("onclick", "cityPage('" + provinceId + "'," + (currentCityPage-1) + ");");
			$(".cityAll .next a").removeClass("can").removeAttr("onclick");
		}
	} else {
		$(".cityAll .pre a").removeClass("can").removeAttr("onclick");
		$(".cityAll .next a").removeClass("can").removeAttr("onclick");
	}
	var start = (currentCityPage - 1) * pageSize;
	var end = currentCityPage  * pageSize;
	if (currentCityPage == totalPage) {
		end = provinceAllCity.length;
	}
	var html = "";
	for (var i = start; i < end; i++) {		
		var cityName = provinceAllCity[i].name;
		var cityShortName = cityName.substring(0, 4);

		var cityId = provinceAllCity[i].id;
		
		html += '<li><a onclick="viewAll(\'' + cityId + '\');" id="' + cityId + '" title="' + cityName + '">' + cityShortName + '</a></li>';
	
	
	}
	$(".cityAll .list ul").html(html);
	
}

// function viewCounty(cityId) {
// 	$("#" + cityId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
// 	$(".provinceCityAll .con .countyAll").show().siblings().hide();
// 	$("#countyAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
// 	countyPage(cityId, 1);
// }

// function countyPage(cityId, currentCountyPage) {
// 	var cityAllCounty = allCountyMap.get(cityId);
// 	var totalPage = Math.ceil(cityAllCounty.length / pageSize);
// 	$(".countyAll .pre a, .countyAll .next a").removeClass("can");
// 	if (totalPage > 1) {
// 		if (currentCountyPage == 1) {
// 			$(".countyAll .pre a").removeClass("can").removeAttr("onclick");
// 			$(".countyAll .next a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage+1) + ");");
// 		} else if (currentCountyPage > 1 && currentCountyPage < totalPage) {
// 			$(".countyAll .pre a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage-1) + ");");
// 			$(".countyAll .next a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage+1) + ");");
// 		} else {
// 			$(".countyAll .pre a").addClass("can").attr("onclick", "countyPage('" + cityId + "'," + (currentCountyPage-1) + ");");
// 			$(".countyAll .next a").removeClass("can").removeAttr("onclick");
// 		}
// 	} else {
// 		$(".countyAll .pre a").removeClass("can").removeAttr("onclick");
// 		$(".countyAll .next a").removeClass("can").removeAttr("onclick");
// 	}
// 	var start = (currentCountyPage - 1) * pageSize;
// 	var end = currentCountyPage  * pageSize;
// 	if (currentCountyPage == totalPage) {
// 		end = cityAllCounty.length;
// 	}
// 	var html = "";
// 	for (var i = start; i < end; i++) {		
// 		var countyName = cityAllCounty[i].name;
// 		var countyShortName = countyName.substring(0, 4);
// 		var countyId = cityAllCounty[i].id;
// 		html += '<li><a onclick="viewAll(\'' + countyId + '\');" id="' + countyId + '" title="' + countyName + '">' + countyShortName + '</a></li>';
// 	}
// 	$(".countyAll .list ul").html(html);
// }

function viewAll(countyId) {
	$("#" + countyId).addClass("current").closest("li").siblings("li").find("a").removeClass("current");
	$(".provinceCityAll").hide();
	var prvinceName = $(".provinceAll .list li a.current").attr("title");
	var cityName = $(".cityAll .list li a.current").attr("title");
//	var countyName = $(".countyAll .list li a.current").attr("title");
//	$cityInput.val(prvinceName + "-" + cityName + "-" + countyName);
$cityInput.val(prvinceName + "-" + cityName);
 $cityInput.attr("area-id",countyId)
}



var allProvince;
var allCity;
var allCounty;
var allCityMap = new Map();
var allCountyMap = new Map();

function getAllProvince() {
	

	allProvinces = sessionStorage.getItem("province");
 allProvince = $.parseJSON(allProvinces)

	
 }

function getAllCity() {
	allCitys = sessionStorage.getItem("city");
	allCity = $.parseJSON(allCitys)

	$.each(allCity, function(){
		var cityArr = allCityMap.get(this.provinceId);
		if (!cityArr) {
			cityArr = [];
		}
		cityArr.push({"id": this.id, "name": this.name});
		allCityMap.put(this.provinceId, cityArr);
	});
}


function getAllCounty(){
	allCounty = {}
	$.each(allCounty, function(){
		var countyArr = allCountyMap.get(this.cityId);
		if (!countyArr) {
			countyArr = [];
		}
		countyArr.push({"id": this.id, "name": this.name});
		allCountyMap.put(this.cityId, countyArr);
	});
}

//定义map       
function Map() {
	this.container = {};
}
// 将key-value放入map中
Map.prototype.put = function(key, value) {
	try {
		if (key != null && key != "")
			this.container[key] = value;
	} catch (e) {
		return e;
	}
};
// 根据key从map中取出对应的value
Map.prototype.get = function(key) {
	try {
		return this.container[key];
	} catch (e) {
		return e;
	}
};
// 判断map中是否包含指定的key
Map.prototype.containsKey = function(key) {
	try {
		for ( var p in this.container) {
			if (p == key)
				return true;
		}
		return false;
	} catch (e) {
		return e;
	}
}
// 判断map中是否包含指定的value
Map.prototype.containsValue = function(value) {
	try {
		for ( var p in this.container) {
			if (this.container[p] === value)
				return true;
		}
		return false;
	} catch (e) {
		return e;
	}
};
// 删除map中指定的key
Map.prototype.remove = function(key) {
	try {
		delete this.container[key];
	} catch (e) {
		return e;
	}
};
// 清空map
Map.prototype.clear = function() {
	try {
		delete this.container;
		this.container = {};

	} catch (e) {
		return e;
	}
};
// 判断map是否为空
Map.prototype.isEmpty = function() {
	if (this.keyArray().length == 0)
		return true;
	else
		return false;
};
// 获取map的大小
Map.prototype.size = function() {
	return this.keyArray().length;
}

// 返回map中的key值数组
Map.prototype.keyArray = function() {
	var keys = new Array();
	for ( var p in this.container) {
		keys.push(p);
	}
	return keys;
}
// 返回map中的value值数组
Map.prototype.valueArray = function() {
	var values = new Array();
	var keys = this.keyArray();
	for ( var i = 0; i < keys.length; i++) {
		values.push(this.container[keys[i]]);
	}
	return values;
}

/**
 @Name : jeDate v6.0.2 日期控件
 @Author: chen guojun
 @Date: 2017-11-02
 @QQ群：516754269
 @官网：http://www.jemui.com/ 或 https://github.com/singod/jeDate
 */
;(function(root, factory) {
    //amd
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        root.jeDate = factory();
    }
})(this, function() {
    // 验证是否引用jquery
    if (!$ || !$.fn || !$.fn.jquery) {
        alert('在引用jquery.jedate.js之前，先引用jQuery，否则无法使用 jeDate');
        return;
    }
    var jet = {}, doc = document, regymdzz = "YYYY|MM|DD|hh|mm|ss|zz", gr = /\-/g,
        regymd = "YYYY|MM|DD|hh|mm|ss|zz".replace("|zz",""),
        parseInt = function (n) { return window.parseInt(n, 10);},
        config = {
            skinCell:"jedateblue",
            language:{
                name  : "cn",
                month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                weeks : [ "日", "一", "二", "三", "四", "五", "六" ],
                times : ["小时","分钟","秒数"],
                titText: "请选择日期时间",
                clear : "清空",
                today : "现在",
                yes   : "确定",
                close : "关闭"
            },
            range:false,
            trigger:"click",
            format:"YYYY-MM-DD hh:mm:ss", //日期格式
            minDate:"1900-01-01 00:00:00", //最小日期
            maxDate:"2099-12-31 23:59:59" //最大日期
        };
    $.fn.jeDate = function(options){
        return new jeDate($(this),options||{});
    };
    $.extend({
        jeDate:function(elem, options){
            return new jeDate($(elem),options||{});
        }
    });
    jet.isObj = function (obj){
        for(var i in obj){return true;}
        return false;
    };
    jet.reMatch = function (str) {
        return str.match(/\w+|d+/g);
    };
    jet.docScroll = function(type) {
        type = type ? "scrollLeft" :"scrollTop";
        return document.body[type] | document.documentElement[type];
    };
    jet.docArea = function(type) {
        return document.documentElement[type ? "clientWidth" :"clientHeight"];
    };
    //判断是否闰年
    jet.isLeap = function(y) {
        return (y % 100 !== 0 && y % 4 === 0) || (y % 400 === 0);
    };
    //补齐数位
    jet.digit = function(num) {
        return num < 10 ? "0" + (num | 0) :num;
    };
    //判断是否为数字
    jet.isNum = function(value){
        return /^[+-]?\d*\.?\d*$/.test(value) ? true : false;
    };
    //获取本月的总天数
    jet.getDaysNum = function(y, m) {
        var num = 31;
        switch (parseInt(m)) {
            case 2: num = jet.isLeap(y) ? 29 : 28; break;
            case 4: case 6: case 9: case 11: num = 30; break;
        }
        return num;
    };
    //获取月与年
    jet.getYM = function(y, m, n) {
        var nd = new Date(y, m - 1);
        nd.setMonth(m - 1 + n);
        return {
            y: nd.getFullYear(),
            m: nd.getMonth() + 1
        };
    };
    //获取上个月
    jet.prevMonth = function(y, m, n) {
        return jet.getYM(y, m, 0 - (n || 1));
    };
    //获取下个月
    jet.nextMonth = function(y, m, n) {
        return jet.getYM(y, m, n || 1);
    };
    //转换日期格式
    jet.parse = function(ymdhms, format) {
        return format.replace(new RegExp(regymdzz,"g"), function(str, index) {
            return str == "zz" ? "00":jet.digit(ymdhms[str]);
        });
    };
    jet.isparmat = function(format) {
        var remat = jet.reMatch(format), mat = regymdzz.split("|"), tmpArr = [];
        $.each(mat,function (m,mval) {
            $.each(remat,function (r,rval) {
                if (mval == rval) tmpArr.push(rval);
            });
        });
        return tmpArr.join("-");
    };

    jet.parseOld = function(ymd, hms, format) {
        ymd = ymd.concat(hms);
        var ymdObj = {}, mat = regymdzz.split("|"),
            remat = jet.reMatch(format);
        $.each(ymd,function (i,val) {
            ymdObj[remat[i]] = parseInt(val);
        });
        return format.replace(new RegExp(regymdzz,"g"), function(str, index) {
            return str == "zz" ? "00":jet.digit(ymdObj[str]);
        });
    };
    //验证日期格式
    jet.checkFormat = function(format) {
        var ymdhms = [];
        format.replace(new RegExp(regymdzz,"g"), function(str, index) {
            ymdhms.push(str);
        });
        return ymdhms.join("-");
    };
    jet.splMatch = function(str) {
        var timeArr = str.split(" ");
        return jet.reMatch(timeArr[0]);
    };
    jet.mlen = function (format) {
        var matlen = format.match(/\w+|d+/g).length,
            mathh = (format.substring(0, 2) == "hh"),
            lens = mathh&&matlen<=3 ? 7 : matlen;
        return lens;
    };
    //验证日期
    jet.checkDate = function (date) {
        var dateArr = jet.reMatch(date);
        if (isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) return false;
        if (dateArr[1] > 12 || dateArr[1] < 1) return false;
        if (dateArr[2] < 1 || dateArr[2] > 31) return false;
        if ((dateArr[1] == 4 || dateArr[1] == 6 || dateArr[1] == 9 || dateArr[1] == 11) && dateArr[2] > 30) return false;
        if (dateArr[1] == 2) {
            if (dateArr[2] > 29) return false;
            if ((dateArr[0] % 100 == 0 && dateArr[0] % 400 != 0 || dateArr[0] % 4 != 0) && dateArr[2] > 28) return false;
        }
        return true;
    };
    //返回日期
    function DateTime() {
        var ND = new Date(), that = this;
        //返回一个数值相同的新GetDateTime对象 
        that.reDate = function () {
            return new DateTime();
        };
        //返回此实例的Date值 
        that.GetValue = function () {
            return ND;
        };
        //获取此实例所表示日期的年份部分。 
        that.GetFullYear = function () {
            return ND.getFullYear();
        };
        //获取此实例所表示日期的月份部分。 
        that.GetMonth = function () {
            return ND.getMonth() + 1;
        };
        //获取此实例所表示日期的小时部分。 
        that.GetHours = function () {
            return ND.getHours();
        };
        //获取此实例所表示的日期为该月中的第几天。 
        that.GetDate = function () {
            return ND.getDate();
        };
        //获取此实例所表示日期的分钟部分。 
        that.GetMinutes = function () {
            return ND.getMinutes();
        };
        //获取此实例所表示日期的秒部分。 
        that.GetSeconds = function () {
            return ND.getSeconds();
        };
    }
    //获取返回的日期
    jet.GetDateTime = function (obj,format) {
        format = format || 'YYYY-MM-DD hh:mm:ss';
        var objVal = $.extend({YYYY:null,MM:null,DD:null,hh:0,mm:0,ss:0},obj),
            matArr = {YYYY:"FullYear",MM:"Month",DD:"Date",hh:"Hours",mm:"Minutes",ss:"Seconds"};
        
        var result = new DateTime().reDate();
        $.each(["ss","mm","hh","DD","MM","YYYY"],function (i,mat) {
            if (!jet.isNum(parseInt(objVal[mat]))) return null;
            var reVal = result.GetValue();
            if (parseInt(objVal[mat]) || parseInt(objVal[mat]) == 0){
                reVal["set"+matArr[mat]](result["Get"+matArr[mat]]() + (mat == "MM" ? -1 : 0) + parseInt(objVal[mat]));
            }
        });
        //获取格式化后的日期
        var reParse = jet.parse({
            YYYY:result.GetFullYear(), MM:result.GetMonth(), DD:result.GetDate(),
            hh:result.GetHours(), mm:result.GetMinutes(), ss:result.GetSeconds()
        }, format);
        return reParse;
    };

    //判断元素类型
    jet.isValHtml = function(elem) {
        return /textarea|input/.test(elem[0].tagName.toLocaleLowerCase());
    };
    jet.isBool = function(obj){  return (obj == undefined || obj == true ?  true : false); };
    var searandom = function (){
        var str = "",arr = [1,2,3,4,5,6,7,8,9,0];
        for(var i=0; i<8; i++) str += arr[Math.round(Math.random() * (arr.length-1))];
        return str;
    };
    function jeDate(elem, opts){
        this.opts = opts;
        this.valCell = elem;
        this.format = this.opts.format;
        this.initdates();
    }
    var jedfn = jeDate.prototype, jefix = "jefixed",matArr = jet.reMatch(regymdzz);
    jedfn.initdates = function () {
        var that = this, opts = that.opts, newDate = new Date(),
            jetrigger = opts.trigger != undefined ? opts.trigger : config.trigger,
            zIndex = opts.zIndex == undefined ? 10000 : opts.zIndex,
            isinitVal = (opts.isinitVal == undefined || opts.isinitVal == false) ? false : true;
        var randomCell = "#jedatebox"+searandom(),isShow = jet.isBool(opts.isShow);
        that.areaVal = [];
        opts.range = opts.range || config.range;
        that.fixed = jet.isBool(opts.fixed);
        var formatDate = function (cls,boxcell) {
            var dateDiv = $("<div/>",{"id":boxcell.replace(/\#/g,""),"class":"jedatebox "+(opts.skinCell || config.skinCell)}),
                reabsfix = !isShow ? "relative" : (that.fixed == true ? "absolute" :"fixed");
            dateDiv.attr("author","chen guojun").css({"z-index": boxcell != "#jedatebox" ? "" : zIndex ,"position":reabsfix});
            if(boxcell != "#jedatebox") dateDiv.attr({"jeformat":opts.format || config.format,"jefixed":randomCell});
            var min = config.minDate.split(" "), max = config.maxDate.split(" ");
            jet.minDate = (!/\-/g.test(opts.minDate)&&opts.minDate!=undefined ? min[0]+" "+opts.minDate : opts.minDate) || config.minDate;
            jet.maxDate = (!/\-/g.test(opts.maxDate)&&opts.maxDate!=undefined ? max[0]+" "+opts.maxDate : opts.maxDate) || config.maxDate;
            jet.boxelem = !isShow ? boxcell : "#jedatebox";
            that.format = !isShow ? dateDiv.attr("jeformat") : (opts.format || config.format);
            var vals = that.getValue({});
            $(cls).append(dateDiv);
            that.renderHtml(vals[0].YYYY, vals[0].MM,vals[0].DD, opts,jet.boxelem);
        };
        //为开启初始化的时间设置值
        if (isinitVal && jetrigger) {
            //opts.range = undefined;
            var ndate = opts.initDate || [], reVal;
            if (ndate[1]){
                var addval = jet.reMatch(jet.GetDateTime(ndate[0]));
                reVal = [{YYYY:addval[0], MM:jet.digit(addval[1]), DD:jet.digit(addval[2]) , hh:jet.digit(addval[3]), mm:jet.digit(addval[4]), ss:jet.digit(addval[5]) }];
            }else {
                reVal = that.getValue(jet.isObj(ndate[0]) ? ndate[0] : {});
            }
            that.setValue(reVal[0],opts.format || config.format);
        }
        //判断固定元素是否存在
        if(!isShow){
            formatDate(that.valCell,randomCell);
        }else {
            //insTrigger的值为true时内部默认点击事件
            var jd = ["body","#jedatebox"];
            if (jetrigger) {
                that.valCell.on(jetrigger, function (ev) {
                    ev.stopPropagation();
                    if ($(jd[1]).length > 0) return;
                    formatDate(jd[0],jd[1]);
                });
            }else {
                formatDate(jd[0],jd[1]);
            }
        }
    };
    jedfn.parseFormat = function(ymdhms,format) {
        return jet.parse(ymdhms,format);
    };
    //转换日期值
    jedfn.parseValue = function (fnStr,matStr) {
        var that = this, valArr=[],opts = that.opts, setVal = "",elm = $(jet.boxelem),
            formats = matStr == undefined ? ($(elm.attr(jefix)).length > 0 ? elm.attr("jeformat") : that.format) : matStr,
            dateStr = $.isFunction(fnStr) ? fnStr() : fnStr;
        if (dateStr != "" || dateStr.length > 0 ){
            var unrange = opts.range != false,
                rangeArr = new Array(unrange ? 2 : 1);
            $.each(rangeArr,function (i) {
                var rangLen = rangeArr.length == 2,ymdObj = {},parmat = jet.reMatch(formats),
                    ranArr = rangLen ? dateStr.split(opts.range) : dateStr;
                if (rangLen){
                    $.each(jet.reMatch(ranArr[i]),function (r,val) {
                        ymdObj[jet.mlen(that.format) == 7 ? parmat[r] : matArr[r]] = val;
                    });
                }
                valArr.push(that.parseFormat((rangLen ? ymdObj : ranArr), formats));
                ymdObj = {};
            });
            setVal = valArr.join(unrange ? opts.range : "");
        }
        return setVal;
    };
    //设置日期值
    jedfn.setValue = function (fnStr,matStr,bool) {
        var that = this, elCell = that.valCell,strVal;
        if((typeof fnStr=='string')&&fnStr!=''&&that.opts.range == false){
            var reVal = jet.reMatch(fnStr), inObj={};
            $.each(jet.reMatch(that.format),function (r,val) {
                inObj[val] = parseInt(reVal[r]);
            });
            strVal = inObj;
        }else {
            strVal = fnStr;
        }
        var type = jet.isValHtml(elCell) ? "val" : "text",
            vals = that.parseValue(strVal,matStr);
        if (bool != false) elCell[type](vals);
        return vals;
    };
    //获取日期值
    jedfn.getValue = function (valobj) {
        var that = this, objCell = that.valCell,
            opts = that.opts, reObj, result = new DateTime().reDate(),
            dateY = result.GetFullYear(),dateM = result.GetMonth(),dateD = result.GetDate(),
            timeh = result.GetHours(),timem = result.GetMinutes(),times = result.GetSeconds();
        if (valobj == undefined && jet.isBool(opts.isShow)){
            var type = jet.isValHtml(objCell) ? "val" : "text";
            reObj = objCell[type]();
        }else {
            var isValShow = jet.isBool(opts.isShow) ? (that.getValue() == "") : !jet.isBool(opts.isShow),
                objarr = $.extend({YYYY:null,MM:null,DD:null},valobj||{}),
                ranMat = [],newArr = new Array(2),unObj = function (obj) {
                    return [(objarr[obj] == undefined || objarr[obj] == null),objarr[obj]]
                }, defObj = [{ YYYY:dateY,MM:dateM,DD:dateD, hh:timeh,mm:timem,ss:times,zz:00},
                    { YYYY:dateY,MM:dateM,DD:dateD, hh:timeh,mm:timem,ss:times,zz:00}];
            if (isValShow) {
                //目标为空值则获取当前日期时间
                $.each(newArr,function (i) {
                    var inObj = {};
                    $.each(matArr, function (r, val) {
                        inObj[val] = parseInt(unObj(val)[0] ? defObj[i][val] : unObj(val)[1]);
                    });
                    ranMat.push($.extend(defObj[i], inObj));
                });
            } else {
                var isunRange = opts.range != false, initVal = that.getValue(),
                    spVal = initVal.split(opts.range), reMat = jet.reMatch(that.format);
                $.each(newArr,function (i) {
                    var inObj = {}, reVal = isunRange ? jet.reMatch(spVal[i]) : jet.reMatch(initVal);
                    $.each(reMat,function (r,val) {
                        inObj[val] = parseInt(reVal[r]);
                    });
                    var exVal = $.extend(inObj,valobj||{});
                    ranMat.push($.extend(defObj[i],exVal));
                });
            }
            reObj = ranMat;
        }
        return reObj;
    };
    //布局控件骨架
    jedfn.renderHtml = function(ys, ms, ds, opts,boxcls){
        var that = this, boxCell = $(boxcls),
            lang = opts.language || config.language,
            isrange = opts.range != false,
            isShow = jet.isBool(opts.isShow);
        var minTime = jet.minDate.replace(/\s+/g," ").split(" "),
            maxTime = jet.maxDate.replace(/\s+/g," ").split(" "),
            allvals = that.getValue({YYYY:ys,MM:ms,DD:ds}),
            vals = allvals[0], valx = allvals[1];
        that.format = isShow ? that.format : boxCell.attr("jeformat");
        var mlens = jet.mlen(that.format), testhh = /\hh/.test(that.format);
        var clearTxt = lang.name == "cn" ? (!isShow ? "重置":lang.clear):(!isShow ? "Reset":lang.clear);
        var headcon = "<div class='arthead'></div><div class='artcont'></div>",
            artcont = $("<div/>",{"class":"maincont"}),
            footer = $("<div/>",{"class":"mainfoot"}),
            daycon = $("<div/>",{"class":"daybox"}).append(headcon),
            ymscon = $("<div/>",{"class":"ymsbox"}).append(headcon),
            timecon = $("<div/>",{"class":"timebox"}).append(headcon);
        artcont.append(ymscon).append(daycon).append(mlens==1||mlens==2?"":timecon);
        boxCell.empty().append(artcont.children().hide()).append(footer);
        var timeStr = function () {
                var emStr = '<em></em><i>:</i><em></em><i>:</i><em></em>';
                return isrange ? emStr +"<span> ~ </span>"+ emStr : emStr;
            },
            btnStr = '<span class="clear">'+clearTxt+'</span><span class="today">'+lang.today+'</span><span class="setok">'+lang.yes+'</span>',
            timeDiv = $("<div/>",{"class":"timecon"}).append(timeStr()),
            btnsDiv = $("<div/>",{"class":"btnscon"}).append(btnStr);
        footer.append(timeDiv).append(btnsDiv);
        boxCell.append($("<div/>",{"class":"jedate-tips"}).hide());
        that.maincon = function (elem,is) { return boxCell.find(elem+" > "+(is == 0 ? ".arthead":".artcont")); };
        //设置时分秒
        if (testhh) {
            var minVal = /\s/.test(jet.minDate) ? minTime[1] : minTime[0],
                maxVal = /\s/.test(jet.maxDate) ? maxTime[1] : maxTime[0];
            var rehms = jet.reMatch(minVal), vehms = [vals.hh, vals.mm, vals.ss], hms = [];
            if (isrange) {
                if (that.getValue() == "") {
                    hms = mlens == 7 ? rehms.concat(rehms) : rehms.concat([00, 00, 00]);
                } else {
                    hms = vehms.concat([valx.hh, valx.mm, valx.ss]);
                }
            }else {
                hms = vehms;
            }
            $.each(footer.find(".timecon em"), function (i, cls) {
                $(this).text(jet.digit(hms[i]));
            });
        }else {
            footer.find(".timecon").hide();
        }
        //根据日期格式进行对应的日期时间显示
        if(mlens == 7){
            that.maincon(".timebox",0).html(lang.titText);
            boxCell.find(".timebox").show();
            that.eachHms(opts,boxCell);
        }else if(mlens>=3 && mlens<=6){
            that.maincon(".daybox",0).append('<em class="yearprev yprev"></em><em class="monthprev mprev"></em><em class="monthnext mnext"></em><em class="yearnext ynext"></em>');
            boxCell.find(".daybox").show();
            that.eachDays(vals.YYYY, vals.MM, vals.DD, opts, boxCell);
            //判断日期格式中是否包含hh（时）
            if(testhh){
                that.maincon(".timebox",1).attr("cont","no");
                that.maincon(".timebox",0).html(lang.titText+'<em class="close"></em>');
                boxCell.find(".timecon").on("click",function () {
                    if (that.maincon(".timebox",1).attr("cont") == "no"){
                        that.maincon(".timebox",1).attr("cont","yes");
                        boxCell.find(".ymsbox,.daybox").hide();
                        boxCell.find(".timebox").show();
                        that.eachHms(opts,boxCell);
                        that.dateOrien(boxCell, that.valCell);
                    }
                });
                that.maincon(".timebox",0).on("click",".close",function () {
                    that.maincon(".timebox",1).html("").attr("cont","no");
                    boxCell.find(".ymsbox,.timebox").hide();
                    boxCell.find(".daybox").show();
                    that.dateOrien(boxCell, that.valCell);
                });

                timeDiv.css({"cursor":"pointer"});
            }
            //将所有子元素用一个生成的div将所有段落包裹起来
            that.maincon(".ymsbox",0).append('<em class="yearprev yprev"></em><em class="yearnext ynext"></em><em class="close"></em>').addClass("ymfix");
            //将生成的年月插入到元素中
            that.eachYM(vals.YYYY, vals.MM, opts, boxCell,".fixcon");
        }
        //为年月的情况下执行
        if(mlens==1 || mlens==2){
            that.maincon(".ymsbox",0).append('<em class="yearprev yprev"></em><em class="yearnext ynext"></em>');
            boxCell.find(".ymsbox").show();
            that.eachYM(vals.YYYY, vals.MM, opts, boxCell,".jedate-cont");
        }
        //是否开启时间选择
        if(!jet.isBool(opts.isTime) || !isShow){
            footer.find(".timecon").hide();
        }
        if(!isShow) footer.find(".today").hide();
        //绑定各个事件
        that.eventsDate(opts,boxCell);
        setTimeout(function () {
            opts.success && opts.success(boxCell);
        }, 50);
    };
    jedfn.createYMHtml = function(ys, ms, opts){
        var year = parseInt(ys), month = parseInt(ms), headCls = this.maincon(".daybox",0);
        var ymCls = $("<p/>").css({"width":jet.isBool(opts.multiPane) ? '':'50%'}),
            ymText = "<span class='ymbtn'>"+month+"\u6708 "+year+"\u5e74</span>";
        headCls.append(ymCls.html(ymText));
        return year+"-"+month;
    };
    //循环生成年或月
    jedfn.eachYM = function(y, m,opts,boxCell,clsCell) {
        var that = this, yearArr = new Array(15), date = new Date(),
            lang = opts.language || config.language, ymscon = that.maincon(".ymsbox",1),
            multiPane = jet.isBool(opts.multiPane), mlens = jet.mlen(that.format),
            ymarr = that.getValue({}),testhh = /\hh/.test(that.format),
            formatYY = mlens == 1;

        if(ymscon.find(".ymcon").length > 0) ymscon.find(".ymcon").remove();
        $.each(new Array(multiPane ? 1 : 2),function (s) {
            var retSetCls = function (sym,gym,eym) {
                var sval = sym.replace(gr,""), gval = gym.replace(gr,""), eval = eym.replace(gr,"");
                if (/YYYY-MM-DD/g.test(jet.isparmat(that.format))){
                    return (parseInt(sval) == parseInt(gval)) ? (s == 0 ? "actdate" : "") : "";
                }else {
                    if (parseInt(sval) == parseInt(gval)) {
                        if (!testhh) {
                            that.areaVal.push(sym);
                            that.areaStart = true;
                        }
                        return "actdate";
                    } else if (parseInt(sval) > parseInt(gval) && parseInt(sval) < parseInt(eval)) {
                        return "contain";
                    } else if (parseInt(sval) == parseInt(eval)) {
                        if (!testhh) {
                            that.areaVal.push(sym);
                            that.areaStart = true;
                        }
                        return "actdate";
                    } else {
                        return "";
                    }
                }
            };
            var ymDiv = $("<div/>",{"class":"ymcon"}).addClass(s==1 ? "spaer":""),ymArr=[];
            $.each(formatYY ? yearArr : lang.month, function (n, val) {
                var ym = s==1 ? y + (formatYY ? yearArr.length : 1) : y,seCls;
                n = s==1 ? (formatYY ? 15+n : 12+n) : n;
                if (formatYY) {
                    var minArr = jet.splMatch(jet.minDate), maxArr = jet.splMatch(jet.maxDate),
                        minY = minArr[0], maxY = maxArr[0], year = (ym - 7 + n),
                        getyear = (that.getValue() == "" && jet.isBool(opts.isShow)) ? date.getFullYear() : that.getValue();
                    //判断是否在有效期内
                    if (year < minY || year > maxY) {
                        ymArr.push({style:"disabled",ym: year,idx:n});
                    } else {
                        seCls = retSetCls(year.toString(),getyear.toString(),ymarr[1].YYYY.toString());
                        ymArr.push({style:seCls,ym: year,idx:n});
                    }
                } else {
                    var minArr = jet.splMatch(jet.minDate), maxArr = jet.splMatch(jet.maxDate),
                        thisDate = parseInt(ym+""+jet.digit(val)+""+"01"),
                        minTime = parseInt(minArr[0]+""+jet.digit(minArr[1])+""+jet.digit(minArr[2])),
                        maxTime = parseInt(maxArr[0]+""+jet.digit(maxArr[1])+""+jet.digit(maxArr[2]));
                    //判断是否在有效期内
                    if (thisDate < minTime || thisDate > maxTime) {
                        ymArr.push({style:"disabled",ym: ym + "-" + jet.digit(val),idx:n});
                    } else {
                        var ymVal = ym + "-" + jet.digit(val),ymmVal = ymarr[0].YYYY+ "-" + jet.digit(ymarr[0].MM);
                        seCls = retSetCls(ymVal,ymmVal,(ymarr[1].YYYY+ "-" + jet.digit(ymarr[1].MM)));
                        ymArr.push({style:seCls,ym: ym + "-" + jet.digit(val),idx:n});
                    }
                }

            });
            var table = $('<table/>',{"class":formatYY ?"yul":"ymul"});
            //生成表格主体
            $.each(new Array(formatYY ? 5:4), function(i){
                var tr = $('<tr/>');
                $.each(new Array(3), function(){
                    var td = $("<td/>");
                    table.append(tr.append(td));
                })
            });
            //为表格赋值年月
            $.each(ymArr,function (i,val) {
                table.find("td").eq(i).addClass(val.style).attr({idx:val.idx,"je-val":val.ym}).html(val.ym)
            });
            ymscon.append(ymDiv.append(table));

        });
        var contd = ymscon.find("td"),ymstit = that.maincon(".ymsbox",0),
            eqNum = formatYY ? (multiPane ? 15-1:15*2-1):(multiPane ? 12-1:12*2-1),
            sval = contd.eq(0).text(), eval = contd.eq(eqNum).text();
        var mnx = [(formatYY ? sval:sval.substring(0,4)),(formatYY ? eval:eval.substring(0,4))];
        ymstit.find("p").remove();
        ymstit.append("<p>"+sval+" ~ "+eval+"</p>").attr({min:mnx[0],max:mnx[1]});
    };
    //初始验证正则
    jedfn.dateRegExp = function(valArr) {
        var enval = valArr.split(",")||[], re = "";
        var doExp = function (val) {
            var arr, tmpEval, re = /#?\{(.*?)\}/;
            val = val + "";
            while ((arr = re.exec(val)) != null) {
                arr.lastIndex = arr.index + arr[1].length + arr[0].length - arr[1].length - 1;
                tmpEval = parseInt(eval(arr[1]));
                if (tmpEval < 0) tmpEval = "9700" + -tmpEval;
                val = val.substring(0, arr.index) + tmpEval + val.substring(arr.lastIndex + 1);
            }
            return val;
        };
        if (enval && enval.length > 0) {
            for (var i = 0; i < enval.length; i++) {
                re += doExp(enval[i]);
                if (i != enval.length - 1) re += "|";
            }
            re = re ? new RegExp("(?:" + re + ")") : null;
        } else {
            re = null;
        }
        //re = new RegExp((re + "").replace(/^\/\(\?:(.*)\)\/.*/, "$1"));
        return re;
    };
    //循环生成日
    jedfn.eachDays = function(ys, ms,ds, opts, boxCell){
        var that = this, isShow = jet.isBool(opts.isShow);
        var year = parseInt(ys), month = parseInt(ms), objCell = that.valCell,
            lang = opts.language || config.language, endval = opts.valiDate||[],
            minArr = jet.reMatch(jet.minDate), minNum = parseInt(minArr[0]+""+jet.digit(minArr[1])+""+jet.digit(minArr[2])),
            maxArr = jet.reMatch(jet.maxDate), maxNum = parseInt(maxArr[0]+""+jet.digit(maxArr[1])+""+jet.digit(maxArr[2]));
        var multiPane = jet.isBool(opts.multiPane),  ymdarr = that.getValue(!isShow ? {YYYY:ys,MM:ms,DD:ds}:{}),
            valrange = ((objCell.val() || objCell.text()) != "") && opts.range != false,
            ymdDate = parseInt(ymdarr[0].YYYY+""+jet.digit(ymdarr[0].MM)+""+jet.digit(ymdarr[0].DD));
        //设置时间标注
        var setMark = function (my, mm, md) {
            var Marks = opts.marks, contains = function(arr, obj) {
                var len = arr.length;
                while (len--) {
                    if (arr[len] === obj) return true;
                }
                return false;
            };
            return $.isArray(Marks) && Marks.length > 0 && contains(Marks, my + "-" + jet.digit(mm) + "-" + jet.digit(md)) ? '<i class="marks"></i>' :"";
        };
        //是否显示节日
        var isfestival = function(y, m ,d) {
            var festivalStr;
            if(opts.festival == true && lang.name == "cn"){
                var lunar = that.jeLunar(y, m - 1, d), feslunar = (lunar.solarFestival || lunar.lunarFestival),
                    lunartext = (feslunar && lunar.jieqi) != "" ? feslunar : (lunar.jieqi || lunar.showInLunar);
                festivalStr = '<p><span class="solar">' + d + '</span><span class="lunar">' + lunartext + '</span></p>';
            }else{
                festivalStr = '<p class="nolunar">' + d + '</p>';
            }
            return festivalStr;
        };
        //判断是否在限制的日期之中
        var dateLimit = function(Y, M, D, isMonth){
            var thatNum = parseInt(Y + "" + jet.digit(M) + "" + jet.digit(D));
            if(isMonth){
                if (thatNum >= minNum && thatNum <= maxNum) return true;
            }else {
                if (minNum > thatNum || maxNum < thatNum) return true;
            }
        };

        var eachDays = function (yd,md) {
            var count = 0, daysArr = [],
                firstWeek = new Date(yd, md - 1, 1).getDay() || 7,
                daysNum = jet.getDaysNum(yd, md), didx = 0,
                prevM = jet.prevMonth(yd, md),
                prevDaysNum = jet.getDaysNum(yd, prevM.m),
                nextM = jet.nextMonth(yd, md);
            //上一月剩余天数
            for (var p = prevDaysNum - firstWeek + 1; p <= prevDaysNum; p++, count++) {
                var pmark = setMark(prevM.y,prevM.m,p);
                var cls = dateLimit(prevM.y, prevM.m, p, false) ? "disabled" : "other";
                daysArr.push({style:cls,ymd:prevM.y+'-'+prevM.m+'-'+p,day:p,d:(isfestival(prevM.y,prevM.m,p) + pmark),idx:didx++});
            }
            //本月的天数
            for(var b = 1; b <= daysNum; b++, count++){
                var bmark = setMark(yd,md,b), cls = "";
                var dateval = parseInt(yd+""+jet.digit(md)+""+jet.digit(b)),
                    rangval = parseInt(ymdarr[1].YYYY+""+jet.digit(ymdarr[1].MM)+""+jet.digit(ymdarr[1].DD)),
                    parsdate = dateval > ymdDate, rangdate = dateval < rangval;
                if(dateLimit(yd, md, b, true)){
                    if(dateval == ymdDate){
                        cls = "actdate";
                        that.areaVal.push(yd+'-'+jet.digit(md)+'-'+jet.digit(b));
                        that.areaStart = true;
                    }else if(parsdate&&rangdate&&valrange){
                        cls = "contain";
                    }else if((dateval == rangval)&&valrange){
                        cls = "actdate";
                        that.areaVal.push(yd+'-'+jet.digit(md)+'-'+jet.digit(b));
                        that.areaEnd = true;
                    }else {
                        cls = "";
                    }
                }else {
                    cls = "disabled";
                }
                daysArr.push({style:cls,ymd:yd+'-'+md+'-'+b,day:b,d:(isfestival(yd,md,b) + bmark),idx:didx++});
            }
            //下一月开始天数
            for(var n = 1, nlen = 42 - count; n <= nlen; n++){
                var nmark = setMark(nextM.y,nextM.m,n);
                var cls = dateLimit(nextM.y, nextM.m, n, false) ? "disabled" : "other";
                daysArr.push({style:cls,ymd:nextM.y+'-'+nextM.m+'-'+n,day:n,d:(isfestival(nextM.y,nextM.m,n) + nmark),idx:didx++});
            }
            //将星期与日期拼接起来
            return daysArr;
        };
        var valdigit = function (val) {
            var spval = jet.reMatch(val) , rearr = [];
            $.each(spval,function (i,v) {
                rearr.push(jet.digit(v));
            });
            return rearr.join("-");
        };
        var moreArr = new Array(multiPane ? 1 : 2), isDec = (month + 1 > 12),ymarr = [];
        $.each(moreArr,function (d,val) {
            var table = $('<table/>',{"class":"daysul"}) ,thead = $('<thead/>'),
                tbody = $('<tbody/>'), t= d == 1 ? 42:0;
            table.append(thead).append(tbody);
            //生成表格主体
            $.each(new Array(7), function(i){
                var tr = $('<tr/>');
                $.each(new Array(7), function(){
                    var th = $("<th/>"), td = $("<td/>");
                    tr.append(i == 0 ? th : td.attr("idx",t++));
                    i == 0 ? thead.append(tr) : tbody.append(tr);
                })
            });
            var nian = (isDec && d == 1) ? year+1 : year,
                yue = (isDec && d == 1) ? 1 : (d == 1 ? month+1 : month);
            var arrDay = eachDays(nian,yue);
            var moreCls = $("<div/>",{'class':'contlist'});
            //赋值星期
            $.each(lang.weeks,function (i,val) {
                table.find("th").eq(i).text(val);
            });
            ymarr.push(that.createYMHtml(nian,yue, opts));
            $.each(arrDay,function (i,val) {
                var clsVal = val.style;
                if(endval.length > 0 && endval[0]!=""){
                    if(/\%/g.test(endval[0])){
                        var reval = endval[0].replace(/\%/g,"").split(","), enArr = [];
                        $.each(reval,function (r,rel) {
                            enArr.push(jet.digit(parseInt(rel)));
                        });
                        var isfind = $.inArray(jet.digit(val.day), enArr) == -1;
                        clsVal = jet.isBool(endval[1]) ? (isfind ? "disabled" :clsVal) : (isfind ? clsVal :"disabled");
                    }else {
                        var valreg = that.dateRegExp(endval[0]), regday = valreg.test(jet.digit(val.day));
                        clsVal = jet.isBool(endval[1]) ? (regday ? "disabled" : val.style) : (regday ? val.style : "disabled")
                    }
                }
                table.find("td").eq(i).addClass(clsVal).attr("je-val",valdigit(val.ymd)).html(val.d);
            });
            that.maincon(".daybox",1).append(moreCls.append(table)).addClass(d == 1 ? "spaer" : "");
        });
        that.maincon(".daybox",0).attr("je-ym",ymarr.join(","));
    };
    //循环生成时分秒
    jedfn.eachHms = function(opts,boxCell) {
        var that = this, lang = opts.language || config.language,
            multiPane = jet.isBool(opts.multiPane),
            gval = that.getValue({}), isVal = that.getValue() == "",
            ranges = opts.range == false,
            minTime = jet.minDate.replace(/\s+/g," ").split(" "),
            maxTime = jet.maxDate.replace(/\s+/g," ").split(" "),
            isymdh = /YYYY-MM-DD/g.test(jet.isparmat(that.format)) && /\hh/.test(that.format);
        var minhms = jet.reMatch(minTime[1]),
            maxhms = jet.reMatch(maxTime[1]);
        var hmsCell = that.maincon(".timebox",1),
            clas = ["action","disabled"],inputs = boxCell.find(".mainfoot .timecon em");
        //conhms = isymdh ? hmsCell.parent() : hmsCell;
        var date = new Date(), timeh = date.getHours(),
            timem = date.getMinutes(),times = date.getSeconds();
        var minVal = [gval[0].hh||timeh,gval[0].mm||timem,gval[0].ss||times],
            maxVal = [gval[1].hh||timeh,gval[1].mm||timem,gval[1].ss||times];
        if (opts.range == false && boxCell.find(".timelist").length > 0) return;
        $.each(new Array(ranges ? 1 : 2),function (m) {
            var timeList = $("<div/>",{"class":"timelist"}).css({width:ranges ? "100%":"50%",float:ranges ? "":"left"}),
                timeDiv = $("<div/>",{"class":"contime"}), textDiv = $("<div/>",{"class":"textbox"});
            var timetxt = textDiv.append('<p>'+lang.times[0]+'</p><p>'+lang.times[1]+'</p><p>'+lang.times[2]+'</p>');

            timeList.append(timetxt);
            hmsCell.addClass(m==1 ? "spaer":"");
            $.each([24, 60, 60],function (i,lens) {
                var hmsCls = "",tuls = $("<ul/>").attr("idx",m==1 ? 3+i : i),
                    textem = inputs.eq(i).text();
                for (var h = 0; h < lens; h++) {
                    var tlis = $("<li/>");
                    //判断限制时间范围的状态
                    if (opts.range != false){
                        if (isymdh){
                            if (m==0){
                                if (h >= minhms[i]) {
                                    hmsCls = h == (isVal ? minhms[i]:minVal[i]) ? clas[0] : "";
                                } else{
                                    hmsCls = clas[1];
                                }
                            }else {
                                if (h > maxhms[i]) {
                                    hmsCls = clas[1];
                                }else {
                                    hmsCls = h == (isVal ? 0:maxVal[i]) ? clas[0] : "";
                                }
                            }
                        }else {
                            if (h >= minhms[i]) {
                                hmsCls = h == (isVal ? minhms[i]:(m==0?minVal[i]:maxVal[i])) ? clas[0] : "";
                            } else{
                                hmsCls = clas[1];
                            }
                        }
                    }else{
                        if (h >= minhms[i] && h <= maxhms[i]){
                            if (textem < minhms[i]){
                                hmsCls = h == minhms[i] ? clas[0] : "";
                            }else if (textem > maxhms[i]){
                                hmsCls = h == maxhms[i] ? clas[0] : "";
                            }else {
                                hmsCls = h == textem ? clas[0] : "";
                            }
                        }else {
                            hmsCls = clas[1];
                        }
                    }
                    tlis.text(jet.digit(h)).addClass(hmsCls);
                    hmsCell.append(timeList.append(timeDiv.append(tuls.append(tlis))));
                }
            });
            if (multiPane==false && ranges){
                timeList.css({"padding-left":timeList.outerWidth()/2+12,"padding-right":timeList.outerWidth()/2+12})
            }
        });
        //计算当前时分秒的位置
        that.locateScroll(hmsCell.find("ul"));
        //时分秒选择
        that.clickTime(opts,boxCell);
        var hmsTxt = [];
        $.each(minhms,function (i,val) {
            if (parseInt(val) > parseInt(maxhms[i])){
                hmsTxt.push("不能大于最大"+lang.times[i]);
            }
        });
        if (hmsTxt.length > 0) that.tips(hmsTxt.join("<br/>"),4.5);
    };
    //为日期绑定各类事件
    jedfn.eventsDate = function(opts,boxCell) {
        var that = this, multiPane = jet.isBool(opts.multiPane);
        //上下月事件
        that.clickYM(opts,boxCell);
        //点击天事件
        that.clickDays(opts,boxCell);
        //按钮事件
        that.clickBtn(opts,boxCell);
        //自适应定位,值在isShow为true的情况下有效
        if(jet.isBool(opts.isShow)){
            var datepos = opts.position||[];
            if (datepos.length > 0){
                boxCell.css({"top":datepos[0],"left":datepos[1]});
            }else {
                that.dateOrien(boxCell, that.valCell);
                $(window).on("resize", function(){
                    that.dateOrien(boxCell, that.valCell);
                })
            }
        }
        //点击空白处隐藏
        $(document).on("mouseup", function(ev) {
            ev.stopPropagation();
            if (jet.boxelem == "#jedatebox"){
                var box = $(jet.boxelem);
                if (box && box.css("display") !== "none")  that.dateClose();
                if($("#jedatetipscon").length > 0) $("#jedatetipscon").remove();
                delete that.areaStart;
                delete that.areaEnd;
                that.areaVal = [];
            }
        });
        $(jet.boxelem).on("mouseup", function(ev) {
            ev.stopPropagation();
        });
    };
    //切换年月并重新生成日历
    jedfn.clickYM = function (opts,boxCell) {
        var that = this, ymhead = that.maincon(".ymsbox",0),elemCell = that.valCell,
            yPre = ymhead.find(".yprev"), yNext = ymhead.find(".ynext"),
            ymdhead = that.maincon(".daybox",0),isShow = jet.isBool(opts.isShow),
            ydPre = ymdhead.find(".yprev"), ydNext = ymdhead.find(".ynext"),
            mdPre = ymdhead.find(".mprev"), mdNext = ymdhead.find(".mnext"),
            mlens = jet.mlen(that.format),isYYMM = mlens == 2, isYY = mlens == 1;
        var carr = ["actdate","contain"],ymDate = new Date();
        var clickYmSelected = function () {
            var ulCell = that.maincon(".ymsbox",1).find(".ymcon"), tdCell = ulCell.find("td");
            tdCell.on("click",function () {
                var lithis = $(this), thisdate = lithis.attr("je-val");
                if (lithis.hasClass("disabled")) return;
                if(opts.range == false){
                    tdCell.removeClass(carr[0]);
                    lithis.addClass(carr[0]);
                    that.maincon(".ymsbox",0).attr("data-val",lithis.text());
                }else {
                    //判断是否存在选择的开始与结束日期
                    if (that.areaStart && that.areaEnd == undefined){
                        lithis.addClass(carr[0]);
                        that.areaEnd = true;
                        //添加当前选中的到数组中
                        that.areaVal.push(thisdate);
                        //遍历元素，并在范围中查找同时着色
                        tdCell.each(function () {
                            var sefl = $(this),seVals = sefl.attr("je-val").replace(gr,""),
                                rearea = [that.areaVal[0].replace(gr,""),that.areaVal[1].replace(gr,"")],
                                minVal = Math.min.apply(null, rearea), maxVal = Math.max.apply(null, rearea);
                            if (!sefl.hasClass("other")){
                                var contrast = parseInt(seVals) > parseInt(minVal) && parseInt(seVals) < parseInt(maxVal);
                                if(contrast){
                                    sefl.addClass(carr[1]);
                                }
                            }
                        });
                    }else if (that.areaStart && that.areaEnd){
                        //如果已经选择了一个范围，就清除属性
                        that.delAreaAttr();
                        tdCell.removeClass(carr[0]).removeClass(carr[1]);
                        lithis.addClass(carr[0]);
                        that.areaVal.push(thisdate);
                        that.areaStart = true;
                    }

                }
            });
        };
        if(isYYMM || isYY){
            clickYmSelected();
            //年或年月情况下的变化
            $.each([yPre, yNext], function (ym, cls) {
                cls.on("click", function (ev) {
                    var cthat = $(this), ymMonth = ymDate.getMonth()+1,
                        ymMin = parseInt(cthat.parent().attr("min")), ymMax = parseInt(cthat.parent().attr("max"));
                    var ymYear =isYY ? (ym == 0 ? ymMin : ymMax) : (ym == 0 ? --ymMin : ++ymMax);
                    that.renderHtml(ymYear, ymMonth, null, opts, boxCell);
                    if (opts.range == false) {
                        var ymobj = isYY ? {YYYY: ymYear} : {YYYY: ymYear, MM: ymMonth};
                        var value = that.parseValue(ymobj),
                            date = {
                                YYYY: ymYear, MM: ymMonth, DD: ymDate.getDate(),
                                hh: ymDate.getHours(), mm: ymDate.getMinutes(), ss: ymDate.getSeconds()
                            };
                        if ($.isFunction(opts.toggle)) opts.toggle(elemCell,value,date);
                    }
                })
            })
        }else {
            //切换年
            $.each([ydPre, ydNext], function (y, cls) {
                cls.on("click", function (ev) {
                    ev.stopPropagation();
                    var gym = jet.reMatch($(this).parent().attr("je-ym"));
                    var year = parseInt(gym[0]), month = parseInt(gym[1]),
                        pnYear = y == 0 ? --year : ++year;
                    that.renderHtml(pnYear, month, null, opts, boxCell);
                    if (opts.range == false) {
                        var gv = that.getValue({})[0];
                        var value = that.parseValue({YYYY: pnYear, MM: month, DD: gv.DD}),
                            dateobj = {
                                YYYY: pnYear, MM: month, DD: ymDate.getDate(),
                                hh: ymDate.getHours(), mm: ymDate.getMinutes(), ss: ymDate.getSeconds()
                            };
                        if ($.isFunction(opts.toggle)) opts.toggle({elem:elemCell,val:value,date:dateobj});
                    }
                });
            });
            //切换月
            $.each([mdPre, mdNext], function (m, cls) {
                cls.on("click", function (ev) {
                    ev.stopPropagation();
                    var gym = jet.reMatch($(this).parent().attr("je-ym"));
                    var year = parseInt(gym[0]), month = parseInt(gym[1]),
                        PrevYM = jet.prevMonth(year, month), NextYM = jet.nextMonth(year, month);
                    m == 0 ? that.renderHtml(PrevYM.y, PrevYM.m, null, opts, boxCell) : that.renderHtml(NextYM.y, NextYM.m, null, opts, boxCell);
                    var yearVal = m == 0 ? PrevYM.y : NextYM.y, monthVal = m == 0 ? PrevYM.m : NextYM.m;
                    if (opts.range == false) {
                        var gv = that.getValue({})[0];
                        var value = that.parseValue({YYYY: yearVal, MM: monthVal, DD: gv.DD}),
                            dateobj = {
                                YYYY: yearVal, MM: monthVal, DD: ymDate.getDate(),
                                hh: ymDate.getHours(), mm: ymDate.getMinutes(), ss: ymDate.getSeconds()
                            };
                        if ($.isFunction(opts.toggle)) opts.toggle({elem:elemCell,val:value,date:dateobj});
                    }
                });
            });
        }
        if(mlens >= 3 && mlens <= 6){
            that.maincon(".daybox",0).on("click",".ymbtn", function (ev) {
                boxCell.children(".ymsbox").show();
                boxCell.children(".daybox,.mainfoot").hide();
                if (isShow) that.dateOrien(boxCell, that.valCell);
            });
            var aloneSelym = function () {
                var ulCell = boxCell.find(".ymcon"), tdCell = ulCell.find("td");
                tdCell.on("click",function () {
                    var sefl = $(this), seval = jet.reMatch(sefl.attr("je-val"));
                    tdCell.removeClass(carr[0]);
                    sefl.addClass(carr[0]);
                    boxCell.children(".jedate-contfix").show();
                    boxCell.children(".jedate-jedatewrap").hide();
                    that.renderHtml(seval[0], seval[1],null, opts,boxCell);
                })
            };
            $.each([yPre, yNext], function (ym, cls) {
                cls.on("click", function (ev) {
                    var ymMonth = ymDate.getMonth()+1,
                        ymMin = parseInt($(this).parent().attr("min")), ymMax = parseInt($(this).parent().attr("max"));
                    var ymYear =isYY ? (ym == 0 ? ymMin : ymMax) : (ym == 0 ? --ymMin : ++ymMax);
                    that.eachYM(ymYear, ymMonth, opts, boxCell,".jedate-contfix");
                    aloneSelym();
                    if (isShow) that.dateOrien(boxCell, that.valCell);
                    if ($.isFunction(opts.toggle)) opts.toggle();
                })
            });
            ymhead.on("click",".close", function (ev) {
                boxCell.children(".daybox,.mainfoot").show();
                boxCell.children(".ymsbox").hide();
                if (isShow) that.dateOrien(boxCell, that.valCell);
            });
            aloneSelym();
        }

    };
    jedfn.gethmsVal = function(boxCell) {
        var hmsArr = {};
        boxCell.find(".timecon em").each(function(i) {
            var disb = $(this).attr('disabled');
            if(disb == undefined) hmsArr[matArr[3+i]] = $(this).text();
        });
        return hmsArr;
    };
    //绑定天的事件
    jedfn.clickDays = function (opts,boxCell) {
        var that = this, elemCell = that.valCell,valStr = "je-val",
            ulCls = boxCell.find(".daysul"), tdCls = ulCls.find("td"),
            lang = opts.language || config.language,
            carr = ["actdate","contain"];

        //点击绑定日期事件
        tdCls.on("click", function(ev) {
            var lithis = $(this), thisdate = lithis.attr(valStr),
                ymdArr = jet.reMatch(thisdate), dayArr = [];
            if (lithis.hasClass("disabled")) return;
            ev.stopPropagation();
            //单独选择
            var aloneSelected = function () {
                $.each(ymdArr,function (i,val) {
                    dayArr.push(parseInt(val));
                });
                if($(boxCell.attr(jefix)).length > 0 ){
                    that.renderHtml(dayArr[0], dayArr[1],dayArr[2], opts,boxCell);
                }else {
                    //判断是否为点击后关闭弹层
                    if(jet.isBool(opts.onClose)){
                        tdCls.removeClass(carr[0]);
                        lithis.addClass(carr[0]);
                    }else {
                        var ymdObj = {}, spval = jet.reMatch(lithis.attr(valStr));
                        //获取时分秒的集合
                        $.each(spval,function (i,val) {
                            ymdObj[matArr[i]] = val;
                        });
                        var objs = /\hh/.test(that.format) ? $.extend(ymdObj,that.gethmsVal(boxCell)) : ymdObj;
                        var vals = that.setValue(objs);
                        that.dateClose();
                        if ($.isFunction(opts.okfun) || opts.okfun != null){
                            opts.okfun && opts.okfun({elem:elemCell,val:vals,date:objs});
                        }
                    }
                }
            };
            //区域选择
            var areaSelected = function () {
                //判断是否只选中一个
                if (that.areaStart && that.areaEnd == undefined){
                    lithis.addClass(carr[0]);
                    that.areaEnd = true;
                    //添加当前选中的到数组中
                    that.areaVal.push(thisdate);
                    //遍历元素，并在范围中查找同时着色
                    tdCls.each(function () {
                        var sefl = $(this),seVals = sefl.attr("je-val").replace(gr,""),
                            rearea = [that.areaVal[0].replace(gr,""),that.areaVal[1].replace(gr,"")],
                            minVal = Math.min.apply(null, rearea), maxVal = Math.max.apply(null, rearea);
                        if (!sefl.hasClass("other") && !sefl.hasClass("disabled")){
                            var contrast = parseInt(seVals) > parseInt(minVal) && parseInt(seVals) < parseInt(maxVal);
                            if(contrast){
                                sefl.addClass(carr[1]);
                            }
                        }
                    });
                }else if (that.areaStart && that.areaEnd){
                    //如果已经选择了一个范围，就清除属性
                    that.delAreaAttr();
                    tdCls.removeClass(carr[0]).removeClass(carr[1]);
                    lithis.addClass(carr[0]);
                    that.areaVal.push(thisdate);
                    that.areaStart = true;
                }
            };
            //判断是否要进行日期区域选择
            opts.range == false ? aloneSelected() : areaSelected();
        });
        if(opts.festival && lang.name == "cn") {
            boxCell.addClass("grid");
            //鼠标进入提示框出现
            tdCls.on("mouseover", function () {
                if($("#jedatetipscon").length > 0) $("#jedatetipscon").remove();
                var _this = $(this), atlunar = jet.reMatch(_this.attr(valStr)),
                    tipDiv = $("<div/>",{"id":"jedatetipscon","class":"jedatetipscon"}),
                    lunar = that.jeLunar(parseInt(atlunar[0]), parseInt(atlunar[1]) - 1, parseInt(atlunar[2]));
                var tiphtml = '<p>' + lunar.solarYear + '\u5E74' + lunar.solarMonth + '\u6708' + lunar.solarDate + '\u65E5 ' + lunar.inWeekDays + '</p><p class="red">\u519C\u5386：' + lunar.shengxiao + '\u5E74 ' + lunar.lnongMonth + '\u6708' + lunar.lnongDate + '</p><p>' + lunar.ganzhiYear + '\u5E74 ' + lunar.ganzhiMonth + '\u6708 ' + lunar.ganzhiDate + '\u65E5</p>';
                var Fesjieri = (lunar.solarFestival || lunar.lunarFestival) != "" ? '<p class="red">' + ("\u8282\u65E5："+lunar.solarFestival + lunar.lunarFestival) + '</p>' : "";
                var Fesjieqi = lunar.jieqi != "" ? '<p class="red">'+(lunar.jieqi != "" ? "\u8282\u6C14："+lunar.jieqi : "") + '</p>': "";
                var tiptext = (lunar.solarFestival || lunar.lunarFestival || lunar.jieqi) != "" ? (Fesjieri + Fesjieqi) : "";
                //生成提示框到文档中
                $("body").append(tipDiv);
                tipDiv.html(tiphtml + tiptext);
                //获取并设置农历提示框出现的位置
                var tipPos = jedfn.lunarOrien(tipDiv, _this);
                tipDiv.css({"z-index":  (opts.zIndex == undefined ? 10000 + 5 : opts.zIndex + 5),top:tipPos.top,left:tipPos.left,position:"absolute",display:"block"});
            }).on( "mouseout", function () { //鼠标移除提示框消失
                $("#jedatetipscon").remove();
            });
        }
    };
    jedfn.clickBtn = function (opts,boxCell) {
        var that = this, elemCell = that.valCell,
            isShow = jet.isBool(opts.isShow),
            ishhmat = jet.mlen(that.format) == 7,
            multiPane = jet.isBool(opts.multiPane),
            isYYMM = jet.mlen(that.format) == 2,
            isYY = jet.mlen(that.format) == 1;
        //清空按钮清空日期时间
        boxCell.on("click",".clear", function(ev) {
            ev.stopPropagation();
            if (isShow){
                var type = jet.isValHtml(that.valCell) ? "val" : "text",
                    gtval = that.valCell[type](),
                    clearVal = that.setValue("");
                that.dateClose();
                if (gtval != "") {
                    if (jet.isBool(opts.clearRestore)){
                        jet.minDate = opts.startMin || jet.minDate;
                        jet.maxDate = opts.startMax || jet.maxDate;
                    }
                    if ($.isFunction(opts.clearfun) || opts.clearfun != null) opts.clearfun({elem:elemCell,val:clearVal});
                }
            }else {
                var cdate = that.getValue({});
                that.renderHtml(cdate[0].YYYY, cdate[0].MM,cdate[0].DD, opts,boxCell);
            }
            if(opts.range != false) that.delAreaAttr();
        });
        //今天（现在）按钮设置日期时间
        if(opts.range != false) boxCell.find(".today").hide();
        boxCell.on("click",".today", function() {
            var xDate = new Date(),
                objVal = {
                    YYYY:xDate.getFullYear(), MM:jet.digit(xDate.getMonth() + 1), DD:jet.digit(xDate.getDate()),
                    hh:jet.digit(xDate.getHours()), mm:jet.digit(xDate.getMinutes()), ss:jet.digit(xDate.getSeconds())
                };
            var thisdate = that.setValue(objVal);
            that.dateClose();
            if ($.isFunction(opts.okfun) || opts.okfun != null) opts.okfun({elem:elemCell,val:thisdate,date:objVal});
        });
        //确认按钮设置日期时间
        boxCell.on("click",".setok", function(ev) {
            ev.stopPropagation();
            var  sDate = new Date(),okVal,valdate,objVal;
            if(opts.range == false){
                var hmsVal = that.gethmsVal(boxCell),
                    dateVal = function () {
                        var ymdObj = {}, ymday = (isYYMM || isYY) ? ".ymcon":".daysul",
                            spval = jet.reMatch(boxCell.find(ymday).find("td.actdate").attr("je-val"));
                        $.each(spval,function (i,val) {
                            ymdObj[matArr[i]] = val;
                        });
                        var objVal = /\hh/.test(that.format) ? $.extend(ymdObj,hmsVal) : ymdObj;
                        return objVal;
                    };
                okVal = ishhmat ? hmsVal : dateVal();
            }else {
                var newobj = {}, newarea = [], hmsArr=[[],[]];
                boxCell.find(".timecon em").each(function(i) {
                    var disab = $(this).attr('disabled');
                    if(disab == undefined){
                        hmsArr[i>2 ? 1 : 0].push($(this).text());
                    }
                });
                if (jet.mlen(that.format) == 7){
                    if (opts.range != false){
                        $.each(hmsArr,function (i,val) {
                            var group = val.join("");
                            newobj[group] = val.join(":");
                            newarea.push(group);
                        });
                    }
                }else {
                    $.each(that.areaVal, function (n, val) {
                        var group = val + (/\hh/.test(that.format) ? " " + hmsArr[n].join(":") : "");
                        var repgroup = group.replace(/\s|-|:/g, "");
                        newobj[repgroup] = group;
                        newarea.push(repgroup);
                    });
                }
                var minVal = Math.min.apply(null, newarea), maxVal = Math.max.apply(null, newarea);
                okVal = newobj[minVal]+opts.range+newobj[maxVal];
            }
            if (isShow) {
                valdate = that.setValue(okVal);
                that.dateClose();
            }else {
                valdate = that.setValue(okVal,that.format,false);
            }
            if (opts.range == false){
                objVal = {
                    YYYY:okVal.YYYY||sDate.getFullYear(), MM:jet.digit(okVal.MM||sDate.getMonth() + 1),
                    DD:jet.digit(okVal.DD||sDate.getDate()), hh:jet.digit(okVal.hh||sDate.getHours()),
                    mm:jet.digit(okVal.mm||sDate.getMinutes()), ss:jet.digit(okVal.ss||sDate.getSeconds())
                };
            }else {
                var rans = that.setValue(okVal,that.format,false),objVal = [];
                $.each(new Array(2),function (i,v) {
                    var tmpval = {}, spra = jet.reMatch(rans.split(opts.range)[i]);
                    $.each(jet.reMatch(that.format),function (r,val) {
                        tmpval[val]=spra[r];
                    });
                    objVal.push(tmpval);
                });
            }
            if ($.isFunction(opts.okfun) || opts.okfun != null) opts.okfun({elem:elemCell,val:valdate,date:objVal});
        });
    };
    jedfn.clickTime = function (opts,boxCell) {
        var that = this;
        if(/\hh/.test(that.format)){
            var timeUl = that.maincon(".timebox",1).find("ul");
            timeUl.on("click","li",function () {
                var lithis = $(this);
                var ulidx = lithis.parent().attr("idx"),
                    hmsval = lithis.text();
                if (lithis.hasClass("disabled")) return;
                lithis.addClass('action').siblings().removeClass('action');
                boxCell.find(".timecon em").eq(ulidx).text(hmsval);
                //计算当前时分秒的位置
                that.locateScroll(timeUl);
            });
        }
    };
    //计算当前选中的滚动条位置
    jedfn.locateScroll = function (cell) {
        $.each(cell, function() {
            var hmsCls = $(this), achmsCls = hmsCls.find(".action");
            var acNUm = (achmsCls.length > 0) ? (achmsCls[0].offsetTop - 114):0;
            hmsCls[0].scrollTop = acNUm;
        });
    };
    //农历方位辨别
    jedfn.lunarOrien = function(obj, self, pos) {
        var tops, leris, ortop, orleri, rect =self[0].getBoundingClientRect();
        leris = rect.right + obj[0].offsetWidth / 1.5 >= jet.docArea(1) ? rect.right - obj[0].offsetWidth : rect.left + (pos ? 0 : jet.docScroll(1));
        tops = rect.bottom + obj[0].offsetHeight / 1 <= jet.docArea() ? rect.bottom - 1 : rect.top > obj[0].offsetHeight / 1.5 ? rect.top - obj[0].offsetHeight - 1 : jet.docArea() - obj[0].offsetHeight;
        ortop = Math.max(tops + (pos ? 0 :jet.docScroll()) + 1, 1) + "px", orleri = leris + "px";
        return {top: ortop, left: orleri }
    };
    //辨别控件的方位
    jedfn.dateOrien = function(boxCls, valCls, pos) {
        var that = this, tops, leris, ortop, orleri,
            rect = that.fixed ? valCls[0].getBoundingClientRect() : boxCls[0].getBoundingClientRect(),
            leris = rect.left, tops = rect.bottom;
        if(that.fixed) {
            var boxW = boxCls.outerWidth(), boxH = boxCls.outerHeight();
            //如果右侧超出边界
            if(leris + boxW > jet.docArea(true)){
                leris = jet.docArea(true) - boxW;
            }
            //如果底部超出边界
            if(tops + boxH > jet.docArea()){
                tops = rect.top > boxH ? rect.top - boxH -2 : jet.docArea() - boxH -1;
            }
            //根据目标元素计算弹层位置
            ortop = Math.max(tops + (pos ? 0 :jet.docScroll())+1, 1) + "px", orleri = leris + "px";
        }else{
            //弹层位置位于页面上下左右居中
            ortop = "50%", orleri = "50%";
            boxCls.css({"margin-top":-(rect.height / 2),"margin-left":-(rect.width / 2)});
        }
        boxCls.css({"top":ortop,"left":orleri});
    };
    jedfn.tips = function (text, time) {
        var that = this, tipCls = $(jet.boxelem).find(".jedate-tips");
        tipCls.html("").html(text||"").show();
        clearTimeout(that.tipTime);
        that.tipTime = setTimeout(function(){
            tipCls.html("").hide();
        }, (time||2.5)*1000);
    };
    //关闭层
    jedfn.dateClose = function() {
        if($($(jet.boxelem).attr(jefix)).length == 0) $(jet.boxelem).remove();
    };
    //日期大小比较
    jedfn.dateContrast = function (ac, bc) {
        var sarr = ac.split("-"), earr = bc.split("-"),
            start = parseInt(sarr[0]+""+jet.digit(parseInt(sarr[1])-1)+""+jet.digit(sarr[2]||"01")),
            end = parseInt(earr[0]+""+jet.digit(parseInt(earr[1])-1)+""+jet.digit(sarr[2]||"01"));
        return (start >= end) ? false : true;
    };
    //删除区域属性
    jedfn.delAreaAttr = function () {
        delete this.areaStart;
        delete this.areaEnd;
        this.areaVal = [];
    };
    //农历数据
    jedfn.jeLunar = function (ly,lm,ld) {
        var lunarInfo=[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42448,83315,21200,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46496,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19415,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448],
            sTermInfo = [ 0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758 ];
        var Gan = "甲乙丙丁戊己庚辛壬癸", Zhi = "子丑寅卯辰巳午未申酉戌亥", Animals = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
        var solarTerm = [ "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
            "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至" ];
        var nStr1 = "日一二三四五六七八九十", nStr2 = "初十廿卅", nStr3 = [ "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"],
            sFtv1 = {
                "0101" : "*1元旦节",         "0202" : "湿地日",
                "0214" : "情人节",           "0308" : "妇女节",
                "0312" : "植树节",           "0315" : "消费者权益日",
                "0401" : "愚人节",           "0422" : "地球日",
                "0501" : "*1劳动节",         "0504" : "青年节",
                "0512" : "护士节",           "0518" : "博物馆日",
                "0520" : "母亲节",           "0601" : "儿童节",
                "0623" : "奥林匹克日",       "0630" : "父亲节",
                "0701" : "建党节",           "0801" : "建军节",
                "0903" : "抗战胜利日",       "0910" : "教师节",
                "1001" : "*3国庆节",         "1201" : "艾滋病日",
                "1224" : "平安夜",           "1225" : "圣诞节"
            },
            sFtv2 = {
                "0100" : "除夕",             "0101" : "*2春节",
                "0115" : "元宵节",           "0505" : "*1端午节",
                "0707" : "七夕节",           "0715" : "中元节",
                "0815" : "*1中秋节",         "0909" : "*1重阳节",
                "1015" : "下元节",           "1208" : "腊八节",
                "1223" : "小年"

            };
        function flunar(Y) {
            var sTerm = function (j, i) {
                    var h = new Date((31556925974.7 * (j - 1900) + sTermInfo[i] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
                    return (h.getUTCDate())
                },
                d = function (k) {
                    var h, j = 348;
                    for (h = 32768; h > 8; h >>= 1) {
                        j += (lunarInfo[k - 1900] & h) ? 1 : 0;
                    }
                    return (j + b(k))
                },
                ymdCyl = function (h) {
                    return (Gan.charAt(h % 10) + Zhi.charAt(h % 12))
                },
                b =function (h) {
                    var islp = (g(h)) ? ((lunarInfo[h - 1900] & 65536) ? 30 : 29) : (0);
                    return islp
                },
                g = function (h) {
                    return (lunarInfo[h - 1900] & 15)
                },
                e = function (i, h) {
                    return ((lunarInfo[i - 1900] & (65536 >> h)) ? 30 : 29)
                },
                newymd = function (m) {
                    var k, j = 0, h = 0, l = new Date(1900, 0, 31), n = (m - l) / 86400000;
                    this.dayCyl = n + 40;
                    this.monCyl = 14;
                    for (k = 1900; k<2050&&n>0; k++) {
                        h = d(k); n -= h;
                        this.monCyl += 12;
                    }
                    if (n < 0) {
                        n += h; k--;
                        this.monCyl -= 12;
                    }
                    this.year = k;
                    this.yearCyl = k - 1864;
                    j = g(k);
                    this.isLeap = false;
                    for (k = 1; k<13&&n>0; k++) {
                        if (j > 0 && k == (j + 1) && this.isLeap == false) {
                            --k;
                            this.isLeap = true;
                            h = b(this.year);
                        } else {
                            h = e(this.year, k);
                        }
                        if (this.isLeap == true && k == (j + 1)) {
                            this.isLeap = false;
                        }
                        n -= h;
                        if (this.isLeap == false) this.monCyl++;
                    }
                    if (n == 0 && j > 0 && k == j + 1) {
                        if (this.isLeap) {
                            this.isLeap = false;
                        } else {
                            this.isLeap = true;
                            --k;
                            --this.monCyl;
                        }
                    }
                    if (n < 0) {
                        n += h; --k;
                        --this.monCyl
                    }
                    this.month = k;
                    this.day = n + 1;
                },
                digit = function (num) {
                    return num < 10 ? "0" + (num | 0) :num;
                },
                reymd = function (i, j) {
                    var h = i;
                    return j.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function(k) {
                        switch (k) {
                            case "yyyy":
                                var l = "000" + h.getFullYear();
                                return l.substring(l.length - 4);
                            case "dd": return digit(h.getDate());
                            case "d": return h.getDate().toString();
                            case "MM": return digit((h.getMonth() + 1));
                            case "M": return h.getMonth() + 1;
                        }
                    })
                },
                lunarMD = function (i, h) {
                    var j;
                    switch (i, h) {
                        case 10: j = "初十"; break;
                        case 20: j = "二十"; break;
                        case 30: j = "三十"; break;
                        default:
                            j = nStr2.charAt(Math.floor(h / 10));
                            j += nStr1.charAt(h % 10);
                    }
                    return (j)
                };
            this.isToday = false;
            this.isRestDay = false;
            this.solarYear = reymd(Y, "yyyy");
            this.solarMonth = reymd(Y, "M");
            this.solarDate = reymd(Y, "d");
            this.solarWeekDay = Y.getDay();
            this.inWeekDays = "星期" + nStr1.charAt(this.solarWeekDay);
            var X = new newymd(Y);
            this.lunarYear = X.year;
            this.shengxiao = Animals.charAt((this.lunarYear - 4) % 12);
            this.lunarMonth = X.month;
            this.lunarIsLeapMonth = X.isLeap;
            this.lnongMonth = this.lunarIsLeapMonth ? "闰" + nStr3[X.month - 1] : nStr3[X.month - 1];
            this.lunarDate = X.day;
            this.showInLunar = this.lnongDate = lunarMD(this.lunarMonth, this.lunarDate);
            if (this.lunarDate == 1) {
                this.showInLunar = this.lnongMonth + "月";
            }
            this.ganzhiYear = ymdCyl(X.yearCyl);
            this.ganzhiMonth = ymdCyl(X.monCyl);
            this.ganzhiDate = ymdCyl(X.dayCyl++);
            this.jieqi = "";
            this.restDays = 0;
            if (sTerm(this.solarYear, (this.solarMonth - 1) * 2) == reymd(Y, "d")) {
                this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2];
            }
            if (sTerm(this.solarYear, (this.solarMonth - 1) * 2 + 1) == reymd(Y, "d")) {
                this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2 + 1];
            }
            if (this.showInLunar == "清明") {
                this.showInLunar = "清明节";
                this.restDays = 1;
            }
            this.solarFestival = sFtv1[reymd(Y, "MM") + reymd(Y, "dd")];
            if (typeof this.solarFestival == "undefined") {
                this.solarFestival = "";
            } else {
                if (/\*(\d)/.test(this.solarFestival)) {
                    this.restDays = parseInt(RegExp.$1);
                    this.solarFestival = this.solarFestival.replace(/\*\d/, "");
                }
            }
            this.showInLunar = (this.solarFestival == "") ? this.showInLunar : this.solarFestival;
            this.lunarFestival = sFtv2[this.lunarIsLeapMonth ? "00" : digit(this.lunarMonth) + digit(this.lunarDate)];
            if (typeof this.lunarFestival == "undefined") {
                this.lunarFestival = "";
            } else {
                if (/\*(\d)/.test(this.lunarFestival)) {
                    this.restDays = (this.restDays > parseInt(RegExp.$1)) ? this.restDays : parseInt(RegExp.$1);
                    this.lunarFestival = this.lunarFestival.replace(/\*\d/, "");
                }
            }
            if (this.lunarMonth == 12  && this.lunarDate == e(this.lunarYear, 12)) {
                this.lunarFestival = sFtv2["0100"];
                this.restDays = 1;
            }
            this.showInLunar = (this.lunarFestival == "") ? this.showInLunar : this.lunarFestival;
        }
        return new flunar(new Date(ly,lm,ld));
    };
    //日期控件版本
    $.dateVer = "6.0.2";
    //返回指定日期
    $.nowDate = function (str,format) {
        format = format || 'YYYY-MM-DD hh:mm:ss';
        if (typeof(str) === 'number') {
            str = {DD: str};
        }
        return jet.GetDateTime(str, format);
    };
    //日期时间戳相互转换
    $.timeStampDate = function (date,format) {
        format = format || 'YYYY-MM-DD hh:mm:ss';
        var dateTest = (/^(-)?\d{1,10}$/.test(date) || /^(-)?\d{1,13}$/.test(date));
        if(/^[1-9]*[1-9][0-9]*$/.test(date) && dateTest){
            var vdate = parseInt(date);
            if (/^(-)?\d{1,10}$/.test(vdate)) {
                vdate = vdate * 1000;
            } else if (/^(-)?\d{1,13}$/.test(vdate)) {
                vdate = vdate * 1000;
            } else if (/^(-)?\d{1,14}$/.test(vdate)) {
                vdate = vdate * 100;
            } else {
                alert("时间戳格式不正确");
                return;
            }
            var setdate = new Date(vdate);
            return jet.parse({YYYY:setdate.getFullYear(), MM:jet.digit(setdate.getMonth()+1), DD:jet.digit(setdate.getDate()) , hh:jet.digit(setdate.getHours()), mm:jet.digit(setdate.getMinutes()), ss:jet.digit(setdate.getSeconds()) }, format);
        }else {
            //将日期转换成时间戳
            var arrs = jet.reMatch(date),
                newdate = new Date(arrs[0],parseInt(arrs[1])-1,arrs[2],arrs[3]||0,arrs[4]||0,arrs[5]||0),
                timeStr = Math.round(newdate.getTime() / 1000);
            return timeStr;
        }
    };
    //分解日期时间
    $.splitDate = function (str) {
        var sdate = str.match(/\w+|d+/g);
        return {
            YYYY:parseInt(sdate[0]),MM:parseInt(sdate[1])||00,DD:parseInt(sdate[2])||00,
            hh:parseInt(sdate[3])||00,mm:parseInt(sdate[4])||00,ss:parseInt(sdate[5])||00
        };
    };
    //获取年月日星期
    $.getLunar = function(date,format){
        var that = this;
        format = format || 'YYYY-MM-DD hh:mm:ss';
        if(/YYYY-MM-DD/g.test(jet.isparmat(format))){
            //如果为数字类型的日期对获取到日期的进行替换
            var charDate = date.substr(0,4).replace(/^(\d{4})/g,"$1,") + date.substr(4).replace(/(.{2})/g,"$1,"),
                reArr = jet.isNum(date) ? jet.reMatch(charDate) : jet.reMatch(date),
                lunars = that.jeLunar(reArr[0], reArr[1] - 1, reArr[2]);
            return{
                nMonth: lunars.lnongMonth,             //农历月
                nDays: lunars.lnongDate,               //农历日
                yYear: parseInt(lunars.solarYear),     //阳历年
                yMonth: parseInt(lunars.solarMonth),   //阳历月
                yDays: parseInt(lunars.solarDate),     //阳历日
                cWeek: lunars.inWeekDays,              //汉字星期几
                nWeek: lunars.solarWeekDay             //数字星期几
            };
        }
    };
    return jeDate;
});
/*
* Version 1.0
* 2015-12-20 by sullivan
* AJAX Pager
*/
;
(function (window, $) {

    var tablePager = window.tablePager1 = {
        opts: {
            length: 10,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager1.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPager' /><button id='btnJump' onclick='tablePager1.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                        limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPager", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    
    $(document).on("keydown" , "#txtToPager", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePager.jumpToPage();
                return false;
            }
    })

    $.fn.tablePager = function (option) {
        return tablePager.init($(this),option);
    };


    var tablePagerThree = window.tablePager2 = {
        opts: {
            length: 3,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager2.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPagerThree' /><button id='btnJump' onclick='tablePager2.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPagerThree", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    $(document).on("keydown" , "#txtToPagerThree", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePagerThree.jumpToPag();
                return false;
            }
    })

    $.fn.tablePagerThree = function (option) {
        return tablePagerThree.init($(this),option);
    };


    var tablePagerOne = window.tablePager3 = {
        opts: {
            length: 4,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager3.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPagerOne' /><button id='btnJump' onclick='tablePager3.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPagerOne", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    $(document).on("keydown" , "#txtToPagerOne", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePagerOne.jumpToPage();
                return false;
            }
    })

    $.fn.tablePagerOne = function (option) {
        return tablePagerOne.init($(this),option);
    };


})(window, jQuery);
var _persone = function () {
    var highsearch =  $("#highSeach");
    //定义开始结束时间参数
    var start = {
        isinitVal: true,
        initDate:[{DD:"-7"},true],
        format: "YYYY-MM-DD",
        maxDate: $.nowDate({DD:0}), //最大日期
        zIndex: 99999,
        isClear:false,
        isok:false,
        okfun: function (elem, date) {
                end.minDate = elem.val.replace(/\//g,"-"); //开始日选好后，重置结束日的最小日期
             //   endDates();
        },
    };
    var end = {
        isinitVal: true,
        isok: false,
        isClear:false,
        zIndex: 99999,
        maxDate: $.nowDate({DD:0}), //最大日期
        format: "YYYY-MM-DD",
        okfun: function (elem, date) {
                start.maxDate = elem.val.replace(/\//g,"-"); //将结束日的初始值设定为开始日的最大日期
        }
    };
    //验证高级检索必填
    $("#recommend-form").bootstrapValidator({
        message:'This value is not valid',
//            定义未通过验证的状态图标
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
//            字段验证
        fields:{      
            introduction:{
                    message: '',
                    validators:{
                    notEmpty:{
                        message:'案情描述不能为空'
                        }
                    }
                }, 
            },
        
    })
    //验证检索必填
    $("#keyword-form").bootstrapValidator({
        message:'This value is not valid',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
//            字段验证
        fields:{      
            keyword:{
                    message: '',
                    validators:{
                    notEmpty:{
                        message:'请输入需要搜索的关键词'
                        }
                    }
                }, 
            },
        
    })

    function highSeachSumbit(){
        var reason =$(".caseresours").find("option:selected").val();
        var areaid = $("input[name='courtCityId']").attr("area-id");
        var appellors = $("input[name='appellors']").val()
        var defendant = $("input[name='defendant']").val();
        var trialDateBegin = $("input[name='trialDateBegin']").val();
        var trialDateEnd = $("input[name='trialDateEnd']").val();
        var introduction = $("textarea[name='introduction']").val();
        var standardAmount = $("select[name='standardAmount']").find("option:selected").val();
        var lawyerFeeLimit = $("select[name='lawyerFeeLimit']").find("option:selected").val();
        var lawyerSex = $("select[name='lawyerSex']").find("option:selected").val();
        var lawyerAge = $("select[name='lawyerAge']").find("option:selected").val();
        var lawyerWorkYears = $("select[name='lawyerWorkYears']").find("option:selected").val();
        var lawyerCaseCount = $("select[name='lawyerCaseCount']").find("option:selected").val();
        var lawyerLanguage = $("select[name='lawyerLanguage']").find("option:selected").val();
        var lawyerOther = $("textarea[name='lawyerOther']").val();
        if(reason == "全部" ){
            reason = "";
        }
        if(standardAmount == 0 ){
            standardAmount = "";
        }
        if(lawyerFeeLimit == 0 ){
            lawyerFeeLimit = "";
        }
        if(lawyerSex == 0 ){
            lawyerSex = "";
        }
        if(lawyerAge == 0 ){
            lawyerAge = "";
        }
        if(lawyerWorkYears == 0 ){
            lawyerWorkYears = "";
        }
        if(lawyerCaseCount == 0 ){
            lawyerCaseCount = "";
        }
        if(lawyerLanguage == 0 ){
            lawyerLanguage = "";
        }
        if(areaid == 0){
            areaid = "";
        }
        var params = {
              reason : reason,
              courtCityId :areaid,
              offset:0,
              appellors : appellors,
              defendant : defendant,
              trialDateBegin : trialDateBegin,
              trialDateEnd : trialDateEnd,
              introduction : introduction,
              standardAmount : standardAmount ,
      //      lawyerFeeLimit : lawyerFeeLimit,
      //      lawyerSex : lawyerSex,
       //     lawyerAge : lawyerAge,
      //      lawyerWorkYears : lawyerWorkYears ,
      //      lawyerCaseCount : lawyerCaseCount,
      //      lawyerLanguage : lawyerLanguage,
      //      lawyerOther : lawyerOther
        }

        $('#list-page .pager').tablePagerOne({
        
            url: "case/lawyerRecommend",
            searchParam:params,
            success: function (result) {
               if(result.code == 0){
            //    result.data.host=  api.link+"lawyerDetail?";
                result.data.host=  api.host+"lawyerDetail?";
                var html = template('search-result-templete', result.data); 
                $("#search-result").html(html);
                if(result.data.totalCount>1){
                    $(".page-row").hide()
                // }else{
                //     $(".page-row").show()
                }
                if(result.data.totalCount==0){
                    $("#search-result").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
                }
               }else{
                    toastr.warning("数据请求失败");
               }
              
            }
        })

    }

    function keywordSumbit(){
        var keywords = $("input[name='keyword']").val()
        var reason =$(".caseresours").find("option:selected").val();
        var areaid = $("input[name='courtCityId']").attr("area-id");
        if(reason == "全部" ){
            reason = "";
        }
        if(areaid == 0){
            areaid = "";
        }
        
        var params = {
            offset:0,
           keyword : keywords,
           reason : reason,
           courtCityId :areaid
        }
        $('#list-page .pager').tablePagerOne({
        
            url: "case/lawyerRecommend",
            searchParam:params,
            success: function (result) {
               if(result.code == 0){
          //   result.data.host=  api.link+"lawyerDetail?";
                result.data.host=  api.host+"lawyerDetail?";
                var html = template('search-result-templete', result.data); 
                $("#search-result").html(html);

                sessionStorage.setItem("lawyer",result.data);
                if(result.data.totalCount==0){
                    $("#search-result").html("<P class='noresult'>抱歉，没有该检索内容数据</P>")
                }
                if(result.data.totalCount>1){
                    $(".page-row").hide()
                // }else{
                //     $(".page-row").show()
                }
               }else{
                    toastr.warning(result.msg);
               }
              
            }
        })
    }

    function reasonclick(){
        $({})._Ajax({
            url: "casetype/apiListByParentId/0",
            success: function (result) {
                    if (result.code==0) {
                        var html = template("search-reason-templete",result)
                        $("#navbar-menu").html(html);
                    }
                 }
                });

    }
function viewcaseone(caseoneid){
    $({})._Ajax({
        url: "casetype/apiListByParentId/"+caseoneid,
        success: function (result) {
                if (result.code==0) {
                    var html = template("search-lidrop-templete",result)
                    $("##navbar-menu li.oneli").append(html);
                }
             }
            });
    var title =  $("#one"+caseoneid).attr("title");
            $("#reasonslect").text(title);
}



    function seachSumbit(){
        if($(".recommend-form").hasClass("show")){
            $("#recommend-form").bootstrapValidator('validate');
            if ($("#recommend-form").data('bootstrapValidator').isValid()){
                highSeachSumbit();
                highsearch.trigger("click");
               
                $(".search-result").show();

            }
        }else{
            // $("#keyword-form").bootstrapValidator('validate');//提交验证
            //     if ($("#keyword-form").data('bootstrapValidator').isValid()){//获取验证结果，如果成功，执行下面代码
                  
            //         keywordSumbit();
            //         $(".search-result").show();
                      
            //     }
                 keywordSumbit();
                 $(".search-result").show();
        }
    }
  
    $(function(){

     var conHeight = $(".main-content .container").outerHeight();
     var conWidth = $(".main-content .container").outerWidth();
     $(".main-content").height(winH-233);
    var bgh =  $(".main-content").height();
  //   console.log(conHeight,conWidth)
     var loginLeft = conWidth/2;
     var loginTop = conHeight/2; 
     console.log(bgh)
     $(".main-content .container").css({"top":bgh/2-loginTop+"px","left":winW/2-loginLeft+"px"})  
    //地区选择
    init_city_select($("#area-select"));

    //时间选择 
    $("#start-date").jeDate(start);
    $("#end-date").jeDate(end);


    })
 
        
    return {
        init: function () {
            change_main_current_class(1); 
          
            highsearch.click(function(){
                $(".recommend-form").toggle();
                $(".recommend-form").toggleClass("show");
                if ($(".recommend-form").hasClass("show")) { 
                    $(this).children().removeClass("glyphicon-menu-left").addClass("glyphicon-menu-down")
                    $(this).css("color","#ed7a39");
                    $(".page-search").css("padding-bottom","30px");
                    $(".page-title p").css("padding","5px");
                  
                } else {
                    $(this).children().removeClass("glyphicon-menu-down").addClass("glyphicon-menu-left")
                    $(this).css("color","#333")
                    $(".page-title p").removeAttr("style")
                }
            }) ;
            $(document).on("click","#searchBtn",function(){
                seachSumbit();

            })
            
            $(document).on("click",".serachtext",function(){
                var keywords = $(this).text();
               
                var reason =$(".caseresours").find("option:selected").val();
                var areaid = $("input[name='courtCityId']").attr("area-id");
                if(reason == 0 ){
                    reason = "";
                }
                
                var params = {
                    offset:0,
                    keyword : keywords,
               //     reason : reason,
              //      courtCityId :areaid
                }
                $('#list-page .pager').tablePagerOne({
                
                    url: "case/lawyerRecommend",
                    searchParam:params,
                    success: function (result) {
                       if(result.code == 0){
                        result.data.host=  api.host+"lawyerDetail?";
                        var html = template('search-result-templete', result.data); 
                        $("#search-result").html(html);
                        $(".search-result").show();
                        if(result.data.totalCount>1){
                            $(".page-row").hide()
                        // }else{
                        //     $(".page-row").show()
                        }

                       }else{
                            toastr.warning(result.msg);
                       }
                      
                    }
                })
            })
           

            $(document).on("keydown", function (e) {
                e.stopPropagation();
                var key = e.which;
                if (key == 13) {
                    seachSumbit();
                }
            });
            $(document).on("click","#reasonslect",function(){
                $("#navbar-menu").toggle()
                reasonclick();
            })
        }
    }
} ();
_persone.init();