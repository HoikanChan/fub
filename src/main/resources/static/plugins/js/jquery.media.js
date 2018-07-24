!function(a){"use strict";function e(){var e="";for(var t in a.fn.media.defaults.players)e.length&&(e+=","),e+=a.fn.media.defaults.players[t].types;return new RegExp("\\.("+e.replace(/,/gi,"|")+")\\b")}function t(a){return function(e,t){return s(e,t,a)}}function i(a){return"0123456789".indexOf(a)>-1}function r(e,t){t=t||{};var i,r,s=a(e),n=e.className||"",l=a.metadata?s.metadata():a.meta?s.data():{};l=l||{};var o=l.width||parseInt((n.match(/\bw:(\d+)/)||[])[1]||0,10)||parseInt((n.match(/\bwidth:(\d+)/)||[])[1]||0,10),p=l.height||parseInt((n.match(/\bh:(\d+)/)||[])[1]||0,10)||parseInt((n.match(/\bheight:(\d+)/)||[])[1]||0,10);o&&(l.width=o),p&&(l.height=p),n&&(l.cls=n);for(var d=0;d<e.attributes.length;d++){i=e.attributes[d],r=a.trim(i.name);0===r.indexOf("data-")&&(r=r.substring("data-".length),l[r]=i.value)}i=a.fn.media.defaults;var m=t,f=l,h={params:{bgColor:t.bgColor||a.fn.media.defaults.bgColor}},c=a.extend({},i,m,f);return a.each(["attrs","params","flashvars","silverlight"],function(e,t){c[t]=a.extend({},h[t]||{},i[t]||{},m[t]||{},f[t]||{})}),void 0===c.caption&&(c.caption=s.text()),c.src=c.src||s.attr("href")||s.attr("src")||"unknown",c}function s(e,t,i){var r,s,n,p=a(e),d=a.fn.media.defaults.players[i];if("iframe"==i)d=a('<iframe width="'+t.width+'" height="'+t.height+'" >'),d.attr("src",t.src),d.css("backgroundColor",d.bgColor);else if("img"==i)d=a("<img>"),d.attr("src",t.src),t.width&&d.attr("width",t.width),t.height&&d.attr("height",t.height),d.css("backgroundColor",d.bgColor);else if(o){r=['<object width="'+t.width+'" height="'+t.height+'" '];for(s in t.attrs)r.push(s+'="'+t.attrs[s]+'" ');for(s in d.ieAttrs||{})n=d.ieAttrs[s],"codebase"==s&&"https:"==window.location.protocol&&(n=n.replace("http","https")),r.push(s+'="'+n+'" ');r.push("></object>");var m=['<param name="'+(d.oUrl||"src")+'" value="'+t.src+'">'];for(s in t.params)m.push('<param name="'+s+'" value="'+t.params[s]+'">');d=document.createElement(r.join(""));for(var f=0;f<m.length;f++)d.appendChild(document.createElement(m[f]))}else if(t.standards){if(r=['<object type="'+d.mimetype+'" width="'+t.width+'" height="'+t.height+'"'],t.src&&r.push(' data="'+t.src+'" '),l)for(s in d.ieAttrs||{})n=d.ieAttrs[s],"codebase"==s&&"https:"==window.location.protocol&&(n=n.replace("http","https")),r.push(s+'="'+n+'" ');r.push(">"),r.push('<param name="'+(d.oUrl||"src")+'" value="'+t.src+'">');for(s in t.params)"wmode"==s&&"flash"!=i||r.push('<param name="'+s+'" value="'+t.params[s]+'">');r.push("<div><p><strong>"+d.title+" Required</strong></p><p>"+d.title+' is required to view this media. <a href="'+d.pluginspage+'">Download Here</a>.</p></div>'),r.push("</object>")}else{r=['<embed width="'+t.width+'" height="'+t.height+'" style="display:block"'],t.src&&r.push(' src="'+t.src+'" ');for(s in t.attrs)r.push(s+'="'+t.attrs[s]+'" ');for(s in d.eAttrs||{})r.push(s+'="'+d.eAttrs[s]+'" ');for(s in t.params)"wmode"==s&&"flash"!=i||r.push(s+'="'+t.params[s]+'" ');r.push("></embed>")}var h=e.id?' id="'+e.id+'"':"",c=t.cls?' class="'+t.cls+'"':"",u=a("<div"+h+c+">");return p.after(u).remove(),o||"iframe"==i||"img"==i?u.append(d):u.html(r.join("")),t.caption&&a("<div>").appendTo(u).html(t.caption),u}var n=document.documentMode||0,l=/MSIE/.test(navigator.userAgent),o=l&&(/MSIE (6|7|8)\.0/.test(navigator.userAgent)||n<9);a.fn.media=function(t,s,n){return"undo"==t?this.each(function(){var e=a(this),t=e.data("media.origHTML");t&&e.replaceWith(t)}):this.each(function(){"function"==typeof t&&(n=s,s=t,t={});var l=r(this,t);"function"==typeof s&&s(this,l);var o,p=e(),d=p.exec(l.src.toLowerCase())||[""];l.type?d[0]=l.type:d.shift();for(var m=0;m<d.length;m++)if(o=d[m].toLowerCase(),i(o[0])&&(o="fn"+o),a.fn.media[o]){var f=a.fn.media[o+"_player"];if(l.params||(l.params={}),f){var h="autostart"==f.autoplayAttr;l.params[f.autoplayAttr||"autoplay"]=h?l.autoplay?1:0:!!l.autoplay}var c=a.fn.media[o](this,l);if(c.css("backgroundColor",l.bgColor).width(l.width),l.canUndo){var u=a("<div></div>").append(this);c.data("media.origHTML",u.html())}"function"==typeof n&&n(this,c[0],l,f.name);break}})},a.fn.media.mapFormat=function(e,t){e&&t&&a.fn.media.defaults.players[t]&&(e=e.toLowerCase(),i(e[0])&&(e="fn"+e),a.fn.media[e]=a.fn.media[t],a.fn.media[e+"_player"]=a.fn.media.defaults.players[t])},a.fn.media.defaults={standards:!0,canUndo:!0,width:400,height:400,autoplay:0,bgColor:"#ffffff",params:{wmode:"transparent"},attrs:{},flvKeyName:"file",flashvars:{},flashVersion:"7",expressInstaller:null,flvPlayer:"mediaplayer.swf",mp3Player:"mediaplayer.swf",silverlight:{inplaceInstallPrompt:"true",isWindowless:"true",framerate:"24",version:"0.9",onError:null,onLoad:null,initParams:null,userContext:null}},a.fn.media.defaults.players={flash:{name:"flash",title:"Flash",types:"flv,mp3,swf",mimetype:"application/x-shockwave-flash",pluginspage:"http://www.adobe.com/go/getflashplayer",ieAttrs:{classid:"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",type:"application/x-oleobject",codebase:"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="+a.fn.media.defaults.flashVersion}},quicktime:{name:"quicktime",title:"QuickTime",mimetype:"video/quicktime",pluginspage:"http://www.apple.com/quicktime/download/",types:"aif,aiff,aac,au,bmp,gsm,mov,mid,midi,mpg,mpeg,mp4,m4a,psd,qt,qtif,qif,qti,snd,tif,tiff,wav,3g2,3gp",ieAttrs:{classid:"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",codebase:"http://www.apple.com/qtactivex/qtplugin.cab"}},realplayer:{name:"real",title:"RealPlayer",types:"ra,ram,rm,rpm,rv,smi,smil",mimetype:"audio/x-pn-realaudio-plugin",pluginspage:"http://www.real.com/player/",autoplayAttr:"autostart",ieAttrs:{classid:"clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"}},winmedia:{name:"winmedia",title:"Windows Media",types:"asx,asf,avi,wma,wmv",mimetype:function(){for(var a=navigator.plugins||[],e=0;e<a.length;e++){if("np-mswmp.dll"==a[e].filename)return!0}return!1}()?"application/x-ms-wmp":"application/x-mplayer2",pluginspage:"http://www.microsoft.com/Windows/MediaPlayer/",autoplayAttr:"autostart",oUrl:"url",ieAttrs:{classid:"clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6",type:"application/x-oleobject"}},img:{name:"img",title:"Image",types:"gif,png,jpg"},iframe:{name:"iframe",types:"html,pdf"},silverlight:{name:"silverlight",types:"xaml"}};var p=1;for(var d in a.fn.media.defaults.players){var m=a.fn.media.defaults.players[d].types;a.each(m.split(","),function(e,r){i(r[0])&&(r="fn"+r),a.fn.media[r]=a.fn.media[d]=t(d),a.fn.media[r+"_player"]=a.fn.media.defaults.players[d]})}a.fn.media.swf=function(e,t){var i,r;if(!window.SWFObject&&!window.swfobject){if(t.flashvars){var n=[];for(i in t.flashvars)n.push(i+"="+t.flashvars[i]);t.params||(t.params={}),t.params.flashvars=n.join("&")}return s(e,t,"flash")}var l=e.id?' id="'+e.id+'"':"",o=t.cls?' class="'+t.cls+'"':"",d=a("<div"+l+o+">");if(window.swfobject)a(e).after(d).appendTo(d),e.id||(e.id="movie_player_"+p++),window.swfobject.embedSWF(t.src,e.id,t.width,t.height,t.flashVersion,t.expressInstaller,t.flashvars,t.params,t.attrs);else{a(e).after(d).remove();var m=new SWFObject(t.src,"movie_player_"+p++,t.width,t.height,t.flashVersion,t.bgColor);t.expressInstaller&&m.useExpressInstall(t.expressInstaller);for(r in t.params)"bgColor"!=r&&m.addParam(r,t.params[r]);for(i in t.flashvars)m.addVariable(i,t.flashvars[i]);m.write(d[0])}return t.caption&&a("<div>").appendTo(d).html(t.caption),d},a.fn.media.flv=a.fn.media.mp3=function(e,t){var i=t.src,r=/\.mp3\b/i.test(i)?t.mp3Player:t.flvPlayer,s=t.flvKeyName;i=encodeURIComponent(i),t.src=r,t.src=t.src+"?"+s+"="+i;var n={};return n[s]=i,t.flashvars=a.extend({},n,t.flashvars),a.fn.media.swf(e,t)},a.fn.media.xaml=function(e,t){if(!window.Sys||!window.Sys.Silverlight){if(a.fn.media.xaml.warning)return;return a.fn.media.xaml.warning=1,void alert("You must include the Silverlight.js script.")}var i={width:t.width,height:t.height,background:t.bgColor,inplaceInstallPrompt:t.silverlight.inplaceInstallPrompt,isWindowless:t.silverlight.isWindowless,framerate:t.silverlight.framerate,version:t.silverlight.version},r={onError:t.silverlight.onError,onLoad:t.silverlight.onLoad},s=e.id?' id="'+e.id+'"':"",n=t.id||"AG"+p++,l=t.cls?' class="'+t.cls+'"':"",o=a("<div"+s+l+">");return a(e).after(o).remove(),Sys.Silverlight.createObjectEx({source:t.src,initParams:t.silverlight.initParams,userContext:t.silverlight.userContext,id:n,parentElement:o[0],properties:i,events:r}),t.caption&&a("<div>").appendTo(o).html(t.caption),o}}(jQuery);