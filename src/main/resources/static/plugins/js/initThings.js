function initThing(){var t=new Date,e=t.getYear();e<1900&&(e+=1900),equipmentQuantity("1"),equipmentQuantity("0"),comparison(e-1)}function equipmentQuantity(t){$.ajax({url:url+"rest/getEqustatistics",async:!1,type:"post",data:{code:adminCode,total:t},dataType:"json",success:function(e){if(e.success){var a=JSON.parse(e.obj);if("1"==t&&$.each(a.List,function(t,e){switch(e.type){case"0":$("#equipmentNum").text(e.sum);break;case"1":$("#cameraNum").text(e.sum);break;default:console.log("")}}),"0"==t){equipmentData=[],cameraData=[],$.each(a.List,function(t,e){switch(e.type){case"0":equipmentData.push(e);break;case"1":cameraData.push(e);break;default:console.log("")}});var n=echarts.init(document.getElementById("Zh_yield1")),i=getObjData(cameraData,"摄像头");i.yunit="个",n.setOption(getThingLineOption(i));var s=echarts.init(document.getElementById("Zh_yeild")),u=getObjData(equipmentData,"物联网设备");u.yunit="个",s.setOption(getThingLineOption(u))}}}})}function comparison(t){$.ajax({url:url+"rest/getEqustatisticsByYear",async:!1,type:"post",data:{code:adminCode,year:t},dataType:"json",success:function(t){if(t.success){var e=JSON.parse(t.obj);console.log(e);var a=new Object,n=[],i=[],s=[],u={},c={};$.each(e.List,function(t,e){"1"==e.type?(n.push(e.region_name),u[e.region_name]=e.sum):"0"==e.type&&(c[e.region_name]=e.sum)}),n&&0!=n.length&&$.each(n,function(t,e){u.hasOwnProperty(e)?i.push(u[e]):i.push(0),c.hasOwnProperty(e)?s.push(c[e]):s.push(0)}),a.xData=n,a.cameraData=i,a.equipmentData=s,a.yunit="个";echarts.init(document.getElementById("Total_zh")).setOption(getThingBarOption(a))}}})}