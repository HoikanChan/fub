/*
* @Author: anchen
* @Date:   2017-06-15 09:30:49
* @Last Modified by:   anchen
* @Last Modified time: 2018-05-28 17:04:14
*/

;'use strict';
var userMobile;
var winH = $(window).outerHeight();
var winW = $(window).outerWidth();
/** 
 *  获取导航栏参数
 *  @param
 *  name参数名称
 *  useEncode 是否转义
*/
$.getUrlParam = function (name, useEncode) {
    var api = useEncode ? decodeURIComponent : unescape;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return api(r[2]);
    } else {
        return null;
    }
};

function makeYear() {
	var year = $(".footer-bottom-info .year");
	var my = new Date();
	var endYear = my.getFullYear();// 获取当前年份
	year.text(endYear);
}

/**
 *
 * @param phone
 *            检查手机号码格式
 * @returns {Boolean} 如果正确返回true,不正确返回false
 */
function checkPhone(phone) {
	var yidong = /^[1]{1}[0-9]{10}$/;
	var liantong = /^[1]{1}[0-9]{10}$/;
	var dianxin = /^[1]{1}[0-9]{10}$/;
	/*var yidong = /^[1]{1}(([3]{1}[4-9]{1})|([5]{1}[012789]{1})|([8]{1}[2378]{1})|([4]{1}[7]{1}))[0-9]{8}$/;
	var liantong = /^[1]{1}(([3]{1}[0-2]{1})|([5]{1}[56]{1})|([8]{1}[56]{1}))[0-9]{8}$/;
	var dianxin = /^[1]{1}(([3]{1}[3]{1})|([5]{1}[3]{1})|([8]{1}[019]{1}))[0-9]{8}$/;*/
	if (!phone.match(yidong) && !phone.match(liantong) && !phone.match(dianxin)) {
		return false;
	} else {
		return true;
	}
}

// 

/*
*为数组对象增加删除方法
*/
Array.prototype.removeItem = function(val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}
/*
  *模板语法界定符修改
*/
template.defaults.rules[1].test = new RegExp(template.defaults.rules[1].test.source.replace('{{', '{%').replace('}}', '%}'));
//是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能，可对html代码输出
template.defaults.escape = false;
template.defaults.imports.log = console.log;
/*
 *  导航栏显隐
*/
; (function () {
   
    var pathName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1).replace(/.httl\S*/, "").replace(/.httl\S*/,"");
    switch (pathName){
        case 'login':       //登录
            $("#headerBar").html("").hide();
            break;
        case 'register':        //注册
            $("#headerBar").html("").hide();
            break;
        case '':        //首页
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .index').addClass('currentPage');
            break;
        case 'index':       //首页
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .index').addClass('currentPage');
            break;
        case 'satelliteImage':      //多源卫星
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .satelliteImage').addClass('currentPage');
            break;
        case 'infoProducts':      //信息产品
             $('#headerBar .currentPage').removeClass('currentPage');
             $('#headerBar .infomation').addClass('currentPage');
            break;
        case 'example':      //遥感监测范例
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .example').addClass('currentPage');
            break;
        case 'qualityAnalysis':      //遥感监测范例
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .example').addClass('currentPage');
            break;
        case 'userCenter':  //个人中心
            $('#headerBar .currentPage').removeClass('currentPage');
            $('#headerBar .userCenter').addClass('currentPage');
            break;
    }
    
} ());


window.stringFormat = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
        var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');

        str = str.replace(reg, arguments[i]);
    }

    return str;
};


/*
  *把年月日转换成时间戳
*/
function timesTamp(date) {
        if (date) {
                date = date.replace(/-/g, "/");
                return new Date(date).getTime();
        } else {
                return ""
        }
};

