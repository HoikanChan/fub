function myWrapper(){var e={delay:1e3,easing:"linear",items:1,duration:.07,timeoutDuration:0,pauseOnHover:"immediate"};$("#ticker-1").carouFredSel&&($("#ticker-1").carouFredSel({width:1e3,align:!1,items:{width:"variable",height:35,visible:1},scroll:e}),$(".caroufredsel_wrapper").css("width","100%"))}function getParam(){var e=window.location.search,t=new Object;if(-1!=e.indexOf("?"))for(var r=e.substr(1),n=r.split("&"),i=0;i<n.length;i++)t[n[i].split("=")[0]]=decodeURI(n[i].split("=")[1]);return t}function showLocale(e){var t,r=e.getYear();r<1900&&(r+=1900);var n=e.getMonth()+1;n<10&&(n="0"+n);var i=e.getDate();i<10&&(i="0"+i);var o=e.getHours();o<10&&(o="0"+o);var a=e.getMinutes();a<10&&(a="0"+a);var s=e.getSeconds();s<10&&(s="0"+s);var c=e.getDay();return 0==c&&(t='<font color="#fcff01">'),c>0&&c<6&&(t='<font color="#fcff01">'),6==c&&(t='<font color="#fcff01">'),0==c&&(c="星期日"),1==c&&(c="星期一"),2==c&&(c="星期二"),3==c&&(c="星期三"),4==c&&(c="星期四"),5==c&&(c="星期五"),6==c&&(c="星期六"),"</font>",t+r+"-"+n+"-"+i+"&nbsp;"+o+":"+a}function tick(){var e=new Date,t=document.getElementById("localtime");null!=t&&(t.innerHTML=showLocale(e)),window.setTimeout("tick()",1e3)}var url=api.host;$(function(){myWrapper(),tick()});var getLocalTime=function(e){return new Date(parseInt(e)).format("yyyy-MM-dd hh:mm:ss")};Date.prototype.format=function(e){var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S+":this.getMilliseconds()};/(y+)/i.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var r in t)new RegExp("("+r+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?t[r]:("00"+t[r]).substr((""+t[r]).length)));return e};