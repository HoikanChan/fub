var myEcharts,growingFun=function(t){if(t&&null!=t&&""!=t)switch(t.boxNum){case"0301":vegetationFun(t);break;case"0304":partitionFun(t)}},vegetationFun=function(t){$("#veg").text(t.title),null!=myEcharts&&""!=myEcharts&&void 0!=myEcharts&&myEcharts.dispose(),myEcharts=echarts.init(document.getElementById("shuiqiu"));var a=[];$.each(t.data,function(t,i){$.each(i.data,function(t,i){a.push(i.value)})}),a.sort(sortDown);var i={series:[{type:"liquidFill",radius:"80%",data:a,label:{normal:{textStyle:{fontSize:16}}}}]};myEcharts.setOption(i)},partitionFun=function(t){$("#partitionTitle").text(t.title);var a="";$("#partitionContent").empty(),$.each(t.data,function(t,i){$.each(i.data,function(t,i){var e=0,n="bar_3";parseFloat(i.value)&&(e=100*parseFloat(i.value)),e>=80?n="bar_2":70<=e<80&&(n="bar_1"),a+='<div><div class="clearfix"><div class="pull-left">'+i.name+'</div><div class="pull-right">'+e+'%</div></div><div class="progress"><div class="progress-bar '+n+'" style="width:'+e+'%"></div></div></div>'})}),$("#partitionContent").append(a)},sortDown=function(t,a){return a-t};