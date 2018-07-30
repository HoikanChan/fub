var _myarting = function () {
    var myarting_validate, myarting_modal;
    var jude = true;
    $(function () {
           

            _myarting.myarting_modal =myarting_modal= $("#myarting-modal").remodal();
            //表单验证
            myarting_validate = $("#myarting-form").validate({
                    rules: {
                       
                        remarks : {
                            required: true,
                        }
                    },
                    messages: {
                        remarks: {
                            required: "请输入您的评价",
                           
                        }
                      
                    },
                    errorPlacement: function (error, element) {
                        element.siblings(".error-div").html(error)
                    },
            });
        })
          
        //登录请求
        function myartingAjax() {
            var params = {
                content:$("#myarting-form textarea[name='content']").val()
            }
            $.ajax({
                url: api.host+"web/appraise/save",
                type:"post",
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(params),
                    success: function (result) {
                            if (result.code==1) {
                                
                                toastr.success("提交成功")
                                $(".remodal-close").trigger("click");
                            } else {
                                toastr.warning(result.msg)
                            }
                    }
            })
        };
    
        
    return {
        init: function () {
                    $(document).on("click", ".table-title .myRating", function () {
                            $(this).addClass("current").siblings(".current").removeClass("current");
                       //     $("#getService_modal #registered-form").hide();
                            $("#myarting-modal #myarting-form").show();
                            
                    });
                  
                $(document).on("closing", "myarting-modal", function () {
                    var pathName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1).replace(/.httl\S*/, "").replace(/.httl\S*/, "");
                        if (pathName == "userCenter"&&jude) {
                            window.location = "index";
                        }
                    });
                $(document).on("confirmation", "#myarting-modal", function () {
                        jude=false
                        if (!$("#myarting-modal #myarting-form").is(":hidden")) { 
                          
                            if (myarting_validate.form()) {
                                checkLogin(function(){
                                    myartingAjax();
                                })
                                    }
                            }
                    });
                
                  
            },
            myarting_modal: null,
    }
} ();
_myarting.init();