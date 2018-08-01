
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
!function(a){"use strict";function b(b,d){this.$el=a(b),this.opt=a.extend(!0,{},c,d),this.init(this)}var c={};b.prototype={init:function(a){a.initToggle(a),a.initDropdown(a)},initToggle:function(b){a(document).on("click",function(c){var d=a(c.target);d.closest(b.$el.data("sidenav-toggle"))[0]?(b.$el.toggleClass("show"),a("body").toggleClass("sidenav-no-scroll"),b.toggleOverlay()):d.closest(b.$el)[0]||(b.$el.removeClass("show"),a("body").removeClass("sidenav-no-scroll"),b.hideOverlay())})},initDropdown:function(b){b.$el.on("click","[data-sidenav-dropdown-toggle]",function(b){var c=a(this);c.next("[data-sidenav-dropdown]").slideToggle("fast"),c.find("[data-sidenav-dropdown-icon]").toggleClass("show"),b.preventDefault()})},toggleOverlay:function(){var b=a("[data-sidenav-overlay]");b[0]||(b=a('<div data-sidenav-overlay class="sidenav-overlay"/>'),a("body").append(b)),b.fadeToggle("fast")},hideOverlay:function(){a("[data-sidenav-overlay]").fadeOut("fast")}},a.fn.sidenav=function(c){return this.each(function(){a.data(this,"sidenav")||a.data(this,"sidenav",new b(this,c))})}}(window.jQuery);
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

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.echarts={})}(this,function(t){"use strict";function e(t,e){"createCanvas"===t&&(zp=null),Lp[t]=e}function n(t){if(null==t||"object"!=typeof t)return t;var e=t,i=Ip.call(t);if("[object Array]"===i){if(!z(t)){e=[];for(var r=0,o=t.length;r<o;r++)e[r]=n(t[r])}}else if(Sp[i]){if(!z(t)){var a=t.constructor;if(t.constructor.from)e=a.from(t);else{e=new a(t.length);for(var r=0,o=t.length;r<o;r++)e[r]=n(t[r])}}}else if(!Mp[i]&&!z(t)&&!S(t)){e={};for(var s in t)t.hasOwnProperty(s)&&(e[s]=n(t[s]))}return e}function i(t,e,r){if(!w(e)||!w(t))return r?n(e):t;for(var o in e)if(e.hasOwnProperty(o)){var a=t[o],s=e[o];!w(s)||!w(a)||y(s)||y(a)||S(s)||S(a)||b(s)||b(a)||z(s)||z(a)?!r&&o in t||(t[o]=n(e[o],!0)):i(a,s,r)}return t}function r(t,e){for(var n=t[0],r=1,o=t.length;r<o;r++)n=i(n,t[r],e);return n}function o(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function a(t,e,n){for(var i in e)e.hasOwnProperty(i)&&(n?null!=e[i]:null==t[i])&&(t[i]=e[i]);return t}function s(){return zp||(zp=Op().getContext("2d")),zp}function l(t,e){if(t){if(t.indexOf)return t.indexOf(e);for(var n=0,i=t.length;n<i;n++)if(t[n]===e)return n}return-1}function u(t,e){function n(){}var i=t.prototype;n.prototype=e.prototype,t.prototype=new n;for(var r in i)t.prototype[r]=i[r];t.prototype.constructor=t,t.superClass=e}function h(t,e,n){a(t="prototype"in t?t.prototype:t,e="prototype"in e?e.prototype:e,n)}function c(t){if(t)return"string"!=typeof t&&"number"==typeof t.length}function d(t,e,n){if(t&&e)if(t.forEach&&t.forEach===Tp)t.forEach(e,n);else if(t.length===+t.length)for(var i=0,r=t.length;i<r;i++)e.call(n,t[i],i,t);else for(var o in t)t.hasOwnProperty(o)&&e.call(n,t[o],o,t)}function f(t,e,n){if(t&&e){if(t.map&&t.map===kp)return t.map(e,n);for(var i=[],r=0,o=t.length;r<o;r++)i.push(e.call(n,t[r],r,t));return i}}function p(t,e,n,i){if(t&&e){if(t.reduce&&t.reduce===Pp)return t.reduce(e,n,i);for(var r=0,o=t.length;r<o;r++)n=e.call(i,n,t[r],r,t);return n}}function g(t,e,n){if(t&&e){if(t.filter&&t.filter===Dp)return t.filter(e,n);for(var i=[],r=0,o=t.length;r<o;r++)e.call(n,t[r],r,t)&&i.push(t[r]);return i}}function m(t,e){var n=Ap.call(arguments,2);return function(){return t.apply(e,n.concat(Ap.call(arguments)))}}function v(t){var e=Ap.call(arguments,1);return function(){return t.apply(this,e.concat(Ap.call(arguments)))}}function y(t){return"[object Array]"===Ip.call(t)}function x(t){return"function"==typeof t}function _(t){return"[object String]"===Ip.call(t)}function w(t){var e=typeof t;return"function"===e||!!t&&"object"==e}function b(t){return!!Mp[Ip.call(t)]}function M(t){return!!Sp[Ip.call(t)]}function S(t){return"object"==typeof t&&"number"==typeof t.nodeType&&"object"==typeof t.ownerDocument}function I(t){return t!==t}function C(t){for(var e=0,n=arguments.length;e<n;e++)if(null!=arguments[e])return arguments[e]}function T(t,e){return null!=t?t:e}function D(t,e,n){return null!=t?t:null!=e?e:n}function A(){return Function.call.apply(Ap,arguments)}function k(t){if("number"==typeof t)return[t,t,t,t];var e=t.length;return 2===e?[t[0],t[1],t[0],t[1]]:3===e?[t[0],t[1],t[2],t[1]]:t}function P(t,e){if(!t)throw new Error(e)}function L(t){return null==t?null:"function"==typeof t.trim?t.trim():t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}function O(t){t[Ep]=!0}function z(t){return t[Ep]}function E(t){function e(t,e){n?i.set(t,e):i.set(e,t)}var n=y(t),i=this;t instanceof E?t.each(e):t&&d(t,e)}function N(t){return new E(t)}function R(){}function B(t,e){var n=new Rp(2);return null==t&&(t=0),null==e&&(e=0),n[0]=t,n[1]=e,n}function V(t,e){return t[0]=e[0],t[1]=e[1],t}function F(t){var e=new Rp(2);return e[0]=t[0],e[1]=t[1],e}function H(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}function G(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t}function W(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function Z(t){return Math.sqrt(U(t))}function U(t){return t[0]*t[0]+t[1]*t[1]}function X(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}function j(t,e){var n=Z(e);return 0===n?(t[0]=0,t[1]=0):(t[0]=e[0]/n,t[1]=e[1]/n),t}function Y(t,e){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]))}function q(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])}function $(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r+n[4],t[1]=n[1]*i+n[3]*r+n[5],t}function K(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t}function Q(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t}function J(){this.on("mousedown",this._dragStart,this),this.on("mousemove",this._drag,this),this.on("mouseup",this._dragEnd,this),this.on("globalout",this._dragEnd,this)}function tt(t,e){return{target:t,topTarget:e&&e.topTarget}}function et(t,e,n){return{type:t,event:n,target:e.target,topTarget:e.topTarget,cancelBubble:!1,offsetX:n.zrX,offsetY:n.zrY,gestureEvent:n.gestureEvent,pinchX:n.pinchX,pinchY:n.pinchY,pinchScale:n.pinchScale,wheelDelta:n.zrDelta,zrByTouch:n.zrByTouch,which:n.which}}function nt(){}function it(t,e,n){if(t[t.rectHover?"rectContain":"contain"](e,n)){for(var i,r=t;r;){if(r.clipPath&&!r.clipPath.contain(e,n))return!1;r.silent&&(i=!0),r=r.parent}return!i||Up}return!1}function rt(){var t=new Yp(6);return ot(t),t}function ot(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t}function at(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t}function st(t,e,n){var i=e[0]*n[0]+e[2]*n[1],r=e[1]*n[0]+e[3]*n[1],o=e[0]*n[2]+e[2]*n[3],a=e[1]*n[2]+e[3]*n[3],s=e[0]*n[4]+e[2]*n[5]+e[4],l=e[1]*n[4]+e[3]*n[5]+e[5];return t[0]=i,t[1]=r,t[2]=o,t[3]=a,t[4]=s,t[5]=l,t}function lt(t,e,n){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+n[0],t[5]=e[5]+n[1],t}function ut(t,e,n){var i=e[0],r=e[2],o=e[4],a=e[1],s=e[3],l=e[5],u=Math.sin(n),h=Math.cos(n);return t[0]=i*h+a*u,t[1]=-i*u+a*h,t[2]=r*h+s*u,t[3]=-r*u+h*s,t[4]=h*o+u*l,t[5]=h*l-u*o,t}function ht(t,e,n){var i=n[0],r=n[1];return t[0]=e[0]*i,t[1]=e[1]*r,t[2]=e[2]*i,t[3]=e[3]*r,t[4]=e[4]*i,t[5]=e[5]*r,t}function ct(t,e){var n=e[0],i=e[2],r=e[4],o=e[1],a=e[3],s=e[5],l=n*a-o*i;return l?(l=1/l,t[0]=a*l,t[1]=-o*l,t[2]=-i*l,t[3]=n*l,t[4]=(i*s-a*r)*l,t[5]=(o*r-n*s)*l,t):null}function dt(t){return t>Kp||t<-Kp}function ft(t){this._target=t.target,this._life=t.life||1e3,this._delay=t.delay||0,this._initialized=!1,this.loop=null!=t.loop&&t.loop,this.gap=t.gap||0,this.easing=t.easing||"Linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart,this._pausedTime=0,this._paused=!1}function pt(t){return(t=Math.round(t))<0?0:t>255?255:t}function gt(t){return(t=Math.round(t))<0?0:t>360?360:t}function mt(t){return t<0?0:t>1?1:t}function vt(t){return pt(t.length&&"%"===t.charAt(t.length-1)?parseFloat(t)/100*255:parseInt(t,10))}function yt(t){return mt(t.length&&"%"===t.charAt(t.length-1)?parseFloat(t)/100:parseFloat(t))}function xt(t,e,n){return n<0?n+=1:n>1&&(n-=1),6*n<1?t+(e-t)*n*6:2*n<1?e:3*n<2?t+(e-t)*(2/3-n)*6:t}function _t(t,e,n){return t+(e-t)*n}function wt(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function bt(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Mt(t,e){ug&&bt(ug,e),ug=lg.put(t,ug||e.slice())}function St(t,e){if(t){e=e||[];var n=lg.get(t);if(n)return bt(e,n);var i=(t+="").replace(/ /g,"").toLowerCase();if(i in sg)return bt(e,sg[i]),Mt(t,e),e;if("#"!==i.charAt(0)){var r=i.indexOf("("),o=i.indexOf(")");if(-1!==r&&o+1===i.length){var a=i.substr(0,r),s=i.substr(r+1,o-(r+1)).split(","),l=1;switch(a){case"rgba":if(4!==s.length)return void wt(e,0,0,0,1);l=yt(s.pop());case"rgb":return 3!==s.length?void wt(e,0,0,0,1):(wt(e,vt(s[0]),vt(s[1]),vt(s[2]),l),Mt(t,e),e);case"hsla":return 4!==s.length?void wt(e,0,0,0,1):(s[3]=yt(s[3]),It(s,e),Mt(t,e),e);case"hsl":return 3!==s.length?void wt(e,0,0,0,1):(It(s,e),Mt(t,e),e);default:return}}wt(e,0,0,0,1)}else{if(4===i.length)return(u=parseInt(i.substr(1),16))>=0&&u<=4095?(wt(e,(3840&u)>>4|(3840&u)>>8,240&u|(240&u)>>4,15&u|(15&u)<<4,1),Mt(t,e),e):void wt(e,0,0,0,1);if(7===i.length){var u=parseInt(i.substr(1),16);return u>=0&&u<=16777215?(wt(e,(16711680&u)>>16,(65280&u)>>8,255&u,1),Mt(t,e),e):void wt(e,0,0,0,1)}}}}function It(t,e){var n=(parseFloat(t[0])%360+360)%360/360,i=yt(t[1]),r=yt(t[2]),o=r<=.5?r*(i+1):r+i-r*i,a=2*r-o;return e=e||[],wt(e,pt(255*xt(a,o,n+1/3)),pt(255*xt(a,o,n)),pt(255*xt(a,o,n-1/3)),1),4===t.length&&(e[3]=t[3]),e}function Ct(t){if(t){var e,n,i=t[0]/255,r=t[1]/255,o=t[2]/255,a=Math.min(i,r,o),s=Math.max(i,r,o),l=s-a,u=(s+a)/2;if(0===l)e=0,n=0;else{n=u<.5?l/(s+a):l/(2-s-a);var h=((s-i)/6+l/2)/l,c=((s-r)/6+l/2)/l,d=((s-o)/6+l/2)/l;i===s?e=d-c:r===s?e=1/3+h-d:o===s&&(e=2/3+c-h),e<0&&(e+=1),e>1&&(e-=1)}var f=[360*e,n,u];return null!=t[3]&&f.push(t[3]),f}}function Tt(t,e){var n=St(t);if(n){for(var i=0;i<3;i++)n[i]=e<0?n[i]*(1-e)|0:(255-n[i])*e+n[i]|0,n[i]>255?n[i]=255:t[i]<0&&(n[i]=0);return Lt(n,4===n.length?"rgba":"rgb")}}function Dt(t){var e=St(t);if(e)return((1<<24)+(e[0]<<16)+(e[1]<<8)+ +e[2]).toString(16).slice(1)}function At(t,e,n){if(e&&e.length&&t>=0&&t<=1){n=n||[];var i=t*(e.length-1),r=Math.floor(i),o=Math.ceil(i),a=e[r],s=e[o],l=i-r;return n[0]=pt(_t(a[0],s[0],l)),n[1]=pt(_t(a[1],s[1],l)),n[2]=pt(_t(a[2],s[2],l)),n[3]=mt(_t(a[3],s[3],l)),n}}function kt(t,e,n){if(e&&e.length&&t>=0&&t<=1){var i=t*(e.length-1),r=Math.floor(i),o=Math.ceil(i),a=St(e[r]),s=St(e[o]),l=i-r,u=Lt([pt(_t(a[0],s[0],l)),pt(_t(a[1],s[1],l)),pt(_t(a[2],s[2],l)),mt(_t(a[3],s[3],l))],"rgba");return n?{color:u,leftIndex:r,rightIndex:o,value:i}:u}}function Pt(t,e){if((t=St(t))&&null!=e)return t[3]=mt(e),Lt(t,"rgba")}function Lt(t,e){if(t&&t.length){var n=t[0]+","+t[1]+","+t[2];return"rgba"!==e&&"hsva"!==e&&"hsla"!==e||(n+=","+t[3]),e+"("+n+")"}}function Ot(t,e){return t[e]}function zt(t,e,n){t[e]=n}function Et(t,e,n){return(e-t)*n+t}function Nt(t,e,n){return n>.5?e:t}function Rt(t,e,n,i,r){var o=t.length;if(1==r)for(s=0;s<o;s++)i[s]=Et(t[s],e[s],n);else for(var a=o&&t[0].length,s=0;s<o;s++)for(var l=0;l<a;l++)i[s][l]=Et(t[s][l],e[s][l],n)}function Bt(t,e,n){var i=t.length,r=e.length;if(i!==r)if(i>r)t.length=r;else for(a=i;a<r;a++)t.push(1===n?e[a]:fg.call(e[a]));for(var o=t[0]&&t[0].length,a=0;a<t.length;a++)if(1===n)isNaN(t[a])&&(t[a]=e[a]);else for(var s=0;s<o;s++)isNaN(t[a][s])&&(t[a][s]=e[a][s])}function Vt(t,e,n){if(t===e)return!0;var i=t.length;if(i!==e.length)return!1;if(1===n){for(o=0;o<i;o++)if(t[o]!==e[o])return!1}else for(var r=t[0].length,o=0;o<i;o++)for(var a=0;a<r;a++)if(t[o][a]!==e[o][a])return!1;return!0}function Ft(t,e,n,i,r,o,a,s,l){var u=t.length;if(1==l)for(c=0;c<u;c++)s[c]=Ht(t[c],e[c],n[c],i[c],r,o,a);else for(var h=t[0].length,c=0;c<u;c++)for(var d=0;d<h;d++)s[c][d]=Ht(t[c][d],e[c][d],n[c][d],i[c][d],r,o,a)}function Ht(t,e,n,i,r,o,a){var s=.5*(n-t),l=.5*(i-e);return(2*(e-n)+s+l)*a+(-3*(e-n)-2*s-l)*o+s*r+e}function Gt(t){if(c(t)){var e=t.length;if(c(t[0])){for(var n=[],i=0;i<e;i++)n.push(fg.call(t[i]));return n}return fg.call(t)}return t}function Wt(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")"}function Zt(t){var e=t[t.length-1].value;return c(e&&e[0])?2:1}function Ut(t,e,n,i,r,o){var a=t._getter,s=t._setter,l="spline"===e,u=i.length;if(u){var h,d=c(i[0].value),f=!1,p=!1,g=d?Zt(i):0;i.sort(function(t,e){return t.time-e.time}),h=i[u-1].time;for(var m=[],v=[],y=i[0].value,x=!0,_=0;_<u;_++){m.push(i[_].time/h);var w=i[_].value;if(d&&Vt(w,y,g)||!d&&w===y||(x=!1),y=w,"string"==typeof w){var b=St(w);b?(w=b,f=!0):p=!0}v.push(w)}if(o||!x){for(var M=v[u-1],_=0;_<u-1;_++)d?Bt(v[_],M,g):!isNaN(v[_])||isNaN(M)||p||f||(v[_]=M);d&&Bt(a(t._target,r),M,g);var S,I,C,T,D,A,k=0,P=0;if(f)var L=[0,0,0,0];var O=new ft({target:t._target,life:h,loop:t._loop,delay:t._delay,onframe:function(t,e){var n;if(e<0)n=0;else if(e<P){for(n=S=Math.min(k+1,u-1);n>=0&&!(m[n]<=e);n--);n=Math.min(n,u-2)}else{for(n=k;n<u&&!(m[n]>e);n++);n=Math.min(n-1,u-2)}k=n,P=e;var i=m[n+1]-m[n];if(0!==i)if(I=(e-m[n])/i,l)if(T=v[n],C=v[0===n?n:n-1],D=v[n>u-2?u-1:n+1],A=v[n>u-3?u-1:n+2],d)Ft(C,T,D,A,I,I*I,I*I*I,a(t,r),g);else{if(f)o=Ft(C,T,D,A,I,I*I,I*I*I,L,1),o=Wt(L);else{if(p)return Nt(T,D,I);o=Ht(C,T,D,A,I,I*I,I*I*I)}s(t,r,o)}else if(d)Rt(v[n],v[n+1],I,a(t,r),g);else{var o;if(f)Rt(v[n],v[n+1],I,L,1),o=Wt(L);else{if(p)return Nt(v[n],v[n+1],I);o=Et(v[n],v[n+1],I)}s(t,r,o)}},ondestroy:n});return e&&"spline"!==e&&(O.easing=e),O}}}function Xt(t,e,n,i){n<0&&(t+=n,n=-n),i<0&&(e+=i,i=-i),this.x=t,this.y=e,this.width=n,this.height=i}function jt(t){for(var e=0;t>=Ig;)e|=1&t,t>>=1;return t+e}function Yt(t,e,n,i){var r=e+1;if(r===n)return 1;if(i(t[r++],t[e])<0){for(;r<n&&i(t[r],t[r-1])<0;)r++;qt(t,e,r)}else for(;r<n&&i(t[r],t[r-1])>=0;)r++;return r-e}function qt(t,e,n){for(n--;e<n;){var i=t[e];t[e++]=t[n],t[n--]=i}}function $t(t,e,n,i,r){for(i===e&&i++;i<n;i++){for(var o,a=t[i],s=e,l=i;s<l;)r(a,t[o=s+l>>>1])<0?l=o:s=o+1;var u=i-s;switch(u){case 3:t[s+3]=t[s+2];case 2:t[s+2]=t[s+1];case 1:t[s+1]=t[s];break;default:for(;u>0;)t[s+u]=t[s+u-1],u--}t[s]=a}}function Kt(t,e,n,i,r,o){var a=0,s=0,l=1;if(o(t,e[n+r])>0){for(s=i-r;l<s&&o(t,e[n+r+l])>0;)a=l,(l=1+(l<<1))<=0&&(l=s);l>s&&(l=s),a+=r,l+=r}else{for(s=r+1;l<s&&o(t,e[n+r-l])<=0;)a=l,(l=1+(l<<1))<=0&&(l=s);l>s&&(l=s);var u=a;a=r-l,l=r-u}for(a++;a<l;){var h=a+(l-a>>>1);o(t,e[n+h])>0?a=h+1:l=h}return l}function Qt(t,e,n,i,r,o){var a=0,s=0,l=1;if(o(t,e[n+r])<0){for(s=r+1;l<s&&o(t,e[n+r-l])<0;)a=l,(l=1+(l<<1))<=0&&(l=s);l>s&&(l=s);var u=a;a=r-l,l=r-u}else{for(s=i-r;l<s&&o(t,e[n+r+l])>=0;)a=l,(l=1+(l<<1))<=0&&(l=s);l>s&&(l=s),a+=r,l+=r}for(a++;a<l;){var h=a+(l-a>>>1);o(t,e[n+h])<0?l=h:a=h+1}return l}function Jt(t,e){function n(n){var s=o[n],u=a[n],h=o[n+1],c=a[n+1];a[n]=u+c,n===l-3&&(o[n+1]=o[n+2],a[n+1]=a[n+2]),l--;var d=Qt(t[h],t,s,u,0,e);s+=d,0!==(u-=d)&&0!==(c=Kt(t[s+u-1],t,h,c,c-1,e))&&(u<=c?i(s,u,h,c):r(s,u,h,c))}function i(n,i,r,o){var a=0;for(a=0;a<i;a++)u[a]=t[n+a];var l=0,h=r,c=n;if(t[c++]=t[h++],0!=--o)if(1!==i){for(var d,f,p,g=s;;){d=0,f=0,p=!1;do{if(e(t[h],u[l])<0){if(t[c++]=t[h++],f++,d=0,0==--o){p=!0;break}}else if(t[c++]=u[l++],d++,f=0,1==--i){p=!0;break}}while((d|f)<g);if(p)break;do{if(0!==(d=Qt(t[h],u,l,i,0,e))){for(a=0;a<d;a++)t[c+a]=u[l+a];if(c+=d,l+=d,(i-=d)<=1){p=!0;break}}if(t[c++]=t[h++],0==--o){p=!0;break}if(0!==(f=Kt(u[l],t,h,o,0,e))){for(a=0;a<f;a++)t[c+a]=t[h+a];if(c+=f,h+=f,0===(o-=f)){p=!0;break}}if(t[c++]=u[l++],1==--i){p=!0;break}g--}while(d>=Cg||f>=Cg);if(p)break;g<0&&(g=0),g+=2}if((s=g)<1&&(s=1),1===i){for(a=0;a<o;a++)t[c+a]=t[h+a];t[c+o]=u[l]}else{if(0===i)throw new Error;for(a=0;a<i;a++)t[c+a]=u[l+a]}}else{for(a=0;a<o;a++)t[c+a]=t[h+a];t[c+o]=u[l]}else for(a=0;a<i;a++)t[c+a]=u[l+a]}function r(n,i,r,o){var a=0;for(a=0;a<o;a++)u[a]=t[r+a];var l=n+i-1,h=o-1,c=r+o-1,d=0,f=0;if(t[c--]=t[l--],0!=--i)if(1!==o){for(var p=s;;){var g=0,m=0,v=!1;do{if(e(u[h],t[l])<0){if(t[c--]=t[l--],g++,m=0,0==--i){v=!0;break}}else if(t[c--]=u[h--],m++,g=0,1==--o){v=!0;break}}while((g|m)<p);if(v)break;do{if(0!=(g=i-Qt(u[h],t,n,i,i-1,e))){for(i-=g,f=(c-=g)+1,d=(l-=g)+1,a=g-1;a>=0;a--)t[f+a]=t[d+a];if(0===i){v=!0;break}}if(t[c--]=u[h--],1==--o){v=!0;break}if(0!=(m=o-Kt(t[l],u,0,o,o-1,e))){for(o-=m,f=(c-=m)+1,d=(h-=m)+1,a=0;a<m;a++)t[f+a]=u[d+a];if(o<=1){v=!0;break}}if(t[c--]=t[l--],0==--i){v=!0;break}p--}while(g>=Cg||m>=Cg);if(v)break;p<0&&(p=0),p+=2}if((s=p)<1&&(s=1),1===o){for(f=(c-=i)+1,d=(l-=i)+1,a=i-1;a>=0;a--)t[f+a]=t[d+a];t[c]=u[h]}else{if(0===o)throw new Error;for(d=c-(o-1),a=0;a<o;a++)t[d+a]=u[a]}}else{for(f=(c-=i)+1,d=(l-=i)+1,a=i-1;a>=0;a--)t[f+a]=t[d+a];t[c]=u[h]}else for(d=c-(o-1),a=0;a<o;a++)t[d+a]=u[a]}var o,a,s=Cg,l=0,u=[];o=[],a=[],this.mergeRuns=function(){for(;l>1;){var t=l-2;if(t>=1&&a[t-1]<=a[t]+a[t+1]||t>=2&&a[t-2]<=a[t]+a[t-1])a[t-1]<a[t+1]&&t--;else if(a[t]>a[t+1])break;n(t)}},this.forceMergeRuns=function(){for(;l>1;){var t=l-2;t>0&&a[t-1]<a[t+1]&&t--,n(t)}},this.pushRun=function(t,e){o[l]=t,a[l]=e,l+=1}}function te(t,e,n,i){n||(n=0),i||(i=t.length);var r=i-n;if(!(r<2)){var o=0;if(r<Ig)return o=Yt(t,n,i,e),void $t(t,n,i,n+o,e);var a=new Jt(t,e),s=jt(r);do{if((o=Yt(t,n,i,e))<s){var l=r;l>s&&(l=s),$t(t,n,n+l,n+o,e),o=l}a.pushRun(n,o),a.mergeRuns(),r-=o,n+=o}while(0!==r);a.forceMergeRuns()}}function ee(t,e){return t.zlevel===e.zlevel?t.z===e.z?t.z2-e.z2:t.z-e.z:t.zlevel-e.zlevel}function ne(t,e,n){var i=null==e.x?0:e.x,r=null==e.x2?1:e.x2,o=null==e.y?0:e.y,a=null==e.y2?0:e.y2;return e.global||(i=i*n.width+n.x,r=r*n.width+n.x,o=o*n.height+n.y,a=a*n.height+n.y),i=isNaN(i)?0:i,r=isNaN(r)?1:r,o=isNaN(o)?0:o,a=isNaN(a)?0:a,t.createLinearGradient(i,o,r,a)}function ie(t,e,n){var i=n.width,r=n.height,o=Math.min(i,r),a=null==e.x?.5:e.x,s=null==e.y?.5:e.y,l=null==e.r?.5:e.r;return e.global||(a=a*i+n.x,s=s*r+n.y,l*=o),t.createRadialGradient(a,s,0,a,s,l)}function re(){return!1}function oe(t,e,n){var i=Op(),r=e.getWidth(),o=e.getHeight(),a=i.style;return a&&(a.position="absolute",a.left=0,a.top=0,a.width=r+"px",a.height=o+"px",i.setAttribute("data-zr-dom-id",t)),i.width=r*n,i.height=o*n,i}function ae(t){if("string"==typeof t){var e=Bg.get(t);return e&&e.image}return t}function se(t,e,n,i,r){if(t){if("string"==typeof t){if(e&&e.__zrImageSrc===t||!n)return e;var o=Bg.get(t),a={hostEl:n,cb:i,cbPayload:r};return o?!ue(e=o.image)&&o.pending.push(a):(!e&&(e=new Image),e.onload=le,Bg.put(t,e.__cachedImgObj={image:e,pending:[a]}),e.src=e.__zrImageSrc=t),e}return t}return e}function le(){var t=this.__cachedImgObj;this.onload=this.__cachedImgObj=null;for(var e=0;e<t.pending.length;e++){var n=t.pending[e],i=n.cb;i&&i(this,n.cbPayload),n.hostEl.dirty()}t.pending.length=0}function ue(t){return t&&t.width&&t.height}function he(t,e){var n=t+":"+(e=e||Wg);if(Vg[n])return Vg[n];for(var i=(t+"").split("\n"),r=0,o=0,a=i.length;o<a;o++)r=Math.max(be(i[o],e).width,r);return Fg>Hg&&(Fg=0,Vg={}),Fg++,Vg[n]=r,r}function ce(t,e,n,i,r,o,a){return o?fe(t,e,n,i,r,o,a):de(t,e,n,i,r,a)}function de(t,e,n,i,r,o){var a=Me(t,e,r,o),s=he(t,e);r&&(s+=r[1]+r[3]);var l=a.outerHeight,u=new Xt(pe(0,s,n),ge(0,l,i),s,l);return u.lineHeight=a.lineHeight,u}function fe(t,e,n,i,r,o,a){var s=Se(t,{rich:o,truncate:a,font:e,textAlign:n,textPadding:r}),l=s.outerWidth,u=s.outerHeight;return new Xt(pe(0,l,n),ge(0,u,i),l,u)}function pe(t,e,n){return"right"===n?t-=e:"center"===n&&(t-=e/2),t}function ge(t,e,n){return"middle"===n?t-=e/2:"bottom"===n&&(t-=e),t}function me(t,e,n){var i=e.x,r=e.y,o=e.height,a=e.width,s=o/2,l="left",u="top";switch(t){case"left":i-=n,r+=s,l="right",u="middle";break;case"right":i+=n+a,r+=s,u="middle";break;case"top":i+=a/2,r-=n,l="center",u="bottom";break;case"bottom":i+=a/2,r+=o+n,l="center";break;case"inside":i+=a/2,r+=s,l="center",u="middle";break;case"insideLeft":i+=n,r+=s,u="middle";break;case"insideRight":i+=a-n,r+=s,l="right",u="middle";break;case"insideTop":i+=a/2,r+=n,l="center";break;case"insideBottom":i+=a/2,r+=o-n,l="center",u="bottom";break;case"insideTopLeft":i+=n,r+=n;break;case"insideTopRight":i+=a-n,r+=n,l="right";break;case"insideBottomLeft":i+=n,r+=o-n,u="bottom";break;case"insideBottomRight":i+=a-n,r+=o-n,l="right",u="bottom"}return{x:i,y:r,textAlign:l,textVerticalAlign:u}}function ve(t,e,n,i,r){if(!e)return"";var o=(t+"").split("\n");r=ye(e,n,i,r);for(var a=0,s=o.length;a<s;a++)o[a]=xe(o[a],r);return o.join("\n")}function ye(t,e,n,i){(i=o({},i)).font=e;var n=T(n,"...");i.maxIterations=T(i.maxIterations,2);var r=i.minChar=T(i.minChar,0);i.cnCharWidth=he("国",e);var a=i.ascCharWidth=he("a",e);i.placeholder=T(i.placeholder,"");for(var s=t=Math.max(0,t-1),l=0;l<r&&s>=a;l++)s-=a;var u=he(n);return u>s&&(n="",u=0),s=t-u,i.ellipsis=n,i.ellipsisWidth=u,i.contentWidth=s,i.containerWidth=t,i}function xe(t,e){var n=e.containerWidth,i=e.font,r=e.contentWidth;if(!n)return"";var o=he(t,i);if(o<=n)return t;for(var a=0;;a++){if(o<=r||a>=e.maxIterations){t+=e.ellipsis;break}var s=0===a?_e(t,r,e.ascCharWidth,e.cnCharWidth):o>0?Math.floor(t.length*r/o):0;o=he(t=t.substr(0,s),i)}return""===t&&(t=e.placeholder),t}function _e(t,e,n,i){for(var r=0,o=0,a=t.length;o<a&&r<e;o++){var s=t.charCodeAt(o);r+=0<=s&&s<=127?n:i}return o}function we(t){return he("国",t)}function be(t,e){return Zg.measureText(t,e)}function Me(t,e,n,i){null!=t&&(t+="");var r=we(e),o=t?t.split("\n"):[],a=o.length*r,s=a;if(n&&(s+=n[0]+n[2]),t&&i){var l=i.outerHeight,u=i.outerWidth;if(null!=l&&s>l)t="",o=[];else if(null!=u)for(var h=ye(u-(n?n[1]+n[3]:0),e,i.ellipsis,{minChar:i.minChar,placeholder:i.placeholder}),c=0,d=o.length;c<d;c++)o[c]=xe(o[c],h)}return{lines:o,height:a,outerHeight:s,lineHeight:r}}function Se(t,e){var n={lines:[],width:0,height:0};if(null!=t&&(t+=""),!t)return n;for(var i,r=Gg.lastIndex=0;null!=(i=Gg.exec(t));){var o=i.index;o>r&&Ie(n,t.substring(r,o)),Ie(n,i[2],i[1]),r=Gg.lastIndex}r<t.length&&Ie(n,t.substring(r,t.length));var a=n.lines,s=0,l=0,u=[],h=e.textPadding,c=e.truncate,d=c&&c.outerWidth,f=c&&c.outerHeight;h&&(null!=d&&(d-=h[1]+h[3]),null!=f&&(f-=h[0]+h[2]));for(k=0;k<a.length;k++){for(var p=a[k],g=0,m=0,v=0;v<p.tokens.length;v++){var y=(P=p.tokens[v]).styleName&&e.rich[P.styleName]||{},x=P.textPadding=y.textPadding,_=P.font=y.font||e.font,w=P.textHeight=T(y.textHeight,we(_));if(x&&(w+=x[0]+x[2]),P.height=w,P.lineHeight=D(y.textLineHeight,e.textLineHeight,w),P.textAlign=y&&y.textAlign||e.textAlign,P.textVerticalAlign=y&&y.textVerticalAlign||"middle",null!=f&&s+P.lineHeight>f)return{lines:[],width:0,height:0};P.textWidth=he(P.text,_);var b=y.textWidth,M=null==b||"auto"===b;if("string"==typeof b&&"%"===b.charAt(b.length-1))P.percentWidth=b,u.push(P),b=0;else{if(M){b=P.textWidth;var S=y.textBackgroundColor,I=S&&S.image;I&&ue(I=ae(I))&&(b=Math.max(b,I.width*w/I.height))}var C=x?x[1]+x[3]:0;b+=C;var A=null!=d?d-m:null;null!=A&&A<b&&(!M||A<C?(P.text="",P.textWidth=b=0):(P.text=ve(P.text,A-C,_,c.ellipsis,{minChar:c.minChar}),P.textWidth=he(P.text,_),b=P.textWidth+C))}m+=P.width=b,y&&(g=Math.max(g,P.lineHeight))}p.width=m,p.lineHeight=g,s+=g,l=Math.max(l,m)}n.outerWidth=n.width=T(e.textWidth,l),n.outerHeight=n.height=T(e.textHeight,s),h&&(n.outerWidth+=h[1]+h[3],n.outerHeight+=h[0]+h[2]);for(var k=0;k<u.length;k++){var P=u[k],L=P.percentWidth;P.width=parseInt(L,10)/100*l}return n}function Ie(t,e,n){for(var i=""===e,r=e.split("\n"),o=t.lines,a=0;a<r.length;a++){var s=r[a],l={styleName:n,text:s,isLineHolder:!s&&!i};if(a)o.push({tokens:[l]});else{var u=(o[o.length-1]||(o[0]={tokens:[]})).tokens,h=u.length;1===h&&u[0].isLineHolder?u[0]=l:(s||!h||i)&&u.push(l)}}}function Ce(t){var e=(t.fontSize||t.fontFamily)&&[t.fontStyle,t.fontWeight,(t.fontSize||12)+"px",t.fontFamily||"sans-serif"].join(" ");return e&&L(e)||t.textFont||t.font}function Te(t,e){var n,i,r,o,a=e.x,s=e.y,l=e.width,u=e.height,h=e.r;l<0&&(a+=l,l=-l),u<0&&(s+=u,u=-u),"number"==typeof h?n=i=r=o=h:h instanceof Array?1===h.length?n=i=r=o=h[0]:2===h.length?(n=r=h[0],i=o=h[1]):3===h.length?(n=h[0],i=o=h[1],r=h[2]):(n=h[0],i=h[1],r=h[2],o=h[3]):n=i=r=o=0;var c;n+i>l&&(n*=l/(c=n+i),i*=l/c),r+o>l&&(r*=l/(c=r+o),o*=l/c),i+r>u&&(i*=u/(c=i+r),r*=u/c),n+o>u&&(n*=u/(c=n+o),o*=u/c),t.moveTo(a+n,s),t.lineTo(a+l-i,s),0!==i&&t.arc(a+l-i,s+i,i,-Math.PI/2,0),t.lineTo(a+l,s+u-r),0!==r&&t.arc(a+l-r,s+u-r,r,0,Math.PI/2),t.lineTo(a+o,s+u),0!==o&&t.arc(a+o,s+u-o,o,Math.PI/2,Math.PI),t.lineTo(a,s+n),0!==n&&t.arc(a+n,s+n,n,Math.PI,1.5*Math.PI)}function De(t){return Ae(t),d(t.rich,Ae),t}function Ae(t){if(t){t.font=Ce(t);var e=t.textAlign;"middle"===e&&(e="center"),t.textAlign=null==e||Ug[e]?e:"left";var n=t.textVerticalAlign||t.textBaseline;"center"===n&&(n="middle"),t.textVerticalAlign=null==n||Xg[n]?n:"top",t.textPadding&&(t.textPadding=k(t.textPadding))}}function ke(t,e,n,i,r){i.rich?Le(t,e,n,i,r):Pe(t,e,n,i,r)}function Pe(t,e,n,i,r){var o=Fe(e,"font",i.font||Wg),a=i.textPadding,s=t.__textCotentBlock;s&&!t.__dirty||(s=t.__textCotentBlock=Me(n,o,a,i.truncate));var l=s.outerHeight,u=s.lines,h=s.lineHeight,c=Ve(l,i,r),d=c.baseX,f=c.baseY,p=c.textAlign,g=c.textVerticalAlign;ze(e,i,r,d,f);var m=ge(f,l,g),v=d,y=m,x=Ne(i);if(x||a){var _=he(n,o);a&&(_+=a[1]+a[3]);var w=pe(d,_,p);x&&Re(t,e,i,w,m,_,l),a&&(v=Ze(d,p,a),y+=a[0])}Fe(e,"textAlign",p||"left"),Fe(e,"textBaseline","middle"),Fe(e,"shadowBlur",i.textShadowBlur||0),Fe(e,"shadowColor",i.textShadowColor||"transparent"),Fe(e,"shadowOffsetX",i.textShadowOffsetX||0),Fe(e,"shadowOffsetY",i.textShadowOffsetY||0),y+=h/2;var b=i.textStrokeWidth,M=He(i.textStroke,b),S=Ge(i.textFill);M&&(Fe(e,"lineWidth",b),Fe(e,"strokeStyle",M)),S&&Fe(e,"fillStyle",S);for(var I=0;I<u.length;I++)M&&e.strokeText(u[I],v,y),S&&e.fillText(u[I],v,y),y+=h}function Le(t,e,n,i,r){var o=t.__textCotentBlock;o&&!t.__dirty||(o=t.__textCotentBlock=Se(n,i)),Oe(t,e,o,i,r)}function Oe(t,e,n,i,r){var o=n.width,a=n.outerWidth,s=n.outerHeight,l=i.textPadding,u=Ve(s,i,r),h=u.baseX,c=u.baseY,d=u.textAlign,f=u.textVerticalAlign;ze(e,i,r,h,c);var p=pe(h,a,d),g=ge(c,s,f),m=p,v=g;l&&(m+=l[3],v+=l[0]);var y=m+o;Ne(i)&&Re(t,e,i,p,g,a,s);for(var x=0;x<n.lines.length;x++){for(var _,w=n.lines[x],b=w.tokens,M=b.length,S=w.lineHeight,I=w.width,C=0,T=m,D=y,A=M-1;C<M&&(!(_=b[C]).textAlign||"left"===_.textAlign);)Ee(t,e,_,i,S,v,T,"left"),I-=_.width,T+=_.width,C++;for(;A>=0&&"right"===(_=b[A]).textAlign;)Ee(t,e,_,i,S,v,D,"right"),I-=_.width,D-=_.width,A--;for(T+=(o-(T-m)-(y-D)-I)/2;C<=A;)Ee(t,e,_=b[C],i,S,v,T+_.width/2,"center"),T+=_.width,C++;v+=S}}function ze(t,e,n,i,r){if(n&&e.textRotation){var o=e.textOrigin;"center"===o?(i=n.width/2+n.x,r=n.height/2+n.y):o&&(i=o[0]+n.x,r=o[1]+n.y),t.translate(i,r),t.rotate(-e.textRotation),t.translate(-i,-r)}}function Ee(t,e,n,i,r,o,a,s){var l=i.rich[n.styleName]||{},u=n.textVerticalAlign,h=o+r/2;"top"===u?h=o+n.height/2:"bottom"===u&&(h=o+r-n.height/2),!n.isLineHolder&&Ne(l)&&Re(t,e,l,"right"===s?a-n.width:"center"===s?a-n.width/2:a,h-n.height/2,n.width,n.height);var c=n.textPadding;c&&(a=Ze(a,s,c),h-=n.height/2-c[2]-n.textHeight/2),Fe(e,"shadowBlur",D(l.textShadowBlur,i.textShadowBlur,0)),Fe(e,"shadowColor",l.textShadowColor||i.textShadowColor||"transparent"),Fe(e,"shadowOffsetX",D(l.textShadowOffsetX,i.textShadowOffsetX,0)),Fe(e,"shadowOffsetY",D(l.textShadowOffsetY,i.textShadowOffsetY,0)),Fe(e,"textAlign",s),Fe(e,"textBaseline","middle"),Fe(e,"font",n.font||Wg);var d=He(l.textStroke||i.textStroke,p),f=Ge(l.textFill||i.textFill),p=T(l.textStrokeWidth,i.textStrokeWidth);d&&(Fe(e,"lineWidth",p),Fe(e,"strokeStyle",d),e.strokeText(n.text,a,h)),f&&(Fe(e,"fillStyle",f),e.fillText(n.text,a,h))}function Ne(t){return t.textBackgroundColor||t.textBorderWidth&&t.textBorderColor}function Re(t,e,n,i,r,o,a){var s=n.textBackgroundColor,l=n.textBorderWidth,u=n.textBorderColor,h=_(s);if(Fe(e,"shadowBlur",n.textBoxShadowBlur||0),Fe(e,"shadowColor",n.textBoxShadowColor||"transparent"),Fe(e,"shadowOffsetX",n.textBoxShadowOffsetX||0),Fe(e,"shadowOffsetY",n.textBoxShadowOffsetY||0),h||l&&u){e.beginPath();var c=n.textBorderRadius;c?Te(e,{x:i,y:r,width:o,height:a,r:c}):e.rect(i,r,o,a),e.closePath()}if(h)Fe(e,"fillStyle",s),e.fill();else if(w(s)){var d=s.image;(d=se(d,null,t,Be,s))&&ue(d)&&e.drawImage(d,i,r,o,a)}l&&u&&(Fe(e,"lineWidth",l),Fe(e,"strokeStyle",u),e.stroke())}function Be(t,e){e.image=t}function Ve(t,e,n){var i=e.x||0,r=e.y||0,o=e.textAlign,a=e.textVerticalAlign;if(n){var s=e.textPosition;if(s instanceof Array)i=n.x+We(s[0],n.width),r=n.y+We(s[1],n.height);else{var l=me(s,n,e.textDistance);i=l.x,r=l.y,o=o||l.textAlign,a=a||l.textVerticalAlign}var u=e.textOffset;u&&(i+=u[0],r+=u[1])}return{baseX:i,baseY:r,textAlign:o,textVerticalAlign:a}}function Fe(t,e,n){return t[e]=Ag(t,e,n),t[e]}function He(t,e){return null==t||e<=0||"transparent"===t||"none"===t?null:t.image||t.colorStops?"#000":t}function Ge(t){return null==t||"none"===t?null:t.image||t.colorStops?"#000":t}function We(t,e){return"string"==typeof t?t.lastIndexOf("%")>=0?parseFloat(t)/100*e:parseFloat(t):t}function Ze(t,e,n){return"right"===e?t-n[1]:"center"===e?t+n[3]/2-n[1]/2:t+n[3]}function Ue(t,e){return null!=t&&(t||e.textBackgroundColor||e.textBorderWidth&&e.textBorderColor||e.textPadding)}function Xe(t){t=t||{},_g.call(this,t);for(var e in t)t.hasOwnProperty(e)&&"style"!==e&&(this[e]=t[e]);this.style=new Pg(t.style,this),this._rect=null,this.__clipPaths=[]}function je(t){Xe.call(this,t)}function Ye(t){return parseInt(t,10)}function qe(t){return!!t&&(!!t.__builtin__||"function"==typeof t.resize&&"function"==typeof t.refresh)}function $e(t,e,n){return qg.copy(t.getBoundingRect()),t.transform&&qg.applyTransform(t.transform),$g.width=e,$g.height=n,!qg.intersect($g)}function Ke(t,e){if(t==e)return!1;if(!t||!e||t.length!==e.length)return!0;for(var n=0;n<t.length;n++)if(t[n]!==e[n])return!0}function Qe(t,e){for(var n=0;n<t.length;n++){var i=t[n];i.setTransform(e),e.beginPath(),i.buildPath(e,i.shape),e.clip(),i.restoreTransform(e)}}function Je(t,e){var n=document.createElement("div");return n.style.cssText=["position:relative","overflow:hidden","width:"+t+"px","height:"+e+"px","padding:0","margin:0","border-width:0"].join(";")+";",n}function tn(t){return t.getBoundingClientRect?t.getBoundingClientRect():{left:0,top:0}}function en(t,e,n,i){return n=n||{},i||!bp.canvasSupported?nn(t,e,n):bp.browser.firefox&&null!=e.layerX&&e.layerX!==e.offsetX?(n.zrX=e.layerX,n.zrY=e.layerY):null!=e.offsetX?(n.zrX=e.offsetX,n.zrY=e.offsetY):nn(t,e,n),n}function nn(t,e,n){var i=tn(t);n.zrX=e.clientX-i.left,n.zrY=e.clientY-i.top}function rn(t,e,n){if(null!=(e=e||window.event).zrX)return e;var i=e.type;if(i&&i.indexOf("touch")>=0){var r="touchend"!=i?e.targetTouches[0]:e.changedTouches[0];r&&en(t,r,e,n)}else en(t,e,e,n),e.zrDelta=e.wheelDelta?e.wheelDelta/120:-(e.detail||0)/3;var o=e.button;return null==e.which&&void 0!==o&&Jg.test(e.type)&&(e.which=1&o?1:2&o?3:4&o?2:0),e}function on(t,e,n){Qg?t.addEventListener(e,n):t.attachEvent("on"+e,n)}function an(t,e,n){Qg?t.removeEventListener(e,n):t.detachEvent("on"+e,n)}function sn(t){return t.which>1}function ln(t){var e=t[1][0]-t[0][0],n=t[1][1]-t[0][1];return Math.sqrt(e*e+n*n)}function un(t){return[(t[0][0]+t[1][0])/2,(t[0][1]+t[1][1])/2]}function hn(t){return"mousewheel"===t&&bp.browser.firefox?"DOMMouseScroll":t}function cn(t,e,n){var i=t._gestureMgr;"start"===n&&i.clear();var r=i.recognize(e,t.handler.findHover(e.zrX,e.zrY,null).target,t.dom);if("end"===n&&i.clear(),r){var o=r.type;e.gestureEvent=o,t.handler.dispatchToElement({target:r.target},o,r.event)}}function dn(t){t._touching=!0,clearTimeout(t._touchTimer),t._touchTimer=setTimeout(function(){t._touching=!1},700)}function fn(t){var e=t.pointerType;return"pen"===e||"touch"===e}function pn(t){function e(t,e){return function(){if(!e._touching)return t.apply(e,arguments)}}d(om,function(e){t._handlers[e]=m(lm[e],t)}),d(sm,function(e){t._handlers[e]=m(lm[e],t)}),d(rm,function(n){t._handlers[n]=e(lm[n],t)})}function gn(t){function e(e,n){d(e,function(e){on(t,hn(e),n._handlers[e])},n)}Zp.call(this),this.dom=t,this._touching=!1,this._touchTimer,this._gestureMgr=new nm,this._handlers={},pn(this),bp.pointerEventsSupported?e(sm,this):(bp.touchEventsSupported&&e(om,this),e(rm,this))}function mn(t,e){var n=new fm(_p(),t,e);return dm[n.id]=n,n}function vn(t,e){cm[t]=e}function yn(t){delete dm[t]}function xn(t){return t instanceof Array?t:null==t?[]:[t]}function _n(t,e,n){if(t){t[e]=t[e]||{},t.emphasis=t.emphasis||{},t.emphasis[e]=t.emphasis[e]||{};for(var i=0,r=n.length;i<r;i++){var o=n[i];!t.emphasis[e].hasOwnProperty(o)&&t[e].hasOwnProperty(o)&&(t.emphasis[e][o]=t[e][o])}}}function wn(t){return!mm(t)||vm(t)||t instanceof Date?t:t.value}function bn(t){return mm(t)&&!(t instanceof Array)}function Mn(t,e){e=(e||[]).slice();var n=f(t||[],function(t,e){return{exist:t}});return gm(e,function(t,i){if(mm(t)){for(r=0;r<n.length;r++)if(!n[r].option&&null!=t.id&&n[r].exist.id===t.id+"")return n[r].option=t,void(e[i]=null);for(var r=0;r<n.length;r++){var o=n[r].exist;if(!(n[r].option||null!=o.id&&null!=t.id||null==t.name||Cn(t)||Cn(o)||o.name!==t.name+""))return n[r].option=t,void(e[i]=null)}}}),gm(e,function(t,e){if(mm(t)){for(var i=0;i<n.length;i++){var r=n[i].exist;if(!n[i].option&&!Cn(r)&&null==t.id){n[i].option=t;break}}i>=n.length&&n.push({option:t})}}),n}function Sn(t){var e=N();gm(t,function(t,n){var i=t.exist;i&&e.set(i.id,t)}),gm(t,function(t,n){var i=t.option;P(!i||null==i.id||!e.get(i.id)||e.get(i.id)===t,"id duplicates: "+(i&&i.id)),i&&null!=i.id&&e.set(i.id,t),!t.keyInfo&&(t.keyInfo={})}),gm(t,function(t,n){var i=t.exist,r=t.option,o=t.keyInfo;if(mm(r)){if(o.name=null!=r.name?r.name+"":i?i.name:ym+n,i)o.id=i.id;else if(null!=r.id)o.id=r.id+"";else{var a=0;do{o.id="\0"+o.name+"\0"+a++}while(e.get(o.id))}e.set(o.id,t)}})}function In(t){var e=t.name;return!(!e||!e.indexOf(ym))}function Cn(t){return mm(t)&&t.id&&0===(t.id+"").indexOf("\0_ec_\0")}function Tn(t,e){return null!=e.dataIndexInside?e.dataIndexInside:null!=e.dataIndex?y(e.dataIndex)?f(e.dataIndex,function(e){return t.indexOfRawIndex(e)}):t.indexOfRawIndex(e.dataIndex):null!=e.name?y(e.name)?f(e.name,function(e){return t.indexOfName(e)}):t.indexOfName(e.name):void 0}function Dn(){var t="__\0ec_inner_"+_m+++"_"+Math.random().toFixed(5);return function(e){return e[t]||(e[t]={})}}function An(t,e,n){if(_(e)){var i={};i[e+"Index"]=0,e=i}var r=n&&n.defaultMainType;!r||kn(e,r+"Index")||kn(e,r+"Id")||kn(e,r+"Name")||(e[r+"Index"]=0);var o={};return gm(e,function(i,r){var i=e[r];if("dataIndex"!==r&&"dataIndexInside"!==r){var a=r.match(/^(\w+)(Index|Id|Name)$/)||[],s=a[1],u=(a[2]||"").toLowerCase();if(!(!s||!u||null==i||"index"===u&&"none"===i||n&&n.includeMainTypes&&l(n.includeMainTypes,s)<0)){var h={mainType:s};"index"===u&&"all"===i||(h[u]=i);var c=t.queryComponents(h);o[s+"Models"]=c,o[s+"Model"]=c[0]}}else o[r]=i}),o}function kn(t,e){return t&&t.hasOwnProperty(e)}function Pn(t,e,n){t.setAttribute?t.setAttribute(e,n):t[e]=n}function Ln(t,e){return t.getAttribute?t.getAttribute(e):t[e]}function On(t){var e={main:"",sub:""};return t&&(t=t.split(wm),e.main=t[0]||"",e.sub=t[1]||""),e}function zn(t){P(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(t),'componentType "'+t+'" illegal')}function En(t,e){t.$constructor=t,t.extend=function(t){var e=this,n=function(){t.$constructor?t.$constructor.apply(this,arguments):e.apply(this,arguments)};return o(n.prototype,t),n.extend=this.extend,n.superCall=Rn,n.superApply=Bn,u(n,this),n.superClass=e,n}}function Nn(t){var e=["__\0is_clz",Mm++,Math.random().toFixed(3)].join("_");t.prototype[e]=!0,t.isInstance=function(t){return!(!t||!t[e])}}function Rn(t,e){var n=A(arguments,2);return this.superClass.prototype[e].apply(t,n)}function Bn(t,e,n){return this.superClass.prototype[e].apply(t,n)}function Vn(t,e){function n(t){var e=i[t.main];return e&&e[bm]||((e=i[t.main]={})[bm]=!0),e}e=e||{};var i={};if(t.registerClass=function(t,e){return e&&(zn(e),(e=On(e)).sub?e.sub!==bm&&(n(e)[e.sub]=t):i[e.main]=t),t},t.getClass=function(t,e,n){var r=i[t];if(r&&r[bm]&&(r=e?r[e]:null),n&&!r)throw new Error(e?"Component "+t+"."+(e||"")+" not exists. Load it first.":t+".type should be specified.");return r},t.getClassesByMainType=function(t){t=On(t);var e=[],n=i[t.main];return n&&n[bm]?d(n,function(t,n){n!==bm&&e.push(t)}):e.push(n),e},t.hasClass=function(t){return t=On(t),!!i[t.main]},t.getAllClassMainTypes=function(){var t=[];return d(i,function(e,n){t.push(n)}),t},t.hasSubTypes=function(t){t=On(t);var e=i[t.main];return e&&e[bm]},t.parseClassType=On,e.registerWhenExtend){var r=t.extend;r&&(t.extend=function(e){var n=r.call(this,e);return t.registerClass(n,e.type)})}return t}function Fn(t){return t>-Pm&&t<Pm}function Hn(t){return t>Pm||t<-Pm}function Gn(t,e,n,i,r){var o=1-r;return o*o*(o*t+3*r*e)+r*r*(r*i+3*o*n)}function Wn(t,e,n,i,r){var o=1-r;return 3*(((e-t)*o+2*(n-e)*r)*o+(i-n)*r*r)}function Zn(t,e,n,i,r,o){var a=i+3*(e-n)-t,s=3*(n-2*e+t),l=3*(e-t),u=t-r,h=s*s-3*a*l,c=s*l-9*a*u,d=l*l-3*s*u,f=0;if(Fn(h)&&Fn(c))Fn(s)?o[0]=0:(S=-l/s)>=0&&S<=1&&(o[f++]=S);else{var p=c*c-4*h*d;if(Fn(p)){var g=c/h,m=-g/2;(S=-s/a+g)>=0&&S<=1&&(o[f++]=S),m>=0&&m<=1&&(o[f++]=m)}else if(p>0){var v=km(p),y=h*s+1.5*a*(-c+v),x=h*s+1.5*a*(-c-v);(S=(-s-((y=y<0?-Am(-y,zm):Am(y,zm))+(x=x<0?-Am(-x,zm):Am(x,zm))))/(3*a))>=0&&S<=1&&(o[f++]=S)}else{var _=(2*h*s-3*a*c)/(2*km(h*h*h)),w=Math.acos(_)/3,b=km(h),M=Math.cos(w),S=(-s-2*b*M)/(3*a),m=(-s+b*(M+Om*Math.sin(w)))/(3*a),I=(-s+b*(M-Om*Math.sin(w)))/(3*a);S>=0&&S<=1&&(o[f++]=S),m>=0&&m<=1&&(o[f++]=m),I>=0&&I<=1&&(o[f++]=I)}}return f}function Un(t,e,n,i,r){var o=6*n-12*e+6*t,a=9*e+3*i-3*t-9*n,s=3*e-3*t,l=0;if(Fn(a))Hn(o)&&(c=-s/o)>=0&&c<=1&&(r[l++]=c);else{var u=o*o-4*a*s;if(Fn(u))r[0]=-o/(2*a);else if(u>0){var h=km(u),c=(-o+h)/(2*a),d=(-o-h)/(2*a);c>=0&&c<=1&&(r[l++]=c),d>=0&&d<=1&&(r[l++]=d)}}return l}function Xn(t,e,n,i,r,o){var a=(e-t)*r+t,s=(n-e)*r+e,l=(i-n)*r+n,u=(s-a)*r+a,h=(l-s)*r+s,c=(h-u)*r+u;o[0]=t,o[1]=a,o[2]=u,o[3]=c,o[4]=c,o[5]=h,o[6]=l,o[7]=i}function jn(t,e,n,i,r,o,a,s,l,u,h){var c,d,f,p,g,m=.005,v=1/0;Em[0]=l,Em[1]=u;for(var y=0;y<1;y+=.05)Nm[0]=Gn(t,n,r,a,y),Nm[1]=Gn(e,i,o,s,y),(p=Hp(Em,Nm))<v&&(c=y,v=p);v=1/0;for(var x=0;x<32&&!(m<Lm);x++)d=c-m,f=c+m,Nm[0]=Gn(t,n,r,a,d),Nm[1]=Gn(e,i,o,s,d),p=Hp(Nm,Em),d>=0&&p<v?(c=d,v=p):(Rm[0]=Gn(t,n,r,a,f),Rm[1]=Gn(e,i,o,s,f),g=Hp(Rm,Em),f<=1&&g<v?(c=f,v=g):m*=.5);return h&&(h[0]=Gn(t,n,r,a,c),h[1]=Gn(e,i,o,s,c)),km(v)}function Yn(t,e,n,i){var r=1-i;return r*(r*t+2*i*e)+i*i*n}function qn(t,e,n,i){return 2*((1-i)*(e-t)+i*(n-e))}function $n(t,e,n,i,r){var o=t-2*e+n,a=2*(e-t),s=t-i,l=0;if(Fn(o))Hn(a)&&(c=-s/a)>=0&&c<=1&&(r[l++]=c);else{var u=a*a-4*o*s;if(Fn(u))(c=-a/(2*o))>=0&&c<=1&&(r[l++]=c);else if(u>0){var h=km(u),c=(-a+h)/(2*o),d=(-a-h)/(2*o);c>=0&&c<=1&&(r[l++]=c),d>=0&&d<=1&&(r[l++]=d)}}return l}function Kn(t,e,n){var i=t+n-2*e;return 0===i?.5:(t-e)/i}function Qn(t,e,n,i,r){var o=(e-t)*i+t,a=(n-e)*i+e,s=(a-o)*i+o;r[0]=t,r[1]=o,r[2]=s,r[3]=s,r[4]=a,r[5]=n}function Jn(t,e,n,i,r,o,a,s,l){var u,h=.005,c=1/0;Em[0]=a,Em[1]=s;for(var d=0;d<1;d+=.05)Nm[0]=Yn(t,n,r,d),Nm[1]=Yn(e,i,o,d),(m=Hp(Em,Nm))<c&&(u=d,c=m);c=1/0;for(var f=0;f<32&&!(h<Lm);f++){var p=u-h,g=u+h;Nm[0]=Yn(t,n,r,p),Nm[1]=Yn(e,i,o,p);var m=Hp(Nm,Em);if(p>=0&&m<c)u=p,c=m;else{Rm[0]=Yn(t,n,r,g),Rm[1]=Yn(e,i,o,g);var v=Hp(Rm,Em);g<=1&&v<c?(u=g,c=v):h*=.5}}return l&&(l[0]=Yn(t,n,r,u),l[1]=Yn(e,i,o,u)),km(c)}function ti(t,e,n){if(0!==t.length){var i,r=t[0],o=r[0],a=r[0],s=r[1],l=r[1];for(i=1;i<t.length;i++)r=t[i],o=Bm(o,r[0]),a=Vm(a,r[0]),s=Bm(s,r[1]),l=Vm(l,r[1]);e[0]=o,e[1]=s,n[0]=a,n[1]=l}}function ei(t,e,n,i,r,o){r[0]=Bm(t,n),r[1]=Bm(e,i),o[0]=Vm(t,n),o[1]=Vm(e,i)}function ni(t,e,n,i,r,o,a,s,l,u){var h,c=Un,d=Gn,f=c(t,n,r,a,Xm);for(l[0]=1/0,l[1]=1/0,u[0]=-1/0,u[1]=-1/0,h=0;h<f;h++){var p=d(t,n,r,a,Xm[h]);l[0]=Bm(p,l[0]),u[0]=Vm(p,u[0])}for(f=c(e,i,o,s,jm),h=0;h<f;h++){var g=d(e,i,o,s,jm[h]);l[1]=Bm(g,l[1]),u[1]=Vm(g,u[1])}l[0]=Bm(t,l[0]),u[0]=Vm(t,u[0]),l[0]=Bm(a,l[0]),u[0]=Vm(a,u[0]),l[1]=Bm(e,l[1]),u[1]=Vm(e,u[1]),l[1]=Bm(s,l[1]),u[1]=Vm(s,u[1])}function ii(t,e,n,i,r,o,a,s){var l=Kn,u=Yn,h=Vm(Bm(l(t,n,r),1),0),c=Vm(Bm(l(e,i,o),1),0),d=u(t,n,r,h),f=u(e,i,o,c);a[0]=Bm(t,r,d),a[1]=Bm(e,o,f),s[0]=Vm(t,r,d),s[1]=Vm(e,o,f)}function ri(t,e,n,i,r,o,a,s,l){var u=K,h=Q,c=Math.abs(r-o);if(c%Gm<1e-4&&c>1e-4)return s[0]=t-n,s[1]=e-i,l[0]=t+n,void(l[1]=e+i);if(Wm[0]=Hm(r)*n+t,Wm[1]=Fm(r)*i+e,Zm[0]=Hm(o)*n+t,Zm[1]=Fm(o)*i+e,u(s,Wm,Zm),h(l,Wm,Zm),(r%=Gm)<0&&(r+=Gm),(o%=Gm)<0&&(o+=Gm),r>o&&!a?o+=Gm:r<o&&a&&(r+=Gm),a){var d=o;o=r,r=d}for(var f=0;f<o;f+=Math.PI/2)f>r&&(Um[0]=Hm(f)*n+t,Um[1]=Fm(f)*i+e,u(s,Um,s),h(l,Um,l))}function oi(t,e,n,i,r,o,a){if(0===r)return!1;var s=r,l=0,u=t;if(a>e+s&&a>i+s||a<e-s&&a<i-s||o>t+s&&o>n+s||o<t-s&&o<n-s)return!1;if(t===n)return Math.abs(o-t)<=s/2;var h=(l=(e-i)/(t-n))*o-a+(u=(t*i-n*e)/(t-n));return h*h/(l*l+1)<=s/2*s/2}function ai(t,e,n,i,r,o,a,s,l,u,h){if(0===l)return!1;var c=l;return!(h>e+c&&h>i+c&&h>o+c&&h>s+c||h<e-c&&h<i-c&&h<o-c&&h<s-c||u>t+c&&u>n+c&&u>r+c&&u>a+c||u<t-c&&u<n-c&&u<r-c&&u<a-c)&&jn(t,e,n,i,r,o,a,s,u,h,null)<=c/2}function si(t,e,n,i,r,o,a,s,l){if(0===a)return!1;var u=a;return!(l>e+u&&l>i+u&&l>o+u||l<e-u&&l<i-u&&l<o-u||s>t+u&&s>n+u&&s>r+u||s<t-u&&s<n-u&&s<r-u)&&Jn(t,e,n,i,r,o,s,l,null)<=u/2}function li(t){return(t%=sv)<0&&(t+=sv),t}function ui(t,e,n,i,r,o,a,s,l){if(0===a)return!1;var u=a;s-=t,l-=e;var h=Math.sqrt(s*s+l*l);if(h-u>n||h+u<n)return!1;if(Math.abs(i-r)%lv<1e-4)return!0;if(o){var c=i;i=li(r),r=li(c)}else i=li(i),r=li(r);i>r&&(r+=lv);var d=Math.atan2(l,s);return d<0&&(d+=lv),d>=i&&d<=r||d+lv>=i&&d+lv<=r}function hi(t,e,n,i,r,o){if(o>e&&o>i||o<e&&o<i)return 0;if(i===e)return 0;var a=i<e?1:-1,s=(o-e)/(i-e);1!==s&&0!==s||(a=i<e?.5:-.5);var l=s*(n-t)+t;return l===r?1/0:l>r?a:0}function ci(t,e){return Math.abs(t-e)<cv}function di(){var t=fv[0];fv[0]=fv[1],fv[1]=t}function fi(t,e,n,i,r,o,a,s,l,u){if(u>e&&u>i&&u>o&&u>s||u<e&&u<i&&u<o&&u<s)return 0;var h=Zn(e,i,o,s,u,dv);if(0===h)return 0;for(var c,d,f=0,p=-1,g=0;g<h;g++){var m=dv[g],v=0===m||1===m?.5:1;Gn(t,n,r,a,m)<l||(p<0&&(p=Un(e,i,o,s,fv),fv[1]<fv[0]&&p>1&&di(),c=Gn(e,i,o,s,fv[0]),p>1&&(d=Gn(e,i,o,s,fv[1]))),2==p?m<fv[0]?f+=c<e?v:-v:m<fv[1]?f+=d<c?v:-v:f+=s<d?v:-v:m<fv[0]?f+=c<e?v:-v:f+=s<c?v:-v)}return f}function pi(t,e,n,i,r,o,a,s){if(s>e&&s>i&&s>o||s<e&&s<i&&s<o)return 0;var l=$n(e,i,o,s,dv);if(0===l)return 0;var u=Kn(e,i,o);if(u>=0&&u<=1){for(var h=0,c=Yn(e,i,o,u),d=0;d<l;d++){f=0===dv[d]||1===dv[d]?.5:1;(p=Yn(t,n,r,dv[d]))<a||(dv[d]<u?h+=c<e?f:-f:h+=o<c?f:-f)}return h}var f=0===dv[0]||1===dv[0]?.5:1,p=Yn(t,n,r,dv[0]);return p<a?0:o<e?f:-f}function gi(t,e,n,i,r,o,a,s){if((s-=e)>n||s<-n)return 0;u=Math.sqrt(n*n-s*s);dv[0]=-u,dv[1]=u;var l=Math.abs(i-r);if(l<1e-4)return 0;if(l%hv<1e-4){i=0,r=hv;p=o?1:-1;return a>=dv[0]+t&&a<=dv[1]+t?p:0}if(o){var u=i;i=li(r),r=li(u)}else i=li(i),r=li(r);i>r&&(r+=hv);for(var h=0,c=0;c<2;c++){var d=dv[c];if(d+t>a){var f=Math.atan2(s,d),p=o?1:-1;f<0&&(f=hv+f),(f>=i&&f<=r||f+hv>=i&&f+hv<=r)&&(f>Math.PI/2&&f<1.5*Math.PI&&(p=-p),h+=p)}}return h}function mi(t,e,n,i,r){for(var o=0,a=0,s=0,l=0,u=0,h=0;h<t.length;){var c=t[h++];switch(c===uv.M&&h>1&&(n||(o+=hi(a,s,l,u,i,r))),1==h&&(l=a=t[h],u=s=t[h+1]),c){case uv.M:a=l=t[h++],s=u=t[h++];break;case uv.L:if(n){if(oi(a,s,t[h],t[h+1],e,i,r))return!0}else o+=hi(a,s,t[h],t[h+1],i,r)||0;a=t[h++],s=t[h++];break;case uv.C:if(n){if(ai(a,s,t[h++],t[h++],t[h++],t[h++],t[h],t[h+1],e,i,r))return!0}else o+=fi(a,s,t[h++],t[h++],t[h++],t[h++],t[h],t[h+1],i,r)||0;a=t[h++],s=t[h++];break;case uv.Q:if(n){if(si(a,s,t[h++],t[h++],t[h],t[h+1],e,i,r))return!0}else o+=pi(a,s,t[h++],t[h++],t[h],t[h+1],i,r)||0;a=t[h++],s=t[h++];break;case uv.A:var d=t[h++],f=t[h++],p=t[h++],g=t[h++],m=t[h++],v=t[h++],y=(t[h++],1-t[h++]),x=Math.cos(m)*p+d,_=Math.sin(m)*g+f;h>1?o+=hi(a,s,x,_,i,r):(l=x,u=_);var w=(i-d)*g/p+d;if(n){if(ui(d,f,g,m,m+v,y,e,w,r))return!0}else o+=gi(d,f,g,m,m+v,y,w,r);a=Math.cos(m+v)*p+d,s=Math.sin(m+v)*g+f;break;case uv.R:l=a=t[h++],u=s=t[h++];var x=l+t[h++],_=u+t[h++];if(n){if(oi(l,u,x,u,e,i,r)||oi(x,u,x,_,e,i,r)||oi(x,_,l,_,e,i,r)||oi(l,_,l,u,e,i,r))return!0}else o+=hi(x,u,x,_,i,r),o+=hi(l,_,l,u,i,r);break;case uv.Z:if(n){if(oi(a,s,l,u,e,i,r))return!0}else o+=hi(a,s,l,u,i,r);a=l,s=u}}return n||ci(s,u)||(o+=hi(a,s,l,u,i,r)||0),0!==o}function vi(t,e,n){return mi(t,0,!1,e,n)}function yi(t,e,n,i){return mi(t,e,!0,n,i)}function xi(t){Xe.call(this,t),this.path=null}function _i(t,e,n,i,r,o,a,s,l,u,h){var c=l*(Cv/180),d=Iv(c)*(t-n)/2+Sv(c)*(e-i)/2,f=-1*Sv(c)*(t-n)/2+Iv(c)*(e-i)/2,p=d*d/(a*a)+f*f/(s*s);p>1&&(a*=Mv(p),s*=Mv(p));var g=(r===o?-1:1)*Mv((a*a*(s*s)-a*a*(f*f)-s*s*(d*d))/(a*a*(f*f)+s*s*(d*d)))||0,m=g*a*f/s,v=g*-s*d/a,y=(t+n)/2+Iv(c)*m-Sv(c)*v,x=(e+i)/2+Sv(c)*m+Iv(c)*v,_=Av([1,0],[(d-m)/a,(f-v)/s]),w=[(d-m)/a,(f-v)/s],b=[(-1*d-m)/a,(-1*f-v)/s],M=Av(w,b);Dv(w,b)<=-1&&(M=Cv),Dv(w,b)>=1&&(M=0),0===o&&M>0&&(M-=2*Cv),1===o&&M<0&&(M+=2*Cv),h.addData(u,y,x,a,s,_,M,c,o)}function wi(t){if(!t)return[];var e,n=t.replace(/-/g," -").replace(/  /g," ").replace(/ /g,",").replace(/,,/g,",");for(e=0;e<bv.length;e++)n=n.replace(new RegExp(bv[e],"g"),"|"+bv[e]);var i,r=n.split("|"),o=0,a=0,s=new av,l=av.CMD;for(e=1;e<r.length;e++){var u,h=r[e],c=h.charAt(0),d=0,f=h.slice(1).replace(/e,-/g,"e-").split(",");f.length>0&&""===f[0]&&f.shift();for(var p=0;p<f.length;p++)f[p]=parseFloat(f[p]);for(;d<f.length&&!isNaN(f[d])&&!isNaN(f[0]);){var g,m,v,y,x,_,w,b=o,M=a;switch(c){case"l":o+=f[d++],a+=f[d++],u=l.L,s.addData(u,o,a);break;case"L":o=f[d++],a=f[d++],u=l.L,s.addData(u,o,a);break;case"m":o+=f[d++],a+=f[d++],u=l.M,s.addData(u,o,a),c="l";break;case"M":o=f[d++],a=f[d++],u=l.M,s.addData(u,o,a),c="L";break;case"h":o+=f[d++],u=l.L,s.addData(u,o,a);break;case"H":o=f[d++],u=l.L,s.addData(u,o,a);break;case"v":a+=f[d++],u=l.L,s.addData(u,o,a);break;case"V":a=f[d++],u=l.L,s.addData(u,o,a);break;case"C":u=l.C,s.addData(u,f[d++],f[d++],f[d++],f[d++],f[d++],f[d++]),o=f[d-2],a=f[d-1];break;case"c":u=l.C,s.addData(u,f[d++]+o,f[d++]+a,f[d++]+o,f[d++]+a,f[d++]+o,f[d++]+a),o+=f[d-2],a+=f[d-1];break;case"S":g=o,m=a;var S=s.len(),I=s.data;i===l.C&&(g+=o-I[S-4],m+=a-I[S-3]),u=l.C,b=f[d++],M=f[d++],o=f[d++],a=f[d++],s.addData(u,g,m,b,M,o,a);break;case"s":g=o,m=a;var S=s.len(),I=s.data;i===l.C&&(g+=o-I[S-4],m+=a-I[S-3]),u=l.C,b=o+f[d++],M=a+f[d++],o+=f[d++],a+=f[d++],s.addData(u,g,m,b,M,o,a);break;case"Q":b=f[d++],M=f[d++],o=f[d++],a=f[d++],u=l.Q,s.addData(u,b,M,o,a);break;case"q":b=f[d++]+o,M=f[d++]+a,o+=f[d++],a+=f[d++],u=l.Q,s.addData(u,b,M,o,a);break;case"T":g=o,m=a;var S=s.len(),I=s.data;i===l.Q&&(g+=o-I[S-4],m+=a-I[S-3]),o=f[d++],a=f[d++],u=l.Q,s.addData(u,g,m,o,a);break;case"t":g=o,m=a;var S=s.len(),I=s.data;i===l.Q&&(g+=o-I[S-4],m+=a-I[S-3]),o+=f[d++],a+=f[d++],u=l.Q,s.addData(u,g,m,o,a);break;case"A":v=f[d++],y=f[d++],x=f[d++],_=f[d++],w=f[d++],_i(b=o,M=a,o=f[d++],a=f[d++],_,w,v,y,x,u=l.A,s);break;case"a":v=f[d++],y=f[d++],x=f[d++],_=f[d++],w=f[d++],_i(b=o,M=a,o+=f[d++],a+=f[d++],_,w,v,y,x,u=l.A,s)}}"z"!==c&&"Z"!==c||(u=l.Z,s.addData(u)),i=u}return s.toStatic(),s}function bi(t,e){var n=wi(t);return e=e||{},e.buildPath=function(t){if(t.setData)t.setData(n.data),(e=t.getContext())&&t.rebuildPath(e);else{var e=t;n.rebuildPath(e)}},e.applyTransform=function(t){wv(n,t),this.dirty(!0)},e}function Mi(t,e){return new xi(bi(t,e))}function Si(t,e){return xi.extend(bi(t,e))}function Ii(t,e,n,i,r,o,a){var s=.5*(n-t),l=.5*(i-e);return(2*(e-n)+s+l)*a+(-3*(e-n)-2*s-l)*o+s*r+e}function Ci(t,e,n){var i=e.points,r=e.smooth;if(i&&i.length>=2){if(r&&"spline"!==r){var o=Rv(i,r,n,e.smoothConstraint);t.moveTo(i[0][0],i[0][1]);for(var a=i.length,s=0;s<(n?a:a-1);s++){var l=o[2*s],u=o[2*s+1],h=i[(s+1)%a];t.bezierCurveTo(l[0],l[1],u[0],u[1],h[0],h[1])}}else{"spline"===r&&(i=Nv(i,n)),t.moveTo(i[0][0],i[0][1]);for(var s=1,c=i.length;s<c;s++)t.lineTo(i[s][0],i[s][1])}n&&t.closePath()}}function Ti(t,e,n){var i=t.cpx2,r=t.cpy2;return null===i||null===r?[(n?Wn:Gn)(t.x1,t.cpx1,t.cpx2,t.x2,e),(n?Wn:Gn)(t.y1,t.cpy1,t.cpy2,t.y2,e)]:[(n?qn:Yn)(t.x1,t.cpx1,t.x2,e),(n?qn:Yn)(t.y1,t.cpy1,t.y2,e)]}function Di(t){Xe.call(this,t),this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.notClear=!0}function Ai(t){return xi.extend(t)}function ki(t,e,n,i){var r=Mi(t,e),o=r.getBoundingRect();return n&&("center"===i&&(n=Li(n,o)),Oi(r,n)),r}function Pi(t,e,n){var i=new je({style:{image:t,x:e.x,y:e.y,width:e.width,height:e.height},onload:function(t){if("center"===n){var r={width:t.width,height:t.height};i.setStyle(Li(e,r))}}});return i}function Li(t,e){var n,i=e.width/e.height,r=t.height*i;return n=r<=t.width?t.height:(r=t.width)/i,{x:t.x+t.width/2-r/2,y:t.y+t.height/2-n/2,width:r,height:n}}function Oi(t,e){if(t.applyTransform){var n=t.getBoundingRect().calculateTransform(e);t.applyTransform(n)}}function zi(t){var e=t.shape,n=t.style.lineWidth;return $v(2*e.x1)===$v(2*e.x2)&&(e.x1=e.x2=Ni(e.x1,n,!0)),$v(2*e.y1)===$v(2*e.y2)&&(e.y1=e.y2=Ni(e.y1,n,!0)),t}function Ei(t){var e=t.shape,n=t.style.lineWidth,i=e.x,r=e.y,o=e.width,a=e.height;return e.x=Ni(e.x,n,!0),e.y=Ni(e.y,n,!0),e.width=Math.max(Ni(i+o,n,!1)-e.x,0===o?0:1),e.height=Math.max(Ni(r+a,n,!1)-e.y,0===a?0:1),t}function Ni(t,e,n){var i=$v(2*t);return(i+$v(e))%2==0?i/2:(i+(n?1:-1))/2}function Ri(t){return null!=t&&"none"!=t}function Bi(t){return"string"==typeof t?Tt(t,-.1):t}function Vi(t){if(t.__hoverStlDirty){var e=t.style.stroke,n=t.style.fill,i=t.__hoverStl;i.fill=i.fill||(Ri(n)?Bi(n):null),i.stroke=i.stroke||(Ri(e)?Bi(e):null);var r={};for(var o in i)null!=i[o]&&(r[o]=t.style[o]);t.__normalStl=r,t.__hoverStlDirty=!1}}function Fi(t){if(!t.__isHover){if(Vi(t),t.useHoverLayer)t.__zr&&t.__zr.addHover(t,t.__hoverStl);else{var e=t.style,n=e.insideRollbackOpt;n&&ir(e),e.extendFrom(t.__hoverStl),n&&(nr(e,e.insideOriginalTextPosition,n),null==e.textFill&&(e.textFill=n.autoColor)),t.dirty(!1),t.z2+=1}t.__isHover=!0}}function Hi(t){if(t.__isHover){var e=t.__normalStl;t.useHoverLayer?t.__zr&&t.__zr.removeHover(t):(e&&t.setStyle(e),t.z2-=1),t.__isHover=!1}}function Gi(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&Fi(t)}):Fi(t)}function Wi(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&Hi(t)}):Hi(t)}function Zi(t,e){t.__hoverStl=t.hoverStyle||e||{},t.__hoverStlDirty=!0,t.__isHover&&Vi(t)}function Ui(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&Gi(this)}function Xi(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&Wi(this)}function ji(){this.__isEmphasis=!0,Gi(this)}function Yi(){this.__isEmphasis=!1,Wi(this)}function qi(t,e,n){t.__hoverSilentOnTouch=n&&n.hoverSilentOnTouch,"group"===t.type?t.traverse(function(t){"group"!==t.type&&Zi(t,e)}):Zi(t,e),t.on("mouseover",Ui).on("mouseout",Xi),t.on("emphasis",ji).on("normal",Yi)}function $i(t,e,n,i,r,o,a){var s,l=(r=r||Jv).labelFetcher,u=r.labelDataIndex,h=r.labelDimIndex,c=n.getShallow("show"),d=i.getShallow("show");(c||d)&&(l&&(s=l.getFormattedLabel(u,"normal",null,h)),null==s&&(s=x(r.defaultText)?r.defaultText(u,r):r.defaultText));var f=c?s:null,p=d?T(l?l.getFormattedLabel(u,"emphasis",null,h):null,s):null;null==f&&null==p||(Ki(t,n,o,r),Ki(e,i,a,r,!0)),t.text=f,e.text=p}function Ki(t,e,n,i,r){return Qi(t,e,i,r),n&&o(t,n),t.host&&t.host.dirty&&t.host.dirty(!1),t}function Qi(t,e,n,i){if((n=n||Jv).isRectText){var r=e.getShallow("position")||(i?null:"inside");"outside"===r&&(r="top"),t.textPosition=r,t.textOffset=e.getShallow("offset");var o=e.getShallow("rotate");null!=o&&(o*=Math.PI/180),t.textRotation=o,t.textDistance=T(e.getShallow("distance"),i?null:5)}var a,s=e.ecModel,l=s&&s.option.textStyle,u=Ji(e);if(u){a={};for(var h in u)if(u.hasOwnProperty(h)){var c=e.getModel(["rich",h]);tr(a[h]={},c,l,n,i)}}return t.rich=a,tr(t,e,l,n,i,!0),n.forceRich&&!n.textStyle&&(n.textStyle={}),t}function Ji(t){for(var e;t&&t!==t.ecModel;){var n=(t.option||Jv).rich;if(n){e=e||{};for(var i in n)n.hasOwnProperty(i)&&(e[i]=1)}t=t.parentModel}return e}function tr(t,e,n,i,r,o){if(n=!r&&n||Jv,t.textFill=er(e.getShallow("color"),i)||n.color,t.textStroke=er(e.getShallow("textBorderColor"),i)||n.textBorderColor,t.textStrokeWidth=T(e.getShallow("textBorderWidth"),n.textBorderWidth),!r){if(o){var a=t.textPosition;t.insideRollback=nr(t,a,i),t.insideOriginalTextPosition=a,t.insideRollbackOpt=i}null==t.textFill&&(t.textFill=i.autoColor)}t.fontStyle=e.getShallow("fontStyle")||n.fontStyle,t.fontWeight=e.getShallow("fontWeight")||n.fontWeight,t.fontSize=e.getShallow("fontSize")||n.fontSize,t.fontFamily=e.getShallow("fontFamily")||n.fontFamily,t.textAlign=e.getShallow("align"),t.textVerticalAlign=e.getShallow("verticalAlign")||e.getShallow("baseline"),t.textLineHeight=e.getShallow("lineHeight"),t.textWidth=e.getShallow("width"),t.textHeight=e.getShallow("height"),t.textTag=e.getShallow("tag"),o&&i.disableBox||(t.textBackgroundColor=er(e.getShallow("backgroundColor"),i),t.textPadding=e.getShallow("padding"),t.textBorderColor=er(e.getShallow("borderColor"),i),t.textBorderWidth=e.getShallow("borderWidth"),t.textBorderRadius=e.getShallow("borderRadius"),t.textBoxShadowColor=e.getShallow("shadowColor"),t.textBoxShadowBlur=e.getShallow("shadowBlur"),t.textBoxShadowOffsetX=e.getShallow("shadowOffsetX"),t.textBoxShadowOffsetY=e.getShallow("shadowOffsetY")),t.textShadowColor=e.getShallow("textShadowColor")||n.textShadowColor,t.textShadowBlur=e.getShallow("textShadowBlur")||n.textShadowBlur,t.textShadowOffsetX=e.getShallow("textShadowOffsetX")||n.textShadowOffsetX,t.textShadowOffsetY=e.getShallow("textShadowOffsetY")||n.textShadowOffsetY}function er(t,e){return"auto"!==t?t:e&&e.autoColor?e.autoColor:null}function nr(t,e,n){var i,r=n.useInsideStyle;return null==t.textFill&&!1!==r&&(!0===r||n.isRectText&&e&&"string"==typeof e&&e.indexOf("inside")>=0)&&(i={textFill:null,textStroke:t.textStroke,textStrokeWidth:t.textStrokeWidth},t.textFill="#fff",null==t.textStroke&&(t.textStroke=n.autoColor,null==t.textStrokeWidth&&(t.textStrokeWidth=2))),i}function ir(t){var e=t.insideRollback;e&&(t.textFill=e.textFill,t.textStroke=e.textStroke,t.textStrokeWidth=e.textStrokeWidth)}function rr(t,e){var n=e||e.getModel("textStyle");return L([t.fontStyle||n&&n.getShallow("fontStyle")||"",t.fontWeight||n&&n.getShallow("fontWeight")||"",(t.fontSize||n&&n.getShallow("fontSize")||12)+"px",t.fontFamily||n&&n.getShallow("fontFamily")||"sans-serif"].join(" "))}function or(t,e,n,i,r,o){if("function"==typeof r&&(o=r,r=null),i&&i.isAnimationEnabled()){var a=t?"Update":"",s=i.getShallow("animationDuration"+a),l=i.getShallow("animationEasing"+a),u=i.getShallow("animationDelay"+a);"function"==typeof u&&(u=u(r,i.getAnimationDelayParams?i.getAnimationDelayParams(e,r):null)),"function"==typeof s&&(s=s(r)),s>0?e.animateTo(n,s,u||0,l,o,!!o):(e.stopAnimation(),e.attr(n),o&&o())}else e.stopAnimation(),e.attr(n),o&&o()}function ar(t,e,n,i,r){or(!0,t,e,n,i,r)}function sr(t,e,n,i,r){or(!1,t,e,n,i,r)}function lr(t,e){for(var n=ot([]);t&&t!==e;)st(n,t.getLocalTransform(),n),t=t.parent;return n}function ur(t,e,n){return e&&!c(e)&&(e=Qp.getLocalTransform(e)),n&&(e=ct([],e)),$([],t,e)}function hr(t,e,n){var i=0===e[4]||0===e[5]||0===e[0]?1:Math.abs(2*e[4]/e[0]),r=0===e[4]||0===e[5]||0===e[2]?1:Math.abs(2*e[4]/e[2]),o=["left"===t?-i:"right"===t?i:0,"top"===t?-r:"bottom"===t?r:0];return o=ur(o,e,n),Math.abs(o[0])>Math.abs(o[1])?o[0]>0?"right":"left":o[1]>0?"bottom":"top"}function cr(t,e,n,i){function r(t){var e={position:F(t.position),rotation:t.rotation};return t.shape&&(e.shape=o({},t.shape)),e}if(t&&e){var a=function(t){var e={};return t.traverse(function(t){!t.isGroup&&t.anid&&(e[t.anid]=t)}),e}(t);e.traverse(function(t){if(!t.isGroup&&t.anid){var e=a[t.anid];if(e){var i=r(t);t.attr(r(e)),ar(t,i,n,t.dataIndex)}}})}}function dr(t,e){return f(t,function(t){var n=t[0];n=Kv(n,e.x),n=Qv(n,e.x+e.width);var i=t[1];return i=Kv(i,e.y),i=Qv(i,e.y+e.height),[n,i]})}function fr(t,e,n){var i=(e=o({rectHover:!0},e)).style={strokeNoScale:!0};if(n=n||{x:-1,y:-1,width:2,height:2},t)return 0===t.indexOf("image://")?(i.image=t.slice(8),a(i,n),new je(e)):ki(t.replace("path://",""),e,n,"center")}function pr(t,e,n){this.parentModel=e,this.ecModel=n,this.option=t}function gr(t,e,n){for(var i=0;i<e.length&&(!e[i]||null!=(t=t&&"object"==typeof t?t[e[i]]:null));i++);return null==t&&n&&(t=n.get(e)),t}function mr(t,e){var n=ay(t).getParent;return n?n.call(t,e):t.parentModel}function vr(t){return[t||"",sy++,Math.random().toFixed(5)].join("_")}function yr(t){return t.replace(/^\s+/,"").replace(/\s+$/,"")}function xr(t,e,n,i){var r=e[1]-e[0],o=n[1]-n[0];if(0===r)return 0===o?n[0]:(n[0]+n[1])/2;if(i)if(r>0){if(t<=e[0])return n[0];if(t>=e[1])return n[1]}else{if(t>=e[0])return n[0];if(t<=e[1])return n[1]}else{if(t===e[0])return n[0];if(t===e[1])return n[1]}return(t-e[0])/r*o+n[0]}function _r(t,e){switch(t){case"center":case"middle":t="50%";break;case"left":case"top":t="0%";break;case"right":case"bottom":t="100%"}return"string"==typeof t?yr(t).match(/%$/)?parseFloat(t)/100*e:parseFloat(t):null==t?NaN:+t}function wr(t,e,n){return null==e&&(e=10),e=Math.min(Math.max(0,e),20),t=(+t).toFixed(e),n?t:+t}function br(t){return t.sort(function(t,e){return t-e}),t}function Mr(t){if(t=+t,isNaN(t))return 0;for(var e=1,n=0;Math.round(t*e)/e!==t;)e*=10,n++;return n}function Sr(t){var e=t.toString(),n=e.indexOf("e");if(n>0){var i=+e.slice(n+1);return i<0?-i:0}var r=e.indexOf(".");return r<0?0:e.length-1-r}function Ir(t,e){var n=Math.log,i=Math.LN10,r=Math.floor(n(t[1]-t[0])/i),o=Math.round(n(Math.abs(e[1]-e[0]))/i),a=Math.min(Math.max(-r+o,0),20);return isFinite(a)?a:20}function Cr(t,e,n){if(!t[e])return 0;var i=p(t,function(t,e){return t+(isNaN(e)?0:e)},0);if(0===i)return 0;for(var r=Math.pow(10,n),o=f(t,function(t){return(isNaN(t)?0:t)/i*r*100}),a=100*r,s=f(o,function(t){return Math.floor(t)}),l=p(s,function(t,e){return t+e},0),u=f(o,function(t,e){return t-s[e]});l<a;){for(var h=Number.NEGATIVE_INFINITY,c=null,d=0,g=u.length;d<g;++d)u[d]>h&&(h=u[d],c=d);++s[c],u[c]=0,++l}return s[e]/r}function Tr(t){var e=2*Math.PI;return(t%e+e)%e}function Dr(t){return t>-ly&&t<ly}function Ar(t){if(t instanceof Date)return t;if("string"==typeof t){var e=uy.exec(t);if(!e)return new Date(NaN);if(e[8]){var n=+e[4]||0;return"Z"!==e[8].toUpperCase()&&(n-=e[8].slice(0,3)),new Date(Date.UTC(+e[1],+(e[2]||1)-1,+e[3]||1,n,+(e[5]||0),+e[6]||0,+e[7]||0))}return new Date(+e[1],+(e[2]||1)-1,+e[3]||1,+e[4]||0,+(e[5]||0),+e[6]||0,+e[7]||0)}return null==t?new Date(NaN):new Date(Math.round(t))}function kr(t){return Math.pow(10,Pr(t))}function Pr(t){return Math.floor(Math.log(t)/Math.LN10)}function Lr(t,e){var n,i=Pr(t),r=Math.pow(10,i),o=t/r;return n=e?o<1.5?1:o<2.5?2:o<4?3:o<7?5:10:o<1?1:o<2?2:o<3?3:o<5?5:10,t=n*r,i>=-20?+t.toFixed(i<0?-i:0):t}function Or(t){return isNaN(t)?"-":(t=(t+"").split("."))[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(t.length>1?"."+t[1]:"")}function zr(t,e){return t=(t||"").toLowerCase().replace(/-(.)/g,function(t,e){return e.toUpperCase()}),e&&t&&(t=t.charAt(0).toUpperCase()+t.slice(1)),t}function Er(t){return null==t?"":(t+"").replace(dy,function(t,e){return fy[e]})}function Nr(t,e,n){y(e)||(e=[e]);var i=e.length;if(!i)return"";for(var r=e[0].$vars||[],o=0;o<r.length;o++){var a=py[o];t=t.replace(gy(a),gy(a,0))}for(var s=0;s<i;s++)for(var l=0;l<r.length;l++){var u=e[s][r[l]];t=t.replace(gy(py[l],s),n?Er(u):u)}return t}function Rr(t,e){var n=(t=_(t)?{color:t,extraCssText:e}:t||{}).color,i=t.type,e=t.extraCssText;return n?"subItem"===i?'<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:'+Er(n)+";"+(e||"")+'"></span>':'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+Er(n)+";"+(e||"")+'"></span>':""}function Br(t,e){return t+="","0000".substr(0,e-t.length)+t}function Vr(t,e,n){"week"!==t&&"month"!==t&&"quarter"!==t&&"half-year"!==t&&"year"!==t||(t="MM-dd\nyyyy");var i=Ar(e),r=n?"UTC":"",o=i["get"+r+"FullYear"](),a=i["get"+r+"Month"]()+1,s=i["get"+r+"Date"](),l=i["get"+r+"Hours"](),u=i["get"+r+"Minutes"](),h=i["get"+r+"Seconds"](),c=i["get"+r+"Milliseconds"]();return t=t.replace("MM",Br(a,2)).replace("M",a).replace("yyyy",o).replace("yy",o%100).replace("dd",Br(s,2)).replace("d",s).replace("hh",Br(l,2)).replace("h",l).replace("mm",Br(u,2)).replace("m",u).replace("ss",Br(h,2)).replace("s",h).replace("SSS",Br(c,3))}function Fr(t){return t?t.charAt(0).toUpperCase()+t.substr(1):t}function Hr(t,e,n,i,r){var o=0,a=0;null==i&&(i=1/0),null==r&&(r=1/0);var s=0;e.eachChild(function(l,u){var h,c,d=l.position,f=l.getBoundingRect(),p=e.childAt(u+1),g=p&&p.getBoundingRect();if("horizontal"===t){var m=f.width+(g?-g.x+f.x:0);(h=o+m)>i||l.newline?(o=0,h=m,a+=s+n,s=f.height):s=Math.max(s,f.height)}else{var v=f.height+(g?-g.y+f.y:0);(c=a+v)>r||l.newline?(o+=s+n,a=0,c=v,s=f.width):s=Math.max(s,f.width)}l.newline||(d[0]=o,d[1]=a,"horizontal"===t?o=h+n:a=c+n)})}function Gr(t,e,n){n=cy(n||0);var i=e.width,r=e.height,o=_r(t.left,i),a=_r(t.top,r),s=_r(t.right,i),l=_r(t.bottom,r),u=_r(t.width,i),h=_r(t.height,r),c=n[2]+n[0],d=n[1]+n[3],f=t.aspect;switch(isNaN(u)&&(u=i-s-d-o),isNaN(h)&&(h=r-l-c-a),null!=f&&(isNaN(u)&&isNaN(h)&&(f>i/r?u=.8*i:h=.8*r),isNaN(u)&&(u=f*h),isNaN(h)&&(h=u/f)),isNaN(o)&&(o=i-s-u-d),isNaN(a)&&(a=r-l-h-c),t.left||t.right){case"center":o=i/2-u/2-n[3];break;case"right":o=i-u-d}switch(t.top||t.bottom){case"middle":case"center":a=r/2-h/2-n[0];break;case"bottom":a=r-h-c}o=o||0,a=a||0,isNaN(u)&&(u=i-d-o-(s||0)),isNaN(h)&&(h=r-c-a-(l||0));var p=new Xt(o+n[3],a+n[0],u,h);return p.margin=n,p}function Wr(t,e,n,i,r){var o=!r||!r.hv||r.hv[0],s=!r||!r.hv||r.hv[1],l=r&&r.boundingMode||"all";if(o||s){var u;if("raw"===l)u="group"===t.type?new Xt(0,0,+e.width||0,+e.height||0):t.getBoundingRect();else if(u=t.getBoundingRect(),t.needLocalTransform()){var h=t.getLocalTransform();(u=u.clone()).applyTransform(h)}e=Gr(a({width:u.width,height:u.height},e),n,i);var c=t.position,d=o?e.x-u.x:0,f=s?e.y-u.y:0;t.attr("position","raw"===l?[d,f]:[c[0]+d,c[1]+f])}}function Zr(t,e,n){function i(n,i){var a={},l=0,u={},h=0;if(xy(n,function(e){u[e]=t[e]}),xy(n,function(t){r(e,t)&&(a[t]=u[t]=e[t]),o(a,t)&&l++,o(u,t)&&h++}),s[i])return o(e,n[1])?u[n[2]]=null:o(e,n[2])&&(u[n[1]]=null),u;if(2!==h&&l){if(l>=2)return a;for(var c=0;c<n.length;c++){var d=n[c];if(!r(a,d)&&r(t,d)){a[d]=t[d];break}}return a}return u}function r(t,e){return t.hasOwnProperty(e)}function o(t,e){return null!=t[e]&&"auto"!==t[e]}function a(t,e,n){xy(t,function(t){e[t]=n[t]})}!w(n)&&(n={});var s=n.ignoreSize;!y(s)&&(s=[s,s]);var l=i(wy[0],0),u=i(wy[1],1);a(wy[0],t,l),a(wy[1],t,u)}function Ur(t){return Xr({},t)}function Xr(t,e){return e&&t&&xy(_y,function(n){e.hasOwnProperty(n)&&(t[n]=e[n])}),t}function jr(t,e){for(var n=t.length,i=0;i<n;i++)if(t[i].length>e)return t[i];return t[n-1]}function Yr(t){var e=t.get("coordinateSystem"),n={coordSysName:e,coordSysDims:[],axisMap:N(),categoryAxisMap:N()},i=ky[e];if(i)return i(t,n,n.axisMap,n.categoryAxisMap),n}function qr(t){return"category"===t.get("type")}function $r(t){this.fromDataset=t.fromDataset,this.data=t.data||(t.sourceFormat===zy?{}:[]),this.sourceFormat=t.sourceFormat||Ey,this.seriesLayoutBy=t.seriesLayoutBy||Ry,this.dimensionsDefine=t.dimensionsDefine,this.encodeDefine=t.encodeDefine&&N(t.encodeDefine),this.startIndex=t.startIndex||0,this.dimensionsDetectCount=t.dimensionsDetectCount}function Kr(t){var e=t.option.source,n=Ey;if(M(e))n=Ny;else if(y(e))for(var i=0,r=e.length;i<r;i++){var o=e[i];if(null!=o){if(y(o)){n=Ly;break}if(w(o)){n=Oy;break}}}else if(w(e)){for(var a in e)if(e.hasOwnProperty(a)&&c(e[a])){n=zy;break}}else if(null!=e)throw new Error("Invalid data");Vy(t).sourceFormat=n}function Qr(t){return Vy(t).source}function Jr(t){Vy(t).datasetMap=N()}function to(t){var e=t.option,n=e.data,i=M(n)?Ny:Py,r=!1,o=e.seriesLayoutBy,a=e.sourceHeader,s=e.dimensions,l=ao(t);if(l){var u=l.option;n=u.source,i=Vy(l).sourceFormat,r=!0,o=o||u.seriesLayoutBy,null==a&&(a=u.sourceHeader),s=s||u.dimensions}var h=eo(n,i,o,a,s),c=e.encode;!c&&l&&(c=oo(t,l,n,i,o,h)),Vy(t).source=new $r({data:n,fromDataset:r,seriesLayoutBy:o,sourceFormat:i,dimensionsDefine:h.dimensionsDefine,startIndex:h.startIndex,dimensionsDetectCount:h.dimensionsDetectCount,encodeDefine:c})}function eo(t,e,n,i,r){if(!t)return{dimensionsDefine:no(r)};var o,a,s;if(e===Ly)"auto"===i||null==i?io(function(t){null!=t&&"-"!==t&&(_(t)?null==a&&(a=1):a=0)},n,t,10):a=i?1:0,r||1!==a||(r=[],io(function(t,e){r[e]=null!=t?t:""},n,t)),o=r?r.length:n===By?t.length:t[0]?t[0].length:null;else if(e===Oy)r||(r=ro(t),s=!0);else if(e===zy)r||(r=[],s=!0,d(t,function(t,e){r.push(e)}));else if(e===Py){var l=wn(t[0]);o=y(l)&&l.length||1}var u;return s&&d(r,function(t,e){"name"===(w(t)?t.name:t)&&(u=e)}),{startIndex:a,dimensionsDefine:no(r),dimensionsDetectCount:o,potentialNameDimIndex:u}}function no(t){if(t){var e=N();return f(t,function(t,n){if(null==(t=o({},w(t)?t:{name:t})).name)return t;t.name+="",null==t.displayName&&(t.displayName=t.name);var i=e.get(t.name);return i?t.name+="-"+i.count++:e.set(t.name,{count:1}),t})}}function io(t,e,n,i){if(null==i&&(i=1/0),e===By)for(o=0;o<n.length&&o<i;o++)t(n[o]?n[o][0]:null,o);else for(var r=n[0]||[],o=0;o<r.length&&o<i;o++)t(r[o],o)}function ro(t){for(var e,n=0;n<t.length&&!(e=t[n++]););if(e){var i=[];return d(e,function(t,e){i.push(e)}),i}}function oo(t,e,n,i,r,o){var a=Yr(t),s={},l=[],u=[],h=t.subType,c=N(["pie","map","funnel"]),f=N(["line","bar","pictorialBar","scatter","effectScatter","candlestick","boxplot"]);if(a&&null!=f.get(h)){var p=t.ecModel,g=Vy(p).datasetMap,m=e.uid+"_"+r,v=g.get(m)||g.set(m,{categoryWayDim:1,valueWayDim:0});d(a.coordSysDims,function(t){if(null==a.firstCategoryDimIndex){e=v.valueWayDim++;s[t]=e,u.push(e)}else if(a.categoryAxisMap.get(t))s[t]=0,l.push(0);else{var e=v.categoryWayDim++;s[t]=e,u.push(e)}})}else if(null!=c.get(h)){for(var y,x=0;x<5&&null==y;x++)lo(n,i,r,o.dimensionsDefine,o.startIndex,x)||(y=x);if(null!=y){s.value=y;var _=o.potentialNameDimIndex||Math.max(y-1,0);u.push(_),l.push(_)}}return l.length&&(s.itemName=l),u.length&&(s.seriesName=u),s}function ao(t){var e=t.option;if(!e.data)return t.ecModel.getComponent("dataset",e.datasetIndex||0)}function so(t,e){return lo(t.data,t.sourceFormat,t.seriesLayoutBy,t.dimensionsDefine,t.startIndex,e)}function lo(t,e,n,i,r,o){function a(t){return(null==t||!isFinite(t)||""===t)&&(!(!_(t)||"-"===t)||void 0)}var s;if(M(t))return!1;var l;if(i&&(l=w(l=i[o])?l.name:l),e===Ly)if(n===By){for(var u=t[o],h=0;h<(u||[]).length&&h<5;h++)if(null!=(s=a(u[r+h])))return s}else for(h=0;h<t.length&&h<5;h++){var c=t[r+h];if(c&&null!=(s=a(c[o])))return s}else if(e===Oy){if(!l)return;for(h=0;h<t.length&&h<5;h++)if((d=t[h])&&null!=(s=a(d[l])))return s}else if(e===zy){if(!l)return;if(!(u=t[l])||M(u))return!1;for(h=0;h<u.length&&h<5;h++)if(null!=(s=a(u[h])))return s}else if(e===Py)for(h=0;h<t.length&&h<5;h++){var d=t[h],f=wn(d);if(!y(f))return!1;if(null!=(s=a(f[o])))return s}return!1}function uo(t,e){if(e){var n=e.seiresIndex,i=e.seriesId,r=e.seriesName;return null!=n&&t.componentIndex!==n||null!=i&&t.id!==i||null!=r&&t.name!==r}}function ho(t,e){var r=t.color&&!t.colorLayer;d(e,function(e,o){"colorLayer"===o&&r||Iy.hasClass(o)||("object"==typeof e?t[o]=t[o]?i(t[o],e,!1):n(e):null==t[o]&&(t[o]=e))})}function co(t){t=t,this.option={},this.option[Fy]=1,this._componentsMap=N({series:[]}),this._seriesIndices,this._seriesIndicesMap,ho(t,this._theme.option),i(t,Ty,!1),this.mergeOption(t)}function fo(t,e){y(e)||(e=e?[e]:[]);var n={};return d(e,function(e){n[e]=(t.get(e)||[]).slice()}),n}function po(t,e,n){return e.type?e.type:n?n.subType:Iy.determineSubType(t,e)}function go(t,e){t._seriesIndicesMap=N(t._seriesIndices=f(e,function(t){return t.componentIndex})||[])}function mo(t,e){return e.hasOwnProperty("subType")?g(t,function(t){return t.subType===e.subType}):t}function vo(t){d(Gy,function(e){this[e]=m(t[e],t)},this)}function yo(){this._coordinateSystems=[]}function xo(t){this._api=t,this._timelineOptions=[],this._mediaList=[],this._mediaDefault,this._currentMediaIndices=[],this._optionBackup,this._newBaseOption}function _o(t,e,n){var i,r,o=[],a=[],s=t.timeline;if(t.baseOption&&(r=t.baseOption),(s||t.options)&&(r=r||{},o=(t.options||[]).slice()),t.media){r=r||{};var l=t.media;Zy(l,function(t){t&&t.option&&(t.query?a.push(t):i||(i=t))})}return r||(r=t),r.timeline||(r.timeline=s),Zy([r].concat(o).concat(f(a,function(t){return t.option})),function(t){Zy(e,function(e){e(t,n)})}),{baseOption:r,timelineOptions:o,mediaDefault:i,mediaList:a}}function wo(t,e,n){var i={width:e,height:n,aspectratio:e/n},r=!0;return d(t,function(t,e){var n=e.match(Yy);if(n&&n[1]&&n[2]){var o=n[1],a=n[2].toLowerCase();bo(i[a],t,o)||(r=!1)}}),r}function bo(t,e,n){return"min"===n?t>=e:"max"===n?t<=e:t===e}function Mo(t,e){return t.join(",")===e.join(",")}function So(t,e){Zy(e=e||{},function(e,n){if(null!=e){var i=t[n];if(Iy.hasClass(n)){e=xn(e);var r=Mn(i=xn(i),e);t[n]=Xy(r,function(t){return t.option&&t.exist?jy(t.exist,t.option,!0):t.exist||t.option})}else t[n]=jy(i,e,!0)}})}function Io(t){var e=t&&t.itemStyle;if(e)for(var n=0,r=Ky.length;n<r;n++){var o=Ky[n],a=e.normal,s=e.emphasis;a&&a[o]&&(t[o]=t[o]||{},t[o].normal?i(t[o].normal,a[o]):t[o].normal=a[o],a[o]=null),s&&s[o]&&(t[o]=t[o]||{},t[o].emphasis?i(t[o].emphasis,s[o]):t[o].emphasis=s[o],s[o]=null)}}function Co(t,e,n){if(t&&t[e]&&(t[e].normal||t[e].emphasis)){var i=t[e].normal,r=t[e].emphasis;i&&(n?(t[e].normal=t[e].emphasis=null,a(t[e],i)):t[e]=i),r&&(t.emphasis=t.emphasis||{},t.emphasis[e]=r)}}function To(t){Co(t,"itemStyle"),Co(t,"lineStyle"),Co(t,"areaStyle"),Co(t,"label"),Co(t,"labelLine"),Co(t,"upperLabel"),Co(t,"edgeLabel")}function Do(t,e){var n=$y(t)&&t[e],i=$y(n)&&n.textStyle;if(i)for(var r=0,o=xm.length;r<o;r++){var e=xm[r];i.hasOwnProperty(e)&&(n[e]=i[e])}}function Ao(t){t&&(To(t),Do(t,"label"),t.emphasis&&Do(t.emphasis,"label"))}function ko(t){if($y(t)){Io(t),To(t),Do(t,"label"),Do(t,"upperLabel"),Do(t,"edgeLabel"),t.emphasis&&(Do(t.emphasis,"label"),Do(t.emphasis,"upperLabel"),Do(t.emphasis,"edgeLabel"));var e=t.markPoint;e&&(Io(e),Ao(e));var n=t.markLine;n&&(Io(n),Ao(n));var i=t.markArea;i&&Ao(i);var r=t.data;if("graph"===t.type){r=r||t.nodes;var o=t.links||t.edges;if(o&&!M(o))for(s=0;s<o.length;s++)Ao(o[s]);d(t.categories,function(t){To(t)})}if(r&&!M(r))for(s=0;s<r.length;s++)Ao(r[s]);if((e=t.markPoint)&&e.data)for(var a=e.data,s=0;s<a.length;s++)Ao(a[s]);if((n=t.markLine)&&n.data)for(var l=n.data,s=0;s<l.length;s++)y(l[s])?(Ao(l[s][0]),Ao(l[s][1])):Ao(l[s]);"gauge"===t.type?(Do(t,"axisLabel"),Do(t,"title"),Do(t,"detail")):"treemap"===t.type?(Co(t.breadcrumb,"itemStyle"),d(t.levels,function(t){To(t)})):"tree"===t.type&&To(t.leaves)}}function Po(t){return y(t)?t:t?[t]:[]}function Lo(t){return(y(t)?t[0]:t)||{}}function Oo(t,e){e=e.split(",");for(var n=t,i=0;i<e.length&&null!=(n=n&&n[e[i]]);i++);return n}function zo(t,e,n,i){e=e.split(",");for(var r,o=t,a=0;a<e.length-1;a++)null==o[r=e[a]]&&(o[r]={}),o=o[r];(i||null==o[e[a]])&&(o[e[a]]=n)}function Eo(t){d(Jy,function(e){e[0]in t&&!(e[1]in t)&&(t[e[1]]=t[e[0]])})}function No(t){d(t,function(e,n){var i=[],r=[NaN,NaN],o=[e.stackResultDimension,e.stackedOverDimension],a=e.data,s=e.isStackedByIndex,l=a.map(o,function(o,l,u){var h=a.get(e.stackedDimension,u);if(isNaN(h))return r;var c,d;s?d=a.getRawIndex(u):c=a.get(e.stackedByDimension,u);for(var f=NaN,p=n-1;p>=0;p--){var g=t[p];if(s||(d=g.data.rawIndexOf(g.stackedByDimension,c)),d>=0){var m=g.data.getByRawIndex(g.stackResultDimension,d);if(h>=0&&m>0||h<=0&&m<0){h+=m,f=m;break}}}return i[0]=h,i[1]=f,i});a.hostModel.setData(l),e.data=l})}function Ro(t,e){$r.isInstance(t)||(t=$r.seriesDataToSource(t)),this._source=t;var n=this._data=t.data,i=t.sourceFormat;i===Ny&&(this._offset=0,this._dimSize=e,this._data=n),o(this,ix[i===Ly?i+"_"+t.seriesLayoutBy:i])}function Bo(){return this._data.length}function Vo(t){return this._data[t]}function Fo(t){for(var e=0;e<t.length;e++)this._data.push(t[e])}function Ho(t,e,n,i){return null!=n?t[n]:t}function Go(t,e,n,i){return Wo(t[i],this._dimensionInfos[e])}function Wo(t,e){var n=e&&e.type;if("ordinal"===n){var i=e&&e.ordinalMeta;return i?i.parseAndCollect(t):t}return"time"===n&&"number"!=typeof t&&null!=t&&"-"!==t&&(t=+Ar(t)),null==t||""===t?NaN:+t}function Zo(t,e,n){if(t){var i=t.getRawDataItem(e);if(null!=i){var r,o,a=t.getProvider().getSource().sourceFormat,s=t.getDimensionInfo(n);return s&&(r=s.name,o=s.index),rx[a](i,e,o,r)}}}function Uo(t,e,n){if(t){var i=t.getProvider().getSource().sourceFormat;if(i===Py||i===Oy){var r=t.getRawDataItem(e);return i!==Py||w(r)||(r=null),r?r[n]:void 0}}}function Xo(t){return new jo(t)}function jo(t){t=t||{},this._reset=t.reset,this._plan=t.plan,this._count=t.count,this._onDirty=t.onDirty,this._dirty=!0,this.context}function Yo(t,e,n,i,r,o){ux.reset(n,i,r,o),t._callingProgress=e,t._callingProgress({start:n,end:i,count:i-n,next:ux.next},t.context)}function qo(t,e){t._dueIndex=t._outputDueEnd=t._dueEnd=0,t._settedOutputEnd=null;var n,i;!e&&t._reset&&((n=t._reset(t.context))&&n.progress&&(i=n.forceFirstProgress,n=n.progress),y(n)&&!n.length&&(n=null)),t._progress=n,t._modBy=t._modDataCount=null;var r=t._downstream;return r&&r.dirty(),i}function $o(t){var e=t.name;In(t)||(t.name=Ko(t)||e)}function Ko(t){var e=t.getRawData(),n=[];return d(e.mapDimension("seriesName",!0),function(t){var i=e.getDimensionInfo(t);i.displayName&&n.push(i.displayName)}),n.join(" ")}function Qo(t){return t.model.getRawData().count()}function Jo(t){var e=t.model;return e.setData(e.getRawData().cloneShallow()),ta}function ta(t,e){t.end>e.outputData.count()&&e.model.getRawData().cloneShallow(e.outputData)}function ea(t,e){d(t.CHANGABLE_METHODS,function(n){t.wrapMethod(n,v(na,e))})}function na(t){var e=ia(t);e&&e.setOutputEnd(this.count())}function ia(t){var e=(t.ecModel||{}).scheduler,n=e&&e.getPipeline(t.uid);if(n){var i=n.currentTask;if(i){var r=i.agentStubMap;r&&(i=r.get(t.uid))}return i}}function ra(){this.group=new Sg,this.uid=vr("viewChart"),this.renderTask=Xo({plan:sa,reset:la}),this.renderTask.context={view:this}}function oa(t,e){if(t&&(t.trigger(e),"group"===t.type))for(var n=0;n<t.childCount();n++)oa(t.childAt(n),e)}function aa(t,e,n){var i=Tn(t,e);null!=i?d(xn(i),function(e){oa(t.getItemGraphicEl(e),n)}):t.eachItemGraphicEl(function(t){oa(t,n)})}function sa(t){return mx(t.model)}function la(t){var e=t.model,n=t.ecModel,i=t.api,r=t.payload,o=e.pipelineContext.progressiveRender,a=t.view,s=r&&gx(r).updateMethod,l=o?"incrementalPrepareRender":s&&a[s]?s:"render";return"render"!==l&&a[l](e,n,i,r),yx[l]}function ua(t,e,n){function i(){h=(new Date).getTime(),c=null,t.apply(a,s||[])}var r,o,a,s,l,u=0,h=0,c=null;e=e||0;var d=function(){r=(new Date).getTime(),a=this,s=arguments;var t=l||e,d=l||n;l=null,o=r-(d?u:h)-t,clearTimeout(c),d?c=setTimeout(i,t):o>=0?i():c=setTimeout(i,-o),u=r};return d.clear=function(){c&&(clearTimeout(c),c=null)},d.debounceNextCall=function(t){l=t},d}function ha(t,e,n,i){var r=t[e];if(r){var o=r[xx]||r,a=r[bx];if(r[_x]!==n||a!==i){if(null==n||!i)return t[e]=o;(r=t[e]=ua(o,n,"debounce"===i))[xx]=o,r[bx]=i,r[_x]=n}return r}}function ca(t,e){var n=t[e];n&&n[xx]&&(t[e]=n[xx])}function da(t,e,n,i){this.ecInstance=t,this.api=e,this.unfinished;var n=this._dataProcessorHandlers=n.slice(),i=this._visualHandlers=i.slice();this._allHandlers=n.concat(i),this._stageTaskMap=N()}function fa(t,e,n,i,r){function o(t,e){return t.setDirty&&(!t.dirtyMap||t.dirtyMap.get(e.__pipeline.id))}r=r||{};var a;d(e,function(e,s){if(!r.visualType||r.visualType===e.visualType){var l=t._stageTaskMap.get(e.uid),u=l.seriesTaskMap,h=l.overallTask;if(h){var c,d=h.agentStubMap;d.each(function(t){o(r,t)&&(t.dirty(),c=!0)}),c&&h.dirty(),Dx(h,i);var f=t.getPerformArgs(h,r.block);d.each(function(t){t.perform(f)}),a|=h.perform(f)}else u&&u.each(function(s,l){o(r,s)&&s.dirty();var u=t.getPerformArgs(s,r.block);u.skip=!e.performRawSeries&&n.isSeriesFiltered(s.context.model),Dx(s,i),a|=s.perform(u)})}}),t.unfinished|=a}function pa(t,e,n,i,r){function o(n){var o=n.uid,s=a.get(o)||a.set(o,Xo({plan:_a,reset:wa,count:Ma}));s.context={model:n,ecModel:i,api:r,useClearVisual:e.isVisual&&!e.isLayout,plan:e.plan,reset:e.reset,scheduler:t},Sa(t,n,s)}var a=n.seriesTaskMap||(n.seriesTaskMap=N()),s=e.seriesType,l=e.getTargetSeries;e.createOnAllSeries?i.eachRawSeries(o):s?i.eachRawSeriesByType(s,o):l&&l(i,r).each(o);var u=t._pipelineMap;a.each(function(t,e){u.get(e)||(t.dispose(),a.removeKey(e))})}function ga(t,e,n,i,r){function o(e){var n=e.uid,i=s.get(n);i||(i=s.set(n,Xo({reset:va,onDirty:xa})),a.dirty()),i.context={model:e,overallProgress:h,modifyOutputEnd:c},i.agent=a,i.__block=h,Sa(t,e,i)}var a=n.overallTask=n.overallTask||Xo({reset:ma});a.context={ecModel:i,api:r,overallReset:e.overallReset,scheduler:t};var s=a.agentStubMap=a.agentStubMap||N(),l=e.seriesType,u=e.getTargetSeries,h=!0,c=e.modifyOutputEnd;l?i.eachRawSeriesByType(l,o):u?u(i,r).each(o):(h=!1,d(i.getSeries(),o));var f=t._pipelineMap;s.each(function(t,e){f.get(e)||(t.dispose(),a.dirty(),s.removeKey(e))})}function ma(t){t.overallReset(t.ecModel,t.api,t.payload)}function va(t,e){return t.overallProgress&&ya}function ya(){this.agent.dirty(),this.getDownstream().dirty()}function xa(){this.agent&&this.agent.dirty()}function _a(t){return t.plan&&t.plan(t.model,t.ecModel,t.api,t.payload)}function wa(t){t.useClearVisual&&t.data.clearAllVisual();var e=t.resetDefines=xn(t.reset(t.model,t.ecModel,t.api,t.payload));return e.length>1?f(e,function(t,e){return ba(e)}):Ax}function ba(t){return function(e,n){var i=n.data,r=n.resetDefines[t];if(r&&r.dataEach)for(var o=e.start;o<e.end;o++)r.dataEach(i,o);else r&&r.progress&&r.progress(e,i)}}function Ma(t){return t.data.count()}function Sa(t,e,n){var i=e.uid,r=t._pipelineMap.get(i);!r.head&&(r.head=n),r.tail&&r.tail.pipe(n),r.tail=n,n.__idxInPipeline=r.count++,n.__pipeline=r}function Ia(t){kx=null;try{t(Px,Lx)}catch(t){}return kx}function Ca(t,e){for(var n in e.prototype)t[n]=R}function Ta(t){return function(e,n,i){e=e&&e.toLowerCase(),Zp.prototype[t].call(this,e,n,i)}}function Da(){Zp.call(this)}function Aa(t,e,i){function r(t,e){return t.__prio-e.__prio}i=i||{},"string"==typeof e&&(e=o_[e]),this.id,this.group,this._dom=t;var o=this._zr=mn(t,{renderer:i.renderer||"canvas",devicePixelRatio:i.devicePixelRatio,width:i.width,height:i.height});this._throttledZrFlush=ua(m(o.flush,o),17),(e=n(e))&&ex(e,!0),this._theme=e,this._chartsViews=[],this._chartsMap={},this._componentsViews=[],this._componentsMap={},this._coordSysMgr=new yo;var a=this._api=ja(this);te(r_,r),te(e_,r),this._scheduler=new da(this,a,e_,r_),Zp.call(this),this._messageCenter=new Da,this._initEvents(),this.resize=m(this.resize,this),this._pendingActions=[],o.animation.on("frame",this._onframe,this),Ra(o,this),O(this)}function ka(t,e,n){var i,r=this._model,o=this._coordSysMgr.getCoordinateSystems();e=An(r,e);for(var a=0;a<o.length;a++){var s=o[a];if(s[t]&&null!=(i=s[t](r,e,n)))return i}}function Pa(t){var e=t._model,n=t._scheduler;n.restorePipelines(e),n.prepareStageTasks(),Ba(t,"component",e,n),Ba(t,"chart",e,n),n.plan()}function La(t,e,n,i,r){function o(i){i&&i.__alive&&i[e]&&i[e](i.__model,a,t._api,n)}var a=t._model;if(i){var s={};s[i+"Id"]=n[i+"Id"],s[i+"Index"]=n[i+"Index"],s[i+"Name"]=n[i+"Name"];var l={mainType:i,query:s};r&&(l.subType=r);var u=n.excludeSeriesId;null!=u&&(u=N(xn(u))),a&&a.eachComponent(l,function(e){u&&null!=u.get(e.id)||o(t["series"===i?"_chartsMap":"_componentsMap"][e.__viewId])},t)}else Bx(t._componentsViews.concat(t._chartsViews),o)}function Oa(t,e){var n=t._chartsMap,i=t._scheduler;e.eachSeries(function(t){i.updateStreamModes(t,n[t.__viewId])})}function za(t,e){var n=t.type,i=t.escapeConnect,r=Jx[n],s=r.actionInfo,l=(s.update||"update").split(":"),u=l.pop();l=null!=l[0]&&Hx(l[0]),this[jx]=!0;var h=[t],c=!1;t.batch&&(c=!0,h=f(t.batch,function(e){return e=a(o({},e),t),e.batch=null,e}));var d,p=[],g="highlight"===n||"downplay"===n;Bx(h,function(t){d=r.action(t,this._model,this._api),(d=d||o({},t)).type=s.event||d.type,p.push(d),g?La(this,u,t,"series"):l&&La(this,u,t,l.main,l.sub)},this),"none"===u||g||l||(this[Yx]?(Pa(this),Kx.update.call(this,t),this[Yx]=!1):Kx[u].call(this,t)),d=c?{type:s.event||n,escapeConnect:i,batch:p}:p[0],this[jx]=!1,!e&&this._messageCenter.trigger(d.type,d)}function Ea(t){for(var e=this._pendingActions;e.length;){var n=e.shift();za.call(this,n,t)}}function Na(t){!t&&this.trigger("updated")}function Ra(t,e){t.on("rendered",function(){e.trigger("rendered"),!t.animation.isFinished()||e[Yx]||e._scheduler.unfinished||e._pendingActions.length||e.trigger("finished")})}function Ba(t,e,n,i){function r(t){var e="_ec_"+t.id+"_"+t.type,r=s[e];if(!r){var h=Hx(t.type);(r=new(o?dx.getClass(h.main,h.sub):ra.getClass(h.sub))).init(n,u),s[e]=r,a.push(r),l.add(r.group)}t.__viewId=r.__id=e,r.__alive=!0,r.__model=t,r.group.__ecComponentInfo={mainType:t.mainType,index:t.componentIndex},!o&&i.prepareView(r,t,n,u)}for(var o="component"===e,a=o?t._componentsViews:t._chartsViews,s=o?t._componentsMap:t._chartsMap,l=t._zr,u=t._api,h=0;h<a.length;h++)a[h].__alive=!1;o?n.eachComponent(function(t,e){"series"!==t&&r(e)}):n.eachSeries(r);for(h=0;h<a.length;){var c=a[h];c.__alive?h++:(!o&&c.renderTask.dispose(),l.remove(c.group),c.dispose(n,u),a.splice(h,1),delete s[c.__id],c.__id=c.group.__ecComponentInfo=null)}}function Va(t){t.clearColorPalette(),t.eachSeries(function(t){t.clearColorPalette()})}function Fa(t,e,n,i){Ha(t,e,n,i),Bx(t._chartsViews,function(t){t.__alive=!1}),Ga(t,e,n,i),Bx(t._chartsViews,function(t){t.__alive||t.remove(e,n)})}function Ha(t,e,n,i,r){Bx(r||t._componentsViews,function(t){var r=t.__model;t.render(r,e,n,i),Xa(r,t)})}function Ga(t,e,n,i,r){var o,a=t._scheduler;e.eachSeries(function(e){var n=t._chartsMap[e.__viewId];n.__alive=!0;var s=n.renderTask;a.updatePayload(s,i),r&&r.get(e.uid)&&s.dirty(),o|=s.perform(a.getPerformArgs(s)),n.group.silent=!!e.get("silent"),Xa(e,n),Ua(e,n)}),a.unfinished|=o,Za(t._zr,e),Ix(t._zr.dom,e)}function Wa(t,e){Bx(i_,function(n){n(t,e)})}function Za(t,e){var n=t.storage,i=0;n.traverse(function(t){t.isGroup||i++}),i>e.get("hoverLayerThreshold")&&!bp.node&&n.traverse(function(t){t.isGroup||(t.useHoverLayer=!0)})}function Ua(t,e){var n=t.get("blendMode")||null;e.group.traverse(function(t){t.isGroup||t.style.blend!==n&&t.setStyle("blend",n),t.eachPendingDisplayable&&t.eachPendingDisplayable(function(t){t.setStyle("blend",n)})})}function Xa(t,e){var n=t.get("z"),i=t.get("zlevel");e.group.traverse(function(t){"group"!==t.type&&(null!=n&&(t.z=n),null!=i&&(t.zlevel=i))})}function ja(t){var e=t._coordSysMgr;return o(new vo(t),{getCoordinateSystems:m(e.getCoordinateSystems,e),getComponentByElement:function(e){for(;e;){var n=e.__ecComponentInfo;if(null!=n)return t._model.getComponent(n.mainType,n.index);e=e.parent}}})}function Ya(t){function e(t,e){for(var i=0;i<t.length;i++)t[i][n]=e}var n="__connectUpdateStatus";Bx(t_,function(i,r){t._messageCenter.on(r,function(i){if(l_[t.group]&&0!==t[n]){if(i&&i.escapeConnect)return;var r=t.makeActionFromEvent(i),o=[];Bx(s_,function(e){e!==t&&e.group===t.group&&o.push(e)}),e(o,0),Bx(o,function(t){1!==t[n]&&t.dispatchAction(r)}),e(o,2)}})})}function qa(t){l_[t]=!1}function $a(t){return s_[Ln(t,c_)]}function Ka(t,e){o_[t]=e}function Qa(t){n_.push(t)}function Ja(t,e){is(e_,t,e,Wx)}function ts(t,e,n){"function"==typeof e&&(n=e,e="");var i=Fx(t)?t.type:[t,t={event:e}][0];t.event=(t.event||i).toLowerCase(),e=t.event,Rx(qx.test(i)&&qx.test(e)),Jx[i]||(Jx[i]={action:n,actionInfo:t}),t_[e]=i}function es(t,e){is(r_,t,e,Zx,"layout")}function ns(t,e){is(r_,t,e,Ux,"visual")}function is(t,e,n,i,r){(Vx(e)||Fx(e))&&(n=e,e=i);var o=da.wrapStageHandler(n,r);return o.__prio=e,o.__raw=n,t.push(o),o}function rs(t,e){a_[t]=e}function os(t){return Iy.extend(t)}function as(t){return dx.extend(t)}function ss(t){return cx.extend(t)}function ls(t){return ra.extend(t)}function us(t){return t}function hs(t,e,n,i,r){this._old=t,this._new=e,this._oldKeyGetter=n||us,this._newKeyGetter=i||us,this.context=r}function cs(t,e,n,i,r){for(var o=0;o<t.length;o++){var a="_ec_"+r[i](t[o],o),s=e[a];null==s?(n.push(a),e[a]=o):(s.length||(e[a]=s=[s]),s.push(o))}}function ds(t){var e={},n=e.encode={},i=N(),r=[],o=[];d(t.dimensions,function(e){var a=t.getDimensionInfo(e),s=a.coordDim;if(s){var l=n[s];n.hasOwnProperty(s)||(l=n[s]=[]),l[a.coordDimIndex]=e,a.isExtraCoord||(i.set(s,1),ps(a.type)&&(r[0]=e)),a.defaultTooltip&&o.push(e)}g_.each(function(t,e){var i=n[e];n.hasOwnProperty(e)||(i=n[e]=[]);var r=a.otherDims[e];null!=r&&!1!==r&&(i[r]=a.name)})});var a=[],s={};i.each(function(t,e){var i=n[e];s[e]=i[0],a=a.concat(i)}),e.dataDimsOnCoord=a,e.encodeFirstDimNotExtra=s;var l=n.label;l&&l.length&&(r=l.slice());var u=n.tooltip;return u&&u.length?o=u.slice():o.length||(o=r.slice()),n.defaultedLabel=r,n.defaultedTooltip=o,e}function fs(t){return"category"===t?"ordinal":"time"===t?"time":"float"}function ps(t){return!("ordinal"===t||"time"===t)}function gs(t){return t._rawCount>65535?x_:__}function ms(t){var e=t.constructor;return e===Array?t.slice():new e(t)}function vs(t,e){d(w_.concat(e.__wrappedMethods||[]),function(n){e.hasOwnProperty(n)&&(t[n]=e[n])}),t.__wrappedMethods=e.__wrappedMethods,d(b_,function(i){t[i]=n(e[i])}),t._calculationInfo=o(e._calculationInfo)}function ys(t){var e=t._invertedIndicesMap;d(e,function(n,i){var r=t._dimensionInfos[i].ordinalMeta;if(r){n=e[i]=new x_(r.categories.length);for(o=0;o<n.length;o++)n[o]=NaN;for(var o=0;o<t._count;o++)n[t.get(i,o)]=o}})}function xs(t,e,n){var i;if(null!=e){var r=t._chunkSize,o=Math.floor(n/r),a=n%r,s=t.dimensions[e],l=t._storage[s][o];if(l){i=l[a];var u=t._dimensionInfos[s].ordinalMeta;u&&u.categories.length&&(i=u.categories[i])}}return i}function _s(t){return t}function ws(t){return t<this._count&&t>=0?this._indices[t]:-1}function bs(t,e){var n=t._idList[e];return null==n&&(n=xs(t,t._idDimIdx,e)),null==n&&(n=v_+e),n}function Ms(t){return y(t)||(t=[t]),t}function Ss(t,e){var n=t.dimensions,i=new M_(f(n,t.getDimensionInfo,t),t.hostModel);vs(i,t);for(var r=i._storage={},o=t._storage,a=0;a<n.length;a++){var s=n[a];o[s]&&(l(e,s)>=0?(r[s]=Is(o[s]),i._rawExtent[s]=Cs(),i._extent[s]=null):r[s]=o[s])}return i}function Is(t){for(var e=new Array(t.length),n=0;n<t.length;n++)e[n]=ms(t[n]);return e}function Cs(){return[1/0,-1/0]}function Ts(t,e,i){function r(t,e,n){null!=g_.get(e)?t.otherDims[e]=n:(t.coordDim=e,t.coordDimIndex=n,h.set(e,!0))}$r.isInstance(e)||(e=$r.seriesDataToSource(e)),i=i||{},t=(t||[]).slice();for(var s=(i.dimsDef||[]).slice(),l=N(i.encodeDef),u=N(),h=N(),c=[],f=Ds(e,t,s,i.dimCount),p=0;p<f;p++){var g=s[p]=o({},w(s[p])?s[p]:{name:s[p]}),m=g.name,v=c[p]={otherDims:{}};null!=m&&null==u.get(m)&&(v.name=v.displayName=m,u.set(m,p)),null!=g.type&&(v.type=g.type),null!=g.displayName&&(v.displayName=g.displayName)}l.each(function(t,e){t=xn(t).slice();var n=l.set(e,[]);d(t,function(t,i){_(t)&&(t=u.get(t)),null!=t&&t<f&&(n[i]=t,r(c[t],e,i))})});var y=0;d(t,function(t,e){var i,t,o,s;if(_(t))i=t,t={};else{i=t.name;var u=t.ordinalMeta;t.ordinalMeta=null,(t=n(t)).ordinalMeta=u,o=t.dimsDef,s=t.otherDims,t.name=t.coordDim=t.coordDimIndex=t.dimsDef=t.otherDims=null}var h=xn(l.get(i));if(!h.length)for(var f=0;f<(o&&o.length||1);f++){for(;y<c.length&&null!=c[y].coordDim;)y++;y<c.length&&h.push(y++)}d(h,function(e,n){var l=c[e];if(r(a(l,t),i,n),null==l.name&&o){var u=o[n];!w(u)&&(u={name:u}),l.name=l.displayName=u.name,l.defaultTooltip=u.defaultTooltip}s&&a(l.otherDims,s)})});var x=i.generateCoord,b=i.generateCoordCount,M=null!=b;b=x?b||1:0;for(var S=x||"value",I=0;I<f;I++)null==(v=c[I]=c[I]||{}).coordDim&&(v.coordDim=As(S,h,M),v.coordDimIndex=0,(!x||b<=0)&&(v.isExtraCoord=!0),b--),null==v.name&&(v.name=As(v.coordDim,u)),null==v.type&&so(e,I,v.name)&&(v.type="ordinal");return c}function Ds(t,e,n,i){var r=Math.max(t.dimensionsDetectCount||1,e.length,n.length,i||0);return d(e,function(t){var e=t.dimsDef;e&&(r=Math.max(r,e.length))}),r}function As(t,e,n){if(n||null!=e.get(t)){for(var i=0;null!=e.get(t+i);)i++;t+=i}return e.set(t,!0),t}function ks(t,e,n){var i,r,o,a,s=(n=n||{}).byIndex,l=n.stackedCoordDimension,u=!(!t||!t.get("stack"));if(d(e,function(t,n){_(t)&&(e[n]=t={name:t}),u&&!t.isExtraCoord&&(s||i||!t.ordinalMeta||(i=t),r||"ordinal"===t.type||"time"===t.type||l&&l!==t.coordDim||(r=t))}),!r||s||i||(s=!0),r){o="__\0ecstackresult",a="__\0ecstackedover",i&&(i.createInvertedIndices=!0);var h=r.coordDim,c=r.type,f=0;d(e,function(t){t.coordDim===h&&f++}),e.push({name:o,coordDim:h,coordDimIndex:f,type:c,isExtraCoord:!0,isCalculationCoord:!0}),f++,e.push({name:a,coordDim:a,coordDimIndex:f,type:c,isExtraCoord:!0,isCalculationCoord:!0})}return{stackedDimension:r&&r.name,stackedByDimension:i&&i.name,isStackedByIndex:s,stackedOverDimension:a,stackResultDimension:o}}function Ps(t,e){return!!e&&e===t.getCalculationInfo("stackedDimension")}function Ls(t,e){return Ps(t,e)?t.getCalculationInfo("stackResultDimension"):e}function Os(t,e,n){n=n||{},$r.isInstance(t)||(t=$r.seriesDataToSource(t));var i,r=e.get("coordinateSystem"),o=yo.get(r),a=Yr(e);a&&(i=f(a.coordSysDims,function(t){var e={name:t},n=a.axisMap.get(t);if(n){var i=n.get("type");e.type=fs(i)}return e})),i||(i=o&&(o.getDimensionsInfo?o.getDimensionsInfo():o.dimensions.slice())||["x","y"]);var s,l,u=C_(t,{coordDimensions:i,generateCoord:n.generateCoord});a&&d(u,function(t,e){var n=t.coordDim,i=a.categoryAxisMap.get(n);i&&(null==s&&(s=e),t.ordinalMeta=i.getOrdinalMeta()),null!=t.otherDims.itemName&&(l=!0)}),l||null==s||(u[s].otherDims.itemName=0);var h=ks(e,u),c=new M_(u,e);c.setCalculationInfo(h);var p=null!=s&&zs(t)?function(t,e,n,i){return i===s?n:this.defaultDimValueGetter(t,e,n,i)}:null;return c.hasItemOption=!1,c.initData(t,null,p),c}function zs(t){if(t.sourceFormat===Py){var e=Es(t.data||[]);return null!=e&&!y(wn(e))}}function Es(t){for(var e=0;e<t.length&&null==t[e];)e++;return t[e]}function Ns(t){this._setting=t||{},this._extent=[1/0,-1/0],this._interval=0,this.init&&this.init.apply(this,arguments)}function Rs(t){this.categories=t.categories||[],this._needCollect=t.needCollect,this._deduplication=t.deduplication,this._map}function Bs(t){return t._map||(t._map=N(t.categories))}function Vs(t){return w(t)&&null!=t.value?t.value:t+""}function Fs(t,e,n,i){var r={},o=t[1]-t[0],a=r.interval=Lr(o/e,!0);null!=n&&a<n&&(a=r.interval=n),null!=i&&a>i&&(a=r.interval=i);var s=r.intervalPrecision=Hs(a);return Ws(r.niceTickExtent=[k_(Math.ceil(t[0]/a)*a,s),k_(Math.floor(t[1]/a)*a,s)],t),r}function Hs(t){return Sr(t)+2}function Gs(t,e,n){t[e]=Math.max(Math.min(t[e],n[1]),n[0])}function Ws(t,e){!isFinite(t[0])&&(t[0]=e[0]),!isFinite(t[1])&&(t[1]=e[1]),Gs(t,0,e),Gs(t,1,e),t[0]>t[1]&&(t[0]=t[1])}function Zs(t,e,n,i){var r=[];if(!t)return r;e[0]<n[0]&&r.push(e[0]);for(var o=n[0];o<=n[1]&&(r.push(o),(o=k_(o+t,i))!==r[r.length-1]);)if(r.length>1e4)return[];return e[1]>(r.length?r[r.length-1]:n[1])&&r.push(e[1]),r}function Us(t){return t.get("stack")||O_+t.seriesIndex}function Xs(t){return t.dim+t.index}function js(t,e){var n=[];return e.eachSeriesByType(t,function(t){Ks(t)&&!Qs(t)&&n.push(t)}),n}function Ys(t){var e=[];return d(t,function(t){var n=t.getData(),i=t.coordinateSystem.getBaseAxis(),r=i.getExtent(),o="category"===i.type?i.getBandWidth():Math.abs(r[1]-r[0])/n.count(),a=_r(t.get("barWidth"),o),s=_r(t.get("barMaxWidth"),o),l=t.get("barGap"),u=t.get("barCategoryGap");e.push({bandWidth:o,barWidth:a,barMaxWidth:s,barGap:l,barCategoryGap:u,axisKey:Xs(i),stackId:Us(t)})}),qs(e)}function qs(t){var e={};d(t,function(t,n){var i=t.axisKey,r=t.bandWidth,o=e[i]||{bandWidth:r,remainedWidth:r,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},a=o.stacks;e[i]=o;var s=t.stackId;a[s]||o.autoWidthCount++,a[s]=a[s]||{width:0,maxWidth:0};var l=t.barWidth;l&&!a[s].width&&(a[s].width=l,l=Math.min(o.remainedWidth,l),o.remainedWidth-=l);var u=t.barMaxWidth;u&&(a[s].maxWidth=u);var h=t.barGap;null!=h&&(o.gap=h);var c=t.barCategoryGap;null!=c&&(o.categoryGap=c)});var n={};return d(e,function(t,e){n[e]={};var i=t.stacks,r=t.bandWidth,o=_r(t.categoryGap,r),a=_r(t.gap,1),s=t.remainedWidth,l=t.autoWidthCount,u=(s-o)/(l+(l-1)*a);u=Math.max(u,0),d(i,function(t,e){var n=t.maxWidth;n&&n<u&&(n=Math.min(n,s),t.width&&(n=Math.min(n,t.width)),s-=n,t.width=n,l--)}),u=(s-o)/(l+(l-1)*a),u=Math.max(u,0);var h,c=0;d(i,function(t,e){t.width||(t.width=u),h=t,c+=t.width*(1+a)}),h&&(c-=h.width*a);var f=-c/2;d(i,function(t,i){n[e][i]=n[e][i]||{offset:f,width:t.width},f+=t.width*(1+a)})}),n}function $s(t,e,n){if(t&&e){var i=t[Xs(e)];return null!=i&&null!=n&&(i=i[Us(n)]),i}}function Ks(t){return t.coordinateSystem&&"cartesian2d"===t.coordinateSystem.type}function Qs(t){return t.pipelineContext&&t.pipelineContext.large}function Js(t,e,n){return l(t.getAxesOnZeroOf(),e)>=0||n?e.toGlobalCoord(e.dataToCoord(0)):e.getGlobalExtent()[0]}function tl(t,e){return U_(t,Z_(e))}function el(t,e){var n,i,r,o=t.type,a=e.getMin(),s=e.getMax(),l=null!=a,u=null!=s,h=t.getExtent();"ordinal"===o?n=e.getCategories().length:(y(i=e.get("boundaryGap"))||(i=[i||0,i||0]),"boolean"==typeof i[0]&&(i=[0,0]),i[0]=_r(i[0],1),i[1]=_r(i[1],1),r=h[1]-h[0]||Math.abs(h[0])),null==a&&(a="ordinal"===o?n?0:NaN:h[0]-i[0]*r),null==s&&(s="ordinal"===o?n?n-1:NaN:h[1]+i[1]*r),"dataMin"===a?a=h[0]:"function"==typeof a&&(a=a({min:h[0],max:h[1]})),"dataMax"===s?s=h[1]:"function"==typeof s&&(s=s({min:h[0],max:h[1]})),(null==a||!isFinite(a))&&(a=NaN),(null==s||!isFinite(s))&&(s=NaN),t.setBlank(I(a)||I(s)||"ordinal"===o&&!t.getOrdinalMeta().categories.length),e.getNeedCrossZero()&&(a>0&&s>0&&!l&&(a=0),a<0&&s<0&&!u&&(s=0));var c=e.ecModel;if(c&&"time"===o){var f,p=js("bar",c);if(d(p,function(t){f|=t.getBaseAxis()===e.axis}),f){var g=Ys(p),m=nl(a,s,e,g);a=m.min,s=m.max}}return[a,s]}function nl(t,e,n,i){var r=n.axis.getExtent(),o=r[1]-r[0],a=$s(i,n.axis);if(void 0===a)return{min:t,max:e};var s=1/0;d(a,function(t){s=Math.min(t.offset,s)});var l=-1/0;d(a,function(t){l=Math.max(t.offset+t.width,l)}),s=Math.abs(s),l=Math.abs(l);var u=s+l,h=e-t,c=h/(1-(s+l)/o)-h;return e+=c*(l/u),t-=c*(s/u),{min:t,max:e}}function il(t,e){var n=el(t,e),i=null!=e.getMin(),r=null!=e.getMax(),o=e.get("splitNumber");"log"===t.type&&(t.base=e.get("logBase"));var a=t.type;t.setExtent(n[0],n[1]),t.niceExtent({splitNumber:o,fixMin:i,fixMax:r,minInterval:"interval"===a||"time"===a?e.get("minInterval"):null,maxInterval:"interval"===a||"time"===a?e.get("maxInterval"):null});var s=e.get("interval");null!=s&&t.setInterval&&t.setInterval(s)}function rl(t,e){if(e=e||t.get("type"))switch(e){case"category":return new A_(t.getOrdinalMeta?t.getOrdinalMeta():t.getCategories(),[1/0,-1/0]);case"value":return new L_;default:return(Ns.getClass(e)||L_).create(t)}}function ol(t){var e=t.scale.getExtent(),n=e[0],i=e[1];return!(n>0&&i>0||n<0&&i<0)}function al(t){var e=t.getLabelModel().get("formatter"),n="category"===t.type?t.scale.getExtent()[0]:null;return"string"==typeof e?e=function(t){return function(e){return t.replace("{value}",null!=e?e:"")}}(e):"function"==typeof e?function(i,r){return null!=n&&(r=i-n),e(sl(t,i),r)}:function(e){return t.scale.getLabel(e)}}function sl(t,e){return"category"===t.type?t.scale.getLabel(e):e}function ll(t){var e=t.model,n=t.scale;if(e.get("axisLabel.show")&&!n.isBlank()){var i,r,o="category"===t.type,a=n.getExtent();r=o?n.count():(i=n.getTicks()).length;var s,l=t.getLabelModel(),u=al(t),h=1;r>40&&(h=Math.ceil(r/40));for(var c=0;c<r;c+=h){var d=u(i?i[c]:a[0]+c),f=ul(l.getTextRect(d),l.get("rotate")||0);s?s.union(f):s=f}return s}}function ul(t,e){var n=e*Math.PI/180,i=t.plain(),r=i.width,o=i.height,a=r*Math.cos(n)+o*Math.sin(n),s=r*Math.sin(n)+o*Math.cos(n);return new Xt(i.x,i.y,a,s)}function hl(t,e){if("image"!==this.type){var n=this.style,i=this.shape;i&&"line"===i.symbolType?n.stroke=t:this.__isEmptyBrush?(n.stroke=t,n.fill=e||"#fff"):(n.fill&&(n.fill=t),n.stroke&&(n.stroke=t)),this.dirty(!1)}}function cl(t,e,n,i,r,o,a){var s=0===t.indexOf("empty");s&&(t=t.substr(5,1).toLowerCase()+t.substr(6));var l;return l=0===t.indexOf("image://")?Pi(t.slice(8),new Xt(e,n,i,r),a?"center":"cover"):0===t.indexOf("path://")?ki(t.slice(7),{},new Xt(e,n,i,r),a?"center":"cover"):new rw({shape:{symbolType:t,x:e,y:n,width:i,height:r}}),l.__isEmptyBrush=s,l.setColor=hl,l.setColor(o),l}function dl(t,e){return Math.abs(t-e)<sw}function fl(t,e,n){var i=0,r=t[0];if(!r)return!1;for(var o=1;o<t.length;o++){var a=t[o];i+=hi(r[0],r[1],a[0],a[1],e,n),r=a}var s=t[0];return dl(r[0],s[0])&&dl(r[1],s[1])||(i+=hi(r[0],r[1],s[0],s[1],e,n)),0!==i}function pl(t,e,n){if(this.name=t,this.geometries=e,n)n=[n[0],n[1]];else{var i=this.getBoundingRect();n=[i.x+i.width/2,i.y+i.height/2]}this.center=n}function gl(t){if(!t.UTF8Encoding)return t;var e=t.UTF8Scale;null==e&&(e=1024);for(var n=t.features,i=0;i<n.length;i++)for(var r=n[i].geometry,o=r.coordinates,a=r.encodeOffsets,s=0;s<o.length;s++){var l=o[s];if("Polygon"===r.type)o[s]=ml(l,a[s],e);else if("MultiPolygon"===r.type)for(var u=0;u<l.length;u++){var h=l[u];l[u]=ml(h,a[s][u],e)}}return t.UTF8Encoding=!1,t}function ml(t,e,n){for(var i=[],r=e[0],o=e[1],a=0;a<t.length;a+=2){var s=t.charCodeAt(a)-64,l=t.charCodeAt(a+1)-64;s=s>>1^-(1&s),l=l>>1^-(1&l),r=s+=r,o=l+=o,i.push([s/n,l/n])}return i}function vl(t){return"category"===t.type?xl(t):bl(t)}function yl(t,e){return"category"===t.type?wl(t,e):{ticks:t.scale.getTicks()}}function xl(t){var e=t.getLabelModel(),n=_l(t,e);return!e.get("show")||t.scale.isBlank()?{labels:[],labelCategoryInterval:n.labelCategoryInterval}:n}function _l(t,e){var n=Ml(t,"labels"),i=Pl(e),r=Sl(n,i);if(r)return r;var o,a;return o=x(i)?kl(t,i):Al(t,a="auto"===i?Cl(t):i),Il(n,i,{labels:o,labelCategoryInterval:a})}function wl(t,e){var n=Ml(t,"ticks"),i=Pl(e),r=Sl(n,i);if(r)return r;var o,a;if(e.get("show")&&!t.scale.isBlank()||(o=[]),x(i))o=kl(t,i,!0);else if("auto"===i){var s=_l(t,t.getLabelModel());a=s.labelCategoryInterval,o=f(s.labels,function(t){return t.tickValue})}else o=Al(t,a=i,!0);return Il(n,i,{ticks:o,tickCategoryInterval:a})}function bl(t){var e=t.scale.getTicks(),n=al(t);return{labels:f(e,function(e,i){return{formattedLabel:n(e,i),rawLabel:t.scale.getLabel(e),tickValue:e}})}}function Ml(t,e){return uw(t)[e]||(uw(t)[e]=[])}function Sl(t,e){for(var n=0;n<t.length;n++)if(t[n].key===e)return t[n].value}function Il(t,e,n){return t.push({key:e,value:n}),n}function Cl(t){var e=uw(t).autoInterval;return null!=e?e:uw(t).autoInterval=t.calculateCategoryInterval()}function Tl(t){var e=Dl(t),n=al(t),i=(e.axisRotate-e.labelRotate)/180*Math.PI,r=t.scale,o=r.getExtent(),a=r.count();if(o[1]-o[0]<1)return 0;var s=1;a>40&&(s=Math.max(1,Math.floor(a/40)));for(var l=o[0],u=t.dataToCoord(l+1)-t.dataToCoord(l),h=Math.abs(u*Math.cos(i)),c=Math.abs(u*Math.sin(i)),d=0,f=0;l<=o[1];l+=s){var p=0,g=0,m=ce(n(l),e.font,"center","top");p=1.3*m.width,g=1.3*m.height,d=Math.max(d,p,7),f=Math.max(f,g,7)}var v=d/h,y=f/c;isNaN(v)&&(v=1/0),isNaN(y)&&(y=1/0);var x=Math.max(0,Math.floor(Math.min(v,y))),_=uw(t.model),w=_.lastAutoInterval,b=_.lastTickCount;return null!=w&&null!=b&&Math.abs(w-x)<=1&&Math.abs(b-a)<=1&&w>x?x=w:(_.lastTickCount=a,_.lastAutoInterval=x),x}function Dl(t){var e=t.getLabelModel();return{axisRotate:t.getRotate?t.getRotate():t.isHorizontal&&!t.isHorizontal()?90:0,labelRotate:e.get("rotate")||0,font:e.getFont()}}function Al(t,e,n){function i(t){l.push(n?t:{formattedLabel:r(t),rawLabel:o.getLabel(t),tickValue:t})}var r=al(t),o=t.scale,a=o.getExtent(),s=t.getLabelModel(),l=[],u=Math.max((e||0)+1,1),h=a[0],c=o.count();0!==h&&u>1&&c/u>2&&(h=Math.round(Math.ceil(h/u)*u));var d={min:s.get("showMinLabel"),max:s.get("showMaxLabel")};d.min&&h!==a[0]&&i(a[0]);for(var f=h;f<=a[1];f+=u)i(f);return d.max&&f!==a[1]&&i(a[1]),l}function kl(t,e,n){var i=t.scale,r=al(t),o=[];return d(i.getTicks(),function(t){var a=i.getLabel(t);e(t,a)&&o.push(n?t:{formattedLabel:r(t),rawLabel:a,tickValue:t})}),o}function Pl(t){var e=t.get("interval");return null==e?"auto":e}function Ll(t,e){var n=(t[1]-t[0])/e/2;t[0]+=n,t[1]-=n}function Ol(t,e,n,i,r){function o(t,e){return h?t>e:t<e}var a=e.length;if(t.onBand&&!i&&a){var s,l=t.getExtent();if(1===a)e[0].coord=l[0],s=e[1]={coord:l[0]};else{var u=e[1].coord-e[0].coord;d(e,function(t){t.coord-=u/2;var e=e||0;e%2>0&&(t.coord-=u/(2*(e+1)))}),s={coord:e[a-1].coord+u},e.push(s)}var h=l[0]>l[1];o(e[0].coord,l[0])&&(r?e[0].coord=l[0]:e.shift()),r&&o(l[0],e[0].coord)&&e.unshift({coord:l[0]}),o(l[1],s.coord)&&(r?s.coord=l[1]:e.pop()),r&&o(s.coord,l[1])&&e.push({coord:l[1]})}}function zl(t,e){var n=t.mapDimension("defaultedLabel",!0),i=n.length;if(1===i)return Zo(t,e,n[0]);if(i){for(var r=[],o=0;o<n.length;o++){var a=Zo(t,e,n[o]);r.push(a)}return r.join(" ")}}function El(t,e,n){Sg.call(this),this.updateData(t,e,n)}function Nl(t){return[t[0]/2,t[1]/2]}function Rl(t,e){this.parent.drift(t,e)}function Bl(t){this.group=new Sg,this._symbolCtor=t||El}function Vl(t,e,n,i){return e&&!isNaN(e[0])&&!isNaN(e[1])&&!(i.isIgnore&&i.isIgnore(n))&&!(i.clipShape&&!i.clipShape.contain(e[0],e[1]))&&"none"!==t.getItemVisual(n,"symbol")}function Fl(t){return null==t||w(t)||(t={isIgnore:t}),t||{}}function Hl(t){var e=t.hostModel;return{itemStyle:e.getModel("itemStyle").getItemStyle(["color"]),hoverItemStyle:e.getModel("emphasis.itemStyle").getItemStyle(),symbolRotate:e.get("symbolRotate"),symbolOffset:e.get("symbolOffset"),hoverAnimation:e.get("hoverAnimation"),labelModel:e.getModel("label"),hoverLabelModel:e.getModel("emphasis.label"),cursorStyle:e.get("cursor")}}function Gl(t,e,n){var i,r=t.getBaseAxis(),o=t.getOtherAxis(r),a=Wl(o,n),s=r.dim,l=o.dim,u=e.mapDimension(l),h=e.mapDimension(s),c="x"===l||"radius"===l?1:0,d=f(t.dimensions,function(t){return e.mapDimension(t)}),p=e.getCalculationInfo("stackResultDimension");return(i|=Ps(e,d[0]))&&(d[0]=p),(i|=Ps(e,d[1]))&&(d[1]=p),{dataDimsForPoint:d,valueStart:a,valueAxisDim:l,baseAxisDim:s,stacked:!!i,valueDim:u,baseDim:h,baseDataOffset:c,stackedOverDimension:e.getCalculationInfo("stackedOverDimension")}}function Wl(t,e){var n=0,i=t.scale.getExtent();return"start"===e?n=i[0]:"end"===e?n=i[1]:i[0]>0?n=i[0]:i[1]<0&&(n=i[1]),n}function Zl(t,e,n,i){var r=NaN;t.stacked&&(r=n.get(n.getCalculationInfo("stackedOverDimension"),i)),isNaN(r)&&(r=t.valueStart);var o=t.baseDataOffset,a=[];return a[o]=n.get(t.baseDim,i),a[1-o]=r,e.dataToPoint(a)}function Ul(t,e){var n=[];return e.diff(t).add(function(t){n.push({cmd:"+",idx:t})}).update(function(t,e){n.push({cmd:"=",idx:e,idx1:t})}).remove(function(t){n.push({cmd:"-",idx:t})}).execute(),n}function Xl(t){return isNaN(t[0])||isNaN(t[1])}function jl(t,e,n,i,r,o,a,s,l,u,h){return"none"!==u&&u?Yl.apply(this,arguments):ql.apply(this,arguments)}function Yl(t,e,n,i,r,o,a,s,l,u,h){for(var c=0,d=n,f=0;f<i;f++){var p=e[d];if(d>=r||d<0)break;if(Xl(p)){if(h){d+=o;continue}break}if(d===n)t[o>0?"moveTo":"lineTo"](p[0],p[1]);else if(l>0){var g=e[c],m="y"===u?1:0,v=(p[m]-g[m])*l;Iw(Tw,g),Tw[m]=g[m]+v,Iw(Dw,p),Dw[m]=p[m]-v,t.bezierCurveTo(Tw[0],Tw[1],Dw[0],Dw[1],p[0],p[1])}else t.lineTo(p[0],p[1]);c=d,d+=o}return f}function ql(t,e,n,i,r,o,a,s,l,u,h){for(var c=0,d=n,f=0;f<i;f++){var p=e[d];if(d>=r||d<0)break;if(Xl(p)){if(h){d+=o;continue}break}if(d===n)t[o>0?"moveTo":"lineTo"](p[0],p[1]),Iw(Tw,p);else if(l>0){var g=d+o,m=e[g];if(h)for(;m&&Xl(e[g]);)m=e[g+=o];var v=.5,y=e[c];if(!(m=e[g])||Xl(m))Iw(Dw,p);else{Xl(m)&&!h&&(m=p),W(Cw,m,y);var x,_;if("x"===u||"y"===u){var w="x"===u?0:1;x=Math.abs(p[w]-y[w]),_=Math.abs(p[w]-m[w])}else x=Fp(p,y),_=Fp(p,m);Sw(Dw,p,Cw,-l*(1-(v=_/(_+x))))}bw(Tw,Tw,s),Mw(Tw,Tw,a),bw(Dw,Dw,s),Mw(Dw,Dw,a),t.bezierCurveTo(Tw[0],Tw[1],Dw[0],Dw[1],p[0],p[1]),Sw(Tw,p,Cw,l*v)}else t.lineTo(p[0],p[1]);c=d,d+=o}return f}function $l(t,e){var n=[1/0,1/0],i=[-1/0,-1/0];if(e)for(var r=0;r<t.length;r++){var o=t[r];o[0]<n[0]&&(n[0]=o[0]),o[1]<n[1]&&(n[1]=o[1]),o[0]>i[0]&&(i[0]=o[0]),o[1]>i[1]&&(i[1]=o[1])}return{min:e?n:i,max:e?i:n}}function Kl(t,e){if(t.length===e.length){for(var n=0;n<t.length;n++){var i=t[n],r=e[n];if(i[0]!==r[0]||i[1]!==r[1])return}return!0}}function Ql(t){return"number"==typeof t?t:t?.5:0}function Jl(t){var e=t.getGlobalExtent();if(t.onBand){var n=t.getBandWidth()/2-1,i=e[1]>e[0]?1:-1;e[0]+=i*n,e[1]-=i*n}return e}function tu(t,e,n){if(!n.valueDim)return[];for(var i=[],r=0,o=e.count();r<o;r++)i.push(Zl(n,t,e,r));return i}function eu(t,e,n,i){var r=Jl(t.getAxis("x")),o=Jl(t.getAxis("y")),a=t.getBaseAxis().isHorizontal(),s=Math.min(r[0],r[1]),l=Math.min(o[0],o[1]),u=Math.max(r[0],r[1])-s,h=Math.max(o[0],o[1])-l;if(n)s-=.5,u+=.5,l-=.5,h+=.5;else{var c=i.get("lineStyle.width")||2,d=i.get("clipOverflow")?c/2:Math.max(u,h);a?(l-=d,h+=2*d):(s-=d,u+=2*d)}var f=new Fv({shape:{x:s,y:l,width:u,height:h}});return e&&(f.shape[a?"width":"height"]=0,sr(f,{shape:{width:u,height:h}},i)),f}function nu(t,e,n,i){var r=t.getAngleAxis(),o=t.getRadiusAxis().getExtent().slice();o[0]>o[1]&&o.reverse();var a=r.getExtent(),s=Math.PI/180;n&&(o[0]-=.5,o[1]+=.5);var l=new zv({shape:{cx:wr(t.cx,1),cy:wr(t.cy,1),r0:wr(o[0],1),r:wr(o[1],1),startAngle:-a[0]*s,endAngle:-a[1]*s,clockwise:r.inverse}});return e&&(l.shape.endAngle=-a[0]*s,sr(l,{shape:{endAngle:-a[1]*s}},i)),l}function iu(t,e,n,i){return"polar"===t.type?nu(t,e,n,i):eu(t,e,n,i)}function ru(t,e,n){for(var i=e.getBaseAxis(),r="x"===i.dim||"radius"===i.dim?0:1,o=[],a=0;a<t.length-1;a++){var s=t[a+1],l=t[a];o.push(l);var u=[];switch(n){case"end":u[r]=s[r],u[1-r]=l[1-r],o.push(u);break;case"middle":var h=(l[r]+s[r])/2,c=[];u[r]=c[r]=h,u[1-r]=l[1-r],c[1-r]=s[1-r],o.push(u),o.push(c);break;default:u[r]=l[r],u[1-r]=s[1-r],o.push(u)}}return t[a]&&o.push(t[a]),o}function ou(t,e){var n=t.getVisual("visualMeta");if(n&&n.length&&t.count()&&"cartesian2d"===e.type){for(var i,r,o=n.length-1;o>=0;o--){var a=n[o].dimension,s=t.dimensions[a],l=t.getDimensionInfo(s);if("x"===(i=l&&l.coordDim)||"y"===i){r=n[o];break}}if(r){var u=e.getAxis(i),h=f(r.stops,function(t){return{coord:u.toGlobalCoord(u.dataToCoord(t.value)),color:t.color}}),c=h.length,p=r.outerColors.slice();c&&h[0].coord>h[c-1].coord&&(h.reverse(),p.reverse());var g=h[0].coord-10,m=h[c-1].coord+10,v=m-g;if(v<.001)return"transparent";d(h,function(t){t.offset=(t.coord-g)/v}),h.push({offset:c?h[c-1].offset:.5,color:p[1]||"transparent"}),h.unshift({offset:c?h[0].offset:.5,color:p[0]||"transparent"});var y=new jv(0,0,0,0,h,!0);return y[i]=g,y[i+"2"]=m,y}}}function au(t,e,n){var i=t.get("showAllSymbol"),r="auto"===i;if(!i||r){var o=n.getAxesByScale("ordinal")[0];if(o&&(!r||!su(o,e))){var a=e.mapDimension(o.dim),s={};return d(o.getViewLabels(),function(t){s[t.tickValue]=1}),function(t){return!s.hasOwnProperty(e.get(a,t))}}}}function su(t,e){var n=t.getExtent(),i=Math.abs(n[1]-n[0])/t.scale.count();isNaN(i)&&(i=0);for(var r=e.count(),o=Math.max(1,Math.round(r/5)),a=0;a<r;a+=o)if(1.5*El.getSymbolSize(e,a)[t.isHorizontal()?1:0]>i)return!1;return!0}function lu(t){return this._axes[t]}function uu(t){Ew.call(this,t)}function hu(t,e){return e.type||(e.data?"category":"value")}function cu(t,e,n){return t.getCoordSysModel()===e}function du(t,e,n){this._coordsMap={},this._coordsList=[],this._axesMap={},this._axesList=[],this._initCartesian(t,e,n),this.model=t}function fu(t,e,n){n.getAxesOnZeroOf=function(){return i?[i]:[]};var i,r=t[e],o=n.model,a=o.get("axisLine.onZero"),s=o.get("axisLine.onZeroAxisIndex");if(a)if(null==s){for(var l in r)if(r.hasOwnProperty(l)&&pu(r[l])){i=r[l];break}}else pu(r[s])&&(i=r[s])}function pu(t){return t&&"category"!==t.type&&"time"!==t.type&&ol(t)}function gu(t,e){var n=t.getExtent(),i=n[0]+n[1];t.toGlobalCoord="x"===t.dim?function(t){return t+e}:function(t){return i-t+e},t.toLocalCoord="x"===t.dim?function(t){return t-e}:function(t){return i-t+e}}function mu(t,e){return f(Zw,function(e){return t.getReferringComponents(e)[0]})}function vu(t){return"cartesian2d"===t.get("coordinateSystem")}function yu(t){var e={componentType:t.mainType};return e[t.mainType+"Index"]=t.componentIndex,e}function xu(t,e,n,i){var r,o,a=Tr(n-t.rotation),s=i[0]>i[1],l="start"===e&&!s||"start"!==e&&s;return Dr(a-Uw/2)?(o=l?"bottom":"top",r="center"):Dr(a-1.5*Uw)?(o=l?"top":"bottom",r="center"):(o="middle",r=a<1.5*Uw&&a>Uw/2?l?"left":"right":l?"right":"left"),{rotation:a,textAlign:r,textVerticalAlign:o}}function _u(t){var e=t.get("tooltip");return t.get("silent")||!(t.get("triggerEvent")||e&&e.show)}function wu(t,e,n){var i=t.get("axisLabel.showMinLabel"),r=t.get("axisLabel.showMaxLabel");e=e||[],n=n||[];var o=e[0],a=e[1],s=e[e.length-1],l=e[e.length-2],u=n[0],h=n[1],c=n[n.length-1],d=n[n.length-2];!1===i?(bu(o),bu(u)):Mu(o,a)&&(i?(bu(a),bu(h)):(bu(o),bu(u))),!1===r?(bu(s),bu(c)):Mu(l,s)&&(r?(bu(l),bu(d)):(bu(s),bu(c)))}function bu(t){t&&(t.ignore=!0)}function Mu(t,e,n){var i=t&&t.getBoundingRect().clone(),r=e&&e.getBoundingRect().clone();if(i&&r){var o=ot([]);return ut(o,o,-t.rotation),i.applyTransform(st([],o,t.getLocalTransform())),r.applyTransform(st([],o,e.getLocalTransform())),i.intersect(r)}}function Su(t){return"middle"===t||"center"===t}function Iu(t,e,n){var i=e.axis;if(e.get("axisTick.show")&&!i.scale.isBlank()){for(var r=e.getModel("axisTick"),o=r.getModel("lineStyle"),s=r.get("length"),l=i.getTicksCoords(),u=[],h=[],c=t._transform,d=[],f=0;f<l.length;f++){var p=l[f].coord;u[0]=p,u[1]=0,h[0]=p,h[1]=n.tickDirection*s,c&&($(u,u,c),$(h,h,c));var g=new Hv(zi({anid:"tick_"+l[f].tickValue,shape:{x1:u[0],y1:u[1],x2:h[0],y2:h[1]},style:a(o.getLineStyle(),{stroke:e.get("axisLine.lineStyle.color")}),z2:2,silent:!0}));t.group.add(g),d.push(g)}return d}}function Cu(t,e,n){var i=e.axis;if(C(n.axisLabelShow,e.get("axisLabel.show"))&&!i.scale.isBlank()){var r=e.getModel("axisLabel"),o=r.get("margin"),a=i.getViewLabels(),s=(C(n.labelRotate,r.get("rotate"))||0)*Uw/180,l=Yw(n.rotation,s,n.labelDirection),u=e.getCategories(!0),h=[],c=_u(e),f=e.get("triggerEvent");return d(a,function(a,s){var d=a.tickValue,p=a.formattedLabel,g=a.rawLabel,m=r;u&&u[d]&&u[d].textStyle&&(m=new pr(u[d].textStyle,r,e.ecModel));var v=m.getTextColor()||e.get("axisLine.lineStyle.color"),y=[i.dataToCoord(d),n.labelOffset+n.labelDirection*o],x=new kv({anid:"label_"+d,position:y,rotation:l.rotation,silent:c,z2:10});Ki(x.style,m,{text:p,textAlign:m.getShallow("align",!0)||l.textAlign,textVerticalAlign:m.getShallow("verticalAlign",!0)||m.getShallow("baseline",!0)||l.textVerticalAlign,textFill:"function"==typeof v?v("category"===i.type?g:"value"===i.type?d+"":d,s):v}),f&&(x.eventData=yu(e),x.eventData.targetType="axisLabel",x.eventData.value=g),t._dumbGroup.add(x),x.updateTransform(),h.push(x),t.group.add(x),x.decomposeTransform()}),h}}function Tu(t,e){var n={axesInfo:{},seriesInvolved:!1,coordSysAxesInfo:{},coordSysMap:{}};return Du(n,t,e),n.seriesInvolved&&ku(n,t),n}function Du(t,e,n){var i=e.getComponent("tooltip"),r=e.getComponent("axisPointer"),o=r.get("link",!0)||[],a=[];qw(n.getCoordinateSystems(),function(n){function s(i,s,l){var c=l.model.getModel("axisPointer",r),d=c.get("show");if(d&&("auto"!==d||i||Nu(c))){null==s&&(s=c.get("triggerTooltip"));var f=(c=i?Au(l,h,r,e,i,s):c).get("snap"),p=Ru(l.model),g=s||f||"category"===l.type,m=t.axesInfo[p]={key:p,axis:l,coordSys:n,axisPointerModel:c,triggerTooltip:s,involveSeries:g,snap:f,useHandle:Nu(c),seriesModels:[]};u[p]=m,t.seriesInvolved|=g;var v=Pu(o,l);if(null!=v){var y=a[v]||(a[v]={axesInfo:{}});y.axesInfo[p]=m,y.mapper=o[v].mapper,m.linkGroup=y}}}if(n.axisPointerEnabled){var l=Ru(n.model),u=t.coordSysAxesInfo[l]={};t.coordSysMap[l]=n;var h=n.model.getModel("tooltip",i);if(qw(n.getAxes(),$w(s,!1,null)),n.getTooltipAxes&&i&&h.get("show")){var c="axis"===h.get("trigger"),d="cross"===h.get("axisPointer.type"),f=n.getTooltipAxes(h.get("axisPointer.axis"));(c||d)&&qw(f.baseAxes,$w(s,!d||"cross",c)),d&&qw(f.otherAxes,$w(s,"cross",!1))}}})}function Au(t,e,i,r,o,s){var l=e.getModel("axisPointer"),u={};qw(["type","snap","lineStyle","shadowStyle","label","animation","animationDurationUpdate","animationEasingUpdate","z"],function(t){u[t]=n(l.get(t))}),u.snap="category"!==t.type&&!!s,"cross"===l.get("type")&&(u.type="line");var h=u.label||(u.label={});if(null==h.show&&(h.show=!1),"cross"===o){var c=l.get("label.show");if(h.show=null==c||c,!s){var d=u.lineStyle=l.get("crossStyle");d&&a(h,d.textStyle)}}return t.model.getModel("axisPointer",new pr(u,i,r))}function ku(t,e){e.eachSeries(function(e){var n=e.coordinateSystem,i=e.get("tooltip.trigger",!0),r=e.get("tooltip.show",!0);n&&"none"!==i&&!1!==i&&"item"!==i&&!1!==r&&!1!==e.get("axisPointer.show",!0)&&qw(t.coordSysAxesInfo[Ru(n.model)],function(t){var i=t.axis;n.getAxis(i.dim)===i&&(t.seriesModels.push(e),null==t.seriesDataCount&&(t.seriesDataCount=0),t.seriesDataCount+=e.getData().count())})},this)}function Pu(t,e){for(var n=e.model,i=e.dim,r=0;r<t.length;r++){var o=t[r]||{};if(Lu(o[i+"AxisId"],n.id)||Lu(o[i+"AxisIndex"],n.componentIndex)||Lu(o[i+"AxisName"],n.name))return r}}function Lu(t,e){return"all"===t||y(t)&&l(t,e)>=0||t===e}function Ou(t){var e=zu(t);if(e){var n=e.axisPointerModel,i=e.axis.scale,r=n.option,o=n.get("status"),a=n.get("value");null!=a&&(a=i.parse(a));var s=Nu(n);null==o&&(r.status=s?"show":"hide");var l=i.getExtent().slice();l[0]>l[1]&&l.reverse(),(null==a||a>l[1])&&(a=l[1]),a<l[0]&&(a=l[0]),r.value=a,s&&(r.status=e.axis.scale.isBlank()?"hide":"show")}}function zu(t){var e=(t.ecModel.getComponent("axisPointer")||{}).coordSysAxesInfo;return e&&e.axesInfo[Ru(t)]}function Eu(t){var e=zu(t);return e&&e.axisPointerModel}function Nu(t){return!!t.get("handle.show")}function Ru(t){return t.type+"||"+t.id}function Bu(t,e,n,i,r,o){var a=Kw.getAxisPointerClass(t.axisPointerClass);if(a){var s=Eu(e);s?(t._axisPointer||(t._axisPointer=new a)).render(e,s,i,o):Vu(t,i)}}function Vu(t,e,n){var i=t._axisPointer;i&&i.dispose(e,n),t._axisPointer=null}function Fu(t,e,n){n=n||{};var i=t.coordinateSystem,r=e.axis,o={},a=r.getAxesOnZeroOf()[0],s=r.position,l=a?"onZero":s,u=r.dim,h=i.getRect(),c=[h.x,h.x+h.width,h.y,h.y+h.height],d={left:0,right:1,top:0,bottom:1,onZero:2},f=e.get("offset")||0,p="x"===u?[c[2]-f,c[3]+f]:[c[0]-f,c[1]+f];if(a){var g=a.toGlobalCoord(a.dataToCoord(0));p[d.onZero]=Math.max(Math.min(g,p[1]),p[0])}o.position=["y"===u?p[d[l]]:c[0],"x"===u?p[d[l]]:c[3]],o.rotation=Math.PI/2*("x"===u?0:1);var m={top:-1,bottom:1,left:-1,right:1};o.labelDirection=o.tickDirection=o.nameDirection=m[s],o.labelOffset=a?p[d[s]]-p[d.onZero]:0,e.get("axisTick.inside")&&(o.tickDirection=-o.tickDirection),C(n.labelInside,e.get("axisLabel.inside"))&&(o.labelDirection=-o.labelDirection);var v=e.get("axisLabel.rotate");return o.labelRotate="top"===l?-v:v,o.z2=1,o}function Hu(t,e,n,i,r,o,a){$i(t,e,n.getModel("label"),n.getModel("emphasis.label"),{labelFetcher:r,labelDataIndex:o,defaultText:zl(r.getData(),o),isRectText:!0,autoColor:i}),Gu(t),Gu(e)}function Gu(t,e){"outside"===t.textPosition&&(t.textPosition=e)}function Wu(t,e,n){n.style.text=null,ar(n,{shape:{width:0}},e,t,function(){n.parent&&n.parent.remove(n)})}function Zu(t,e,n){n.style.text=null,ar(n,{shape:{r:n.shape.r0}},e,t,function(){n.parent&&n.parent.remove(n)})}function Uu(t,e,n,i,r,o,s,l){var u=e.getItemVisual(n,"color"),h=e.getItemVisual(n,"opacity"),c=i.getModel("itemStyle"),d=i.getModel("emphasis.itemStyle").getBarItemStyle();l||t.setShape("r",c.get("barBorderRadius")||0),t.useStyle(a({fill:u,opacity:h},c.getBarItemStyle()));var f=i.getShallow("cursor");f&&t.attr("cursor",f);var p=s?r.height>0?"bottom":"top":r.width>0?"left":"right";l||Hu(t.style,d,i,u,o,n,p),qi(t,d)}function Xu(t,e){var n=t.get(rb)||0;return Math.min(n,Math.abs(e.width),Math.abs(e.height))}function ju(t,e,n){var i=t.getData(),r=[],o=i.getLayout("valueAxisHorizontal")?1:0;r[1-o]=i.getLayout("valueAxisStart");var a=new sb({shape:{points:i.getLayout("largePoints")},incremental:!!n,__startPoint:r,__valueIdx:o});e.add(a),Yu(a,t,i)}function Yu(t,e,n){var i=n.getVisual("borderColor")||n.getVisual("color"),r=e.getModel("itemStyle").getItemStyle(["color","borderColor"]);t.useStyle(r),t.style.fill=null,t.style.stroke=i,t.style.lineWidth=n.getLayout("barWidth")}function qu(t,e,n,i){var r=e.getData(),o=this.dataIndex,a=r.getName(o),s=e.get("selectedOffset");i.dispatchAction({type:"pieToggleSelect",from:t,name:a,seriesId:e.id}),r.each(function(t){$u(r.getItemGraphicEl(t),r.getItemLayout(t),e.isSelected(r.getName(t)),s,n)})}function $u(t,e,n,i,r){var o=(e.startAngle+e.endAngle)/2,a=Math.cos(o),s=Math.sin(o),l=n?i:0,u=[a*l,s*l];r?t.animate().when(200,{position:u}).start("bounceOut"):t.attr("position",u)}function Ku(t,e){function n(){o.ignore=o.hoverIgnore,a.ignore=a.hoverIgnore}function i(){o.ignore=o.normalIgnore,a.ignore=a.normalIgnore}Sg.call(this);var r=new zv({z2:2}),o=new Vv,a=new kv;this.add(r),this.add(o),this.add(a),this.updateData(t,e,!0),this.on("emphasis",n).on("normal",i).on("mouseover",n).on("mouseout",i)}function Qu(t,e,n,i,r,o,a){function s(e,n){for(var i=e;i>=0&&(t[i].y-=n,!(i>0&&t[i].y>t[i-1].y+t[i-1].height));i--);}function l(t,e,n,i,r,o){for(var a=e?Number.MAX_VALUE:0,s=0,l=t.length;s<l;s++)if("center"!==t[s].position){var u=Math.abs(t[s].y-i),h=t[s].len,c=t[s].len2,d=u<r+h?Math.sqrt((r+h+c)*(r+h+c)-u*u):Math.abs(t[s].x-n);e&&d>=a&&(d=a-10),!e&&d<=a&&(d=a+10),t[s].x=n+d*o,a=d}}t.sort(function(t,e){return t.y-e.y});for(var u,h=0,c=t.length,d=[],f=[],p=0;p<c;p++)(u=t[p].y-h)<0&&function(e,n,i,r){for(var o=e;o<n;o++)if(t[o].y+=i,o>e&&o+1<n&&t[o+1].y>t[o].y+t[o].height)return void s(o,i/2);s(n-1,i/2)}(p,c,-u),h=t[p].y+t[p].height;a-h<0&&s(c-1,h-a);for(p=0;p<c;p++)t[p].y>=n?f.push(t[p]):d.push(t[p]);l(d,!1,e,n,i,r),l(f,!0,e,n,i,r)}function Ju(t,e,n,i,r,o){for(var a=[],s=[],l=0;l<t.length;l++)t[l].x<e?a.push(t[l]):s.push(t[l]);Qu(s,e,n,i,1,r,o),Qu(a,e,n,i,-1,r,o);for(l=0;l<t.length;l++){var u=t[l].linePoints;if(u){var h=u[1][0]-u[2][0];t[l].x<e?u[2][0]=t[l].x+3:u[2][0]=t[l].x-3,u[1][1]=u[2][1]=t[l].y,u[1][0]=u[2][0]+h}}}function th(){this.group=new Sg}function eh(t,e,n,i){var r=n.type,o=new(0,ty[r.charAt(0).toUpperCase()+r.slice(1)])(n);e.add(o),i.set(t,o),o.__ecGraphicId=t}function nh(t,e){var n=t&&t.parent;n&&("group"===t.type&&t.traverse(function(t){nh(t,e)}),e.removeKey(t.__ecGraphicId),n.remove(t))}function ih(t){return t=o({},t),d(["id","parentId","$action","hv","bounding"].concat(_y),function(e){delete t[e]}),t}function rh(t,e){var n;return d(e,function(e){null!=t[e]&&"auto"!==t[e]&&(n=!0)}),n}function oh(t,e){var n=t.exist;if(e.id=t.keyInfo.id,!e.type&&n&&(e.type=n.type),null==e.parentId){var i=e.parentOption;i?e.parentId=i.id:n&&(e.parentId=n.parentId)}e.parentOption=null}function ah(t,e,n){var r=o({},n),a=t[e],s=n.$action||"merge";"merge"===s?a?(i(a,r,!0),Zr(a,r,{ignoreSize:!0}),Xr(n,a)):t[e]=r:"replace"===s?t[e]=r:"remove"===s&&a&&(t[e]=null)}function sh(t,e){t&&(t.hv=e.hv=[rh(e,["left","right"]),rh(e,["top","bottom"])],"group"===t.type&&(null==t.width&&(t.width=e.width=0),null==t.height&&(t.height=e.height=0)))}function lh(t,e,n,i,r){var a=t.axis;if(!a.scale.isBlank()&&a.containData(e))if(t.involveSeries){var s=uh(e,t),l=s.payloadBatch,u=s.snapToValue;l[0]&&null==r.seriesIndex&&o(r,l[0]),!i&&t.snap&&a.containData(u)&&null!=u&&(e=u),n.showPointer(t,e,l,r),n.showTooltip(t,s,u)}else n.showPointer(t,e)}function uh(t,e){var n=e.axis,i=n.dim,r=t,o=[],a=Number.MAX_VALUE,s=-1;return xb(e.seriesModels,function(e,l){var u,h,c=e.getData().mapDimension(i,!0);if(e.getAxisTooltipData){var d=e.getAxisTooltipData(c,t,n);h=d.dataIndices,u=d.nestestValue}else{if(!(h=e.getData().indicesOfNearest(c[0],t,"category"===n.type?.5:null)).length)return;u=e.getData().get(c[0],h[0])}if(null!=u&&isFinite(u)){var f=t-u,p=Math.abs(f);p<=a&&((p<a||f>=0&&s<0)&&(a=p,s=f,r=u,o.length=0),xb(h,function(t){o.push({seriesIndex:e.seriesIndex,dataIndexInside:t,dataIndex:e.getData().getRawIndex(t)})}))}}),{payloadBatch:o,snapToValue:r}}function hh(t,e,n,i){t[e.key]={value:n,payloadBatch:i}}function ch(t,e,n,i){var r=n.payloadBatch,o=e.axis,a=o.model,s=e.axisPointerModel;if(e.triggerTooltip&&r.length){var l=e.coordSys.model,u=Ru(l),h=t.map[u];h||(h=t.map[u]={coordSysId:l.id,coordSysIndex:l.componentIndex,coordSysType:l.type,coordSysMainType:l.mainType,dataByAxis:[]},t.list.push(h)),h.dataByAxis.push({axisDim:o.dim,axisIndex:a.componentIndex,axisType:a.type,axisId:a.id,value:i,valueLabelOpt:{precision:s.get("label.precision"),formatter:s.get("label.formatter")},seriesDataIndices:r.slice()})}}function dh(t,e,n){var i=n.axesInfo=[];xb(e,function(e,n){var r=e.axisPointerModel.option,o=t[n];o?(!e.useHandle&&(r.status="show"),r.value=o.value,r.seriesDataIndices=(o.payloadBatch||[]).slice()):!e.useHandle&&(r.status="hide"),"show"===r.status&&i.push({axisDim:e.axis.dim,axisIndex:e.axis.model.componentIndex,value:r.value})})}function fh(t,e,n,i){if(!vh(e)&&t.list.length){var r=((t.list[0].dataByAxis[0]||{}).seriesDataIndices||[])[0]||{};i({type:"showTip",escapeConnect:!0,x:e[0],y:e[1],tooltipOption:n.tooltipOption,position:n.position,dataIndexInside:r.dataIndexInside,dataIndex:r.dataIndex,seriesIndex:r.seriesIndex,dataByCoordSys:t.list})}else i({type:"hideTip"})}function ph(t,e,n){var i=n.getZr(),r=wb(i).axisPointerLastHighlights||{},o=wb(i).axisPointerLastHighlights={};xb(t,function(t,e){var n=t.axisPointerModel.option;"show"===n.status&&xb(n.seriesDataIndices,function(t){var e=t.seriesIndex+" | "+t.dataIndex;o[e]=t})});var a=[],s=[];d(r,function(t,e){!o[e]&&s.push(t)}),d(o,function(t,e){!r[e]&&a.push(t)}),s.length&&n.dispatchAction({type:"downplay",escapeConnect:!0,batch:s}),a.length&&n.dispatchAction({type:"highlight",escapeConnect:!0,batch:a})}function gh(t,e){for(var n=0;n<(t||[]).length;n++){var i=t[n];if(e.axis.dim===i.axisDim&&e.axis.model.componentIndex===i.axisIndex)return i}}function mh(t){var e=t.axis.model,n={},i=n.axisDim=t.axis.dim;return n.axisIndex=n[i+"AxisIndex"]=e.componentIndex,n.axisName=n[i+"AxisName"]=e.name,n.axisId=n[i+"AxisId"]=e.id,n}function vh(t){return!t||null==t[0]||isNaN(t[0])||null==t[1]||isNaN(t[1])}function yh(t,e,n){if(!bp.node){var i=e.getZr();bb(i).records||(bb(i).records={}),xh(i,e),(bb(i).records[t]||(bb(i).records[t]={})).handler=n}}function xh(t,e){function n(n,i){t.on(n,function(n){var r=Mh(e);Mb(bb(t).records,function(t){t&&i(t,n,r.dispatchAction)}),_h(r.pendings,e)})}bb(t).initialized||(bb(t).initialized=!0,n("click",v(bh,"click")),n("mousemove",v(bh,"mousemove")),n("globalout",wh))}function _h(t,e){var n,i=t.showTip.length,r=t.hideTip.length;i?n=t.showTip[i-1]:r&&(n=t.hideTip[r-1]),n&&(n.dispatchAction=null,e.dispatchAction(n))}function wh(t,e,n){t.handler("leave",null,n)}function bh(t,e,n,i){e.handler(t,n,i)}function Mh(t){var e={showTip:[],hideTip:[]},n=function(i){var r=e[i.type];r?r.push(i):(i.dispatchAction=n,t.dispatchAction(i))};return{dispatchAction:n,pendings:e}}function Sh(t,e){if(!bp.node){var n=e.getZr();(bb(n).records||{})[t]&&(bb(n).records[t]=null)}}function Ih(){}function Ch(t,e,n,i){Th(Ib(n).lastProp,i)||(Ib(n).lastProp=i,e?ar(n,i,t):(n.stopAnimation(),n.attr(i)))}function Th(t,e){if(w(t)&&w(e)){var n=!0;return d(e,function(e,i){n=n&&Th(t[i],e)}),!!n}return t===e}function Dh(t,e){t[e.get("label.show")?"show":"hide"]()}function Ah(t){return{position:t.position.slice(),rotation:t.rotation||0}}function kh(t,e,n){var i=e.get("z"),r=e.get("zlevel");t&&t.traverse(function(t){"group"!==t.type&&(null!=i&&(t.z=i),null!=r&&(t.zlevel=r),t.silent=n)})}function Ph(t){var e,n=t.get("type"),i=t.getModel(n+"Style");return"line"===n?(e=i.getLineStyle()).fill=null:"shadow"===n&&((e=i.getAreaStyle()).stroke=null),e}function Lh(t,e,n,i,r){var o=zh(n.get("value"),e.axis,e.ecModel,n.get("seriesDataIndices"),{precision:n.get("label.precision"),formatter:n.get("label.formatter")}),a=n.getModel("label"),s=cy(a.get("padding")||0),l=a.getFont(),u=ce(o,l),h=r.position,c=u.width+s[1]+s[3],d=u.height+s[0]+s[2],f=r.align;"right"===f&&(h[0]-=c),"center"===f&&(h[0]-=c/2);var p=r.verticalAlign;"bottom"===p&&(h[1]-=d),"middle"===p&&(h[1]-=d/2),Oh(h,c,d,i);var g=a.get("backgroundColor");g&&"auto"!==g||(g=e.get("axisLine.lineStyle.color")),t.label={shape:{x:0,y:0,width:c,height:d,r:a.get("borderRadius")},position:h.slice(),style:{text:o,textFont:l,textFill:a.getTextColor(),textPosition:"inside",fill:g,stroke:a.get("borderColor")||"transparent",lineWidth:a.get("borderWidth")||0,shadowBlur:a.get("shadowBlur"),shadowColor:a.get("shadowColor"),shadowOffsetX:a.get("shadowOffsetX"),shadowOffsetY:a.get("shadowOffsetY")},z2:10}}function Oh(t,e,n,i){var r=i.getWidth(),o=i.getHeight();t[0]=Math.min(t[0]+e,r)-e,t[1]=Math.min(t[1]+n,o)-n,t[0]=Math.max(t[0],0),t[1]=Math.max(t[1],0)}function zh(t,e,n,i,r){t=e.scale.parse(t);var o=e.scale.getLabel(t,{precision:r.precision}),a=r.formatter;if(a){var s={value:sl(e,t),seriesData:[]};d(i,function(t){var e=n.getSeriesByIndex(t.seriesIndex),i=t.dataIndexInside,r=e&&e.getDataParams(i);r&&s.seriesData.push(r)}),_(a)?o=a.replace("{value}",o):x(a)&&(o=a(s))}return o}function Eh(t,e,n){var i=rt();return ut(i,i,n.rotation),lt(i,i,n.position),ur([t.dataToCoord(e),(n.labelOffset||0)+(n.labelDirection||1)*(n.labelMargin||0)],i)}function Nh(t,e,n,i,r,o){var a=Xw.innerTextLayout(n.rotation,0,n.labelDirection);n.labelMargin=r.get("label.margin"),Lh(e,i,r,o,{position:Eh(i.axis,t,n),align:a.textAlign,verticalAlign:a.textVerticalAlign})}function Rh(t,e,n){return n=n||0,{x1:t[n],y1:t[1-n],x2:e[n],y2:e[1-n]}}function Bh(t,e,n){return n=n||0,{x:t[n],y:t[1-n],width:e[n],height:e[1-n]}}function Vh(t,e){var n={};return n[e.dim+"AxisIndex"]=e.index,t.getCartesian(n)}function Fh(t){return"x"===t.dim?0:1}function Hh(t){var e="left "+t+"s cubic-bezier(0.23, 1, 0.32, 1),top "+t+"s cubic-bezier(0.23, 1, 0.32, 1)";return f(Lb,function(t){return t+"transition:"+e}).join(";")}function Gh(t){var e=[],n=t.get("fontSize"),i=t.getTextColor();return i&&e.push("color:"+i),e.push("font:"+t.getFont()),n&&e.push("line-height:"+Math.round(3*n/2)+"px"),kb(["decoration","align"],function(n){var i=t.get(n);i&&e.push("text-"+n+":"+i)}),e.join(";")}function Wh(t){var e=[],n=t.get("transitionDuration"),i=t.get("backgroundColor"),r=t.getModel("textStyle"),o=t.get("padding");return n&&e.push(Hh(n)),i&&(bp.canvasSupported?e.push("background-Color:"+i):(e.push("background-Color:#"+Dt(i)),e.push("filter:alpha(opacity=70)"))),kb(["width","color","radius"],function(n){var i="border-"+n,r=Pb(i),o=t.get(r);null!=o&&e.push(i+":"+o+("color"===n?"":"px"))}),e.push(Gh(r)),null!=o&&e.push("padding:"+cy(o).join("px ")+"px"),e.join(";")+";"}function Zh(t,e){if(bp.wxa)return null;var n=document.createElement("div"),i=this._zr=e.getZr();this.el=n,this._x=e.getWidth()/2,this._y=e.getHeight()/2,t.appendChild(n),this._container=t,this._show=!1,this._hideTimeout;var r=this;n.onmouseenter=function(){r._enterable&&(clearTimeout(r._hideTimeout),r._show=!0),r._inContent=!0},n.onmousemove=function(e){if(e=e||window.event,!r._enterable){var n=i.handler;rn(t,e,!0),n.dispatch("mousemove",e)}},n.onmouseleave=function(){r._enterable&&r._show&&r.hideLater(r._hideDelay),r._inContent=!1}}function Uh(t){for(var e=t.pop();t.length;){var n=t.pop();n&&(pr.isInstance(n)&&(n=n.get("tooltip",!0)),"string"==typeof n&&(n={formatter:n}),e=new pr(n,e,e.ecModel))}return e}function Xh(t,e){return t.dispatchAction||m(e.dispatchAction,e)}function jh(t,e,n,i,r,o,a){var s=qh(n),l=s.width,u=s.height;return null!=o&&(t+l+o>i?t-=l+o:t+=o),null!=a&&(e+u+a>r?e-=u+a:e+=a),[t,e]}function Yh(t,e,n,i,r){var o=qh(n),a=o.width,s=o.height;return t=Math.min(t+a,i)-a,e=Math.min(e+s,r)-s,t=Math.max(t,0),e=Math.max(e,0),[t,e]}function qh(t){var e=t.clientWidth,n=t.clientHeight;if(document.defaultView&&document.defaultView.getComputedStyle){var i=document.defaultView.getComputedStyle(t);i&&(e+=parseInt(i.paddingLeft,10)+parseInt(i.paddingRight,10)+parseInt(i.borderLeftWidth,10)+parseInt(i.borderRightWidth,10),n+=parseInt(i.paddingTop,10)+parseInt(i.paddingBottom,10)+parseInt(i.borderTopWidth,10)+parseInt(i.borderBottomWidth,10))}return{width:e,height:n}}function $h(t,e,n){var i=n[0],r=n[1],o=0,a=0,s=e.width,l=e.height;switch(t){case"inside":o=e.x+s/2-i/2,a=e.y+l/2-r/2;break;case"top":o=e.x+s/2-i/2,a=e.y-r-5;break;case"bottom":o=e.x+s/2-i/2,a=e.y+l+5;break;case"left":o=e.x-i-5,a=e.y+l/2-r/2;break;case"right":o=e.x+s+5,a=e.y+l/2-r/2}return[o,a]}function Kh(t){return"center"===t||"middle"===t}function Qh(t,e,n){var i,r={},o="toggleSelected"===t;return n.eachComponent("legend",function(n){o&&null!=i?n[i?"select":"unSelect"](e.name):(n[t](e.name),i=n.isSelected(e.name)),d(n.getData(),function(t){var e=t.get("name");if("\n"!==e&&""!==e){var i=n.isSelected(e);r.hasOwnProperty(e)?r[e]=r[e]&&i:r[e]=i}})}),{name:e.name,selected:r}}function Jh(t,e,n){var i=e.getBoxLayoutParams(),r=e.get("padding"),o={width:n.getWidth(),height:n.getHeight()},a=Gr(i,o,r);by(e.get("orient"),t,e.get("itemGap"),a.width,a.height),Wr(t,i,o,r)}function tc(t,e){var n=cy(e.get("padding")),i=e.getItemStyle(["color","opacity"]);return i.fill=e.get("backgroundColor"),t=new Fv({shape:{x:t.x-n[3],y:t.y-n[0],width:t.width+n[1]+n[3],height:t.height+n[0]+n[2],r:e.get("borderRadius")},style:i,silent:!0,z2:-1})}function ec(t,e){e.dispatchAction({type:"legendToggleSelect",name:t})}function nc(t,e,n,i){var r=n.getZr().storage.getDisplayList()[0];r&&r.useHoverLayer||n.dispatchAction({type:"highlight",seriesName:t.name,name:e,excludeSeriesId:i})}function ic(t,e,n,i){var r=n.getZr().storage.getDisplayList()[0];r&&r.useHoverLayer||n.dispatchAction({type:"downplay",seriesName:t.name,name:e,excludeSeriesId:i})}function rc(t,e,n){var i=[1,1];i[t.getOrient().index]=0,Zr(e,n,{type:"box",ignoreSize:i})}function oc(t){_n(t,"label",["show"])}function ac(t){return!(isNaN(parseFloat(t.x))&&isNaN(parseFloat(t.y)))}function sc(t){return!isNaN(parseFloat(t.x))&&!isNaN(parseFloat(t.y))}function lc(t,e,n,i,r,o){var a=[],s=Ps(e,i)?e.getCalculationInfo("stackResultDimension"):i,l=pc(e,s,t),u=e.indicesOfNearest(s,l)[0];a[r]=e.get(n,u),a[o]=e.get(i,u);var h=Mr(e.get(i,u));return(h=Math.min(h,20))>=0&&(a[o]=+a[o].toFixed(h)),a}function uc(t,e){var i=t.getData(),r=t.coordinateSystem;if(e&&!sc(e)&&!y(e.coord)&&r){var o=r.dimensions,a=hc(e,i,r,t);if((e=n(e)).type&&Qb[e.type]&&a.baseAxis&&a.valueAxis){var s=$b(o,a.baseAxis.dim),l=$b(o,a.valueAxis.dim);e.coord=Qb[e.type](i,a.baseDataDim,a.valueDataDim,s,l),e.value=e.coord[l]}else{for(var u=[null!=e.xAxis?e.xAxis:e.radiusAxis,null!=e.yAxis?e.yAxis:e.angleAxis],h=0;h<2;h++)Qb[u[h]]&&(u[h]=pc(i,i.mapDimension(o[h]),u[h]));e.coord=u}}return e}function hc(t,e,n,i){var r={};return null!=t.valueIndex||null!=t.valueDim?(r.valueDataDim=null!=t.valueIndex?e.getDimension(t.valueIndex):t.valueDim,r.valueAxis=n.getAxis(cc(i,r.valueDataDim)),r.baseAxis=n.getOtherAxis(r.valueAxis),r.baseDataDim=e.mapDimension(r.baseAxis.dim)):(r.baseAxis=i.getBaseAxis(),r.valueAxis=n.getOtherAxis(r.baseAxis),r.baseDataDim=e.mapDimension(r.baseAxis.dim),r.valueDataDim=e.mapDimension(r.valueAxis.dim)),r}function cc(t,e){var n=t.getData(),i=n.dimensions;e=n.getDimension(e);for(var r=0;r<i.length;r++){var o=n.getDimensionInfo(i[r]);if(o.name===e)return o.coordDim}}function dc(t,e){return!(t&&t.containData&&e.coord&&!ac(e))||t.containData(e.coord)}function fc(t,e,n,i){return i<2?t.coord&&t.coord[i]:t.value}function pc(t,e,n){if("average"===n){var i=0,r=0;return t.each(e,function(t,e){isNaN(t)||(i+=t,r++)}),i/r}return"median"===n?t.getMedian(e):t.getDataExtent(e,!0)["max"===n?1:0]}function gc(t,e,n){var i=e.coordinateSystem;t.each(function(r){var o,a=t.getItemModel(r),s=_r(a.get("x"),n.getWidth()),l=_r(a.get("y"),n.getHeight());if(isNaN(s)||isNaN(l)){if(e.getMarkerPosition)o=e.getMarkerPosition(t.getValues(t.dimensions,r));else if(i){var u=t.get(i.dimensions[0],r),h=t.get(i.dimensions[1],r);o=i.dataToPoint([u,h])}}else o=[s,l];isNaN(s)||(o[0]=s),isNaN(l)||(o[1]=l),t.setItemLayout(r,o)})}function mc(t,e,n){var i;i=t?f(t&&t.dimensions,function(t){return a({name:t},e.getData().getDimensionInfo(e.getData().mapDimension(t))||{})}):[{name:"value",type:"float"}];var r=new M_(i,n),o=f(n.get("data"),v(uc,e));return t&&(o=g(o,v(dc,t))),r.initData(o,null,t?fc:function(t){return t.value}),r}function vc(t){return isNaN(+t.cpx1)||isNaN(+t.cpy1)}function yc(t){return"_"+t+"Type"}function xc(t,e,n){var i=e.getItemVisual(n,"color"),r=e.getItemVisual(n,t),o=e.getItemVisual(n,t+"Size");if(r&&"none"!==r){y(o)||(o=[o,o]);var a=cl(r,-o[0]/2,-o[1]/2,o[0],o[1],i);return a.name=t,a}}function _c(t){var e=new nM({name:"line"});return wc(e.shape,t),e}function wc(t,e){var n=e[0],i=e[1],r=e[2];t.x1=n[0],t.y1=n[1],t.x2=i[0],t.y2=i[1],t.percent=1,r?(t.cpx1=r[0],t.cpy1=r[1]):(t.cpx1=NaN,t.cpy1=NaN)}function bc(t,e,n){Sg.call(this),this._createLine(t,e,n)}function Mc(t){this._ctor=t||bc,this.group=new Sg}function Sc(t,e,n,i){if(Dc(e.getItemLayout(n))){var r=new t._ctor(e,n,i);e.setItemGraphicEl(n,r),t.group.add(r)}}function Ic(t,e,n,i,r,o){var a=e.getItemGraphicEl(i);Dc(n.getItemLayout(r))?(a?a.updateData(n,r,o):a=new t._ctor(n,r,o),n.setItemGraphicEl(r,a),t.group.add(a)):t.group.remove(a)}function Cc(t){var e=t.hostModel;return{lineStyle:e.getModel("lineStyle").getLineStyle(),hoverLineStyle:e.getModel("emphasis.lineStyle").getLineStyle(),labelModel:e.getModel("label"),hoverLabelModel:e.getModel("emphasis.label")}}function Tc(t){return isNaN(t[0])||isNaN(t[1])}function Dc(t){return!Tc(t[0])&&!Tc(t[1])}function Ac(t){return!isNaN(t)&&!isFinite(t)}function kc(t,e,n,i){var r=1-t,o=i.dimensions[t];return Ac(e[r])&&Ac(n[r])&&e[t]===n[t]&&i.getAxis(o).containData(e[t])}function Pc(t,e){if("cartesian2d"===t.type){var n=e[0].coord,i=e[1].coord;if(n&&i&&(kc(1,n,i,t)||kc(0,n,i,t)))return!0}return dc(t,e[0])&&dc(t,e[1])}function Lc(t,e,n,i,r){var o,a=i.coordinateSystem,s=t.getItemModel(e),l=_r(s.get("x"),r.getWidth()),u=_r(s.get("y"),r.getHeight());if(isNaN(l)||isNaN(u)){if(i.getMarkerPosition)o=i.getMarkerPosition(t.getValues(t.dimensions,e));else{var h=a.dimensions,c=t.get(h[0],e),d=t.get(h[1],e);o=a.dataToPoint([c,d])}if("cartesian2d"===a.type){var f=a.getAxis("x"),p=a.getAxis("y"),h=a.dimensions;Ac(t.get(h[0],e))?o[0]=f.toGlobalCoord(f.getExtent()[n?0:1]):Ac(t.get(h[1],e))&&(o[1]=p.toGlobalCoord(p.getExtent()[n?0:1]))}isNaN(l)||(o[0]=l),isNaN(u)||(o[1]=u)}else o=[l,u];t.setItemLayout(e,o)}function Oc(t,e,n){var i;i=t?f(t&&t.dimensions,function(t){return a({name:t},e.getData().getDimensionInfo(e.getData().mapDimension(t))||{})}):[{name:"value",type:"float"}];var r=new M_(i,n),o=new M_(i,n),s=new M_([],n),l=f(n.get("data"),v(aM,e,t,n));t&&(l=g(l,v(Pc,t)));var u=t?fc:function(t){return t.value};return r.initData(f(l,function(t){return t[0]}),null,u),o.initData(f(l,function(t){return t[1]}),null,u),s.initData(f(l,function(t){return t[2]})),s.hasItemOption=!0,{from:r,to:o,line:s}}function zc(t){return!isNaN(t)&&!isFinite(t)}function Ec(t,e,n,i){var r=1-t;return zc(e[r])&&zc(n[r])}function Nc(t,e){var n=e.coord[0],i=e.coord[1];return!("cartesian2d"!==t.type||!n||!i||!Ec(1,n,i,t)&&!Ec(0,n,i,t))||(dc(t,{coord:n,x:e.x0,y:e.y0})||dc(t,{coord:i,x:e.x1,y:e.y1}))}function Rc(t,e,n,i,r){var o,a=i.coordinateSystem,s=t.getItemModel(e),l=_r(s.get(n[0]),r.getWidth()),u=_r(s.get(n[1]),r.getHeight());if(isNaN(l)||isNaN(u)){if(i.getMarkerPosition)o=i.getMarkerPosition(t.getValues(n,e));else{var h=[f=t.get(n[0],e),p=t.get(n[1],e)];a.clampData&&a.clampData(h,h),o=a.dataToPoint(h,!0)}if("cartesian2d"===a.type){var c=a.getAxis("x"),d=a.getAxis("y"),f=t.get(n[0],e),p=t.get(n[1],e);zc(f)?o[0]=c.toGlobalCoord(c.getExtent()["x0"===n[0]?0:1]):zc(p)&&(o[1]=d.toGlobalCoord(d.getExtent()["y0"===n[1]?0:1]))}isNaN(l)||(o[0]=l),isNaN(u)||(o[1]=u)}else o=[l,u];return o}function Bc(t,e,n){var i,r,o=["x0","y0","x1","y1"];t?(i=f(t&&t.dimensions,function(t){var n=e.getData();return a({name:t},n.getDimensionInfo(n.mapDimension(t))||{})}),r=new M_(f(o,function(t,e){return{name:t,type:i[e%2].type}}),n)):r=new M_(i=[{name:"value",type:"float"}],n);var s=f(n.get("data"),v(sM,e,t,n));t&&(s=g(s,v(Nc,t)));var l=t?function(t,e,n,i){return t.coord[Math.floor(i/2)][i%2]}:function(t){return t.value};return r.initData(s,null,l),r.hasItemOption=!0,r}function Vc(t){return l(uM,t)>=0}function Fc(t,e,n){function i(t,e){return l(e.nodes,t)>=0}function r(t,i){var r=!1;return e(function(e){d(n(t,e)||[],function(t){i.records[e.name][t]&&(r=!0)})}),r}function o(t,i){i.nodes.push(t),e(function(e){d(n(t,e)||[],function(t){i.records[e.name][t]=!0})})}return function(n){var a={nodes:[],records:{}};if(e(function(t){a.records[t.name]={}}),!n)return a;o(n,a);var s;do{s=!1,t(function(t){!i(t,a)&&r(t,a)&&(o(t,a),s=!0)})}while(s);return a}}function Hc(t,e,n){var i=[1/0,-1/0];return cM(n,function(t){var n=t.getData();n&&cM(n.mapDimension(e,!0),function(t){var e=n.getApproximateExtent(t);e[0]<i[0]&&(i[0]=e[0]),e[1]>i[1]&&(i[1]=e[1])})}),i[1]<i[0]&&(i=[NaN,NaN]),Gc(t,i),i}function Gc(t,e){var n=t.getAxisModel(),i=n.getMin(!0),r="category"===n.get("type"),o=r&&n.getCategories().length;null!=i&&"dataMin"!==i&&"function"!=typeof i?e[0]=i:r&&(e[0]=o>0?0:NaN);var a=n.getMax(!0);return null!=a&&"dataMax"!==a&&"function"!=typeof a?e[1]=a:r&&(e[1]=o>0?o-1:NaN),n.get("scale",!0)||(e[0]>0&&(e[0]=0),e[1]<0&&(e[1]=0)),e}function Wc(t,e){var n=t.getAxisModel(),i=t._percentWindow,r=t._valueWindow;if(i){var o=Ir(r,[0,500]);o=Math.min(o,20);var a=e||0===i[0]&&100===i[1];n.setRange(a?null:+r[0].toFixed(o),a?null:+r[1].toFixed(o))}}function Zc(t){var e=t._minMaxSpan={},n=t._dataZoomModel;cM(["min","max"],function(i){e[i+"Span"]=n.get(i+"Span");var r=n.get(i+"ValueSpan");if(null!=r&&(e[i+"ValueSpan"]=r,null!=(r=t.getAxisModel().axis.scale.parse(r)))){var o=t._dataExtent;e[i+"Span"]=xr(o[0]+r,o,[0,100],!0)}})}function Uc(t){var e={};return pM(["start","end","startValue","endValue","throttle"],function(n){t.hasOwnProperty(n)&&(e[n]=t[n])}),e}function Xc(t,e){var n=t._rangePropMode,i=t.get("rangeMode");pM([["start","startValue"],["end","endValue"]],function(t,r){var o=null!=e[t[0]],a=null!=e[t[1]];o&&!a?n[r]="percent":!o&&a?n[r]="value":i?n[r]=i[r]:o&&(n[r]="percent")})}function jc(t,e){var n=t[e]-t[1-e];return{span:Math.abs(n),sign:n>0?-1:n<0?1:e?-1:1}}function Yc(t,e){return Math.min(e[1],Math.max(e[0],t))}function qc(t){return{x:"y",y:"x",radius:"angle",angle:"radius"}[t]}function $c(t){return"vertical"===t?"ns-resize":"ew-resize"}function Kc(t,e,n){td(t)[e]=n}function Qc(t,e,n){var i=td(t);i[e]===n&&(i[e]=null)}function Jc(t,e){return!!td(t)[e]}function td(t){return t[DM]||(t[DM]={})}function ed(t){this.pointerChecker,this._zr=t,this._opt={};var e=m,i=e(nd,this),r=e(id,this),o=e(rd,this),s=e(od,this),l=e(ad,this);Zp.call(this),this.setPointerChecker=function(t){this.pointerChecker=t},this.enable=function(e,u){this.disable(),this._opt=a(n(u)||{},{zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}),null==e&&(e=!0),!0!==e&&"move"!==e&&"pan"!==e||(t.on("mousedown",i),t.on("mousemove",r),t.on("mouseup",o)),!0!==e&&"scale"!==e&&"zoom"!==e||(t.on("mousewheel",s),t.on("pinch",l))},this.disable=function(){t.off("mousedown",i),t.off("mousemove",r),t.off("mouseup",o),t.off("mousewheel",s),t.off("pinch",l)},this.dispose=this.disable,this.isDragging=function(){return this._dragging},this.isPinching=function(){return this._pinching}}function nd(t){if(!(sn(t)||t.target&&t.target.draggable)){var e=t.offsetX,n=t.offsetY;this.pointerChecker&&this.pointerChecker(t,e,n)&&(this._x=e,this._y=n,this._dragging=!0)}}function id(t){if(!sn(t)&&ld(this,"moveOnMouseMove",t)&&this._dragging&&"pinch"!==t.gestureEvent&&!Jc(this._zr,"globalPan")){var e=t.offsetX,n=t.offsetY,i=this._x,r=this._y,o=e-i,a=n-r;this._x=e,this._y=n,this._opt.preventDefaultMouseMove&&tm(t.event),this.trigger("pan",o,a,i,r,e,n)}}function rd(t){sn(t)||(this._dragging=!1)}function od(t){if(ld(this,"zoomOnMouseWheel",t)&&0!==t.wheelDelta){var e=t.wheelDelta>0?1.1:1/1.1;sd.call(this,t,e,t.offsetX,t.offsetY)}}function ad(t){if(!Jc(this._zr,"globalPan")){var e=t.pinchScale>1?1.1:1/1.1;sd.call(this,t,e,t.pinchX,t.pinchY)}}function sd(t,e,n,i){this.pointerChecker&&this.pointerChecker(t,n,i)&&(tm(t.event),this.trigger("zoom",e,n,i))}function ld(t,e,n){var i=t._opt[e];return i&&(!_(i)||n.event[i+"Key"])}function ud(t,e){var n=dd(t),i=e.dataZoomId,r=e.coordId;d(n,function(t,n){var o=t.dataZoomInfos;o[i]&&l(e.allCoordIds,r)<0&&(delete o[i],t.count--)}),pd(n);var o=n[r];o||((o=n[r]={coordId:r,dataZoomInfos:{},count:0}).controller=fd(t,o),o.dispatchAction=v(yd,t)),!o.dataZoomInfos[i]&&o.count++,o.dataZoomInfos[i]=e;var a=xd(o.dataZoomInfos);o.controller.enable(a.controlType,a.opt),o.controller.setPointerChecker(e.containsPoint),ha(o,"dispatchAction",e.throttleRate,"fixRate")}function hd(t,e){var n=dd(t);d(n,function(t){t.controller.dispose();var n=t.dataZoomInfos;n[e]&&(delete n[e],t.count--)}),pd(n)}function cd(t){return t.type+"\0_"+t.id}function dd(t){var e=t.getZr();return e[kM]||(e[kM]={})}function fd(t,e){var n=new ed(t.getZr());return n.on("pan",AM(gd,e)),n.on("zoom",AM(md,e)),n}function pd(t){d(t,function(e,n){e.count||(e.controller.dispose(),delete t[n])})}function gd(t,e,n,i,r,o,a){vd(t,function(s){return s.panGetRange(t.controller,e,n,i,r,o,a)})}function md(t,e,n,i){vd(t,function(r){return r.zoomGetRange(t.controller,e,n,i)})}function vd(t,e){var n=[];d(t.dataZoomInfos,function(t){var i=e(t);!t.disabled&&i&&n.push({dataZoomId:t.dataZoomId,start:i[0],end:i[1]})}),n.length&&t.dispatchAction(n)}function yd(t,e){t.dispatchAction({type:"dataZoom",batch:e})}function xd(t){var e,n={},i={type_true:2,type_move:1,type_false:0,type_undefined:-1};return d(t,function(t){var r=!t.disabled&&(!t.zoomLock||"move");i["type_"+r]>i["type_"+e]&&(e=r),o(n,t.roamControllerOpt)}),{controlType:e,opt:n}}function _d(t,e){zM[t]=e}function wd(t){return zM[t]}function bd(t){return 0===t.indexOf("my")}function Md(t){this.model=t}function Sd(t){this.model=t}function Id(t){var e={},n=[],i=[];return t.eachRawSeries(function(t){var r=t.coordinateSystem;if(!r||"cartesian2d"!==r.type&&"polar"!==r.type)n.push(t);else{var o=r.getBaseAxis();if("category"===o.type){var a=o.dim+"_"+o.index;e[a]||(e[a]={categoryAxis:o,valueAxis:r.getOtherAxis(o),series:[]},i.push({axisDim:o.dim,axisIndex:o.index})),e[a].series.push(t)}else n.push(t)}}),{seriesGroupByCategoryAxis:e,other:n,meta:i}}function Cd(t){var e=[];return d(t,function(t,n){var i=t.categoryAxis,r=t.valueAxis.dim,o=[" "].concat(f(t.series,function(t){return t.name})),a=[i.model.getCategories()];d(t.series,function(t){a.push(t.getRawData().mapArray(r,function(t){return t}))});for(var s=[o.join(WM)],l=0;l<a[0].length;l++){for(var u=[],h=0;h<a.length;h++)u.push(a[h][l]);s.push(u.join(WM))}e.push(s.join("\n"))}),e.join("\n\n"+GM+"\n\n")}function Td(t){return f(t,function(t){var e=t.getRawData(),n=[t.name],i=[];return e.each(e.dimensions,function(){for(var t=arguments.length,r=arguments[t-1],o=e.getName(r),a=0;a<t-1;a++)i[a]=arguments[a];n.push((o?o+WM:"")+i.join(WM))}),n.join("\n")}).join("\n\n"+GM+"\n\n")}function Dd(t){var e=Id(t);return{value:g([Cd(e.seriesGroupByCategoryAxis),Td(e.other)],function(t){return t.replace(/[\n\t\s]/g,"")}).join("\n\n"+GM+"\n\n"),meta:e.meta}}function Ad(t){return t.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function kd(t){if(t.slice(0,t.indexOf("\n")).indexOf(WM)>=0)return!0}function Pd(t){for(var e=t.split(/\n+/g),n=[],i=f(Ad(e.shift()).split(ZM),function(t){return{name:t,data:[]}}),r=0;r<e.length;r++){var o=Ad(e[r]).split(ZM);n.push(o.shift());for(var a=0;a<o.length;a++)i[a]&&(i[a].data[r]=o[a])}return{series:i,categories:n}}function Ld(t){for(var e=t.split(/\n+/g),n=Ad(e.shift()),i=[],r=0;r<e.length;r++){var o,a=Ad(e[r]).split(ZM),s="",l=!1;isNaN(a[0])?(l=!0,s=a[0],a=a.slice(1),i[r]={name:s,value:[]},o=i[r].value):o=i[r]=[];for(var u=0;u<a.length;u++)o.push(+a[u]);1===o.length&&(l?i[r].value=o[0]:i[r]=o[0])}return{name:n,data:i}}function Od(t,e){var n={series:[]};return d(t.split(new RegExp("\n*"+GM+"\n*","g")),function(t,i){if(kd(t)){var r=Pd(t),o=e[i],a=o.axisDim+"Axis";o&&(n[a]=n[a]||[],n[a][o.axisIndex]={data:r.categories},n.series=n.series.concat(r.series))}else{r=Ld(t);n.series.push(r)}}),n}function zd(t){this._dom=null,this.model=t}function Ed(t,e){return f(t,function(t,n){var i=e&&e[n];return w(i)&&!y(i)?(w(t)&&!y(t)&&(t=t.value),a({value:t},i)):t})}function Nd(t){Zp.call(this),this._zr=t,this.group=new Sg,this._brushType,this._brushOption,this._panels,this._track=[],this._dragging,this._covers=[],this._creatingCover,this._creatingPanel,this._enableGlobalPan,this._uid="brushController_"+rS++,this._handlers={},XM(oS,function(t,e){this._handlers[e]=m(t,this)},this)}function Rd(t,e){var r=t._zr;t._enableGlobalPan||Kc(r,tS,t._uid),XM(t._handlers,function(t,e){r.on(e,t)}),t._brushType=e.brushType,t._brushOption=i(n(iS),e,!0)}function Bd(t){var e=t._zr;Qc(e,tS,t._uid),XM(t._handlers,function(t,n){e.off(n,t)}),t._brushType=t._brushOption=null}function Vd(t,e){var n=aS[e.brushType].createCover(t,e);return n.__brushOption=e,Gd(n,e),t.group.add(n),n}function Fd(t,e){var n=Zd(e);return n.endCreating&&(n.endCreating(t,e),Gd(e,e.__brushOption)),e}function Hd(t,e){var n=e.__brushOption;Zd(e).updateCoverShape(t,e,n.range,n)}function Gd(t,e){var n=e.z;null==n&&(n=KM),t.traverse(function(t){t.z=n,t.z2=n})}function Wd(t,e){Zd(e).updateCommon(t,e),Hd(t,e)}function Zd(t){return aS[t.__brushOption.brushType]}function Ud(t,e,n){var i=t._panels;if(!i)return!0;var r,o=t._transform;return XM(i,function(t){t.isTargetByCursor(e,n,o)&&(r=t)}),r}function Xd(t,e){var n=t._panels;if(!n)return!0;var i=e.__brushOption.panelId;return null==i||n[i]}function jd(t){var e=t._covers,n=e.length;return XM(e,function(e){t.group.remove(e)},t),e.length=0,!!n}function Yd(t,e){var i=jM(t._covers,function(t){var e=t.__brushOption,i=n(e.range);return{brushType:e.brushType,panelId:e.panelId,range:i}});t.trigger("brush",i,{isEnd:!!e.isEnd,removeOnClick:!!e.removeOnClick})}function qd(t){var e=t._track;if(!e.length)return!1;var n=e[e.length-1],i=e[0],r=n[0]-i[0],o=n[1]-i[1];return $M(r*r+o*o,.5)>QM}function $d(t){var e=t.length-1;return e<0&&(e=0),[t[0],t[e]]}function Kd(t,e,n,i){var r=new Sg;return r.add(new Fv({name:"main",style:ef(n),silent:!0,draggable:!0,cursor:"move",drift:UM(t,e,r,"nswe"),ondragend:UM(Yd,e,{isEnd:!0})})),XM(i,function(n){r.add(new Fv({name:n,style:{opacity:0},draggable:!0,silent:!0,invisible:!0,drift:UM(t,e,r,n),ondragend:UM(Yd,e,{isEnd:!0})}))}),r}function Qd(t,e,n,i){var r=i.brushStyle.lineWidth||0,o=qM(r,JM),a=n[0][0],s=n[1][0],l=a-r/2,u=s-r/2,h=n[0][1],c=n[1][1],d=h-o+r/2,f=c-o+r/2,p=h-a,g=c-s,m=p+r,v=g+r;tf(t,e,"main",a,s,p,g),i.transformable&&(tf(t,e,"w",l,u,o,v),tf(t,e,"e",d,u,o,v),tf(t,e,"n",l,u,m,o),tf(t,e,"s",l,f,m,o),tf(t,e,"nw",l,u,o,o),tf(t,e,"ne",d,u,o,o),tf(t,e,"sw",l,f,o,o),tf(t,e,"se",d,f,o,o))}function Jd(t,e){var n=e.__brushOption,i=n.transformable,r=e.childAt(0);r.useStyle(ef(n)),r.attr({silent:!i,cursor:i?"move":"default"}),XM(["w","e","n","s","se","sw","ne","nw"],function(n){var r=e.childOfName(n),o=of(t,n);r&&r.attr({silent:!i,invisible:!i,cursor:i?nS[o]+"-resize":null})})}function tf(t,e,n,i,r,o,a){var s=e.childOfName(n);s&&s.setShape(hf(uf(t,e,[[i,r],[i+o,r+a]])))}function ef(t){return a({strokeNoScale:!0},t.brushStyle)}function nf(t,e,n,i){var r=[YM(t,n),YM(e,i)],o=[qM(t,n),qM(e,i)];return[[r[0],o[0]],[r[1],o[1]]]}function rf(t){return lr(t.group)}function of(t,e){if(e.length>1)return("e"===(i=[of(t,(e=e.split(""))[0]),of(t,e[1])])[0]||"w"===i[0])&&i.reverse(),i.join("");var n={left:"w",right:"e",top:"n",bottom:"s"},i=hr({w:"left",e:"right",n:"top",s:"bottom"}[e],rf(t));return n[i]}function af(t,e,n,i,r,o,a,s){var l=i.__brushOption,u=t(l.range),h=lf(n,o,a);XM(r.split(""),function(t){var e=eS[t];u[e[0]][e[1]]+=h[e[0]]}),l.range=e(nf(u[0][0],u[1][0],u[0][1],u[1][1])),Wd(n,i),Yd(n,{isEnd:!1})}function sf(t,e,n,i,r){var o=e.__brushOption.range,a=lf(t,n,i);XM(o,function(t){t[0]+=a[0],t[1]+=a[1]}),Wd(t,e),Yd(t,{isEnd:!1})}function lf(t,e,n){var i=t.group,r=i.transformCoordToLocal(e,n),o=i.transformCoordToLocal(0,0);return[r[0]-o[0],r[1]-o[1]]}function uf(t,e,i){var r=Xd(t,e);return r&&!0!==r?r.clipPath(i,t._transform):n(i)}function hf(t){var e=YM(t[0][0],t[1][0]),n=YM(t[0][1],t[1][1]);return{x:e,y:n,width:qM(t[0][0],t[1][0])-e,height:qM(t[0][1],t[1][1])-n}}function cf(t,e,n){if(t._brushType){var i=t._zr,r=t._covers,o=Ud(t,e,n);if(!t._dragging)for(var a=0;a<r.length;a++){var s=r[a].__brushOption;if(o&&(!0===o||s.panelId===o.panelId)&&aS[s.brushType].contain(r[a],n[0],n[1]))return}o&&i.setCursorStyle("crosshair")}}function df(t){var e=t.event;e.preventDefault&&e.preventDefault()}function ff(t,e,n){return t.childOfName("main").contain(e,n)}function pf(t,e,i,r){var o,a=t._creatingCover,s=t._creatingPanel,l=t._brushOption;if(t._track.push(i.slice()),qd(t)||a){if(s&&!a){"single"===l.brushMode&&jd(t);var u=n(l);u.brushType=gf(u.brushType,s),u.panelId=!0===s?null:s.panelId,a=t._creatingCover=Vd(t,u),t._covers.push(a)}if(a){var h=aS[gf(t._brushType,s)];a.__brushOption.range=h.getCreatingRange(uf(t,a,t._track)),r&&(Fd(t,a),h.updateCommon(t,a)),Hd(t,a),o={isEnd:r}}}else r&&"single"===l.brushMode&&l.removeOnClick&&Ud(t,e,i)&&jd(t)&&(o={isEnd:r,removeOnClick:!0});return o}function gf(t,e){return"auto"===t?e.defaultBrushType:t}function mf(t){if(this._dragging){df(t);var e=pf(this,t,this.group.transformCoordToLocal(t.offsetX,t.offsetY),!0);this._dragging=!1,this._track=[],this._creatingCover=null,e&&Yd(this,e)}}function vf(t){return{createCover:function(e,n){return Kd(UM(af,function(e){var n=[e,[0,100]];return t&&n.reverse(),n},function(e){return e[t]}),e,n,[["w","e"],["n","s"]][t])},getCreatingRange:function(e){var n=$d(e);return[YM(n[0][t],n[1][t]),qM(n[0][t],n[1][t])]},updateCoverShape:function(e,n,i,r){var o,a=Xd(e,n);if(!0!==a&&a.getLinearBrushOtherExtent)o=a.getLinearBrushOtherExtent(t,e._transform);else{var s=e._zr;o=[0,[s.getWidth(),s.getHeight()][1-t]]}var l=[i,o];t&&l.reverse(),Qd(e,n,l,r)},updateCommon:Jd,contain:ff}}function yf(t,e,n){var i=e.getComponentByElement(t.topTarget),r=i&&i.coordinateSystem;return i&&i!==n&&!sS[i.mainType]&&r&&r.model!==n}function xf(t){return t=bf(t),function(e,n){return dr(e,t)}}function _f(t,e){return t=bf(t),function(n){var i=null!=e?e:n,r=i?t.width:t.height,o=i?t.x:t.y;return[o,o+(r||0)]}}function wf(t,e,n){return t=bf(t),function(i,r,o){return t.contain(r[0],r[1])&&!yf(i,e,n)}}function bf(t){return Xt.create(t)}function Mf(t,e,n){var i=this._targetInfoList=[],r={},o=If(e,t);lS(pS,function(t,e){(!n||!n.include||uS(n.include,e)>=0)&&t(o,i,r)})}function Sf(t){return t[0]>t[1]&&t.reverse(),t}function If(t,e){return An(t,e,{includeMainTypes:dS})}function Cf(t,e,n,i){var r=n.getAxis(["x","y"][t]),o=Sf(f([0,1],function(t){return e?r.coordToData(r.toLocalCoord(i[t])):r.toGlobalCoord(r.dataToCoord(i[t]))})),a=[];return a[t]=o,a[1-t]=[NaN,NaN],{values:o,xyMinMax:a}}function Tf(t,e,n,i){return[e[0]-i[t]*n[0],e[1]-i[t]*n[1]]}function Df(t,e){var n=Af(t),i=Af(e),r=[n[0]/i[0],n[1]/i[1]];return isNaN(r[0])&&(r[0]=1),isNaN(r[1])&&(r[1]=1),r}function Af(t){return t?[t[0][1]-t[0][0],t[1][1]-t[1][0]]:[NaN,NaN]}function kf(t,e){var n=zf(t);xS(e,function(e,i){for(var r=n.length-1;r>=0&&!n[r][i];r--);if(r<0){var o=t.queryComponents({mainType:"dataZoom",subType:"select",id:i})[0];if(o){var a=o.getPercentRange();n[0][i]={dataZoomId:i,start:a[0],end:a[1]}}}}),n.push(e)}function Pf(t){var e=zf(t),n=e[e.length-1];e.length>1&&e.pop();var i={};return xS(n,function(t,n){for(var r=e.length-1;r>=0;r--)if(t=e[r][n]){i[n]=t;break}}),i}function Lf(t){t[_S]=null}function Of(t){return zf(t).length}function zf(t){var e=t[_S];return e||(e=t[_S]=[{}]),e}function Ef(t,e,n){(this._brushController=new Nd(n.getZr())).on("brush",m(this._onBrush,this)).mount(),this._isZoomActive}function Nf(t){var e={};return d(["xAxisIndex","yAxisIndex"],function(n){e[n]=t[n],null==e[n]&&(e[n]="all"),(!1===e[n]||"none"===e[n])&&(e[n]=[])}),e}function Rf(t,e){t.setIconStatus("back",Of(e)>1?"emphasis":"normal")}function Bf(t,e,n,i,r){var o=n._isZoomActive;i&&"takeGlobalCursor"===i.type&&(o="dataZoomSelect"===i.key&&i.dataZoomSelectActive),n._isZoomActive=o,t.setIconStatus("zoom",o?"emphasis":"normal");var a=new Mf(Nf(t.option),e,{include:["grid"]});n._brushController.setPanels(a.makePanelOpts(r,function(t){return t.xAxisDeclared&&!t.yAxisDeclared?"lineX":!t.xAxisDeclared&&t.yAxisDeclared?"lineY":"rect"})).enableBrush(!!o&&{brushType:"auto",brushStyle:{lineWidth:0,fill:"rgba(0,0,0,0.2)"}})}function Vf(t){this.model=t}function Ff(t){return TS(t)}function Hf(){if(!kS&&PS){kS=!0;var t=PS.styleSheets;t.length<31?PS.createStyleSheet().addRule(".zrvml","behavior:url(#default#VML)"):t[0].addRule(".zrvml","behavior:url(#default#VML)")}}function Gf(t){return parseInt(t,10)}function Wf(t,e){Hf(),this.root=t,this.storage=e;var n=document.createElement("div"),i=document.createElement("div");n.style.cssText="display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;",i.style.cssText="position:absolute;left:0;top:0;",t.appendChild(n),this._vmlRoot=i,this._vmlViewport=n,this.resize();var r=e.delFromStorage,o=e.addToStorage;e.delFromStorage=function(t){r.call(e,t),t&&t.onRemove&&t.onRemove(i)},e.addToStorage=function(t){t.onAdd&&t.onAdd(i),o.call(e,t)},this._firstPaint=!0}function Zf(t){return function(){yg('In IE8.0 VML mode painter not support method "'+t+'"')}}function Uf(t){return document.createElementNS(cI,t)}function Xf(t){return gI(1e4*t)/1e4}function jf(t){return t<wI&&t>-wI}function Yf(t,e){var n=e?t.textFill:t.fill;return null!=n&&n!==pI}function qf(t,e){var n=e?t.textStroke:t.stroke;return null!=n&&n!==pI}function $f(t,e){e&&Kf(t,"transform","matrix("+fI.call(e,",")+")")}function Kf(t,e,n){(!n||"linear"!==n.type&&"radial"!==n.type)&&("string"==typeof n&&n.indexOf("NaN")>-1&&console.log(n),t.setAttribute(e,n))}function Qf(t,e,n){t.setAttributeNS("http://www.w3.org/1999/xlink",e,n)}function Jf(t,e,n){if(Yf(e,n)){var i=n?e.textFill:e.fill;i="transparent"===i?pI:i,"none"!==t.getAttribute("clip-path")&&i===pI&&(i="rgba(0, 0, 0, 0.002)"),Kf(t,"fill",i),Kf(t,"fill-opacity",e.opacity)}else Kf(t,"fill",pI);if(qf(e,n)){var r=n?e.textStroke:e.stroke;Kf(t,"stroke",r="transparent"===r?pI:r),Kf(t,"stroke-width",(n?e.textStrokeWidth:e.lineWidth)/(!n&&e.strokeNoScale?e.host.getLineScale():1)),Kf(t,"paint-order",n?"stroke":"fill"),Kf(t,"stroke-opacity",e.opacity),e.lineDash?(Kf(t,"stroke-dasharray",e.lineDash.join(",")),Kf(t,"stroke-dashoffset",gI(e.lineDashOffset||0))):Kf(t,"stroke-dasharray",""),e.lineCap&&Kf(t,"stroke-linecap",e.lineCap),e.lineJoin&&Kf(t,"stroke-linejoin",e.lineJoin),e.miterLimit&&Kf(t,"stroke-miterlimit",e.miterLimit)}else Kf(t,"stroke",pI)}function tp(t){for(var e=[],n=t.data,i=t.len(),r=0;r<i;){var o="",a=0;switch(n[r++]){case dI.M:o="M",a=2;break;case dI.L:o="L",a=2;break;case dI.Q:o="Q",a=4;break;case dI.C:o="C",a=6;break;case dI.A:var s=n[r++],l=n[r++],u=n[r++],h=n[r++],c=n[r++],d=n[r++],f=n[r++],p=n[r++],g=Math.abs(d),m=jf(g-xI)&&!jf(g),v=!1;v=g>=xI||!jf(g)&&(d>-yI&&d<0||d>yI)==!!p;var y=Xf(s+u*vI(c)),x=Xf(l+h*mI(c));m&&(d=p?xI-1e-4:1e-4-xI,v=!0,9===r&&e.push("M",y,x));var _=Xf(s+u*vI(c+d)),w=Xf(l+h*mI(c+d));e.push("A",Xf(u),Xf(h),gI(f*_I),+v,+p,_,w);break;case dI.Z:o="Z";break;case dI.R:var _=Xf(n[r++]),w=Xf(n[r++]),b=Xf(n[r++]),M=Xf(n[r++]);e.push("M",_,w,"L",_+b,w,"L",_+b,w+M,"L",_,w+M,"L",_,w)}o&&e.push(o);for(var S=0;S<a;S++)e.push(Xf(n[r++]))}return e.join(" ")}function ep(t){return"middle"===t?"middle":"bottom"===t?"baseline":"hanging"}function np(){}function ip(t,e,n,i){for(var r=0,o=e.length,a=0,s=0;r<o;r++){var l=e[r];if(l.removed){for(var u=[],h=s;h<s+l.count;h++)u.push(h);l.indices=u,s+=l.count}else{for(var u=[],h=a;h<a+l.count;h++)u.push(h);l.indices=u,a+=l.count,l.added||(s+=l.count)}}return e}function rp(t){return{newPos:t.newPos,components:t.components.slice(0)}}function op(t,e,n,i,r){this._zrId=t,this._svgRoot=e,this._tagNames="string"==typeof n?[n]:n,this._markLabel=i,this._domName=r||"_dom",this.nextId=0}function ap(t,e){op.call(this,t,e,["linearGradient","radialGradient"],"__gradient_in_use__")}function sp(t,e){op.call(this,t,e,"clipPath","__clippath_in_use__")}function lp(t,e){op.call(this,t,e,["filter"],"__filter_in_use__","_shadowDom")}function up(t){return t&&(t.shadowBlur||t.shadowOffsetX||t.shadowOffsetY||t.textShadowBlur||t.textShadowOffsetX||t.textShadowOffsetY)}function hp(t){return parseInt(t,10)}function cp(t){return t instanceof xi?bI:t instanceof je?MI:t instanceof kv?SI:bI}function dp(t,e){return e&&t&&e.parentNode!==t}function fp(t,e,n){if(dp(t,e)&&n){var i=n.nextSibling;i?t.insertBefore(e,i):t.appendChild(e)}}function pp(t,e){if(dp(t,e)){var n=t.firstChild;n?t.insertBefore(e,n):t.appendChild(e)}}function gp(t,e){e&&t&&e.parentNode===t&&t.removeChild(e)}function mp(t){return t.__textSvgEl}function vp(t){return t.__svgEl}function yp(t){return function(){yg('In SVG mode painter not support method "'+t+'"')}}var xp=2311,_p=function(){return xp++},wp={},bp=wp="object"==typeof wx&&"function"==typeof wx.getSystemInfoSync?{browser:{},os:{},node:!1,wxa:!0,canvasSupported:!0,svgSupported:!1,touchEventsSupported:!0}:"undefined"==typeof document&&"undefined"!=typeof self?{browser:{},os:{},node:!1,worker:!0,canvasSupported:!0}:"undefined"==typeof navigator?{browser:{},os:{},node:!0,worker:!1,canvasSupported:!0,svgSupported:!0}:function(t){var e={},n={},i=t.match(/Firefox\/([\d.]+)/),r=t.match(/MSIE\s([\d.]+)/)||t.match(/Trident\/.+?rv:(([\d.]+))/),o=t.match(/Edge\/([\d.]+)/),a=/micromessenger/i.test(t);return i&&(n.firefox=!0,n.version=i[1]),r&&(n.ie=!0,n.version=r[1]),o&&(n.edge=!0,n.version=o[1]),a&&(n.weChat=!0),{browser:n,os:e,node:!1,canvasSupported:!!document.createElement("canvas").getContext,svgSupported:"undefined"!=typeof SVGRect,touchEventsSupported:"ontouchstart"in window&&!n.ie&&!n.edge,pointerEventsSupported:"onpointerdown"in window&&(n.edge||n.ie&&n.version>=11)}}(navigator.userAgent),Mp={"[object Function]":1,"[object RegExp]":1,"[object Date]":1,"[object Error]":1,"[object CanvasGradient]":1,"[object CanvasPattern]":1,"[object Image]":1,"[object Canvas]":1},Sp={"[object Int8Array]":1,"[object Uint8Array]":1,"[object Uint8ClampedArray]":1,"[object Int16Array]":1,"[object Uint16Array]":1,"[object Int32Array]":1,"[object Uint32Array]":1,"[object Float32Array]":1,"[object Float64Array]":1},Ip=Object.prototype.toString,Cp=Array.prototype,Tp=Cp.forEach,Dp=Cp.filter,Ap=Cp.slice,kp=Cp.map,Pp=Cp.reduce,Lp={},Op=function(){return Lp.createCanvas()};Lp.createCanvas=function(){return document.createElement("canvas")};var zp,Ep="__ec_primitive__";E.prototype={constructor:E,get:function(t){return this.hasOwnProperty(t)?this[t]:null},set:function(t,e){return this[t]=e},each:function(t,e){void 0!==e&&(t=m(t,e));for(var n in this)this.hasOwnProperty(n)&&t(this[n],n)},removeKey:function(t){delete this[t]}};var Np=(Object.freeze||Object)({$override:e,clone:n,merge:i,mergeAll:r,extend:o,defaults:a,createCanvas:Op,getContext:s,indexOf:l,inherits:u,mixin:h,isArrayLike:c,each:d,map:f,reduce:p,filter:g,find:function(t,e,n){if(t&&e)for(var i=0,r=t.length;i<r;i++)if(e.call(n,t[i],i,t))return t[i]},bind:m,curry:v,isArray:y,isFunction:x,isString:_,isObject:w,isBuiltInObject:b,isTypedArray:M,isDom:S,eqNaN:I,retrieve:C,retrieve2:T,retrieve3:D,slice:A,normalizeCssArray:k,assert:P,trim:L,setAsPrimitive:O,isPrimitive:z,createHashMap:N,concatArray:function(t,e){for(var n=new t.constructor(t.length+e.length),i=0;i<t.length;i++)n[i]=t[i];var r=t.length;for(i=0;i<e.length;i++)n[i+r]=e[i];return n},noop:R}),Rp="undefined"==typeof Float32Array?Array:Float32Array,Bp=Z,Vp=U,Fp=Y,Hp=q,Gp=(Object.freeze||Object)({create:B,copy:V,clone:F,set:function(t,e,n){return t[0]=e,t[1]=n,t},add:H,scaleAndAdd:G,sub:W,len:Z,length:Bp,lenSquare:U,lengthSquare:Vp,mul:function(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t},div:function(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t},dot:function(t,e){return t[0]*e[0]+t[1]*e[1]},scale:X,normalize:j,distance:Y,dist:Fp,distanceSquare:q,distSquare:Hp,negate:function(t,e){return t[0]=-e[0],t[1]=-e[1],t},lerp:function(t,e,n,i){return t[0]=e[0]+i*(n[0]-e[0]),t[1]=e[1]+i*(n[1]-e[1]),t},applyTransform:$,min:K,max:Q});J.prototype={constructor:J,_dragStart:function(t){var e=t.target;e&&e.draggable&&(this._draggingTarget=e,e.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.dispatchToElement(tt(e,t),"dragstart",t.event))},_drag:function(t){var e=this._draggingTarget;if(e){var n=t.offsetX,i=t.offsetY,r=n-this._x,o=i-this._y;this._x=n,this._y=i,e.drift(r,o,t),this.dispatchToElement(tt(e,t),"drag",t.event);var a=this.findHover(n,i,e).target,s=this._dropTarget;this._dropTarget=a,e!==a&&(s&&a!==s&&this.dispatchToElement(tt(s,t),"dragleave",t.event),a&&a!==s&&this.dispatchToElement(tt(a,t),"dragenter",t.event))}},_dragEnd:function(t){var e=this._draggingTarget;e&&(e.dragging=!1),this.dispatchToElement(tt(e,t),"dragend",t.event),this._dropTarget&&this.dispatchToElement(tt(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null}};var Wp=Array.prototype.slice,Zp=function(){this._$handlers={}};Zp.prototype={constructor:Zp,one:function(t,e,n){var i=this._$handlers;if(!e||!t)return this;i[t]||(i[t]=[]);for(var r=0;r<i[t].length;r++)if(i[t][r].h===e)return this;return i[t].push({h:e,one:!0,ctx:n||this}),this},on:function(t,e,n){var i=this._$handlers;if(!e||!t)return this;i[t]||(i[t]=[]);for(var r=0;r<i[t].length;r++)if(i[t][r].h===e)return this;return i[t].push({h:e,one:!1,ctx:n||this}),this},isSilent:function(t){var e=this._$handlers;return e[t]&&e[t].length},off:function(t,e){var n=this._$handlers;if(!t)return this._$handlers={},this;if(e){if(n[t]){for(var i=[],r=0,o=n[t].length;r<o;r++)n[t][r].h!=e&&i.push(n[t][r]);n[t]=i}n[t]&&0===n[t].length&&delete n[t]}else delete n[t];return this},trigger:function(t){if(this._$handlers[t]){var e=arguments,n=e.length;n>3&&(e=Wp.call(e,1));for(var i=this._$handlers[t],r=i.length,o=0;o<r;){switch(n){case 1:i[o].h.call(i[o].ctx);break;case 2:i[o].h.call(i[o].ctx,e[1]);break;case 3:i[o].h.call(i[o].ctx,e[1],e[2]);break;default:i[o].h.apply(i[o].ctx,e)}i[o].one?(i.splice(o,1),r--):o++}}return this},triggerWithContext:function(t){if(this._$handlers[t]){var e=arguments,n=e.length;n>4&&(e=Wp.call(e,1,e.length-1));for(var i=e[e.length-1],r=this._$handlers[t],o=r.length,a=0;a<o;){switch(n){case 1:r[a].h.call(i);break;case 2:r[a].h.call(i,e[1]);break;case 3:r[a].h.call(i,e[1],e[2]);break;default:r[a].h.apply(i,e)}r[a].one?(r.splice(a,1),o--):a++}}return this}};var Up="silent";nt.prototype.dispose=function(){};var Xp=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],jp=function(t,e,n,i){Zp.call(this),this.storage=t,this.painter=e,this.painterRoot=i,n=n||new nt,this.proxy=null,this._hovered={},this._lastTouchMoment,this._lastX,this._lastY,J.call(this),this.setHandlerProxy(n)};jp.prototype={constructor:jp,setHandlerProxy:function(t){this.proxy&&this.proxy.dispose(),t&&(d(Xp,function(e){t.on&&t.on(e,this[e],this)},this),t.handler=this),this.proxy=t},mousemove:function(t){var e=t.zrX,n=t.zrY,i=this._hovered,r=i.target;r&&!r.__zr&&(r=(i=this.findHover(i.x,i.y)).target);var o=this._hovered=this.findHover(e,n),a=o.target,s=this.proxy;s.setCursor&&s.setCursor(a?a.cursor:"default"),r&&a!==r&&this.dispatchToElement(i,"mouseout",t),this.dispatchToElement(o,"mousemove",t),a&&a!==r&&this.dispatchToElement(o,"mouseover",t)},mouseout:function(t){this.dispatchToElement(this._hovered,"mouseout",t);var e,n=t.toElement||t.relatedTarget;do{n=n&&n.parentNode}while(n&&9!=n.nodeType&&!(e=n===this.painterRoot));!e&&this.trigger("globalout",{event:t})},resize:function(t){this._hovered={}},dispatch:function(t,e){var n=this[t];n&&n.call(this,e)},dispose:function(){this.proxy.dispose(),this.storage=this.proxy=this.painter=null},setCursorStyle:function(t){var e=this.proxy;e.setCursor&&e.setCursor(t)},dispatchToElement:function(t,e,n){var i=(t=t||{}).target;if(!i||!i.silent){for(var r="on"+e,o=et(e,t,n);i&&(i[r]&&(o.cancelBubble=i[r].call(i,o)),i.trigger(e,o),i=i.parent,!o.cancelBubble););o.cancelBubble||(this.trigger(e,o),this.painter&&this.painter.eachOtherLayer(function(t){"function"==typeof t[r]&&t[r].call(t,o),t.trigger&&t.trigger(e,o)}))}},findHover:function(t,e,n){for(var i=this.storage.getDisplayList(),r={x:t,y:e},o=i.length-1;o>=0;o--){var a;if(i[o]!==n&&!i[o].ignore&&(a=it(i[o],t,e))&&(!r.topTarget&&(r.topTarget=i[o]),a!==Up)){r.target=i[o];break}}return r}},d(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){jp.prototype[t]=function(e){var n=this.findHover(e.zrX,e.zrY),i=n.target;if("mousedown"===t)this._downEl=i,this._downPoint=[e.zrX,e.zrY],this._upEl=i;else if("mouseup"===t)this._upEl=i;else if("click"===t){if(this._downEl!==this._upEl||!this._downPoint||Fp(this._downPoint,[e.zrX,e.zrY])>4)return;this._downPoint=null}this.dispatchToElement(n,t,e)}}),h(jp,Zp),h(jp,J);var Yp="undefined"==typeof Float32Array?Array:Float32Array,qp=(Object.freeze||Object)({create:rt,identity:ot,copy:at,mul:st,translate:lt,rotate:ut,scale:ht,invert:ct,clone:function(t){var e=rt();return at(e,t),e}}),$p=ot,Kp=5e-5,Qp=function(t){(t=t||{}).position||(this.position=[0,0]),null==t.rotation&&(this.rotation=0),t.scale||(this.scale=[1,1]),this.origin=this.origin||null},Jp=Qp.prototype;Jp.transform=null,Jp.needLocalTransform=function(){return dt(this.rotation)||dt(this.position[0])||dt(this.position[1])||dt(this.scale[0]-1)||dt(this.scale[1]-1)},Jp.updateTransform=function(){var t=this.parent,e=t&&t.transform,n=this.needLocalTransform(),i=this.transform;n||e?(i=i||rt(),n?this.getLocalTransform(i):$p(i),e&&(n?st(i,t.transform,i):at(i,t.transform)),this.transform=i,this.invTransform=this.invTransform||rt(),ct(this.invTransform,i)):i&&$p(i)},Jp.getLocalTransform=function(t){return Qp.getLocalTransform(this,t)},Jp.setTransform=function(t){var e=this.transform,n=t.dpr||1;e?t.setTransform(n*e[0],n*e[1],n*e[2],n*e[3],n*e[4],n*e[5]):t.setTransform(n,0,0,n,0,0)},Jp.restoreTransform=function(t){var e=t.dpr||1;t.setTransform(e,0,0,e,0,0)};var tg=[];Jp.decomposeTransform=function(){if(this.transform){var t=this.parent,e=this.transform;t&&t.transform&&(st(tg,t.invTransform,e),e=tg);var n=e[0]*e[0]+e[1]*e[1],i=e[2]*e[2]+e[3]*e[3],r=this.position,o=this.scale;dt(n-1)&&(n=Math.sqrt(n)),dt(i-1)&&(i=Math.sqrt(i)),e[0]<0&&(n=-n),e[3]<0&&(i=-i),r[0]=e[4],r[1]=e[5],o[0]=n,o[1]=i,this.rotation=Math.atan2(-e[1]/i,e[0]/n)}},Jp.getGlobalScale=function(){var t=this.transform;if(!t)return[1,1];var e=Math.sqrt(t[0]*t[0]+t[1]*t[1]),n=Math.sqrt(t[2]*t[2]+t[3]*t[3]);return t[0]<0&&(e=-e),t[3]<0&&(n=-n),[e,n]},Jp.transformCoordToLocal=function(t,e){var n=[t,e],i=this.invTransform;return i&&$(n,n,i),n},Jp.transformCoordToGlobal=function(t,e){var n=[t,e],i=this.transform;return i&&$(n,n,i),n},Qp.getLocalTransform=function(t,e){$p(e=e||[]);var n=t.origin,i=t.scale||[1,1],r=t.rotation||0,o=t.position||[0,0];return n&&(e[4]-=n[0],e[5]-=n[1]),ht(e,e,i),r&&ut(e,e,r),n&&(e[4]+=n[0],e[5]+=n[1]),e[4]+=o[0],e[5]+=o[1],e};var eg={linear:function(t){return t},quadraticIn:function(t){return t*t},quadraticOut:function(t){return t*(2-t)},quadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},cubicIn:function(t){return t*t*t},cubicOut:function(t){return--t*t*t+1},cubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},quarticIn:function(t){return t*t*t*t},quarticOut:function(t){return 1- --t*t*t*t},quarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},quinticIn:function(t){return t*t*t*t*t},quinticOut:function(t){return--t*t*t*t*t+1},quinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},sinusoidalIn:function(t){return 1-Math.cos(t*Math.PI/2)},sinusoidalOut:function(t){return Math.sin(t*Math.PI/2)},sinusoidalInOut:function(t){return.5*(1-Math.cos(Math.PI*t))},exponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},exponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},exponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))},circularIn:function(t){return 1-Math.sqrt(1-t*t)},circularOut:function(t){return Math.sqrt(1- --t*t)},circularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},elasticIn:function(t){var e,n=.1;return 0===t?0:1===t?1:(!n||n<1?(n=1,e=.1):e=.4*Math.asin(1/n)/(2*Math.PI),-n*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4))},elasticOut:function(t){var e,n=.1;return 0===t?0:1===t?1:(!n||n<1?(n=1,e=.1):e=.4*Math.asin(1/n)/(2*Math.PI),n*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/.4)+1)},elasticInOut:function(t){var e,n=.1;return 0===t?0:1===t?1:(!n||n<1?(n=1,e=.1):e=.4*Math.asin(1/n)/(2*Math.PI),(t*=2)<1?n*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*-.5:n*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*.5+1)},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},backInOut:function(t){var e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2)},bounceIn:function(t){return 1-eg.bounceOut(1-t)},bounceOut:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bounceInOut:function(t){return t<.5?.5*eg.bounceIn(2*t):.5*eg.bounceOut(2*t-1)+.5}};ft.prototype={constructor:ft,step:function(t,e){if(this._initialized||(this._startTime=t+this._delay,this._initialized=!0),this._paused)this._pausedTime+=e;else{var n=(t-this._startTime-this._pausedTime)/this._life;if(!(n<0)){n=Math.min(n,1);var i=this.easing,r="string"==typeof i?eg[i]:i,o="function"==typeof r?r(n):n;return this.fire("frame",o),1==n?this.loop?(this.restart(t),"restart"):(this._needsRemove=!0,"destroy"):null}}},restart:function(t){var e=(t-this._startTime-this._pausedTime)%this._life;this._startTime=t-e+this.gap,this._pausedTime=0,this._needsRemove=!1},fire:function(t,e){this[t="on"+t]&&this[t](this._target,e)},pause:function(){this._paused=!0},resume:function(){this._paused=!1}};var ng=function(){this.head=null,this.tail=null,this._len=0},ig=ng.prototype;ig.insert=function(t){var e=new rg(t);return this.insertEntry(e),e},ig.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},ig.remove=function(t){var e=t.prev,n=t.next;e?e.next=n:this.head=n,n?n.prev=e:this.tail=e,t.next=t.prev=null,this._len--},ig.len=function(){return this._len},ig.clear=function(){this.head=this.tail=null,this._len=0};var rg=function(t){this.value=t,this.next,this.prev},og=function(t){this._list=new ng,this._map={},this._maxSize=t||10,this._lastRemovedEntry=null},ag=og.prototype;ag.put=function(t,e){var n=this._list,i=this._map,r=null;if(null==i[t]){var o=n.len(),a=this._lastRemovedEntry;if(o>=this._maxSize&&o>0){var s=n.head;n.remove(s),delete i[s.key],r=s.value,this._lastRemovedEntry=s}a?a.value=e:a=new rg(e),a.key=t,n.insertEntry(a),i[t]=a}return r},ag.get=function(t){var e=this._map[t],n=this._list;if(null!=e)return e!==n.tail&&(n.remove(e),n.insertEntry(e)),e.value},ag.clear=function(){this._list.clear(),this._map={}};var sg={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]},lg=new og(20),ug=null,hg=At,cg=kt,dg=(Object.freeze||Object)({parse:St,lift:Tt,toHex:Dt,fastLerp:At,fastMapToColor:hg,lerp:kt,mapToColor:cg,modifyHSL:function(t,e,n,i){if(t=St(t))return t=Ct(t),null!=e&&(t[0]=gt(e)),null!=n&&(t[1]=yt(n)),null!=i&&(t[2]=yt(i)),Lt(It(t),"rgba")},modifyAlpha:Pt,stringify:Lt}),fg=Array.prototype.slice,pg=function(t,e,n,i){this._tracks={},this._target=t,this._loop=e||!1,this._getter=n||Ot,this._setter=i||zt,this._clipCount=0,this._delay=0,this._doneList=[],this._onframeList=[],this._clipList=[]};pg.prototype={when:function(t,e){var n=this._tracks;for(var i in e)if(e.hasOwnProperty(i)){if(!n[i]){n[i]=[];var r=this._getter(this._target,i);if(null==r)continue;0!==t&&n[i].push({time:0,value:Gt(r)})}n[i].push({time:t,value:e[i]})}return this},during:function(t){return this._onframeList.push(t),this},pause:function(){for(var t=0;t<this._clipList.length;t++)this._clipList[t].pause();this._paused=!0},resume:function(){for(var t=0;t<this._clipList.length;t++)this._clipList[t].resume();this._paused=!1},isPaused:function(){return!!this._paused},_doneCallback:function(){this._tracks={},this._clipList.length=0;for(var t=this._doneList,e=t.length,n=0;n<e;n++)t[n].call(this)},start:function(t,e){var n,i=this,r=0;for(var o in this._tracks)if(this._tracks.hasOwnProperty(o)){var a=Ut(this,t,function(){--r||i._doneCallback()},this._tracks[o],o,e);a&&(this._clipList.push(a),r++,this.animation&&this.animation.addClip(a),n=a)}if(n){var s=n.onframe;n.onframe=function(t,e){s(t,e);for(var n=0;n<i._onframeList.length;n++)i._onframeList[n](t,e)}}return r||this._doneCallback(),this},stop:function(t){for(var e=this._clipList,n=this.animation,i=0;i<e.length;i++){var r=e[i];t&&r.onframe(this._target,1),n&&n.removeClip(r)}e.length=0},delay:function(t){return this._delay=t,this},done:function(t){return t&&this._doneList.push(t),this},getClips:function(){return this._clipList}};var gg=1;"undefined"!=typeof window&&(gg=Math.max(window.devicePixelRatio||1,1));var mg=gg,vg=function(){},yg=vg,xg=function(){this.animators=[]};xg.prototype={constructor:xg,animate:function(t,e){var n,i=!1,r=this,o=this.__zr;if(t){var a=t.split("."),s=r;i="shape"===a[0];for(var u=0,h=a.length;u<h;u++)s&&(s=s[a[u]]);s&&(n=s)}else n=r;if(n){var c=r.animators,d=new pg(n,e);return d.during(function(t){r.dirty(i)}).done(function(){c.splice(l(c,d),1)}),c.push(d),o&&o.animation.addAnimator(d),d}yg('Property "'+t+'" is not existed in element '+r.id)},stopAnimation:function(t){for(var e=this.animators,n=e.length,i=0;i<n;i++)e[i].stop(t);return e.length=0,this},animateTo:function(t,e,n,i,r,o){_(n)?(r=i,i=n,n=0):x(i)?(r=i,i="linear",n=0):x(n)?(r=n,n=0):x(e)?(r=e,e=500):e||(e=500),this.stopAnimation(),this._animateToShallow("",this,t,e,n);var a=this.animators.slice(),s=a.length;s||r&&r();for(var l=0;l<a.length;l++)a[l].done(function(){--s||r&&r()}).start(i,o)},_animateToShallow:function(t,e,n,i,r){var o={},a=0;for(var s in n)if(n.hasOwnProperty(s))if(null!=e[s])w(n[s])&&!c(n[s])?this._animateToShallow(t?t+"."+s:s,e[s],n[s],i,r):(o[s]=n[s],a++);else if(null!=n[s])if(t){var l={};l[t]={},l[t][s]=n[s],this.attr(l)}else this.attr(s,n[s]);return a>0&&this.animate(t,!1).when(null==i?500:i,o).delay(r||0),this}};var _g=function(t){Qp.call(this,t),Zp.call(this,t),xg.call(this,t),this.id=t.id||_p()};_g.prototype={type:"element",name:"",__zr:null,ignore:!1,clipPath:null,isGroup:!1,drift:function(t,e){switch(this.draggable){case"horizontal":e=0;break;case"vertical":t=0}var n=this.transform;n||(n=this.transform=[1,0,0,1,0,0]),n[4]+=t,n[5]+=e,this.decomposeTransform(),this.dirty(!1)},beforeUpdate:function(){},afterUpdate:function(){},update:function(){this.updateTransform()},traverse:function(t,e){},attrKV:function(t,e){if("position"===t||"scale"===t||"origin"===t){if(e){var n=this[t];n||(n=this[t]=[]),n[0]=e[0],n[1]=e[1]}}else this[t]=e},hide:function(){this.ignore=!0,this.__zr&&this.__zr.refresh()},show:function(){this.ignore=!1,this.__zr&&this.__zr.refresh()},attr:function(t,e){if("string"==typeof t)this.attrKV(t,e);else if(w(t))for(var n in t)t.hasOwnProperty(n)&&this.attrKV(n,t[n]);return this.dirty(!1),this},setClipPath:function(t){var e=this.__zr;e&&t.addSelfToZr(e),this.clipPath&&this.clipPath!==t&&this.removeClipPath(),this.clipPath=t,t.__zr=e,t.__clipTarget=this,this.dirty(!1)},removeClipPath:function(){var t=this.clipPath;t&&(t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__clipTarget=null,this.clipPath=null,this.dirty(!1))},addSelfToZr:function(t){this.__zr=t;var e=this.animators;if(e)for(var n=0;n<e.length;n++)t.animation.addAnimator(e[n]);this.clipPath&&this.clipPath.addSelfToZr(t)},removeSelfFromZr:function(t){this.__zr=null;var e=this.animators;if(e)for(var n=0;n<e.length;n++)t.animation.removeAnimator(e[n]);this.clipPath&&this.clipPath.removeSelfFromZr(t)}},h(_g,xg),h(_g,Qp),h(_g,Zp);var wg=$,bg=Math.min,Mg=Math.max;Xt.prototype={constructor:Xt,union:function(t){var e=bg(t.x,this.x),n=bg(t.y,this.y);this.width=Mg(t.x+t.width,this.x+this.width)-e,this.height=Mg(t.y+t.height,this.y+this.height)-n,this.x=e,this.y=n},applyTransform:function(){var t=[],e=[],n=[],i=[];return function(r){if(r){t[0]=n[0]=this.x,t[1]=i[1]=this.y,e[0]=i[0]=this.x+this.width,e[1]=n[1]=this.y+this.height,wg(t,t,r),wg(e,e,r),wg(n,n,r),wg(i,i,r),this.x=bg(t[0],e[0],n[0],i[0]),this.y=bg(t[1],e[1],n[1],i[1]);var o=Mg(t[0],e[0],n[0],i[0]),a=Mg(t[1],e[1],n[1],i[1]);this.width=o-this.x,this.height=a-this.y}}}(),calculateTransform:function(t){var e=this,n=t.width/e.width,i=t.height/e.height,r=rt();return lt(r,r,[-e.x,-e.y]),ht(r,r,[n,i]),lt(r,r,[t.x,t.y]),r},intersect:function(t){if(!t)return!1;t instanceof Xt||(t=Xt.create(t));var e=this,n=e.x,i=e.x+e.width,r=e.y,o=e.y+e.height,a=t.x,s=t.x+t.width,l=t.y,u=t.y+t.height;return!(i<a||s<n||o<l||u<r)},contain:function(t,e){var n=this;return t>=n.x&&t<=n.x+n.width&&e>=n.y&&e<=n.y+n.height},clone:function(){return new Xt(this.x,this.y,this.width,this.height)},copy:function(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height},plain:function(){return{x:this.x,y:this.y,width:this.width,height:this.height}}},Xt.create=function(t){return new Xt(t.x,t.y,t.width,t.height)};var Sg=function(t){t=t||{},_g.call(this,t);for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);this._children=[],this.__storage=null,this.__dirty=!0};Sg.prototype={constructor:Sg,isGroup:!0,type:"group",silent:!1,children:function(){return this._children.slice()},childAt:function(t){return this._children[t]},childOfName:function(t){for(var e=this._children,n=0;n<e.length;n++)if(e[n].name===t)return e[n]},childCount:function(){return this._children.length},add:function(t){return t&&t!==this&&t.parent!==this&&(this._children.push(t),this._doAdd(t)),this},addBefore:function(t,e){if(t&&t!==this&&t.parent!==this&&e&&e.parent===this){var n=this._children,i=n.indexOf(e);i>=0&&(n.splice(i,0,t),this._doAdd(t))}return this},_doAdd:function(t){t.parent&&t.parent.remove(t),t.parent=this;var e=this.__storage,n=this.__zr;e&&e!==t.__storage&&(e.addToStorage(t),t instanceof Sg&&t.addChildrenToStorage(e)),n&&n.refresh()},remove:function(t){var e=this.__zr,n=this.__storage,i=this._children,r=l(i,t);return r<0?this:(i.splice(r,1),t.parent=null,n&&(n.delFromStorage(t),t instanceof Sg&&t.delChildrenFromStorage(n)),e&&e.refresh(),this)},removeAll:function(){var t,e,n=this._children,i=this.__storage;for(e=0;e<n.length;e++)t=n[e],i&&(i.delFromStorage(t),t instanceof Sg&&t.delChildrenFromStorage(i)),t.parent=null;return n.length=0,this},eachChild:function(t,e){for(var n=this._children,i=0;i<n.length;i++){var r=n[i];t.call(e,r,i)}return this},traverse:function(t,e){for(var n=0;n<this._children.length;n++){var i=this._children[n];t.call(e,i),"group"===i.type&&i.traverse(t,e)}return this},addChildrenToStorage:function(t){for(var e=0;e<this._children.length;e++){var n=this._children[e];t.addToStorage(n),n instanceof Sg&&n.addChildrenToStorage(t)}},delChildrenFromStorage:function(t){for(var e=0;e<this._children.length;e++){var n=this._children[e];t.delFromStorage(n),n instanceof Sg&&n.delChildrenFromStorage(t)}},dirty:function(){return this.__dirty=!0,this.__zr&&this.__zr.refresh(),this},getBoundingRect:function(t){for(var e=null,n=new Xt(0,0,0,0),i=t||this._children,r=[],o=0;o<i.length;o++){var a=i[o];if(!a.ignore&&!a.invisible){var s=a.getBoundingRect(),l=a.getLocalTransform(r);l?(n.copy(s),n.applyTransform(l),(e=e||n.clone()).union(n)):(e=e||s.clone()).union(s)}}return e||n}},u(Sg,_g);var Ig=32,Cg=7,Tg=function(){this._roots=[],this._displayList=[],this._displayListLen=0};Tg.prototype={constructor:Tg,traverse:function(t,e){for(var n=0;n<this._roots.length;n++)this._roots[n].traverse(t,e)},getDisplayList:function(t,e){return e=e||!1,t&&this.updateDisplayList(e),this._displayList},updateDisplayList:function(t){this._displayListLen=0;for(var e=this._roots,n=this._displayList,i=0,r=e.length;i<r;i++)this._updateAndAddDisplayable(e[i],null,t);n.length=this._displayListLen,bp.canvasSupported&&te(n,ee)},_updateAndAddDisplayable:function(t,e,n){if(!t.ignore||n){t.beforeUpdate(),t.__dirty&&t.update(),t.afterUpdate();var i=t.clipPath;if(i){e=e?e.slice():[];for(var r=i,o=t;r;)r.parent=o,r.updateTransform(),e.push(r),o=r,r=r.clipPath}if(t.isGroup){for(var a=t._children,s=0;s<a.length;s++){var l=a[s];t.__dirty&&(l.__dirty=!0),this._updateAndAddDisplayable(l,e,n)}t.__dirty=!1}else t.__clipPaths=e,this._displayList[this._displayListLen++]=t}},addRoot:function(t){t.__storage!==this&&(t instanceof Sg&&t.addChildrenToStorage(this),this.addToStorage(t),this._roots.push(t))},delRoot:function(t){if(null==t){for(n=0;n<this._roots.length;n++){var e=this._roots[n];e instanceof Sg&&e.delChildrenFromStorage(this)}return this._roots=[],this._displayList=[],void(this._displayListLen=0)}if(t instanceof Array)for(var n=0,i=t.length;n<i;n++)this.delRoot(t[n]);else{var r=l(this._roots,t);r>=0&&(this.delFromStorage(t),this._roots.splice(r,1),t instanceof Sg&&t.delChildrenFromStorage(this))}},addToStorage:function(t){return t&&(t.__storage=this,t.dirty(!1)),this},delFromStorage:function(t){return t&&(t.__storage=null),this},dispose:function(){this._renderList=this._roots=null},displayableSortFunc:ee};var Dg={shadowBlur:1,shadowOffsetX:1,shadowOffsetY:1,textShadowBlur:1,textShadowOffsetX:1,textShadowOffsetY:1,textBoxShadowBlur:1,textBoxShadowOffsetX:1,textBoxShadowOffsetY:1},Ag=function(t,e,n){return Dg.hasOwnProperty(e)?n*=t.dpr:n},kg=[["shadowBlur",0],["shadowOffsetX",0],["shadowOffsetY",0],["shadowColor","#000"],["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]],Pg=function(t,e){this.extendFrom(t,!1),this.host=e};Pg.prototype={constructor:Pg,host:null,fill:"#000",stroke:null,opacity:1,lineDash:null,lineDashOffset:0,shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,lineWidth:1,strokeNoScale:!1,text:null,font:null,textFont:null,fontStyle:null,fontWeight:null,fontSize:null,fontFamily:null,textTag:null,textFill:"#000",textStroke:null,textWidth:null,textHeight:null,textStrokeWidth:0,textLineHeight:null,textPosition:"inside",textRect:null,textOffset:null,textAlign:null,textVerticalAlign:null,textDistance:5,textShadowColor:"transparent",textShadowBlur:0,textShadowOffsetX:0,textShadowOffsetY:0,textBoxShadowColor:"transparent",textBoxShadowBlur:0,textBoxShadowOffsetX:0,textBoxShadowOffsetY:0,transformText:!1,textRotation:0,textOrigin:null,textBackgroundColor:null,textBorderColor:null,textBorderWidth:0,textBorderRadius:0,textPadding:null,rich:null,truncate:null,blend:null,bind:function(t,e,n){for(var i=this,r=n&&n.style,o=!r,a=0;a<kg.length;a++){var s=kg[a],l=s[0];(o||i[l]!==r[l])&&(t[l]=Ag(t,l,i[l]||s[1]))}if((o||i.fill!==r.fill)&&(t.fillStyle=i.fill),(o||i.stroke!==r.stroke)&&(t.strokeStyle=i.stroke),(o||i.opacity!==r.opacity)&&(t.globalAlpha=null==i.opacity?1:i.opacity),(o||i.blend!==r.blend)&&(t.globalCompositeOperation=i.blend||"source-over"),this.hasStroke()){var u=i.lineWidth;t.lineWidth=u/(this.strokeNoScale&&e&&e.getLineScale?e.getLineScale():1)}},hasFill:function(){var t=this.fill;return null!=t&&"none"!==t},hasStroke:function(){var t=this.stroke;return null!=t&&"none"!==t&&this.lineWidth>0},extendFrom:function(t,e){if(t)for(var n in t)!t.hasOwnProperty(n)||!0!==e&&(!1===e?this.hasOwnProperty(n):null==t[n])||(this[n]=t[n])},set:function(t,e){"string"==typeof t?this[t]=e:this.extendFrom(t,!0)},clone:function(){var t=new this.constructor;return t.extendFrom(this,!0),t},getGradient:function(t,e,n){for(var i=("radial"===e.type?ie:ne)(t,e,n),r=e.colorStops,o=0;o<r.length;o++)i.addColorStop(r[o].offset,r[o].color);return i}};for(var Lg=Pg.prototype,Og=0;Og<kg.length;Og++){var zg=kg[Og];zg[0]in Lg||(Lg[zg[0]]=zg[1])}Pg.getGradient=Lg.getGradient;var Eg=function(t,e){this.image=t,this.repeat=e,this.type="pattern"};Eg.prototype.getCanvasPattern=function(t){return t.createPattern(this.image,this.repeat||"repeat")};var Ng=function(t,e,n){var i;n=n||mg,"string"==typeof t?i=oe(t,e,n):w(t)&&(t=(i=t).id),this.id=t,this.dom=i;var r=i.style;r&&(i.onselectstart=re,r["-webkit-user-select"]="none",r["user-select"]="none",r["-webkit-touch-callout"]="none",r["-webkit-tap-highlight-color"]="rgba(0,0,0,0)",r.padding=0,r.margin=0,r["border-width"]=0),this.domBack=null,this.ctxBack=null,this.painter=e,this.config=null,this.clearColor=0,this.motionBlur=!1,this.lastFrameAlpha=.7,this.dpr=n};Ng.prototype={constructor:Ng,__dirty:!0,__used:!1,__drawIndex:0,__startIndex:0,__endIndex:0,incremental:!1,getElementCount:function(){return this.__endIndex-this.__startIndex},initContext:function(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr},createBackBuffer:function(){var t=this.dpr;this.domBack=oe("back-"+this.id,this.painter,t),this.ctxBack=this.domBack.getContext("2d"),1!=t&&this.ctxBack.scale(t,t)},resize:function(t,e){var n=this.dpr,i=this.dom,r=i.style,o=this.domBack;r&&(r.width=t+"px",r.height=e+"px"),i.width=t*n,i.height=e*n,o&&(o.width=t*n,o.height=e*n,1!=n&&this.ctxBack.scale(n,n))},clear:function(t,e){var n=this.dom,i=this.ctx,r=n.width,o=n.height,e=e||this.clearColor,a=this.motionBlur&&!t,s=this.lastFrameAlpha,l=this.dpr;if(a&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(n,0,0,r/l,o/l)),i.clearRect(0,0,r,o),e&&"transparent"!==e){var u;e.colorStops?(u=e.__canvasGradient||Pg.getGradient(i,e,{x:0,y:0,width:r,height:o}),e.__canvasGradient=u):e.image&&(u=Eg.prototype.getCanvasPattern.call(e,i)),i.save(),i.fillStyle=u||e,i.fillRect(0,0,r,o),i.restore()}if(a){var h=this.domBack;i.save(),i.globalAlpha=s,i.drawImage(h,0,0,r,o),i.restore()}}};var Rg="undefined"!=typeof window&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){setTimeout(t,16)},Bg=new og(50),Vg={},Fg=0,Hg=5e3,Gg=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g,Wg="12px sans-serif",Zg={};Zg.measureText=function(t,e){var n=s();return n.font=e||Wg,n.measureText(t)};var Ug={left:1,right:1,center:1},Xg={top:1,bottom:1,middle:1},jg=new Xt,Yg=function(){};Yg.prototype={constructor:Yg,drawRectText:function(t,e){var n=this.style;e=n.textRect||e,this.__dirty&&De(n);var i=n.text;if(null!=i&&(i+=""),Ue(i,n)){t.save();var r=this.transform;n.transformText?this.setTransform(t):r&&(jg.copy(e),jg.applyTransform(r),e=jg),ke(this,t,i,n,e),t.restore()}}},Xe.prototype={constructor:Xe,type:"displayable",__dirty:!0,invisible:!1,z:0,z2:0,zlevel:0,draggable:!1,dragging:!1,silent:!1,culling:!1,cursor:"pointer",rectHover:!1,progressive:!1,incremental:!1,inplace:!1,beforeBrush:function(t){},afterBrush:function(t){},brush:function(t,e){},getBoundingRect:function(){},contain:function(t,e){return this.rectContain(t,e)},traverse:function(t,e){t.call(e,this)},rectContain:function(t,e){var n=this.transformCoordToLocal(t,e);return this.getBoundingRect().contain(n[0],n[1])},dirty:function(){this.__dirty=!0,this._rect=null,this.__zr&&this.__zr.refresh()},animateStyle:function(t){return this.animate("style",t)},attrKV:function(t,e){"style"!==t?_g.prototype.attrKV.call(this,t,e):this.style.set(e)},setStyle:function(t,e){return this.style.set(t,e),this.dirty(!1),this},useStyle:function(t){return this.style=new Pg(t,this),this.dirty(!1),this}},u(Xe,_g),h(Xe,Yg),je.prototype={constructor:je,type:"image",brush:function(t,e){var n=this.style,i=n.image;n.bind(t,this,e);var r=this._image=se(i,this._image,this,this.onload);if(r&&ue(r)){var o=n.x||0,a=n.y||0,s=n.width,l=n.height,u=r.width/r.height;if(null==s&&null!=l?s=l*u:null==l&&null!=s?l=s/u:null==s&&null==l&&(s=r.width,l=r.height),this.setTransform(t),n.sWidth&&n.sHeight){var h=n.sx||0,c=n.sy||0;t.drawImage(r,h,c,n.sWidth,n.sHeight,o,a,s,l)}else if(n.sx&&n.sy){var d=s-(h=n.sx),f=l-(c=n.sy);t.drawImage(r,h,c,d,f,o,a,s,l)}else t.drawImage(r,o,a,s,l);null!=n.text&&(this.restoreTransform(t),this.drawRectText(t,this.getBoundingRect()))}},getBoundingRect:function(){var t=this.style;return this._rect||(this._rect=new Xt(t.x||0,t.y||0,t.width||0,t.height||0)),this._rect}},u(je,Xe);var qg=new Xt(0,0,0,0),$g=new Xt(0,0,0,0),Kg=function(t,e,n){this.type="canvas";var i=!t.nodeName||"CANVAS"===t.nodeName.toUpperCase();this._opts=n=o({},n||{}),this.dpr=n.devicePixelRatio||mg,this._singleCanvas=i,this.root=t;var r=t.style;r&&(r["-webkit-tap-highlight-color"]="transparent",r["-webkit-user-select"]=r["user-select"]=r["-webkit-touch-callout"]="none",t.innerHTML=""),this.storage=e;var a=this._zlevelList=[],s=this._layers={};if(this._layerConfig={},this._needsManuallyCompositing=!1,i){var l=t.width,u=t.height;null!=n.width&&(l=n.width),null!=n.height&&(u=n.height),this.dpr=n.devicePixelRatio||1,t.width=l*this.dpr,t.height=u*this.dpr,this._width=l,this._height=u;var h=new Ng(t,this,this.dpr);h.__builtin__=!0,h.initContext(),s[314159]=h,h.zlevel=314159,a.push(314159),this._domRoot=t}else{this._width=this._getSize(0),this._height=this._getSize(1);var c=this._domRoot=Je(this._width,this._height);t.appendChild(c)}this._hoverlayer=null,this._hoverElements=[]};Kg.prototype={constructor:Kg,getType:function(){return"canvas"},isSingleCanvas:function(){return this._singleCanvas},getViewportRoot:function(){return this._domRoot},getViewportRootOffset:function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},refresh:function(t){var e=this.storage.getDisplayList(!0),n=this._zlevelList;this._redrawId=Math.random(),this._paintList(e,t,this._redrawId);for(var i=0;i<n.length;i++){var r=n[i],o=this._layers[r];if(!o.__builtin__&&o.refresh){var a=0===i?this._backgroundColor:null;o.refresh(a)}}return this.refreshHover(),this},addHover:function(t,e){if(!t.__hoverMir){var n=new t.constructor({style:t.style,shape:t.shape});n.__from=t,t.__hoverMir=n,n.setStyle(e),this._hoverElements.push(n)}},removeHover:function(t){var e=t.__hoverMir,n=this._hoverElements,i=l(n,e);i>=0&&n.splice(i,1),t.__hoverMir=null},clearHover:function(t){for(var e=this._hoverElements,n=0;n<e.length;n++){var i=e[n].__from;i&&(i.__hoverMir=null)}e.length=0},refreshHover:function(){var t=this._hoverElements,e=t.length,n=this._hoverlayer;if(n&&n.clear(),e){te(t,this.storage.displayableSortFunc),n||(n=this._hoverlayer=this.getLayer(1e5));var i={};n.ctx.save();for(var r=0;r<e;){var o=t[r],a=o.__from;a&&a.__zr?(r++,a.invisible||(o.transform=a.transform,o.invTransform=a.invTransform,o.__clipPaths=a.__clipPaths,this._doPaintEl(o,n,!0,i))):(t.splice(r,1),a.__hoverMir=null,e--)}n.ctx.restore()}},getHoverLayer:function(){return this.getLayer(1e5)},_paintList:function(t,e,n){if(this._redrawId===n){e=e||!1,this._updateLayerStatus(t);var i=this._doPaintList(t,e);if(this._needsManuallyCompositing&&this._compositeManually(),!i){var r=this;Rg(function(){r._paintList(t,e,n)})}}},_compositeManually:function(){var t=this.getLayer(314159).ctx,e=this._domRoot.width,n=this._domRoot.height;t.clearRect(0,0,e,n),this.eachBuiltinLayer(function(i){i.virtual&&t.drawImage(i.dom,0,0,e,n)})},_doPaintList:function(t,e){for(var n=[],i=0;i<this._zlevelList.length;i++){var r=this._zlevelList[i];(s=this._layers[r]).__builtin__&&s!==this._hoverlayer&&(s.__dirty||e)&&n.push(s)}for(var o=!0,a=0;a<n.length;a++){var s=n[a],l=s.ctx,u={};l.save();var h=e?s.__startIndex:s.__drawIndex,c=!e&&s.incremental&&Date.now,f=c&&Date.now(),p=s.zlevel===this._zlevelList[0]?this._backgroundColor:null;if(s.__startIndex===s.__endIndex)s.clear(!1,p);else if(h===s.__startIndex){var g=t[h];g.incremental&&g.notClear&&!e||s.clear(!1,p)}-1===h&&(console.error("For some unknown reason. drawIndex is -1"),h=s.__startIndex);for(var m=h;m<s.__endIndex;m++){var v=t[m];if(this._doPaintEl(v,s,e,u),v.__dirty=!1,c&&Date.now()-f>15)break}s.__drawIndex=m,s.__drawIndex<s.__endIndex&&(o=!1),u.prevElClipPaths&&l.restore(),l.restore()}return bp.wxa&&d(this._layers,function(t){t&&t.ctx&&t.ctx.draw&&t.ctx.draw()}),o},_doPaintEl:function(t,e,n,i){var r=e.ctx,o=t.transform;if((e.__dirty||n)&&!t.invisible&&0!==t.style.opacity&&(!o||o[0]||o[3])&&(!t.culling||!$e(t,this._width,this._height))){var a=t.__clipPaths;i.prevElClipPaths&&!Ke(a,i.prevElClipPaths)||(i.prevElClipPaths&&(e.ctx.restore(),i.prevElClipPaths=null,i.prevEl=null),a&&(r.save(),Qe(a,r),i.prevElClipPaths=a)),t.beforeBrush&&t.beforeBrush(r),t.brush(r,i.prevEl||null),i.prevEl=t,t.afterBrush&&t.afterBrush(r)}},getLayer:function(t,e){this._singleCanvas&&!this._needsManuallyCompositing&&(t=314159);var n=this._layers[t];return n||((n=new Ng("zr_"+t,this,this.dpr)).zlevel=t,n.__builtin__=!0,this._layerConfig[t]&&i(n,this._layerConfig[t],!0),e&&(n.virtual=e),this.insertLayer(t,n),n.initContext()),n},insertLayer:function(t,e){var n=this._layers,i=this._zlevelList,r=i.length,o=null,a=-1,s=this._domRoot;if(n[t])yg("ZLevel "+t+" has been used already");else if(qe(e)){if(r>0&&t>i[0]){for(a=0;a<r-1&&!(i[a]<t&&i[a+1]>t);a++);o=n[i[a]]}if(i.splice(a+1,0,t),n[t]=e,!e.virtual)if(o){var l=o.dom;l.nextSibling?s.insertBefore(e.dom,l.nextSibling):s.appendChild(e.dom)}else s.firstChild?s.insertBefore(e.dom,s.firstChild):s.appendChild(e.dom)}else yg("Layer of zlevel "+t+" is not valid")},eachLayer:function(t,e){var n,i,r=this._zlevelList;for(i=0;i<r.length;i++)n=r[i],t.call(e,this._layers[n],n)},eachBuiltinLayer:function(t,e){var n,i,r,o=this._zlevelList;for(r=0;r<o.length;r++)i=o[r],(n=this._layers[i]).__builtin__&&t.call(e,n,i)},eachOtherLayer:function(t,e){var n,i,r,o=this._zlevelList;for(r=0;r<o.length;r++)i=o[r],(n=this._layers[i]).__builtin__||t.call(e,n,i)},getLayers:function(){return this._layers},_updateLayerStatus:function(t){function e(t){n&&(n.__endIndex!==t&&(n.__dirty=!0),n.__endIndex=t)}if(this.eachBuiltinLayer(function(t,e){t.__dirty=t.__used=!1}),this._singleCanvas)for(r=1;r<t.length;r++)if((a=t[r]).zlevel!==t[r-1].zlevel||a.incremental){this._needsManuallyCompositing=!0;break}for(var n=null,i=0,r=0;r<t.length;r++){var o,a=t[r],s=a.zlevel;a.incremental?((o=this.getLayer(s+.001,this._needsManuallyCompositing)).incremental=!0,i=1):o=this.getLayer(s+(i>0?.01:0),this._needsManuallyCompositing),o.__builtin__||yg("ZLevel "+s+" has been used by unkown layer "+o.id),o!==n&&(o.__used=!0,o.__startIndex!==r&&(o.__dirty=!0),o.__startIndex=r,o.incremental?o.__drawIndex=-1:o.__drawIndex=r,e(r),n=o),a.__dirty&&(o.__dirty=!0,o.incremental&&o.__drawIndex<0&&(o.__drawIndex=r))}e(r),this.eachBuiltinLayer(function(t,e){!t.__used&&t.getElementCount()>0&&(t.__dirty=!0,t.__startIndex=t.__endIndex=t.__drawIndex=0),t.__dirty&&t.__drawIndex<0&&(t.__drawIndex=t.__startIndex)})},clear:function(){return this.eachBuiltinLayer(this._clearLayer),this},_clearLayer:function(t){t.clear()},setBackgroundColor:function(t){this._backgroundColor=t},configLayer:function(t,e){if(e){var n=this._layerConfig;n[t]?i(n[t],e,!0):n[t]=e;for(var r=0;r<this._zlevelList.length;r++){var o=this._zlevelList[r];o!==t&&o!==t+.01||i(this._layers[o],n[t],!0)}}},delLayer:function(t){var e=this._layers,n=this._zlevelList,i=e[t];i&&(i.dom.parentNode.removeChild(i.dom),delete e[t],n.splice(l(n,t),1))},resize:function(t,e){if(this._domRoot.style){var n=this._domRoot;n.style.display="none";var i=this._opts;if(null!=t&&(i.width=t),null!=e&&(i.height=e),t=this._getSize(0),e=this._getSize(1),n.style.display="",this._width!=t||e!=this._height){n.style.width=t+"px",n.style.height=e+"px";for(var r in this._layers)this._layers.hasOwnProperty(r)&&this._layers[r].resize(t,e);d(this._progressiveLayers,function(n){n.resize(t,e)}),this.refresh(!0)}this._width=t,this._height=e}else{if(null==t||null==e)return;this._width=t,this._height=e,this.getLayer(314159).resize(t,e)}return this},clearLayer:function(t){var e=this._layers[t];e&&e.clear()},dispose:function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},getRenderedCanvas:function(t){if(t=t||{},this._singleCanvas&&!this._compositeManually)return this._layers[314159].dom;var e=new Ng("image",this,t.pixelRatio||this.dpr);if(e.initContext(),e.clear(!1,t.backgroundColor||this._backgroundColor),t.pixelRatio<=this.dpr){this.refresh();var n=e.dom.width,i=e.dom.height,r=e.ctx;this.eachLayer(function(t){t.__builtin__?r.drawImage(t.dom,0,0,n,i):t.renderToCanvas&&(e.ctx.save(),t.renderToCanvas(e.ctx),e.ctx.restore())})}else for(var o={},a=this.storage.getDisplayList(!0),s=0;s<a.length;s++){var l=a[s];this._doPaintEl(l,e,!0,o)}return e.dom},getWidth:function(){return this._width},getHeight:function(){return this._height},_getSize:function(t){var e=this._opts,n=["width","height"][t],i=["clientWidth","clientHeight"][t],r=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(null!=e[n]&&"auto"!==e[n])return parseFloat(e[n]);var a=this.root,s=document.defaultView.getComputedStyle(a);return(a[i]||Ye(s[n])||Ye(a.style[n]))-(Ye(s[r])||0)-(Ye(s[o])||0)|0},pathToImage:function(t,e){e=e||this.dpr;var n=document.createElement("canvas"),i=n.getContext("2d"),r=t.getBoundingRect(),o=t.style,a=o.shadowBlur*e,s=o.shadowOffsetX*e,l=o.shadowOffsetY*e,u=o.hasStroke()?o.lineWidth:0,h=Math.max(u/2,-s+a),c=Math.max(u/2,s+a),d=Math.max(u/2,-l+a),f=Math.max(u/2,l+a),p=r.width+h+c,g=r.height+d+f;n.width=p*e,n.height=g*e,i.scale(e,e),i.clearRect(0,0,p,g),i.dpr=e;var m={position:t.position,rotation:t.rotation,scale:t.scale};t.position=[h-r.x,d-r.y],t.rotation=0,t.scale=[1,1],t.updateTransform(),t&&t.brush(i);var v=new je({style:{x:0,y:0,image:n}});return null!=m.position&&(v.position=t.position=m.position),null!=m.rotation&&(v.rotation=t.rotation=m.rotation),null!=m.scale&&(v.scale=t.scale=m.scale),v}};var Qg="undefined"!=typeof window&&!!window.addEventListener,Jg=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,tm=Qg?function(t){t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0}:function(t){t.returnValue=!1,t.cancelBubble=!0},em=function(t){t=t||{},this.stage=t.stage||{},this.onframe=t.onframe||function(){},this._clips=[],this._running=!1,this._time,this._pausedTime,this._pauseStart,this._paused=!1,Zp.call(this)};em.prototype={constructor:em,addClip:function(t){this._clips.push(t)},addAnimator:function(t){t.animation=this;for(var e=t.getClips(),n=0;n<e.length;n++)this.addClip(e[n])},removeClip:function(t){var e=l(this._clips,t);e>=0&&this._clips.splice(e,1)},removeAnimator:function(t){for(var e=t.getClips(),n=0;n<e.length;n++)this.removeClip(e[n]);t.animation=null},_update:function(){for(var t=(new Date).getTime()-this._pausedTime,e=t-this._time,n=this._clips,i=n.length,r=[],o=[],a=0;a<i;a++){var s=n[a],l=s.step(t,e);l&&(r.push(l),o.push(s))}for(a=0;a<i;)n[a]._needsRemove?(n[a]=n[i-1],n.pop(),i--):a++;i=r.length;for(a=0;a<i;a++)o[a].fire(r[a]);this._time=t,this.onframe(e),this.trigger("frame",e),this.stage.update&&this.stage.update()},_startLoop:function(){function t(){e._running&&(Rg(t),!e._paused&&e._update())}var e=this;this._running=!0,Rg(t)},start:function(){this._time=(new Date).getTime(),this._pausedTime=0,this._startLoop()},stop:function(){this._running=!1},pause:function(){this._paused||(this._pauseStart=(new Date).getTime(),this._paused=!0)},resume:function(){this._paused&&(this._pausedTime+=(new Date).getTime()-this._pauseStart,this._paused=!1)},clear:function(){this._clips=[]},isFinished:function(){return!this._clips.length},animate:function(t,e){var n=new pg(t,(e=e||{}).loop,e.getter,e.setter);return this.addAnimator(n),n}},h(em,Zp);var nm=function(){this._track=[]};nm.prototype={constructor:nm,recognize:function(t,e,n){return this._doTrack(t,e,n),this._recognize(t)},clear:function(){return this._track.length=0,this},_doTrack:function(t,e,n){var i=t.touches;if(i){for(var r={points:[],touches:[],target:e,event:t},o=0,a=i.length;o<a;o++){var s=i[o],l=en(n,s,{});r.points.push([l.zrX,l.zrY]),r.touches.push(s)}this._track.push(r)}},_recognize:function(t){for(var e in im)if(im.hasOwnProperty(e)){var n=im[e](this._track,t);if(n)return n}}};var im={pinch:function(t,e){var n=t.length;if(n){var i=(t[n-1]||{}).points,r=(t[n-2]||{}).points||i;if(r&&r.length>1&&i&&i.length>1){var o=ln(i)/ln(r);!isFinite(o)&&(o=1),e.pinchScale=o;var a=un(i);return e.pinchX=a[0],e.pinchY=a[1],{type:"pinch",target:t[0].target,event:e}}}}},rm=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],om=["touchstart","touchend","touchmove"],am={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},sm=f(rm,function(t){var e=t.replace("mouse","pointer");return am[e]?e:t}),lm={mousemove:function(t){t=rn(this.dom,t),this.trigger("mousemove",t)},mouseout:function(t){var e=(t=rn(this.dom,t)).toElement||t.relatedTarget;if(e!=this.dom)for(;e&&9!=e.nodeType;){if(e===this.dom)return;e=e.parentNode}this.trigger("mouseout",t)},touchstart:function(t){(t=rn(this.dom,t)).zrByTouch=!0,this._lastTouchMoment=new Date,cn(this,t,"start"),lm.mousemove.call(this,t),lm.mousedown.call(this,t),dn(this)},touchmove:function(t){(t=rn(this.dom,t)).zrByTouch=!0,cn(this,t,"change"),lm.mousemove.call(this,t),dn(this)},touchend:function(t){(t=rn(this.dom,t)).zrByTouch=!0,cn(this,t,"end"),lm.mouseup.call(this,t),+new Date-this._lastTouchMoment<300&&lm.click.call(this,t),dn(this)},pointerdown:function(t){lm.mousedown.call(this,t)},pointermove:function(t){fn(t)||lm.mousemove.call(this,t)},pointerup:function(t){lm.mouseup.call(this,t)},pointerout:function(t){fn(t)||lm.mouseout.call(this,t)}};d(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){lm[t]=function(e){e=rn(this.dom,e),this.trigger(t,e)}});var um=gn.prototype;um.dispose=function(){for(var t=rm.concat(om),e=0;e<t.length;e++){var n=t[e];an(this.dom,hn(n),this._handlers[n])}},um.setCursor=function(t){this.dom.style&&(this.dom.style.cursor=t||"default")},h(gn,Zp);var hm=!bp.canvasSupported,cm={canvas:Kg},dm={},fm=function(t,e,n){n=n||{},this.dom=e,this.id=t;var i=this,r=new Tg,o=n.renderer;if(hm){if(!cm.vml)throw new Error("You need to require 'zrender/vml/vml' to support IE8");o="vml"}else o&&cm[o]||(o="canvas");var a=new cm[o](e,r,n,t);this.storage=r,this.painter=a;var s=bp.node||bp.worker?null:new gn(a.getViewportRoot());this.handler=new jp(r,a,s,a.root),this.animation=new em({stage:{update:m(this.flush,this)}}),this.animation.start(),this._needsRefresh;var l=r.delFromStorage,u=r.addToStorage;r.delFromStorage=function(t){l.call(r,t),t&&t.removeSelfFromZr(i)},r.addToStorage=function(t){u.call(r,t),t.addSelfToZr(i)}};fm.prototype={constructor:fm,getId:function(){return this.id},add:function(t){this.storage.addRoot(t),this._needsRefresh=!0},remove:function(t){this.storage.delRoot(t),this._needsRefresh=!0},configLayer:function(t,e){this.painter.configLayer&&this.painter.configLayer(t,e),this._needsRefresh=!0},setBackgroundColor:function(t){this.painter.setBackgroundColor&&this.painter.setBackgroundColor(t),this._needsRefresh=!0},refreshImmediately:function(){this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1},refresh:function(){this._needsRefresh=!0},flush:function(){var t;this._needsRefresh&&(t=!0,this.refreshImmediately()),this._needsRefreshHover&&(t=!0,this.refreshHoverImmediately()),t&&this.trigger("rendered")},addHover:function(t,e){this.painter.addHover&&(this.painter.addHover(t,e),this.refreshHover())},removeHover:function(t){this.painter.removeHover&&(this.painter.removeHover(t),this.refreshHover())},clearHover:function(){this.painter.clearHover&&(this.painter.clearHover(),this.refreshHover())},refreshHover:function(){this._needsRefreshHover=!0},refreshHoverImmediately:function(){this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.refreshHover()},resize:function(t){t=t||{},this.painter.resize(t.width,t.height),this.handler.resize()},clearAnimation:function(){this.animation.clear()},getWidth:function(){return this.painter.getWidth()},getHeight:function(){return this.painter.getHeight()},pathToImage:function(t,e){return this.painter.pathToImage(t,e)},setCursorStyle:function(t){this.handler.setCursorStyle(t)},findHover:function(t,e){return this.handler.findHover(t,e)},on:function(t,e,n){this.handler.on(t,e,n)},off:function(t,e){this.handler.off(t,e)},trigger:function(t,e){this.handler.trigger(t,e)},clear:function(){this.storage.delRoot(),this.painter.clear()},dispose:function(){this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,yn(this.id)}};var pm=(Object.freeze||Object)({version:"4.0.4",init:mn,dispose:function(t){if(t)t.dispose();else{for(var e in dm)dm.hasOwnProperty(e)&&dm[e].dispose();dm={}}return this},getInstance:function(t){return dm[t]},registerPainter:vn}),gm=d,mm=w,vm=y,ym="series\0",xm=["fontStyle","fontWeight","fontSize","fontFamily","rich","tag","color","textBorderColor","textBorderWidth","width","height","lineHeight","align","verticalAlign","baseline","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","textShadowColor","textShadowBlur","textShadowOffsetX","textShadowOffsetY","backgroundColor","borderColor","borderWidth","borderRadius","padding"],_m=0,wm=".",bm="___EC__COMPONENT__CONTAINER___",Mm=0,Sm=function(t){for(var e=0;e<t.length;e++)t[e][1]||(t[e][1]=t[e][0]);return function(e,n,i){for(var r={},o=0;o<t.length;o++){var a=t[o][1];if(!(n&&l(n,a)>=0||i&&l(i,a)<0)){var s=e.getShallow(a);null!=s&&(r[t[o][0]]=s)}}return r}},Im=Sm([["lineWidth","width"],["stroke","color"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]),Cm={getLineStyle:function(t){var e=Im(this,t),n=this.getLineDash(e.lineWidth);return n&&(e.lineDash=n),e},getLineDash:function(t){null==t&&(t=1);var e=this.get("type"),n=Math.max(t,2),i=4*t;return"solid"===e||null==e?null:"dashed"===e?[i,i]:[n,n]}},Tm=Sm([["fill","color"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["opacity"],["shadowColor"]]),Dm={getAreaStyle:function(t,e){return Tm(this,t,e)}},Am=Math.pow,km=Math.sqrt,Pm=1e-8,Lm=1e-4,Om=km(3),zm=1/3,Em=B(),Nm=B(),Rm=B(),Bm=Math.min,Vm=Math.max,Fm=Math.sin,Hm=Math.cos,Gm=2*Math.PI,Wm=B(),Zm=B(),Um=B(),Xm=[],jm=[],Ym={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},qm=[],$m=[],Km=[],Qm=[],Jm=Math.min,tv=Math.max,ev=Math.cos,nv=Math.sin,iv=Math.sqrt,rv=Math.abs,ov="undefined"!=typeof Float32Array,av=function(t){this._saveData=!t,this._saveData&&(this.data=[]),this._ctx=null};av.prototype={constructor:av,_xi:0,_yi:0,_x0:0,_y0:0,_ux:0,_uy:0,_len:0,_lineDash:null,_dashOffset:0,_dashIdx:0,_dashSum:0,setScale:function(t,e){this._ux=rv(1/mg/t)||0,this._uy=rv(1/mg/e)||0},getContext:function(){return this._ctx},beginPath:function(t){return this._ctx=t,t&&t.beginPath(),t&&(this.dpr=t.dpr),this._saveData&&(this._len=0),this._lineDash&&(this._lineDash=null,this._dashOffset=0),this},moveTo:function(t,e){return this.addData(Ym.M,t,e),this._ctx&&this._ctx.moveTo(t,e),this._x0=t,this._y0=e,this._xi=t,this._yi=e,this},lineTo:function(t,e){var n=rv(t-this._xi)>this._ux||rv(e-this._yi)>this._uy||this._len<5;return this.addData(Ym.L,t,e),this._ctx&&n&&(this._needsDash()?this._dashedLineTo(t,e):this._ctx.lineTo(t,e)),n&&(this._xi=t,this._yi=e),this},bezierCurveTo:function(t,e,n,i,r,o){return this.addData(Ym.C,t,e,n,i,r,o),this._ctx&&(this._needsDash()?this._dashedBezierTo(t,e,n,i,r,o):this._ctx.bezierCurveTo(t,e,n,i,r,o)),this._xi=r,this._yi=o,this},quadraticCurveTo:function(t,e,n,i){return this.addData(Ym.Q,t,e,n,i),this._ctx&&(this._needsDash()?this._dashedQuadraticTo(t,e,n,i):this._ctx.quadraticCurveTo(t,e,n,i)),this._xi=n,this._yi=i,this},arc:function(t,e,n,i,r,o){return this.addData(Ym.A,t,e,n,n,i,r-i,0,o?0:1),this._ctx&&this._ctx.arc(t,e,n,i,r,o),this._xi=ev(r)*n+t,this._yi=nv(r)*n+t,this},arcTo:function(t,e,n,i,r){return this._ctx&&this._ctx.arcTo(t,e,n,i,r),this},rect:function(t,e,n,i){return this._ctx&&this._ctx.rect(t,e,n,i),this.addData(Ym.R,t,e,n,i),this},closePath:function(){this.addData(Ym.Z);var t=this._ctx,e=this._x0,n=this._y0;return t&&(this._needsDash()&&this._dashedLineTo(e,n),t.closePath()),this._xi=e,this._yi=n,this},fill:function(t){t&&t.fill(),this.toStatic()},stroke:function(t){t&&t.stroke(),this.toStatic()},setLineDash:function(t){if(t instanceof Array){this._lineDash=t,this._dashIdx=0;for(var e=0,n=0;n<t.length;n++)e+=t[n];this._dashSum=e}return this},setLineDashOffset:function(t){return this._dashOffset=t,this},len:function(){return this._len},setData:function(t){var e=t.length;this.data&&this.data.length==e||!ov||(this.data=new Float32Array(e));for(var n=0;n<e;n++)this.data[n]=t[n];this._len=e},appendPath:function(t){t instanceof Array||(t=[t]);for(var e=t.length,n=0,i=this._len,r=0;r<e;r++)n+=t[r].len();ov&&this.data instanceof Float32Array&&(this.data=new Float32Array(i+n));for(r=0;r<e;r++)for(var o=t[r].data,a=0;a<o.length;a++)this.data[i++]=o[a];this._len=i},addData:function(t){if(this._saveData){var e=this.data;this._len+arguments.length>e.length&&(this._expandData(),e=this.data);for(var n=0;n<arguments.length;n++)e[this._len++]=arguments[n];this._prevCmd=t}},_expandData:function(){if(!(this.data instanceof Array)){for(var t=[],e=0;e<this._len;e++)t[e]=this.data[e];this.data=t}},_needsDash:function(){return this._lineDash},_dashedLineTo:function(t,e){var n,i,r=this._dashSum,o=this._dashOffset,a=this._lineDash,s=this._ctx,l=this._xi,u=this._yi,h=t-l,c=e-u,d=iv(h*h+c*c),f=l,p=u,g=a.length;for(h/=d,c/=d,o<0&&(o=r+o),f-=(o%=r)*h,p-=o*c;h>0&&f<=t||h<0&&f>=t||0==h&&(c>0&&p<=e||c<0&&p>=e);)f+=h*(n=a[i=this._dashIdx]),p+=c*n,this._dashIdx=(i+1)%g,h>0&&f<l||h<0&&f>l||c>0&&p<u||c<0&&p>u||s[i%2?"moveTo":"lineTo"](h>=0?Jm(f,t):tv(f,t),c>=0?Jm(p,e):tv(p,e));h=f-t,c=p-e,this._dashOffset=-iv(h*h+c*c)},_dashedBezierTo:function(t,e,n,i,r,o){var a,s,l,u,h,c=this._dashSum,d=this._dashOffset,f=this._lineDash,p=this._ctx,g=this._xi,m=this._yi,v=Gn,y=0,x=this._dashIdx,_=f.length,w=0;for(d<0&&(d=c+d),d%=c,a=0;a<1;a+=.1)s=v(g,t,n,r,a+.1)-v(g,t,n,r,a),l=v(m,e,i,o,a+.1)-v(m,e,i,o,a),y+=iv(s*s+l*l);for(;x<_&&!((w+=f[x])>d);x++);for(a=(w-d)/y;a<=1;)u=v(g,t,n,r,a),h=v(m,e,i,o,a),x%2?p.moveTo(u,h):p.lineTo(u,h),a+=f[x]/y,x=(x+1)%_;x%2!=0&&p.lineTo(r,o),s=r-u,l=o-h,this._dashOffset=-iv(s*s+l*l)},_dashedQuadraticTo:function(t,e,n,i){var r=n,o=i;n=(n+2*t)/3,i=(i+2*e)/3,t=(this._xi+2*t)/3,e=(this._yi+2*e)/3,this._dashedBezierTo(t,e,n,i,r,o)},toStatic:function(){var t=this.data;t instanceof Array&&(t.length=this._len,ov&&(this.data=new Float32Array(t)))},getBoundingRect:function(){qm[0]=qm[1]=Km[0]=Km[1]=Number.MAX_VALUE,$m[0]=$m[1]=Qm[0]=Qm[1]=-Number.MAX_VALUE;for(var t=this.data,e=0,n=0,i=0,r=0,o=0;o<t.length;){var a=t[o++];switch(1==o&&(i=e=t[o],r=n=t[o+1]),a){case Ym.M:e=i=t[o++],n=r=t[o++],Km[0]=i,Km[1]=r,Qm[0]=i,Qm[1]=r;break;case Ym.L:ei(e,n,t[o],t[o+1],Km,Qm),e=t[o++],n=t[o++];break;case Ym.C:ni(e,n,t[o++],t[o++],t[o++],t[o++],t[o],t[o+1],Km,Qm),e=t[o++],n=t[o++];break;case Ym.Q:ii(e,n,t[o++],t[o++],t[o],t[o+1],Km,Qm),e=t[o++],n=t[o++];break;case Ym.A:var s=t[o++],l=t[o++],u=t[o++],h=t[o++],c=t[o++],d=t[o++]+c,f=(t[o++],1-t[o++]);1==o&&(i=ev(c)*u+s,r=nv(c)*h+l),ri(s,l,u,h,c,d,f,Km,Qm),e=ev(d)*u+s,n=nv(d)*h+l;break;case Ym.R:ei(i=e=t[o++],r=n=t[o++],i+t[o++],r+t[o++],Km,Qm);break;case Ym.Z:e=i,n=r}K(qm,qm,Km),Q($m,$m,Qm)}return 0===o&&(qm[0]=qm[1]=$m[0]=$m[1]=0),new Xt(qm[0],qm[1],$m[0]-qm[0],$m[1]-qm[1])},rebuildPath:function(t){for(var e,n,i,r,o,a,s=this.data,l=this._ux,u=this._uy,h=this._len,c=0;c<h;){var d=s[c++];switch(1==c&&(e=i=s[c],n=r=s[c+1]),d){case Ym.M:e=i=s[c++],n=r=s[c++],t.moveTo(i,r);break;case Ym.L:o=s[c++],a=s[c++],(rv(o-i)>l||rv(a-r)>u||c===h-1)&&(t.lineTo(o,a),i=o,r=a);break;case Ym.C:t.bezierCurveTo(s[c++],s[c++],s[c++],s[c++],s[c++],s[c++]),i=s[c-2],r=s[c-1];break;case Ym.Q:t.quadraticCurveTo(s[c++],s[c++],s[c++],s[c++]),i=s[c-2],r=s[c-1];break;case Ym.A:var f=s[c++],p=s[c++],g=s[c++],m=s[c++],v=s[c++],y=s[c++],x=s[c++],_=s[c++],w=g>m?g:m,b=g>m?1:g/m,M=g>m?m/g:1,S=v+y;Math.abs(g-m)>.001?(t.translate(f,p),t.rotate(x),t.scale(b,M),t.arc(0,0,w,v,S,1-_),t.scale(1/b,1/M),t.rotate(-x),t.translate(-f,-p)):t.arc(f,p,w,v,S,1-_),1==c&&(e=ev(v)*g+f,n=nv(v)*m+p),i=ev(S)*g+f,r=nv(S)*m+p;break;case Ym.R:e=i=s[c],n=r=s[c+1],t.rect(s[c++],s[c++],s[c++],s[c++]);break;case Ym.Z:t.closePath(),i=e,r=n}}}},av.CMD=Ym;var sv=2*Math.PI,lv=2*Math.PI,uv=av.CMD,hv=2*Math.PI,cv=1e-4,dv=[-1,-1,-1],fv=[-1,-1],pv=Eg.prototype.getCanvasPattern,gv=Math.abs,mv=new av(!0);xi.prototype={constructor:xi,type:"path",__dirtyPath:!0,strokeContainThreshold:5,brush:function(t,e){var n=this.style,i=this.path||mv,r=n.hasStroke(),o=n.hasFill(),a=n.fill,s=n.stroke,l=o&&!!a.colorStops,u=r&&!!s.colorStops,h=o&&!!a.image,c=r&&!!s.image;if(n.bind(t,this,e),this.setTransform(t),this.__dirty){var d;l&&(d=d||this.getBoundingRect(),this._fillGradient=n.getGradient(t,a,d)),u&&(d=d||this.getBoundingRect(),this._strokeGradient=n.getGradient(t,s,d))}l?t.fillStyle=this._fillGradient:h&&(t.fillStyle=pv.call(a,t)),u?t.strokeStyle=this._strokeGradient:c&&(t.strokeStyle=pv.call(s,t));var f=n.lineDash,p=n.lineDashOffset,g=!!t.setLineDash,m=this.getGlobalScale();i.setScale(m[0],m[1]),this.__dirtyPath||f&&!g&&r?(i.beginPath(t),f&&!g&&(i.setLineDash(f),i.setLineDashOffset(p)),this.buildPath(i,this.shape,!1),this.path&&(this.__dirtyPath=!1)):(t.beginPath(),this.path.rebuildPath(t)),o&&i.fill(t),f&&g&&(t.setLineDash(f),t.lineDashOffset=p),r&&i.stroke(t),f&&g&&t.setLineDash([]),null!=n.text&&(this.restoreTransform(t),this.drawRectText(t,this.getBoundingRect()))},buildPath:function(t,e,n){},createPathProxy:function(){this.path=new av},getBoundingRect:function(){var t=this._rect,e=this.style,n=!t;if(n){var i=this.path;i||(i=this.path=new av),this.__dirtyPath&&(i.beginPath(),this.buildPath(i,this.shape,!1)),t=i.getBoundingRect()}if(this._rect=t,e.hasStroke()){var r=this._rectWithStroke||(this._rectWithStroke=t.clone());if(this.__dirty||n){r.copy(t);var o=e.lineWidth,a=e.strokeNoScale?this.getLineScale():1;e.hasFill()||(o=Math.max(o,this.strokeContainThreshold||4)),a>1e-10&&(r.width+=o/a,r.height+=o/a,r.x-=o/a/2,r.y-=o/a/2)}return r}return t},contain:function(t,e){var n=this.transformCoordToLocal(t,e),i=this.getBoundingRect(),r=this.style;if(t=n[0],e=n[1],i.contain(t,e)){var o=this.path.data;if(r.hasStroke()){var a=r.lineWidth,s=r.strokeNoScale?this.getLineScale():1;if(s>1e-10&&(r.hasFill()||(a=Math.max(a,this.strokeContainThreshold)),yi(o,a/s,t,e)))return!0}if(r.hasFill())return vi(o,t,e)}return!1},dirty:function(t){null==t&&(t=!0),t&&(this.__dirtyPath=t,this._rect=null),this.__dirty=!0,this.__zr&&this.__zr.refresh(),this.__clipTarget&&this.__clipTarget.dirty()},animateShape:function(t){return this.animate("shape",t)},attrKV:function(t,e){"shape"===t?(this.setShape(e),this.__dirtyPath=!0,this._rect=null):Xe.prototype.attrKV.call(this,t,e)},setShape:function(t,e){var n=this.shape;if(n){if(w(t))for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);else n[t]=e;this.dirty(!0)}return this},getLineScale:function(){var t=this.transform;return t&&gv(t[0]-1)>1e-10&&gv(t[3]-1)>1e-10?Math.sqrt(gv(t[0]*t[3]-t[2]*t[1])):1}},xi.extend=function(t){var e=function(e){xi.call(this,e),t.style&&this.style.extendFrom(t.style,!1);var n=t.shape;if(n){this.shape=this.shape||{};var i=this.shape;for(var r in n)!i.hasOwnProperty(r)&&n.hasOwnProperty(r)&&(i[r]=n[r])}t.init&&t.init.call(this,e)};u(e,xi);for(var n in t)"style"!==n&&"shape"!==n&&(e.prototype[n]=t[n]);return e},u(xi,Xe);var vv=av.CMD,yv=[[],[],[]],xv=Math.sqrt,_v=Math.atan2,wv=function(t,e){var n,i,r,o,a,s,l=t.data,u=vv.M,h=vv.C,c=vv.L,d=vv.R,f=vv.A,p=vv.Q;for(r=0,o=0;r<l.length;){switch(n=l[r++],o=r,i=0,n){case u:case c:i=1;break;case h:i=3;break;case p:i=2;break;case f:var g=e[4],m=e[5],v=xv(e[0]*e[0]+e[1]*e[1]),y=xv(e[2]*e[2]+e[3]*e[3]),x=_v(-e[1]/y,e[0]/v);l[r]*=v,l[r++]+=g,l[r]*=y,l[r++]+=m,l[r++]*=v,l[r++]*=y,l[r++]+=x,l[r++]+=x,o=r+=2;break;case d:s[0]=l[r++],s[1]=l[r++],$(s,s,e),l[o++]=s[0],l[o++]=s[1],s[0]+=l[r++],s[1]+=l[r++],$(s,s,e),l[o++]=s[0],l[o++]=s[1]}for(a=0;a<i;a++)(s=yv[a])[0]=l[r++],s[1]=l[r++],$(s,s,e),l[o++]=s[0],l[o++]=s[1]}},bv=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"],Mv=Math.sqrt,Sv=Math.sin,Iv=Math.cos,Cv=Math.PI,Tv=function(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])},Dv=function(t,e){return(t[0]*e[0]+t[1]*e[1])/(Tv(t)*Tv(e))},Av=function(t,e){return(t[0]*e[1]<t[1]*e[0]?-1:1)*Math.acos(Dv(t,e))},kv=function(t){Xe.call(this,t)};kv.prototype={constructor:kv,type:"text",brush:function(t,e){var n=this.style;this.__dirty&&De(n),n.fill=n.stroke=n.shadowBlur=n.shadowColor=n.shadowOffsetX=n.shadowOffsetY=null;var i=n.text;null!=i&&(i+=""),n.bind(t,this,e),Ue(i,n)&&(this.setTransform(t),ke(this,t,i,n),this.restoreTransform(t))},getBoundingRect:function(){var t=this.style;if(this.__dirty&&De(t),!this._rect){var e=t.text;null!=e?e+="":e="";var n=ce(t.text+"",t.font,t.textAlign,t.textVerticalAlign,t.textPadding,t.rich);if(n.x+=t.x||0,n.y+=t.y||0,He(t.textStroke,t.textStrokeWidth)){var i=t.textStrokeWidth;n.x-=i/2,n.y-=i/2,n.width+=i,n.height+=i}this._rect=n}return this._rect}},u(kv,Xe);var Pv=xi.extend({type:"circle",shape:{cx:0,cy:0,r:0},buildPath:function(t,e,n){n&&t.moveTo(e.cx+e.r,e.cy),t.arc(e.cx,e.cy,e.r,0,2*Math.PI,!0)}}),Lv=[["shadowBlur",0],["shadowColor","#000"],["shadowOffsetX",0],["shadowOffsetY",0]],Ov=function(t){return bp.browser.ie&&bp.browser.version>=11?function(){var e,n=this.__clipPaths,i=this.style;if(n)for(var r=0;r<n.length;r++){var o=n[r],a=o&&o.shape,s=o&&o.type;if(a&&("sector"===s&&a.startAngle===a.endAngle||"rect"===s&&(!a.width||!a.height))){for(l=0;l<Lv.length;l++)Lv[l][2]=i[Lv[l][0]],i[Lv[l][0]]=Lv[l][1];e=!0;break}}if(t.apply(this,arguments),e)for(var l=0;l<Lv.length;l++)i[Lv[l][0]]=Lv[l][2]}:t},zv=xi.extend({type:"sector",shape:{cx:0,cy:0,r0:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},brush:Ov(xi.prototype.brush),buildPath:function(t,e){var n=e.cx,i=e.cy,r=Math.max(e.r0||0,0),o=Math.max(e.r,0),a=e.startAngle,s=e.endAngle,l=e.clockwise,u=Math.cos(a),h=Math.sin(a);t.moveTo(u*r+n,h*r+i),t.lineTo(u*o+n,h*o+i),t.arc(n,i,o,a,s,!l),t.lineTo(Math.cos(s)*r+n,Math.sin(s)*r+i),0!==r&&t.arc(n,i,r,s,a,l),t.closePath()}}),Ev=xi.extend({type:"ring",shape:{cx:0,cy:0,r:0,r0:0},buildPath:function(t,e){var n=e.cx,i=e.cy,r=2*Math.PI;t.moveTo(n+e.r,i),t.arc(n,i,e.r,0,r,!1),t.moveTo(n+e.r0,i),t.arc(n,i,e.r0,0,r,!0)}}),Nv=function(t,e){for(var n=t.length,i=[],r=0,o=1;o<n;o++)r+=Y(t[o-1],t[o]);var a=r/2;a=a<n?n:a;for(o=0;o<a;o++){var s,l,u,h=o/(a-1)*(e?n:n-1),c=Math.floor(h),d=h-c,f=t[c%n];e?(s=t[(c-1+n)%n],l=t[(c+1)%n],u=t[(c+2)%n]):(s=t[0===c?c:c-1],l=t[c>n-2?n-1:c+1],u=t[c>n-3?n-1:c+2]);var p=d*d,g=d*p;i.push([Ii(s[0],f[0],l[0],u[0],d,p,g),Ii(s[1],f[1],l[1],u[1],d,p,g)])}return i},Rv=function(t,e,n,i){var r,o,a,s,l=[],u=[],h=[],c=[];if(i){a=[1/0,1/0],s=[-1/0,-1/0];for(var d=0,f=t.length;d<f;d++)K(a,a,t[d]),Q(s,s,t[d]);K(a,a,i[0]),Q(s,s,i[1])}for(var d=0,f=t.length;d<f;d++){var p=t[d];if(n)r=t[d?d-1:f-1],o=t[(d+1)%f];else{if(0===d||d===f-1){l.push(F(t[d]));continue}r=t[d-1],o=t[d+1]}W(u,o,r),X(u,u,e);var g=Y(p,r),m=Y(p,o),v=g+m;0!==v&&(g/=v,m/=v),X(h,u,-g),X(c,u,m);var y=H([],p,h),x=H([],p,c);i&&(Q(y,y,a),K(y,y,s),Q(x,x,a),K(x,x,s)),l.push(y),l.push(x)}return n&&l.push(l.shift()),l},Bv=xi.extend({type:"polygon",shape:{points:null,smooth:!1,smoothConstraint:null},buildPath:function(t,e){Ci(t,e,!0)}}),Vv=xi.extend({type:"polyline",shape:{points:null,smooth:!1,smoothConstraint:null},style:{stroke:"#000",fill:null},buildPath:function(t,e){Ci(t,e,!1)}}),Fv=xi.extend({type:"rect",shape:{r:0,x:0,y:0,width:0,height:0},buildPath:function(t,e){var n=e.x,i=e.y,r=e.width,o=e.height;e.r?Te(t,e):t.rect(n,i,r,o),t.closePath()}}),Hv=xi.extend({type:"line",shape:{x1:0,y1:0,x2:0,y2:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var n=e.x1,i=e.y1,r=e.x2,o=e.y2,a=e.percent;0!==a&&(t.moveTo(n,i),a<1&&(r=n*(1-a)+r*a,o=i*(1-a)+o*a),t.lineTo(r,o))},pointAt:function(t){var e=this.shape;return[e.x1*(1-t)+e.x2*t,e.y1*(1-t)+e.y2*t]}}),Gv=[],Wv=xi.extend({type:"bezier-curve",shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var n=e.x1,i=e.y1,r=e.x2,o=e.y2,a=e.cpx1,s=e.cpy1,l=e.cpx2,u=e.cpy2,h=e.percent;0!==h&&(t.moveTo(n,i),null==l||null==u?(h<1&&(Qn(n,a,r,h,Gv),a=Gv[1],r=Gv[2],Qn(i,s,o,h,Gv),s=Gv[1],o=Gv[2]),t.quadraticCurveTo(a,s,r,o)):(h<1&&(Xn(n,a,l,r,h,Gv),a=Gv[1],l=Gv[2],r=Gv[3],Xn(i,s,u,o,h,Gv),s=Gv[1],u=Gv[2],o=Gv[3]),t.bezierCurveTo(a,s,l,u,r,o)))},pointAt:function(t){return Ti(this.shape,t,!1)},tangentAt:function(t){var e=Ti(this.shape,t,!0);return j(e,e)}}),Zv=xi.extend({type:"arc",shape:{cx:0,cy:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},style:{stroke:"#000",fill:null},buildPath:function(t,e){var n=e.cx,i=e.cy,r=Math.max(e.r,0),o=e.startAngle,a=e.endAngle,s=e.clockwise,l=Math.cos(o),u=Math.sin(o);t.moveTo(l*r+n,u*r+i),t.arc(n,i,r,o,a,!s)}}),Uv=xi.extend({type:"compound",shape:{paths:null},_updatePathDirty:function(){for(var t=this.__dirtyPath,e=this.shape.paths,n=0;n<e.length;n++)t=t||e[n].__dirtyPath;this.__dirtyPath=t,this.__dirty=this.__dirty||t},beforeBrush:function(){this._updatePathDirty();for(var t=this.shape.paths||[],e=this.getGlobalScale(),n=0;n<t.length;n++)t[n].path||t[n].createPathProxy(),t[n].path.setScale(e[0],e[1])},buildPath:function(t,e){for(var n=e.paths||[],i=0;i<n.length;i++)n[i].buildPath(t,n[i].shape,!0)},afterBrush:function(){for(var t=this.shape.paths||[],e=0;e<t.length;e++)t[e].__dirtyPath=!1},getBoundingRect:function(){return this._updatePathDirty(),xi.prototype.getBoundingRect.call(this)}}),Xv=function(t){this.colorStops=t||[]};Xv.prototype={constructor:Xv,addColorStop:function(t,e){this.colorStops.push({offset:t,color:e})}};var jv=function(t,e,n,i,r,o){this.x=null==t?0:t,this.y=null==e?0:e,this.x2=null==n?1:n,this.y2=null==i?0:i,this.type="linear",this.global=o||!1,Xv.call(this,r)};jv.prototype={constructor:jv},u(jv,Xv);var Yv=function(t,e,n,i,r){this.x=null==t?.5:t,this.y=null==e?.5:e,this.r=null==n?.5:n,this.type="radial",this.global=r||!1,Xv.call(this,i)};Yv.prototype={constructor:Yv},u(Yv,Xv),Di.prototype.incremental=!0,Di.prototype.clearDisplaybles=function(){this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.dirty(),this.notClear=!1},Di.prototype.addDisplayable=function(t,e){e?this._temporaryDisplayables.push(t):this._displayables.push(t),this.dirty()},Di.prototype.addDisplayables=function(t,e){e=e||!1;for(var n=0;n<t.length;n++)this.addDisplayable(t[n],e)},Di.prototype.eachPendingDisplayable=function(t){for(e=this._cursor;e<this._displayables.length;e++)t&&t(this._displayables[e]);for(var e=0;e<this._temporaryDisplayables.length;e++)t&&t(this._temporaryDisplayables[e])},Di.prototype.update=function(){this.updateTransform();for(t=this._cursor;t<this._displayables.length;t++)(e=this._displayables[t]).parent=this,e.update(),e.parent=null;for(var t=0;t<this._temporaryDisplayables.length;t++){var e=this._temporaryDisplayables[t];e.parent=this,e.update(),e.parent=null}},Di.prototype.brush=function(t,e){for(n=this._cursor;n<this._displayables.length;n++)(i=this._displayables[n]).beforeBrush&&i.beforeBrush(t),i.brush(t,n===this._cursor?null:this._displayables[n-1]),i.afterBrush&&i.afterBrush(t);this._cursor=n;for(var n=0;n<this._temporaryDisplayables.length;n++){var i=this._temporaryDisplayables[n];i.beforeBrush&&i.beforeBrush(t),i.brush(t,0===n?null:this._temporaryDisplayables[n-1]),i.afterBrush&&i.afterBrush(t)}this._temporaryDisplayables=[],this.notClear=!0};var qv=[];Di.prototype.getBoundingRect=function(){if(!this._rect){for(var t=new Xt(1/0,1/0,-1/0,-1/0),e=0;e<this._displayables.length;e++){var n=this._displayables[e],i=n.getBoundingRect().clone();n.needLocalTransform()&&i.applyTransform(n.getLocalTransform(qv)),t.union(i)}this._rect=t}return this._rect},Di.prototype.contain=function(t,e){var n=this.transformCoordToLocal(t,e);if(this.getBoundingRect().contain(n[0],n[1]))for(var i=0;i<this._displayables.length;i++)if(this._displayables[i].contain(t,e))return!0;return!1},u(Di,Xe);var $v=Math.round,Kv=Math.max,Qv=Math.min,Jv={},ty=(Object.freeze||Object)({extendShape:Ai,extendPath:function(t,e){return Si(t,e)},makePath:ki,makeImage:Pi,mergePath:function(t,e){for(var n=[],i=t.length,r=0;r<i;r++){var o=t[r];o.path||o.createPathProxy(),o.__dirtyPath&&o.buildPath(o.path,o.shape,!0),n.push(o.path)}var a=new xi(e);return a.createPathProxy(),a.buildPath=function(t){t.appendPath(n);var e=t.getContext();e&&t.rebuildPath(e)},a},resizePath:Oi,subPixelOptimizeLine:zi,subPixelOptimizeRect:Ei,subPixelOptimize:Ni,setHoverStyle:qi,setLabelStyle:$i,setTextStyle:Ki,setText:function(t,e,n){var i,r={isRectText:!0};!1===n?i=!0:r.autoColor=n,Qi(t,e,r,i),t.host&&t.host.dirty&&t.host.dirty(!1)},getFont:rr,updateProps:ar,initProps:sr,getTransform:lr,applyTransform:ur,transformDirection:hr,groupTransition:cr,clipPointsByRect:dr,clipRectByRect:function(t,e){var n=Kv(t.x,e.x),i=Qv(t.x+t.width,e.x+e.width),r=Kv(t.y,e.y),o=Qv(t.y+t.height,e.y+e.height);if(i>=n&&o>=r)return{x:n,y:r,width:i-n,height:o-r}},createIcon:fr,Group:Sg,Image:je,Text:kv,Circle:Pv,Sector:zv,Ring:Ev,Polygon:Bv,Polyline:Vv,Rect:Fv,Line:Hv,BezierCurve:Wv,Arc:Zv,IncrementalDisplayable:Di,CompoundPath:Uv,LinearGradient:jv,RadialGradient:Yv,BoundingRect:Xt}),ey=["textStyle","color"],ny={getTextColor:function(t){var e=this.ecModel;return this.getShallow("color")||(!t&&e?e.get(ey):null)},getFont:function(){return rr({fontStyle:this.getShallow("fontStyle"),fontWeight:this.getShallow("fontWeight"),fontSize:this.getShallow("fontSize"),fontFamily:this.getShallow("fontFamily")},this.ecModel)},getTextRect:function(t){return ce(t,this.getFont(),this.getShallow("align"),this.getShallow("verticalAlign")||this.getShallow("baseline"),this.getShallow("padding"),this.getShallow("rich"),this.getShallow("truncateText"))}},iy=Sm([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["textPosition"],["textAlign"]]),ry={getItemStyle:function(t,e){var n=iy(this,t,e),i=this.getBorderLineDash();return i&&(n.lineDash=i),n},getBorderLineDash:function(){var t=this.get("borderType");return"solid"===t||null==t?null:"dashed"===t?[5,5]:[1,1]}},oy=h,ay=Dn();pr.prototype={constructor:pr,init:null,mergeOption:function(t){i(this.option,t,!0)},get:function(t,e){return null==t?this.option:gr(this.option,this.parsePath(t),!e&&mr(this,t))},getShallow:function(t,e){var n=this.option,i=null==n?n:n[t],r=!e&&mr(this,t);return null==i&&r&&(i=r.getShallow(t)),i},getModel:function(t,e){var n,i=null==t?this.option:gr(this.option,t=this.parsePath(t));return e=e||(n=mr(this,t))&&n.getModel(t),new pr(i,e,this.ecModel)},isEmpty:function(){return null==this.option},restoreData:function(){},clone:function(){return new(0,this.constructor)(n(this.option))},setReadOnly:function(t){},parsePath:function(t){return"string"==typeof t&&(t=t.split(".")),t},customizeGetParent:function(t){ay(this).getParent=t},isAnimationEnabled:function(){if(!bp.node){if(null!=this.option.animation)return!!this.option.animation;if(this.parentModel)return this.parentModel.isAnimationEnabled()}}},En(pr),Nn(pr),oy(pr,Cm),oy(pr,Dm),oy(pr,ny),oy(pr,ry);var sy=0,ly=1e-4,uy=/^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d\d)(?::(\d\d)(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/,hy=(Object.freeze||Object)({linearMap:xr,parsePercent:_r,round:wr,asc:br,getPrecision:Mr,getPrecisionSafe:Sr,getPixelPrecision:Ir,getPercentWithPrecision:Cr,MAX_SAFE_INTEGER:9007199254740991,remRadian:Tr,isRadianAroundZero:Dr,parseDate:Ar,quantity:kr,nice:Lr,reformIntervals:function(t){function e(t,n,i){return t.interval[i]<n.interval[i]||t.interval[i]===n.interval[i]&&(t.close[i]-n.close[i]==(i?-1:1)||!i&&e(t,n,1))}t.sort(function(t,n){return e(t,n,0)?-1:1});for(var n=-1/0,i=1,r=0;r<t.length;){for(var o=t[r].interval,a=t[r].close,s=0;s<2;s++)o[s]<=n&&(o[s]=n,a[s]=s?1:1-i),n=o[s],i=a[s];o[0]===o[1]&&a[0]*a[1]!=1?t.splice(r,1):r++}return t},isNumeric:function(t){return t-parseFloat(t)>=0}}),cy=k,dy=/([&<>"'])/g,fy={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},py=["a","b","c","d","e","f","g"],gy=function(t,e){return"{"+t+(null==e?"":e)+"}"},my=ve,vy=ce,yy=(Object.freeze||Object)({addCommas:Or,toCamelCase:zr,normalizeCssArray:cy,encodeHTML:Er,formatTpl:Nr,formatTplSimple:function(t,e,n){return d(e,function(e,i){t=t.replace("{"+i+"}",n?Er(e):e)}),t},getTooltipMarker:Rr,formatTime:Vr,capitalFirst:Fr,truncateText:my,getTextRect:vy}),xy=d,_y=["left","right","top","bottom","width","height"],wy=[["width","left","right"],["height","top","bottom"]],by=Hr,My=(v(Hr,"vertical"),v(Hr,"horizontal"),{getBoxLayoutParams:function(){return{left:this.get("left"),top:this.get("top"),right:this.get("right"),bottom:this.get("bottom"),width:this.get("width"),height:this.get("height")}}}),Sy=Dn(),Iy=pr.extend({type:"component",id:"",name:"",mainType:"",subType:"",componentIndex:0,defaultOption:null,ecModel:null,dependentModels:[],uid:null,layoutMode:null,$constructor:function(t,e,n,i){pr.call(this,t,e,n,i),this.uid=vr("ec_cpt_model")},init:function(t,e,n,i){this.mergeDefaultAndTheme(t,n)},mergeDefaultAndTheme:function(t,e){var n=this.layoutMode,r=n?Ur(t):{};i(t,e.getTheme().get(this.mainType)),i(t,this.getDefaultOption()),n&&Zr(t,r,n)},mergeOption:function(t,e){i(this.option,t,!0);var n=this.layoutMode;n&&Zr(this.option,t,n)},optionUpdated:function(t,e){},getDefaultOption:function(){var t=Sy(this);if(!t.defaultOption){for(var e=[],n=this.constructor;n;){var r=n.prototype.defaultOption;r&&e.push(r),n=n.superClass}for(var o={},a=e.length-1;a>=0;a--)o=i(o,e[a],!0);t.defaultOption=o}return t.defaultOption},getReferringComponents:function(t){return this.ecModel.queryComponents({mainType:t,index:this.get(t+"Index",!0),id:this.get(t+"Id",!0)})}});Vn(Iy,{registerWhenExtend:!0}),function(t){var e={};t.registerSubTypeDefaulter=function(t,n){t=On(t),e[t.main]=n},t.determineSubType=function(n,i){var r=i.type;if(!r){var o=On(n).main;t.hasSubTypes(n)&&e[o]&&(r=e[o](i))}return r}}(Iy),function(t,e){function n(t){var n={},o=[];return d(t,function(a){var s=i(n,a),u=r(s.originalDeps=e(a),t);s.entryCount=u.length,0===s.entryCount&&o.push(a),d(u,function(t){l(s.predecessor,t)<0&&s.predecessor.push(t);var e=i(n,t);l(e.successor,t)<0&&e.successor.push(a)})}),{graph:n,noEntryList:o}}function i(t,e){return t[e]||(t[e]={predecessor:[],successor:[]}),t[e]}function r(t,e){var n=[];return d(t,function(t){l(e,t)>=0&&n.push(t)}),n}t.topologicalTravel=function(t,e,i,r){function o(t){s[t].entryCount--,0===s[t].entryCount&&l.push(t)}if(t.length){var a=n(e),s=a.graph,l=a.noEntryList,u={};for(d(t,function(t){u[t]=!0});l.length;){var h=l.pop(),c=s[h],f=!!u[h];f&&(i.call(r,h,c.originalDeps.slice()),delete u[h]),d(c.successor,f?function(t){u[t]=!0,o(t)}:o)}d(u,function(){throw new Error("Circle dependency may exists")})}}}(Iy,function(t){var e=[];return d(Iy.getClassesByMainType(t),function(t){e=e.concat(t.prototype.dependencies||[])}),e=f(e,function(t){return On(t).main}),"dataset"!==t&&l(e,"dataset")<=0&&e.unshift("dataset"),e}),h(Iy,My);var Cy="";"undefined"!=typeof navigator&&(Cy=navigator.platform||"");var Ty={color:["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],gradientColor:["#f6efa6","#d88273","#bf444c"],textStyle:{fontFamily:Cy.match(/^Win/)?"Microsoft YaHei":"sans-serif",fontSize:12,fontStyle:"normal",fontWeight:"normal"},blendMode:null,animation:"auto",animationDuration:1e3,animationDurationUpdate:300,animationEasing:"exponentialOut",animationEasingUpdate:"cubicOut",animationThreshold:2e3,progressiveThreshold:3e3,progressive:400,hoverLayerThreshold:3e3,useUTC:!1},Dy=Dn(),Ay={clearColorPalette:function(){Dy(this).colorIdx=0,Dy(this).colorNameMap={}},getColorFromPalette:function(t,e,n){var i=Dy(e=e||this),r=i.colorIdx||0,o=i.colorNameMap=i.colorNameMap||{};if(o.hasOwnProperty(t))return o[t];var a=xn(this.get("color",!0)),s=this.get("colorLayer",!0),l=null!=n&&s?jr(s,n):a;if((l=l||a)&&l.length){var u=l[r];return t&&(o[t]=u),i.colorIdx=(r+1)%l.length,u}}},ky={cartesian2d:function(t,e,n,i){var r=t.getReferringComponents("xAxis")[0],o=t.getReferringComponents("yAxis")[0];e.coordSysDims=["x","y"],n.set("x",r),n.set("y",o),qr(r)&&(i.set("x",r),e.firstCategoryDimIndex=0),qr(o)&&(i.set("y",o),e.firstCategoryDimIndex=1)},singleAxis:function(t,e,n,i){var r=t.getReferringComponents("singleAxis")[0];e.coordSysDims=["single"],n.set("single",r),qr(r)&&(i.set("single",r),e.firstCategoryDimIndex=0)},polar:function(t,e,n,i){var r=t.getReferringComponents("polar")[0],o=r.findAxisModel("radiusAxis"),a=r.findAxisModel("angleAxis");e.coordSysDims=["radius","angle"],n.set("radius",o),n.set("angle",a),qr(o)&&(i.set("radius",o),e.firstCategoryDimIndex=0),qr(a)&&(i.set("angle",a),e.firstCategoryDimIndex=1)},geo:function(t,e,n,i){e.coordSysDims=["lng","lat"]},parallel:function(t,e,n,i){var r=t.ecModel,o=r.getComponent("parallel",t.get("parallelIndex")),a=e.coordSysDims=o.dimensions.slice();d(o.parallelAxisIndex,function(t,o){var s=r.getComponent("parallelAxis",t),l=a[o];n.set(l,s),qr(s)&&null==e.firstCategoryDimIndex&&(i.set(l,s),e.firstCategoryDimIndex=o)})}},Py="original",Ly="arrayRows",Oy="objectRows",zy="keyedColumns",Ey="unknown",Ny="typedArray",Ry="column",By="row";$r.seriesDataToSource=function(t){return new $r({data:t,sourceFormat:M(t)?Ny:Py,fromDataset:!1})},Nn($r);var Vy=Dn(),Fy="\0_ec_inner",Hy=pr.extend({init:function(t,e,n,i){n=n||{},this.option=null,this._theme=new pr(n),this._optionManager=i},setOption:function(t,e){P(!(Fy in t),"please use chart.getOption()"),this._optionManager.setOption(t,e),this.resetOption(null)},resetOption:function(t){var e=!1,n=this._optionManager;if(!t||"recreate"===t){var i=n.mountOption("recreate"===t);this.option&&"recreate"!==t?(this.restoreData(),this.mergeOption(i)):co.call(this,i),e=!0}if("timeline"!==t&&"media"!==t||this.restoreData(),!t||"recreate"===t||"timeline"===t){var r=n.getTimelineOption(this);r&&(this.mergeOption(r),e=!0)}if(!t||"recreate"===t||"media"===t){var o=n.getMediaOption(this,this._api);o.length&&d(o,function(t){this.mergeOption(t,e=!0)},this)}return e},mergeOption:function(t){var e=this.option,r=this._componentsMap,a=[];Jr(this),d(t,function(t,r){null!=t&&(Iy.hasClass(r)?r&&a.push(r):e[r]=null==e[r]?n(t):i(e[r],t,!0))}),Iy.topologicalTravel(a,Iy.getAllClassMainTypes(),function(n,i){var a=xn(t[n]),s=Mn(r.get(n),a);Sn(s),d(s,function(t,e){var i=t.option;w(i)&&(t.keyInfo.mainType=n,t.keyInfo.subType=po(n,i,t.exist))});var l=fo(r,i);e[n]=[],r.set(n,[]),d(s,function(t,i){var a=t.exist,s=t.option;if(P(w(s)||a,"Empty component definition"),s){var u=Iy.getClass(n,t.keyInfo.subType,!0);if(a&&a instanceof u)a.name=t.keyInfo.name,a.mergeOption(s,this),a.optionUpdated(s,!1);else{var h=o({dependentModels:l,componentIndex:i},t.keyInfo);o(a=new u(s,this,this,h),h),a.init(s,this,this,h),a.optionUpdated(null,!0)}}else a.mergeOption({},this),a.optionUpdated({},!1);r.get(n)[i]=a,e[n][i]=a.option},this),"series"===n&&go(this,r.get("series"))},this),this._seriesIndicesMap=N(this._seriesIndices=this._seriesIndices||[])},getOption:function(){var t=n(this.option);return d(t,function(e,n){if(Iy.hasClass(n)){for(var i=(e=xn(e)).length-1;i>=0;i--)Cn(e[i])&&e.splice(i,1);t[n]=e}}),delete t[Fy],t},getTheme:function(){return this._theme},getComponent:function(t,e){var n=this._componentsMap.get(t);if(n)return n[e||0]},queryComponents:function(t){var e=t.mainType;if(!e)return[];var n=t.index,i=t.id,r=t.name,o=this._componentsMap.get(e);if(!o||!o.length)return[];var a;if(null!=n)y(n)||(n=[n]),a=g(f(n,function(t){return o[t]}),function(t){return!!t});else if(null!=i){var s=y(i);a=g(o,function(t){return s&&l(i,t.id)>=0||!s&&t.id===i})}else if(null!=r){var u=y(r);a=g(o,function(t){return u&&l(r,t.name)>=0||!u&&t.name===r})}else a=o.slice();return mo(a,t)},findComponents:function(t){var e=t.query,n=t.mainType,i=function(t){var e=n+"Index",i=n+"Id",r=n+"Name";return!t||null==t[e]&&null==t[i]&&null==t[r]?null:{mainType:n,index:t[e],id:t[i],name:t[r]}}(e);return function(e){return t.filter?g(e,t.filter):e}(mo(i?this.queryComponents(i):this._componentsMap.get(n),t))},eachComponent:function(t,e,n){var i=this._componentsMap;"function"==typeof t?(n=e,e=t,i.each(function(t,i){d(t,function(t,r){e.call(n,i,t,r)})})):_(t)?d(i.get(t),e,n):w(t)&&d(this.findComponents(t),e,n)},getSeriesByName:function(t){return g(this._componentsMap.get("series"),function(e){return e.name===t})},getSeriesByIndex:function(t){return this._componentsMap.get("series")[t]},getSeriesByType:function(t){return g(this._componentsMap.get("series"),function(e){return e.subType===t})},getSeries:function(){return this._componentsMap.get("series").slice()},getSeriesCount:function(){return this._componentsMap.get("series").length},eachSeries:function(t,e){d(this._seriesIndices,function(n){var i=this._componentsMap.get("series")[n];t.call(e,i,n)},this)},eachRawSeries:function(t,e){d(this._componentsMap.get("series"),t,e)},eachSeriesByType:function(t,e,n){d(this._seriesIndices,function(i){var r=this._componentsMap.get("series")[i];r.subType===t&&e.call(n,r,i)},this)},eachRawSeriesByType:function(t,e,n){return d(this.getSeriesByType(t),e,n)},isSeriesFiltered:function(t){return null==this._seriesIndicesMap.get(t.componentIndex)},getCurrentSeriesIndices:function(){return(this._seriesIndices||[]).slice()},filterSeries:function(t,e){go(this,g(this._componentsMap.get("series"),t,e))},restoreData:function(t){var e=this._componentsMap;go(this,e.get("series"));var n=[];e.each(function(t,e){n.push(e)}),Iy.topologicalTravel(n,Iy.getAllClassMainTypes(),function(n,i){d(e.get(n),function(e){("series"!==n||!uo(e,t))&&e.restoreData()})})}});h(Hy,Ay);var Gy=["getDom","getZr","getWidth","getHeight","getDevicePixelRatio","dispatchAction","isDisposed","on","off","getDataURL","getConnectedDataURL","getModel","getOption","getViewOfComponentModel","getViewOfSeriesModel"],Wy={};yo.prototype={constructor:yo,create:function(t,e){var n=[];d(Wy,function(i,r){var o=i.create(t,e);n=n.concat(o||[])}),this._coordinateSystems=n},update:function(t,e){d(this._coordinateSystems,function(n){n.update&&n.update(t,e)})},getCoordinateSystems:function(){return this._coordinateSystems.slice()}},yo.register=function(t,e){Wy[t]=e},yo.get=function(t){return Wy[t]};var Zy=d,Uy=n,Xy=f,jy=i,Yy=/^(min|max)?(.+)$/;xo.prototype={constructor:xo,setOption:function(t,e){t&&d(xn(t.series),function(t){t&&t.data&&M(t.data)&&O(t.data)}),t=Uy(t,!0);var n=this._optionBackup,i=_o.call(this,t,e,!n);this._newBaseOption=i.baseOption,n?(So(n.baseOption,i.baseOption),i.timelineOptions.length&&(n.timelineOptions=i.timelineOptions),i.mediaList.length&&(n.mediaList=i.mediaList),i.mediaDefault&&(n.mediaDefault=i.mediaDefault)):this._optionBackup=i},mountOption:function(t){var e=this._optionBackup;return this._timelineOptions=Xy(e.timelineOptions,Uy),this._mediaList=Xy(e.mediaList,Uy),this._mediaDefault=Uy(e.mediaDefault),this._currentMediaIndices=[],Uy(t?e.baseOption:this._newBaseOption)},getTimelineOption:function(t){var e,n=this._timelineOptions;if(n.length){var i=t.getComponent("timeline");i&&(e=Uy(n[i.getCurrentIndex()],!0))}return e},getMediaOption:function(t){var e=this._api.getWidth(),n=this._api.getHeight(),i=this._mediaList,r=this._mediaDefault,o=[],a=[];if(!i.length&&!r)return a;for(var s=0,l=i.length;s<l;s++)wo(i[s].query,e,n)&&o.push(s);return!o.length&&r&&(o=[-1]),o.length&&!Mo(o,this._currentMediaIndices)&&(a=Xy(o,function(t){return Uy(-1===t?r.option:i[t].option)})),this._currentMediaIndices=o,a}};var qy=d,$y=w,Ky=["areaStyle","lineStyle","nodeStyle","linkStyle","chordStyle","label","labelLine"],Qy=function(t,e){qy(Po(t.series),function(t){$y(t)&&ko(t)});var n=["xAxis","yAxis","radiusAxis","angleAxis","singleAxis","parallelAxis","radar"];e&&n.push("valueAxis","categoryAxis","logAxis","timeAxis"),qy(n,function(e){qy(Po(t[e]),function(t){t&&(Do(t,"axisLabel"),Do(t.axisPointer,"label"))})}),qy(Po(t.parallel),function(t){var e=t&&t.parallelAxisDefault;Do(e,"axisLabel"),Do(e&&e.axisPointer,"label")}),qy(Po(t.calendar),function(t){Co(t,"itemStyle"),Do(t,"dayLabel"),Do(t,"monthLabel"),Do(t,"yearLabel")}),qy(Po(t.radar),function(t){Do(t,"name")}),qy(Po(t.geo),function(t){$y(t)&&(Ao(t),qy(Po(t.regions),function(t){Ao(t)}))}),qy(Po(t.timeline),function(t){Ao(t),Co(t,"label"),Co(t,"itemStyle"),Co(t,"controlStyle",!0);var e=t.data;y(e)&&d(e,function(t){w(t)&&(Co(t,"label"),Co(t,"itemStyle"))})}),qy(Po(t.toolbox),function(t){Co(t,"iconStyle"),qy(t.feature,function(t){Co(t,"iconStyle")})}),Do(Lo(t.axisPointer),"label"),Do(Lo(t.tooltip).axisPointer,"label")},Jy=[["x","left"],["y","top"],["x2","right"],["y2","bottom"]],tx=["grid","geo","parallel","legend","toolbox","title","visualMap","dataZoom","timeline"],ex=function(t,e){Qy(t,e),t.series=xn(t.series),d(t.series,function(t){if(w(t)){var e=t.type;if("pie"!==e&&"gauge"!==e||null!=t.clockWise&&(t.clockwise=t.clockWise),"gauge"===e){var n=Oo(t,"pointer.color");null!=n&&zo(t,"itemStyle.normal.color",n)}Eo(t)}}),t.dataRange&&(t.visualMap=t.dataRange),d(tx,function(e){var n=t[e];n&&(y(n)||(n=[n]),d(n,function(t){Eo(t)}))})},nx=Ro.prototype;nx.pure=!1,nx.persistent=!0,nx.getSource=function(){return this._source};var ix={arrayRows_column:{pure:!0,count:function(){return Math.max(0,this._data.length-this._source.startIndex)},getItem:function(t){return this._data[t+this._source.startIndex]},appendData:Fo},arrayRows_row:{pure:!0,count:function(){var t=this._data[0];return t?Math.max(0,t.length-this._source.startIndex):0},getItem:function(t){t+=this._source.startIndex;for(var e=[],n=this._data,i=0;i<n.length;i++){var r=n[i];e.push(r?r[t]:null)}return e},appendData:function(){throw new Error('Do not support appendData when set seriesLayoutBy: "row".')}},objectRows:{pure:!0,count:Bo,getItem:Vo,appendData:Fo},keyedColumns:{pure:!0,count:function(){var t=this._source.dimensionsDefine[0].name,e=this._data[t];return e?e.length:0},getItem:function(t){for(var e=[],n=this._source.dimensionsDefine,i=0;i<n.length;i++){var r=this._data[n[i].name];e.push(r?r[t]:null)}return e},appendData:function(t){var e=this._data;d(t,function(t,n){for(var i=e[n]||(e[n]=[]),r=0;r<(t||[]).length;r++)i.push(t[r])})}},original:{count:Bo,getItem:Vo,appendData:Fo},typedArray:{persistent:!1,pure:!0,count:function(){return this._data?this._data.length/this._dimSize:0},getItem:function(t,e){t-=this._offset,e=e||[];for(var n=this._dimSize*t,i=0;i<this._dimSize;i++)e[i]=this._data[n+i];return e},appendData:function(t){this._data=t},clean:function(){this._offset+=this.count(),this._data=null}}},rx={arrayRows:Ho,objectRows:function(t,e,n,i){return null!=n?t[i]:t},keyedColumns:Ho,original:function(t,e,n,i){var r=wn(t);return null!=n&&r instanceof Array?r[n]:r},typedArray:Ho},ox={arrayRows:Go,objectRows:function(t,e,n,i){return Wo(t[e],this._dimensionInfos[e])},keyedColumns:Go,original:function(t,e,n,i){var r=t&&(null==t.value?t:t.value);return!this._rawData.pure&&bn(t)&&(this.hasItemOption=!0),Wo(r instanceof Array?r[i]:r,this._dimensionInfos[e])},typedArray:function(t,e,n,i){return t[i]}},ax=/\{@(.+?)\}/g,sx={getDataParams:function(t,e){var n=this.getData(e),i=this.getRawValue(t,e),r=n.getRawIndex(t),o=n.getName(t),a=n.getRawDataItem(t),s=n.getItemVisual(t,"color");return{componentType:this.mainType,componentSubType:this.subType,seriesType:"series"===this.mainType?this.subType:null,seriesIndex:this.seriesIndex,seriesId:this.id,seriesName:this.name,name:o,dataIndex:r,data:a,dataType:e,value:i,color:s,marker:Rr(s),$vars:["seriesName","name","value"]}},getFormattedLabel:function(t,e,n,i,r){e=e||"normal";var o=this.getData(n),a=o.getItemModel(t),s=this.getDataParams(t,n);null!=i&&s.value instanceof Array&&(s.value=s.value[i]);var l=a.get("normal"===e?[r||"label","formatter"]:[e,r||"label","formatter"]);return"function"==typeof l?(s.status=e,l(s)):"string"==typeof l?Nr(l,s).replace(ax,function(e,n){var i=n.length;return"["===n.charAt(0)&&"]"===n.charAt(i-1)&&(n=+n.slice(1,i-1)),Zo(o,t,n)}):void 0},getRawValue:function(t,e){return Zo(this.getData(e),t)},formatTooltip:function(){}},lx=jo.prototype;lx.perform=function(t){function e(t){return!(t>=1)&&(t=1),t}var n=this._upstream,i=t&&t.skip;if(this._dirty&&n){var r=this.context;r.data=r.outputData=n.context.outputData}this.__pipeline&&(this.__pipeline.currentTask=this);var o;this._plan&&!i&&(o=this._plan(this.context));var a=e(this._modBy),s=this._modDataCount||0,l=e(t&&t.modBy),u=t&&t.modDataCount||0;a===l&&s===u||(o="reset");var h;(this._dirty||"reset"===o)&&(this._dirty=!1,h=qo(this,i)),this._modBy=l,this._modDataCount=u;var c=t&&t.step;if(this._dueEnd=n?n._outputDueEnd:this._count?this._count(this.context):1/0,this._progress){var d=this._dueIndex,f=Math.min(null!=c?this._dueIndex+c:1/0,this._dueEnd);if(!i&&(h||d<f)){var p=this._progress;if(y(p))for(var g=0;g<p.length;g++)Yo(this,p[g],d,f,l,u);else Yo(this,p,d,f,l,u)}this._dueIndex=f;var m=null!=this._settedOutputEnd?this._settedOutputEnd:f;this._outputDueEnd=m}else this._dueIndex=this._outputDueEnd=null!=this._settedOutputEnd?this._settedOutputEnd:this._dueEnd;return this.unfinished()};var ux=function(){function t(){return i<n?i++:null}function e(){var t=i%a*r+Math.ceil(i/a),e=i>=n?null:t<o?t:i;return i++,e}var n,i,r,o,a,s={reset:function(l,u,h,c){i=l,n=u,r=h,o=c,a=Math.ceil(o/r),s.next=r>1&&o>0?e:t}};return s}();lx.dirty=function(){this._dirty=!0,this._onDirty&&this._onDirty(this.context)},lx.unfinished=function(){return this._progress&&this._dueIndex<this._dueEnd},lx.pipe=function(t){(this._downstream!==t||this._dirty)&&(this._downstream=t,t._upstream=this,t.dirty())},lx.dispose=function(){this._disposed||(this._upstream&&(this._upstream._downstream=null),this._downstream&&(this._downstream._upstream=null),this._dirty=!1,this._disposed=!0)},lx.getUpstream=function(){return this._upstream},lx.getDownstream=function(){return this._downstream},lx.setOutputEnd=function(t){this._outputDueEnd=this._settedOutputEnd=t};var hx=Dn(),cx=Iy.extend({type:"series.__base__",seriesIndex:0,coordinateSystem:null,defaultOption:null,legendDataProvider:null,visualColorAccessPath:"itemStyle.color",layoutMode:null,init:function(t,e,n,i){this.seriesIndex=this.componentIndex,this.dataTask=Xo({count:Qo,reset:Jo}),this.dataTask.context={model:this},this.mergeDefaultAndTheme(t,n),to(this);var r=this.getInitialData(t,n);ea(r,this),this.dataTask.context.data=r,hx(this).dataBeforeProcessed=r,$o(this)},mergeDefaultAndTheme:function(t,e){var n=this.layoutMode,r=n?Ur(t):{},o=this.subType;Iy.hasClass(o)&&(o+="Series"),i(t,e.getTheme().get(this.subType)),i(t,this.getDefaultOption()),_n(t,"label",["show"]),this.fillDataTextStyle(t.data),n&&Zr(t,r,n)},mergeOption:function(t,e){t=i(this.option,t,!0),this.fillDataTextStyle(t.data);var n=this.layoutMode;n&&Zr(this.option,t,n),to(this);var r=this.getInitialData(t,e);ea(r,this),this.dataTask.dirty(),this.dataTask.context.data=r,hx(this).dataBeforeProcessed=r,$o(this)},fillDataTextStyle:function(t){if(t&&!M(t))for(var e=["show"],n=0;n<t.length;n++)t[n]&&t[n].label&&_n(t[n],"label",e)},getInitialData:function(){},appendData:function(t){this.getRawData().appendData(t.data)},getData:function(t){var e=ia(this);if(e){var n=e.context.data;return null==t?n:n.getLinkedData(t)}return hx(this).data},setData:function(t){var e=ia(this);if(e){var n=e.context;n.data!==t&&e.modifyOutputEnd&&e.setOutputEnd(t.count()),n.outputData=t,e!==this.dataTask&&(n.data=t)}hx(this).data=t},getSource:function(){return Qr(this)},getRawData:function(){return hx(this).dataBeforeProcessed},getBaseAxis:function(){var t=this.coordinateSystem;return t&&t.getBaseAxis&&t.getBaseAxis()},formatTooltip:function(t,e,n){function i(t){return Er(Or(t))}var r=this.getData(),o=r.mapDimension("defaultedTooltip",!0),a=o.length,s=this.getRawValue(t),l=y(s),u=r.getItemVisual(t,"color");w(u)&&u.colorStops&&(u=(u.colorStops[0]||{}).color),u=u||"transparent";var h=a>1||l&&!a?function(n){function i(t,n){var i=r.getDimensionInfo(n);if(i&&!1!==i.otherDims.tooltip){var o=i.type,l=Rr({color:u,type:"subItem"}),h=(a?l+Er(i.displayName||"-")+": ":"")+Er("ordinal"===o?t+"":"time"===o?e?"":Vr("yyyy/MM/dd hh:mm:ss",t):Or(t));h&&s.push(h)}}var a=p(n,function(t,e,n){var i=r.getDimensionInfo(n);return t|=i&&!1!==i.tooltip&&null!=i.displayName},0),s=[];return o.length?d(o,function(e){i(Zo(r,t,e),e)}):d(n,i),(a?"<br/>":"")+s.join(a?"<br/>":", ")}(s):i(a?Zo(r,t,o[0]):l?s[0]:s),c=Rr(u),f=r.getName(t),g=this.name;return In(this)||(g=""),g=g?Er(g)+(e?": ":"<br/>"):"",e?c+g+h:g+c+(f?Er(f)+": "+h:h)},isAnimationEnabled:function(){if(bp.node)return!1;var t=this.getShallow("animation");return t&&this.getData().count()>this.getShallow("animationThreshold")&&(t=!1),t},restoreData:function(){this.dataTask.dirty()},getColorFromPalette:function(t,e,n){var i=this.ecModel,r=Ay.getColorFromPalette.call(this,t,e,n);return r||(r=i.getColorFromPalette(t,e,n)),r},coordDimToDataDim:function(t){return this.getRawData().mapDimension(t,!0)},getProgressive:function(){return this.get("progressive")},getProgressiveThreshold:function(){return this.get("progressiveThreshold")},getAxisTooltipData:null,getTooltipPosition:null,pipeTask:null,preventIncremental:null,pipelineContext:null});h(cx,sx),h(cx,Ay);var dx=function(){this.group=new Sg,this.uid=vr("viewComponent")};dx.prototype={constructor:dx,init:function(t,e){},render:function(t,e,n,i){},dispose:function(){}};var fx=dx.prototype;fx.updateView=fx.updateLayout=fx.updateVisual=function(t,e,n,i){},En(dx),Vn(dx,{registerWhenExtend:!0});var px=function(){var t=Dn();return function(e){var n=t(e),i=e.pipelineContext,r=n.large,o=n.progressiveRender,a=n.large=i.large,s=n.progressiveRender=i.progressiveRender;return!!(r^a||o^s)&&"reset"}},gx=Dn(),mx=px();ra.prototype={type:"chart",init:function(t,e){},render:function(t,e,n,i){},highlight:function(t,e,n,i){aa(t.getData(),i,"emphasis")},downplay:function(t,e,n,i){aa(t.getData(),i,"normal")},remove:function(t,e){this.group.removeAll()},dispose:function(){},incrementalPrepareRender:null,incrementalRender:null,updateTransform:null};var vx=ra.prototype;vx.updateView=vx.updateLayout=vx.updateVisual=function(t,e,n,i){this.render(t,e,n,i)},En(ra),Vn(ra,{registerWhenExtend:!0}),ra.markUpdateMethod=function(t,e){gx(t).updateMethod=e};var yx={incrementalPrepareRender:{progress:function(t,e){e.view.incrementalRender(t,e.model,e.ecModel,e.api,e.payload)}},render:{forceFirstProgress:!0,progress:function(t,e){e.view.render(e.model,e.ecModel,e.api,e.payload)}}},xx="\0__throttleOriginMethod",_x="\0__throttleRate",bx="\0__throttleType",Mx={createOnAllSeries:!0,performRawSeries:!0,reset:function(t,e){var n=t.getData(),i=(t.visualColorAccessPath||"itemStyle.color").split("."),r=t.get(i)||t.getColorFromPalette(t.name,null,e.getSeriesCount());if(n.setVisual("color",r),!e.isSeriesFiltered(t)){"function"!=typeof r||r instanceof Xv||n.each(function(e){n.setItemVisual(e,"color",r(t.getDataParams(e)))});return{dataEach:n.hasItemOption?function(t,e){var n=t.getItemModel(e).get(i,!0);null!=n&&t.setItemVisual(e,"color",n)}:null}}}},Sx={toolbox:{brush:{title:{rect:"矩形选择",polygon:"圈选",lineX:"横向选择",lineY:"纵向选择",keep:"保持选择",clear:"清除选择"}},dataView:{title:"数据视图",lang:["数据视图","关闭","刷新"]},dataZoom:{title:{zoom:"区域缩放",back:"区域缩放还原"}},magicType:{title:{line:"切换为折线图",bar:"切换为柱状图",stack:"切换为堆叠",tiled:"切换为平铺"}},restore:{title:"还原"},saveAsImage:{title:"保存为图片",lang:["右键另存为图片"]}},series:{typeNames:{pie:"饼图",bar:"柱状图",line:"折线图",scatter:"散点图",effectScatter:"涟漪散点图",radar:"雷达图",tree:"树图",treemap:"矩形树图",boxplot:"箱型图",candlestick:"K线图",k:"K线图",heatmap:"热力图",map:"地图",parallel:"平行坐标图",lines:"线图",graph:"关系图",sankey:"桑基图",funnel:"漏斗图",gauge:"仪表盘图",pictorialBar:"象形柱图",themeRiver:"主题河流图",sunburst:"旭日图"}},aria:{general:{withTitle:"这是一个关于“{title}”的图表。",withoutTitle:"这是一个图表，"},series:{single:{prefix:"",withName:"图表类型是{seriesType}，表示{seriesName}。",withoutName:"图表类型是{seriesType}。"},multiple:{prefix:"它由{seriesCount}个图表系列组成。",withName:"第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",withoutName:"第{seriesId}个系列是一个{seriesType}，",separator:{middle:"；",end:"。"}}},data:{allData:"其数据是——",partialData:"其中，前{displayCnt}项是——",withName:"{name}的数据是{value}",withoutName:"{value}",separator:{middle:"，",end:""}}}},Ix=function(t,e){function n(t,e){if("string"!=typeof t)return t;var n=t;return d(e,function(t,e){n=n.replace(new RegExp("\\{\\s*"+e+"\\s*\\}","g"),t)}),n}function i(t){var e=o.get(t);if(null==e){for(var n=t.split("."),i=Sx.aria,r=0;r<n.length;++r)i=i[n[r]];return i}return e}function r(t){return Sx.series.typeNames[t]||"自定义图"}var o=e.getModel("aria");if(o.get("show"))if(o.get("description"))t.setAttribute("aria-label",o.get("description"));else{var a=0;e.eachSeries(function(t,e){++a},this);var s,l=o.get("data.maxCount")||10,u=o.get("series.maxCount")||10,h=Math.min(a,u);if(!(a<1)){var c=function(){var t=e.getModel("title").option;return t&&t.length&&(t=t[0]),t&&t.text}();s=c?n(i("general.withTitle"),{title:c}):i("general.withoutTitle");var f=[];s+=n(i(a>1?"series.multiple.prefix":"series.single.prefix"),{seriesCount:a}),e.eachSeries(function(t,e){if(e<h){var o,s=t.get("name"),u="series."+(a>1?"multiple":"single")+".";o=n(o=i(s?u+"withName":u+"withoutName"),{seriesId:t.seriesIndex,seriesName:t.get("name"),seriesType:r(t.subType)});var c=t.getData();window.data=c,c.count()>l?o+=n(i("data.partialData"),{displayCnt:l}):o+=i("data.allData");for(var d=[],p=0;p<c.count();p++)if(p<l){var g=c.getName(p),m=Zo(c,p);d.push(n(i(g?"data.withName":"data.withoutName"),{name:g,value:m}))}o+=d.join(i("data.separator.middle"))+i("data.separator.end"),f.push(o)}}),s+=f.join(i("series.multiple.separator.middle"))+i("series.multiple.separator.end"),t.setAttribute("aria-label",s)}}},Cx=Math.PI,Tx=da.prototype;Tx.restoreData=function(t,e){t.restoreData(e),this._stageTaskMap.each(function(t){var e=t.overallTask;e&&e.dirty()})},Tx.getPerformArgs=function(t,e){if(t.__pipeline){var n=this._pipelineMap.get(t.__pipeline.id),i=n.context,r=!e&&n.progressiveEnabled&&(!i||i.progressiveRender)&&t.__idxInPipeline>n.blockIndex?n.step:null,o=i&&i.modDataCount;return{step:r,modBy:null!=o?Math.ceil(o/r):null,modDataCount:o}}},Tx.getPipeline=function(t){return this._pipelineMap.get(t)},Tx.updateStreamModes=function(t,e){var n=this._pipelineMap.get(t.uid),i=t.getData().count(),r=n.progressiveEnabled&&e.incrementalPrepareRender&&i>=n.threshold,o=t.get("large")&&i>=t.get("largeThreshold"),a="mod"===t.get("progressiveChunkMode")?i:null;t.pipelineContext=n.context={progressiveRender:r,modDataCount:a,large:o}},Tx.restorePipelines=function(t){var e=this,n=e._pipelineMap=N();t.eachSeries(function(t){var i=t.getProgressive(),r=t.uid;n.set(r,{id:r,head:null,tail:null,threshold:t.getProgressiveThreshold(),progressiveEnabled:i&&!(t.preventIncremental&&t.preventIncremental()),blockIndex:-1,step:Math.round(i||700),count:0}),Sa(e,t,t.dataTask)})},Tx.prepareStageTasks=function(){var t=this._stageTaskMap,e=this.ecInstance.getModel(),n=this.api;d(this._allHandlers,function(i){var r=t.get(i.uid)||t.set(i.uid,[]);i.reset&&pa(this,i,r,e,n),i.overallReset&&ga(this,i,r,e,n)},this)},Tx.prepareView=function(t,e,n,i){var r=t.renderTask,o=r.context;o.model=e,o.ecModel=n,o.api=i,r.__block=!t.incrementalPrepareRender,Sa(this,e,r)},Tx.performDataProcessorTasks=function(t,e){fa(this,this._dataProcessorHandlers,t,e,{block:!0})},Tx.performVisualTasks=function(t,e,n){fa(this,this._visualHandlers,t,e,n)},Tx.performSeriesTasks=function(t){var e;t.eachSeries(function(t){e|=t.dataTask.perform()}),this.unfinished|=e},Tx.plan=function(){this._pipelineMap.each(function(t){var e=t.tail;do{if(e.__block){t.blockIndex=e.__idxInPipeline;break}e=e.getUpstream()}while(e)})};var Dx=Tx.updatePayload=function(t,e){"remain"!==e&&(t.context.payload=e)},Ax=ba(0);da.wrapStageHandler=function(t,e){return x(t)&&(t={overallReset:t,seriesType:Ia(t)}),t.uid=vr("stageHandler"),e&&(t.visualType=e),t};var kx,Px={},Lx={};Ca(Px,Hy),Ca(Lx,vo),Px.eachSeriesByType=Px.eachRawSeriesByType=function(t){kx=t},Px.eachComponent=function(t){"series"===t.mainType&&t.subType&&(kx=t.subType)};var Ox=["#37A2DA","#32C5E9","#67E0E3","#9FE6B8","#FFDB5C","#ff9f7f","#fb7293","#E062AE","#E690D1","#e7bcf3","#9d96f5","#8378EA","#96BFFF"],zx={color:Ox,colorLayer:[["#37A2DA","#ffd85c","#fd7b5f"],["#37A2DA","#67E0E3","#FFDB5C","#ff9f7f","#E062AE","#9d96f5"],["#37A2DA","#32C5E9","#9FE6B8","#FFDB5C","#ff9f7f","#fb7293","#e7bcf3","#8378EA","#96BFFF"],Ox]},Ex=["#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc","#7289ab","#91ca8c","#f49f42"],Nx={color:Ex,backgroundColor:"#333",tooltip:{axisPointer:{lineStyle:{color:"#eee"},crossStyle:{color:"#eee"}}},legend:{textStyle:{color:"#eee"}},textStyle:{color:"#eee"},title:{textStyle:{color:"#eee"}},toolbox:{iconStyle:{normal:{borderColor:"#eee"}}},dataZoom:{textStyle:{color:"#eee"}},visualMap:{textStyle:{color:"#eee"}},timeline:{lineStyle:{color:"#eee"},itemStyle:{normal:{color:Ex[1]}},label:{normal:{textStyle:{color:"#eee"}}},controlStyle:{normal:{color:"#eee",borderColor:"#eee"}}},timeAxis:{axisLine:{lineStyle:{color:"#eee"}},axisTick:{lineStyle:{color:"#eee"}},axisLabel:{textStyle:{color:"#eee"}},splitLine:{lineStyle:{type:"dashed",color:"#aaa"}},splitArea:{areaStyle:{color:"#eee"}}},logAxis:{axisLine:{lineStyle:{color:"#eee"}},axisTick:{lineStyle:{color:"#eee"}},axisLabel:{textStyle:{color:"#eee"}},splitLine:{lineStyle:{type:"dashed",color:"#aaa"}},splitArea:{areaStyle:{color:"#eee"}}},valueAxis:{axisLine:{lineStyle:{color:"#eee"}},axisTick:{lineStyle:{color:"#eee"}},axisLabel:{textStyle:{color:"#eee"}},splitLine:{lineStyle:{type:"dashed",color:"#aaa"}},splitArea:{areaStyle:{color:"#eee"}}},categoryAxis:{axisLine:{lineStyle:{color:"#eee"}},axisTick:{lineStyle:{color:"#eee"}},axisLabel:{textStyle:{color:"#eee"}},splitLine:{lineStyle:{type:"dashed",color:"#aaa"}},splitArea:{areaStyle:{color:"#eee"}}},line:{symbol:"circle"},graph:{color:Ex},gauge:{title:{textStyle:{color:"#eee"}}},candlestick:{itemStyle:{normal:{color:"#FD1050",color0:"#0CF49B",borderColor:"#FD1050",borderColor0:"#0CF49B"}}}};Nx.categoryAxis.splitLine.show=!1,Iy.extend({type:"dataset",defaultOption:{seriesLayoutBy:Ry,sourceHeader:null,dimensions:null,source:null},optionUpdated:function(){Kr(this)}}),dx.extend({type:"dataset"});var Rx=P,Bx=d,Vx=x,Fx=w,Hx=Iy.parseClassType,Gx={zrender:"4.0.4"},Wx=1e3,Zx=1e3,Ux=3e3,Xx={PROCESSOR:{FILTER:Wx,STATISTIC:5e3},VISUAL:{LAYOUT:Zx,GLOBAL:2e3,CHART:Ux,COMPONENT:4e3,BRUSH:5e3}},jx="__flagInMainProcess",Yx="__optionUpdated",qx=/^[a-zA-Z0-9_]+$/;Da.prototype.on=Ta("on"),Da.prototype.off=Ta("off"),Da.prototype.one=Ta("one"),h(Da,Zp);var $x=Aa.prototype;$x._onframe=function(){if(!this._disposed){var t=this._scheduler;if(this[Yx]){var e=this[Yx].silent;this[jx]=!0,Pa(this),Kx.update.call(this),this[jx]=!1,this[Yx]=!1,Ea.call(this,e),Na.call(this,e)}else if(t.unfinished){var n=1,i=this._model;this._api;t.unfinished=!1;do{var r=+new Date;t.performSeriesTasks(i),t.performDataProcessorTasks(i),Oa(this,i),t.performVisualTasks(i),Ga(this,this._model,0,"remain"),n-=+new Date-r}while(n>0&&t.unfinished);t.unfinished||this._zr.flush()}}},$x.getDom=function(){return this._dom},$x.getZr=function(){return this._zr},$x.setOption=function(t,e,n){var i;if(Fx(e)&&(n=e.lazyUpdate,i=e.silent,e=e.notMerge),this[jx]=!0,!this._model||e){var r=new xo(this._api),o=this._theme,a=this._model=new Hy(null,null,o,r);a.scheduler=this._scheduler,a.init(null,null,o,r)}this._model.setOption(t,n_),n?(this[Yx]={silent:i},this[jx]=!1):(Pa(this),Kx.update.call(this),this._zr.flush(),this[Yx]=!1,this[jx]=!1,Ea.call(this,i),Na.call(this,i))},$x.setTheme=function(){console.log("ECharts#setTheme() is DEPRECATED in ECharts 3.0")},$x.getModel=function(){return this._model},$x.getOption=function(){return this._model&&this._model.getOption()},$x.getWidth=function(){return this._zr.getWidth()},$x.getHeight=function(){return this._zr.getHeight()},$x.getDevicePixelRatio=function(){return this._zr.painter.dpr||window.devicePixelRatio||1},$x.getRenderedCanvas=function(t){if(bp.canvasSupported)return(t=t||{}).pixelRatio=t.pixelRatio||1,t.backgroundColor=t.backgroundColor||this._model.get("backgroundColor"),this._zr.painter.getRenderedCanvas(t)},$x.getSvgDataUrl=function(){if(bp.svgSupported){var t=this._zr;return d(t.storage.getDisplayList(),function(t){t.stopAnimation(!0)}),t.painter.pathToDataUrl()}},$x.getDataURL=function(t){var e=(t=t||{}).excludeComponents,n=this._model,i=[],r=this;Bx(e,function(t){n.eachComponent({mainType:t},function(t){var e=r._componentsMap[t.__viewId];e.group.ignore||(i.push(e),e.group.ignore=!0)})});var o="svg"===this._zr.painter.getType()?this.getSvgDataUrl():this.getRenderedCanvas(t).toDataURL("image/"+(t&&t.type||"png"));return Bx(i,function(t){t.group.ignore=!1}),o},$x.getConnectedDataURL=function(t){if(bp.canvasSupported){var e=this.group,i=Math.min,r=Math.max;if(l_[e]){var o=1/0,a=1/0,s=-1/0,l=-1/0,u=[],h=t&&t.pixelRatio||1;d(s_,function(h,c){if(h.group===e){var d=h.getRenderedCanvas(n(t)),f=h.getDom().getBoundingClientRect();o=i(f.left,o),a=i(f.top,a),s=r(f.right,s),l=r(f.bottom,l),u.push({dom:d,left:f.left,top:f.top})}});var c=(s*=h)-(o*=h),f=(l*=h)-(a*=h),p=Op();p.width=c,p.height=f;var g=mn(p);return Bx(u,function(t){var e=new je({style:{x:t.left*h-o,y:t.top*h-a,image:t.dom}});g.add(e)}),g.refreshImmediately(),p.toDataURL("image/"+(t&&t.type||"png"))}return this.getDataURL(t)}},$x.convertToPixel=v(ka,"convertToPixel"),$x.convertFromPixel=v(ka,"convertFromPixel"),$x.containPixel=function(t,e){var n;return t=An(this._model,t),d(t,function(t,i){i.indexOf("Models")>=0&&d(t,function(t){var r=t.coordinateSystem;if(r&&r.containPoint)n|=!!r.containPoint(e);else if("seriesModels"===i){var o=this._chartsMap[t.__viewId];o&&o.containPoint&&(n|=o.containPoint(e,t))}},this)},this),!!n},$x.getVisual=function(t,e){var n=(t=An(this._model,t,{defaultMainType:"series"})).seriesModel.getData(),i=t.hasOwnProperty("dataIndexInside")?t.dataIndexInside:t.hasOwnProperty("dataIndex")?n.indexOfRawIndex(t.dataIndex):null;return null!=i?n.getItemVisual(i,e):n.getVisual(e)},$x.getViewOfComponentModel=function(t){return this._componentsMap[t.__viewId]},$x.getViewOfSeriesModel=function(t){return this._chartsMap[t.__viewId]};var Kx={prepareAndUpdate:function(t){Pa(this),Kx.update.call(this,t)},update:function(t){var e=this._model,n=this._api,i=this._zr,r=this._coordSysMgr,o=this._scheduler;if(e){o.restoreData(e,t),o.performSeriesTasks(e),r.create(e,n),o.performDataProcessorTasks(e,t),Oa(this,e),r.update(e,n),Va(e),o.performVisualTasks(e,t),Fa(this,e,n,t);var a=e.get("backgroundColor")||"transparent";if(bp.canvasSupported)i.setBackgroundColor(a);else{var s=St(a);a=Lt(s,"rgb"),0===s[3]&&(a="transparent")}Wa(e,n)}},updateTransform:function(t){var e=this._model,n=this,i=this._api;if(e){var r=[];e.eachComponent(function(o,a){var s=n.getViewOfComponentModel(a);if(s&&s.__alive)if(s.updateTransform){var l=s.updateTransform(a,e,i,t);l&&l.update&&r.push(s)}else r.push(s)});var o=N();e.eachSeries(function(r){var a=n._chartsMap[r.__viewId];if(a.updateTransform){var s=a.updateTransform(r,e,i,t);s&&s.update&&o.set(r.uid,1)}else o.set(r.uid,1)}),Va(e),this._scheduler.performVisualTasks(e,t,{setDirty:!0,dirtyMap:o}),Ga(n,e,0,t,o),Wa(e,this._api)}},updateView:function(t){var e=this._model;e&&(ra.markUpdateMethod(t,"updateView"),Va(e),this._scheduler.performVisualTasks(e,t,{setDirty:!0}),Fa(this,this._model,this._api,t),Wa(e,this._api))},updateVisual:function(t){Kx.update.call(this,t)},updateLayout:function(t){Kx.update.call(this,t)}};$x.resize=function(t){this._zr.resize(t);var e=this._model;if(this._loadingFX&&this._loadingFX.resize(),e){var n=e.resetOption("media"),i=t&&t.silent;this[jx]=!0,n&&Pa(this),Kx.update.call(this),this[jx]=!1,Ea.call(this,i),Na.call(this,i)}},$x.showLoading=function(t,e){if(Fx(t)&&(e=t,t=""),t=t||"default",this.hideLoading(),a_[t]){var n=a_[t](this._api,e),i=this._zr;this._loadingFX=n,i.add(n)}},$x.hideLoading=function(){this._loadingFX&&this._zr.remove(this._loadingFX),this._loadingFX=null},$x.makeActionFromEvent=function(t){var e=o({},t);return e.type=t_[t.type],e},$x.dispatchAction=function(t,e){Fx(e)||(e={silent:!!e}),Jx[t.type]&&this._model&&(this[jx]?this._pendingActions.push(t):(za.call(this,t,e.silent),e.flush?this._zr.flush(!0):!1!==e.flush&&bp.browser.weChat&&this._throttledZrFlush(),Ea.call(this,e.silent),Na.call(this,e.silent)))},$x.appendData=function(t){var e=t.seriesIndex;this.getModel().getSeriesByIndex(e).appendData(t),this._scheduler.unfinished=!0},$x.on=Ta("on"),$x.off=Ta("off"),$x.one=Ta("one");var Qx=["click","dblclick","mouseover","mouseout","mousemove","mousedown","mouseup","globalout","contextmenu"];$x._initEvents=function(){Bx(Qx,function(t){this._zr.on(t,function(e){var n,i=this.getModel(),r=e.target;if("globalout"===t)n={};else if(r&&null!=r.dataIndex){var a=r.dataModel||i.getSeriesByIndex(r.seriesIndex);n=a&&a.getDataParams(r.dataIndex,r.dataType)||{}}else r&&r.eventData&&(n=o({},r.eventData));n&&(n.event=e,n.type=t,this.trigger(t,n))},this)},this),Bx(t_,function(t,e){this._messageCenter.on(e,function(t){this.trigger(e,t)},this)},this)},$x.isDisposed=function(){return this._disposed},$x.clear=function(){this.setOption({series:[]},!0)},$x.dispose=function(){if(!this._disposed){this._disposed=!0,Pn(this.getDom(),c_,"");var t=this._api,e=this._model;Bx(this._componentsViews,function(n){n.dispose(e,t)}),Bx(this._chartsViews,function(n){n.dispose(e,t)}),this._zr.dispose(),delete s_[this.id]}},h(Aa,Zp);var Jx={},t_={},e_=[],n_=[],i_=[],r_=[],o_={},a_={},s_={},l_={},u_=new Date-0,h_=new Date-0,c_="_echarts_instance_",d_={},f_=qa;ns(2e3,Mx),Qa(ex),Ja(5e3,function(t){var e=N();t.eachSeries(function(t){var n=t.get("stack");if(n){var i=e.get(n)||e.set(n,[]),r=t.getData(),o={stackResultDimension:r.getCalculationInfo("stackResultDimension"),stackedOverDimension:r.getCalculationInfo("stackedOverDimension"),stackedDimension:r.getCalculationInfo("stackedDimension"),stackedByDimension:r.getCalculationInfo("stackedByDimension"),isStackedByIndex:r.getCalculationInfo("isStackedByIndex"),data:r,seriesModel:t};if(!o.stackedDimension||!o.isStackedByIndex&&!o.stackedByDimension)return;i.length&&r.setCalculationInfo("stackedOnSeries",i[i.length-1].seriesModel),i.push(o)}}),e.each(No)}),rs("default",function(t,e){a(e=e||{},{text:"loading",color:"#c23531",textColor:"#000",maskColor:"rgba(255, 255, 255, 0.8)",zlevel:0});var n=new Fv({style:{fill:e.maskColor},zlevel:e.zlevel,z:1e4}),i=new Zv({shape:{startAngle:-Cx/2,endAngle:-Cx/2+.1,r:10},style:{stroke:e.color,lineCap:"round",lineWidth:5},zlevel:e.zlevel,z:10001}),r=new Fv({style:{fill:"none",text:e.text,textPosition:"right",textDistance:10,textFill:e.textColor},zlevel:e.zlevel,z:10001});i.animateShape(!0).when(1e3,{endAngle:3*Cx/2}).start("circularInOut"),i.animateShape(!0).when(1e3,{startAngle:3*Cx/2}).delay(300).start("circularInOut");var o=new Sg;return o.add(i),o.add(r),o.add(n),o.resize=function(){var e=t.getWidth()/2,o=t.getHeight()/2;i.setShape({cx:e,cy:o});var a=i.shape.r;r.setShape({x:e-a,y:o-a,width:2*a,height:2*a}),n.setShape({x:0,y:0,width:t.getWidth(),height:t.getHeight()})},o.resize(),o}),ts({type:"highlight",event:"highlight",update:"highlight"},R),ts({type:"downplay",event:"downplay",update:"downplay"},R),Ka("light",zx),Ka("dark",Nx);var p_={};hs.prototype={constructor:hs,add:function(t){return this._add=t,this},update:function(t){return this._update=t,this},remove:function(t){return this._remove=t,this},execute:function(){var t=this._old,e=this._new,n={},i=[],r=[];for(cs(t,{},i,"_oldKeyGetter",this),cs(e,n,r,"_newKeyGetter",this),o=0;o<t.length;o++)null!=(s=n[a=i[o]])?((u=s.length)?(1===u&&(n[a]=null),s=s.unshift()):n[a]=null,this._update&&this._update(s,o)):this._remove&&this._remove(o);for(var o=0;o<r.length;o++){var a=r[o];if(n.hasOwnProperty(a)){var s=n[a];if(null==s)continue;if(s.length)for(var l=0,u=s.length;l<u;l++)this._add&&this._add(s[l]);else this._add&&this._add(s)}}}};var g_=N(["tooltip","label","itemName","itemId","seriesName"]),m_=w,v_="e\0\0",y_={float:"undefined"==typeof Float64Array?Array:Float64Array,int:"undefined"==typeof Int32Array?Array:Int32Array,ordinal:Array,number:Array,time:Array},x_="undefined"==typeof Uint32Array?Array:Uint32Array,__="undefined"==typeof Uint16Array?Array:Uint16Array,w_=["hasItemOption","_nameList","_idList","_invertedIndicesMap","_rawData","_chunkSize","_chunkCount","_dimValueGetter","_count","_rawCount","_nameDimIdx","_idDimIdx"],b_=["_extent","_approximateExtent","_rawExtent"],M_=function(t,e){t=t||["x","y"];for(var n={},i=[],r={},o=0;o<t.length;o++){var a=t[o];_(a)&&(a={name:a});var s=a.name;a.type=a.type||"float",a.coordDim||(a.coordDim=s,a.coordDimIndex=0),a.otherDims=a.otherDims||{},i.push(s),n[s]=a,a.index=o,a.createInvertedIndices&&(r[s]=[])}this.dimensions=i,this._dimensionInfos=n,this.hostModel=e,this.dataType,this._indices=null,this._count=0,this._rawCount=0,this._storage={},this._nameList=[],this._idList=[],this._optionModels=[],this._visual={},this._layout={},this._itemVisuals=[],this.hasItemVisual={},this._itemLayouts=[],this._graphicEls=[],this._chunkSize=1e5,this._chunkCount=0,this._rawData,this._rawExtent={},this._extent={},this._approximateExtent={},this._dimensionsSummary=ds(this),this._invertedIndicesMap=r,this._calculationInfo={}},S_=M_.prototype;S_.type="list",S_.hasItemOption=!0,S_.getDimension=function(t){return isNaN(t)||(t=this.dimensions[t]||t),t},S_.getDimensionInfo=function(t){return this._dimensionInfos[this.getDimension(t)]},S_.getDimensionsOnCoord=function(){return this._dimensionsSummary.dataDimsOnCoord.slice()},S_.mapDimension=function(t,e){var n=this._dimensionsSummary;if(null==e)return n.encodeFirstDimNotExtra[t];var i=n.encode[t];return!0===e?(i||[]).slice():i&&i[e]},S_.initData=function(t,e,n){($r.isInstance(t)||c(t))&&(t=new Ro(t,this.dimensions.length)),this._rawData=t,this._storage={},this._indices=null,this._nameList=e||[],this._idList=[],this._nameRepeatCount={},n||(this.hasItemOption=!1),this.defaultDimValueGetter=ox[this._rawData.getSource().sourceFormat],this._dimValueGetter=n=n||this.defaultDimValueGetter,this._rawExtent={},this._initDataFromProvider(0,t.count()),t.pure&&(this.hasItemOption=!1)},S_.getProvider=function(){return this._rawData},S_.appendData=function(t){var e=this._rawData,n=this.count();e.appendData(t);var i=e.count();e.persistent||(i+=n),this._initDataFromProvider(n,i)},S_._initDataFromProvider=function(t,e){if(!(t>=e)){for(var n,i=this._chunkSize,r=this._rawData,o=this._storage,a=this.dimensions,s=a.length,l=this._dimensionInfos,u=this._nameList,h=this._idList,c=this._rawExtent,d=this._nameRepeatCount={},f=this._chunkCount,p=f-1,g=0;g<s;g++){c[C=a[g]]||(c[C]=[1/0,-1/0]);var m=l[C];0===m.otherDims.itemName&&(n=this._nameDimIdx=g),0===m.otherDims.itemId&&(this._idDimIdx=g);var v=y_[m.type];o[C]||(o[C]=[]);var y=o[C][p];if(y&&y.length<i){for(var x=new v(Math.min(e-p*i,i)),_=0;_<y.length;_++)x[_]=y[_];o[C][p]=x}for(I=f*i;I<e;I+=i)o[C].push(new v(Math.min(e-I,i)));this._chunkCount=o[C].length}for(var w=new Array(s),b=t;b<e;b++){w=r.getItem(b,w);for(var M=Math.floor(b/i),S=b%i,I=0;I<s;I++){var C=a[I],T=o[C][M],D=this._dimValueGetter(w,C,b,I);T[S]=D;var A=c[C];D<A[0]&&(A[0]=D),D>A[1]&&(A[1]=D)}if(!r.pure){var k=u[b];if(w&&null==k)if(null!=w.name)u[b]=k=w.name;else if(null!=n){var P=a[n],L=o[P][M];if(L){k=L[S];var O=l[P].ordinalMeta;O&&O.categories.length&&(k=O.categories[k])}}var z=null==w?null:w.id;null==z&&null!=k&&(d[k]=d[k]||0,z=k,d[k]>0&&(z+="__ec__"+d[k]),d[k]++),null!=z&&(h[b]=z)}}!r.persistent&&r.clean&&r.clean(),this._rawCount=this._count=e,this._extent={},ys(this)}},S_.count=function(){return this._count},S_.getIndices=function(){var t=this._indices;if(t){var e=t.constructor,n=this._count;if(e===Array){i=new e(n);for(r=0;r<n;r++)i[r]=t[r]}else i=new e(t.buffer,0,n)}else for(var i=new(e=gs(this))(this.count()),r=0;r<i.length;r++)i[r]=r;return i},S_.get=function(t,e){if(!(e>=0&&e<this._count))return NaN;var n=this._storage;if(!n[t])return NaN;e=this.getRawIndex(e);var i=Math.floor(e/this._chunkSize),r=e%this._chunkSize;return n[t][i][r]},S_.getByRawIndex=function(t,e){if(!(e>=0&&e<this._rawCount))return NaN;var n=this._storage[t];if(!n)return NaN;var i=Math.floor(e/this._chunkSize),r=e%this._chunkSize;return n[i][r]},S_._getFast=function(t,e){var n=Math.floor(e/this._chunkSize),i=e%this._chunkSize;return this._storage[t][n][i]},S_.getValues=function(t,e){var n=[];y(t)||(e=t,t=this.dimensions);for(var i=0,r=t.length;i<r;i++)n.push(this.get(t[i],e));return n},S_.hasValue=function(t){for(var e=this._dimensionsSummary.dataDimsOnCoord,n=this._dimensionInfos,i=0,r=e.length;i<r;i++)if("ordinal"!==n[e[i]].type&&isNaN(this.get(e[i],t)))return!1;return!0},S_.getDataExtent=function(t){t=this.getDimension(t);var e=[1/0,-1/0];if(!this._storage[t])return e;var n,i=this.count();if(!this._indices)return this._rawExtent[t].slice();if(n=this._extent[t])return n.slice();for(var r=(n=e)[0],o=n[1],a=0;a<i;a++){var s=this._getFast(t,this.getRawIndex(a));s<r&&(r=s),s>o&&(o=s)}return n=[r,o],this._extent[t]=n,n},S_.getApproximateExtent=function(t){return t=this.getDimension(t),this._approximateExtent[t]||this.getDataExtent(t)},S_.setApproximateExtent=function(t,e){e=this.getDimension(e),this._approximateExtent[e]=t.slice()},S_.getCalculationInfo=function(t){return this._calculationInfo[t]},S_.setCalculationInfo=function(t,e){m_(t)?o(this._calculationInfo,t):this._calculationInfo[t]=e},S_.getSum=function(t){var e=0;if(this._storage[t])for(var n=0,i=this.count();n<i;n++){var r=this.get(t,n);isNaN(r)||(e+=r)}return e},S_.getMedian=function(t){var e=[];this.each(t,function(t,n){isNaN(t)||e.push(t)});var n=[].concat(e).sort(function(t,e){return t-e}),i=this.count();return 0===i?0:i%2==1?n[(i-1)/2]:(n[i/2]+n[i/2-1])/2},S_.rawIndexOf=function(t,e){var n=(t&&this._invertedIndicesMap[t])[e];return null==n||isNaN(n)?-1:n},S_.indexOfName=function(t){for(var e=0,n=this.count();e<n;e++)if(this.getName(e)===t)return e;return-1},S_.indexOfRawIndex=function(t){if(!this._indices)return t;if(t>=this._rawCount||t<0)return-1;var e=this._indices,n=e[t];if(null!=n&&n<this._count&&n===t)return t;for(var i=0,r=this._count-1;i<=r;){var o=(i+r)/2|0;if(e[o]<t)i=o+1;else{if(!(e[o]>t))return o;r=o-1}}return-1},S_.indicesOfNearest=function(t,e,n){var i=[];if(!this._storage[t])return i;null==n&&(n=1/0);for(var r=Number.MAX_VALUE,o=-1,a=0,s=this.count();a<s;a++){var l=e-this.get(t,a),u=Math.abs(l);l<=n&&u<=r&&((u<r||l>=0&&o<0)&&(r=u,o=l,i.length=0),i.push(a))}return i},S_.getRawIndex=_s,S_.getRawDataItem=function(t){if(this._rawData.persistent)return this._rawData.getItem(this.getRawIndex(t));for(var e=[],n=0;n<this.dimensions.length;n++){var i=this.dimensions[n];e.push(this.get(i,t))}return e},S_.getName=function(t){var e=this.getRawIndex(t);return this._nameList[e]||xs(this,this._nameDimIdx,e)||""},S_.getId=function(t){return bs(this,this.getRawIndex(t))},S_.each=function(t,e,n,i){if(this._count){"function"==typeof t&&(i=n,n=e,e=t,t=[]),n=n||i||this;for(var r=(t=f(Ms(t),this.getDimension,this)).length,o=0;o<this.count();o++)switch(r){case 0:e.call(n,o);break;case 1:e.call(n,this.get(t[0],o),o);break;case 2:e.call(n,this.get(t[0],o),this.get(t[1],o),o);break;default:for(var a=0,s=[];a<r;a++)s[a]=this.get(t[a],o);s[a]=o,e.apply(n,s)}}},S_.filterSelf=function(t,e,n,i){if(this._count){"function"==typeof t&&(i=n,n=e,e=t,t=[]),n=n||i||this,t=f(Ms(t),this.getDimension,this);for(var r=this.count(),o=new(gs(this))(r),a=[],s=t.length,l=0,u=t[0],h=0;h<r;h++){var c,d=this.getRawIndex(h);if(0===s)c=e.call(n,h);else if(1===s){var p=this._getFast(u,d);c=e.call(n,p,h)}else{for(var g=0;g<s;g++)a[g]=this._getFast(u,d);a[g]=h,c=e.apply(n,a)}c&&(o[l++]=d)}return l<r&&(this._indices=o),this._count=l,this._extent={},this.getRawIndex=this._indices?ws:_s,this}},S_.selectRange=function(t){if(this._count){var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(n);var i=e.length;if(i){var r=this.count(),o=new(gs(this))(r),a=0,s=e[0],l=t[s][0],u=t[s][1],h=!1;if(!this._indices){var c=0;if(1===i){for(var d=this._storage[e[0]],f=0;f<this._chunkCount;f++)for(var p=d[f],g=Math.min(this._count-f*this._chunkSize,this._chunkSize),m=0;m<g;m++)((w=p[m])>=l&&w<=u||isNaN(w))&&(o[a++]=c),c++;h=!0}else if(2===i){for(var d=this._storage[s],v=this._storage[e[1]],y=t[e[1]][0],x=t[e[1]][1],f=0;f<this._chunkCount;f++)for(var p=d[f],_=v[f],g=Math.min(this._count-f*this._chunkSize,this._chunkSize),m=0;m<g;m++){var w=p[m],b=_[m];(w>=l&&w<=u||isNaN(w))&&(b>=y&&b<=x||isNaN(b))&&(o[a++]=c),c++}h=!0}}if(!h)if(1===i)for(m=0;m<r;m++){S=this.getRawIndex(m);((w=this._getFast(s,S))>=l&&w<=u||isNaN(w))&&(o[a++]=S)}else for(m=0;m<r;m++){for(var M=!0,S=this.getRawIndex(m),f=0;f<i;f++){var I=e[f];((w=this._getFast(n,S))<t[I][0]||w>t[I][1])&&(M=!1)}M&&(o[a++]=this.getRawIndex(m))}return a<r&&(this._indices=o),this._count=a,this._extent={},this.getRawIndex=this._indices?ws:_s,this}}},S_.mapArray=function(t,e,n,i){"function"==typeof t&&(i=n,n=e,e=t,t=[]),n=n||i||this;var r=[];return this.each(t,function(){r.push(e&&e.apply(this,arguments))},n),r},S_.map=function(t,e,n,i){n=n||i||this;var r=Ss(this,t=f(Ms(t),this.getDimension,this));r._indices=this._indices,r.getRawIndex=r._indices?ws:_s;for(var o=r._storage,a=[],s=this._chunkSize,l=t.length,u=this.count(),h=[],c=r._rawExtent,d=0;d<u;d++){for(var p=0;p<l;p++)h[p]=this.get(t[p],d);h[l]=d;var g=e&&e.apply(n,h);if(null!=g){"object"!=typeof g&&(a[0]=g,g=a);for(var m=this.getRawIndex(d),v=Math.floor(m/s),y=m%s,x=0;x<g.length;x++){var _=t[x],w=g[x],b=c[_],M=o[_];M&&(M[v][y]=w),w<b[0]&&(b[0]=w),w>b[1]&&(b[1]=w)}}}return r},S_.downSample=function(t,e,n,i){for(var r=Ss(this,[t]),o=r._storage,a=[],s=Math.floor(1/e),l=o[t],u=this.count(),h=this._chunkSize,c=r._rawExtent[t],d=new(gs(this))(u),f=0,p=0;p<u;p+=s){s>u-p&&(s=u-p,a.length=s);for(var g=0;g<s;g++){var m=this.getRawIndex(p+g),v=Math.floor(m/h),y=m%h;a[g]=l[v][y]}var x=n(a),_=this.getRawIndex(Math.min(p+i(a,x)||0,u-1)),w=_%h;l[Math.floor(_/h)][w]=x,x<c[0]&&(c[0]=x),x>c[1]&&(c[1]=x),d[f++]=_}return r._count=f,r._indices=d,r.getRawIndex=ws,r},S_.getItemModel=function(t){var e=this.hostModel;return new pr(this.getRawDataItem(t),e,e&&e.ecModel)},S_.diff=function(t){var e=this;return new hs(t?t.getIndices():[],this.getIndices(),function(e){return bs(t,e)},function(t){return bs(e,t)})},S_.getVisual=function(t){var e=this._visual;return e&&e[t]},S_.setVisual=function(t,e){if(m_(t))for(var n in t)t.hasOwnProperty(n)&&this.setVisual(n,t[n]);else this._visual=this._visual||{},this._visual[t]=e},S_.setLayout=function(t,e){if(m_(t))for(var n in t)t.hasOwnProperty(n)&&this.setLayout(n,t[n]);else this._layout[t]=e},S_.getLayout=function(t){return this._layout[t]},S_.getItemLayout=function(t){return this._itemLayouts[t]},S_.setItemLayout=function(t,e,n){this._itemLayouts[t]=n?o(this._itemLayouts[t]||{},e):e},S_.clearItemLayouts=function(){this._itemLayouts.length=0},S_.getItemVisual=function(t,e,n){var i=this._itemVisuals[t],r=i&&i[e];return null!=r||n?r:this.getVisual(e)},S_.setItemVisual=function(t,e,n){var i=this._itemVisuals[t]||{},r=this.hasItemVisual;if(this._itemVisuals[t]=i,m_(e))for(var o in e)e.hasOwnProperty(o)&&(i[o]=e[o],r[o]=!0);else i[e]=n,r[e]=!0},S_.clearAllVisual=function(){this._visual={},this._itemVisuals=[],this.hasItemVisual={}};var I_=function(t){t.seriesIndex=this.seriesIndex,t.dataIndex=this.dataIndex,t.dataType=this.dataType};S_.setItemGraphicEl=function(t,e){var n=this.hostModel;e&&(e.dataIndex=t,e.dataType=this.dataType,e.seriesIndex=n&&n.seriesIndex,"group"===e.type&&e.traverse(I_,e)),this._graphicEls[t]=e},S_.getItemGraphicEl=function(t){return this._graphicEls[t]},S_.eachItemGraphicEl=function(t,e){d(this._graphicEls,function(n,i){n&&t&&t.call(e,n,i)})},S_.cloneShallow=function(t){if(!t){var e=f(this.dimensions,this.getDimensionInfo,this);t=new M_(e,this.hostModel)}if(t._storage=this._storage,vs(t,this),this._indices){var n=this._indices.constructor;t._indices=new n(this._indices)}else t._indices=null;return t.getRawIndex=t._indices?ws:_s,t},S_.wrapMethod=function(t,e){var n=this[t];"function"==typeof n&&(this.__wrappedMethods=this.__wrappedMethods||[],this.__wrappedMethods.push(t),this[t]=function(){var t=n.apply(this,arguments);return e.apply(this,[t].concat(A(arguments)))})},S_.TRANSFERABLE_METHODS=["cloneShallow","downSample","map"],S_.CHANGABLE_METHODS=["filterSelf","selectRange"];var C_=function(t,e){return e=e||{},Ts(e.coordDimensions||[],t,{dimsDef:e.dimensionsDefine||t.dimensionsDefine,encodeDef:e.encodeDefine||t.encodeDefine,dimCount:e.dimensionsCount,generateCoord:e.generateCoord,generateCoordCount:e.generateCoordCount})};Ns.prototype.parse=function(t){return t},Ns.prototype.getSetting=function(t){return this._setting[t]},Ns.prototype.contain=function(t){var e=this._extent;return t>=e[0]&&t<=e[1]},Ns.prototype.normalize=function(t){var e=this._extent;return e[1]===e[0]?.5:(t-e[0])/(e[1]-e[0])},Ns.prototype.scale=function(t){var e=this._extent;return t*(e[1]-e[0])+e[0]},Ns.prototype.unionExtent=function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1])},Ns.prototype.unionExtentFromData=function(t,e){this.unionExtent(t.getApproximateExtent(e))},Ns.prototype.getExtent=function(){return this._extent.slice()},Ns.prototype.setExtent=function(t,e){var n=this._extent;isNaN(t)||(n[0]=t),isNaN(e)||(n[1]=e)},Ns.prototype.isBlank=function(){return this._isBlank},Ns.prototype.setBlank=function(t){this._isBlank=t},Ns.prototype.getLabel=null,En(Ns),Vn(Ns,{registerWhenExtend:!0}),Rs.createByAxisModel=function(t){var e=t.option,n=e.data,i=n&&f(n,Vs);return new Rs({categories:i,needCollect:!i,deduplication:!1!==e.dedplication})};var T_=Rs.prototype;T_.getOrdinal=function(t){return Bs(this).get(t)},T_.parseAndCollect=function(t){var e,n=this._needCollect;if("string"!=typeof t&&!n)return t;if(n&&!this._deduplication)return e=this.categories.length,this.categories[e]=t,e;var i=Bs(this);return null==(e=i.get(t))&&(n?(e=this.categories.length,this.categories[e]=t,i.set(t,e)):e=NaN),e};var D_=Ns.prototype,A_=Ns.extend({type:"ordinal",init:function(t,e){t&&!y(t)||(t=new Rs({categories:t})),this._ordinalMeta=t,this._extent=e||[0,t.categories.length-1]},parse:function(t){return"string"==typeof t?this._ordinalMeta.getOrdinal(t):Math.round(t)},contain:function(t){return t=this.parse(t),D_.contain.call(this,t)&&null!=this._ordinalMeta.categories[t]},normalize:function(t){return D_.normalize.call(this,this.parse(t))},scale:function(t){return Math.round(D_.scale.call(this,t))},getTicks:function(){for(var t=[],e=this._extent,n=e[0];n<=e[1];)t.push(n),n++;return t},getLabel:function(t){if(!this.isBlank())return this._ordinalMeta.categories[t]},count:function(){return this._extent[1]-this._extent[0]+1},unionExtentFromData:function(t,e){this.unionExtent(t.getApproximateExtent(e))},getOrdinalMeta:function(){return this._ordinalMeta},niceTicks:R,niceExtent:R});A_.create=function(){return new A_};var k_=wr,P_=wr,L_=Ns.extend({type:"interval",_interval:0,_intervalPrecision:2,setExtent:function(t,e){var n=this._extent;isNaN(t)||(n[0]=parseFloat(t)),isNaN(e)||(n[1]=parseFloat(e))},unionExtent:function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1]),L_.prototype.setExtent.call(this,e[0],e[1])},getInterval:function(){return this._interval},setInterval:function(t){this._interval=t,this._niceExtent=this._extent.slice(),this._intervalPrecision=Hs(t)},getTicks:function(){return Zs(this._interval,this._extent,this._niceExtent,this._intervalPrecision)},getLabel:function(t,e){if(null==t)return"";var n=e&&e.precision;return null==n?n=Sr(t)||0:"auto"===n&&(n=this._intervalPrecision),t=P_(t,n,!0),Or(t)},niceTicks:function(t,e,n){t=t||5;var i=this._extent,r=i[1]-i[0];if(isFinite(r)){r<0&&(r=-r,i.reverse());var o=Fs(i,t,e,n);this._intervalPrecision=o.intervalPrecision,this._interval=o.interval,this._niceExtent=o.niceTickExtent}},niceExtent:function(t){var e=this._extent;if(e[0]===e[1])if(0!==e[0]){var n=e[0];t.fixMax?e[0]-=n/2:(e[1]+=n/2,e[0]-=n/2)}else e[1]=1;var i=e[1]-e[0];isFinite(i)||(e[0]=0,e[1]=1),this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var r=this._interval;t.fixMin||(e[0]=P_(Math.floor(e[0]/r)*r)),t.fixMax||(e[1]=P_(Math.ceil(e[1]/r)*r))}});L_.create=function(){return new L_};var O_="__ec_stack_",z_="undefined"!=typeof Float32Array?Float32Array:Array,E_={seriesType:"bar",plan:px(),reset:function(t){if(Ks(t)&&Qs(t)){var e=t.getData(),n=t.coordinateSystem,i=n.getBaseAxis(),r=n.getOtherAxis(i),o=e.mapDimension(r.dim),a=e.mapDimension(i.dim),s=r.isHorizontal(),l=s?0:1,u=$s(Ys([t]),i,t).width;return u>.5||(u=.5),{progress:function(t,e){for(var h,c=new z_(2*t.count),d=[],f=[],p=0;null!=(h=t.next());)f[l]=e.get(o,h),f[1-l]=e.get(a,h),d=n.dataToPoint(f,null,d),c[p++]=d[0],c[p++]=d[1];e.setLayout({largePoints:c,barWidth:u,valueAxisStart:Js(i,r,!1),valueAxisHorizontal:s})}}}}},N_=L_.prototype,R_=Math.ceil,B_=Math.floor,V_=function(t,e,n,i){for(;n<i;){var r=n+i>>>1;t[r][1]<e?n=r+1:i=r}return n},F_=L_.extend({type:"time",getLabel:function(t){var e=this._stepLvl,n=new Date(t);return Vr(e[0],n,this.getSetting("useUTC"))},niceExtent:function(t){var e=this._extent;if(e[0]===e[1]&&(e[0]-=864e5,e[1]+=864e5),e[1]===-1/0&&e[0]===1/0){var n=new Date;e[1]=+new Date(n.getFullYear(),n.getMonth(),n.getDate()),e[0]=e[1]-864e5}this.niceTicks(t.splitNumber,t.minInterval,t.maxInterval);var i=this._interval;t.fixMin||(e[0]=wr(B_(e[0]/i)*i)),t.fixMax||(e[1]=wr(R_(e[1]/i)*i))},niceTicks:function(t,e,n){t=t||10;var i=this._extent,r=i[1]-i[0],o=r/t;null!=e&&o<e&&(o=e),null!=n&&o>n&&(o=n);var a=H_.length,s=V_(H_,o,0,a),l=H_[Math.min(s,a-1)],u=l[1];"year"===l[0]&&(u*=Lr(r/u/t,!0));var h=this.getSetting("useUTC")?0:60*new Date(+i[0]||+i[1]).getTimezoneOffset()*1e3,c=[Math.round(R_((i[0]-h)/u)*u+h),Math.round(B_((i[1]-h)/u)*u+h)];Ws(c,i),this._stepLvl=l,this._interval=u,this._niceExtent=c},parse:function(t){return+Ar(t)}});d(["contain","normalize"],function(t){F_.prototype[t]=function(e){return N_[t].call(this,this.parse(e))}});var H_=[["hh:mm:ss",1e3],["hh:mm:ss",5e3],["hh:mm:ss",1e4],["hh:mm:ss",15e3],["hh:mm:ss",3e4],["hh:mm\nMM-dd",6e4],["hh:mm\nMM-dd",3e5],["hh:mm\nMM-dd",6e5],["hh:mm\nMM-dd",9e5],["hh:mm\nMM-dd",18e5],["hh:mm\nMM-dd",36e5],["hh:mm\nMM-dd",72e5],["hh:mm\nMM-dd",216e5],["hh:mm\nMM-dd",432e5],["MM-dd\nyyyy",864e5],["MM-dd\nyyyy",1728e5],["MM-dd\nyyyy",2592e5],["MM-dd\nyyyy",3456e5],["MM-dd\nyyyy",432e6],["MM-dd\nyyyy",5184e5],["week",6048e5],["MM-dd\nyyyy",864e6],["week",12096e5],["week",18144e5],["month",26784e5],["week",36288e5],["month",53568e5],["week",36288e5],["quarter",8208e6],["month",107136e5],["month",13392e6],["half-year",16416e6],["month",214272e5],["month",26784e6],["year",32832e6]];F_.create=function(t){return new F_({useUTC:t.ecModel.get("useUTC")})};var G_=Ns.prototype,W_=L_.prototype,Z_=Sr,U_=wr,X_=Math.floor,j_=Math.ceil,Y_=Math.pow,q_=Math.log,$_=Ns.extend({type:"log",base:10,$constructor:function(){Ns.apply(this,arguments),this._originalScale=new L_},getTicks:function(){var t=this._originalScale,e=this._extent,n=t.getExtent();return f(W_.getTicks.call(this),function(i){var r=wr(Y_(this.base,i));return r=i===e[0]&&t.__fixMin?tl(r,n[0]):r,r=i===e[1]&&t.__fixMax?tl(r,n[1]):r},this)},getLabel:W_.getLabel,scale:function(t){return t=G_.scale.call(this,t),Y_(this.base,t)},setExtent:function(t,e){var n=this.base;t=q_(t)/q_(n),e=q_(e)/q_(n),W_.setExtent.call(this,t,e)},getExtent:function(){var t=this.base,e=G_.getExtent.call(this);e[0]=Y_(t,e[0]),e[1]=Y_(t,e[1]);var n=this._originalScale,i=n.getExtent();return n.__fixMin&&(e[0]=tl(e[0],i[0])),n.__fixMax&&(e[1]=tl(e[1],i[1])),e},unionExtent:function(t){this._originalScale.unionExtent(t);var e=this.base;t[0]=q_(t[0])/q_(e),t[1]=q_(t[1])/q_(e),G_.unionExtent.call(this,t)},unionExtentFromData:function(t,e){this.unionExtent(t.getApproximateExtent(e))},niceTicks:function(t){t=t||10;var e=this._extent,n=e[1]-e[0];if(!(n===1/0||n<=0)){var i=kr(n);for(t/n*i<=.5&&(i*=10);!isNaN(i)&&Math.abs(i)<1&&Math.abs(i)>0;)i*=10;var r=[wr(j_(e[0]/i)*i),wr(X_(e[1]/i)*i)];this._interval=i,this._niceExtent=r}},niceExtent:function(t){W_.niceExtent.call(this,t);var e=this._originalScale;e.__fixMin=t.fixMin,e.__fixMax=t.fixMax}});d(["contain","normalize"],function(t){$_.prototype[t]=function(e){return e=q_(e)/q_(this.base),G_[t].call(this,e)}}),$_.create=function(){return new $_};var K_={getMin:function(t){var e=this.option,n=t||null==e.rangeStart?e.min:e.rangeStart;return this.axis&&null!=n&&"dataMin"!==n&&"function"!=typeof n&&!I(n)&&(n=this.axis.scale.parse(n)),n},getMax:function(t){var e=this.option,n=t||null==e.rangeEnd?e.max:e.rangeEnd;return this.axis&&null!=n&&"dataMax"!==n&&"function"!=typeof n&&!I(n)&&(n=this.axis.scale.parse(n)),n},getNeedCrossZero:function(){var t=this.option;return null==t.rangeStart&&null==t.rangeEnd&&!t.scale},getCoordSysModel:R,setRange:function(t,e){this.option.rangeStart=t,this.option.rangeEnd=e},resetRange:function(){this.option.rangeStart=this.option.rangeEnd=null}},Q_=Ai({type:"triangle",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var n=e.cx,i=e.cy,r=e.width/2,o=e.height/2;t.moveTo(n,i-o),t.lineTo(n+r,i+o),t.lineTo(n-r,i+o),t.closePath()}}),J_=Ai({type:"diamond",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var n=e.cx,i=e.cy,r=e.width/2,o=e.height/2;t.moveTo(n,i-o),t.lineTo(n+r,i),t.lineTo(n,i+o),t.lineTo(n-r,i),t.closePath()}}),tw=Ai({type:"pin",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var n=e.x,i=e.y,r=e.width/5*3,o=Math.max(r,e.height),a=r/2,s=a*a/(o-a),l=i-o+a+s,u=Math.asin(s/a),h=Math.cos(u)*a,c=Math.sin(u),d=Math.cos(u),f=.6*a,p=.7*a;t.moveTo(n-h,l+s),t.arc(n,l,a,Math.PI-u,2*Math.PI+u),t.bezierCurveTo(n+h-c*f,l+s+d*f,n,i-p,n,i),t.bezierCurveTo(n,i-p,n-h+c*f,l+s+d*f,n-h,l+s),t.closePath()}}),ew=Ai({type:"arrow",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var n=e.height,i=e.width,r=e.x,o=e.y,a=i/3*2;t.moveTo(r,o),t.lineTo(r+a,o+n),t.lineTo(r,o+n/4*3),t.lineTo(r-a,o+n),t.lineTo(r,o),t.closePath()}}),nw={line:function(t,e,n,i,r){r.x1=t,r.y1=e+i/2,r.x2=t+n,r.y2=e+i/2},rect:function(t,e,n,i,r){r.x=t,r.y=e,r.width=n,r.height=i},roundRect:function(t,e,n,i,r){r.x=t,r.y=e,r.width=n,r.height=i,r.r=Math.min(n,i)/4},square:function(t,e,n,i,r){var o=Math.min(n,i);r.x=t,r.y=e,r.width=o,r.height=o},circle:function(t,e,n,i,r){r.cx=t+n/2,r.cy=e+i/2,r.r=Math.min(n,i)/2},diamond:function(t,e,n,i,r){r.cx=t+n/2,r.cy=e+i/2,r.width=n,r.height=i},pin:function(t,e,n,i,r){r.x=t+n/2,r.y=e+i/2,r.width=n,r.height=i},arrow:function(t,e,n,i,r){r.x=t+n/2,r.y=e+i/2,r.width=n,r.height=i},triangle:function(t,e,n,i,r){r.cx=t+n/2,r.cy=e+i/2,r.width=n,r.height=i}},iw={};d({line:Hv,rect:Fv,roundRect:Fv,square:Fv,circle:Pv,diamond:J_,pin:tw,arrow:ew,triangle:Q_},function(t,e){iw[e]=new t});var rw=Ai({type:"symbol",shape:{symbolType:"",x:0,y:0,width:0,height:0},beforeBrush:function(){var t=this.style;"pin"===this.shape.symbolType&&"inside"===t.textPosition&&(t.textPosition=["50%","40%"],t.textAlign="center",t.textVerticalAlign="middle")},buildPath:function(t,e,n){var i=e.symbolType,r=iw[i];"none"!==e.symbolType&&(r||(r=iw[i="rect"]),nw[i](e.x,e.y,e.width,e.height,r.shape),r.buildPath(t,r.shape,n))}}),ow={isDimensionStacked:Ps,enableDataStack:ks,getStackedDimension:Ls},aw=(Object.freeze||Object)({createList:function(t){return Os(t.getSource(),t)},getLayoutRect:Gr,dataStack:ow,createScale:function(t,e){var n=e;pr.isInstance(e)||h(n=new pr(e),K_);var i=rl(n);return i.setExtent(t[0],t[1]),il(i,n),i},mixinAxisModelCommonMethods:function(t){h(t,K_)},completeDimensions:Ts,createDimensions:C_,createSymbol:cl}),sw=1e-8;pl.prototype={constructor:pl,properties:null,getBoundingRect:function(){var t=this._rect;if(t)return t;for(var e=Number.MAX_VALUE,n=[e,e],i=[-e,-e],r=[],o=[],a=this.geometries,s=0;s<a.length;s++)"polygon"===a[s].type&&(ti(a[s].exterior,r,o),K(n,n,r),Q(i,i,o));return 0===s&&(n[0]=n[1]=i[0]=i[1]=0),this._rect=new Xt(n[0],n[1],i[0]-n[0],i[1]-n[1])},contain:function(t){var e=this.getBoundingRect(),n=this.geometries;if(!e.contain(t[0],t[1]))return!1;t:for(var i=0,r=n.length;i<r;i++)if("polygon"===n[i].type){var o=n[i].exterior,a=n[i].interiors;if(fl(o,t[0],t[1])){for(var s=0;s<(a?a.length:0);s++)if(fl(a[s]))continue t;return!0}}return!1},transformTo:function(t,e,n,i){var r=this.getBoundingRect(),o=r.width/r.height;n?i||(i=n/o):n=o*i;for(var a=new Xt(t,e,n,i),s=r.calculateTransform(a),l=this.geometries,u=0;u<l.length;u++)if("polygon"===l[u].type){for(var h=l[u].exterior,c=l[u].interiors,d=0;d<h.length;d++)$(h[d],h[d],s);for(var f=0;f<(c?c.length:0);f++)for(d=0;d<c[f].length;d++)$(c[f][d],c[f][d],s)}(r=this._rect).copy(a),this.center=[r.x+r.width/2,r.y+r.height/2]}};var lw=function(t){return gl(t),f(g(t.features,function(t){return t.geometry&&t.properties&&t.geometry.coordinates.length>0}),function(t){var e=t.properties,n=t.geometry,i=n.coordinates,r=[];"Polygon"===n.type&&r.push({type:"polygon",exterior:i[0],interiors:i.slice(1)}),"MultiPolygon"===n.type&&d(i,function(t){t[0]&&r.push({type:"polygon",exterior:t[0],interiors:t.slice(1)})});var o=new pl(e.name,r,e.cp);return o.properties=e,o})},uw=Dn(),hw=[0,1],cw=function(t,e,n){this.dim=t,this.scale=e,this._extent=n||[0,0],this.inverse=!1,this.onBand=!1};cw.prototype={constructor:cw,contain:function(t){var e=this._extent,n=Math.min(e[0],e[1]),i=Math.max(e[0],e[1]);return t>=n&&t<=i},containData:function(t){return this.contain(this.dataToCoord(t))},getExtent:function(){return this._extent.slice()},getPixelPrecision:function(t){return Ir(t||this.scale.getExtent(),this._extent)},setExtent:function(t,e){var n=this._extent;n[0]=t,n[1]=e},dataToCoord:function(t,e){var n=this._extent,i=this.scale;return t=i.normalize(t),this.onBand&&"ordinal"===i.type&&Ll(n=n.slice(),i.count()),xr(t,hw,n,e)},coordToData:function(t,e){var n=this._extent,i=this.scale;this.onBand&&"ordinal"===i.type&&Ll(n=n.slice(),i.count());var r=xr(t,n,hw,e);return this.scale.scale(r)},pointToData:function(t,e){},getTicksCoords:function(t){var e=(t=t||{}).tickModel||this.getTickModel(),n=yl(this,e),i=f(n.ticks,function(t){return{coord:this.dataToCoord(t),tickValue:t}},this),r=e.get("alignWithLabel");return Ol(this,i,n.tickCategoryInterval,r,t.clamp),i},getViewLabels:function(){return vl(this).labels},getLabelModel:function(){return this.model.getModel("axisLabel")},getTickModel:function(){return this.model.getModel("axisTick")},getBandWidth:function(){var t=this._extent,e=this.scale.getExtent(),n=e[1]-e[0]+(this.onBand?1:0);0===n&&(n=1);var i=Math.abs(t[1]-t[0]);return Math.abs(i)/n},isHorizontal:null,getRotate:null,calculateCategoryInterval:function(){return Tl(this)}};var dw=lw,fw={};d(["map","each","filter","indexOf","inherits","reduce","filter","bind","curry","isArray","isString","isObject","isFunction","extend","defaults","clone","merge"],function(t){fw[t]=Np[t]}),cx.extend({type:"series.line",dependencies:["grid","polar"],getInitialData:function(t,e){return Os(this.getSource(),this)},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,clipOverflow:!0,label:{position:"top"},lineStyle:{width:2,type:"solid"},step:!1,smooth:!1,smoothMonotone:null,symbol:"emptyCircle",symbolSize:4,symbolRotate:null,showSymbol:!0,showAllSymbol:"auto",connectNulls:!1,sampling:"none",animationEasing:"linear",progressive:0,hoverLayerThreshold:1/0}});var pw=El.prototype,gw=El.getSymbolSize=function(t,e){var n=t.getItemVisual(e,"symbolSize");return n instanceof Array?n.slice():[+n,+n]};pw._createSymbol=function(t,e,n,i,r){this.removeAll();var o=cl(t,-1,-1,2,2,e.getItemVisual(n,"color"),r);o.attr({z2:100,culling:!0,scale:Nl(i)}),o.drift=Rl,this._symbolType=t,this.add(o)},pw.stopSymbolAnimation=function(t){this.childAt(0).stopAnimation(t)},pw.getSymbolPath=function(){return this.childAt(0)},pw.getScale=function(){return this.childAt(0).scale},pw.highlight=function(){this.childAt(0).trigger("emphasis")},pw.downplay=function(){this.childAt(0).trigger("normal")},pw.setZ=function(t,e){var n=this.childAt(0);n.zlevel=t,n.z=e},pw.setDraggable=function(t){var e=this.childAt(0);e.draggable=t,e.cursor=t?"move":"pointer"},pw.updateData=function(t,e,n){this.silent=!1;var i=t.getItemVisual(e,"symbol")||"circle",r=t.hostModel,o=gw(t,e),a=i!==this._symbolType;if(a){var s=t.getItemVisual(e,"symbolKeepAspect");this._createSymbol(i,t,e,o,s)}else(l=this.childAt(0)).silent=!1,ar(l,{scale:Nl(o)},r,e);if(this._updateCommon(t,e,o,n),a){var l=this.childAt(0),u=n&&n.fadeIn,h={scale:l.scale.slice()};u&&(h.style={opacity:l.style.opacity}),l.scale=[0,0],u&&(l.style.opacity=0),sr(l,h,r,e)}this._seriesModel=r};var mw=["itemStyle"],vw=["emphasis","itemStyle"],yw=["label"],xw=["emphasis","label"];pw._updateCommon=function(t,e,n,i){var r=this.childAt(0),a=t.hostModel,s=t.getItemVisual(e,"color");"image"!==r.type&&r.useStyle({strokeNoScale:!0});var l=i&&i.itemStyle,u=i&&i.hoverItemStyle,h=i&&i.symbolRotate,c=i&&i.symbolOffset,d=i&&i.labelModel,f=i&&i.hoverLabelModel,p=i&&i.hoverAnimation,g=i&&i.cursorStyle;if(!i||t.hasItemOption){var m=i&&i.itemModel?i.itemModel:t.getItemModel(e);l=m.getModel(mw).getItemStyle(["color"]),u=m.getModel(vw).getItemStyle(),h=m.getShallow("symbolRotate"),c=m.getShallow("symbolOffset"),d=m.getModel(yw),f=m.getModel(xw),p=m.getShallow("hoverAnimation"),g=m.getShallow("cursor")}else u=o({},u);var v=r.style;r.attr("rotation",(h||0)*Math.PI/180||0),c&&r.attr("position",[_r(c[0],n[0]),_r(c[1],n[1])]),g&&r.attr("cursor",g),r.setColor(s,i&&i.symbolInnerColor),r.setStyle(l);var y=t.getItemVisual(e,"opacity");null!=y&&(v.opacity=y);var x=t.getItemVisual(e,"liftZ"),_=r.__z2Origin;null!=x?null==_&&(r.__z2Origin=r.z2,r.z2+=x):null!=_&&(r.z2=_,r.__z2Origin=null);var w=i&&i.useNameLabel;$i(v,u,d,f,{labelFetcher:a,labelDataIndex:e,defaultText:function(e,n){return w?t.getName(e):zl(t,e)},isRectText:!0,autoColor:s}),r.off("mouseover").off("mouseout").off("emphasis").off("normal"),r.hoverStyle=u,qi(r);var b=Nl(n);if(p&&a.isAnimationEnabled()){var M=function(){if(!this.incremental){var t=b[1]/b[0];this.animateTo({scale:[Math.max(1.1*b[0],b[0]+3),Math.max(1.1*b[1],b[1]+3*t)]},400,"elasticOut")}},S=function(){this.incremental||this.animateTo({scale:b},400,"elasticOut")};r.on("mouseover",M).on("mouseout",S).on("emphasis",M).on("normal",S)}},pw.fadeOut=function(t,e){var n=this.childAt(0);this.silent=n.silent=!0,!(e&&e.keepLabel)&&(n.style.text=null),ar(n,{style:{opacity:0},scale:[0,0]},this._seriesModel,this.dataIndex,t)},u(El,Sg);var _w=Bl.prototype;_w.updateData=function(t,e){e=Fl(e);var n=this.group,i=t.hostModel,r=this._data,o=this._symbolCtor,a=Hl(t);r||n.removeAll(),t.diff(r).add(function(i){var r=t.getItemLayout(i);if(Vl(t,r,i,e)){var s=new o(t,i,a);s.attr("position",r),t.setItemGraphicEl(i,s),n.add(s)}}).update(function(s,l){var u=r.getItemGraphicEl(l),h=t.getItemLayout(s);Vl(t,h,s,e)?(u?(u.updateData(t,s,a),ar(u,{position:h},i)):(u=new o(t,s)).attr("position",h),n.add(u),t.setItemGraphicEl(s,u)):n.remove(u)}).remove(function(t){var e=r.getItemGraphicEl(t);e&&e.fadeOut(function(){n.remove(e)})}).execute(),this._data=t},_w.isPersistent=function(){return!0},_w.updateLayout=function(){var t=this._data;t&&t.eachItemGraphicEl(function(e,n){var i=t.getItemLayout(n);e.attr("position",i)})},_w.incrementalPrepareUpdate=function(t){this._seriesScope=Hl(t),this._data=null,this.group.removeAll()},_w.incrementalUpdate=function(t,e,n){n=Fl(n);for(var i=t.start;i<t.end;i++){var r=e.getItemLayout(i);if(Vl(e,r,i,n)){var o=new this._symbolCtor(e,i,this._seriesScope);o.traverse(function(t){t.isGroup||(t.incremental=t.useHoverLayer=!0)}),o.attr("position",r),this.group.add(o),e.setItemGraphicEl(i,o)}}},_w.remove=function(t){var e=this.group,n=this._data;n&&t?n.eachItemGraphicEl(function(t){t.fadeOut(function(){e.remove(t)})}):e.removeAll()};var ww=function(t,e,n,i,r,o,a,s){for(var l=Ul(t,e),u=[],h=[],c=[],d=[],f=[],p=[],g=[],m=Gl(r,e,a),v=Gl(o,t,s),y=0;y<l.length;y++){var x=l[y],_=!0;switch(x.cmd){case"=":var w=t.getItemLayout(x.idx),b=e.getItemLayout(x.idx1);(isNaN(w[0])||isNaN(w[1]))&&(w=b.slice()),u.push(w),h.push(b),c.push(n[x.idx]),d.push(i[x.idx1]),g.push(e.getRawIndex(x.idx1));break;case"+":M=x.idx;u.push(r.dataToPoint([e.get(m.dataDimsForPoint[0],M),e.get(m.dataDimsForPoint[1],M)])),h.push(e.getItemLayout(M).slice()),c.push(Zl(m,r,e,M)),d.push(i[M]),g.push(e.getRawIndex(M));break;case"-":var M=x.idx,S=t.getRawIndex(M);S!==M?(u.push(t.getItemLayout(M)),h.push(o.dataToPoint([t.get(v.dataDimsForPoint[0],M),t.get(v.dataDimsForPoint[1],M)])),c.push(n[M]),d.push(Zl(v,o,t,M)),g.push(S)):_=!1}_&&(f.push(x),p.push(p.length))}p.sort(function(t,e){return g[t]-g[e]});for(var I=[],C=[],T=[],D=[],A=[],y=0;y<p.length;y++){M=p[y];I[y]=u[M],C[y]=h[M],T[y]=c[M],D[y]=d[M],A[y]=f[M]}return{current:I,next:C,stackedOnCurrent:T,stackedOnNext:D,status:A}},bw=K,Mw=Q,Sw=G,Iw=V,Cw=[],Tw=[],Dw=[],Aw=xi.extend({type:"ec-polyline",shape:{points:[],smooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},style:{fill:null,stroke:"#000"},brush:Ov(xi.prototype.brush),buildPath:function(t,e){var n=e.points,i=0,r=n.length,o=$l(n,e.smoothConstraint);if(e.connectNulls){for(;r>0&&Xl(n[r-1]);r--);for(;i<r&&Xl(n[i]);i++);}for(;i<r;)i+=jl(t,n,i,r,r,1,o.min,o.max,e.smooth,e.smoothMonotone,e.connectNulls)+1}}),kw=xi.extend({type:"ec-polygon",shape:{points:[],stackedOnPoints:[],smooth:0,stackedOnSmooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},brush:Ov(xi.prototype.brush),buildPath:function(t,e){var n=e.points,i=e.stackedOnPoints,r=0,o=n.length,a=e.smoothMonotone,s=$l(n,e.smoothConstraint),l=$l(i,e.smoothConstraint);if(e.connectNulls){for(;o>0&&Xl(n[o-1]);o--);for(;r<o&&Xl(n[r]);r++);}for(;r<o;){var u=jl(t,n,r,o,o,1,s.min,s.max,e.smooth,a,e.connectNulls);jl(t,i,r+u-1,u,o,-1,l.min,l.max,e.stackedOnSmooth,a,e.connectNulls),r+=u+1,t.closePath()}}});ra.extend({type:"line",init:function(){var t=new Sg,e=new Bl;this.group.add(e.group),this._symbolDraw=e,this._lineGroup=t},render:function(t,e,n){var i=t.coordinateSystem,r=this.group,o=t.getData(),s=t.getModel("lineStyle"),l=t.getModel("areaStyle"),u=o.mapArray(o.getItemLayout),h="polar"===i.type,c=this._coordSys,d=this._symbolDraw,f=this._polyline,p=this._polygon,g=this._lineGroup,m=t.get("animation"),v=!l.isEmpty(),y=l.get("origin"),x=tu(i,o,Gl(i,o,y)),_=t.get("showSymbol"),w=_&&!h&&au(t,o,i),b=this._data;b&&b.eachItemGraphicEl(function(t,e){t.__temp&&(r.remove(t),b.setItemGraphicEl(e,null))}),_||d.remove(),r.add(g);var M=!h&&t.get("step");f&&c.type===i.type&&M===this._step?(v&&!p?p=this._newPolygon(u,x,i,m):p&&!v&&(g.remove(p),p=this._polygon=null),g.setClipPath(iu(i,!1,!1,t)),_&&d.updateData(o,{isIgnore:w,clipShape:iu(i,!1,!0,t)}),o.eachItemGraphicEl(function(t){t.stopAnimation(!0)}),Kl(this._stackedOnPoints,x)&&Kl(this._points,u)||(m?this._updateAnimation(o,x,i,n,M,y):(M&&(u=ru(u,i,M),x=ru(x,i,M)),f.setShape({points:u}),p&&p.setShape({points:u,stackedOnPoints:x})))):(_&&d.updateData(o,{isIgnore:w,clipShape:iu(i,!1,!0,t)}),M&&(u=ru(u,i,M),x=ru(x,i,M)),f=this._newPolyline(u,i,m),v&&(p=this._newPolygon(u,x,i,m)),g.setClipPath(iu(i,!0,!1,t)));var S=ou(o,i)||o.getVisual("color");f.useStyle(a(s.getLineStyle(),{fill:"none",stroke:S,lineJoin:"bevel"}));var I=t.get("smooth");if(I=Ql(t.get("smooth")),f.setShape({smooth:I,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")}),p){var C=o.getCalculationInfo("stackedOnSeries"),T=0;p.useStyle(a(l.getAreaStyle(),{fill:S,opacity:.7,lineJoin:"bevel"})),C&&(T=Ql(C.get("smooth"))),p.setShape({smooth:I,stackedOnSmooth:T,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")})}this._data=o,this._coordSys=i,this._stackedOnPoints=x,this._points=u,this._step=M,this._valueOrigin=y},dispose:function(){},highlight:function(t,e,n,i){var r=t.getData(),o=Tn(r,i);if(!(o instanceof Array)&&null!=o&&o>=0){var a=r.getItemGraphicEl(o);if(!a){var s=r.getItemLayout(o);if(!s)return;(a=new El(r,o)).position=s,a.setZ(t.get("zlevel"),t.get("z")),a.ignore=isNaN(s[0])||isNaN(s[1]),a.__temp=!0,r.setItemGraphicEl(o,a),a.stopSymbolAnimation(!0),this.group.add(a)}a.highlight()}else ra.prototype.highlight.call(this,t,e,n,i)},downplay:function(t,e,n,i){var r=t.getData(),o=Tn(r,i);if(null!=o&&o>=0){var a=r.getItemGraphicEl(o);a&&(a.__temp?(r.setItemGraphicEl(o,null),this.group.remove(a)):a.downplay())}else ra.prototype.downplay.call(this,t,e,n,i)},_newPolyline:function(t){var e=this._polyline;return e&&this._lineGroup.remove(e),e=new Aw({shape:{points:t},silent:!0,z2:10}),this._lineGroup.add(e),this._polyline=e,e},_newPolygon:function(t,e){var n=this._polygon;return n&&this._lineGroup.remove(n),n=new kw({shape:{points:t,stackedOnPoints:e},silent:!0}),this._lineGroup.add(n),this._polygon=n,n},_updateAnimation:function(t,e,n,i,r,o){var a=this._polyline,s=this._polygon,l=t.hostModel,u=ww(this._data,t,this._stackedOnPoints,e,this._coordSys,n,this._valueOrigin,o),h=u.current,c=u.stackedOnCurrent,d=u.next,f=u.stackedOnNext;r&&(h=ru(u.current,n,r),c=ru(u.stackedOnCurrent,n,r),d=ru(u.next,n,r),f=ru(u.stackedOnNext,n,r)),a.shape.__points=u.current,a.shape.points=h,ar(a,{shape:{points:d}},l),s&&(s.setShape({points:h,stackedOnPoints:c}),ar(s,{shape:{points:d,stackedOnPoints:f}},l));for(var p=[],g=u.status,m=0;m<g.length;m++)if("="===g[m].cmd){var v=t.getItemGraphicEl(g[m].idx1);v&&p.push({el:v,ptIdx:m})}a.animators&&a.animators.length&&a.animators[0].during(function(){for(var t=0;t<p.length;t++)p[t].el.attr("position",a.shape.__points[p[t].ptIdx])})},remove:function(t){var e=this.group,n=this._data;this._lineGroup.removeAll(),this._symbolDraw.remove(!0),n&&n.eachItemGraphicEl(function(t,i){t.__temp&&(e.remove(t),n.setItemGraphicEl(i,null))}),this._polyline=this._polygon=this._coordSys=this._points=this._stackedOnPoints=this._data=null}});var Pw=function(t,e,n){return{seriesType:t,performRawSeries:!0,reset:function(t,i,r){var o=t.getData(),a=t.get("symbol")||e,s=t.get("symbolSize"),l=t.get("symbolKeepAspect");if(o.setVisual({legendSymbol:n||a,symbol:a,symbolSize:s,symbolKeepAspect:l}),!i.isSeriesFiltered(t)){var u="function"==typeof s;return{dataEach:o.hasItemOption||u?function(e,n){if("function"==typeof s){var i=t.getRawValue(n),r=t.getDataParams(n);e.setItemVisual(n,"symbolSize",s(i,r))}if(e.hasItemOption){var o=e.getItemModel(n),a=o.getShallow("symbol",!0),l=o.getShallow("symbolSize",!0),u=o.getShallow("symbolKeepAspect",!0);null!=a&&e.setItemVisual(n,"symbol",a),null!=l&&e.setItemVisual(n,"symbolSize",l),null!=u&&e.setItemVisual(n,"symbolKeepAspect",u)}}:null}}}}},Lw=function(t){return{seriesType:t,plan:px(),reset:function(t){var e=t.getData(),n=t.coordinateSystem,i=t.pipelineContext.large;if(n){var r=f(n.dimensions,function(t){return e.mapDimension(t)}).slice(0,2),o=r.length,a=e.getCalculationInfo("stackResultDimension");return Ps(e,r[0])&&(r[0]=a),Ps(e,r[1])&&(r[1]=a),o&&{progress:function(t,e){for(var a=t.end-t.start,s=i&&new Float32Array(a*o),l=t.start,u=0,h=[],c=[];l<t.end;l++){var d;if(1===o)f=e.get(r[0],l),d=!isNaN(f)&&n.dataToPoint(f,null,c);else{var f=h[0]=e.get(r[0],l),p=h[1]=e.get(r[1],l);d=!isNaN(f)&&!isNaN(p)&&n.dataToPoint(h,null,c)}i?(s[u++]=d?d[0]:NaN,s[u++]=d?d[1]:NaN):e.setItemLayout(l,d&&d.slice()||[NaN,NaN])}i&&e.setLayout("symbolPoints",s)}}}}}},Ow={average:function(t){for(var e=0,n=0,i=0;i<t.length;i++)isNaN(t[i])||(e+=t[i],n++);return 0===n?NaN:e/n},sum:function(t){for(var e=0,n=0;n<t.length;n++)e+=t[n]||0;return e},max:function(t){for(var e=-1/0,n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return isFinite(e)?e:NaN},min:function(t){for(var e=1/0,n=0;n<t.length;n++)t[n]<e&&(e=t[n]);return isFinite(e)?e:NaN},nearest:function(t){return t[0]}},zw=function(t,e){return Math.round(t.length/2)},Ew=function(t){this._axes={},this._dimList=[],this.name=t||""};Ew.prototype={constructor:Ew,type:"cartesian",getAxis:function(t){return this._axes[t]},getAxes:function(){return f(this._dimList,lu,this)},getAxesByScale:function(t){return t=t.toLowerCase(),g(this.getAxes(),function(e){return e.scale.type===t})},addAxis:function(t){var e=t.dim;this._axes[e]=t,this._dimList.push(e)},dataToCoord:function(t){return this._dataCoordConvert(t,"dataToCoord")},coordToData:function(t){return this._dataCoordConvert(t,"coordToData")},_dataCoordConvert:function(t,e){for(var n=this._dimList,i=t instanceof Array?[]:{},r=0;r<n.length;r++){var o=n[r],a=this._axes[o];i[o]=a[e](t[o])}return i}},uu.prototype={constructor:uu,type:"cartesian2d",dimensions:["x","y"],getBaseAxis:function(){return this.getAxesByScale("ordinal")[0]||this.getAxesByScale("time")[0]||this.getAxis("x")},containPoint:function(t){var e=this.getAxis("x"),n=this.getAxis("y");return e.contain(e.toLocalCoord(t[0]))&&n.contain(n.toLocalCoord(t[1]))},containData:function(t){return this.getAxis("x").containData(t[0])&&this.getAxis("y").containData(t[1])},dataToPoint:function(t,e,n){var i=this.getAxis("x"),r=this.getAxis("y");return n=n||[],n[0]=i.toGlobalCoord(i.dataToCoord(t[0])),n[1]=r.toGlobalCoord(r.dataToCoord(t[1])),n},clampData:function(t,e){var n=this.getAxis("x").scale,i=this.getAxis("y").scale,r=n.getExtent(),o=i.getExtent(),a=n.parse(t[0]),s=i.parse(t[1]);return e=e||[],e[0]=Math.min(Math.max(Math.min(r[0],r[1]),a),Math.max(r[0],r[1])),e[1]=Math.min(Math.max(Math.min(o[0],o[1]),s),Math.max(o[0],o[1])),e},pointToData:function(t,e){var n=this.getAxis("x"),i=this.getAxis("y");return e=e||[],e[0]=n.coordToData(n.toLocalCoord(t[0])),e[1]=i.coordToData(i.toLocalCoord(t[1])),e},getOtherAxis:function(t){return this.getAxis("x"===t.dim?"y":"x")}},u(uu,Ew);var Nw=function(t,e,n,i,r){cw.call(this,t,e,n),this.type=i||"value",this.position=r||"bottom"};Nw.prototype={constructor:Nw,index:0,getAxesOnZeroOf:null,model:null,isHorizontal:function(){var t=this.position;return"top"===t||"bottom"===t},getGlobalExtent:function(t){var e=this.getExtent();return e[0]=this.toGlobalCoord(e[0]),e[1]=this.toGlobalCoord(e[1]),t&&e[0]>e[1]&&e.reverse(),e},getOtherAxis:function(){this.grid.getOtherAxis()},pointToData:function(t,e){return this.coordToData(this.toLocalCoord(t["x"===this.dim?0:1]),e)},toLocalCoord:null,toGlobalCoord:null},u(Nw,cw);var Rw={show:!0,zlevel:0,z:0,inverse:!1,name:"",nameLocation:"end",nameRotate:null,nameTruncate:{maxWidth:null,ellipsis:"...",placeholder:"."},nameTextStyle:{},nameGap:15,silent:!1,triggerEvent:!1,tooltip:{show:!1},axisPointer:{},axisLine:{show:!0,onZero:!0,onZeroAxisIndex:null,lineStyle:{color:"#333",width:1,type:"solid"},symbol:["none","none"],symbolSize:[10,15]},axisTick:{show:!0,inside:!1,length:5,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,showMinLabel:null,showMaxLabel:null,margin:8,fontSize:12},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},Bw={};Bw.categoryAxis=i({boundaryGap:!0,deduplication:null,splitLine:{show:!1},axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"}},Rw),Bw.valueAxis=i({boundaryGap:[0,0],splitNumber:5},Rw),Bw.timeAxis=a({scale:!0,min:"dataMin",max:"dataMax"},Bw.valueAxis),Bw.logAxis=a({scale:!0,logBase:10},Bw.valueAxis);var Vw=["value","category","time","log"],Fw=function(t,e,n,o){d(Vw,function(a){e.extend({type:t+"Axis."+a,mergeDefaultAndTheme:function(e,r){var o=this.layoutMode,s=o?Ur(e):{};i(e,r.getTheme().get(a+"Axis")),i(e,this.getDefaultOption()),e.type=n(t,e),o&&Zr(e,s,o)},optionUpdated:function(){"category"===this.option.type&&(this.__ordinalMeta=Rs.createByAxisModel(this))},getCategories:function(t){var e=this.option;if("category"===e.type)return t?e.data:this.__ordinalMeta.categories},getOrdinalMeta:function(){return this.__ordinalMeta},defaultOption:r([{},Bw[a+"Axis"],o],!0)})}),Iy.registerSubTypeDefaulter(t+"Axis",v(n,t))},Hw=Iy.extend({type:"cartesian2dAxis",axis:null,init:function(){Hw.superApply(this,"init",arguments),this.resetRange()},mergeOption:function(){Hw.superApply(this,"mergeOption",arguments),this.resetRange()},restoreData:function(){Hw.superApply(this,"restoreData",arguments),this.resetRange()},getCoordSysModel:function(){return this.ecModel.queryComponents({mainType:"grid",index:this.option.gridIndex,id:this.option.gridId})[0]}});i(Hw.prototype,K_);var Gw={offset:0};Fw("x",Hw,hu,Gw),Fw("y",Hw,hu,Gw),Iy.extend({type:"grid",dependencies:["xAxis","yAxis"],layoutMode:"box",coordinateSystem:null,defaultOption:{show:!1,zlevel:0,z:0,left:"10%",top:60,right:"10%",bottom:60,containLabel:!1,backgroundColor:"rgba(0,0,0,0)",borderWidth:1,borderColor:"#ccc"}});var Ww=du.prototype;Ww.type="grid",Ww.axisPointerEnabled=!0,Ww.getRect=function(){return this._rect},Ww.update=function(t,e){var n=this._axesMap;this._updateScale(t,this.model),d(n.x,function(t){il(t.scale,t.model)}),d(n.y,function(t){il(t.scale,t.model)}),d(n.x,function(t){fu(n,"y",t)}),d(n.y,function(t){fu(n,"x",t)}),this.resize(this.model,e)},Ww.resize=function(t,e,n){function i(){d(o,function(t){var e=t.isHorizontal(),n=e?[0,r.width]:[0,r.height],i=t.inverse?1:0;t.setExtent(n[i],n[1-i]),gu(t,e?r.x:r.y)})}var r=Gr(t.getBoxLayoutParams(),{width:e.getWidth(),height:e.getHeight()});this._rect=r;var o=this._axesList;i(),!n&&t.get("containLabel")&&(d(o,function(t){if(!t.model.get("axisLabel.inside")){var e=ll(t);if(e){var n=t.isHorizontal()?"height":"width",i=t.model.get("axisLabel.margin");r[n]-=e[n]+i,"top"===t.position?r.y+=e.height+i:"left"===t.position&&(r.x+=e.width+i)}}}),i())},Ww.getAxis=function(t,e){var n=this._axesMap[t];if(null!=n){if(null==e)for(var i in n)if(n.hasOwnProperty(i))return n[i];return n[e]}},Ww.getAxes=function(){return this._axesList.slice()},Ww.getCartesian=function(t,e){if(null!=t&&null!=e){var n="x"+t+"y"+e;return this._coordsMap[n]}w(t)&&(e=t.yAxisIndex,t=t.xAxisIndex);for(var i=0,r=this._coordsList;i<r.length;i++)if(r[i].getAxis("x").index===t||r[i].getAxis("y").index===e)return r[i]},Ww.getCartesians=function(){return this._coordsList.slice()},Ww.convertToPixel=function(t,e,n){var i=this._findConvertTarget(t,e);return i.cartesian?i.cartesian.dataToPoint(n):i.axis?i.axis.toGlobalCoord(i.axis.dataToCoord(n)):null},Ww.convertFromPixel=function(t,e,n){var i=this._findConvertTarget(t,e);return i.cartesian?i.cartesian.pointToData(n):i.axis?i.axis.coordToData(i.axis.toLocalCoord(n)):null},Ww._findConvertTarget=function(t,e){var n,i,r=e.seriesModel,o=e.xAxisModel||r&&r.getReferringComponents("xAxis")[0],a=e.yAxisModel||r&&r.getReferringComponents("yAxis")[0],s=e.gridModel,u=this._coordsList;return r?l(u,n=r.coordinateSystem)<0&&(n=null):o&&a?n=this.getCartesian(o.componentIndex,a.componentIndex):o?i=this.getAxis("x",o.componentIndex):a?i=this.getAxis("y",a.componentIndex):s&&s.coordinateSystem===this&&(n=this._coordsList[0]),{cartesian:n,axis:i}},Ww.containPoint=function(t){var e=this._coordsList[0];if(e)return e.containPoint(t)},Ww._initCartesian=function(t,e,n){function i(n){return function(i,s){if(cu(i,t,e)){var l=i.get("position");"x"===n?"top"!==l&&"bottom"!==l&&r[l="bottom"]&&(l="top"===l?"bottom":"top"):"left"!==l&&"right"!==l&&r[l="left"]&&(l="left"===l?"right":"left"),r[l]=!0;var u=new Nw(n,rl(i),[0,0],i.get("type"),l),h="category"===u.type;u.onBand=h&&i.get("boundaryGap"),u.inverse=i.get("inverse"),i.axis=u,u.model=i,u.grid=this,u.index=s,this._axesList.push(u),o[n][s]=u,a[n]++}}}var r={left:!1,right:!1,top:!1,bottom:!1},o={x:{},y:{}},a={x:0,y:0};if(e.eachComponent("xAxis",i("x"),this),e.eachComponent("yAxis",i("y"),this),!a.x||!a.y)return this._axesMap={},void(this._axesList=[]);this._axesMap=o,d(o.x,function(e,n){d(o.y,function(i,r){var o="x"+n+"y"+r,a=new uu(o);a.grid=this,a.model=t,this._coordsMap[o]=a,this._coordsList.push(a),a.addAxis(e),a.addAxis(i)},this)},this)},Ww._updateScale=function(t,e){function n(t,e,n){d(t.mapDimension(e.dim,!0),function(n){e.scale.unionExtentFromData(t,Ls(t,n))})}d(this._axesList,function(t){t.scale.setExtent(1/0,-1/0)}),t.eachSeries(function(i){if(vu(i)){var r=mu(i),o=r[0],a=r[1];if(!cu(o,e,t)||!cu(a,e,t))return;var s=this.getCartesian(o.componentIndex,a.componentIndex),l=i.getData(),u=s.getAxis("x"),h=s.getAxis("y");"list"===l.type&&(n(l,u),n(l,h))}},this)},Ww.getTooltipAxes=function(t){var e=[],n=[];return d(this.getCartesians(),function(i){var r=null!=t&&"auto"!==t?i.getAxis(t):i.getBaseAxis(),o=i.getOtherAxis(r);l(e,r)<0&&e.push(r),l(n,o)<0&&n.push(o)}),{baseAxes:e,otherAxes:n}};var Zw=["xAxis","yAxis"];du.create=function(t,e){var n=[];return t.eachComponent("grid",function(i,r){var o=new du(i,t,e);o.name="grid_"+r,o.resize(i,e,!0),i.coordinateSystem=o,n.push(o)}),t.eachSeries(function(t){if(vu(t)){var e=mu(t),n=e[0],i=e[1],r=n.getCoordSysModel().coordinateSystem;t.coordinateSystem=r.getCartesian(n.componentIndex,i.componentIndex)}}),n},du.dimensions=du.prototype.dimensions=uu.prototype.dimensions,yo.register("cartesian2d",du);var Uw=Math.PI,Xw=function(t,e){this.opt=e,this.axisModel=t,a(e,{labelOffset:0,nameDirection:1,tickDirection:1,labelDirection:1,silent:!0}),this.group=new Sg;var n=new Sg({position:e.position.slice(),rotation:e.rotation});n.updateTransform(),this._transform=n.transform,this._dumbGroup=n};Xw.prototype={constructor:Xw,hasBuilder:function(t){return!!jw[t]},add:function(t){jw[t].call(this)},getGroup:function(){return this.group}};var jw={axisLine:function(){var t=this.opt,e=this.axisModel;if(e.get("axisLine.show")){var n=this.axisModel.axis.getExtent(),i=this._transform,r=[n[0],0],a=[n[1],0];i&&($(r,r,i),$(a,a,i));var s=o({lineCap:"round"},e.getModel("axisLine.lineStyle").getLineStyle());this.group.add(new Hv(zi({anid:"line",shape:{x1:r[0],y1:r[1],x2:a[0],y2:a[1]},style:s,strokeContainThreshold:t.strokeContainThreshold||5,silent:!0,z2:1})));var l=e.get("axisLine.symbol"),u=e.get("axisLine.symbolSize"),h=e.get("axisLine.symbolOffset")||0;if("number"==typeof h&&(h=[h,h]),null!=l){"string"==typeof l&&(l=[l,l]),"string"!=typeof u&&"number"!=typeof u||(u=[u,u]);var c=u[0],f=u[1];d([{rotate:t.rotation+Math.PI/2,offset:h[0],r:0},{rotate:t.rotation-Math.PI/2,offset:h[1],r:Math.sqrt((r[0]-a[0])*(r[0]-a[0])+(r[1]-a[1])*(r[1]-a[1]))}],function(e,n){if("none"!==l[n]&&null!=l[n]){var i=cl(l[n],-c/2,-f/2,c,f,s.stroke,!0),o=e.r+e.offset,a=[r[0]+o*Math.cos(t.rotation),r[1]-o*Math.sin(t.rotation)];i.attr({rotation:e.rotate,position:a,silent:!0}),this.group.add(i)}},this)}}},axisTickLabel:function(){var t=this.axisModel,e=this.opt,n=Iu(this,t,e);wu(t,Cu(this,t,e),n)},axisName:function(){var t=this.opt,e=this.axisModel,n=C(t.axisName,e.get("name"));if(n){var i,r=e.get("nameLocation"),a=t.nameDirection,s=e.getModel("nameTextStyle"),l=e.get("nameGap")||0,u=this.axisModel.axis.getExtent(),h=u[0]>u[1]?-1:1,c=["start"===r?u[0]-h*l:"end"===r?u[1]+h*l:(u[0]+u[1])/2,Su(r)?t.labelOffset+a*l:0],d=e.get("nameRotate");null!=d&&(d=d*Uw/180);var f;Su(r)?i=Yw(t.rotation,null!=d?d:t.rotation,a):(i=xu(t,r,d||0,u),null!=(f=t.axisNameAvailableWidth)&&(f=Math.abs(f/Math.sin(i.rotation)),!isFinite(f)&&(f=null)));var p=s.getFont(),g=e.get("nameTruncate",!0)||{},m=g.ellipsis,v=C(t.nameTruncateMaxWidth,g.maxWidth,f),y=null!=m&&null!=v?my(n,v,p,m,{minChar:2,placeholder:g.placeholder}):n,x=e.get("tooltip",!0),_=e.mainType,w={componentType:_,name:n,$vars:["name"]};w[_+"Index"]=e.componentIndex;var b=new kv({anid:"name",__fullText:n,__truncatedText:y,position:c,rotation:i.rotation,silent:_u(e),z2:1,tooltip:x&&x.show?o({content:n,formatter:function(){return n},formatterParams:w},x):null});Ki(b.style,s,{text:y,textFont:p,textFill:s.getTextColor()||e.get("axisLine.lineStyle.color"),textAlign:i.textAlign,textVerticalAlign:i.textVerticalAlign}),e.get("triggerEvent")&&(b.eventData=yu(e),b.eventData.targetType="axisName",b.eventData.name=n),this._dumbGroup.add(b),b.updateTransform(),this.group.add(b),b.decomposeTransform()}}},Yw=Xw.innerTextLayout=function(t,e,n){var i,r,o=Tr(e-t);return Dr(o)?(r=n>0?"top":"bottom",i="center"):Dr(o-Uw)?(r=n>0?"bottom":"top",i="center"):(r="middle",i=o>0&&o<Uw?n>0?"right":"left":n>0?"left":"right"),{rotation:o,textAlign:i,textVerticalAlign:r}},qw=d,$w=v,Kw=as({type:"axis",_axisPointer:null,axisPointerClass:null,render:function(t,e,n,i){this.axisPointerClass&&Ou(t),Kw.superApply(this,"render",arguments),Bu(this,t,0,n,0,!0)},updateAxisPointer:function(t,e,n,i,r){Bu(this,t,0,n,0,!1)},remove:function(t,e){var n=this._axisPointer;n&&n.remove(e),Kw.superApply(this,"remove",arguments)},dispose:function(t,e){Vu(this,e),Kw.superApply(this,"dispose",arguments)}}),Qw=[];Kw.registerAxisPointerClass=function(t,e){Qw[t]=e},Kw.getAxisPointerClass=function(t){return t&&Qw[t]};var Jw=["axisLine","axisTickLabel","axisName"],tb=["splitArea","splitLine"],eb=Kw.extend({type:"cartesianAxis",axisPointerClass:"CartesianAxisPointer",render:function(t,e,n,i){this.group.removeAll();var r=this._axisGroup;if(this._axisGroup=new Sg,this.group.add(this._axisGroup),t.get("show")){var o=t.getCoordSysModel(),a=Fu(o,t),s=new Xw(t,a);d(Jw,s.add,s),this._axisGroup.add(s.getGroup()),d(tb,function(e){t.get(e+".show")&&this["_"+e](t,o)},this),cr(r,this._axisGroup,t),eb.superCall(this,"render",t,e,n,i)}},remove:function(){this._splitAreaColors=null},_splitLine:function(t,e){var n=t.axis;if(!n.scale.isBlank()){var i=t.getModel("splitLine"),r=i.getModel("lineStyle"),o=r.get("color");o=y(o)?o:[o];for(var s=e.coordinateSystem.getRect(),l=n.isHorizontal(),u=0,h=n.getTicksCoords({tickModel:i}),c=[],d=[],f=r.getLineStyle(),p=0;p<h.length;p++){var g=n.toGlobalCoord(h[p].coord);l?(c[0]=g,c[1]=s.y,d[0]=g,d[1]=s.y+s.height):(c[0]=s.x,c[1]=g,d[0]=s.x+s.width,d[1]=g);var m=u++%o.length,v=h[p].tickValue;this._axisGroup.add(new Hv(zi({anid:null!=v?"line_"+h[p].tickValue:null,shape:{x1:c[0],y1:c[1],x2:d[0],y2:d[1]},style:a({stroke:o[m]},f),silent:!0})))}}},_splitArea:function(t,e){var n=t.axis;if(!n.scale.isBlank()){var i=t.getModel("splitArea"),r=i.getModel("areaStyle"),o=r.get("color"),s=e.coordinateSystem.getRect(),l=n.getTicksCoords({tickModel:i,clamp:!0});if(l.length){var u=o.length,h=this._splitAreaColors,c=N(),d=0;if(h)for(m=0;m<l.length;m++){var f=h.get(l[m].tickValue);if(null!=f){d=(f+(u-1)*m)%u;break}}var p=n.toGlobalCoord(l[0].coord),g=r.getAreaStyle();o=y(o)?o:[o];for(var m=1;m<l.length;m++){var v,x,_,w,b=n.toGlobalCoord(l[m].coord);n.isHorizontal()?(v=p,x=s.y,_=b-v,w=s.height,p=v+_):(v=s.x,x=p,_=s.width,p=x+(w=b-x));var M=l[m-1].tickValue;null!=M&&c.set(M,d),this._axisGroup.add(new Fv({anid:null!=M?"area_"+M:null,shape:{x:v,y:x,width:_,height:w},style:a({fill:o[d]},g),silent:!0})),d=(d+1)%u}this._splitAreaColors=c}}}});eb.extend({type:"xAxis"}),eb.extend({type:"yAxis"}),as({type:"grid",render:function(t,e){this.group.removeAll(),t.get("show")&&this.group.add(new Fv({shape:t.coordinateSystem.getRect(),style:a({fill:t.get("backgroundColor")},t.getItemStyle()),silent:!0,z2:-1}))}}),Qa(function(t){t.xAxis&&t.yAxis&&!t.grid&&(t.grid={})}),ns(Pw("line","circle","line")),es(Lw("line")),Ja(Xx.PROCESSOR.STATISTIC,function(t){return{seriesType:t,modifyOutputEnd:!0,reset:function(t,e,n){var i=t.getData(),r=t.get("sampling"),o=t.coordinateSystem;if("cartesian2d"===o.type&&r){var a=o.getBaseAxis(),s=o.getOtherAxis(a),l=a.getExtent(),u=l[1]-l[0],h=Math.round(i.count()/u);if(h>1){var c;"string"==typeof r?c=Ow[r]:"function"==typeof r&&(c=r),c&&t.setData(i.downSample(i.mapDimension(s.dim),1/h,c,zw))}}}}}("line")),cx.extend({type:"series.__base_bar__",getInitialData:function(t,e){return Os(this.getSource(),this)},getMarkerPosition:function(t){var e=this.coordinateSystem;if(e){var n=e.dataToPoint(e.clampData(t)),i=this.getData(),r=i.getLayout("offset"),o=i.getLayout("size");return n[e.getBaseAxis().isHorizontal()?0:1]+=r+o/2,n}return[NaN,NaN]},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,barMinHeight:0,barMinAngle:0,large:!1,largeThreshold:400,progressive:3e3,progressiveChunkMode:"mod",itemStyle:{},emphasis:{}}}).extend({type:"series.bar",dependencies:["grid","polar"],brushSelector:"rect",getProgressive:function(){return!!this.get("large")&&this.get("progressive")},getProgressiveThreshold:function(){var t=this.get("progressiveThreshold"),e=this.get("largeThreshold");return e>t&&(t=e),t}});var nb=Sm([["fill","color"],["stroke","borderColor"],["lineWidth","borderWidth"],["stroke","barBorderColor"],["lineWidth","barBorderWidth"],["opacity"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]),ib={getBarItemStyle:function(t){var e=nb(this,t);if(this.getBorderLineDash){var n=this.getBorderLineDash();n&&(e.lineDash=n)}return e}},rb=["itemStyle","barBorderWidth"];o(pr.prototype,ib),ls({type:"bar",render:function(t,e,n){this._updateDrawMode(t);var i=t.get("coordinateSystem");return"cartesian2d"!==i&&"polar"!==i||(this._isLargeDraw?this._renderLarge(t,e,n):this._renderNormal(t,e,n)),this.group},incrementalPrepareRender:function(t,e,n){this._clear(),this._updateDrawMode(t)},incrementalRender:function(t,e,n,i){this._incrementalRenderLarge(t,e)},_updateDrawMode:function(t){var e=t.pipelineContext.large;(null==this._isLargeDraw||e^this._isLargeDraw)&&(this._isLargeDraw=e,this._clear())},_renderNormal:function(t,e,n){var i,r=this.group,o=t.getData(),a=this._data,s=t.coordinateSystem,l=s.getBaseAxis();"cartesian2d"===s.type?i=l.isHorizontal():"polar"===s.type&&(i="angle"===l.dim);var u=t.isAnimationEnabled()?t:null;o.diff(a).add(function(e){if(o.hasValue(e)){var n=o.getItemModel(e),a=ab[s.type](o,e,n),l=ob[s.type](o,e,n,a,i,u);o.setItemGraphicEl(e,l),r.add(l),Uu(l,o,e,n,a,t,i,"polar"===s.type)}}).update(function(e,n){var l=a.getItemGraphicEl(n);if(o.hasValue(e)){var h=o.getItemModel(e),c=ab[s.type](o,e,h);l?ar(l,{shape:c},u,e):l=ob[s.type](o,e,h,c,i,u,!0),o.setItemGraphicEl(e,l),r.add(l),Uu(l,o,e,h,c,t,i,"polar"===s.type)}else r.remove(l)}).remove(function(t){var e=a.getItemGraphicEl(t);"cartesian2d"===s.type?e&&Wu(t,u,e):e&&Zu(t,u,e)}).execute(),this._data=o},_renderLarge:function(t,e,n){this._clear(),ju(t,this.group)},_incrementalRenderLarge:function(t,e){ju(e,this.group,!0)},dispose:R,remove:function(t){this._clear(t)},_clear:function(t){var e=this.group,n=this._data;t&&t.get("animation")&&n&&!this._isLargeDraw?n.eachItemGraphicEl(function(e){"sector"===e.type?Zu(e.dataIndex,t,e):Wu(e.dataIndex,t,e)}):e.removeAll(),this._data=null}});var ob={cartesian2d:function(t,e,n,i,r,a,s){var l=new Fv({shape:o({},i)});if(a){var u=l.shape,h=r?"height":"width",c={};u[h]=0,c[h]=i[h],ty[s?"updateProps":"initProps"](l,{shape:c},a,e)}return l},polar:function(t,e,n,i,r,o,s){var l=i.startAngle<i.endAngle,u=new zv({shape:a({clockwise:l},i)});if(o){var h=u.shape,c=r?"r":"endAngle",d={};h[c]=r?0:i.startAngle,d[c]=i[c],ty[s?"updateProps":"initProps"](u,{shape:d},o,e)}return u}},ab={cartesian2d:function(t,e,n){var i=t.getItemLayout(e),r=Xu(n,i),o=i.width>0?1:-1,a=i.height>0?1:-1;return{x:i.x+o*r/2,y:i.y+a*r/2,width:i.width-o*r,height:i.height-a*r}},polar:function(t,e,n){var i=t.getItemLayout(e);return{cx:i.cx,cy:i.cy,r0:i.r0,r:i.r,startAngle:i.startAngle,endAngle:i.endAngle}}},sb=xi.extend({type:"largeBar",shape:{points:[]},buildPath:function(t,e){for(var n=e.points,i=this.__startPoint,r=this.__valueIdx,o=0;o<n.length;o+=2)i[this.__valueIdx]=n[o+r],t.moveTo(i[0],i[1]),t.lineTo(n[o],n[o+1])}});es(v(function(t,e){var n=js(t,e),i=Ys(n),r={};d(n,function(t){var e=t.getData(),n=t.coordinateSystem,o=n.getBaseAxis(),a=Us(t),s=i[Xs(o)][a],l=s.offset,u=s.width,h=n.getOtherAxis(o),c=t.get("barMinHeight")||0;r[a]=r[a]||[],e.setLayout({offset:l,size:u});for(var d=e.mapDimension(h.dim),f=e.mapDimension(o.dim),p=Ps(e,d),g=h.isHorizontal(),m=Js(o,h,p),v=0,y=e.count();v<y;v++){var x=e.get(d,v),_=e.get(f,v);if(!isNaN(x)){var w=x>=0?"p":"n",b=m;p&&(r[a][_]||(r[a][_]={p:m,n:m}),b=r[a][_][w]);var M,S,I,C;if(g)M=b,S=(T=n.dataToPoint([x,_]))[1]+l,I=T[0]-m,C=u,Math.abs(I)<c&&(I=(I<0?-1:1)*c),p&&(r[a][_][w]+=I);else{var T=n.dataToPoint([_,x]);M=T[0]+l,S=b,I=u,C=T[1]-m,Math.abs(C)<c&&(C=(C<=0?-1:1)*c),p&&(r[a][_][w]+=C)}e.setItemLayout(v,{x:M,y:S,width:I,height:C})}}},this)},"bar")),es(E_),ns({seriesType:"bar",reset:function(t){t.getData().setVisual("legendSymbol","roundRect")}});var lb=function(t,e,n){e=y(e)&&{coordDimensions:e}||o({},e);var i=t.getSource(),r=C_(i,e),a=new M_(r,t);return a.initData(i,n),a},ub={updateSelectedMap:function(t){this._targetList=y(t)?t.slice():[],this._selectTargetMap=p(t||[],function(t,e){return t.set(e.name,e),t},N())},select:function(t,e){var n=null!=e?this._targetList[e]:this._selectTargetMap.get(t);"single"===this.get("selectedMode")&&this._selectTargetMap.each(function(t){t.selected=!1}),n&&(n.selected=!0)},unSelect:function(t,e){var n=null!=e?this._targetList[e]:this._selectTargetMap.get(t);n&&(n.selected=!1)},toggleSelected:function(t,e){var n=null!=e?this._targetList[e]:this._selectTargetMap.get(t);if(null!=n)return this[n.selected?"unSelect":"select"](t,e),n.selected},isSelected:function(t,e){var n=null!=e?this._targetList[e]:this._selectTargetMap.get(t);return n&&n.selected}},hb=ss({type:"series.pie",init:function(t){hb.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()},this.updateSelectedMap(this._createSelectableList()),this._defaultLabelLine(t)},mergeOption:function(t){hb.superCall(this,"mergeOption",t),this.updateSelectedMap(this._createSelectableList())},getInitialData:function(t,e){return lb(this,["value"])},_createSelectableList:function(){for(var t=this.getRawData(),e=t.mapDimension("value"),n=[],i=0,r=t.count();i<r;i++)n.push({name:t.getName(i),value:t.get(e,i),selected:Uo(t,i,"selected")});return n},getDataParams:function(t){var e=this.getData(),n=hb.superCall(this,"getDataParams",t),i=[];return e.each(e.mapDimension("value"),function(t){i.push(t)}),n.percent=Cr(i,t,e.hostModel.get("percentPrecision")),n.$vars.push("percent"),n},_defaultLabelLine:function(t){_n(t,"labelLine",["show"]);var e=t.labelLine,n=t.emphasis.labelLine;e.show=e.show&&t.label.show,n.show=n.show&&t.emphasis.label.show},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,center:["50%","50%"],radius:[0,"75%"],clockwise:!0,startAngle:90,minAngle:0,selectedOffset:10,hoverOffset:10,avoidLabelOverlap:!0,percentPrecision:2,stillShowZeroSum:!0,label:{rotate:!1,show:!0,position:"outer"},labelLine:{show:!0,length:15,length2:15,smooth:!1,lineStyle:{width:1,type:"solid"}},itemStyle:{borderWidth:1},animationType:"expansion",animationEasing:"cubicOut"}});h(hb,ub);var cb=Ku.prototype;cb.updateData=function(t,e,n){function i(){s.stopAnimation(!0),s.animateTo({shape:{r:h.r+l.get("hoverOffset")}},300,"elasticOut")}function r(){s.stopAnimation(!0),s.animateTo({shape:{r:h.r}},300,"elasticOut")}var s=this.childAt(0),l=t.hostModel,u=t.getItemModel(e),h=t.getItemLayout(e),c=o({},h);c.label=null,n?(s.setShape(c),"scale"===l.getShallow("animationType")?(s.shape.r=h.r0,sr(s,{shape:{r:h.r}},l,e)):(s.shape.endAngle=h.startAngle,ar(s,{shape:{endAngle:h.endAngle}},l,e))):ar(s,{shape:c},l,e);var d=t.getItemVisual(e,"color");s.useStyle(a({lineJoin:"bevel",fill:d},u.getModel("itemStyle").getItemStyle())),s.hoverStyle=u.getModel("emphasis.itemStyle").getItemStyle();var f=u.getShallow("cursor");f&&s.attr("cursor",f),$u(this,t.getItemLayout(e),l.isSelected(null,e),l.get("selectedOffset"),l.get("animation")),s.off("mouseover").off("mouseout").off("emphasis").off("normal"),u.get("hoverAnimation")&&l.isAnimationEnabled()&&s.on("mouseover",i).on("mouseout",r).on("emphasis",i).on("normal",r),this._updateLabel(t,e),qi(this)},cb._updateLabel=function(t,e){var n=this.childAt(1),i=this.childAt(2),r=t.hostModel,o=t.getItemModel(e),a=t.getItemLayout(e).label,s=t.getItemVisual(e,"color");ar(n,{shape:{points:a.linePoints||[[a.x,a.y],[a.x,a.y],[a.x,a.y]]}},r,e),ar(i,{style:{x:a.x,y:a.y}},r,e),i.attr({rotation:a.rotation,origin:[a.x,a.y],z2:10});var l=o.getModel("label"),u=o.getModel("emphasis.label"),h=o.getModel("labelLine"),c=o.getModel("emphasis.labelLine"),s=t.getItemVisual(e,"color");$i(i.style,i.hoverStyle={},l,u,{labelFetcher:t.hostModel,labelDataIndex:e,defaultText:t.getName(e),autoColor:s,useInsideStyle:!!a.inside},{textAlign:a.textAlign,textVerticalAlign:a.verticalAlign,opacity:t.getItemVisual(e,"opacity")}),i.ignore=i.normalIgnore=!l.get("show"),i.hoverIgnore=!u.get("show"),n.ignore=n.normalIgnore=!h.get("show"),n.hoverIgnore=!c.get("show"),n.setStyle({stroke:s,opacity:t.getItemVisual(e,"opacity")}),n.setStyle(h.getModel("lineStyle").getLineStyle()),n.hoverStyle=c.getModel("lineStyle").getLineStyle();var d=h.get("smooth");d&&!0===d&&(d=.4),n.setShape({smooth:d})},u(Ku,Sg);ra.extend({type:"pie",init:function(){var t=new Sg;this._sectorGroup=t},render:function(t,e,n,i){if(!i||i.from!==this.uid){var r=t.getData(),o=this._data,a=this.group,s=e.get("animation"),l=!o,u=t.get("animationType"),h=v(qu,this.uid,t,s,n),c=t.get("selectedMode");if(r.diff(o).add(function(t){var e=new Ku(r,t);l&&"scale"!==u&&e.eachChild(function(t){t.stopAnimation(!0)}),c&&e.on("click",h),r.setItemGraphicEl(t,e),a.add(e)}).update(function(t,e){var n=o.getItemGraphicEl(e);n.updateData(r,t),n.off("click"),c&&n.on("click",h),a.add(n),r.setItemGraphicEl(t,n)}).remove(function(t){var e=o.getItemGraphicEl(t);a.remove(e)}).execute(),s&&l&&r.count()>0&&"scale"!==u){var d=r.getItemLayout(0),f=Math.max(n.getWidth(),n.getHeight())/2,p=m(a.removeClipPath,a);a.setClipPath(this._createClipPath(d.cx,d.cy,f,d.startAngle,d.clockwise,p,t))}this._data=r}},dispose:function(){},_createClipPath:function(t,e,n,i,r,o,a){var s=new zv({shape:{cx:t,cy:e,r0:0,r:n,startAngle:i,endAngle:i,clockwise:r}});return sr(s,{shape:{endAngle:i+(r?1:-1)*Math.PI*2}},a,o),s},containPoint:function(t,e){var n=e.getData().getItemLayout(0);if(n){var i=t[0]-n.cx,r=t[1]-n.cy,o=Math.sqrt(i*i+r*r);return o<=n.r&&o>=n.r0}}});var db=function(t,e,n,i){var r,o,a=t.getData(),s=[],l=!1;a.each(function(n){var i,u,h,c,d=a.getItemLayout(n),f=a.getItemModel(n),p=f.getModel("label"),g=p.get("position")||f.get("emphasis.label.position"),m=f.getModel("labelLine"),v=m.get("length"),y=m.get("length2"),x=(d.startAngle+d.endAngle)/2,_=Math.cos(x),w=Math.sin(x);r=d.cx,o=d.cy;var b="inside"===g||"inner"===g;if("center"===g)i=d.cx,u=d.cy,c="center";else{var M=(b?(d.r+d.r0)/2*_:d.r*_)+r,S=(b?(d.r+d.r0)/2*w:d.r*w)+o;if(i=M+3*_,u=S+3*w,!b){var I=M+_*(v+e-d.r),C=S+w*(v+e-d.r),T=I+(_<0?-1:1)*y,D=C;i=T+(_<0?-5:5),u=D,h=[[M,S],[I,C],[T,D]]}c=b?"center":_>0?"left":"right"}var A=p.getFont(),k=p.get("rotate")?_<0?-x+Math.PI:-x:0,P=ce(t.getFormattedLabel(n,"normal")||a.getName(n),A,c,"top");l=!!k,d.label={x:i,y:u,position:g,height:P.height,len:v,len2:y,linePoints:h,textAlign:c,verticalAlign:"middle",rotation:k,inside:b},b||s.push(d.label)}),!l&&t.get("avoidLabelOverlap")&&Ju(s,r,o,e,n,i)},fb=2*Math.PI,pb=Math.PI/180;!function(t,e){d(e,function(e){e.update="updateView",ts(e,function(n,i){var r={};return i.eachComponent({mainType:"series",subType:t,query:n},function(t){t[e.method]&&t[e.method](n.name,n.dataIndex);var i=t.getData();i.each(function(e){var n=i.getName(e);r[n]=t.isSelected(n)||!1})}),{name:n.name,selected:r}})})}("pie",[{type:"pieToggleSelect",event:"pieselectchanged",method:"toggleSelected"},{type:"pieSelect",event:"pieselected",method:"select"},{type:"pieUnSelect",event:"pieunselected",method:"unSelect"}]),ns(function(t){return{getTargetSeries:function(e){var n={},i=N();return e.eachSeriesByType(t,function(t){t.__paletteScope=n,i.set(t.uid,t)}),i},reset:function(t,e){var n=t.getRawData(),i={},r=t.getData();r.each(function(t){var e=r.getRawIndex(t);i[e]=t}),n.each(function(e){var o=i[e],a=null!=o&&r.getItemVisual(o,"color",!0);if(a)n.setItemVisual(e,"color",a);else{var s=n.getItemModel(e).get("itemStyle.color")||t.getColorFromPalette(n.getName(e)||e+"",t.__paletteScope,n.count());n.setItemVisual(e,"color",s),null!=o&&r.setItemVisual(o,"color",s)}})}}}("pie")),es(v(function(t,e,n,i){e.eachSeriesByType(t,function(t){var e=t.getData(),i=e.mapDimension("value"),r=t.get("center"),o=t.get("radius");y(o)||(o=[0,o]),y(r)||(r=[r,r]);var a=n.getWidth(),s=n.getHeight(),l=Math.min(a,s),u=_r(r[0],a),h=_r(r[1],s),c=_r(o[0],l/2),d=_r(o[1],l/2),f=-t.get("startAngle")*pb,p=t.get("minAngle")*pb,g=0;e.each(i,function(t){!isNaN(t)&&g++});var m=e.getSum(i),v=Math.PI/(m||g)*2,x=t.get("clockwise"),_=t.get("roseType"),w=t.get("stillShowZeroSum"),b=e.getDataExtent(i);b[0]=0;var M=fb,S=0,I=f,C=x?1:-1;if(e.each(i,function(t,n){var i;if(isNaN(t))e.setItemLayout(n,{angle:NaN,startAngle:NaN,endAngle:NaN,clockwise:x,cx:u,cy:h,r0:c,r:_?NaN:d});else{(i="area"!==_?0===m&&w?v:t*v:fb/g)<p?(i=p,M-=p):S+=t;var r=I+C*i;e.setItemLayout(n,{angle:i,startAngle:I,endAngle:r,clockwise:x,cx:u,cy:h,r0:c,r:_?xr(t,b,[c,d]):d}),I=r}}),M<fb&&g)if(M<=.001){var T=fb/g;e.each(i,function(t,n){if(!isNaN(t)){var i=e.getItemLayout(n);i.angle=T,i.startAngle=f+C*n*T,i.endAngle=f+C*(n+1)*T}})}else v=M/S,I=f,e.each(i,function(t,n){if(!isNaN(t)){var i=e.getItemLayout(n),r=i.angle===p?p:t*v;i.startAngle=I,i.endAngle=I+C*r,I+=C*r}});db(t,d,a,s)})},"pie")),Ja(function(t){return{seriesType:t,reset:function(t,e){var n=e.findComponents({mainType:"legend"});if(n&&n.length){var i=t.getData();i.filterSelf(function(t){for(var e=i.getName(t),r=0;r<n.length;r++)if(!n[r].isSelected(e))return!1;return!0})}}}}("pie")),cx.extend({type:"series.scatter",dependencies:["grid","polar","geo","singleAxis","calendar"],getInitialData:function(t,e){return Os(this.getSource(),this)},brushSelector:"point",getProgressive:function(){var t=this.option.progressive;return null==t?this.option.large?5e3:this.get("progressive"):t},getProgressiveThreshold:function(){var t=this.option.progressiveThreshold;return null==t?this.option.large?1e4:this.get("progressiveThreshold"):t},defaultOption:{coordinateSystem:"cartesian2d",zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,symbolSize:10,large:!1,largeThreshold:2e3,itemStyle:{opacity:.8}}});var gb=Ai({shape:{points:null},symbolProxy:null,buildPath:function(t,e){var n=e.points,i=e.size,r=this.symbolProxy,o=r.shape;if(!((t.getContext?t.getContext():t)&&i[0]<4))for(var a=0;a<n.length;){var s=n[a++],l=n[a++];isNaN(s)||isNaN(l)||(o.x=s-i[0]/2,o.y=l-i[1]/2,o.width=i[0],o.height=i[1],r.buildPath(t,o,!0))}},afterBrush:function(t){var e=this.shape,n=e.points,i=e.size;if(i[0]<4){this.setTransform(t);for(var r=0;r<n.length;){var o=n[r++],a=n[r++];isNaN(o)||isNaN(a)||t.fillRect(o-i[0]/2,a-i[1]/2,i[0],i[1])}this.restoreTransform(t)}},findDataIndex:function(t,e){for(var n=this.shape,i=n.points,r=n.size,o=Math.max(r[0],4),a=Math.max(r[1],4),s=i.length/2-1;s>=0;s--){var l=2*s,u=i[l]-o/2,h=i[l+1]-a/2;if(t>=u&&e>=h&&t<=u+o&&e<=h+a)return s}return-1}}),mb=th.prototype;mb.isPersistent=function(){return!this._incremental},mb.updateData=function(t){this.group.removeAll();var e=new gb({rectHover:!0,cursor:"default"});e.setShape({points:t.getLayout("symbolPoints")}),this._setCommon(e,t),this.group.add(e),this._incremental=null},mb.updateLayout=function(t){if(!this._incremental){var e=t.getLayout("symbolPoints");this.group.eachChild(function(t){if(null!=t.startIndex){var n=2*(t.endIndex-t.startIndex),i=4*t.startIndex*2;e=new Float32Array(e.buffer,i,n)}t.setShape("points",e)})}},mb.incrementalPrepareUpdate=function(t){this.group.removeAll(),this._clearIncremental(),t.count()>2e6?(this._incremental||(this._incremental=new Di({silent:!0})),this.group.add(this._incremental)):this._incremental=null},mb.incrementalUpdate=function(t,e){var n;this._incremental?(n=new gb,this._incremental.addDisplayable(n,!0)):((n=new gb({rectHover:!0,cursor:"default",startIndex:t.start,endIndex:t.end})).incremental=!0,this.group.add(n)),n.setShape({points:e.getLayout("symbolPoints")}),this._setCommon(n,e,!!this._incremental)},mb._setCommon=function(t,e,n){var i=e.hostModel,r=e.getVisual("symbolSize");t.setShape("size",r instanceof Array?r:[r,r]),t.symbolProxy=cl(e.getVisual("symbol"),0,0,0,0),t.setColor=t.symbolProxy.setColor;var o=t.shape.size[0]<4;t.useStyle(i.getModel("itemStyle").getItemStyle(o?["color","shadowBlur","shadowColor"]:["color"]));var a=e.getVisual("color");a&&t.setColor(a),n||(t.seriesIndex=i.seriesIndex,t.on("mousemove",function(e){t.dataIndex=null;var n=t.findDataIndex(e.offsetX,e.offsetY);n>=0&&(t.dataIndex=n+(t.startIndex||0))}))},mb.remove=function(){this._clearIncremental(),this._incremental=null,this.group.removeAll()},mb._clearIncremental=function(){var t=this._incremental;t&&t.clearDisplaybles()},ls({type:"scatter",render:function(t,e,n){var i=t.getData();this._updateSymbolDraw(i,t).updateData(i),this._finished=!0},incrementalPrepareRender:function(t,e,n){var i=t.getData();this._updateSymbolDraw(i,t).incrementalPrepareUpdate(i),this._finished=!1},incrementalRender:function(t,e,n){this._symbolDraw.incrementalUpdate(t,e.getData()),this._finished=t.end===e.getData().count()},updateTransform:function(t,e,n){var i=t.getData();if(this.group.dirty(),!this._finished||i.count()>1e4||!this._symbolDraw.isPersistent())return{update:!0};var r=Lw().reset(t);r.progress&&r.progress({start:0,end:i.count()},i),this._symbolDraw.updateLayout(i)},_updateSymbolDraw:function(t,e){var n=this._symbolDraw,i=e.pipelineContext.large;return n&&i===this._isLargeDraw||(n&&n.remove(),n=this._symbolDraw=i?new th:new Bl,this._isLargeDraw=i,this.group.removeAll()),this.group.add(n.group),n},remove:function(t,e){this._symbolDraw&&this._symbolDraw.remove(!0),this._symbolDraw=null},dispose:function(){}}),ns(Pw("scatter","circle")),es(Lw("scatter")),Qa(function(t){var e=t.graphic;y(e)?e[0]&&e[0].elements?t.graphic=[t.graphic[0]]:t.graphic=[{elements:e}]:e&&!e.elements&&(t.graphic=[{elements:[e]}])});var vb=os({type:"graphic",defaultOption:{elements:[],parentId:null},_elOptionsToUpdate:null,mergeOption:function(t){var e=this.option.elements;this.option.elements=null,vb.superApply(this,"mergeOption",arguments),this.option.elements=e},optionUpdated:function(t,e){var n=this.option,i=(e?n:t).elements,r=n.elements=e?[]:n.elements,o=[];this._flatten(i,o);var a=Mn(r,o);Sn(a);var s=this._elOptionsToUpdate=[];d(a,function(t,e){var n=t.option;n&&(s.push(n),oh(t,n),ah(r,e,n),sh(r[e],n))},this);for(var l=r.length-1;l>=0;l--)null==r[l]?r.splice(l,1):delete r[l].$action},_flatten:function(t,e,n){d(t,function(t){if(t){n&&(t.parentOption=n),e.push(t);var i=t.children;"group"===t.type&&i&&this._flatten(i,e,t),delete t.children}},this)},useElOptionsToUpdate:function(){var t=this._elOptionsToUpdate;return this._elOptionsToUpdate=null,t}});as({type:"graphic",init:function(t,e){this._elMap=N(),this._lastGraphicModel},render:function(t,e,n){t!==this._lastGraphicModel&&this._clear(),this._lastGraphicModel=t,this._updateElements(t,n),this._relocate(t,n)},_updateElements:function(t,e){var n=t.useElOptionsToUpdate();if(n){var i=this._elMap,r=this.group;d(n,function(t){var e=t.$action,n=t.id,o=i.get(n),a=t.parentId,s=null!=a?i.get(a):r;if("text"===t.type){var l=t.style;t.hv&&t.hv[1]&&(l.textVerticalAlign=l.textBaseline=null),!l.hasOwnProperty("textFill")&&l.fill&&(l.textFill=l.fill),!l.hasOwnProperty("textStroke")&&l.stroke&&(l.textStroke=l.stroke)}var u=ih(t);e&&"merge"!==e?"replace"===e?(nh(o,i),eh(n,s,u,i)):"remove"===e&&nh(o,i):o?o.attr(u):eh(n,s,u,i);var h=i.get(n);h&&(h.__ecGraphicWidth=t.width,h.__ecGraphicHeight=t.height)})}},_relocate:function(t,e){for(var n=t.option.elements,i=this.group,r=this._elMap,o=n.length-1;o>=0;o--){var a=n[o],s=r.get(a.id);if(s){var l=s.parent;Wr(s,a,l===i?{width:e.getWidth(),height:e.getHeight()}:{width:l.__ecGraphicWidth||0,height:l.__ecGraphicHeight||0},null,{hv:a.hv,boundingMode:a.bounding})}}},_clear:function(){var t=this._elMap;t.each(function(e){nh(e,t)}),this._elMap=N()},dispose:function(){this._clear()}});var yb=function(t,e){var n,i=[],r=t.seriesIndex;if(null==r||!(n=e.getSeriesByIndex(r)))return{point:[]};var o=n.getData(),a=Tn(o,t);if(null==a||a<0||y(a))return{point:[]};var s=o.getItemGraphicEl(a),l=n.coordinateSystem;if(n.getTooltipPosition)i=n.getTooltipPosition(a)||[];else if(l&&l.dataToPoint)i=l.dataToPoint(o.getValues(f(l.dimensions,function(t){return o.mapDimension(t)}),a,!0))||[];else if(s){var u=s.getBoundingRect().clone();u.applyTransform(s.transform),i=[u.x+u.width/2,u.y+u.height/2]}return{point:i,el:s}},xb=d,_b=v,wb=Dn(),bb=(os({type:"axisPointer",coordSysAxesInfo:null,defaultOption:{show:"auto",triggerOn:null,zlevel:0,z:50,type:"line",snap:!1,triggerTooltip:!0,value:null,status:null,link:[],animation:null,animationDurationUpdate:200,lineStyle:{color:"#aaa",width:1,type:"solid"},shadowStyle:{color:"rgba(150,150,150,0.3)"},label:{show:!0,formatter:null,precision:"auto",margin:3,color:"#fff",padding:[5,7,5,7],backgroundColor:"auto",borderColor:null,borderWidth:0,shadowBlur:3,shadowColor:"#aaa"},handle:{show:!1,icon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",size:45,margin:50,color:"#333",shadowBlur:3,shadowColor:"#aaa",shadowOffsetX:0,shadowOffsetY:2,throttle:40}}}),Dn()),Mb=d,Sb=as({type:"axisPointer",render:function(t,e,n){var i=e.getComponent("tooltip"),r=t.get("triggerOn")||i&&i.get("triggerOn")||"mousemove|click";yh("axisPointer",n,function(t,e,n){"none"!==r&&("leave"===t||r.indexOf(t)>=0)&&n({type:"updateAxisPointer",currTrigger:t,x:e&&e.offsetX,y:e&&e.offsetY})})},remove:function(t,e){Sh(e.getZr(),"axisPointer"),Sb.superApply(this._model,"remove",arguments)},dispose:function(t,e){Sh("axisPointer",e),Sb.superApply(this._model,"dispose",arguments)}}),Ib=Dn(),Cb=n,Tb=m;(Ih.prototype={_group:null,_lastGraphicKey:null,_handle:null,_dragging:!1,_lastValue:null,_lastStatus:null,_payloadInfo:null,animationThreshold:15,render:function(t,e,n,i){var r=e.get("value"),o=e.get("status");if(this._axisModel=t,this._axisPointerModel=e,this._api=n,i||this._lastValue!==r||this._lastStatus!==o){this._lastValue=r,this._lastStatus=o;var a=this._group,s=this._handle;if(!o||"hide"===o)return a&&a.hide(),void(s&&s.hide());a&&a.show(),s&&s.show();var l={};this.makeElOption(l,r,t,e,n);var u=l.graphicKey;u!==this._lastGraphicKey&&this.clear(n),this._lastGraphicKey=u;var h=this._moveAnimation=this.determineAnimation(t,e);if(a){var c=v(Ch,e,h);this.updatePointerEl(a,l,c,e),this.updateLabelEl(a,l,c,e)}else a=this._group=new Sg,this.createPointerEl(a,l,t,e),this.createLabelEl(a,l,t,e),n.getZr().add(a);kh(a,e,!0),this._renderHandle(r)}},remove:function(t){this.clear(t)},dispose:function(t){this.clear(t)},determineAnimation:function(t,e){var n=e.get("animation"),i=t.axis,r="category"===i.type,o=e.get("snap");if(!o&&!r)return!1;if("auto"===n||null==n){var a=this.animationThreshold;if(r&&i.getBandWidth()>a)return!0;if(o){var s=zu(t).seriesDataCount,l=i.getExtent();return Math.abs(l[0]-l[1])/s>a}return!1}return!0===n},makeElOption:function(t,e,n,i,r){},createPointerEl:function(t,e,n,i){var r=e.pointer;if(r){var o=Ib(t).pointerEl=new ty[r.type](Cb(e.pointer));t.add(o)}},createLabelEl:function(t,e,n,i){if(e.label){var r=Ib(t).labelEl=new Fv(Cb(e.label));t.add(r),Dh(r,i)}},updatePointerEl:function(t,e,n){var i=Ib(t).pointerEl;i&&(i.setStyle(e.pointer.style),n(i,{shape:e.pointer.shape}))},updateLabelEl:function(t,e,n,i){var r=Ib(t).labelEl;r&&(r.setStyle(e.label.style),n(r,{shape:e.label.shape,position:e.label.position}),Dh(r,i))},_renderHandle:function(t){if(!this._dragging&&this.updateHandleTransform){var e=this._axisPointerModel,n=this._api.getZr(),i=this._handle,r=e.getModel("handle"),o=e.get("status");if(!r.get("show")||!o||"hide"===o)return i&&n.remove(i),void(this._handle=null);var a;this._handle||(a=!0,i=this._handle=fr(r.get("icon"),{cursor:"move",draggable:!0,onmousemove:function(t){tm(t.event)},onmousedown:Tb(this._onHandleDragMove,this,0,0),drift:Tb(this._onHandleDragMove,this),ondragend:Tb(this._onHandleDragEnd,this)}),n.add(i)),kh(i,e,!1);var s=["color","borderColor","borderWidth","opacity","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY"];i.setStyle(r.getItemStyle(null,s));var l=r.get("size");y(l)||(l=[l,l]),i.attr("scale",[l[0]/2,l[1]/2]),ha(this,"_doDispatchAxisPointer",r.get("throttle")||0,"fixRate"),this._moveHandleToValue(t,a)}},_moveHandleToValue:function(t,e){Ch(this._axisPointerModel,!e&&this._moveAnimation,this._handle,Ah(this.getHandleTransform(t,this._axisModel,this._axisPointerModel)))},_onHandleDragMove:function(t,e){var n=this._handle;if(n){this._dragging=!0;var i=this.updateHandleTransform(Ah(n),[t,e],this._axisModel,this._axisPointerModel);this._payloadInfo=i,n.stopAnimation(),n.attr(Ah(i)),Ib(n).lastProp=null,this._doDispatchAxisPointer()}},_doDispatchAxisPointer:function(){if(this._handle){var t=this._payloadInfo,e=this._axisModel;this._api.dispatchAction({type:"updateAxisPointer",x:t.cursorPoint[0],y:t.cursorPoint[1],tooltipOption:t.tooltipOption,axesInfo:[{axisDim:e.axis.dim,axisIndex:e.componentIndex}]})}},_onHandleDragEnd:function(t){if(this._dragging=!1,this._handle){var e=this._axisPointerModel.get("value");this._moveHandleToValue(e),this._api.dispatchAction({type:"hideTip"})}},getHandleTransform:null,updateHandleTransform:null,clear:function(t){this._lastValue=null,this._lastStatus=null;var e=t.getZr(),n=this._group,i=this._handle;e&&n&&(this._lastGraphicKey=null,n&&e.remove(n),i&&e.remove(i),this._group=null,this._handle=null,this._payloadInfo=null)},doClear:function(){},buildLabel:function(t,e,n){return n=n||0,{x:t[n],y:t[1-n],width:e[n],height:e[1-n]}}}).constructor=Ih,En(Ih);var Db=Ih.extend({makeElOption:function(t,e,n,i,r){var o=n.axis,a=o.grid,s=i.get("type"),l=Vh(a,o).getOtherAxis(o).getGlobalExtent(),u=o.toGlobalCoord(o.dataToCoord(e,!0));if(s&&"none"!==s){var h=Ph(i),c=Ab[s](o,u,l,h);c.style=h,t.graphicKey=c.type,t.pointer=c}Nh(e,t,Fu(a.model,n),n,i,r)},getHandleTransform:function(t,e,n){var i=Fu(e.axis.grid.model,e,{labelInside:!1});return i.labelMargin=n.get("handle.margin"),{position:Eh(e.axis,t,i),rotation:i.rotation+(i.labelDirection<0?Math.PI:0)}},updateHandleTransform:function(t,e,n,i){var r=n.axis,o=r.grid,a=r.getGlobalExtent(!0),s=Vh(o,r).getOtherAxis(r).getGlobalExtent(),l="x"===r.dim?0:1,u=t.position;u[l]+=e[l],u[l]=Math.min(a[1],u[l]),u[l]=Math.max(a[0],u[l]);var h=(s[1]+s[0])/2,c=[h,h];c[l]=u[l];var d=[{verticalAlign:"middle"},{align:"center"}];return{position:u,rotation:t.rotation,cursorPoint:c,tooltipOption:d[l]}}}),Ab={line:function(t,e,n,i){var r=Rh([e,n[0]],[e,n[1]],Fh(t));return zi({shape:r,style:i}),{type:"Line",shape:r}},shadow:function(t,e,n,i){var r=Math.max(1,t.getBandWidth()),o=n[1]-n[0];return{type:"Rect",shape:Bh([e-r/2,n[0]],[r,o],Fh(t))}}};Kw.registerAxisPointerClass("CartesianAxisPointer",Db),Qa(function(t){if(t){(!t.axisPointer||0===t.axisPointer.length)&&(t.axisPointer={});var e=t.axisPointer.link;e&&!y(e)&&(t.axisPointer.link=[e])}}),Ja(Xx.PROCESSOR.STATISTIC,function(t,e){t.getComponent("axisPointer").coordSysAxesInfo=Tu(t,e)}),ts({type:"updateAxisPointer",event:"updateAxisPointer",update:":updateAxisPointer"},function(t,e,n){var i=t.currTrigger,r=[t.x,t.y],o=t,a=t.dispatchAction||m(n.dispatchAction,n),s=e.getComponent("axisPointer").coordSysAxesInfo;if(s){vh(r)&&(r=yb({seriesIndex:o.seriesIndex,dataIndex:o.dataIndex},e).point);var l=vh(r),u=o.axesInfo,h=s.axesInfo,c="leave"===i||vh(r),d={},f={},p={list:[],map:{}},g={showPointer:_b(hh,f),showTooltip:_b(ch,p)};xb(s.coordSysMap,function(t,e){var n=l||t.containPoint(r);xb(s.coordSysAxesInfo[e],function(t,e){var i=t.axis,o=gh(u,t);if(!c&&n&&(!u||o)){var a=o&&o.value;null!=a||l||(a=i.pointToData(r)),null!=a&&lh(t,a,g,!1,d)}})});var v={};return xb(h,function(t,e){var n=t.linkGroup;n&&!f[e]&&xb(n.axesInfo,function(e,i){var r=f[i];if(e!==t&&r){var o=r.value;n.mapper&&(o=t.axis.scale.parse(n.mapper(o,mh(e),mh(t)))),v[t.key]=o}})}),xb(v,function(t,e){lh(h[e],t,g,!0,d)}),dh(f,h,d),fh(p,r,t,a),ph(h,0,n),d}}),os({type:"tooltip",dependencies:["axisPointer"],defaultOption:{zlevel:0,z:8,show:!0,showContent:!0,trigger:"item",triggerOn:"mousemove|click",alwaysShowContent:!1,displayMode:"single",confine:!1,showDelay:0,hideDelay:100,transitionDuration:.4,enterable:!1,backgroundColor:"rgba(50,50,50,0.7)",borderColor:"#333",borderRadius:4,borderWidth:0,padding:5,extraCssText:"",axisPointer:{type:"line",axis:"auto",animation:"auto",animationDurationUpdate:200,animationEasingUpdate:"exponentialOut",crossStyle:{color:"#999",width:1,type:"dashed",textStyle:{}}},textStyle:{color:"#fff",fontSize:14}}});var kb=d,Pb=zr,Lb=["","-webkit-","-moz-","-o-"];Zh.prototype={constructor:Zh,_enterable:!0,update:function(){var t=this._container,e=t.currentStyle||document.defaultView.getComputedStyle(t),n=t.style;"absolute"!==n.position&&"absolute"!==e.position&&(n.position="relative")},show:function(t){clearTimeout(this._hideTimeout);var e=this.el;e.style.cssText="position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;"+Wh(t)+";left:"+this._x+"px;top:"+this._y+"px;"+(t.get("extraCssText")||""),e.style.display=e.innerHTML?"block":"none",this._show=!0},setContent:function(t){this.el.innerHTML=null==t?"":t},setEnterable:function(t){this._enterable=t},getSize:function(){var t=this.el;return[t.clientWidth,t.clientHeight]},moveTo:function(t,e){var n,i=this._zr;i&&i.painter&&(n=i.painter.getViewportRootOffset())&&(t+=n.offsetLeft,e+=n.offsetTop);var r=this.el.style;r.left=t+"px",r.top=e+"px",this._x=t,this._y=e},hide:function(){this.el.style.display="none",this._show=!1},hideLater:function(t){!this._show||this._inContent&&this._enterable||(t?(this._hideDelay=t,this._show=!1,this._hideTimeout=setTimeout(m(this.hide,this),t)):this.hide())},isShow:function(){return this._show}};var Ob=m,zb=d,Eb=_r,Nb=new Fv({shape:{x:-1,y:-1,width:2,height:2}});as({type:"tooltip",init:function(t,e){if(!bp.node){var n=new Zh(e.getDom(),e);this._tooltipContent=n}},render:function(t,e,n){if(!bp.node&&!bp.wxa){this.group.removeAll(),this._tooltipModel=t,this._ecModel=e,this._api=n,this._lastDataByCoordSys=null,this._alwaysShowContent=t.get("alwaysShowContent");var i=this._tooltipContent;i.update(),i.setEnterable(t.get("enterable")),this._initGlobalListener(),this._keepShow()}},_initGlobalListener:function(){var t=this._tooltipModel.get("triggerOn");yh("itemTooltip",this._api,Ob(function(e,n,i){"none"!==t&&(t.indexOf(e)>=0?this._tryShow(n,i):"leave"===e&&this._hide(i))},this))},_keepShow:function(){var t=this._tooltipModel,e=this._ecModel,n=this._api;if(null!=this._lastX&&null!=this._lastY&&"none"!==t.get("triggerOn")){var i=this;clearTimeout(this._refreshUpdateTimeout),this._refreshUpdateTimeout=setTimeout(function(){i.manuallyShowTip(t,e,n,{x:i._lastX,y:i._lastY})})}},manuallyShowTip:function(t,e,n,i){if(i.from!==this.uid&&!bp.node){var r=Xh(i,n);this._ticket="";var o=i.dataByCoordSys;if(i.tooltip&&null!=i.x&&null!=i.y){var a=Nb;a.position=[i.x,i.y],a.update(),a.tooltip=i.tooltip,this._tryShow({offsetX:i.x,offsetY:i.y,target:a},r)}else if(o)this._tryShow({offsetX:i.x,offsetY:i.y,position:i.position,event:{},dataByCoordSys:i.dataByCoordSys,tooltipOption:i.tooltipOption},r);else if(null!=i.seriesIndex){if(this._manuallyAxisShowTip(t,e,n,i))return;var s=yb(i,e),l=s.point[0],u=s.point[1];null!=l&&null!=u&&this._tryShow({offsetX:l,offsetY:u,position:i.position,target:s.el,event:{}},r)}else null!=i.x&&null!=i.y&&(n.dispatchAction({type:"updateAxisPointer",x:i.x,y:i.y}),this._tryShow({offsetX:i.x,offsetY:i.y,position:i.position,target:n.getZr().findHover(i.x,i.y).target,event:{}},r))}},manuallyHideTip:function(t,e,n,i){var r=this._tooltipContent;!this._alwaysShowContent&&this._tooltipModel&&r.hideLater(this._tooltipModel.get("hideDelay")),this._lastX=this._lastY=null,i.from!==this.uid&&this._hide(Xh(i,n))},_manuallyAxisShowTip:function(t,e,n,i){var r=i.seriesIndex,o=i.dataIndex,a=e.getComponent("axisPointer").coordSysAxesInfo;if(null!=r&&null!=o&&null!=a){var s=e.getSeriesByIndex(r);if(s&&"axis"===(t=Uh([s.getData().getItemModel(o),s,(s.coordinateSystem||{}).model,t])).get("trigger"))return n.dispatchAction({type:"updateAxisPointer",seriesIndex:r,dataIndex:o,position:i.position}),!0}},_tryShow:function(t,e){var n=t.target;if(this._tooltipModel){this._lastX=t.offsetX,this._lastY=t.offsetY;var i=t.dataByCoordSys;i&&i.length?this._showAxisTooltip(i,t):n&&null!=n.dataIndex?(this._lastDataByCoordSys=null,this._showSeriesItemTooltip(t,n,e)):n&&n.tooltip?(this._lastDataByCoordSys=null,this._showComponentItemTooltip(t,n,e)):(this._lastDataByCoordSys=null,this._hide(e))}},_showOrMove:function(t,e){var n=t.get("showDelay");e=m(e,this),clearTimeout(this._showTimout),n>0?this._showTimout=setTimeout(e,n):e()},_showAxisTooltip:function(t,e){var n=this._ecModel,i=this._tooltipModel,r=[e.offsetX,e.offsetY],o=[],a=[],s=Uh([e.tooltipOption,i]);zb(t,function(t){zb(t.dataByAxis,function(t){var e=n.getComponent(t.axisDim+"Axis",t.axisIndex),i=t.value,r=[];if(e&&null!=i){var s=zh(i,e.axis,n,t.seriesDataIndices,t.valueLabelOpt);d(t.seriesDataIndices,function(o){var l=n.getSeriesByIndex(o.seriesIndex),u=o.dataIndexInside,h=l&&l.getDataParams(u);h.axisDim=t.axisDim,h.axisIndex=t.axisIndex,h.axisType=t.axisType,h.axisId=t.axisId,h.axisValue=sl(e.axis,i),h.axisValueLabel=s,h&&(a.push(h),r.push(l.formatTooltip(u,!0)))});var l=s;o.push((l?Er(l)+"<br />":"")+r.join("<br />"))}})},this),o.reverse(),o=o.join("<br /><br />");var l=e.position;this._showOrMove(s,function(){this._updateContentNotChangedOnAxis(t)?this._updatePosition(s,l,r[0],r[1],this._tooltipContent,a):this._showTooltipContent(s,o,a,Math.random(),r[0],r[1],l)})},_showSeriesItemTooltip:function(t,e,n){var i=this._ecModel,r=e.seriesIndex,o=i.getSeriesByIndex(r),a=e.dataModel||o,s=e.dataIndex,l=e.dataType,u=a.getData(),h=Uh([u.getItemModel(s),a,o&&(o.coordinateSystem||{}).model,this._tooltipModel]),c=h.get("trigger");if(null==c||"item"===c){var d=a.getDataParams(s,l),f=a.formatTooltip(s,!1,l),p="item_"+a.name+"_"+s;this._showOrMove(h,function(){this._showTooltipContent(h,f,d,p,t.offsetX,t.offsetY,t.position,t.target)}),n({type:"showTip",dataIndexInside:s,dataIndex:u.getRawIndex(s),seriesIndex:r,from:this.uid})}},_showComponentItemTooltip:function(t,e,n){var i=e.tooltip;if("string"==typeof i){var r=i;i={content:r,formatter:r}}var o=new pr(i,this._tooltipModel,this._ecModel),a=o.get("content"),s=Math.random();this._showOrMove(o,function(){this._showTooltipContent(o,a,o.get("formatterParams")||{},s,t.offsetX,t.offsetY,t.position,e)}),n({type:"showTip",from:this.uid})},_showTooltipContent:function(t,e,n,i,r,o,a,s){if(this._ticket="",t.get("showContent")&&t.get("show")){var l=this._tooltipContent,u=t.get("formatter");a=a||t.get("position");var h=e;if(u&&"string"==typeof u)h=Nr(u,n,!0);else if("function"==typeof u){var c=Ob(function(e,i){e===this._ticket&&(l.setContent(i),this._updatePosition(t,a,r,o,l,n,s))},this);this._ticket=i,h=u(n,i,c)}l.setContent(h),l.show(t),this._updatePosition(t,a,r,o,l,n,s)}},_updatePosition:function(t,e,n,i,r,o,a){var s=this._api.getWidth(),l=this._api.getHeight();e=e||t.get("position");var u=r.getSize(),h=t.get("align"),c=t.get("verticalAlign"),d=a&&a.getBoundingRect().clone();if(a&&d.applyTransform(a.transform),"function"==typeof e&&(e=e([n,i],o,r.el,d,{viewSize:[s,l],contentSize:u.slice()})),y(e))n=Eb(e[0],s),i=Eb(e[1],l);else if(w(e)){e.width=u[0],e.height=u[1];var f=Gr(e,{width:s,height:l});n=f.x,i=f.y,h=null,c=null}else"string"==typeof e&&a?(n=(p=$h(e,d,u))[0],i=p[1]):(n=(p=jh(n,i,r.el,s,l,h?null:20,c?null:20))[0],i=p[1]);if(h&&(n-=Kh(h)?u[0]/2:"right"===h?u[0]:0),c&&(i-=Kh(c)?u[1]/2:"bottom"===c?u[1]:0),t.get("confine")){var p=Yh(n,i,r.el,s,l);n=p[0],i=p[1]}r.moveTo(n,i)},_updateContentNotChangedOnAxis:function(t){var e=this._lastDataByCoordSys,n=!!e&&e.length===t.length;return n&&zb(e,function(e,i){var r=e.dataByAxis||{},o=(t[i]||{}).dataByAxis||[];(n&=r.length===o.length)&&zb(r,function(t,e){var i=o[e]||{},r=t.seriesDataIndices||[],a=i.seriesDataIndices||[];(n&=t.value===i.value&&t.axisType===i.axisType&&t.axisId===i.axisId&&r.length===a.length)&&zb(r,function(t,e){var i=a[e];n&=t.seriesIndex===i.seriesIndex&&t.dataIndex===i.dataIndex})})}),this._lastDataByCoordSys=t,!!n},_hide:function(t){this._lastDataByCoordSys=null,t({type:"hideTip",from:this.uid})},dispose:function(t,e){bp.node||bp.wxa||(this._tooltipContent.hide(),Sh("itemTooltip",e))}}),ts({type:"showTip",event:"showTip",update:"tooltip:manuallyShowTip"},function(){}),ts({type:"hideTip",event:"hideTip",update:"tooltip:manuallyHideTip"},function(){});var Rb=os({type:"legend.plain",dependencies:["series"],layoutMode:{type:"box",ignoreSize:!0},init:function(t,e,n){this.mergeDefaultAndTheme(t,n),t.selected=t.selected||{}},mergeOption:function(t){Rb.superCall(this,"mergeOption",t)},optionUpdated:function(){this._updateData(this.ecModel);var t=this._data;if(t[0]&&"single"===this.get("selectedMode")){for(var e=!1,n=0;n<t.length;n++){var i=t[n].get("name");if(this.isSelected(i)){this.select(i),e=!0;break}}!e&&this.select(t[0].get("name"))}},_updateData:function(t){var e=[],n=[];t.eachRawSeries(function(i){var r=i.name;n.push(r);var o;if(i.legendDataProvider){var a=i.legendDataProvider(),s=a.mapArray(a.getName);t.isSeriesFiltered(i)||(n=n.concat(s)),s.length?e=e.concat(s):o=!0}else o=!0;o&&In(i)&&e.push(i.name)}),this._availableNames=n;var i=f(this.get("data")||e,function(t){return"string"!=typeof t&&"number"!=typeof t||(t={name:t}),new pr(t,this,this.ecModel)},this);this._data=i},getData:function(){return this._data},select:function(t){var e=this.option.selected;"single"===this.get("selectedMode")&&d(this._data,function(t){e[t.get("name")]=!1}),e[t]=!0},unSelect:function(t){"single"!==this.get("selectedMode")&&(this.option.selected[t]=!1)},toggleSelected:function(t){var e=this.option.selected;e.hasOwnProperty(t)||(e[t]=!0),this[e[t]?"unSelect":"select"](t)},isSelected:function(t){var e=this.option.selected;return!(e.hasOwnProperty(t)&&!e[t])&&l(this._availableNames,t)>=0},defaultOption:{zlevel:0,z:4,show:!0,orient:"horizontal",left:"center",top:0,align:"auto",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemGap:10,itemWidth:25,itemHeight:14,inactiveColor:"#ccc",textStyle:{color:"#333"},selectedMode:!0,tooltip:{show:!1}}});ts("legendToggleSelect","legendselectchanged",v(Qh,"toggleSelected")),ts("legendSelect","legendselected",v(Qh,"select")),ts("legendUnSelect","legendunselected",v(Qh,"unSelect"));var Bb=v,Vb=d,Fb=Sg,Hb=as({type:"legend.plain",newlineDisabled:!1,init:function(){this.group.add(this._contentGroup=new Fb),this._backgroundEl},getContentGroup:function(){return this._contentGroup},render:function(t,e,n){if(this.resetInner(),t.get("show",!0)){var i=t.get("align");i&&"auto"!==i||(i="right"===t.get("left")&&"vertical"===t.get("orient")?"right":"left"),this.renderInner(i,t,e,n);var r=t.getBoxLayoutParams(),o={width:n.getWidth(),height:n.getHeight()},s=t.get("padding"),l=Gr(r,o,s),u=this.layoutInner(t,i,l),h=Gr(a({width:u.width,height:u.height},r),o,s);this.group.attr("position",[h.x-u.x,h.y-u.y]),this.group.add(this._backgroundEl=tc(u,t))}},resetInner:function(){this.getContentGroup().removeAll(),this._backgroundEl&&this.group.remove(this._backgroundEl)},renderInner:function(t,e,n,i){var r=this.getContentGroup(),o=N(),a=e.get("selectedMode"),s=[];n.eachRawSeries(function(t){!t.get("legendHoverLink")&&s.push(t.id)}),Vb(e.getData(),function(l,u){var h=l.get("name");if(this.newlineDisabled||""!==h&&"\n"!==h){var c=n.getSeriesByName(h)[0];if(!o.get(h))if(c){var d=c.getData(),f=d.getVisual("color");"function"==typeof f&&(f=f(c.getDataParams(0)));var p=d.getVisual("legendSymbol")||"roundRect",g=d.getVisual("symbol");this._createItem(h,u,l,e,p,g,t,f,a).on("click",Bb(ec,h,i)).on("mouseover",Bb(nc,c,null,i,s)).on("mouseout",Bb(ic,c,null,i,s)),o.set(h,!0)}else n.eachRawSeries(function(n){if(!o.get(h)&&n.legendDataProvider){var r=n.legendDataProvider(),c=r.indexOfName(h);if(c<0)return;var d=r.getItemVisual(c,"color");this._createItem(h,u,l,e,"roundRect",null,t,d,a).on("click",Bb(ec,h,i)).on("mouseover",Bb(nc,n,h,i,s)).on("mouseout",Bb(ic,n,h,i,s)),o.set(h,!0)}},this)}else r.add(new Fb({newline:!0}))},this)},_createItem:function(t,e,n,i,r,a,s,l,u){var h=i.get("itemWidth"),c=i.get("itemHeight"),d=i.get("inactiveColor"),f=i.get("symbolKeepAspect"),p=i.isSelected(t),g=new Fb,m=n.getModel("textStyle"),v=n.get("icon"),y=n.getModel("tooltip"),x=y.parentModel;if(r=v||r,g.add(cl(r,0,0,h,c,p?l:d,null==f||f)),!v&&a&&(a!==r||"none"==a)){var _=.8*c;"none"===a&&(a="circle"),g.add(cl(a,(h-_)/2,(c-_)/2,_,_,p?l:d,null==f||f))}var w="left"===s?h+5:-5,b=s,M=i.get("formatter"),S=t;"string"==typeof M&&M?S=M.replace("{name}",null!=t?t:""):"function"==typeof M&&(S=M(t)),g.add(new kv({style:Ki({},m,{text:S,x:w,y:c/2,textFill:p?m.getTextColor():d,textAlign:b,textVerticalAlign:"middle"})}));var I=new Fv({shape:g.getBoundingRect(),invisible:!0,tooltip:y.get("show")?o({content:t,formatter:x.get("formatter",!0)||function(){return t},formatterParams:{componentType:"legend",legendIndex:i.componentIndex,name:t,$vars:["name"]}},y.option):null});return g.add(I),g.eachChild(function(t){t.silent=!0}),I.silent=!u,this.getContentGroup().add(g),qi(g),g.__legendDataIndex=e,g},layoutInner:function(t,e,n){var i=this.getContentGroup();by(t.get("orient"),i,t.get("itemGap"),n.width,n.height);var r=i.getBoundingRect();return i.attr("position",[-r.x,-r.y]),this.group.getBoundingRect()}});Ja(function(t){var e=t.findComponents({mainType:"legend"});e&&e.length&&t.filterSeries(function(t){for(var n=0;n<e.length;n++)if(!e[n].isSelected(t.name))return!1;return!0})}),Iy.registerSubTypeDefaulter("legend",function(){return"plain"});var Gb=Rb.extend({type:"legend.scroll",setScrollDataIndex:function(t){this.option.scrollDataIndex=t},defaultOption:{scrollDataIndex:0,pageButtonItemGap:5,pageButtonGap:null,pageButtonPosition:"end",pageFormatter:"{current}/{total}",pageIcons:{horizontal:["M0,0L12,-10L12,10z","M0,0L-12,-10L-12,10z"],vertical:["M0,0L20,0L10,-20z","M0,0L20,0L10,20z"]},pageIconColor:"#2f4554",pageIconInactiveColor:"#aaa",pageIconSize:15,pageTextStyle:{color:"#333"},animationDurationUpdate:800},init:function(t,e,n,i){var r=Ur(t);Gb.superCall(this,"init",t,e,n,i),rc(this,t,r)},mergeOption:function(t,e){Gb.superCall(this,"mergeOption",t,e),rc(this,this.option,t)},getOrient:function(){return"vertical"===this.get("orient")?{index:1,name:"vertical"}:{index:0,name:"horizontal"}}}),Wb=Sg,Zb=["width","height"],Ub=["x","y"],Xb=Hb.extend({type:"legend.scroll",newlineDisabled:!0,init:function(){Xb.superCall(this,"init"),this._currentIndex=0,this.group.add(this._containerGroup=new Wb),this._containerGroup.add(this.getContentGroup()),this.group.add(this._controllerGroup=new Wb),this._showController},resetInner:function(){Xb.superCall(this,"resetInner"),this._controllerGroup.removeAll(),this._containerGroup.removeClipPath(),this._containerGroup.__rectSize=null},renderInner:function(t,e,n,i){function r(t,n){var r=t+"DataIndex",l=fr(e.get("pageIcons",!0)[e.getOrient().name][n],{onclick:m(o._pageGo,o,r,e,i)},{x:-s[0]/2,y:-s[1]/2,width:s[0],height:s[1]});l.name=t,a.add(l)}var o=this;Xb.superCall(this,"renderInner",t,e,n,i);var a=this._controllerGroup,s=e.get("pageIconSize",!0);y(s)||(s=[s,s]),r("pagePrev",0);var l=e.getModel("pageTextStyle");a.add(new kv({name:"pageText",style:{textFill:l.getTextColor(),font:l.getFont(),textVerticalAlign:"middle",textAlign:"center"},silent:!0})),r("pageNext",1)},layoutInner:function(t,e,n){var i=this.getContentGroup(),r=this._containerGroup,o=this._controllerGroup,a=t.getOrient().index,s=Zb[a],l=Zb[1-a],u=Ub[1-a];by(t.get("orient"),i,t.get("itemGap"),a?n.width:null,a?null:n.height),by("horizontal",o,t.get("pageButtonItemGap",!0));var h=i.getBoundingRect(),c=o.getBoundingRect(),d=this._showController=h[s]>n[s],f=[-h.x,-h.y];f[a]=i.position[a];var p=[0,0],g=[-c.x,-c.y],m=T(t.get("pageButtonGap",!0),t.get("itemGap",!0));d&&("end"===t.get("pageButtonPosition",!0)?g[a]+=n[s]-c[s]:p[a]+=c[s]+m),g[1-a]+=h[l]/2-c[l]/2,i.attr("position",f),r.attr("position",p),o.attr("position",g);var v=this.group.getBoundingRect();if((v={x:0,y:0})[s]=d?n[s]:h[s],v[l]=Math.max(h[l],c[l]),v[u]=Math.min(0,c[u]+g[1-a]),r.__rectSize=n[s],d){var y={x:0,y:0};y[s]=Math.max(n[s]-c[s]-m,0),y[l]=v[l],r.setClipPath(new Fv({shape:y})),r.__rectSize=y[s]}else o.eachChild(function(t){t.attr({invisible:!0,silent:!0})});var x=this._getPageInfo(t);return null!=x.pageIndex&&ar(i,{position:x.contentPosition},!!d&&t),this._updatePageInfoView(t,x),v},_pageGo:function(t,e,n){var i=this._getPageInfo(e)[t];null!=i&&n.dispatchAction({type:"legendScroll",scrollDataIndex:i,legendId:e.id})},_updatePageInfoView:function(t,e){var n=this._controllerGroup;d(["pagePrev","pageNext"],function(i){var r=null!=e[i+"DataIndex"],o=n.childOfName(i);o&&(o.setStyle("fill",r?t.get("pageIconColor",!0):t.get("pageIconInactiveColor",!0)),o.cursor=r?"pointer":"default")});var i=n.childOfName("pageText"),r=t.get("pageFormatter"),o=e.pageIndex,a=null!=o?o+1:0,s=e.pageCount;i&&r&&i.setStyle("text",_(r)?r.replace("{current}",a).replace("{total}",s):r({current:a,total:s}))},_getPageInfo:function(t){function e(t){var e=t.getBoundingRect().clone();return e[f]+=t.position[h],e}var n,i,r,o,a=t.get("scrollDataIndex",!0),s=this.getContentGroup(),l=s.getBoundingRect(),u=this._containerGroup.__rectSize,h=t.getOrient().index,c=Zb[h],d=Zb[1-h],f=Ub[h],p=s.position.slice();this._showController?s.eachChild(function(t){t.__legendDataIndex===a&&(o=t)}):o=s.childAt(0);var g=u?Math.ceil(l[c]/u):0;if(o){var m=o.getBoundingRect(),v=o.position[h]+m[f];p[h]=-v-l[f],n=Math.floor(g*(v+m[f]+u/2)/l[c]),n=l[c]&&g?Math.max(0,Math.min(g-1,n)):-1;var y={x:0,y:0};y[c]=u,y[d]=l[d],y[f]=-p[h]-l[f];var x,_=s.children();if(s.eachChild(function(t,n){var i=e(t);i.intersect(y)&&(null==x&&(x=n),r=t.__legendDataIndex),n===_.length-1&&i[f]+i[c]<=y[f]+y[c]&&(r=null)}),null!=x){var w=e(_[x]);if(y[f]=w[f]+w[c]-y[c],x<=0&&w[f]>=y[f])i=null;else{for(;x>0&&e(_[x-1]).intersect(y);)x--;i=_[x].__legendDataIndex}}}return{contentPosition:p,pageIndex:n,pageCount:g,pagePrevDataIndex:i,pageNextDataIndex:r}}});ts("legendScroll","legendscroll",function(t,e){var n=t.scrollDataIndex;null!=n&&e.eachComponent({mainType:"legend",subType:"scroll",query:t},function(t){t.setScrollDataIndex(n)})}),os({type:"title",layoutMode:{type:"box",ignoreSize:!0},defaultOption:{zlevel:0,z:6,show:!0,text:"",target:"blank",subtext:"",subtarget:"blank",left:0,top:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}}}),as({type:"title",render:function(t,e,n){if(this.group.removeAll(),t.get("show")){var i=this.group,r=t.getModel("textStyle"),o=t.getModel("subtextStyle"),a=t.get("textAlign"),s=t.get("textBaseline"),l=new kv({style:Ki({},r,{text:t.get("text"),textFill:r.getTextColor()},{disableBox:!0}),z2:10}),u=l.getBoundingRect(),h=t.get("subtext"),c=new kv({style:Ki({},o,{text:h,textFill:o.getTextColor(),y:u.height+t.get("itemGap"),textVerticalAlign:"top"},{disableBox:!0}),z2:10}),d=t.get("link"),f=t.get("sublink");l.silent=!d,c.silent=!f,d&&l.on("click",function(){window.open(d,"_"+t.get("target"))}),f&&c.on("click",function(){window.open(f,"_"+t.get("subtarget"))}),i.add(l),h&&i.add(c);var p=i.getBoundingRect(),g=t.getBoxLayoutParams();g.width=p.width,g.height=p.height;var m=Gr(g,{width:n.getWidth(),height:n.getHeight()},t.get("padding"));a||("middle"===(a=t.get("left")||t.get("right"))&&(a="center"),"right"===a?m.x+=m.width:"center"===a&&(m.x+=m.width/2)),s||("center"===(s=t.get("top")||t.get("bottom"))&&(s="middle"),"bottom"===s?m.y+=m.height:"middle"===s&&(m.y+=m.height/2),s=s||"top"),i.attr("position",[m.x,m.y]);var v={textAlign:a,textVerticalAlign:s};l.setStyle(v),c.setStyle(v),p=i.getBoundingRect();var y=m.margin,x=t.getItemStyle(["color","opacity"]);x.fill=t.get("backgroundColor");var _=new Fv({shape:{x:p.x-y[3],y:p.y-y[0],width:p.width+y[1]+y[3],height:p.height+y[0]+y[2],r:t.get("borderRadius")},style:x,silent:!0});Ei(_),i.add(_)}}});var jb=Or,Yb=Er,qb=os({type:"marker",dependencies:["series","grid","polar","geo"],init:function(t,e,n,i){this.mergeDefaultAndTheme(t,n),this.mergeOption(t,n,i.createdBySelf,!0)},isAnimationEnabled:function(){if(bp.node)return!1;var t=this.__hostSeries;return this.getShallow("animation")&&t&&t.isAnimationEnabled()},mergeOption:function(t,e,n,i){var r=this.constructor,a=this.mainType+"Model";n||e.eachSeries(function(t){var n=t.get(this.mainType,!0),s=t[a];n&&n.data?(s?s.mergeOption(n,e,!0):(i&&oc(n),d(n.data,function(t){t instanceof Array?(oc(t[0]),oc(t[1])):oc(t)}),o(s=new r(n,this,e),{mainType:this.mainType,seriesIndex:t.seriesIndex,name:t.name,createdBySelf:!0}),s.__hostSeries=t),t[a]=s):t[a]=null},this)},formatTooltip:function(t){var e=this.getData(),n=this.getRawValue(t),i=y(n)?f(n,jb).join(", "):jb(n),r=e.getName(t),o=Yb(this.name);return(null!=n||r)&&(o+="<br />"),r&&(o+=Yb(r),null!=n&&(o+=" : ")),null!=n&&(o+=Yb(i)),o},getData:function(){return this._data},setData:function(t){this._data=t}});h(qb,sx),qb.extend({type:"markPoint",defaultOption:{zlevel:0,z:5,symbol:"pin",symbolSize:50,tooltip:{trigger:"item"},label:{show:!0,position:"inside"},itemStyle:{borderWidth:2},emphasis:{label:{show:!0}}}});var $b=l,Kb=v,Qb={min:Kb(lc,"min"),max:Kb(lc,"max"),average:Kb(lc,"average")},Jb=as({type:"marker",init:function(){this.markerGroupMap=N()},render:function(t,e,n){var i=this.markerGroupMap;i.each(function(t){t.__keep=!1});var r=this.type+"Model";e.eachSeries(function(t){var i=t[r];i&&this.renderSeries(t,i,e,n)},this),i.each(function(t){!t.__keep&&this.group.remove(t.group)},this)},renderSeries:function(){}});Jb.extend({type:"markPoint",updateTransform:function(t,e,n){e.eachSeries(function(t){var e=t.markPointModel;e&&(gc(e.getData(),t,n),this.markerGroupMap.get(t.id).updateLayout(e))},this)},renderSeries:function(t,e,n,i){var r=t.coordinateSystem,o=t.id,a=t.getData(),s=this.markerGroupMap,l=s.get(o)||s.set(o,new Bl),u=mc(r,t,e);e.setData(u),gc(e.getData(),t,i),u.each(function(t){var n=u.getItemModel(t),i=n.getShallow("symbolSize");"function"==typeof i&&(i=i(e.getRawValue(t),e.getDataParams(t))),u.setItemVisual(t,{symbolSize:i,color:n.get("itemStyle.color")||a.getVisual("color"),symbol:n.getShallow("symbol")})}),l.updateData(u),this.group.add(l.group),u.eachItemGraphicEl(function(t){t.traverse(function(t){t.dataModel=e})}),l.__keep=!0,l.group.silent=e.get("silent")||t.get("silent")}}),Qa(function(t){t.markPoint=t.markPoint||{}}),qb.extend({type:"markLine",defaultOption:{zlevel:0,z:5,symbol:["circle","arrow"],symbolSize:[8,16],precision:2,tooltip:{trigger:"item"},label:{show:!0,position:"end"},lineStyle:{type:"dashed"},emphasis:{label:{show:!0},lineStyle:{width:3}},animationEasing:"linear"}});var tM=Hv.prototype,eM=Wv.prototype,nM=Ai({type:"ec-line",style:{stroke:"#000",fill:null},shape:{x1:0,y1:0,x2:0,y2:0,percent:1,cpx1:null,cpy1:null},buildPath:function(t,e){(vc(e)?tM:eM).buildPath(t,e)},pointAt:function(t){return vc(this.shape)?tM.pointAt.call(this,t):eM.pointAt.call(this,t)},tangentAt:function(t){var e=this.shape,n=vc(e)?[e.x2-e.x1,e.y2-e.y1]:eM.tangentAt.call(this,t);return j(n,n)}}),iM=["fromSymbol","toSymbol"],rM=bc.prototype;rM.beforeUpdate=function(){var t=this,e=t.childOfName("fromSymbol"),n=t.childOfName("toSymbol"),i=t.childOfName("label");if(e||n||!i.ignore){for(var r=1,o=this.parent;o;)o.scale&&(r/=o.scale[0]),o=o.parent;var a=t.childOfName("line");if(this.__dirty||a.__dirty){var s=a.shape.percent,l=a.pointAt(0),u=a.pointAt(s),h=W([],u,l);if(j(h,h),e&&(e.attr("position",l),c=a.tangentAt(0),e.attr("rotation",Math.PI/2-Math.atan2(c[1],c[0])),e.attr("scale",[r*s,r*s])),n){n.attr("position",u);var c=a.tangentAt(1);n.attr("rotation",-Math.PI/2-Math.atan2(c[1],c[0])),n.attr("scale",[r*s,r*s])}if(!i.ignore){i.attr("position",u);var d,f,p,g=5*r;if("end"===i.__position)d=[h[0]*g+u[0],h[1]*g+u[1]],f=h[0]>.8?"left":h[0]<-.8?"right":"center",p=h[1]>.8?"top":h[1]<-.8?"bottom":"middle";else if("middle"===i.__position){var m=s/2,v=[(c=a.tangentAt(m))[1],-c[0]],y=a.pointAt(m);v[1]>0&&(v[0]=-v[0],v[1]=-v[1]),d=[y[0]+v[0]*g,y[1]+v[1]*g],f="center",p="bottom";var x=-Math.atan2(c[1],c[0]);u[0]<l[0]&&(x=Math.PI+x),i.attr("rotation",x)}else d=[-h[0]*g+l[0],-h[1]*g+l[1]],f=h[0]>.8?"right":h[0]<-.8?"left":"center",p=h[1]>.8?"bottom":h[1]<-.8?"top":"middle";i.attr({style:{textVerticalAlign:i.__verticalAlign||p,textAlign:i.__textAlign||f},position:d,scale:[r,r]})}}}},rM._createLine=function(t,e,n){var i=t.hostModel,r=_c(t.getItemLayout(e));r.shape.percent=0,sr(r,{shape:{percent:1}},i,e),this.add(r);var o=new kv({name:"label"});this.add(o),d(iM,function(n){var i=xc(n,t,e);this.add(i),this[yc(n)]=t.getItemVisual(e,n)},this),this._updateCommonStl(t,e,n)},rM.updateData=function(t,e,n){var i=t.hostModel,r=this.childOfName("line"),o=t.getItemLayout(e),a={shape:{}};wc(a.shape,o),ar(r,a,i,e),d(iM,function(n){var i=t.getItemVisual(e,n),r=yc(n);if(this[r]!==i){this.remove(this.childOfName(n));var o=xc(n,t,e);this.add(o)}this[r]=i},this),this._updateCommonStl(t,e,n)},rM._updateCommonStl=function(t,e,n){var i=t.hostModel,r=this.childOfName("line"),o=n&&n.lineStyle,s=n&&n.hoverLineStyle,l=n&&n.labelModel,u=n&&n.hoverLabelModel;if(!n||t.hasItemOption){var h=t.getItemModel(e);o=h.getModel("lineStyle").getLineStyle(),s=h.getModel("emphasis.lineStyle").getLineStyle(),l=h.getModel("label"),u=h.getModel("emphasis.label")}var c=t.getItemVisual(e,"color"),f=D(t.getItemVisual(e,"opacity"),o.opacity,1);r.useStyle(a({strokeNoScale:!0,fill:"none",stroke:c,opacity:f},o)),r.hoverStyle=s,d(iM,function(t){var e=this.childOfName(t);e&&(e.setColor(c),e.setStyle({opacity:f}))},this);var p,g,m=l.getShallow("show"),v=u.getShallow("show"),y=this.childOfName("label");if((m||v)&&(p=c||"#000",null==(g=i.getFormattedLabel(e,"normal",t.dataType)))){var x=i.getRawValue(e);g=null==x?t.getName(e):isFinite(x)?wr(x):x}var _=m?g:null,w=v?T(i.getFormattedLabel(e,"emphasis",t.dataType),g):null,b=y.style;null==_&&null==w||(Ki(y.style,l,{text:_},{autoColor:p}),y.__textAlign=b.textAlign,y.__verticalAlign=b.textVerticalAlign,y.__position=l.get("position")||"middle"),y.hoverStyle=null!=w?{text:w,textFill:u.getTextColor(!0),fontStyle:u.getShallow("fontStyle"),fontWeight:u.getShallow("fontWeight"),fontSize:u.getShallow("fontSize"),fontFamily:u.getShallow("fontFamily")}:{text:null},y.ignore=!m&&!v,qi(this)},rM.highlight=function(){this.trigger("emphasis")},rM.downplay=function(){this.trigger("normal")},rM.updateLayout=function(t,e){this.setLinePoints(t.getItemLayout(e))},rM.setLinePoints=function(t){var e=this.childOfName("line");wc(e.shape,t),e.dirty()},u(bc,Sg);var oM=Mc.prototype;oM.isPersistent=function(){return!0},oM.updateData=function(t){var e=this,n=e.group,i=e._lineData;e._lineData=t,i||n.removeAll();var r=Cc(t);t.diff(i).add(function(n){Sc(e,t,n,r)}).update(function(n,o){Ic(e,i,t,o,n,r)}).remove(function(t){n.remove(i.getItemGraphicEl(t))}).execute()},oM.updateLayout=function(){var t=this._lineData;t&&t.eachItemGraphicEl(function(e,n){e.updateLayout(t,n)},this)},oM.incrementalPrepareUpdate=function(t){this._seriesScope=Cc(t),this._lineData=null,this.group.removeAll()},oM.incrementalUpdate=function(t,e){for(var n=t.start;n<t.end;n++)if(Dc(e.getItemLayout(n))){var i=new this._ctor(e,n,this._seriesScope);i.traverse(function(t){t.isGroup||(t.incremental=t.useHoverLayer=!0)}),this.group.add(i),e.setItemGraphicEl(n,i)}},oM.remove=function(){this._clearIncremental(),this._incremental=null,this.group.removeAll()},oM._clearIncremental=function(){var t=this._incremental;t&&t.clearDisplaybles()};var aM=function(t,e,r,a){var s=t.getData(),l=a.type;if(!y(a)&&("min"===l||"max"===l||"average"===l||"median"===l||null!=a.xAxis||null!=a.yAxis)){var u,h;if(null!=a.yAxis||null!=a.xAxis)u=null!=a.yAxis?"y":"x",e.getAxis(u),h=C(a.yAxis,a.xAxis);else{var c=hc(a,s,e,t);u=c.valueDataDim,c.valueAxis,h=pc(s,u,l)}var d="x"===u?0:1,f=1-d,p=n(a),g={};p.type=null,p.coord=[],g.coord=[],p.coord[f]=-1/0,g.coord[f]=1/0;var m=r.get("precision");m>=0&&"number"==typeof h&&(h=+h.toFixed(Math.min(m,20))),p.coord[d]=g.coord[d]=h,a=[p,g,{type:l,valueIndex:a.valueIndex,value:h}]}return a=[uc(t,a[0]),uc(t,a[1]),o({},a[2])],a[2].type=a[2].type||"",i(a[2],a[0]),i(a[2],a[1]),a};Jb.extend({type:"markLine",updateTransform:function(t,e,n){e.eachSeries(function(t){var e=t.markLineModel;if(e){var i=e.getData(),r=e.__from,o=e.__to;r.each(function(e){Lc(r,e,!0,t,n),Lc(o,e,!1,t,n)}),i.each(function(t){i.setItemLayout(t,[r.getItemLayout(t),o.getItemLayout(t)])}),this.markerGroupMap.get(t.id).updateLayout()}},this)},renderSeries:function(t,e,n,i){function r(e,n,r){var o=e.getItemModel(n);Lc(e,n,r,t,i),e.setItemVisual(n,{symbolSize:o.get("symbolSize")||g[r?0:1],symbol:o.get("symbol",!0)||p[r?0:1],color:o.get("itemStyle.color")||s.getVisual("color")})}var o=t.coordinateSystem,a=t.id,s=t.getData(),l=this.markerGroupMap,u=l.get(a)||l.set(a,new Mc);this.group.add(u.group);var h=Oc(o,t,e),c=h.from,d=h.to,f=h.line;e.__from=c,e.__to=d,e.setData(f);var p=e.get("symbol"),g=e.get("symbolSize");y(p)||(p=[p,p]),"number"==typeof g&&(g=[g,g]),h.from.each(function(t){r(c,t,!0),r(d,t,!1)}),f.each(function(t){var e=f.getItemModel(t).get("lineStyle.color");f.setItemVisual(t,{color:e||c.getItemVisual(t,"color")}),f.setItemLayout(t,[c.getItemLayout(t),d.getItemLayout(t)]),f.setItemVisual(t,{fromSymbolSize:c.getItemVisual(t,"symbolSize"),fromSymbol:c.getItemVisual(t,"symbol"),toSymbolSize:d.getItemVisual(t,"symbolSize"),toSymbol:d.getItemVisual(t,"symbol")})}),u.updateData(f),h.line.eachItemGraphicEl(function(t,n){t.traverse(function(t){t.dataModel=e})}),u.__keep=!0,u.group.silent=e.get("silent")||t.get("silent")}}),Qa(function(t){t.markLine=t.markLine||{}}),qb.extend({type:"markArea",defaultOption:{zlevel:0,z:1,tooltip:{trigger:"item"},animation:!1,label:{show:!0,position:"top"},itemStyle:{borderWidth:0},emphasis:{label:{show:!0,position:"top"}}}});var sM=function(t,e,n,i){var o=uc(t,i[0]),a=uc(t,i[1]),s=C,l=o.coord,u=a.coord;l[0]=s(l[0],-1/0),l[1]=s(l[1],-1/0),u[0]=s(u[0],1/0),u[1]=s(u[1],1/0);var h=r([{},o,a]);return h.coord=[o.coord,a.coord],h.x0=o.x,h.y0=o.y,h.x1=a.x,h.y1=a.y,h},lM=[["x0","y0"],["x1","y0"],["x1","y1"],["x0","y1"]];Jb.extend({type:"markArea",updateTransform:function(t,e,n){e.eachSeries(function(t){var e=t.markAreaModel;if(e){var i=e.getData();i.each(function(e){var r=f(lM,function(r){return Rc(i,e,r,t,n)});i.setItemLayout(e,r),i.getItemGraphicEl(e).setShape("points",r)})}},this)},renderSeries:function(t,e,n,i){var r=t.coordinateSystem,o=t.id,s=t.getData(),l=this.markerGroupMap,u=l.get(o)||l.set(o,{group:new Sg});this.group.add(u.group),u.__keep=!0;var h=Bc(r,t,e);e.setData(h),h.each(function(e){h.setItemLayout(e,f(lM,function(n){return Rc(h,e,n,t,i)})),h.setItemVisual(e,{color:s.getVisual("color")})}),h.diff(u.__data).add(function(t){var e=new Bv({shape:{points:h.getItemLayout(t)}});h.setItemGraphicEl(t,e),u.group.add(e)}).update(function(t,n){var i=u.__data.getItemGraphicEl(n);ar(i,{shape:{points:h.getItemLayout(t)}},e,t),u.group.add(i),h.setItemGraphicEl(t,i)}).remove(function(t){var e=u.__data.getItemGraphicEl(t);u.group.remove(e)}).execute(),h.eachItemGraphicEl(function(t,n){var i=h.getItemModel(n),r=i.getModel("label"),o=i.getModel("emphasis.label"),s=h.getItemVisual(n,"color");t.useStyle(a(i.getModel("itemStyle").getItemStyle(),{fill:Pt(s,.4),stroke:s})),t.hoverStyle=i.getModel("emphasis.itemStyle").getItemStyle(),$i(t.style,t.hoverStyle,r,o,{labelFetcher:e,labelDataIndex:n,defaultText:h.getName(n)||"",isRectText:!0,autoColor:s}),qi(t,{}),t.dataModel=e}),u.__data=h,u.group.silent=e.get("silent")||t.get("silent")}}),Qa(function(t){t.markArea=t.markArea||{}}),Iy.registerSubTypeDefaulter("dataZoom",function(){return"slider"});var uM=["cartesian2d","polar","singleAxis"],hM=function(t,e){var n=f(t=t.slice(),Fr),i=f(e=(e||[]).slice(),Fr);return function(r,o){d(t,function(t,a){for(var s={name:t,capital:n[a]},l=0;l<e.length;l++)s[e[l]]=t+i[l];r.call(o,s)})}}(["x","y","z","radius","angle","single"],["axisIndex","axis","index","id"]),cM=d,dM=br,fM=function(t,e,n,i){this._dimName=t,this._axisIndex=e,this._valueWindow,this._percentWindow,this._dataExtent,this._minMaxSpan,this.ecModel=i,this._dataZoomModel=n};fM.prototype={constructor:fM,hostedBy:function(t){return this._dataZoomModel===t},getDataValueWindow:function(){return this._valueWindow.slice()},getDataPercentWindow:function(){return this._percentWindow.slice()},getTargetSeriesModels:function(){var t=[],e=this.ecModel;return e.eachSeries(function(n){if(Vc(n.get("coordinateSystem"))){var i=this._dimName,r=e.queryComponents({mainType:i+"Axis",index:n.get(i+"AxisIndex"),id:n.get(i+"AxisId")})[0];this._axisIndex===(r&&r.componentIndex)&&t.push(n)}},this),t},getAxisModel:function(){return this.ecModel.getComponent(this._dimName+"Axis",this._axisIndex)},getOtherAxisModel:function(){var t,e,n=this._dimName,i=this.ecModel,r=this.getAxisModel();"x"===n||"y"===n?(e="gridIndex",t="x"===n?"y":"x"):(e="polarIndex",t="angle"===n?"radius":"angle");var o;return i.eachComponent(t+"Axis",function(t){(t.get(e)||0)===(r.get(e)||0)&&(o=t)}),o},getMinMaxSpan:function(){return n(this._minMaxSpan)},calculateDataWindow:function(t){var e=this._dataExtent,n=this.getAxisModel().axis.scale,i=this._dataZoomModel.getRangePropMode(),r=[0,100],o=[t.start,t.end],a=[];return cM(["startValue","endValue"],function(e){a.push(null!=t[e]?n.parse(t[e]):null)}),cM([0,1],function(t){var s=a[t],l=o[t];"percent"===i[t]?(null==l&&(l=r[t]),s=n.parse(xr(l,r,e,!0))):l=xr(s,e,r,!0),a[t]=s,o[t]=l}),{valueWindow:dM(a),percentWindow:dM(o)}},reset:function(t){if(t===this._dataZoomModel){var e=this.getTargetSeriesModels();this._dataExtent=Hc(this,this._dimName,e);var n=this.calculateDataWindow(t.option);this._valueWindow=n.valueWindow,this._percentWindow=n.percentWindow,Zc(this),Wc(this)}},restore:function(t){t===this._dataZoomModel&&(this._valueWindow=this._percentWindow=null,Wc(this,!0))},filterData:function(t,e){function n(t){return t>=a[0]&&t<=a[1]}if(t===this._dataZoomModel){var i=this._dimName,r=this.getTargetSeriesModels(),o=t.get("filterMode"),a=this._valueWindow;"none"!==o&&cM(r,function(t){var e=t.getData(),r=e.mapDimension(i,!0);"weakFilter"===o?e.filterSelf(function(t){for(var n,i,o,s=0;s<r.length;s++){var l=e.get(r[s],t),u=!isNaN(l),h=l<a[0],c=l>a[1];if(u&&!h&&!c)return!0;u&&(o=!0),h&&(n=!0),c&&(i=!0)}return o&&n&&i}):cM(r,function(i){if("empty"===o)t.setData(e.map(i,function(t){return n(t)?t:NaN}));else{var r={};r[i]=a,e.selectRange(r)}}),cM(r,function(t){e.setApproximateExtent(a,t)})})}}};var pM=d,gM=hM,mM=os({type:"dataZoom",dependencies:["xAxis","yAxis","zAxis","radiusAxis","angleAxis","singleAxis","series"],defaultOption:{zlevel:0,z:4,orient:null,xAxisIndex:null,yAxisIndex:null,filterMode:"filter",throttle:null,start:0,end:100,startValue:null,endValue:null,minSpan:null,maxSpan:null,minValueSpan:null,maxValueSpan:null,rangeMode:null},init:function(t,e,n){this._dataIntervalByAxis={},this._dataInfo={},this._axisProxies={},this.textStyleModel,this._autoThrottle=!0,this._rangePropMode=["percent","percent"];var i=Uc(t);this.mergeDefaultAndTheme(t,n),this.doInit(i)},mergeOption:function(t){var e=Uc(t);i(this.option,t,!0),this.doInit(e)},doInit:function(t){var e=this.option;bp.canvasSupported||(e.realtime=!1),this._setDefaultThrottle(t),Xc(this,t),pM([["start","startValue"],["end","endValue"]],function(t,n){"value"===this._rangePropMode[n]&&(e[t[0]]=null)},this),this.textStyleModel=this.getModel("textStyle"),this._resetTarget(),this._giveAxisProxies()},_giveAxisProxies:function(){var t=this._axisProxies;this.eachTargetAxis(function(e,n,i,r){var o=this.dependentModels[e.axis][n],a=o.__dzAxisProxy||(o.__dzAxisProxy=new fM(e.name,n,this,r));t[e.name+"_"+n]=a},this)},_resetTarget:function(){var t=this.option,e=this._judgeAutoMode();gM(function(e){var n=e.axisIndex;t[n]=xn(t[n])},this),"axisIndex"===e?this._autoSetAxisIndex():"orient"===e&&this._autoSetOrient()},_judgeAutoMode:function(){var t=this.option,e=!1;gM(function(n){null!=t[n.axisIndex]&&(e=!0)},this);var n=t.orient;return null==n&&e?"orient":e?void 0:(null==n&&(t.orient="horizontal"),"axisIndex")},_autoSetAxisIndex:function(){var t=!0,e=this.get("orient",!0),n=this.option,i=this.dependentModels;if(t){var r="vertical"===e?"y":"x";i[r+"Axis"].length?(n[r+"AxisIndex"]=[0],t=!1):pM(i.singleAxis,function(i){t&&i.get("orient",!0)===e&&(n.singleAxisIndex=[i.componentIndex],t=!1)})}t&&gM(function(e){if(t){var i=[],r=this.dependentModels[e.axis];if(r.length&&!i.length)for(var o=0,a=r.length;o<a;o++)"category"===r[o].get("type")&&i.push(o);n[e.axisIndex]=i,i.length&&(t=!1)}},this),t&&this.ecModel.eachSeries(function(t){this._isSeriesHasAllAxesTypeOf(t,"value")&&gM(function(e){var i=n[e.axisIndex],r=t.get(e.axisIndex),o=t.get(e.axisId);l(i,r=t.ecModel.queryComponents({mainType:e.axis,index:r,id:o})[0].componentIndex)<0&&i.push(r)})},this)},_autoSetOrient:function(){var t;this.eachTargetAxis(function(e){!t&&(t=e.name)},this),this.option.orient="y"===t?"vertical":"horizontal"},_isSeriesHasAllAxesTypeOf:function(t,e){var n=!0;return gM(function(i){var r=t.get(i.axisIndex),o=this.dependentModels[i.axis][r];o&&o.get("type")===e||(n=!1)},this),n},_setDefaultThrottle:function(t){if(t.hasOwnProperty("throttle")&&(this._autoThrottle=!1),this._autoThrottle){var e=this.ecModel.option;this.option.throttle=e.animation&&e.animationDurationUpdate>0?100:20}},getFirstTargetAxisModel:function(){var t;return gM(function(e){if(null==t){var n=this.get(e.axisIndex);n.length&&(t=this.dependentModels[e.axis][n[0]])}},this),t},eachTargetAxis:function(t,e){var n=this.ecModel;gM(function(i){pM(this.get(i.axisIndex),function(r){t.call(e,i,r,this,n)},this)},this)},getAxisProxy:function(t,e){return this._axisProxies[t+"_"+e]},getAxisModel:function(t,e){var n=this.getAxisProxy(t,e);return n&&n.getAxisModel()},setRawRange:function(t,e){var n=this.option;pM([["start","startValue"],["end","endValue"]],function(e){null==t[e[0]]&&null==t[e[1]]||(n[e[0]]=t[e[0]],n[e[1]]=t[e[1]])},this),!e&&Xc(this,t)},getPercentRange:function(){var t=this.findRepresentativeAxisProxy();if(t)return t.getDataPercentWindow()},getValueRange:function(t,e){if(null!=t||null!=e)return this.getAxisProxy(t,e).getDataValueWindow();var n=this.findRepresentativeAxisProxy();return n?n.getDataValueWindow():void 0},findRepresentativeAxisProxy:function(t){if(t)return t.__dzAxisProxy;var e=this._axisProxies;for(var n in e)if(e.hasOwnProperty(n)&&e[n].hostedBy(this))return e[n];for(var n in e)if(e.hasOwnProperty(n)&&!e[n].hostedBy(this))return e[n]},getRangePropMode:function(){return this._rangePropMode.slice()}}),vM=dx.extend({type:"dataZoom",render:function(t,e,n,i){this.dataZoomModel=t,this.ecModel=e,this.api=n},getTargetCoordInfo:function(){function t(t,e,n,i){for(var r,o=0;o<n.length;o++)if(n[o].model===t){r=n[o];break}r||n.push(r={model:t,axisModels:[],coordIndex:i}),r.axisModels.push(e)}var e=this.dataZoomModel,n=this.ecModel,i={};return e.eachTargetAxis(function(e,r){var o=n.getComponent(e.axis,r);if(o){var a=o.getCoordSysModel();a&&t(a,o,i[a.mainType]||(i[a.mainType]=[]),a.componentIndex)}},this),i}}),yM=(mM.extend({type:"dataZoom.slider",layoutMode:"box",defaultOption:{show:!0,right:"ph",top:"ph",width:"ph",height:"ph",left:null,bottom:null,backgroundColor:"rgba(47,69,84,0)",dataBackground:{lineStyle:{color:"#2f4554",width:.5,opacity:.3},areaStyle:{color:"rgba(47,69,84,0.3)",opacity:.3}},borderColor:"#ddd",fillerColor:"rgba(167,183,204,0.4)",handleIcon:"M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z",handleSize:"100%",handleStyle:{color:"#a7b7cc"},labelPrecision:null,labelFormatter:null,showDetail:!0,showDataShadow:"auto",realtime:!0,zoomLock:!1,textStyle:{color:"#333"}}}),function(t,e,n,i,r,o){e[0]=Yc(e[0],n),e[1]=Yc(e[1],n),t=t||0;var a=n[1]-n[0];null!=r&&(r=Yc(r,[0,a])),null!=o&&(o=Math.max(o,null!=r?r:0)),"all"===i&&(r=o=Math.abs(e[1]-e[0]),i=0);var s=jc(e,i);e[i]+=t;var l=r||0,u=n.slice();s.sign<0?u[0]+=l:u[1]-=l,e[i]=Yc(e[i],u);h=jc(e,i);null!=r&&(h.sign!==s.sign||h.span<r)&&(e[1-i]=e[i]+s.sign*r);var h=jc(e,i);return null!=o&&h.span>o&&(e[1-i]=e[i]+h.sign*o),e}),xM=Fv,_M=xr,wM=br,bM=m,MM=d,SM="horizontal",IM=5,CM=["line","bar","candlestick","scatter"],TM=vM.extend({type:"dataZoom.slider",init:function(t,e){this._displayables={},this._orient,this._range,this._handleEnds,this._size,this._handleWidth,this._handleHeight,this._location,this._dragging,this._dataShadowInfo,this.api=e},render:function(t,e,n,i){TM.superApply(this,"render",arguments),ha(this,"_dispatchZoomAction",this.dataZoomModel.get("throttle"),"fixRate"),this._orient=t.get("orient"),!1!==this.dataZoomModel.get("show")?(i&&"dataZoom"===i.type&&i.from===this.uid||this._buildView(),this._updateView()):this.group.removeAll()},remove:function(){TM.superApply(this,"remove",arguments),ca(this,"_dispatchZoomAction")},dispose:function(){TM.superApply(this,"dispose",arguments),ca(this,"_dispatchZoomAction")},_buildView:function(){var t=this.group;t.removeAll(),this._resetLocation(),this._resetInterval();var e=this._displayables.barGroup=new Sg;this._renderBackground(),this._renderHandle(),this._renderDataShadow(),t.add(e),this._positionGroup()},_resetLocation:function(){var t=this.dataZoomModel,e=this.api,n=this._findCoordRect(),i={width:e.getWidth(),height:e.getHeight()},r=this._orient===SM?{right:i.width-n.x-n.width,top:i.height-30-7,width:n.width,height:30}:{right:7,top:n.y,width:30,height:n.height},o=Ur(t.option);d(["right","top","width","height"],function(t){"ph"===o[t]&&(o[t]=r[t])});var a=Gr(o,i,t.padding);this._location={x:a.x,y:a.y},this._size=[a.width,a.height],"vertical"===this._orient&&this._size.reverse()},_positionGroup:function(){var t=this.group,e=this._location,n=this._orient,i=this.dataZoomModel.getFirstTargetAxisModel(),r=i&&i.get("inverse"),o=this._displayables.barGroup,a=(this._dataShadowInfo||{}).otherAxisInverse;o.attr(n!==SM||r?n===SM&&r?{scale:a?[-1,1]:[-1,-1]}:"vertical"!==n||r?{scale:a?[-1,-1]:[-1,1],rotation:Math.PI/2}:{scale:a?[1,-1]:[1,1],rotation:Math.PI/2}:{scale:a?[1,1]:[1,-1]});var s=t.getBoundingRect([o]);t.attr("position",[e.x-s.x,e.y-s.y])},_getViewExtent:function(){return[0,this._size[0]]},_renderBackground:function(){var t=this.dataZoomModel,e=this._size,n=this._displayables.barGroup;n.add(new xM({silent:!0,shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:t.get("backgroundColor")},z2:-40})),n.add(new xM({shape:{x:0,y:0,width:e[0],height:e[1]},style:{fill:"transparent"},z2:0,onclick:m(this._onClickPanelClick,this)}))},_renderDataShadow:function(){var t=this._dataShadowInfo=this._prepareDataShadowInfo();if(t){var e=this._size,n=t.series,i=n.getRawData(),r=n.getShadowDim?n.getShadowDim():t.otherDim;if(null!=r){var o=i.getDataExtent(r),s=.3*(o[1]-o[0]);o=[o[0]-s,o[1]+s];var l,u=[0,e[1]],h=[0,e[0]],c=[[e[0],0],[0,0]],d=[],f=h[1]/(i.count()-1),p=0,g=Math.round(i.count()/e[0]);i.each([r],function(t,e){if(g>0&&e%g)p+=f;else{var n=null==t||isNaN(t)||""===t,i=n?0:_M(t,o,u,!0);n&&!l&&e?(c.push([c[c.length-1][0],0]),d.push([d[d.length-1][0],0])):!n&&l&&(c.push([p,0]),d.push([p,0])),c.push([p,i]),d.push([p,i]),p+=f,l=n}});var m=this.dataZoomModel;this._displayables.barGroup.add(new Bv({shape:{points:c},style:a({fill:m.get("dataBackgroundColor")},m.getModel("dataBackground.areaStyle").getAreaStyle()),silent:!0,z2:-20})),this._displayables.barGroup.add(new Vv({shape:{points:d},style:m.getModel("dataBackground.lineStyle").getLineStyle(),silent:!0,z2:-19}))}}},_prepareDataShadowInfo:function(){var t=this.dataZoomModel,e=t.get("showDataShadow");if(!1!==e){var n,i=this.ecModel;return t.eachTargetAxis(function(r,o){d(t.getAxisProxy(r.name,o).getTargetSeriesModels(),function(t){if(!(n||!0!==e&&l(CM,t.get("type"))<0)){var a,s=i.getComponent(r.axis,o).axis,u=qc(r.name),h=t.coordinateSystem;null!=u&&h.getOtherAxis&&(a=h.getOtherAxis(s).inverse),u=t.getData().mapDimension(u),n={thisAxis:s,series:t,thisDim:r.name,otherDim:u,otherAxisInverse:a}}},this)},this),n}},_renderHandle:function(){var t=this._displayables,e=t.handles=[],n=t.handleLabels=[],i=this._displayables.barGroup,r=this._size,o=this.dataZoomModel;i.add(t.filler=new xM({draggable:!0,cursor:$c(this._orient),drift:bM(this._onDragMove,this,"all"),onmousemove:function(t){tm(t.event)},ondragstart:bM(this._showDataInfo,this,!0),ondragend:bM(this._onDragEnd,this),onmouseover:bM(this._showDataInfo,this,!0),onmouseout:bM(this._showDataInfo,this,!1),style:{fill:o.get("fillerColor"),textPosition:"inside"}})),i.add(new xM(Ei({silent:!0,shape:{x:0,y:0,width:r[0],height:r[1]},style:{stroke:o.get("dataBackgroundColor")||o.get("borderColor"),lineWidth:1,fill:"rgba(0,0,0,0)"}}))),MM([0,1],function(t){var r=fr(o.get("handleIcon"),{cursor:$c(this._orient),draggable:!0,drift:bM(this._onDragMove,this,t),onmousemove:function(t){tm(t.event)},ondragend:bM(this._onDragEnd,this),onmouseover:bM(this._showDataInfo,this,!0),onmouseout:bM(this._showDataInfo,this,!1)},{x:-1,y:0,width:2,height:2}),a=r.getBoundingRect();this._handleHeight=_r(o.get("handleSize"),this._size[1]),this._handleWidth=a.width/a.height*this._handleHeight,r.setStyle(o.getModel("handleStyle").getItemStyle());var s=o.get("handleColor");null!=s&&(r.style.fill=s),i.add(e[t]=r);var l=o.textStyleModel;this.group.add(n[t]=new kv({silent:!0,invisible:!0,style:{x:0,y:0,text:"",textVerticalAlign:"middle",textAlign:"center",textFill:l.getTextColor(),textFont:l.getFont()},z2:10}))},this)},_resetInterval:function(){var t=this._range=this.dataZoomModel.getPercentRange(),e=this._getViewExtent();this._handleEnds=[_M(t[0],[0,100],e,!0),_M(t[1],[0,100],e,!0)]},_updateInterval:function(t,e){var n=this.dataZoomModel,i=this._handleEnds,r=this._getViewExtent(),o=n.findRepresentativeAxisProxy().getMinMaxSpan(),a=[0,100];yM(e,i,r,n.get("zoomLock")?"all":t,null!=o.minSpan?_M(o.minSpan,a,r,!0):null,null!=o.maxSpan?_M(o.maxSpan,a,r,!0):null);var s=this._range,l=this._range=wM([_M(i[0],r,a,!0),_M(i[1],r,a,!0)]);return!s||s[0]!==l[0]||s[1]!==l[1]},_updateView:function(t){var e=this._displayables,n=this._handleEnds,i=wM(n.slice()),r=this._size;MM([0,1],function(t){var i=e.handles[t],o=this._handleHeight;i.attr({scale:[o/2,o/2],position:[n[t],r[1]/2-o/2]})},this),e.filler.setShape({x:i[0],y:0,width:i[1]-i[0],height:r[1]}),this._updateDataInfo(t)},_updateDataInfo:function(t){function e(t){var e=lr(i.handles[t].parent,this.group),n=hr(0===t?"right":"left",e),s=this._handleWidth/2+IM,l=ur([c[t]+(0===t?-s:s),this._size[1]/2],e);r[t].setStyle({x:l[0],y:l[1],textVerticalAlign:o===SM?"middle":n,textAlign:o===SM?n:"center",text:a[t]})}var n=this.dataZoomModel,i=this._displayables,r=i.handleLabels,o=this._orient,a=["",""];if(n.get("showDetail")){var s=n.findRepresentativeAxisProxy();if(s){var l=s.getAxisModel().axis,u=this._range,h=t?s.calculateDataWindow({start:u[0],end:u[1]}).valueWindow:s.getDataValueWindow();a=[this._formatLabel(h[0],l),this._formatLabel(h[1],l)]}}var c=wM(this._handleEnds.slice());e.call(this,0),e.call(this,1)},_formatLabel:function(t,e){var n=this.dataZoomModel,i=n.get("labelFormatter"),r=n.get("labelPrecision");null!=r&&"auto"!==r||(r=e.getPixelPrecision());var o=null==t||isNaN(t)?"":"category"===e.type||"time"===e.type?e.scale.getLabel(Math.round(t)):t.toFixed(Math.min(r,20));return x(i)?i(t,o):_(i)?i.replace("{value}",o):o},_showDataInfo:function(t){t=this._dragging||t;var e=this._displayables.handleLabels;e[0].attr("invisible",!t),e[1].attr("invisible",!t)},_onDragMove:function(t,e,n){this._dragging=!0;var i=ur([e,n],this._displayables.barGroup.getLocalTransform(),!0),r=this._updateInterval(t,i[0]),o=this.dataZoomModel.get("realtime");this._updateView(!o),r&&o&&this._dispatchZoomAction()},_onDragEnd:function(){this._dragging=!1,this._showDataInfo(!1),!this.dataZoomModel.get("realtime")&&this._dispatchZoomAction()},_onClickPanelClick:function(t){var e=this._size,n=this._displayables.barGroup.transformCoordToLocal(t.offsetX,t.offsetY);if(!(n[0]<0||n[0]>e[0]||n[1]<0||n[1]>e[1])){var i=this._handleEnds,r=(i[0]+i[1])/2,o=this._updateInterval("all",n[0]-r);this._updateView(),o&&this._dispatchZoomAction()}},_dispatchZoomAction:function(){var t=this._range;this.api.dispatchAction({type:"dataZoom",from:this.uid,dataZoomId:this.dataZoomModel.id,start:t[0],end:t[1]})},_findCoordRect:function(){var t;if(MM(this.getTargetCoordInfo(),function(e){if(!t&&e.length){var n=e[0].model.coordinateSystem;t=n.getRect&&n.getRect()}}),!t){var e=this.api.getWidth(),n=this.api.getHeight();t={x:.2*e,y:.2*n,width:.6*e,height:.6*n}}return t}});mM.extend({type:"dataZoom.inside",defaultOption:{disabled:!1,zoomLock:!1,zoomOnMouseWheel:!0,moveOnMouseMove:!0,preventDefaultMouseMove:!0}});var DM="\0_ec_interaction_mutex";ts({type:"takeGlobalCursor",event:"globalCursorTaken",update:"update"},function(){}),h(ed,Zp);var AM=v,kM="\0_ec_dataZoom_roams",PM=m,LM=vM.extend({type:"dataZoom.inside",init:function(t,e){this._range},render:function(t,e,n,i){LM.superApply(this,"render",arguments),this._range=t.getPercentRange(),d(this.getTargetCoordInfo(),function(e,i){var r=f(e,function(t){return cd(t.model)});d(e,function(e){var o=e.model,a=t.option;ud(n,{coordId:cd(o),allCoordIds:r,containsPoint:function(t,e,n){return o.coordinateSystem.containPoint([e,n])},dataZoomId:t.id,throttleRate:t.get("throttle",!0),panGetRange:PM(this._onPan,this,e,i),zoomGetRange:PM(this._onZoom,this,e,i),zoomLock:a.zoomLock,disabled:a.disabled,roamControllerOpt:{zoomOnMouseWheel:a.zoomOnMouseWheel,moveOnMouseMove:a.moveOnMouseMove,preventDefaultMouseMove:a.preventDefaultMouseMove}})},this)},this)},dispose:function(){hd(this.api,this.dataZoomModel.id),LM.superApply(this,"dispose",arguments),this._range=null},_onPan:function(t,e,n,i,r,o,a,s,l){var u=this._range,h=u.slice(),c=t.axisModels[0];if(c){var d=OM[e]([o,a],[s,l],c,n,t),f=d.signal*(h[1]-h[0])*d.pixel/d.pixelLength;return yM(f,h,[0,100],"all"),this._range=h,u[0]!==h[0]||u[1]!==h[1]?h:void 0}},_onZoom:function(t,e,n,i,r,o){var a=this._range,s=a.slice(),l=t.axisModels[0];if(l){var u=OM[e](null,[r,o],l,n,t),h=(u.signal>0?u.pixelStart+u.pixelLength-u.pixel:u.pixel-u.pixelStart)/u.pixelLength*(s[1]-s[0])+s[0];i=Math.max(1/i,0),s[0]=(s[0]-h)*i+h,s[1]=(s[1]-h)*i+h;var c=this.dataZoomModel.findRepresentativeAxisProxy().getMinMaxSpan();return yM(0,s,[0,100],0,c.minSpan,c.maxSpan),this._range=s,a[0]!==s[0]||a[1]!==s[1]?s:void 0}}}),OM={grid:function(t,e,n,i,r){var o=n.axis,a={},s=r.model.coordinateSystem.getRect();return t=t||[0,0],"x"===o.dim?(a.pixel=e[0]-t[0],a.pixelLength=s.width,a.pixelStart=s.x,a.signal=o.inverse?1:-1):(a.pixel=e[1]-t[1],a.pixelLength=s.height,a.pixelStart=s.y,a.signal=o.inverse?-1:1),a},polar:function(t,e,n,i,r){var o=n.axis,a={},s=r.model.coordinateSystem,l=s.getRadiusAxis().getExtent(),u=s.getAngleAxis().getExtent();return t=t?s.pointToCoord(t):[0,0],e=s.pointToCoord(e),"radiusAxis"===n.mainType?(a.pixel=e[0]-t[0],a.pixelLength=l[1]-l[0],a.pixelStart=l[0],a.signal=o.inverse?1:-1):(a.pixel=e[1]-t[1],a.pixelLength=u[1]-u[0],a.pixelStart=u[0],a.signal=o.inverse?-1:1),a},singleAxis:function(t,e,n,i,r){var o=n.axis,a=r.model.coordinateSystem.getRect(),s={};return t=t||[0,0],"horizontal"===o.orient?(s.pixel=e[0]-t[0],s.pixelLength=a.width,s.pixelStart=a.x,s.signal=o.inverse?1:-1):(s.pixel=e[1]-t[1],s.pixelLength=a.height,s.pixelStart=a.y,s.signal=o.inverse?-1:1),s}};Ja({getTargetSeries:function(t){var e=N();return t.eachComponent("dataZoom",function(t){t.eachTargetAxis(function(t,n,i){d(i.getAxisProxy(t.name,n).getTargetSeriesModels(),function(t){e.set(t.uid,t)})})}),e},modifyOutputEnd:!0,overallReset:function(t,e){t.eachComponent("dataZoom",function(t){t.eachTargetAxis(function(t,n,i){i.getAxisProxy(t.name,n).reset(i,e)}),t.eachTargetAxis(function(t,n,i){i.getAxisProxy(t.name,n).filterData(i,e)})}),t.eachComponent("dataZoom",function(t){var e=t.findRepresentativeAxisProxy(),n=e.getDataPercentWindow(),i=e.getDataValueWindow();t.setRawRange({start:n[0],end:n[1],startValue:i[0],endValue:i[1]},!0)})}}),ts("dataZoom",function(t,e){var n=Fc(m(e.eachComponent,e,"dataZoom"),hM,function(t,e){return t.get(e.axisIndex)}),i=[];e.eachComponent({mainType:"dataZoom",query:t},function(t,e){i.push.apply(i,n(t).nodes)}),d(i,function(e,n){e.setRawRange({start:t.start,end:t.end,startValue:t.startValue,endValue:t.endValue})})});var zM={},EM=os({type:"toolbox",layoutMode:{type:"box",ignoreSize:!0},optionUpdated:function(){EM.superApply(this,"optionUpdated",arguments),d(this.option.feature,function(t,e){var n=wd(e);n&&i(t,n.defaultOption)})},defaultOption:{show:!0,z:6,zlevel:0,orient:"horizontal",left:"right",top:"top",backgroundColor:"transparent",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemSize:15,itemGap:8,showTitle:!0,iconStyle:{borderColor:"#666",color:"none"},emphasis:{iconStyle:{borderColor:"#3E98C5"}}}});as({type:"toolbox",render:function(t,e,n,i){function r(r,a){var s,c=h[r],d=h[a],f=new pr(l[c],t,t.ecModel);if(c&&!d){if(bd(c))s={model:f,onclick:f.option.onclick,featureName:c};else{var p=wd(c);if(!p)return;s=new p(f,e,n)}u[c]=s}else{if(!(s=u[d]))return;s.model=f,s.ecModel=e,s.api=n}c||!d?f.get("show")&&!s.unusable?(o(f,s,c),f.setIconStatus=function(t,e){var n=this.option,i=this.iconPaths;n.iconStatus=n.iconStatus||{},n.iconStatus[t]=e,i[t]&&i[t].trigger(e)},s.render&&s.render(f,e,n,i)):s.remove&&s.remove(e,n):s.dispose&&s.dispose(e,n)}function o(i,r,o){var l=i.getModel("iconStyle"),u=i.getModel("emphasis.iconStyle"),h=r.getIcons?r.getIcons():i.get("icon"),c=i.get("title")||{};if("string"==typeof h){var f=h,p=c;c={},(h={})[o]=f,c[o]=p}var g=i.iconPaths={};d(h,function(o,h){var d=fr(o,{},{x:-s/2,y:-s/2,width:s,height:s});d.setStyle(l.getItemStyle()),d.hoverStyle=u.getItemStyle(),qi(d),t.get("showTitle")&&(d.__title=c[h],d.on("mouseover",function(){var t=u.getItemStyle();d.setStyle({text:c[h],textPosition:t.textPosition||"bottom",textFill:t.fill||t.stroke||"#000",textAlign:t.textAlign||"center"})}).on("mouseout",function(){d.setStyle({textFill:null})})),d.trigger(i.get("iconStatus."+h)||"normal"),a.add(d),d.on("click",m(r.onclick,r,e,n,h)),g[h]=d})}var a=this.group;if(a.removeAll(),t.get("show")){var s=+t.get("itemSize"),l=t.get("feature")||{},u=this._features||(this._features={}),h=[];d(l,function(t,e){h.push(e)}),new hs(this._featureNames||[],h).add(r).update(r).remove(v(r,null)).execute(),this._featureNames=h,Jh(a,t,n),a.add(tc(a.getBoundingRect(),t)),a.eachChild(function(t){var e=t.__title,i=t.hoverStyle;if(i&&e){var r=ce(e,Ce(i)),o=t.position[0]+a.position[0],l=!1;t.position[1]+a.position[1]+s+r.height>n.getHeight()&&(i.textPosition="top",l=!0);var u=l?-5-r.height:s+8;o+r.width/2>n.getWidth()?(i.textPosition=["100%",u],i.textAlign="right"):o-r.width/2<0&&(i.textPosition=[0,u],i.textAlign="left")}})}},updateView:function(t,e,n,i){d(this._features,function(t){t.updateView&&t.updateView(t.model,e,n,i)})},remove:function(t,e){d(this._features,function(n){n.remove&&n.remove(t,e)}),this.group.removeAll()},dispose:function(t,e){d(this._features,function(n){n.dispose&&n.dispose(t,e)})}});var NM=Sx.toolbox.saveAsImage;Md.defaultOption={show:!0,icon:"M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0",title:NM.title,type:"png",name:"",excludeComponents:["toolbox"],pixelRatio:1,lang:NM.lang.slice()},Md.prototype.unusable=!bp.canvasSupported,Md.prototype.onclick=function(t,e){var n=this.model,i=n.get("name")||t.get("title.0.text")||"echarts",r=document.createElement("a"),o=n.get("type",!0)||"png";r.download=i+"."+o,r.target="_blank";var a=e.getConnectedDataURL({type:o,backgroundColor:n.get("backgroundColor",!0)||t.get("backgroundColor")||"#fff",excludeComponents:n.get("excludeComponents"),pixelRatio:n.get("pixelRatio")});if(r.href=a,"function"!=typeof MouseEvent||bp.browser.ie||bp.browser.edge)if(window.navigator.msSaveOrOpenBlob){for(var s=atob(a.split(",")[1]),l=s.length,u=new Uint8Array(l);l--;)u[l]=s.charCodeAt(l);var h=new Blob([u]);window.navigator.msSaveOrOpenBlob(h,i+"."+o)}else{var c=n.get("lang"),d='<body style="margin:0;"><img src="'+a+'" style="max-width:100%;" title="'+(c&&c[0]||"")+'" /></body>';window.open().document.write(d)}else{var f=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1});r.dispatchEvent(f)}},_d("saveAsImage",Md);var RM=Sx.toolbox.magicType;Sd.defaultOption={show:!0,type:[],icon:{line:"M4.1,28.9h7.1l9.3-22l7.4,38l9.7-19.7l3,12.8h14.9M4.1,58h51.4",bar:"M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7",stack:"M8.2,38.4l-8.4,4.1l30.6,15.3L60,42.5l-8.1-4.1l-21.5,11L8.2,38.4z M51.9,30l-8.1,4.2l-13.4,6.9l-13.9-6.9L8.2,30l-8.4,4.2l8.4,4.2l22.2,11l21.5-11l8.1-4.2L51.9,30z M51.9,21.7l-8.1,4.2L35.7,30l-5.3,2.8L24.9,30l-8.4-4.1l-8.3-4.2l-8.4,4.2L8.2,30l8.3,4.2l13.9,6.9l13.4-6.9l8.1-4.2l8.1-4.1L51.9,21.7zM30.4,2.2L-0.2,17.5l8.4,4.1l8.3,4.2l8.4,4.2l5.5,2.7l5.3-2.7l8.1-4.2l8.1-4.2l8.1-4.1L30.4,2.2z",tiled:"M2.3,2.2h22.8V25H2.3V2.2z M35,2.2h22.8V25H35V2.2zM2.3,35h22.8v22.8H2.3V35z M35,35h22.8v22.8H35V35z"},title:n(RM.title),option:{},seriesIndex:{}};var BM=Sd.prototype;BM.getIcons=function(){var t=this.model,e=t.get("icon"),n={};return d(t.get("type"),function(t){e[t]&&(n[t]=e[t])}),n};var VM={line:function(t,e,n,r){if("bar"===t)return i({id:e,type:"line",data:n.get("data"),stack:n.get("stack"),markPoint:n.get("markPoint"),markLine:n.get("markLine")},r.get("option.line")||{},!0)},bar:function(t,e,n,r){if("line"===t)return i({id:e,type:"bar",data:n.get("data"),stack:n.get("stack"),markPoint:n.get("markPoint"),markLine:n.get("markLine")},r.get("option.bar")||{},!0)},stack:function(t,e,n,r){if("line"===t||"bar"===t)return i({id:e,stack:"__ec_magicType_stack__"},r.get("option.stack")||{},!0)},tiled:function(t,e,n,r){if("line"===t||"bar"===t)return i({id:e,stack:""},r.get("option.tiled")||{},!0)}},FM=[["line","bar"],["stack","tiled"]];BM.onclick=function(t,e,n){var i=this.model,r=i.get("seriesIndex."+n);if(VM[n]){var o={series:[]};d(FM,function(t){l(t,n)>=0&&d(t,function(t){i.setIconStatus(t,"normal")})}),i.setIconStatus(n,"emphasis"),t.eachComponent({mainType:"series",query:null==r?null:{seriesIndex:r}},function(e){var r=e.subType,s=e.id,l=VM[n](r,s,e,i);l&&(a(l,e.option),o.series.push(l));var u=e.coordinateSystem;if(u&&"cartesian2d"===u.type&&("line"===n||"bar"===n)){var h=u.getAxesByScale("ordinal")[0];if(h){var c=h.dim+"Axis",d=t.queryComponents({mainType:c,index:e.get(name+"Index"),id:e.get(name+"Id")})[0].componentIndex;o[c]=o[c]||[];for(var f=0;f<=d;f++)o[c][d]=o[c][d]||{};o[c][d].boundaryGap="bar"===n}}}),e.dispatchAction({type:"changeMagicType",currentType:n,newOption:o})}},ts({type:"changeMagicType",event:"magicTypeChanged",update:"prepareAndUpdate"},function(t,e){e.mergeOption(t.newOption)}),_d("magicType",Sd);var HM=Sx.toolbox.dataView,GM=new Array(60).join("-"),WM="\t",ZM=new RegExp("["+WM+"]+","g");zd.defaultOption={show:!0,readOnly:!1,optionToContent:null,contentToOption:null,icon:"M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28",title:n(HM.title),lang:n(HM.lang),backgroundColor:"#fff",textColor:"#000",textareaColor:"#fff",textareaBorderColor:"#333",buttonColor:"#c23531",buttonTextColor:"#fff"},zd.prototype.onclick=function(t,e){function n(){i.removeChild(o),x._dom=null}var i=e.getDom(),r=this.model;this._dom&&i.removeChild(this._dom);var o=document.createElement("div");o.style.cssText="position:absolute;left:5px;top:5px;bottom:5px;right:5px;",o.style.backgroundColor=r.get("backgroundColor")||"#fff";var a=document.createElement("h4"),s=r.get("lang")||[];a.innerHTML=s[0]||r.get("title"),a.style.cssText="margin: 10px 20px;",a.style.color=r.get("textColor");var l=document.createElement("div"),u=document.createElement("textarea");l.style.cssText="display:block;width:100%;overflow:auto;";var h=r.get("optionToContent"),c=r.get("contentToOption"),d=Dd(t);if("function"==typeof h){var f=h(e.getOption());"string"==typeof f?l.innerHTML=f:S(f)&&l.appendChild(f)}else l.appendChild(u),u.readOnly=r.get("readOnly"),u.style.cssText="width:100%;height:100%;font-family:monospace;font-size:14px;line-height:1.6rem;",u.style.color=r.get("textColor"),u.style.borderColor=r.get("textareaBorderColor"),u.style.backgroundColor=r.get("textareaColor"),u.value=d.value;var p=d.meta,g=document.createElement("div");g.style.cssText="position:absolute;bottom:0;left:0;right:0;";var m="float:right;margin-right:20px;border:none;cursor:pointer;padding:2px 5px;font-size:12px;border-radius:3px",v=document.createElement("div"),y=document.createElement("div");m+=";background-color:"+r.get("buttonColor"),m+=";color:"+r.get("buttonTextColor");var x=this;on(v,"click",n),on(y,"click",function(){var t;try{t="function"==typeof c?c(l,e.getOption()):Od(u.value,p)}catch(t){throw n(),new Error("Data view format error "+t)}t&&e.dispatchAction({type:"changeDataView",newOption:t}),n()}),v.innerHTML=s[1],y.innerHTML=s[2],y.style.cssText=m,v.style.cssText=m,!r.get("readOnly")&&g.appendChild(y),g.appendChild(v),on(u,"keydown",function(t){if(9===(t.keyCode||t.which)){var e=this.value,n=this.selectionStart,i=this.selectionEnd;this.value=e.substring(0,n)+WM+e.substring(i),this.selectionStart=this.selectionEnd=n+1,tm(t)}}),o.appendChild(a),o.appendChild(l),o.appendChild(g),l.style.height=i.clientHeight-80+"px",i.appendChild(o),this._dom=o},zd.prototype.remove=function(t,e){this._dom&&e.getDom().removeChild(this._dom)},zd.prototype.dispose=function(t,e){this.remove(t,e)},_d("dataView",zd),ts({type:"changeDataView",event:"dataViewChanged",update:"prepareAndUpdate"},function(t,e){var n=[];d(t.newOption.series,function(t){var i=e.getSeriesByName(t.name)[0];if(i){var r=i.get("data");n.push({name:t.name,data:Ed(t.data,r)})}else n.push(o({type:"scatter"},t))}),e.mergeOption(a({series:n},t.newOption))});var UM=v,XM=d,jM=f,YM=Math.min,qM=Math.max,$M=Math.pow,KM=1e4,QM=6,JM=6,tS="globalPan",eS={w:[0,0],e:[0,1],n:[1,0],s:[1,1]},nS={w:"ew",e:"ew",n:"ns",s:"ns",ne:"nesw",sw:"nesw",nw:"nwse",se:"nwse"},iS={brushStyle:{lineWidth:2,stroke:"rgba(0,0,0,0.3)",fill:"rgba(0,0,0,0.1)"},transformable:!0,brushMode:"single",removeOnClick:!1},rS=0;Nd.prototype={constructor:Nd,enableBrush:function(t){return this._brushType&&Bd(this),t.brushType&&Rd(this,t),this},setPanels:function(t){if(t&&t.length){var e=this._panels={};d(t,function(t){e[t.panelId]=n(t)})}else this._panels=null;return this},mount:function(t){t=t||{},this._enableGlobalPan=t.enableGlobalPan;var e=this.group;return this._zr.add(e),e.attr({position:t.position||[0,0],rotation:t.rotation||0,scale:t.scale||[1,1]}),this._transform=e.getLocalTransform(),this},eachCover:function(t,e){XM(this._covers,t,e)},updateCovers:function(t){function e(t,e){return(null!=t.id?t.id:o+e)+"-"+t.brushType}function r(e,n){var i=t[e];if(null!=n&&a[n]===u)s[e]=a[n];else{var r=s[e]=null!=n?(a[n].__brushOption=i,a[n]):Fd(l,Vd(l,i));Wd(l,r)}}t=f(t,function(t){return i(n(iS),t,!0)});var o="\0-brush-index-",a=this._covers,s=this._covers=[],l=this,u=this._creatingCover;return new hs(a,t,function(t,n){return e(t.__brushOption,n)},e).add(r).update(r).remove(function(t){a[t]!==u&&l.group.remove(a[t])}).execute(),this},unmount:function(){return this.enableBrush(!1),jd(this),this._zr.remove(this.group),this},dispose:function(){this.unmount(),this.off()}},h(Nd,Zp);var oS={mousedown:function(t){if(this._dragging)mf.call(this,t);else if(!t.target||!t.target.draggable){df(t);var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);this._creatingCover=null,(this._creatingPanel=Ud(this,t,e))&&(this._dragging=!0,this._track=[e.slice()])}},mousemove:function(t){var e=this.group.transformCoordToLocal(t.offsetX,t.offsetY);if(cf(this,t,e),this._dragging){df(t);var n=pf(this,t,e,!1);n&&Yd(this,n)}},mouseup:mf},aS={lineX:vf(0),lineY:vf(1),rect:{createCover:function(t,e){return Kd(UM(af,function(t){return t},function(t){return t}),t,e,["w","e","n","s","se","sw","ne","nw"])},getCreatingRange:function(t){var e=$d(t);return nf(e[1][0],e[1][1],e[0][0],e[0][1])},updateCoverShape:function(t,e,n,i){Qd(t,e,n,i)},updateCommon:Jd,contain:ff},polygon:{createCover:function(t,e){var n=new Sg;return n.add(new Vv({name:"main",style:ef(e),silent:!0})),n},getCreatingRange:function(t){return t},endCreating:function(t,e){e.remove(e.childAt(0)),e.add(new Bv({name:"main",draggable:!0,drift:UM(sf,t,e),ondragend:UM(Yd,t,{isEnd:!0})}))},updateCoverShape:function(t,e,n,i){e.childAt(0).setShape({points:uf(t,e,n)})},updateCommon:Jd,contain:ff}},sS={axisPointer:1,tooltip:1,brush:1},lS=d,uS=l,hS=v,cS=["dataToPoint","pointToData"],dS=["grid","xAxis","yAxis","geo","graph","polar","radiusAxis","angleAxis","bmap"],fS=Mf.prototype;fS.setOutputRanges=function(t,e){this.matchOutputRanges(t,e,function(t,e,n){if((t.coordRanges||(t.coordRanges=[])).push(e),!t.coordRange){t.coordRange=e;var i=vS[t.brushType](0,n,e);t.__rangeOffset={offset:yS[t.brushType](i.values,t.range,[1,1]),xyMinMax:i.xyMinMax}}})},fS.matchOutputRanges=function(t,e,n){lS(t,function(t){var i=this.findTargetInfo(t,e);i&&!0!==i&&d(i.coordSyses,function(i){var r=vS[t.brushType](1,i,t.range);n(t,r.values,i,e)})},this)},fS.setInputRanges=function(t,e){lS(t,function(t){var n=this.findTargetInfo(t,e);if(t.range=t.range||[],n&&!0!==n){t.panelId=n.panelId;var i=vS[t.brushType](0,n.coordSys,t.coordRange),r=t.__rangeOffset;t.range=r?yS[t.brushType](i.values,r.offset,Df(i.xyMinMax,r.xyMinMax)):i.values}},this)},fS.makePanelOpts=function(t,e){return f(this._targetInfoList,function(n){var i=n.getPanelRect();return{panelId:n.panelId,defaultBrushType:e&&e(n),clipPath:xf(i),isTargetByCursor:wf(i,t,n.coordSysModel),getLinearBrushOtherExtent:_f(i)}})},fS.controlSeries=function(t,e,n){var i=this.findTargetInfo(t,n);return!0===i||i&&uS(i.coordSyses,e.coordinateSystem)>=0},fS.findTargetInfo=function(t,e){for(var n=this._targetInfoList,i=If(e,t),r=0;r<n.length;r++){var o=n[r],a=t.panelId;if(a){if(o.panelId===a)return o}else for(r=0;r<gS.length;r++)if(gS[r](i,o))return o}return!0};var pS={grid:function(t,e){var n=t.xAxisModels,i=t.yAxisModels,r=t.gridModels,o=N(),a={},s={};(n||i||r)&&(lS(n,function(t){var e=t.axis.grid.model;o.set(e.id,e),a[e.id]=!0}),lS(i,function(t){var e=t.axis.grid.model;o.set(e.id,e),s[e.id]=!0}),lS(r,function(t){o.set(t.id,t),a[t.id]=!0,s[t.id]=!0}),o.each(function(t){var r=t.coordinateSystem,o=[];lS(r.getCartesians(),function(t,e){(uS(n,t.getAxis("x").model)>=0||uS(i,t.getAxis("y").model)>=0)&&o.push(t)}),e.push({panelId:"grid--"+t.id,gridModel:t,coordSysModel:t,coordSys:o[0],coordSyses:o,getPanelRect:mS.grid,xAxisDeclared:a[t.id],yAxisDeclared:s[t.id]})}))},geo:function(t,e){lS(t.geoModels,function(t){var n=t.coordinateSystem;e.push({panelId:"geo--"+t.id,geoModel:t,coordSysModel:t,coordSys:n,coordSyses:[n],getPanelRect:mS.geo})})}},gS=[function(t,e){var n=t.xAxisModel,i=t.yAxisModel,r=t.gridModel;return!r&&n&&(r=n.axis.grid.model),!r&&i&&(r=i.axis.grid.model),r&&r===e.gridModel},function(t,e){var n=t.geoModel;return n&&n===e.geoModel}],mS={grid:function(){return this.coordSys.grid.getRect().clone()},geo:function(){var t=this.coordSys,e=t.getBoundingRect().clone();return e.applyTransform(lr(t)),e}},vS={lineX:hS(Cf,0),lineY:hS(Cf,1),rect:function(t,e,n){var i=e[cS[t]]([n[0][0],n[1][0]]),r=e[cS[t]]([n[0][1],n[1][1]]),o=[Sf([i[0],r[0]]),Sf([i[1],r[1]])];return{values:o,xyMinMax:o}},polygon:function(t,e,n){var i=[[1/0,-1/0],[1/0,-1/0]];return{values:f(n,function(n){var r=e[cS[t]](n);return i[0][0]=Math.min(i[0][0],r[0]),i[1][0]=Math.min(i[1][0],r[1]),i[0][1]=Math.max(i[0][1],r[0]),i[1][1]=Math.max(i[1][1],r[1]),r}),xyMinMax:i}}},yS={lineX:hS(Tf,0),lineY:hS(Tf,1),rect:function(t,e,n){return[[t[0][0]-n[0]*e[0][0],t[0][1]-n[0]*e[0][1]],[t[1][0]-n[1]*e[1][0],t[1][1]-n[1]*e[1][1]]]},polygon:function(t,e,n){return f(t,function(t,i){return[t[0]-n[0]*e[i][0],t[1]-n[1]*e[i][1]]})}},xS=d,_S="\0_ec_hist_store";mM.extend({type:"dataZoom.select"}),vM.extend({type:"dataZoom.select"});var wS=Sx.toolbox.dataZoom,bS=d,MS="\0_ec_\0toolbox-dataZoom_";Ef.defaultOption={show:!0,icon:{zoom:"M0,13.5h26.9 M13.5,26.9V0 M32.1,13.5H58V58H13.5 V32.1",back:"M22,1.4L9.9,13.5l12.3,12.3 M10.3,13.5H54.9v44.6 H10.3v-26"},title:n(wS.title)};var SS=Ef.prototype;SS.render=function(t,e,n,i){this.model=t,this.ecModel=e,this.api=n,Bf(t,e,this,i,n),Rf(t,e)},SS.onclick=function(t,e,n){IS[n].call(this)},SS.remove=function(t,e){this._brushController.unmount()},SS.dispose=function(t,e){this._brushController.dispose()};var IS={zoom:function(){var t=!this._isZoomActive;this.api.dispatchAction({type:"takeGlobalCursor",key:"dataZoomSelect",dataZoomSelectActive:t})},back:function(){this._dispatchZoomAction(Pf(this.ecModel))}};SS._onBrush=function(t,e){function n(t,e,n){var a=e.getAxis(t),s=a.model,l=i(t,s,o),u=l.findRepresentativeAxisProxy(s).getMinMaxSpan();null==u.minValueSpan&&null==u.maxValueSpan||(n=yM(0,n.slice(),a.scale.getExtent(),0,u.minValueSpan,u.maxValueSpan)),l&&(r[l.id]={dataZoomId:l.id,startValue:n[0],endValue:n[1]})}function i(t,e,n){var i;return n.eachComponent({mainType:"dataZoom",subType:"select"},function(n){n.getAxisModel(t,e.componentIndex)&&(i=n)}),i}if(e.isEnd&&t.length){var r={},o=this.ecModel;this._brushController.updateCovers([]),new Mf(Nf(this.model.option),o,{include:["grid"]}).matchOutputRanges(t,o,function(t,e,i){if("cartesian2d"===i.type){var r=t.brushType;"rect"===r?(n("x",i,e[0]),n("y",i,e[1])):n({lineX:"x",lineY:"y"}[r],i,e)}}),kf(o,r),this._dispatchZoomAction(r)}},SS._dispatchZoomAction=function(t){var e=[];bS(t,function(t,i){e.push(n(t))}),e.length&&this.api.dispatchAction({type:"dataZoom",from:this.uid,batch:e})},_d("dataZoom",Ef),Qa(function(t){function e(t,e){if(e){var r=t+"Index",o=e[r];null==o||"all"==o||y(o)||(o=!1===o||"none"===o?[]:[o]),n(t,function(e,n){if(null==o||"all"==o||-1!==l(o,n)){var a={type:"select",$fromToolbox:!0,id:MS+t+n};a[r]=n,i.push(a)}})}}function n(e,n){var i=t[e];y(i)||(i=i?[i]:[]),bS(i,n)}if(t){var i=t.dataZoom||(t.dataZoom=[]);y(i)||(t.dataZoom=i=[i]);var r=t.toolbox;if(r&&(y(r)&&(r=r[0]),r&&r.feature)){var o=r.feature.dataZoom;e("xAxis",o),e("yAxis",o)}}});var CS=Sx.toolbox.restore;Vf.defaultOption={show:!0,icon:"M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5",title:CS.title},Vf.prototype.onclick=function(t,e,n){Lf(t),e.dispatchAction({type:"restore",from:this.uid})},_d("restore",Vf),ts({type:"restore",event:"restore",update:"prepareAndUpdate"},function(t,e){e.resetOption("recreate")});var TS,DS="urn:schemas-microsoft-com:vml",AS="undefined"==typeof window?null:window,kS=!1,PS=AS&&AS.document;if(PS&&!bp.canvasSupported)try{!PS.namespaces.zrvml&&PS.namespaces.add("zrvml",DS),TS=function(t){return PS.createElement("<zrvml:"+t+' class="zrvml">')}}catch(t){TS=function(t){return PS.createElement("<"+t+' xmlns="'+DS+'" class="zrvml">')}}var LS=av.CMD,OS=Math.round,zS=Math.sqrt,ES=Math.abs,NS=Math.cos,RS=Math.sin,BS=Math.max;if(!bp.canvasSupported){var VS=21600,FS=VS/2,HS=function(t){t.style.cssText="position:absolute;left:0;top:0;width:1px;height:1px;",t.coordsize=VS+","+VS,t.coordorigin="0,0"},GS=function(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;")},WS=function(t,e,n){return"rgb("+[t,e,n].join(",")+")"},ZS=function(t,e){e&&t&&e.parentNode!==t&&t.appendChild(e)},US=function(t,e){e&&t&&e.parentNode===t&&t.removeChild(e)},XS=function(t,e,n){return 1e5*(parseFloat(t)||0)+1e3*(parseFloat(e)||0)+n},jS=function(t,e){return"string"==typeof t?t.lastIndexOf("%")>=0?parseFloat(t)/100*e:parseFloat(t):t},YS=function(t,e,n){var i=St(e);n=+n,isNaN(n)&&(n=1),i&&(t.color=WS(i[0],i[1],i[2]),t.opacity=n*i[3])},qS=function(t){var e=St(t);return[WS(e[0],e[1],e[2]),e[3]]},$S=function(t,e,n){var i=e.fill;if(null!=i)if(i instanceof Xv){var r,o=0,a=[0,0],s=0,l=1,u=n.getBoundingRect(),h=u.width,c=u.height;if("linear"===i.type){r="gradient";var d=n.transform,f=[i.x*h,i.y*c],p=[i.x2*h,i.y2*c];d&&($(f,f,d),$(p,p,d));var g=p[0]-f[0],m=p[1]-f[1];(o=180*Math.atan2(g,m)/Math.PI)<0&&(o+=360),o<1e-6&&(o=0)}else{r="gradientradial";var f=[i.x*h,i.y*c],d=n.transform,v=n.scale,y=h,x=c;a=[(f[0]-u.x)/y,(f[1]-u.y)/x],d&&$(f,f,d),y/=v[0]*VS,x/=v[1]*VS;var _=BS(y,x);s=0/_,l=2*i.r/_-s}var w=i.colorStops.slice();w.sort(function(t,e){return t.offset-e.offset});for(var b=w.length,M=[],S=[],I=0;I<b;I++){var C=w[I],T=qS(C.color);S.push(C.offset*l+s+" "+T[0]),0!==I&&I!==b-1||M.push(T)}if(b>=2){var D=M[0][0],A=M[1][0],k=M[0][1]*e.opacity,P=M[1][1]*e.opacity;t.type=r,t.method="none",t.focus="100%",t.angle=o,t.color=D,t.color2=A,t.colors=S.join(","),t.opacity=P,t.opacity2=k}"radial"===r&&(t.focusposition=a.join(","))}else YS(t,i,e.opacity)},KS=function(t,e){null!=e.lineDash&&(t.dashstyle=e.lineDash.join(" ")),null==e.stroke||e.stroke instanceof Xv||YS(t,e.stroke,e.opacity)},QS=function(t,e,n,i){var r="fill"==e,o=t.getElementsByTagName(e)[0];null!=n[e]&&"none"!==n[e]&&(r||!r&&n.lineWidth)?(t[r?"filled":"stroked"]="true",n[e]instanceof Xv&&US(t,o),o||(o=Ff(e)),r?$S(o,n,i):KS(o,n),ZS(t,o)):(t[r?"filled":"stroked"]="false",US(t,o))},JS=[[],[],[]],tI=function(t,e){var n,i,r,o,a,s,l=LS.M,u=LS.C,h=LS.L,c=LS.A,d=LS.Q,f=[],p=t.data,g=t.len();for(o=0;o<g;){switch(r=p[o++],i="",n=0,r){case l:i=" m ",n=1,a=p[o++],s=p[o++],JS[0][0]=a,JS[0][1]=s;break;case h:i=" l ",n=1,a=p[o++],s=p[o++],JS[0][0]=a,JS[0][1]=s;break;case d:case u:i=" c ",n=3;var m,v,y=p[o++],x=p[o++],_=p[o++],w=p[o++];r===d?(m=_,v=w,_=(_+2*y)/3,w=(w+2*x)/3,y=(a+2*y)/3,x=(s+2*x)/3):(m=p[o++],v=p[o++]),JS[0][0]=y,JS[0][1]=x,JS[1][0]=_,JS[1][1]=w,JS[2][0]=m,JS[2][1]=v,a=m,s=v;break;case c:var b=0,M=0,S=1,I=1,C=0;e&&(b=e[4],M=e[5],S=zS(e[0]*e[0]+e[1]*e[1]),I=zS(e[2]*e[2]+e[3]*e[3]),C=Math.atan2(-e[1]/I,e[0]/S));var T=p[o++],D=p[o++],A=p[o++],k=p[o++],P=p[o++]+C,L=p[o++]+P+C;o++;var O=p[o++],z=T+NS(P)*A,E=D+RS(P)*k,y=T+NS(L)*A,x=D+RS(L)*k,N=O?" wa ":" at ";Math.abs(z-y)<1e-4&&(Math.abs(L-P)>.01?O&&(z+=.0125):Math.abs(E-D)<1e-4?O&&z<T||!O&&z>T?x-=.0125:x+=.0125:O&&E<D||!O&&E>D?y+=.0125:y-=.0125),f.push(N,OS(((T-A)*S+b)*VS-FS),",",OS(((D-k)*I+M)*VS-FS),",",OS(((T+A)*S+b)*VS-FS),",",OS(((D+k)*I+M)*VS-FS),",",OS((z*S+b)*VS-FS),",",OS((E*I+M)*VS-FS),",",OS((y*S+b)*VS-FS),",",OS((x*I+M)*VS-FS)),a=y,s=x;break;case LS.R:var R=JS[0],B=JS[1];R[0]=p[o++],R[1]=p[o++],B[0]=R[0]+p[o++],B[1]=R[1]+p[o++],e&&($(R,R,e),$(B,B,e)),R[0]=OS(R[0]*VS-FS),B[0]=OS(B[0]*VS-FS),R[1]=OS(R[1]*VS-FS),B[1]=OS(B[1]*VS-FS),f.push(" m ",R[0],",",R[1]," l ",B[0],",",R[1]," l ",B[0],",",B[1]," l ",R[0],",",B[1]);break;case LS.Z:f.push(" x ")}if(n>0){f.push(i);for(var V=0;V<n;V++){var F=JS[V];e&&$(F,F,e),f.push(OS(F[0]*VS-FS),",",OS(F[1]*VS-FS),V<n-1?",":"")}}}return f.join("")};xi.prototype.brushVML=function(t){var e=this.style,n=this._vmlEl;n||(n=Ff("shape"),HS(n),this._vmlEl=n),QS(n,"fill",e,this),QS(n,"stroke",e,this);var i=this.transform,r=null!=i,o=n.getElementsByTagName("stroke")[0];if(o){var a=e.lineWidth;if(r&&!e.strokeNoScale){var s=i[0]*i[3]-i[1]*i[2];a*=zS(ES(s))}o.weight=a+"px"}var l=this.path||(this.path=new av);this.__dirtyPath&&(l.beginPath(),this.buildPath(l,this.shape),l.toStatic(),this.__dirtyPath=!1),n.path=tI(l,this.transform),n.style.zIndex=XS(this.zlevel,this.z,this.z2),ZS(t,n),null!=e.text?this.drawRectText(t,this.getBoundingRect()):this.removeRectText(t)},xi.prototype.onRemove=function(t){US(t,this._vmlEl),this.removeRectText(t)},xi.prototype.onAdd=function(t){ZS(t,this._vmlEl),this.appendRectText(t)};var eI=function(t){return"object"==typeof t&&t.tagName&&"IMG"===t.tagName.toUpperCase()};je.prototype.brushVML=function(t){var e,n,i=this.style,r=i.image;if(eI(r)){var o=r.src;if(o===this._imageSrc)e=this._imageWidth,n=this._imageHeight;else{var a=r.runtimeStyle,s=a.width,l=a.height;a.width="auto",a.height="auto",e=r.width,n=r.height,a.width=s,a.height=l,this._imageSrc=o,this._imageWidth=e,this._imageHeight=n}r=o}else r===this._imageSrc&&(e=this._imageWidth,n=this._imageHeight);if(r){var u=i.x||0,h=i.y||0,c=i.width,d=i.height,f=i.sWidth,p=i.sHeight,g=i.sx||0,m=i.sy||0,v=f&&p,y=this._vmlEl;y||(y=PS.createElement("div"),HS(y),this._vmlEl=y);var x,_=y.style,w=!1,b=1,M=1;if(this.transform&&(x=this.transform,b=zS(x[0]*x[0]+x[1]*x[1]),M=zS(x[2]*x[2]+x[3]*x[3]),w=x[1]||x[2]),w){var S=[u,h],I=[u+c,h],C=[u,h+d],T=[u+c,h+d];$(S,S,x),$(I,I,x),$(C,C,x),$(T,T,x);var D=BS(S[0],I[0],C[0],T[0]),A=BS(S[1],I[1],C[1],T[1]),k=[];k.push("M11=",x[0]/b,",","M12=",x[2]/M,",","M21=",x[1]/b,",","M22=",x[3]/M,",","Dx=",OS(u*b+x[4]),",","Dy=",OS(h*M+x[5])),_.padding="0 "+OS(D)+"px "+OS(A)+"px 0",_.filter="progid:DXImageTransform.Microsoft.Matrix("+k.join("")+", SizingMethod=clip)"}else x&&(u=u*b+x[4],h=h*M+x[5]),_.filter="",_.left=OS(u)+"px",_.top=OS(h)+"px";var P=this._imageEl,L=this._cropEl;P||(P=PS.createElement("div"),this._imageEl=P);var O=P.style;if(v){if(e&&n)O.width=OS(b*e*c/f)+"px",O.height=OS(M*n*d/p)+"px";else{var z=new Image,E=this;z.onload=function(){z.onload=null,e=z.width,n=z.height,O.width=OS(b*e*c/f)+"px",O.height=OS(M*n*d/p)+"px",E._imageWidth=e,E._imageHeight=n,E._imageSrc=r},z.src=r}L||((L=PS.createElement("div")).style.overflow="hidden",this._cropEl=L);var N=L.style;N.width=OS((c+g*c/f)*b),N.height=OS((d+m*d/p)*M),N.filter="progid:DXImageTransform.Microsoft.Matrix(Dx="+-g*c/f*b+",Dy="+-m*d/p*M+")",L.parentNode||y.appendChild(L),P.parentNode!=L&&L.appendChild(P)}else O.width=OS(b*c)+"px",O.height=OS(M*d)+"px",y.appendChild(P),L&&L.parentNode&&(y.removeChild(L),this._cropEl=null);var R="",B=i.opacity;B<1&&(R+=".Alpha(opacity="+OS(100*B)+") "),R+="progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+r+", SizingMethod=scale)",O.filter=R,y.style.zIndex=XS(this.zlevel,this.z,this.z2),ZS(t,y),null!=i.text&&this.drawRectText(t,this.getBoundingRect())}},je.prototype.onRemove=function(t){US(t,this._vmlEl),this._vmlEl=null,this._cropEl=null,this._imageEl=null,this.removeRectText(t)},je.prototype.onAdd=function(t){ZS(t,this._vmlEl),this.appendRectText(t)};var nI,iI={},rI=0,oI=document.createElement("div"),aI=function(t){var e=iI[t];if(!e){rI>100&&(rI=0,iI={});var n,i=oI.style;try{i.font=t,n=i.fontFamily.split(",")[0]}catch(t){}e={style:i.fontStyle||"normal",variant:i.fontVariant||"normal",weight:i.fontWeight||"normal",size:0|parseFloat(i.fontSize||12),family:n||"Microsoft YaHei"},iI[t]=e,rI++}return e};!function(t,e){Zg[t]=e}("measureText",function(t,e){var n=PS;nI||((nI=n.createElement("div")).style.cssText="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;",PS.body.appendChild(nI));try{nI.style.font=e}catch(t){}return nI.innerHTML="",nI.appendChild(n.createTextNode(t)),{width:nI.offsetWidth}});for(var sI=new Xt,lI=[Yg,Xe,je,xi,kv],uI=0;uI<lI.length;uI++){var hI=lI[uI].prototype;hI.drawRectText=function(t,e,n,i){var r=this.style;this.__dirty&&De(r);var o=r.text;if(null!=o&&(o+=""),o){if(r.rich){var a=Se(o,r);o=[];for(var s=0;s<a.lines.length;s++){for(var l=a.lines[s].tokens,u=[],h=0;h<l.length;h++)u.push(l[h].text);o.push(u.join(""))}o=o.join("\n")}var c,d,f=r.textAlign,p=r.textVerticalAlign,g=aI(r.font),m=g.style+" "+g.variant+" "+g.weight+" "+g.size+'px "'+g.family+'"';n=n||ce(o,m,f,p);var v=this.transform;if(v&&!i&&(sI.copy(e),sI.applyTransform(v),e=sI),i)c=e.x,d=e.y;else{var y=r.textPosition,x=r.textDistance;if(y instanceof Array)c=e.x+jS(y[0],e.width),d=e.y+jS(y[1],e.height),f=f||"left";else{var _=me(y,e,x);c=_.x,d=_.y,f=f||_.textAlign,p=p||_.textVerticalAlign}}c=pe(c,n.width,f),d=ge(d,n.height,p),d+=n.height/2;var w,b,M,S=Ff,I=this._textVmlEl;I?b=(w=(M=I.firstChild).nextSibling).nextSibling:(I=S("line"),w=S("path"),b=S("textpath"),M=S("skew"),b.style["v-text-align"]="left",HS(I),w.textpathok=!0,b.on=!0,I.from="0 0",I.to="1000 0.05",ZS(I,M),ZS(I,w),ZS(I,b),this._textVmlEl=I);var C=[c,d],T=I.style;v&&i?($(C,C,v),M.on=!0,M.matrix=v[0].toFixed(3)+","+v[2].toFixed(3)+","+v[1].toFixed(3)+","+v[3].toFixed(3)+",0,0",M.offset=(OS(C[0])||0)+","+(OS(C[1])||0),M.origin="0 0",T.left="0px",T.top="0px"):(M.on=!1,T.left=OS(c)+"px",T.top=OS(d)+"px"),b.string=GS(o);try{b.style.font=m}catch(t){}QS(I,"fill",{fill:r.textFill,opacity:r.opacity},this),QS(I,"stroke",{stroke:r.textStroke,opacity:r.opacity,lineDash:r.lineDash},this),I.style.zIndex=XS(this.zlevel,this.z,this.z2),ZS(t,I)}},hI.removeRectText=function(t){US(t,this._textVmlEl),this._textVmlEl=null},hI.appendRectText=function(t){ZS(t,this._textVmlEl)}}kv.prototype.brushVML=function(t){var e=this.style;null!=e.text?this.drawRectText(t,{x:e.x||0,y:e.y||0,width:0,height:0},this.getBoundingRect(),!0):this.removeRectText(t)},kv.prototype.onRemove=function(t){this.removeRectText(t)},kv.prototype.onAdd=function(t){this.appendRectText(t)}}Wf.prototype={constructor:Wf,getType:function(){return"vml"},getViewportRoot:function(){return this._vmlViewport},getViewportRootOffset:function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},refresh:function(){var t=this.storage.getDisplayList(!0,!0);this._paintList(t)},_paintList:function(t){for(var e=this._vmlRoot,n=0;n<t.length;n++){var i=t[n];i.invisible||i.ignore?(i.__alreadyNotVisible||i.onRemove(e),i.__alreadyNotVisible=!0):(i.__alreadyNotVisible&&i.onAdd(e),i.__alreadyNotVisible=!1,i.__dirty&&(i.beforeBrush&&i.beforeBrush(),(i.brushVML||i.brush).call(i,e),i.afterBrush&&i.afterBrush())),i.__dirty=!1}this._firstPaint&&(this._vmlViewport.appendChild(e),this._firstPaint=!1)},resize:function(t,e){var t=null==t?this._getWidth():t,e=null==e?this._getHeight():e;if(this._width!=t||this._height!=e){this._width=t,this._height=e;var n=this._vmlViewport.style;n.width=t+"px",n.height=e+"px"}},dispose:function(){this.root.innerHTML="",this._vmlRoot=this._vmlViewport=this.storage=null},getWidth:function(){return this._width},getHeight:function(){return this._height},clear:function(){this._vmlViewport&&this.root.removeChild(this._vmlViewport)},_getWidth:function(){var t=this.root,e=t.currentStyle;return(t.clientWidth||Gf(e.width))-Gf(e.paddingLeft)-Gf(e.paddingRight)|0},_getHeight:function(){var t=this.root,e=t.currentStyle;return(t.clientHeight||Gf(e.height))-Gf(e.paddingTop)-Gf(e.paddingBottom)|0}},d(["getLayer","insertLayer","eachLayer","eachBuiltinLayer","eachOtherLayer","getLayers","modLayer","delLayer","clearLayer","toDataURL","pathToImage"],function(t){Wf.prototype[t]=Zf(t)}),vn("vml",Wf);var cI="http://www.w3.org/2000/svg",dI=av.CMD,fI=Array.prototype.join,pI="none",gI=Math.round,mI=Math.sin,vI=Math.cos,yI=Math.PI,xI=2*Math.PI,_I=180/yI,wI=1e-4,bI={};bI.brush=function(t){var e=t.style,n=t.__svgEl;n||(n=Uf("path"),t.__svgEl=n),t.path||t.createPathProxy();var i=t.path;if(t.__dirtyPath){i.beginPath(),t.buildPath(i,t.shape),t.__dirtyPath=!1;var r=tp(i);r.indexOf("NaN")<0&&Kf(n,"d",r)}Jf(n,e),$f(n,t.transform),null!=e.text&&CI(t,t.getBoundingRect())};var MI={};MI.brush=function(t){var e=t.style,n=e.image;if(n instanceof HTMLImageElement&&(n=n.src),n){var i=e.x||0,r=e.y||0,o=e.width,a=e.height,s=t.__svgEl;s||(s=Uf("image"),t.__svgEl=s),n!==t.__imageSrc&&(Qf(s,"href",n),t.__imageSrc=n),Kf(s,"width",o),Kf(s,"height",a),Kf(s,"x",i),Kf(s,"y",r),$f(s,t.transform),null!=e.text&&CI(t,t.getBoundingRect())}};var SI={},II=new Xt,CI=function(t,e,n){var i=t.style;t.__dirty&&De(i);var r=i.text;if(null!=r){r+="";var o=t.__textSvgEl;o||(o=Uf("text"),t.__textSvgEl=o);var a,s,l=i.textPosition,u=i.textDistance,h=i.textAlign||"left";"number"==typeof i.fontSize&&(i.fontSize+="px");var c=i.font||[i.fontStyle||"",i.fontWeight||"",i.fontSize||"",i.fontFamily||""].join(" ")||Wg,d=ep(i.textVerticalAlign),f=(n=ce(r,c,h,d)).lineHeight;if(l instanceof Array)a=e.x+l[0],s=e.y+l[1];else{var p=me(l,e,u);a=p.x,s=p.y,d=ep(p.textVerticalAlign),h=p.textAlign}Kf(o,"alignment-baseline",d),c&&(o.style.font=c);var g=i.textPadding;if(Kf(o,"x",a),Kf(o,"y",s),Jf(o,i,!0),t instanceof kv||t.style.transformText)$f(o,t.transform);else{if(t.transform)II.copy(e),II.applyTransform(t.transform),e=II;else{var m=t.transformCoordToGlobal(e.x,e.y);e.x=m[0],e.y=m[1]}var v=i.textOrigin;"center"===v?(a=n.width/2+a,s=n.height/2+s):v&&(a=v[0]+a,s=v[1]+s);var y=-i.textRotation||0,x=rt();ut(x,t.transform,y),$f(o,x)}var _=r.split("\n"),w=_.length,b=h;"left"===b?(b="start",g&&(a+=g[3])):"right"===b?(b="end",g&&(a-=g[1])):"center"===b&&(b="middle",g&&(a+=(g[3]-g[1])/2));var M=0;if("baseline"===d?(M=-n.height+f,g&&(M-=g[2])):"middle"===d?(M=(-n.height+f)/2,g&&(s+=(g[0]-g[2])/2)):g&&(M+=g[0]),t.__text!==r||t.__textFont!==c){var S=t.__tspanList||[];t.__tspanList=S;for(C=0;C<w;C++)(T=S[C])?T.innerHTML="":(T=S[C]=Uf("tspan"),o.appendChild(T),Kf(T,"alignment-baseline",d),Kf(T,"text-anchor",b)),Kf(T,"x",a),Kf(T,"y",s+C*f+M),T.appendChild(document.createTextNode(_[C]));for(;C<S.length;C++)o.removeChild(S[C]);S.length=w,t.__text=r,t.__textFont=c}else if(t.__tspanList.length)for(var I=t.__tspanList.length,C=0;C<I;++C){var T=t.__tspanList[C];T&&(Kf(T,"x",a),Kf(T,"y",s+C*f+M))}}};SI.drawRectText=CI,SI.brush=function(t){var e=t.style;null!=e.text&&(e.textPosition=[0,0],CI(t,{x:e.x||0,y:e.y||0,width:0,height:0},t.getBoundingRect()))},np.prototype={diff:function(t,e,n){n||(n=function(t,e){return t===e}),this.equals=n;var i=this;t=t.slice();var r=(e=e.slice()).length,o=t.length,a=1,s=r+o,l=[{newPos:-1,components:[]}],u=this.extractCommon(l[0],e,t,0);if(l[0].newPos+1>=r&&u+1>=o){for(var h=[],c=0;c<e.length;c++)h.push(c);return[{indices:h,count:e.length}]}for(;a<=s;){var d=function(){for(var n=-1*a;n<=a;n+=2){var s,u=l[n-1],h=l[n+1],c=(h?h.newPos:0)-n;u&&(l[n-1]=void 0);var d=u&&u.newPos+1<r,f=h&&0<=c&&c<o;if(d||f){if(!d||f&&u.newPos<h.newPos?(s=rp(h),i.pushComponent(s.components,void 0,!0)):((s=u).newPos++,i.pushComponent(s.components,!0,void 0)),c=i.extractCommon(s,e,t,n),s.newPos+1>=r&&c+1>=o)return ip(0,s.components);l[n]=s}else l[n]=void 0}a++}();if(d)return d}},pushComponent:function(t,e,n){var i=t[t.length-1];i&&i.added===e&&i.removed===n?t[t.length-1]={count:i.count+1,added:e,removed:n}:t.push({count:1,added:e,removed:n})},extractCommon:function(t,e,n,i){for(var r=e.length,o=n.length,a=t.newPos,s=a-i,l=0;a+1<r&&s+1<o&&this.equals(e[a+1],n[s+1]);)a++,s++,l++;return l&&t.components.push({count:l}),t.newPos=a,s},tokenize:function(t){return t.slice()},join:function(t){return t.slice()}};var TI=new np,DI=function(t,e,n){return TI.diff(t,e,n)};op.prototype.createElement=Uf,op.prototype.getDefs=function(t){var e=this._svgRoot,n=this._svgRoot.getElementsByTagName("defs");return 0===n.length?t?((n=e.insertBefore(this.createElement("defs"),e.firstChild)).contains||(n.contains=function(t){var e=n.children;if(!e)return!1;for(var i=e.length-1;i>=0;--i)if(e[i]===t)return!0;return!1}),n):null:n[0]},op.prototype.update=function(t,e){if(t){var n=this.getDefs(!1);if(t[this._domName]&&n.contains(t[this._domName]))"function"==typeof e&&e(t);else{var i=this.add(t);i&&(t[this._domName]=i)}}},op.prototype.addDom=function(t){this.getDefs(!0).appendChild(t)},op.prototype.removeDom=function(t){var e=this.getDefs(!1);e&&t[this._domName]&&(e.removeChild(t[this._domName]),t[this._domName]=null)},op.prototype.getDoms=function(){var t=this.getDefs(!1);if(!t)return[];var e=[];return d(this._tagNames,function(n){var i=t.getElementsByTagName(n);e=e.concat([].slice.call(i))}),e},op.prototype.markAllUnused=function(){var t=this;d(this.getDoms(),function(e){e[t._markLabel]="0"})},op.prototype.markUsed=function(t){t&&(t[this._markLabel]="1")},op.prototype.removeUnused=function(){var t=this.getDefs(!1);if(t){var e=this;d(this.getDoms(),function(n){"1"!==n[e._markLabel]&&t.removeChild(n)})}},op.prototype.getSvgProxy=function(t){return t instanceof xi?bI:t instanceof je?MI:t instanceof kv?SI:bI},op.prototype.getTextSvgElement=function(t){return t.__textSvgEl},op.prototype.getSvgElement=function(t){return t.__svgEl},u(ap,op),ap.prototype.addWithoutUpdate=function(t,e){if(e&&e.style){var n=this;d(["fill","stroke"],function(i){if(e.style[i]&&("linear"===e.style[i].type||"radial"===e.style[i].type)){var r,o=e.style[i],a=n.getDefs(!0);o._dom?(r=o._dom,a.contains(o._dom)||n.addDom(r)):r=n.add(o),n.markUsed(e);var s=r.getAttribute("id");t.setAttribute(i,"url(#"+s+")")}})}},ap.prototype.add=function(t){var e;if("linear"===t.type)e=this.createElement("linearGradient");else{if("radial"!==t.type)return yg("Illegal gradient type."),null;e=this.createElement("radialGradient")}return t.id=t.id||this.nextId++,e.setAttribute("id","zr"+this._zrId+"-gradient-"+t.id),this.updateDom(t,e),this.addDom(e),e},ap.prototype.update=function(t){var e=this;op.prototype.update.call(this,t,function(){var n=t.type,i=t._dom.tagName;"linear"===n&&"linearGradient"===i||"radial"===n&&"radialGradient"===i?e.updateDom(t,t._dom):(e.removeDom(t),e.add(t))})},ap.prototype.updateDom=function(t,e){if("linear"===t.type)e.setAttribute("x1",t.x),e.setAttribute("y1",t.y),e.setAttribute("x2",t.x2),e.setAttribute("y2",t.y2);else{if("radial"!==t.type)return void yg("Illegal gradient type.");e.setAttribute("cx",t.x),e.setAttribute("cy",t.y),e.setAttribute("r",t.r)}t.global?e.setAttribute("gradientUnits","userSpaceOnUse"):e.setAttribute("gradientUnits","objectBoundingBox"),e.innerHTML="";for(var n=t.colorStops,i=0,r=n.length;i<r;++i){var o=this.createElement("stop");o.setAttribute("offset",100*n[i].offset+"%"),o.setAttribute("stop-color",n[i].color),e.appendChild(o)}t._dom=e},ap.prototype.markUsed=function(t){if(t.style){var e=t.style.fill;e&&e._dom&&op.prototype.markUsed.call(this,e._dom),(e=t.style.stroke)&&e._dom&&op.prototype.markUsed.call(this,e._dom)}},u(sp,op),sp.prototype.update=function(t){var e=this.getSvgElement(t);e&&this.updateDom(e,t.__clipPaths,!1);var n=this.getTextSvgElement(t);n&&this.updateDom(n,t.__clipPaths,!0),this.markUsed(t)},sp.prototype.updateDom=function(t,e,n){if(e&&e.length>0){var i,r,o=this.getDefs(!0),a=e[0],s=n?"_textDom":"_dom";a[s]?(r=a[s].getAttribute("id"),i=a[s],o.contains(i)||o.appendChild(i)):(r="zr"+this._zrId+"-clip-"+this.nextId,++this.nextId,(i=this.createElement("clipPath")).setAttribute("id",r),o.appendChild(i),a[s]=i);var l=this.getSvgProxy(a);if(a.transform&&a.parent.invTransform&&!n){var u=Array.prototype.slice.call(a.transform);st(a.transform,a.parent.invTransform,a.transform),l.brush(a),a.transform=u}else l.brush(a);var h=this.getSvgElement(a);i.innerHTML="",i.appendChild(h.cloneNode()),t.setAttribute("clip-path","url(#"+r+")"),e.length>1&&this.updateDom(i,e.slice(1),n)}else t&&t.setAttribute("clip-path","none")},sp.prototype.markUsed=function(t){var e=this;t.__clipPaths&&t.__clipPaths.length>0&&d(t.__clipPaths,function(t){t._dom&&op.prototype.markUsed.call(e,t._dom),t._textDom&&op.prototype.markUsed.call(e,t._textDom)})},u(lp,op),lp.prototype.addWithoutUpdate=function(t,e){if(e&&up(e.style)){var n,i=e.style;i._shadowDom?(n=i._shadowDom,this.getDefs(!0).contains(i._shadowDom)||this.addDom(n)):n=this.add(e),this.markUsed(e);var r=n.getAttribute("id");t.style.filter="url(#"+r+")"}},lp.prototype.add=function(t){var e=this.createElement("filter"),n=t.style;return n._shadowDomId=n._shadowDomId||this.nextId++,e.setAttribute("id","zr"+this._zrId+"-shadow-"+n._shadowDomId),this.updateDom(t,e),this.addDom(e),e},lp.prototype.update=function(t,e){var n=e.style;if(up(n)){var i=this;op.prototype.update.call(this,e,function(t){i.updateDom(e,t._shadowDom)})}else this.remove(t,n)},lp.prototype.remove=function(t,e){null!=e._shadowDomId&&(this.removeDom(e),t.style.filter="")},lp.prototype.updateDom=function(t,e){var n=e.getElementsByTagName("feDropShadow");n=0===n.length?this.createElement("feDropShadow"):n[0];var i,r,o,a,s=t.style,l=t.scale?t.scale[0]||1:1,u=t.scale?t.scale[1]||1:1;if(s.shadowBlur||s.shadowOffsetX||s.shadowOffsetY)i=s.shadowOffsetX||0,r=s.shadowOffsetY||0,o=s.shadowBlur,a=s.shadowColor;else{if(!s.textShadowBlur)return void this.removeDom(e,s);i=s.textShadowOffsetX||0,r=s.textShadowOffsetY||0,o=s.textShadowBlur,a=s.textShadowColor}n.setAttribute("dx",i/l),n.setAttribute("dy",r/u),n.setAttribute("flood-color",a);var h=o/2/l+" "+o/2/u;n.setAttribute("stdDeviation",h),e.setAttribute("x","-100%"),e.setAttribute("y","-100%"),e.setAttribute("width",Math.ceil(o/2*200)+"%"),e.setAttribute("height",Math.ceil(o/2*200)+"%"),e.appendChild(n),s._shadowDom=e},lp.prototype.markUsed=function(t){var e=t.style;e&&e._shadowDom&&op.prototype.markUsed.call(this,e._shadowDom)};var AI=function(t,e,n,i){this.root=t,this.storage=e,this._opts=n=o({},n||{});var r=Uf("svg");r.setAttribute("xmlns","http://www.w3.org/2000/svg"),r.setAttribute("version","1.1"),r.setAttribute("baseProfile","full"),r.style.cssText="user-select:none;position:absolute;left:0;top:0;",this.gradientManager=new ap(i,r),this.clipPathManager=new sp(i,r),this.shadowManager=new lp(i,r);var a=document.createElement("div");a.style.cssText="overflow:hidden;position:relative",this._svgRoot=r,this._viewport=a,t.appendChild(a),a.appendChild(r),this.resize(n.width,n.height),this._visibleList=[]};AI.prototype={constructor:AI,getType:function(){return"svg"},getViewportRoot:function(){return this._viewport},getViewportRootOffset:function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},refresh:function(){var t=this.storage.getDisplayList(!0);this._paintList(t)},setBackgroundColor:function(t){this._viewport.style.background=t},_paintList:function(t){this.gradientManager.markAllUnused(),this.clipPathManager.markAllUnused(),this.shadowManager.markAllUnused();var e,n=this._svgRoot,i=this._visibleList,r=t.length,o=[];for(e=0;e<r;e++){var a=cp(f=t[e]),s=vp(f)||mp(f);f.invisible||(f.__dirty&&(a&&a.brush(f),this.clipPathManager.update(f),f.style&&(this.gradientManager.update(f.style.fill),this.gradientManager.update(f.style.stroke),this.shadowManager.update(s,f)),f.__dirty=!1),o.push(f))}var l,u=DI(i,o);for(e=0;e<u.length;e++)if((c=u[e]).removed)for(d=0;d<c.count;d++){var s=vp(f=i[c.indices[d]]),h=mp(f);gp(n,s),gp(n,h)}for(e=0;e<u.length;e++){var c=u[e];if(c.added)for(d=0;d<c.count;d++){var s=vp(f=o[c.indices[d]]),h=mp(f);l?fp(n,s,l):pp(n,s),s?fp(n,h,s):l?fp(n,h,l):pp(n,h),fp(n,h,s),l=h||s||l,this.gradientManager.addWithoutUpdate(s,f),this.shadowManager.addWithoutUpdate(l,f),this.clipPathManager.markUsed(f)}else if(!c.removed)for(var d=0;d<c.count;d++){var f=o[c.indices[d]];l=s=mp(f)||vp(f)||l,this.gradientManager.markUsed(f),this.gradientManager.addWithoutUpdate(s,f),this.shadowManager.markUsed(f),this.shadowManager.addWithoutUpdate(s,f),this.clipPathManager.markUsed(f)}}this.gradientManager.removeUnused(),this.clipPathManager.removeUnused(),this.shadowManager.removeUnused(),this._visibleList=o},_getDefs:function(t){var e=this._svgRoot,n=this._svgRoot.getElementsByTagName("defs");return 0===n.length?t?((n=e.insertBefore(Uf("defs"),e.firstChild)).contains||(n.contains=function(t){var e=n.children;if(!e)return!1;for(var i=e.length-1;i>=0;--i)if(e[i]===t)return!0;return!1}),n):null:n[0]},resize:function(t,e){var n=this._viewport;n.style.display="none";var i=this._opts;if(null!=t&&(i.width=t),null!=e&&(i.height=e),t=this._getSize(0),e=this._getSize(1),n.style.display="",this._width!==t||this._height!==e){this._width=t,this._height=e;var r=n.style;r.width=t+"px",r.height=e+"px";var o=this._svgRoot;o.setAttribute("width",t),o.setAttribute("height",e)}},getWidth:function(){return this._width},getHeight:function(){return this._height},_getSize:function(t){var e=this._opts,n=["width","height"][t],i=["clientWidth","clientHeight"][t],r=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(null!=e[n]&&"auto"!==e[n])return parseFloat(e[n]);var a=this.root,s=document.defaultView.getComputedStyle(a);return(a[i]||hp(s[n])||hp(a.style[n]))-(hp(s[r])||0)-(hp(s[o])||0)|0},dispose:function(){this.root.innerHTML="",this._svgRoot=this._viewport=this.storage=null},clear:function(){this._viewport&&this.root.removeChild(this._viewport)},pathToDataUrl:function(){return this.refresh(),"data:image/svg+xml;charset=UTF-8,"+this._svgRoot.outerHTML}},d(["getLayer","insertLayer","eachLayer","eachBuiltinLayer","eachOtherLayer","getLayers","modLayer","delLayer","clearLayer","toDataURL","pathToImage"],function(t){AI.prototype[t]=yp(t)}),vn("svg",AI),t.version="4.1.0",t.dependencies=Gx,t.PRIORITY=Xx,t.init=function(t,e,n){var i=$a(t);if(i)return i;var r=new Aa(t,e,n);return r.id="ec_"+u_++,s_[r.id]=r,Pn(t,c_,r.id),Ya(r),r},t.connect=function(t){if(y(t)){var e=t;t=null,Bx(e,function(e){null!=e.group&&(t=e.group)}),t=t||"g_"+h_++,Bx(e,function(e){e.group=t})}return l_[t]=!0,t},t.disConnect=qa,t.disconnect=f_,t.dispose=function(t){"string"==typeof t?t=s_[t]:t instanceof Aa||(t=$a(t)),t instanceof Aa&&!t.isDisposed()&&t.dispose()},t.getInstanceByDom=$a,t.getInstanceById=function(t){return s_[t]},t.registerTheme=Ka,t.registerPreprocessor=Qa,t.registerProcessor=Ja,t.registerPostUpdate=function(t){i_.push(t)},t.registerAction=ts,t.registerCoordinateSystem=function(t,e){yo.register(t,e)},t.getCoordinateSystemDimensions=function(t){var e=yo.get(t);if(e)return e.getDimensionsInfo?e.getDimensionsInfo():e.dimensions.slice()},t.registerLayout=es,t.registerVisual=ns,t.registerLoading=rs,t.extendComponentModel=os,t.extendComponentView=as,t.extendSeriesModel=ss,t.extendChartView=ls,t.setCanvasCreator=function(t){e("createCanvas",t)},t.registerMap=function(t,e,n){e.geoJson&&!e.features&&(n=e.specialAreas,e=e.geoJson),"string"==typeof e&&(e="undefined"!=typeof JSON&&JSON.parse?JSON.parse(e):new Function("return ("+e+");")()),d_[t]={geoJson:e,specialAreas:n}},t.getMap=function(t){return d_[t]},t.dataTool=p_,t.zrender=pm,t.graphic=ty,t.number=hy,t.format=yy,t.throttle=ua,t.helper=aw,t.matrix=qp,t.vector=Gp,t.color=dg,t.parseGeoJSON=lw,t.parseGeoJson=dw,t.util=fw,t.List=M_,t.Model=pr,t.Axis=cw,t.env=bp});

var userCenter = (function() {
  var page = 1
  var inquery_validate;
  var lawyerName,trialRound,judge,trialYear,court,legalBases,appellors,courtLevel,docType,officeName,area
  

  var searchOptions = [
   
    { name: '被告人', value: 'defendant' },
    { name: '代理律师', value: 'lawyerName' },
    { name: '律师事务所', value: 'officeName' },
    { name: '法院名称', value: 'court' },
    { name: '地区', value: 'courtCityId' },
    { name: '所属年份', value: 'trialYear' },
    { name: '法院层级', value: 'courtLevel' },
    { name: '裁判人员', value: 'judge' },
    { name: '文书类型', value: 'docType' },
    { name: '审判程序', value: 'trialRound' },
    { name: '法律依据', value: 'legalBases' }

  ]
  var addedOptions = []
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

$({})._Ajax({
  url: "casetype/apiTree",
  success: function (result) {
          if (result.code==0) {
              var html = template("search-reason-templete",result)
              $("#navbar-menu").html(html);
          }
      }
});

  function getMycase() {
    var params = {
      clientId: clientId,
      sidx: 'createTime',
      order: 'desc'
    }

    $('#my-cases .pager').tablePager({
      url: 'order/queryOrderList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('case-result-templete', result.data)

            $('.my-case-box').html(html)
          }
        }
      }
    })

  }

  function searchHigt(){
    $(".page-result .sidenav-menu").html("");
    $(".page-result .case-list").html("");
    var searhKey = $("#alltext").val();
    var defendant = $("#defendant").val();
    var starttime = $("#starttime").val();
    var endtime = $("#endtime").val();
    var reason = $("#reasonslect .reaseontext").text();
    lawyerName = $("#lawyerName1").val()?$("#lawyerName1").val():"";
    trialRound = $("#trialRound1").val()?$("#trialRound1").val():"";
    judge = $("#judge1").val()?$("#judge1").val():"";
    trialYear = $("#trialYear1").find("option:selected").val()?$("#trialYear1").find("option:selected").val():"";
    court = $("#court1").val()?$("#court1").val():"";
    legalBases = $("#legalBases1").val()?$("#legalBases1").val():"";
    appellors = $("#appellors1").val()?$("#appellors1").val():"";
    courtLevel = $("#courtLevel1").find("option:selected").val()?$("#courtLevel1").find("option:selected").val():"";
    docType = $("#docType1").find("option:selected").val()?$("#docType1").find("option:selected").val():"";
    officeName = $("#officeName1").val()?$("#officeName1").val():"";
    area = $("#area-select").attr("data-id")?$("#area-select").attr("data-id"):"";
   if(reason == "全部"){
    reason = "";
   }
    var params = {
      keywork : searhKey,
      defendant : defendant,
      trialDateBegin : starttime,
      trialDateEnd : endtime,
      reason : reason,
      isGroupCategory : true,
      lawyerName : lawyerName,
      courtCityId : area,
      trialRound : trialRound,
      trialYear : trialYear,
      appellors : appellors,
      officeName : officeName,
      court : court,
      courtLevel : courtLevel,
      judge : judge,
      docType : docType,
      legalBases : legalBases,

    }
    $('.result-contents .pager').tablePager({
        
      url: "case/lawyerRecommendCaseList",
      searchParam:params,
      success: function (result) {
         if(result.code == 0){
           $(".page-result").show();
           $(".options-block-hide").trigger("click");
            result.data.host=  api.host+"caseDetail?";
            $(".result-count").text(result.data.totalCount);
            var html = template('lawyer-list-templete', result.data); 
            $(".case-list").html(html);
       //     result.data.hosts=  api.link+"lawyerDetail?name="+codename;
            result.data.hosts=  api.host+"lawyerDetail";
            var html2 = template('lawyer-slider-templete', result.data); 
            $(".sidenav-menu").html(html2);




          if(result.data.totalCount>10){
              $(".page-row").hide()
          }else{
              $(".page-row").show()
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


  $(function() {
    $("#my-assistant").addClass("active");
    $("#starttime").jeDate(start);
    $("#endtime").jeDate(end);
    init_city_select($("#area-select"));
    $('[data-sidenav]').sidenav(); 

    $('aside .right-icon').click(function(e) {
      e.stopPropagation()
      if (e.target.classList.contains('fa-chevron-down')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .show()
        $(e.target)
          .addClass('fa-chevron-up')
          .removeClass('fa-chevron-down')
      } else if (e.target.classList.contains('fa-chevron-up')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .hide()
        $(e.target)
          .removeClass('fa-chevron-up')
          .addClass('fa-chevron-down')
      }
    })
    //lawyer assistant
    $('#lawyer-assistant .options-block-show').click(function() {
      $('#lawyer-assistant .options-block').show()
    })
    $('#lawyer-assistant .options-block-hide').click(function() {
      $('#lawyer-assistant .options-block').hide()
    })
    var addOptionHandeler = function(e) {
      e.stopPropagation()
      var pickedValue = e.target.id ? e.target.id : e.target.parentNode.id
      addedOptions.push(
        searchOptions.filter(function(option) {
          return option.value === pickedValue
        })[0]
      )
      searchOptions = searchOptions.filter(function(option){
        return option.value !== pickedValue
 
      })
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )
      $('#lawyer-assistant .aside-btns').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
     
    }
    $('#lawyer-assistant .options-block').on(
      'click',
      '.topick-option',
      function(e) {
        addOptionHandeler(e)
       
      }
    )

    var subOptionHandeler = function(e) {
      e.stopPropagation()
      console.log(e)
      var pickedValue = e.target.id ? e.target.id : e.target.parentNode.id
      console.log(pickedValue)
      searchOptions.push(
        addedOptions.filter(function(option) {
          return option.value === pickedValue
        })[0]
      )
      addedOptions = addedOptions.filter(function(option) {
        return option.value !== pickedValue
      })       
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )
      $('#lawyer-assistant .resource-options').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
    }
    $('#lawyer-assistant .options-block').on('click', '.added-option', function(
      e
    ) {
      subOptionHandeler(e)
    })
    $('#lawyer-assistant .search-page .search-btn').click(function() {
      // $('#lawyer-assistant .search-page').removeClass('pageNow')
      // $('#lawyer-assistant .result-page').addClass('pageNow')
      var keywords = $("#top-keyword").val();
   
     
      var params = {
          offset:0,
          keyword : keywords,
          isGroupCategory : true,
      }
      $('.page-result .pager').tablePager({
      
          url: "case/lawyerRecommendCaseList",
          searchParam:params,
          success: function (result) {
             if(result.code == 0){
              $(".page-result").show();
              $(".options-block-hide").trigger("click");
              result.data.host=  api.host+"caseDetail?";          
              $(".result-count").text(result.data.totalCount);
              var html = template('lawyer-list-templete', result.data); 
              $(".case-list").html(html);
  
              result.data.hosts=  api.host+"lawyerDetail";
              var html2 = template('lawyer-slider-templete', result.data); 
              $(".sidenav-menu").html(html2);
  
              if(result.data.totalCount>10){
                  $(".page-row").show()
              }else{
                  $(".page-row").show()
              }
  
             }else{
                  toastr.warning(result.msg);
             }
            
          }
      })

    })
    $('#lawyer-assistant .result-page .visualization-btn').click(function() {
      $('#lawyer-assistant .result-page').removeClass('pageNow')
      $('#lawyer-assistant .visual-result-page').addClass('pageNow')

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('route-result'))
      var mylawChart = echarts.init(document.getElementById('law-result'))

      // 指定图表的配置项和数据
      var option = {
        dataset: {
          source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
          ]
        },
        grid: { containLabel: true },
        xAxis: {},
        yAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            }
          }
        ]
      }
      var lawOption = {
        backgroundColor: '#2c343c',
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: [
              { value: 235, name: '视频广告' },
              { value: 274, name: '联盟广告' },
              { value: 310, name: '邮件营销' },
              { value: 335, name: '直接访问' },
              { value: 400, name: '搜索引擎' }
            ],
            roseType: 'angle',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      mylawChart.setOption(lawOption)
    })
  })



  return {
    init: function() {
      // $('#lawyer-assistant .options-block').html(
      //   template('lawyer-assistant-template', {
      //     options: searchOptions,
      //     addedOptions: addedOptions
      //   })
      // )


      $('#lawyer-assistant .resource-options').html(
        template('lawyer-assistant-template', {
          options: searchOptions
        })
      )
      $('#lawyer-assistant #addedOption').html(
        template('lawyer-added-template', {
          addedOptions: addedOptions
        })
      )
      $(document).on("click","#searchBtn",function(){
        $(".options-block-hide").trigger("click");
        searchHigt();
      })

      
    $(document).on("click",".slider-result",function(){
      $(".options-block-hide").trigger("click");
      var sonid =  $(this).attr("data-id");
      console.log(sonid)
      var params = {
       caseQueryLogId:sonid,
       isGroupCategory:true,
       offset:0
   }
      $('.case-list-page .pager').tablePager({
       url: "case/lawyerRecommendCaseList",
       searchParam:params,
       success: function (result) {     
        // result.data.host=  api.host+"caseDetail?";          
         $(".result-count").text(result.data.totalCount);
         var html = template('lawyer-list-templete', result.data); 
         $(".case-list").html(html);
        
       if(result.data.totalCount<10){
           $(".page-row").hide()
       }else{
           $(".page-row").show()
       }
       }
   })
   location.reload();
   }) 

   $(document).on("click",".search-options span",function(){
    var keywords = $(this).text();
   
    $(".options-block-hide").trigger("click");
    var params = {
        offset:0,
        keyword : keywords,
        isGroupCategory : true
    }
    $('.page-result .pager').tablePager({
    
        url: "case/lawyerRecommendCaseList",
        searchParam:params,
        success: function (result) {
           if(result.code == 0){
            result.data.host=  api.host+"caseDetail?";          
            $(".result-count").text(result.data.totalCount);
            var html = template('lawyer-list-templete', result.data); 
            $(".case-list").html(html);

            result.data.hosts=  api.host+"lawyerDetail";
            var html2 = template('lawyer-slider-templete', result.data); 
            $(".sidenav-menu").html(html2);

            if(result.data.totalCount>10){
                $(".page-row").show()
            }else{
                $(".page-row").show()
            }

           }else{
                toastr.warning(result.msg);
           }
          
        }
    })
})
        $(document).on("click","#reasonslect .reaseontext",function(event){
          $("#navbar-menu").toggle()
          event.stopPropagation();
        })
        $(document).on("click",".first-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
          $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").attr("data-id",dataid);
          $("#navbar-menu").hide();
          
        })
        $(document).on("click",".second-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
     //   var parent = $(this).attr("parent-name");
         $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").text(parent+"-"+data);
        //  $("#reasonslect .reaseontext").attr("data-id",dataid);
          $("#navbar-menu").hide();
        })
        $(document).on("click",".last-val",function(){
          var data = $(this).text();
          var dataid = $(this).attr("data-id");
    //      var parentname = $(this).attr("parent-name");
    //      var parent = $(this).attr("parent");
         $("#reasonslect .reaseontext").text(data);
          $("#reasonslect .reaseontext").attr("data-id",dataid);
      //    $("#reasonslect .reaseontext").text(parent+" - "+parentname+" - "+data);
          $("#navbar-menu").hide();
        })
        $(document).on("click",function(event){
          $("#navbar-menu").hide();
        });

      $('#lawyer-assistant .result-page').html(
        template('lawyer-assistant-result-template', {
          count: 301,
          results: [
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            },
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            },
            {
              title: '张明等于刘燕纯所有权确认纠纷二审民事判决书',
              court: '北京市第三中级人民法院',
              no: '（2018）京03号民终6586号',
              time: '2018-05-31',
              type: '民事 二审 判决',
              content:
                ' 本院认为：张明主张分割其与刘艳春之间的夫妻共同财产，其中其中包括1994年兴建房屋及另行兴建的东厢房三间。关于19'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
