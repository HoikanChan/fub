var _login = function () {
    var login_validate, registered_validate, login_modal;
    var jude = true;
    var urlparam = window.location.search.replace("?", ""); 
    var base = new Base64();   

    $(function () {
        //    checkLogin();
            if(urlparam == "legalLoan"){
                $("#login-modal-box .login-title-btn").trigger("click");
            }
            if(urlparam == "reg=1"){
                $(".register-title-btn").trigger("click");
            }
           
            var boxh = $("#login-modal-box").innerHeight();
            var boxw = $("#login-modal-box").innerWidth();
            $(".login-bg").height(winH-205).width(winW); 
            $(".header-top").hide();
            var loginLeft = boxw/2;
            var loginTop = boxh/2;
         
            $("#login-modal-box").css({"top":winH/2-loginTop+"px","left":winW/2-loginLeft+"px"})
            $(window).resize(function(){
                $("#login-modal-box").css({"top":winH/2-loginTop+"px","left":winW/2-loginLeft+"px"})
                $(".login-bg").height(winH-125).width(winW);  
            })
           
           $("#header-nav").hide();
           $("#registered-form input[name='password']").val("");
           $("#registered-form input[name='mobile']").val("");
           $("#registered-form input[name='code']").val("");
            if (getCookie("mobile")&&getCookie("type")){
            
              //  $(".user-operating").find(".user-name").html(getCookie("mobilePhone"));
              //  $(".user-operating").find("ul").append(userOper);
                $(".login-operating").html("");

                $(".user-operating").html("")
            }
            if (getCookie("mpt") && getCookie("__")){
                $("#login-form input[name='mobile']").val(getCookie("mpt"));
                $("#login-form input[name='password']").val(base.decode(getCookie("__")));
                $("#remember-psw").prop("checked", true);
            }else{
                $("#login-form input[name='mobile']").val("");
                $("#login-form input[name='password']").val("");
                $("#remember-psw").prop("checked", false);
            }
              
            //表单验证
            login_validate = $("#login-form").validate({
                    rules: {
                        mobile: {
                            required: true,
                            account:true
                        },
                        password: {
                            required: true,
                            password:false,
                        }
                    },
                    messages: {
                        mobile: {
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
                    mobile : {
                        required: true,
                        account:true
                    },
                    password: {
                        required: true,
                        password:true
                    },
                    code: {
                            required:true,
                    }
                },
                messages: {
                    mobile: {
                        required: "请输入有效的手机号码",
                        account:"请输入正确的手机号码以13X 15X 18X 14X 17X号段开头"
                    },
                    password: {
                        required: "请输入密码",
                        password:"长度为6-16位，由字母和数字(不能以下划线开头、结尾)组合，区分大小写，不能为纯数字"
                    },
                    code: {
                            required:"请输入验证码"
                    }
                },
                errorPlacement: function (error, element) {
                    element.siblings(".error-div").html(error)
                },
            });    
        })

       // 自定义正则表达示验证方法  
        $.validator.addMethod("account",function(value,element,params){  
            var account = regexs.mobile    // 密码验证
                return (account.test(value));  
        });     
        $.validator.addMethod("password",function(value,element,params){  
            var password = regexs.password    // 密码验证
                return (password.test(value));  
        }); 

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
            
            if(registered_validate.element($("#registered-form input[name='mobile']"))){
                var mobilePhone = $("#registered-form input[name='mobile']").val();
               
                $({mobile:mobilePhone,type:"register"})._Ajax({
                    url: "user/code",
                    success: function (result) {
                        if (result.code == 0) {
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
    //验证码验证
        function checkValidateCode(){
            jude=false
            var validateCode = $("#registered-form input[name='code']").val();
            $({code:validateCode})._Ajax({
                url: "user/checkCode",
                success: function (result) {
                    if (result.code == 0) {
                        $(".verification-code-row .error-div").text("");
                    } else {
                        $(".verification-code-row .error-div").text("请输入正确的验证码");
                    }
                }
            })
        }

    //注册请求
    function registerAjax() {
        var params = {
              
               password: $("#registered-form input[name='password']").val(),
               mobile: $("#registered-form input[name='mobile']").val(),
              
       }

       $(params)._Ajax({
           url:"user/save",
           data:params,
           success:function (result) {
            if (result.code == 0) {
                $("#registered-form")[0].reset();
                $("#login-modal-box .login-title-btn").trigger("click");
               
                toastr.success(result.msg)
            }else {
                toastr.warning(result.msg)
            }
    }
   });
}
      
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
                    url: "user/login",
                    success: function (result) {
                            if (result.code==0) {
                               
                              window.sessionStorage.setItem("mobile", result.user.mobile);
                              sessionStorage.setItem("userid", result.user.id);
                              sessionStorage.setItem("lawyerId", result.user.lawyerId);
                              sessionStorage.setItem("officeId", result.user.officeId);
                              sessionStorage.setItem("userType", result.user.userType);
                            if(urlparam == "legalLoan"){

                                self.location = api.host+"legalLoan";
                            }else{
                               //判断没有登录，然后用户登录成功后调用之前的回调函数
                         
                           self.location = document.referrer;  

                            }
                                
                            } else {
                                toastr.warning(result.msg)
                            }
                    }
            })
        };
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
                   
                $(document).on("click",".validateCode-btn",function(){
                    getMessage();
                })
                $(document).on("click","#register-password",function(){
                    checkValidateCode();
                });
               
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
                    $(".noaccout p").click(function(){
                        $(".register-title-btn").trigger("click");
                    })


                    var input=$('[name="password"]');
                    $("#passwordshow").click(function(){
                            var changeType=input.attr("type")=="text"?"password":"text";
                            input.attr("type",changeType);
                            $(this).toggleClass("show");
                            if($(this).hasClass("show")){
                                $(this).removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open")
                            }else{
                                $(this).removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close") 
                            }
                    });

                
                    
                },

                login_modal: null,
            }
} ();
_login.init();