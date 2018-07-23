
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
	//html += '<div class="province-comfime clear"></div>';
	html += '</div>';
	html += '<div class="cityAll">';
	html += '<div class="pre"><a><span class="glyphicon glyphicon-menu-left"></span></a></div>';
	html += '<div class="list"><ul></ul></div>';
	html += '<div class="next"><a><span class="glyphicon glyphicon-menu-right"></span></a></div>';
	//html += '<div class="province-comfime clear"><span onclick="getprovince()">确定</span></div>';
	html += '</div>';
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
	$(document).on("click",".province-comfime span",function(event){
		var $li = $(".provinceAll list ul li");
		console.log($li.find(".current").attr("id"));
	alert("134")
		for(var i=0;i<$li.length;i++){
				 
				
		}
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
	$(".provinceCityAll .con .cityAll").show().siblings().hide();
//	$("#cityAll").addClass("current").closest("li").siblings("li").find("a").removeClass("current");
	getprovince(provinceId);
	cityPage(provinceId, 1);
	//alert($("#" + provinceId).attr("title"))
}
function getprovince(provinceId){
	$(".province-comfime span").attr("id",provinceId);
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
