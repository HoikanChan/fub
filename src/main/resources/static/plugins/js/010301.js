var swiper=new Swiper(".swiper-container",{pagination:".swiper-pagination",slidesPerView:3,paginationClickable:!0,spaceBetween:10,nextButton:".swiper-button-next",prevButton:".swiper-button-prev",freeMode:!0});$(".swiper-wrapper>.swiper-slide").click(function(){$(this).addClass("active_yg").siblings().removeClass("active_yg");var e=$(this).index();$(".con_main>.con").eq(e).show().siblings(".con_main>.con").hide()}),$(".Tab_ div").click(function(){$(this).addClass("active_sj").siblings().removeClass("active_sj")});var myChart=echarts.init(document.getElementById("Zh_yeild")),option={tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{top:"2px",textStyle:{color:["#8ebdd1"],fontSize:7},orient:"horizontal",itemWidth:10,itemHeight:10,left:"right",data:["新增","在建","拆除"]},grid:{left:"2%",right:"4%",bottom:"0%",top:"30px",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}},data:["1","2","3","4","5","6月"]}],yAxis:[{type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}}}],series:[{name:"在建",type:"line",color:["#dae30b"],areaStyle:{normal:{}},smooth:!0,data:[20,132,101,34,90,30]},{name:"新增",type:"line",color:["#0e9ae7"],smooth:!0,areaStyle:{normal:{}},data:[20,82,91,234,90,30]},{name:"拆除",type:"line",color:["#daa1e6"],smooth:!0,areaStyle:{normal:{}},data:[50,32,21,154,90,30]}]};myChart.setOption(option);var myChart=echarts.init(document.getElementById("Zh_yield1")),option={tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{top:"2px",textStyle:{color:["#8ebdd1"],fontSize:7},orient:"horizontal",itemWidth:10,itemHeight:10,left:"right",data:["新增","在建","拆除"]},grid:{left:"2%",right:"4%",bottom:"0%",top:"30px",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}},data:["1","2","3","4","5","6月"]}],yAxis:[{type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}}}],series:[{name:"在建",type:"line",color:["#dae30b"],areaStyle:{normal:{}},smooth:!0,data:[20,132,101,34,90,30]},{name:"新增",type:"line",color:["#0e9ae7"],smooth:!0,areaStyle:{normal:{}},data:[20,82,91,234,90,30]},{name:"拆除",type:"line",color:["#daa1e6"],smooth:!0,areaStyle:{normal:{}},data:[50,32,21,154,90,30]}]};myChart.setOption(option);var myChart=echarts.init(document.getElementById("Zh_1")),option={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{top:"top",right:"left",textStyle:{color:["#90b0c7"],fontSize:8},itemWidth:20,itemHeight:10,data:["新增","在建","拆除"]},grid:{left:"2%",right:"2%",bottom:"3%",top:"30px",containLabel:!0},xAxis:[{type:"category",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}},data:["鸡冠区","恒山区","滴道区","梨树区","乘盒子区","虎林市","密山市"]}],yAxis:[{type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}}}],series:[{name:"新增",type:"bar",barWidth:"6px",color:["#0e9ae7"],data:[220,182,191,234,290,330,310]},{name:"在建",type:"bar",barWidth:"6px",color:["#c2be15"],data:[320,332,301,334,390,310,320]},{name:"拆除",type:"bar",barWidth:"6px",color:["#daa1e6"],data:[120,132,101,134,90,230,210]}]};myChart.setOption(option);var myChart=echarts.init(document.getElementById("Zh_")),option={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{top:"top",right:"left",textStyle:{color:["#90b0c7"],fontSize:8},itemWidth:20,itemHeight:10,data:["新增","在建","拆除"]},grid:{left:"2%",right:"2%",bottom:"3%",top:"30px",containLabel:!0},xAxis:[{type:"category",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}},data:["鸡冠区","恒山区","滴道区","梨树区","乘盒子区","虎林市","密山市"]}],yAxis:[{type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}}}],series:[{name:"新增",type:"bar",barWidth:"6px",color:["#0e9ae7"],data:[220,182,191,234,290,330,310]},{name:"在建",type:"bar",barWidth:"6px",color:["#c2be15"],data:[320,332,301,334,390,310,320]},{name:"拆除",type:"bar",barWidth:"6px",color:["#daa1e6"],data:[120,132,101,134,90,230,210]}]};myChart.setOption(option);