var farmlandFun=function(t){if(t&&""!=t&&null!=t)switch(t.boxNum){case"0501":$("#numberTitle").text(t.title),$("#numUnit").text(t.yunit),$("#totalNumber").text(getNumber(t));break;case"0502":$("#yeild1Title").text(t.title);var e=getObj(t);e.xunit=t.xunit,e.yunit=t.yunit;var a=echarts.init(document.getElementById("Zh_yield1"));a.setOption(getLineOption(e));break;case"0503":"数量"==t.subtitle?(numData=t,barChartInit(t)):areaData=t;break;case"0504":$("#areaTitle").text(t.title),$("#areaUnit").text(t.yunit),$("#areaNum").text(getNumber(t));break;case"0505":$("#yeildTitle").text(t.title);var e=getObj(t);e.xunit=t.xunit,e.yunit=t.yunit;var a=echarts.init(document.getElementById("Zh_yeild"));a.setOption(getLineOption(e))}},changeBar=function(t){if(t)switch(t){case"num":barChartInit(numData);break;case"area":barChartInit(areaData)}},barChartInit=function(t){$("#zhTitle").text(t.title);var e=getBarObj(t);e.xunit=t.xunit,e.yunit=t.yunit,echarts.init(document.getElementById("Total_zh")).setOption(getComparedBarOption(e))},getNumber=function(t){var e="";return $.each(t.data,function(t,a){$.each(a.data,function(t,a){e=a.value})}),e};