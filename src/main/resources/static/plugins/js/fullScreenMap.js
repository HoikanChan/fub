var index=function(){return $("#map").height($(window).height()),-1!=window.navigator.userAgent.indexOf("MSIE")&&$("#map").height($(window).height()),$({mark:$.getUrlParam("mark")})._Ajax({url:"rest/getThematicMapServiceInfoList",async:!1,success:function(e){if(1==e.code){var i=template("nav-template",e.list);$("#navigation").html(i),$.getUrlParam("selectedMark")&&$.getUrlParam("mark")!=$.getUrlParam("selectedMark")?(timeLine.getTimeline($.getUrlParam("selectedMark")),$("#navigation [data-thematicno="+$.getUrlParam("selectedMark")+"]").addClass("active")):timeLine.getTimeline($.getUrlParam("mark"))}else alert(e.msg)}}),$(window).resize(function(){$("#map").height($(window).height())}),{init:function(){$(document).on("click","#nav-list",function(){var e=$(this).siblings("ul");$("#baseMapSelect ul").hide(),$("#toolsBar ul").hide(),e.length>0&&(e.is(":hidden")?($(this).addClass("arrow-down"),e.show()):($(this).removeClass("arrow-down"),e.hide()))}),$(document).on("click","#tool",function(){var e=$(this).siblings("ul");$("#baseMapSelect ul").hide(),$("#navigation ul").hide(),e.length>0&&(e.is(":hidden")?($(this).addClass("arrow-down"),e.show()):($(this).removeClass("arrow-down"),e.hide()))}),$(document).on("click","#current-base-map",function(){var e=$(this).siblings("ul");$("#navigation ul").hide(),$("#toolsBar ul").hide(),e.length>0&&(e.is(":hidden")?($(this).addClass("arrow-down"),e.show()):($(this).removeClass("arrow-down"),e.hide()))}),$(document).on("click","#navigation .nav-item",function(){$("#navigation .active").removeClass("active"),$(this).addClass("active").parent().hide();var e=$(this).attr("data-thematicno");timeLine.map.getLayersByName("Highlighted Features").length>0&&(timeLine.map.removeAllPopup(),timeLine.map.getLayersByName("Highlighted Features")[0].destroyFeatures()),timeLine.getTimeline(e)}),$(document).on("click","#checkReport-btn",function(){$(this).attr("data-href")&&!$(this).is(":hidden")&&window.open($(this).attr("data-href")),$(this).parent().hide()}),$(document).on("click","#legend-btn",function(){$(this).siblings("img").is(":hidden")?$(this).siblings("img").animate({opacity:100},"fast",function(){$(this).show()}):$(this).siblings("img").animate({opacity:0},"fast",function(){$(this).hide()})}),$(document).on("click","#roadNetwork-btn",function(){timeLine.roadNetworkLayer.getVisibility()?($(this).removeClass("active"),timeLine.roadNetworkLayer.setVisibility(!1)):($(this).addClass("active"),timeLine.roadNetworkLayer.setVisibility(!0))}),$(document).on("click","#baseMapSelect-list li",function(){var e=$(this);if(e.hasClass("active"))return!1;$("#baseMapSelect-list .active").removeClass("active"),e.addClass("active"),timeLine.baseMapLayer.map(function(e){e.setVisibility(!1)});var i=Number(e.attr("data-index"));if(timeLine.baseMapLayer[i].setVisibility(!0),timeLine.currentBaseLayer=timeLine.baseMapLayer[i],e.parent().hide(),timeLine.contrastDataArray.length>0)for(var t=e.attr("data-timelineid"),a=0;a<timeLine.contrastDataArray.length;a++)t==timeLine.contrastDataArray[a].timelineid&&(timeLine.contrastDataArray[a].baseMapId=e.attr("data-id"))}),$(document).on("click","#quitFullScreen",function(){window.history.back(-1)})}}}();index.init();