/*
  *模板过滤器
*/
var conversionTime = function (data, format) {
    if (!data) {
        return
    }
    
    var date = new Date(data);  //获取的data是时间是格式 2018-12-10 12：12：00
   // var date = new Date(parseInt(data)); //获取的data是时间截
    var year = date.getFullYear();
    var month = (date.getMonth() + 1)<10?"0"+(date.getMonth() + 1):date.getMonth() + 1;
    var day = date.getDate()<10?"0"+date.getDate():date.getDate();
    var hours = date.getHours()<10?"0"+date.getHours():date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds();
    !format ? format = 'yyyy.MM.dd hh:mm:ss' : format;
    var n;
  
    switch (format) {
        case 'yyyy':
        n = year;
        break;
    case 'MM':
        n = month;
        break;
    case 'dd':
        n = day;
        break;
    case 'yyyy-MM-dd hh:mm:ss':
        n = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes +':' + seconds;
        break;
    case 'yyyy-MM-dd':
        n = year + '-' + month + '-' + day;
        break;
    case 'yyyy-MM':
        n = year + '-' + month;
            break;
    case "yyyy/MM/dd hh:mm:ss":
        n = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            break;
    case 'yyyy/MM/dd hh:mm':
        n = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
        break;
    case 'yyyy/MM':
        n = year + '/' + month;
        break;
    case 'yyyy/MM/dd':
        n = year + '/' + month + '/' + day;
        break;
    case 'yyyy.MM':
        n = year + '.' + month;
        break;
    case 'yyyy.MM.dd hh:mm':
        n = year + '.' + month + '.' + day + ' ' + hours + ':' + minutes;
        break;
    case 'yyyy.MM.dd':
        n = year + '.' + month + '.' + day;
        break;
    case 'yyyy年MM月dd日 hh:mm':
        n = year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes;
        break;
    case 'yyyy年MM月dd日':
        n = year + '年' + month + '月' + day+'日';
        break;

    };
    return n
};
template.defaults.imports.dateFormat = function (date, format) {
    return conversionTime(date,format)
};
template.defaults.imports.getDay = function (date, week) {
    var date = new Date(date);
    var currentDate = new Date();
    if (!week) {
        return (date.getMonth()+1)+'月'+date.getDate()+'日'
    } else {
        if (date.getMonth() == currentDate.getMonth() && date.getDate() == currentDate.getDate()) {
            return '今天'
         }
        switch (date.getDay()) {
            case 0:
                return '周日'
                break;
            case 1:
                return '周一'
                break;
            case 2:
                return '周二'
                break;
            case 3:
                return '周三'
                break;
            case 4:
                return '周四'
                break;
            case 5:
                return '周五'
                break;
            case 6:
                return '周六'
                break;

        }
    }
};
template.defaults.imports.getHours = function (date) {
    var date = new Date(date);
    return date.getHours();
};
//将字符串转换成对象
template.defaults.imports.beObj = function (data, exportData) {
    var a = JSON.parse(data);
    return a[exportData];
}
//截取字符串
template.defaults.imports.getSubSting = function (data) {
    return  data.substring(3);
};
//截取字符串100
template.defaults.imports.getSubStingLength = function (data) {
    return  data.substring(0,60);
};
/*
  *封装插件
*/
var App = function () {
    return {
        getGlobalImgPath: function () {
            return api.assetsPath + api.globalImgPath;
        },
        blockUI: function (options) {
            options = $.extend(true, {}, options);
            var html = '';
           if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.15 : 0.4,
                        cursor: 'wait'
                    }
                });
            }
        },
        // wrApper function to  un-block element(finish loading)
        unblockUI: function (target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        }
    }
} ();

/*
  *datatable配置
*/
if($.fn.dataTable!=undefined){
    //datatable默认设置
    $.extend($.fn.dataTable.defaults,{
        // "iDisplayLength" : 10,//默认每页数量
        info: false,
        lengthChange:false,
        serverSide:true,
        auto:false,
        lengthChange: false,//是否允许用户自定义显示数量
        "bPaginate": false, //翻页功能
        "bFilter": false, //列筛序功能
        "searching": false,//本地搜索
        "ordering": false, //排序功能
        "autoWidth":false,
    })
    $.extend($.fn.dataTable.defaults.oLanguage, {
        "oAria": {
            "sSortAscending": " - click/return to sort ascending",
            "sSortDescending": " - click/return to sort descending"
        },
        "sLengthMenu": "显示 _MENU_ 记录",
        "sZeroRecords": "对不起，查询不到任何相关数据",
        "sEmptyTable": "未有相关数据",
        "sLoadingRecords": "正在加载数据-请等待...",
        // "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
        "sInfo": "总记录数为 _TOTAL_，到第",
        "sInfoEmpty": "当前显示0到0条，共0条记录",
        "sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
        "sProcessing": "正在加载数据...",
        "sSearch": "模糊查询：",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": " 上一页 ",
            "sNext": " 下一页 ",
            "sLast": " 尾页 "
        }
    });
     $.fn.dataTable.ext.errMode = 'throw'
}

