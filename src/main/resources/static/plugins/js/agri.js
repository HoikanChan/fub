function getDataFunc(a){var e="";if("010102"==a)return initThing(),!1;$.ajax({url:requestUrl+"rest/getTsDisplayBoxList",async:!1,type:"get",data:{mark:a},dataType:"json",success:function(a){if(a.success){var t=a;t.success?$.each(t.list,function(a,t){e+=t.boxnum+","}):alert(t.msg),e=e.substr(0,e.length-1),getDataByBoxNum(e)}}})}function getDataByBoxNum(a){$.ajax({url:requestUrl+"rest/getDisplayBoxStatisticsList",async:!1,type:"get",data:{boxNum:a,adminCode:adminCode},dataType:"json",success:function(a){if(a.success){var e=a;$.each(e.obj,function(a,e){switch(e.boxNum){case"0401":cropfun(e);break;case"0402":plantfun(e);break;case"0403":fun(e);break;case"0404":newCrops(e);break;case"0405":cropareafun(e);break;case"0406":plantareafun(e);break;case"0407":fun(e);break;case"0701":disasternumfun(e);break;case"0702":case"0703":case"0704":disasterArea(e);break;case"0705":ganhanzaihaifun(e);break;case"0706":disasteranalysisfun(e);break;case"0707":chongzaizaihaifun(e);break;case"0708":honglaozaihaifun(e);break;case"0501":case"0502":case"0503":case"0504":case"0505":farmlandFun(e);break;case"0101":farmoccupynumfun(e);break;case"0102":farmanalysisfun(e);break;case"0103":case"0104":occupfun(e);break;case"0105":farmatypefun(e);break;case"0106":quarterlyFun(e);break;case"0107":occupfun(e);break;case"0301":growingFun(e);break;case"0302":case"0303":looksfun(e);break;case"0304":growingFun(e);break;case"0305":case"0306":looksfun(e)}})}else alert("数据暂时没有，请稍后再试!")}})}function getWeather(a){$.ajax({url:"http://api.map.baidu.com/telematics/v3/weather?location="+a+"&output=json&ak=WuO5qDQOjiGoyPeMHIs2GzEq78AsDdQ5",async:!1,type:"GET",dataType:"jsonp",success:function(a){var e=(a.results[0].currentCity,a.results[0].pm25,a.results[0].weather_data[0].date.split("：")[1]),t=e.substr(0,e.length-1),s=a.results[0].weather_data[0].dayPictureUrl,n=a.results[0].index[4].zs,r=a.results[0].weather_data[0].wind,c=a.results[0].weather_data[0].weather,i=a.results[0].weather_data[0].date.split("(")[0];i.substr(2,i.length);$("#weather").html(c),$("#temperature").html(t),$("#zs").html(n),$("#pm25").html(a.results[0].pm25),$("#wind").html(r),$("#imgUrl").attr("src",s)}})}function getCitySelect(){$.ajax({url:requestUrl+"rest/getCurOrSubAdministrationList",async:!1,type:"get",dataType:"json",data:{adminCode:"230300",containGeom:"2",type:"2"},success:function(a){if(a.success){var e=a;if(a.success){var t=e.list;$("#selectCity").empty(),$("#selectCity").append("<option value='230300' selected>鸡西市</option>"),$.each(t,function(a,e){$("#selectCity").append("<option value='"+e.admincode+"'>"+e.name+"</option>")})}else alert("数据暂时没有，请稍后再试!")}else alert("数据暂时没有，请稍后再试!")}})}function initSelect(){$(".filter-box").selectFilter({callBack:function(a){adminCode=a,getDataFunc(window.Params.param),getWeather($("#selectCity option:selected").text()),selectChange(a)}})}function ajaxFucntion(a,e,t){$.ajax({url:a,async:!1,type:"post",data:e,dataType:"json",success:function(a){t(a)}})}var requestUrl=api.host,cityParam,adminCode;$(function(){getCitySelect(),adminCode=$("#selectCity option:selected").val(),window.Params=getParam(),getDataFunc(window.Params.param),getWeather($("#selectCity option:selected").text()),initSelect(),loadMap(window.Params.param,adminCode),"010102"!=window.Params.param?$("#map").append('<div class="select_right_top" title="全屏"><a href="fullScreenMap?mark='+window.Params.param+'"><img src="../../assets/image/10.png" title="全屏" class="img"/></a></div>'):$("#map").append('<div class="select_right_top" title="全屏"><a href="fullScreenMapEquipment.html?mark='+window.Params.param+","+adminCode+'"><img src="../../assets/image/10.png" title="全屏" class="img"/></a></div>')});