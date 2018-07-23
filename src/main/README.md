


##  插件
echarts.min.js---是定制的包含柱状图、折线图、直角坐标系、和标题、图例、提示框、标注组件
页码---jquery-ajax-pager用于特殊的表格表单
模块的加载loding显示---common.js showLoad();
弹窗显示
 new AlertWindow({
        type: "",       // 弹窗按钮类型  1.confirm 2.alert 3.none
        title:"提示", 
        msg: "",
        width:400,
        height:'',
        isDraging:false,           //是否可以拖动
        hasMask:true,             //是否显示遮罩
        okText:"确认",             //是否显示遮罩
        closeText:"取消",             //是否显示遮罩
        callback: function () {},   //点击确认按钮执行的回调函数
        closeCallback: function () {}   //点击确认按钮执行的回调函数
});
表单验证---validate
datetimepicker---jquery-ui
数学公式 -- KaTeX 语法https://khan.github.io/KaTeX/function-support.html
模态窗 -- https://github.com/VodkaBears/Remodal#remodal
消息提醒
toastr.options = {  
        closeButton: false,  
        debug: false,  
        progressBar: true,  
        positionClass: "toast-bottom-center",  
        onclick: null,  
        showDuration: "300",  
        hideDuration: "1000",  
        timeOut: "2000",  
        extendedTimeOut: "1000",  
        showEasing: "swing",  
        hideEasing: "linear",  
        showMethod: "fadeIn",  
        hideMethod: "fadeOut"  
    };  

## 模块开发封装

````
var proInfo = function () {
    var tableOp = {
    <!--配置-->
    }; 
    return {
        proTable: new TableData.init(tableOp),
        <!--公共变量-->
        init: function () { 
        <!--初始化方法-->
        }
    }
}();
<!--模板初始化-->
proInfo.init();

## JS模板引擎

公共部分用模板include引入
预编译的标识符为{{ }}
ajax请求后编译用{% %}

##时间转换
'yyy-MM-dd hh:mm'
'yyy-MM-dd'
'yyy/MM/dd hh:mm'
'yyy/MM/dd'
'yyy.MM.dd hh:mm'（默认）
'yyy.MM.dd'
'yyy年MM月dd日 hh:mm'
'yyy年MM月dd日'

##链接跳转
<a href="/IL/index"></a>

##url(后缀不需要添加.html)
http://localhost:3000/IL/index

##打包命令
gulp cleanHashAndHttl （删除打包目录下的哈希值文件和httl）
gulp buildHtml （把子模板引入生成完整的html）
gulp prettify （压缩html和合并文件）
gulp revCss （生成哈希值和压缩）
gulp revJs （生成哈希值和压缩）
gulp revHtml （把生成好哈希值的js和css更改其在html上的名字）
<!-- gulp plugins （把插件引入到打包目录下） -->
gulp minImg (压缩图片)
gulp renameHttl  （将html更改为httl）
gulp replaceGlobalVar （更改全局变量）
gulp cleanWithoutHash（删除没有哈希值的js和css）

##启动服务
gulp --watch