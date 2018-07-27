;(function(){
	var self ;
	var close = function(){};
	var confirm = function(){};
	var closeIcon = function(){};
	function AlertWindow(options){
		self = this;
		this.options = $.extend({},AlertWindow.DEFAULT,options);
		this.dragingFlag = false;          //拖拽开关
		this.moveX = 0;                    //鼠标距离弹层的距离
		this.moveY = 0;

		this.appendAdw(this.options.hasMask);         //生成弹层
		this.appendBtn(this.options.type);            //添加按钮
		this.setAwPosition();                         //设置居中
		this.setTitleCursor(this.options.isDraging);  //设置拖动状态下标题的鼠标样式
		if( this.options.isDraging ){                 //如果可以拖拽
			$('.aw-title').on("mousedown",function(e){ //鼠标按下
				self.moveDown(e);
			});

			$(document).on("mousemove",function(e){   //移动
				self.moveBox(e);
			});

			$(document).on("mouseup",function(e){     //鼠标松开
				self.moveUp();
			});			
	    }
		$(window).resize(function(event) {
			self.setAwPosition();
		});
		closeIcon = function(){
			if( typeof self.options.closeCallback === 'function' ){
				self.closeAw();
			}
		};
		close = function(){
			if( typeof self.options.closeCallback === 'function' ){
				self.closeAw();
				self.options.closeCallback();
			}
		};
		confirm=function(){
			if( typeof self.options.callback === 'function' ){
				self.closeAw();
				self.options.callback();
			}

		}
	}

	//关闭弹出层
	$(document).on('click','#alert-window .modal-close-btn',function(){
		//确定按钮
		close();
	});

	//关闭弹出层
	$(document).on('click','#alert-window .aw-close',function(){
		//关闭按钮
		closeIcon();
	});
	//确定按钮
	$(document).on('click','#alert-window .modal-confirm-btn',function(){
		confirm();
	});
	//点击mask
	$(document).on('click','#mask',function(){
		//关闭按钮
		closeIcon();
	});
	AlertWindow.DEFAULT = {
			el:"",                     //用html文档作为弹窗内容
			width: 400,                 //宽度
			title:"",          //标题
			msg: "",                   //简单的提示文字	
			height:"",
			theme:"",          //主题(依赖bootstrap) 1.primary 2.success 3.info 4.warning 5.danger
			type:"confirm",           //弹窗按钮类型  1.confirm 2.alert 3.none
			isDraging:false,           //是否可以拖动
			hasMask:true,             //是否显示遮罩
			okText:"确认",             //是否显示遮罩
			closeText:"取消",             //是否显示遮罩
			callback: function () {},   //点击确认按钮执行的回调函数
			closeCallback: function () {}   //点击确认按钮执行的回调函数
	};

	AlertWindow.prototype = {
		//生成弹出层
		setAw : function(width,height,title,el,msg,theme,type){
			if( el ){
				var elType;                       
				var elFrist = el.substr(0,1);
				var elName = el.substr(1,el.length);

				if( elFrist !== '.' && elFrist !== '#' ){           
					return;
				}

				elFrist === '.' ? elType = "class='"+elName+"'" : elType = "id='"+elName+"'";
				var contentElement = $(el).html(); //弹层内容
			    contentElement ? contentElement : contentElement = '';
			}
			var AlertWindow =   "<div id='alert-window' style='" + (width?"width:"+width+"px;":"")+  (height?"height:"+height+"px;":"")+"'>"+
									"<div class='aw-title"+theme+"'><h4>" + title + "</h4><span class='aw-close glyphicon glyphicon-remove'></span></div>"+
									"<div class='aw-content'>"+
									( el ? "<div "+ elType +">" + contentElement +
										"</div>" : "<span class='msg'>"+msg+"</span>" )+
									"</div>"+(type!="none"?"<div class='aw-btn' style='text-align: center'></div>":"")+
								"</div>";

			return AlertWindow;
		},
		//将弹层插入body
		appendAdw : function(hasmask){
			var options = this.options;
			if( hasmask ){
				$('body').append("<div id='mask'></div>");
				$('body').append(this.setAw(options.width,options.height,options.title,options.el,options.msg,options.theme,options.type));
			}else{
				$('body').append(this.setAw(options.width,options.height,options.title,options.el,options.msg,options.theme,options.type));
			};
			$("#mask").height($(document).height()); 
		},
		//添加按钮
		appendBtn:function(type){
			var options = this.options;
			if( type == 'none' ) return;
			var alert = '<a class="modal-close-btn">'+options.okText+'</a>';
			var confirm = '<a class="modal-close-btn m-l-r-20">'+options.closeText+'</a><a class="modal-confirm-btn m-l-l-20">'+options.okText+'</a>';
			if ( type == 'confirm' ){
				$('.aw-btn').append(confirm);
			}else if( type == 'alert' ){
				$('.aw-btn').append(alert);
			}
		},
		//设置弹层位置
		setAwPosition : function(){
			var windowW = $(window).width();      //可视宽度
			var windowH = $(window).height();
			var scrollTop = $(window).scrollTop();

			var scrollLeft = $(window).scrollLeft();

			var AwW = $('#alert-window').width(); //弹层宽度
			var AwH = $('#alert-window').height();

			var awPositionL =  ( windowW - AwW )/2 ;
			var awPositionT =  ( windowH - AwH ) /2 ;
			$('#alert-window').css({
				left:awPositionL,
				top:awPositionT
			})

		},
		//关闭弹层
		closeAw : function(){
			$('#mask').remove();
			$('#alert-window').remove();
		},
		//当弹层设置为可以拖动状态时，设置标题区域的鼠标样式;
		setTitleCursor : function(isDraging){
			if ( isDraging ) {
				$('.aw-title').css("cursor","move");
			}else{
				return false;
			}
		},
		moveDown : function(e){
			this.dragingFlag = true;  //将拖拽开关设置打开状态
			var box = $('#alert-window').offset();
			var boxLeft = box.left;            //弹层对浏览器边缘的偏移
			var boxTop = box.top;

			this.moveX = e.pageX - boxLeft;    //鼠标距离弹层边缘的偏移
			this.moveY = e.pageY - boxTop;
		},
		moveBox : function(e){

			if(this.dragingFlag){

				var boxLeft = e.pageX - this.moveX;
				var boxTop = e.pageY - this.moveY;

                //鼠标向左偏移最小值 > 0 ， 最大值 < 可视宽度 - 弹层宽度 
                //鼠标向上偏移最小值 > 0 ， 最大值 < 可视高度 - 弹层高度 

                var windowW = $(window).width();      //可视宽度
			    var windowH = $(document).height();

			    var AwW = $('#alert-window').outerWidth(); //弹层宽度
			    var AwH = $('#alert-window').outerHeight();

			    var widthMax = windowW - AwW;
			    var heightMax = windowH - AwH;

			    boxLeft = Math.min(widthMax,Math.max(0,boxLeft));
			    boxTop = Math.min(heightMax,Math.max(0,boxTop));

				$('#alert-window').css({
					left : boxLeft,
					top : boxTop
				});
		    }
		},
		moveUp : function(){
			this.dragingFlag = false;  //将拖拽开关设置关闭状态
		}

	};

	window.AlertWindow = AlertWindow;

})();

/*
#mask{ width: 100%; height: 100%; background: #000; opacity: .4; filter: alpha(opacity(40)); position: absolute; left: 0; top: 0; z-index: 999999999999;}
#alert-window{ width: 380px; padding:10px 8px; background: #FBFBFB; border:1px solid #E5E5E5; border-radius: 5px; overflow: hidden; position: absolute; left: 400px; top:100px; z-index: 9999999999999; }
#alert-window .aw-title{width: 98%; margin: 0 auto; border-bottom: 1px solid #D4D4D4; padding: 0 0 5px 0; }
#alert-window .aw-title h1{ padding-left: 10px; font-weight: normal; font-size: 14px;}
#alert-window .aw-title .aw-close{ display: block; width: 16px; height: 16px; background: url(aw-close.png) no-repeat center center; position: absolute; right: 20px; top:16px; cursor:pointer;}
#alert-window .aw-content{ padding: 30px 0; width: 100%; text-align: center; }
#alert-window .aw-content .msg{ font-size: 18px; }
*/