/**
 * 常用正则
 * */
var regexs = {
    account:/^(?!_)(?!.*?_$)(?![0-9]+$)[\u4e00-\u9fa5a-zA-Z0-9_]{4,16}$/, // 长度为4-16位(半角)，由字母、数字、下划线(不能以下划线开头、结尾)组合，区分大小写，不能为纯数字。
    // password: /^(?!_)(?!.*?_$)(?![0-9]+$)[\u4e00-\u9fa5a-zA-Z0-9_]{6,16}$/,
    password: /^(?!_)(?!.*?_$)(?![0-9]+$)[\u4e00-\u9fa5a-zA-Z0-9]{6,16}$/,
    mobile: /(^0{0,1}1[3|4|5|7|8][0-9]{9}$)/, // mobile 手机号码 包括13X 15X 18X 14X 17X号段
    chinese:/^[\u4e00-\u9fa5]+$/,    //中文
    email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ //邮箱
};



  /**
 * @param t            loading对象
 * @param zIndex         层级
 * @param msg      信息
 */
function showLoad(t, zIndex, msg) {
    App.blockUI({
        target: t,
        boxed: !0,
        zIndex: !zIndex ? 99999 : zIndex,
        message: msg || "加载中..."
    })
};

function hideLoad(t) {
    App.unblockUI(t)
};
/**
 *Ajax交互方法
 */
(function ($) {
 
    function Ajax(source, opts) {
        var self = this;
        var s = $(source);
        var t = s[0];
        var nodeName = t.nodeName;
        var data;
        var opts = $.extend({}, Ajax.DEFAULT, opts);
        if (nodeName && nodeName !== 'FORM') {
            throw "_Ajax方法只能FORM表单或者JS对象调用";
        }
        data = nodeName === 'FORM' ? decodeURIComponent(s.serialize(), true) : t;
        //特殊情况添加参数
        if (typeof data ==='object'&&opts.data) {
            data = $.extend(data,opts.data)
        } else if (typeof data === 'string' && opts.data) {
            var str = '';
            $.each(opts.data, function (i, v) {
                        str += i + '=' + v + '&';
            });
            str = str.substr(0, str.length - 1);
            data =data + '&' + str
        }
        data = this.getData(opts.contentType, data)
        this.jqAjax(opts, data)
    }

  

    Ajax.DEFAULT = {
        host: api.host, //服务器地址
        url: '', //请求的地址       (必填)
        data:null,
        type: 'GET', //请求的方法
        contentType: 'form', //请求的内容类型   (可选 'json' )
        dataType: 'json', //请求的内容类型   (可选 'json' )
        async: true, //是否异步
        xhrFields: {withCredentials: true},
        crossDomain: true,
        loadTarget: '', //loadding
        success: { //简单的请求       (如果传回掉函数，则和jQ用法一样)
            msg: null, //成功提示信息
            hide: null //需要关闭的静态框
        },
        error: function (data) { //失败回调函数
            toastr.error('请求没有成功');
        }
    };

    Ajax.prototype = {
        getData: function (contentType, d) {
            var data;
            if (contentType === 'json') {
                if (typeof d === 'string') {
                    var arr = d.split('&');
                    data = {};
                    $.each(arr, function (i, v) {
                        var arr = v.split('=');
                        data[arr[0]] = arr[1];
                    });
                    data = JSON.stringify(data);
                } else {
                    data = JSON.stringify(d);
                }
            } else {
                if (typeof d === 'object') {
                    var str = '';
                    $.each(d, function (i, v) {
                        str += i + '=' + v + '&';
                    });
                    str = str.substr(0, str.length - 1);
                    data = str
                } else {
                    data = d;
                }
            }
            return data;
        },
        jqAjax: function (opts, data) {
        
            var sFN, eFN;
            if (!opts.loadTarget) {
                opts.loadTarget = 'body';
            }
            opts.type = "POST";
            var contentType = opts.contentType;

            if (contentType === 'json') {
                contentType = 'application/json;charset=utf-8';
            } else {
                contentType = 'application/x-www-form-urlencoded;charset=utf-8';
            }
            if (typeof opts.success === 'function') {
                sFN = function (data) {
                    hideLoad(opts.loadTarget);
                    opts.success(data);
                }
            } else {
                sFN = function (data) {
                    hideLoad(opts.loadTarget);
                    if (data.code === 0) {
                        toastr.success(opts.success.msg);
                    } else {
                        toastr.error(data.message);
                    }
                }
            }
            eFN = function (data) {
                hideLoad(opts.loadTarget);
                opts.error(data);
            };
            showLoad(opts.loadTarget, '99999999999');
            var url = (opts.host ? opts.host : api.host) + opts.url;
            $.ajax({
                type: opts.type,
                url: url,
                data: data,
                contentType: contentType,
                dataType: opts.dataType,
                async: opts.async,
                xhrFields: {withCredentials: true},
                crossDomain: true,
                success: sFN,
                error: eFN
            })
        }
    };
    $.fn.extend({
        _Ajax: function (opts) {
            new Ajax(this, opts);
            return this;
        }
    });



})(jQuery);






