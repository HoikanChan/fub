var type = 1;
; ;var index = function () {      //轮播图

   
    function phoneSumbit(){
        var params ={
            phone:$(".phoneInput").val(),
            userId:1
        }
        $.ajax({
            url: api.host+"web/usercontact/save",
            type:"post",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(params),
            success:function(data){
                if (data.code == 1) {
                    toastr.success("提交成功");
                }else{
                    toastr.warning("提交失败");
                }
                
            }
    })  
    }
    function checkForm(){
        var phone = $(".phoneInput").val();
        var pass = true;
            if(phone==null || phone==""){
                $(".phone-msg").removeClass('hide')
                pass=false;
            }else if (!checkPhone(phone)) {
                $(".phone-msg").removeClass('hide')
                pass=false;
            }
        if(!pass)
            return;
            $(".phone-msg").addClass('hide')
            phoneSumbit();
    }

         $({source:1})._Ajax({
            url:"web/showinformation/list",
            success:function(result){
               if(result.code == 1){
                result.page.host=  api.host+"newsDetail?";
               
                var html = template('news-content-template', result.page);
           
                $(".news-content").html(html);
               
               }else{
                    toastr.warning("数据请求失败");
               }
              
            }
        })
        $({parentId :1})._Ajax({
            url:"web/servicetype/treeByType",
            success:function(result){
                if(result.code == 1){
                    var html = template('service-list-templete', result);
                    $(".service-list-ul").html(html);
                    $(".service-list-ul .service-li:last").css("margin-right","0")
                    var liHeight = $(".service-list-ul .service-li").outerHeight();
                }else{
                    toastr.warning("数据请求失败");
                }
              
            }
        })
       
        return {
                init: function () {
                    change_main_current_class(1);
                    $(document).on("click",".getphone",function(){
                        checkLogin(function (){
                            checkForm();
                        })

                      })
                }

        }
} ();
index.init();
var _getService = function () {
    var getService_validate, getService_modal;
    var jude = true;
    $(function () {
            if (getCookie("mobilePhone")&&getCookie("rememberUser")){
                $(".user-operating").find(".user-name").html(getCookie("mobilePhone"));
             //   $(".user-operating").find("ul").append(userOper);
                $(".login-operating").html("");
            }

           
            //表单验证
            getService_validate = $("#gerService-form").validate({
                    rules: {
                        realName: {
                            required: true,
                        },
                        mobilePhone: {
                            required: true,
                            account:true
                        },
                        companyName: {
                            required: true,

                        },
                        remark: {
                            required: false,
 
                        },
                    },
                    messages: {
                        realName: {
                            required: "请输入您的姓名",
                           
                        },
                        mobilePhone: {
                            required: "请输入您的手机号码",
                            account:"请输入正确的手机号码以13X 15X 18X 14X 17X号段开头"
                        },
                        companyName: {
                            required: "请输入您的公司名称",
                        },
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

        //登录请求
        function getServiceAjax() {
            var params = {
                userId:1,
                realName:$("#gerService-form input[name='realName']").val(),
                mobilePhone:$("#gerService-form input[name='mobilePhone']").val(),
                companyName:$("#gerService-form input[name='companyName']").val(),
                remark:$("#gerService-form input[name='remark']").val(),
                serviceType: type
            }
            $.ajax({
                url: api.host+"web/orderneed/save",
                type:"post",
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(params),
                success: function (result) {
                            if (result.code==1) {
                                toastr.warning("提交成功")
                                
                               $(".remodal-close").trigger("click");  
                           
                            } else {
                                toastr.warning(result.msg)
                            }
                    }
            })
        };
    
        
    return {
        init: function () {
                    // $(document).on("click", ".getService .service-btn", function () {
                    //         $(this).addClass("current").siblings(".current").removeClass("current");
                    //    //     $("#getService_modal #registered-form").hide();
                    //         $("#getService-modal #gerService-form").show();
                            
                    // });
                  
                $(document).on("closing", "getService-modal", function () {
                    var pathName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1).replace(/.httl\S*/, "").replace(/.httl\S*/, "");
                        if (pathName == "userCenter"&&jude) {
                            window.location = "index";
                        }
                    });
                $(document).on("confirmation", "#getService-modal", function () {
                        jude=false
                        checkLogin(function(){
                            if (getService_validate.form()) {
                                 getServiceAjax();
                            }
                        })
                    });
                
                  
            },
            getService_modal: null,
    }
} ();
_getService.init();