function getreLineOption(t){return option={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{top:"top",right:"left",textStyle:{color:["#90b0c7"],fontSize:10},data:t.legendData},grid:{left:"0%",right:"0%",bottom:"3%",top:"40px",containLabel:!0},xAxis:[{type:"category",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!1},data:t.yData}],yAxis:[{name:"单位："+t.yunit,nameTextStyle:{color:"#60d1cd",fontSize:10},nameGap:5,type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!1}}],color:["#c2be15","#daa1e6","#0e9ae7"],series:function(){for(var e=[],a=t.xData,o=0;o<a.length;o++){var i={name:a[o].name,type:"bar",data:a[o].list};e.push(i)}return e}()},option}var disasterArea=function(t){if(t&&""!=t&&null!=t){var e=getReobj(t),a=echarts.init(document.getElementById(t.boxNum));switch(t.boxNum){case"0702":$("#disAreaId").text(t.title),a.setOption(getreBarOption(e));break;case"0704":$("#area0704").text(t.title),a.setOption(getreLineOption(e));break;case"0703":$("#area0703").text(t.title),a.setOption(getOverYearsOption(e))}}},getReobj=function(t){var e=new Object,a=[],o=[],i=[],n={};$.each(t.data,function(t,e){i.push(e.name);var a=e.data,r=[];o=[];for(var l=0;l<a.length;l++)o.push(a[l].name),r.push(a[l].value);n[e.name]=r});for(var r in n){var l={};l.name=r,l.list=n[r],a.push(l)}return e.xData=a,e.yData=o,e.legendData=i,e.yunit=t.yunit,e},getreBarOption=function(t){return option={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{top:"top",right:"left",textStyle:{color:["#90b0c7"],fontSize:10},data:t.legendData},grid:{left:"0%",right:"0%",bottom:"3%",top:"40px",containLabel:!0},xAxis:[{type:"category",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!1},data:t.yData}],yAxis:[{name:"单位："+t.yunit,nameTextStyle:{color:"#60d1cd",fontSize:10},nameGap:5,type:"value",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!1}}],color:["#c2be15","#daa1e6","#0e9ae7"],series:function(){for(var e=[],a=t.xData,o=0;o<a.length;o++){var i={name:a[o].name,type:"bar",data:a[o].list};e.push(i)}return e}()},option},getOverYearsOption=function(t){return{tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{top:"top",textStyle:{color:["#8ebdd1"],fontSize:10},orient:"horizontal",itemWidth:20,itemHeight:10,left:"right",data:t.legendData},grid:{left:"0",right:"4%",bottom:"0%",top:"40px",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},splitLine:{show:!0,lineStyle:{color:"#409ce5"}},data:t.yData}],yAxis:[{name:"单位："+t.yunit,nameTextStyle:{color:"#60d1cd",fontSize:10},nameGap:5,type:"value",left:"right",axisLabel:{textStyle:{color:"#60d1cd",fontSize:10}},axisLine:{show:!0,lineStyle:{color:"#409ce5"}}}],color:["#dae30b","#0e9ae7","#daa1e6"],series:function(){for(var e=[],a=t.xData,o=0;o<a.length;o++){var i={name:a[o].name,type:"line",stack:"总量",areaStyle:{normal:{}},smooth:!0,data:a[o].list};e.push(i)}return e}()}};