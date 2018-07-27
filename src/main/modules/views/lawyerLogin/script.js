var _login = function () {
    var login_validate, registered_validate, login_modal;
    var jude = true;

    $(function () {
            if(window.location.search){
                $(".register-title-btn").trigger("click");
            }
            var winH = $(window).outerHeight();
            var winW = $(window).outerWidth();
            $(".login-bg").height(winH-125).width(winW);  
            var loginLeft = 580/2;
            var loginTop = 430/2;
         
            $("#login-modal-box").css({"top":winH/2-loginTop+"px","left":winW/2-loginLeft+"px"})
            $(window).resize(function(){
                $("#login-modal-box").css({"top":winH/2-loginTop+"px","left":winW/2-loginLeft+"px"})
                $(".login-bg").height(winH-125).width(winW);  
            })
            $(".registerCode-btn img").attr("src",api.host+"web/userinfo/registerCode.jpg");
         
            $("#header-nav").hide();
            if (getCookie("mobile")&&getCookie("type")){
            
              //  $(".user-operating").find(".user-name").html(getCookie("mobilePhone"));
              //  $(".user-operating").find("ul").append(userOper);
                $(".login-operating").html("");

                $(".user-operating").html("")
            }

            if (getCookie("mpt") && getCookie("__")) {
                $("#login-form input[name='mobile']").val(getCookie("mpt"));
                $("#login-form input[name='password']").val(base.decode(getCookie("__")));
                $("#remember-psw").prop("checked", true);
            }else{
                $("#login-form input[name='mobile']").val("");
                $("#login-form input[name='password']").val("");
            }
            
           
            //表单验证
            login_validate = $("#login-form").validate({
                    rules: {
                        mobilePhone: {
                            required: true,
                            account:true
                        },
                        password: {
                            required: true,
                            password:false,
                        }
                    },
                    messages: {
                        mobilePhone: {
                            required: "请输入有效的手机号码",
                            account:"请输入正确的手机号码以13X 15X 18X 14X 17X号段开头"
                        },
                        password: {
                            required: "请输入密码",
                            password:"长度为6-16位，由字母和数字(不能以下划线开头、结尾)组合，区分大小写，不能为纯数字"
                        }
                    },
                    errorPlacement: function (error, element) {
                        element.siblings(".error-div").html(error)
                    },
            });
            registered_validate = $("#registered-form").validate({
                rules: {
                    mobilePhone : {
                        required: true,
                        account:true
                    },
                    password: {
                        required: true,
                        password:true
                    },
                    securityCode: {
                            required:true,
                    }
                },
                messages: {
                    mobilePhone: {
                        required: "请输入有效的手机号码",
                        account:"请输入正确的手机号码以13X 15X 18X 14X 17X号段开头"
                    },
                    password: {
                        required: "请输入密码",
                        password:"长度为6-16位，由字母和数字(不能以下划线开头、结尾)组合，区分大小写，不能为纯数字"
                    },
                    securityCode: {
                            required:"请输入验证码"
                    }
                },
                errorPlacement: function (error, element) {
                    element.siblings(".error-div").html(error)
                },
            });    
        })

        //自定义正则表达示验证方法  
        $.validator.addMethod("account",function(value,element,params){  
            var account = regexs.mobile    // 密码验证
                return (account.test(value));  
        });     
        $.validator.addMethod("password",function(value,element,params){  
            var password = regexs.password    // 密码验证
                return (password.test(value));  
        }); 

        //登录请求
        function loginAjax() {
          
            var hash,mobilePhone;
            mobilePhone = $("#login-form input[name='mobile']").val();
            hash = $("#login-form input[name='password']").val();
        var params = {
                mobile:mobilePhone,
                password: hash,
                type:$("#login-form #remember-psw").prop("checked")?2:"",
        }
        
        if ($("#login-form #remember-psw").prop("checked")) {
            setCookie("mpt", $("#login-form input[name='mobile']").val(), 7);
            setCookie("__",base.encode(hash), 7);
           
            setCookie("type", 1, 7);
        } else {
            delCookie("mpt");
            delCookie("__");
            setCookie("type",1);
        }
            $(params)._Ajax({
                    url: "web/userinfo/login",
                    success: function (result) {
                            if (result.code==1) {
                            sessionStorage.setItem("userType",result.user.userType);
                           
                           console.log(result.user.userType)
                         
                         //       self.location=document.referrer; 
                                //判断没有登录，然后用户登录成功后调用之前的回调函数
                               
                            } else {
                                toastr.warning(result.msg)
                            }
                    }
            })
        };
         /*
        *倒计时
        */
        var countDown = function (start, callback) {
            $("#registered-form .validateCode-btn").html(start + "秒").addClass("stopBtn").removeClass("validateCode-btn");
            var t = setInterval(function () {
                if (start < 1) {
                    clearInterval(t);
                    callback()
                }else {
                    $("#registered-form .stopBtn").html(start + "秒");
                    start--;
                }
            }, 1000);
        };

        //短信接口请求
        function getMessage() {
            
            if (registered_validate.element($("#registered-form input[name='mobilePhone']"))){
                var mobilePhone = $("#registered-form input[name='mobilePhone']").val();
                var registerCode =  $("#registered-form input[name='registerCode']").val();
                $({mobilePhone,registerCode})._Ajax({
                    url: "web/userinfo/registerSMSCode",
                    success: function (result) {
                        if (result.code == 1) {
                            countDown(60, function () {
                                $("#registered-form .stopBtn").html("点击获取验证码").addClass("validateCode-btn").removeClass("stopBtn")
                            })
                        } else {
                            toastr.warning(result.msg)
                        }
                    }
                })
            }
        }
    
    //注册请求
    function registerAjax() {
         var params = {
            mobilePhone: $("#registered-form input[name='mobilePhone']").val(),
                password: $("#registered-form input[name='password']").val(),
                securityCode:$("#registered-form input[name='securityCode']").val(),
        }
        $(params)._Ajax({
                url: "web/userinfo/register",
                success: function (result) {
                        if (result.code == 1) {
                            $("#registered-form")[0].reset();
                            $("#login-modal-box .login-title-btn").trigger("click");
                            toastr.success("注册成功")
                        }else {
                          
                            toastr.warning(result.msg)
                        }
                }
        })
    }
        
    return {
        init: function () {
                    $(document).on("click", "#login-modal-box .login-title-btn", function () {
                            $(this).addClass("current").siblings(".current").removeClass("current");
                            $("#login-modal-box #registered-form").hide();
                            $("#login-modal-box #login-form").show();
                            $("#login-modal-box .remodal-confirm").html("登录");
                    });
                    $(document).on("click", "#login-modal-box .register-title-btn", function () {
                            $(this).addClass("current").siblings(".current").removeClass("current");
                                $("#login-modal-box #login-form").hide();
                                $("#login-modal-box #registered-form").show();
                                $("#login-modal-box .remodal-confirm").html("注册");
                    });
                   
            
            $(document).on("click",".registerCode-btn img",function(){
                $(this).prop("src",api.host+"web/userinfo/registerCode.jpg?"+new Date().getTime())
            })
               
                $(document).on("click", ".remodal-confirm", function () {
                        jude=false
                        if (!$("#login-modal-box #login-form").is(":hidden")) { 
                            if (login_validate.form()) {
                                        loginAjax();
                                    }
                            }else if (!$("#login-modal-box #registered-form").is(":hidden")){
                                
                                if (registered_validate.form()) {
                                   
                                        registerAjax();
                                    }
                            }
                    });
                    $(document).on("click", "#registered-form .validateCode-btn", function () {
                        var registerCode = $(".verification-code-row input[name='registerCode']").val();
                        if(!registerCode){
                            $(".registerCode-btn").next(".error-div").html("获取验证码前请输入图片验证码")
                        }else{
                            $(".registerCode-btn").next(".error-div").html();
                        }
                        getMessage();
                    })
                  //多选框
                    $(document).on("click", ".checkbox-input input", function (e) {
                            e.stopPropagation();
                            if ($(this).prop("checked") == true) {
                            $(this).parent().addClass("checkbox-checked-input");
                            } else {
                            $(this).parent().removeClass("checkbox-checked-input");
                            }
                    });
                    $(document).on("keydown", "#login-form input[name='password']", function (e) {
                        if (e.which != 13) {
                            delCookie("password");
                        }
                    })
                    //enter登录
                    $(document).on("keydown", function (e) {
                        e.stopPropagation();
                        var key = e.which;
                        if (key == 13&&!$("#login-modal-box").parent().is(":hidden")&&$("#login-modal-box .login-title-btn").hasClass("current")) {
                            $("#login-modal-box [data-remodal-action='confirm']").trigger("click");
                        }
                    });
            },
        login_modal: null,
    }
} ();
_login.init();
