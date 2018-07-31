
var _updateCase = function () {
    var updateCase_validate, updateCase_modal;
    var jude = true;

    function updateCaseDialog(obj,objid){
        $("#casename").val(obj);
        $("#caseno").val(objid);
        $("#handlecront").val();
        $("#handlepro").val();
        $("#updatemarks").val();
        var objid = objid;
        $({caseTypeId:objid})._Ajax({
            url: "casetype/queryTrialRoundByCaseType",
            success: function (result) {
                    if (result.code==0) {
                        
                        var html = template("case-process-templete",result)
                        $(".case-process").html(html);
                    }
                 }
        });
    }

   
       
   

    $(function () {
        
        updateCase_modal= $("#updateCase-modal").remodal();
          
            //表单验证
            updateCase_validate = $("#updateCase-form").validate({
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
              
                $(document).on("confirmation", ".updateCase-modal", function () {
                        jude=false
                       
                         myartingAjax();
                              
                    });
                
                  
            },
            updateCase_modal:null,
            updateCaseDialog:updateCaseDialog
    }
} ();
_updateCase.init();