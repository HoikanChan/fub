function quarterlyFun(t){if(t&&""!=t&&null!=t){objectData=t,$("#quarterTitle").text(t.title);var a,e;$.each(t.data,function(t,e){a=[],$.each(e.data,function(t,e){a.push(e.name)})});var n="";$("#selectQuarterly").empty();for(var l=0;l<a.length;l++)0==l?(e=a[l],n+='<option value="'+a[l]+'" selected>'+a[l]+"</option>"):n+='<option value="'+a[l]+'">'+a[l]+"</option>";$("#selectQuarterly").append(n),makeContent(t,e)}}function makeContent(t,a){var e={};$.each(t.data,function(t,n){$.each(n.data,function(t,l){a==l.name&&(e[n.name]=l.value)})}),console.log(e);var n="";$("#selectContent").empty();var l=1;for(var o in e){var i=0;parseFloat(e[o])&&(i=100*parseFloat(e[o])),n+='<div class="marNO"><div class="clearfix"><div class="pull-left">'+o+'</div><div class="pull-right">'+i+'%</div></div><div class="progress"><div class="progress-bar bar_'+l+'" style="width:'+i+'%"></div></div></div>',l+=1}$("#selectContent").append(n)}var objectData=new Object;$(function(){$(".filter-box1").selectFilter({callBack:function(t){makeContent(objectData,t)}})});