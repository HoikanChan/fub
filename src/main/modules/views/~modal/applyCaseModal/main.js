var _applycase = function () {
    var applycase_validate, applycase_modal;
    var jude = true;

    $(function () {
               $({})._Ajax({
                url: "casetype/apiTree",
                success: function (result) {
                        if (result.code==0) {
                            var html = template("search-reason-templete",result)
                            $("#navbar-menu").html(html);
                        }
                    }
            });

            _applycase.applycase_modal =applycase_modal= $("#applycase-modal").remodal();
            //表单验证
            applycase_validate = $("#applycase-form").validate({
                    rules: {
                       
                        mobile : {
                            required: true,
                        },
                        name : {
                            required: true,
                        },
                        caseType : {
                            required: true,
                        },
                        lawyerFeeLimit : {
                            required: true,
                        }

                    },
                    messages: {
                        mobile : {
                            required: "请输入您的姓名",
                            account:"请输入正确的手机号码以13X 15X 18X 14X 17X号段开头"
                        },
                        name : {
                            required: "请输入案件名称",
                        },
                        caseType : {
                            required: "请选择案件类型",
                        },
                        lawyerFeeLimit : {
                            required: "请输入律师费用",
                        }
                      
                    },
                    errorPlacement: function (error, element) {
                        element.siblings(".error-div").html(error)
                    },
            });
        })
          
        $.validator.addMethod("account",function(value,element,params){  
            var account = regexs.mobile    // 密码验证
                return (account.test(value));  
        });    
        function applyCase(){
           
            var mobile = $("#mobile").val();
            var name = $("#name").val();
            var caseType = $("#reasonslect .reaseontext").attr("data-id")?$("#reasonslect .reaseontext").attr("data-id"):"";
            var lawyerFeeLimit = $("#lawyerFeeLimit").val();
            var marks = $("#marks").val();
        
            var params = {
                mobile : mobile,
                name : name,
                caseType : caseType,
                lawyerFeeLimit : lawyerFeeLimit,
                marks : marks
            }
            $(params)._Ajax({
                url: "casesource/saveNewCaseSource",
                success: function (result) {
                        if (result.code==0) {
                            toastr.success(result.msg);
                            $(".remodal-close-btn").trigger("click");
                        }else{
                            toastr.error(result.msg);
                 
                        }
                     }
            });
        } 
    return {
        init: function () {
             
                
                    $(document).on("click","#reasonslect .reaseontext",function(event){
                        $("#navbar-menu").toggle()
                        event.stopPropagation();
                    })
                    $(document).on("click",".first-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        $("#reasonslect .reaseontext").text(data);
                        $("#reasonslect .reaseontext").attr("data-id",dataid);
                        $("#navbar-menu").hide();
                        
                    })
                    $(document).on("click",".second-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        var parent = $(this).attr("parent-name");
                        $("#reasonslect .reaseontext").text(parent+"-"+data);
                        $("#reasonslect .reaseontext").attr("data-id",dataid);
                        $("#navbar-menu").hide();
                    })
                    $(document).on("click",".last-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        var parentname = $(this).attr("parent-name");
                        var parent = $(this).attr("parent");
                        $("#reasonslect .reaseontext").attr("data-id",dataid);
                        $("#reasonslect .reaseontext").text(parent+" - "+parentname+" - "+data);
                        $("#navbar-menu").hide();
                    })
                    $(document).on("click",function(event){
                        $("#navbar-menu").hide();
                    });
                    $(document).on("click", ".remodal-confirm", function () {
                        if (applycase_validate.form()) {
                            applyCase();
                        }    
                                
                        });
                  
            },
            applycase_modal: null,
    }
} ();
_applycase.init();