// 转为unicode 编码
function encodeUnicode(str) {
    var res = [];
    for ( var i=0; i<str.length; i++ ) {
    res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    return "\\u" + res.join("\\u");
}

// 解码
function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}


 /**
 * 判断是否登录
 *@param boolean 是否在登录之后回调参数1 callback; true 回调
 **/

// function login() {  
//    var mobileNum= window.sessionStorage.getItem("mobile");
//    if(mobileNum){
//     $({mobile:mobileNum})._Ajax({
//         url: "user/queryByMobile",
//         success:function(result){
//             if (result.code == 0) {
//                if(result.user){ 
//                     $(".login-operating").hide();
//                     $(".user-operating").show();
//               }else{
//                    $(".login-operating").show();
//                    $(".user-operating").hide();
                    
//                }
                
//             }
//         }
//     })
// }
// }


function jumpTo(p, url) {
    var mobileItem=window.sessionStorage.getItem("mobile");
  
    if (mobileItem == undefined) {
    p.attr("href", api.host+"loginPage?legalLoan");
  } else {
    p.attr("href", url);
}
}
function infoJumpTo() { 
    var $info = $(".legaloan"); 
    jumpTo($info, api.host+"legalLoan"); 
 }
//获取url中参数值
 function GetRequest() {
    var url = decodeURI(window.location.search); //获取url中"?"符后的字串
 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var Request = new Object();
Request = GetRequest();


function checkLogin(callback, a, b, c, d, e) {
    var mobileNum= window.sessionStorage.getItem("mobile");
    if(mobileNum){
                callback(a,b,c,d,e);
                
            } else {
                $(".user-operating").hide();
                $(".login-operating").show();
                window.open(api.host+"loginPage");
               

            }
   

}

/**
 * 退出登录
 **/
$(document).on("click", ".user-operating .user-logout", function () {
    $({})._Ajax({
        url: "user/logout",
        success: function (result) {
            if (result.code == 0) {
                window.sessionStorage.clear();
                $(".user-operating").hide();
                $(".login-operating").show();
                top.location.reload();
                delCookie("rememberUser");
               
                var pathName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1).replace(/.httl\S*/, "").replace(/.httl\S*/,"");
                if (pathName == "legalLoan" || pathName == "lawerCenter" ) {
                     window.location = "index";
                }
            }
        }
    })
});
function getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]);  
    return null;  

} 

 


$(function(){
    makeYear();
 //   checkLogin()
 //$('.collapse').collapse()
 var username= window.sessionStorage.getItem("mobile");
 
 if(username===null){
    $(".login-operating").show();
    $(".user-operating").hide();
 }else{
    $(".login-operating").hide();
    $(".user-operating").show();
 }


    $(document).on("click",".viewDetail",function(){
        var viewD = $("#mainContent").offset().top;
        $("html,body").animate({scrollTop: viewD}, 1000);
    })

    // $(document).on("click",".legaloan",function(){
    //     checkLogin(function(){
    //         $(".legaloan").attr("href",api.link+"legalLoan");
    //     });
   
    // })
   
   
})




function change_main_current_class(indexPage) {
	if ("undefined" == typeof indexPage) {
		return;
	}
	var obj = $(".index-name");

	switch (indexPage){
		case 0 :indexPage=0;;break;
		case 1 :indexPage=1;;break;
		case 2 :indexPage=2;;break;
		case 3 :indexPage=3;;break;
		case 4 :indexPage=4;;break;
		default :indexPage=100;
	}
	$(obj[indexPage]).addClass("active");
}



