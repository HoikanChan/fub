
; ;var index = function () {      //轮播图

   var ligalloan_validator;
    $({})._Ajax({
        url:"lawyer/queryOffice",
        success:function(result){
        if(result.code == 0){
            var html = template('lawyer-info-templete', result); 
            $("#first-disabled").html(html);
            var value = $('#first-disabled').val();
            $("#first-disabled" ).selectpicker('refresh');
            
        }else{
                toastr.warning("数据请求失败");
        }
        
        }
    })
    function onChangePhone(){
        var phone = window.sessionStorage.getItem("mobile");
        $("#mobile").val(phone);

        $({mobile:phone})._Ajax({
            url:"client/queryByMobile",
            success:function(result){
               if(result.code == 0){
                $("#loan-apply input[name='mobile']").attr("data-id",result.client.clientId)
                   
                $("#loan-apply input[name='realname']").val(result.client.realname);
                $("#loan-apply input[name='idcard']").val(result.client.idcard);
                
               }else{
                 

               }
              
            }
        })
    }
    

    function sumbit(){
        
        var clientId =  $("#loan-apply input[name='mobile']").attr("data-id");
        var realname = $("input[name='realname']").val();
        var idcard = $("input[name='idcard']").val();
        var totalPrice = $("input[name='totalPrice']").val();
       
        var lawyerid = $("input[name='lawyerId']").attr("value");
        
        var officeid = $(".bootstrap-select button").attr("officeid");;
        var type = $("#legalloan-form #checkbox").prop("checked")?2:"";
        var company = $("input[name='company']").val();
    if(company){
        var params = {
            clientId:clientId,
            realname:realname,
            idcard:idcard,
            totalPrice:totalPrice,
            lawyerId:lawyerid,
            officeId:officeid,
            companyName:company
        }
    }else{
        var params = {
            clientId:clientId,
            realname:realname,
            idcard:idcard,
            totalPrice:totalPrice,
            lawyerId:lawyerid,
            officeId:officeid,
            type:type
        }
    }
    
    

        $(params)._Ajax({
         //   url:"lvswbao/loan/saveLoanOrder",
         url:"order/save",
            success:function(result){
               if(result.code == 0){
                toastr.success(result.msg);
               }else{
                 //   toastr.warning("数据请求失败");
                 toastr.success("提交成功");
               }
              
            }
        })
    
}


        $(document).ready(function() {
         //表单验证
       $("#legalloan-form").bootstrapValidator({
            message:'This value is not valid',
//            定义未通过验证的状态图标
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
//            字段验证
            fields:{      
                    realname:{
                        message: '',
                        validators:{
                        notEmpty:{
                            message:'申请人姓名不能为空'
                            }
                        }
                    },

                    idcard:{
                        message: '',
                        validators:{
                        notEmpty:{
                            message:'身份证不能为空'
                        },
//                      基于正则表达是的验证
                        regexp:{
                            regexp: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                            message: '身份证号码格式不正确，为15位和18位身份证号码！'
                        },
                       
                         }
                     },
                    totalPrice:{
                        message: '',
                        validators:{
                            notEmpty:{
                                message:'贷款金额不能为空'
                                },
                            regexp:{
                                regexp: /^[0-9]*$/,
                                message: '请输入数字'
                            },    
                        }
                    },
                    lawyerId:{
                        message: '',
                        validators:{
                        notEmpty:{
                            message:'请选择代理律师'
                            }
                        }
                    },
  
                },
            
        })
      

       onChangePhone();
    
        });
        return {
                init: function () {

                    
                     $("#inlineRadio2").click(function(){
                        $("#company").show();
                     })
                     $("#inlineRadio1").click(function(){
                        $("#company").hide();
                     })
                     $(".radio-inline").click(function(){
                         $(this).addClass("checked").siblings().removeClass("checked");
                        if(!$(this).hasClass("checked")){
                           
                        }
                     })
                     $("#legalloan-sumbit").click(function () {//非submit按钮点击后进行验证，如果是submit则无需此句直接验证
                        $("#legalloan-form").bootstrapValidator('validate');//提交验证
                        if ($("#legalloan-form").data('bootstrapValidator').isValid()){//获取验证结果，如果成功，执行下面代码
                          
                            sumbit()
                          
                          
                        }
                    });
                    
                      
                }

        }
} ();
index.init();