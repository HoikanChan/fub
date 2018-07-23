
;var userCenter = function () {
       
        var page=1;
        var inquery_validate;
      
        $(function(){
                inquery_validate = $("#inquery-form").validate({
                        rules: {
                           
                            title : {
                                required: true,
                            },
                            content : {
                                required: true,
                            }
                        },
                        messages: {
                                title: {
                                required: "请输入您的咨询标题",
                               
                            },
                            content : {
                                required: "请输入您的咨询内容",
                            }
                          
                        },
                        errorPlacement: function (error, element) {
                            element.siblings(".error-div").html(error)
                        },
                });
                mycontract();
             
                myinfo();
                    $(".tab-nav li").hover(
                        function () {
                          $(this).children("div").find("i").addClass("ihover");
                        },
                        function () {
                          $(this).children("div").find("i").removeClass("ihover");
                        }
                      );
               })
        
        //我的合同
         function mycontract(page) {
               $('#mycontract .pager').tablePager({
               url: "web/contract/list",
               success: function (result) {
                       if (result.code==1) {
                               var data = result.page;
                               if (data.totalCount > 0) {
                                       var html = template("mycontract-template",data);
                                       $("#contract-table tbody").html(html);
                               } else {
                                      $("#contract-table tbody").html("暂无您的合同信息");

                               }
                               
                       }
                     
               },

               });

       }
        //我的案件    
       function mycase(page) {
        $('#mycase .pager').tablePagerThree({
        url: "web/case/list",
        success: function (result) {
                if (result.code==1) {
                        var data = result.page;
                        if (data.totalCount > 0) {
                                data.host = api.link;
                                var html = template("mycase-template",data);
                                $("#mycase-table tbody").html(html);
                        } else {
                               $("#mycase-table tbody").html("暂无您的案件信息");

                        }
                       
                }
              
        },

        });

}
        //我的咨询
        function myconsult(page) {
               
                $('#myconsult .pager').tablePagerOne({
                url: "web/inquiry/list",
                success: function (result) {
                        if (result.code==1) {
                                var data = result.page;
                                 if (data.totalCount > 0) {
                                        var html = template("myconsult-template",data);
                                        $("#myconsult-table tbody").html(html);
                                } else {
                                $("#myconsult-table tbody").html("暂无您的咨询信息");

                                }
                                
                        }
                
                },

                });

}
        //个人信息
        //我的咨询
        function myinfo() {
                $({})._Ajax({
                url: "web/userinfo/info",
                success: function (result) {
                        if (result.code==1) {
                               
                                if (result.userInfo) {
                                        var html = template("myinfo-template",result);
                                        $(".person-info ul").html(html);
                                        if(result.userInfo.headshotUrl){
                                           $("#uploadimgHead").attr("src",result.userInfo.headshotUrl);              
                                           $("#yanLaiIMG").hide();            
                                        }else{
                                           $("#yanLaiIMG").show();
                                           $("#uploadimgHead").hide();   
                                        }
                                        
                                } else {
                                $(".person-info ul").html("暂无信息");

                                } 
                        }
                
                }

        }); 

}
        function inquerySumbit() {
                var params = {
                        title:$("#inquery-form input[name='title']").val(),
                        content:$("#inquery-form textarea[name='content']").val(),
                        userId:1
                }
                 $.ajax({
                        url: api.host+"web/inquiry/save",
                        type:"post",
                        contentType:"application/json",
                        dataType:"json",
                        data:JSON.stringify(params),
                        success: function (result) {
                                if (result.code==1) {
                                        toastr.success("提交成功")
                                }else{
                                        toastr.warning("提交失败")
                                }

                }
            });
        }


      
        return {
                init: function () {
                    //  satelliteApplication();
                    
                        $(document).on("click",".tab-nav ul li",function(){
                               $this = $(this);
                                var moduleId = $this.attr("data-moduleid");
                                //菜单显示
                                $this.addClass("active").siblings('li').removeClass("active");
                                switch (moduleId) {
                                        case "001":
                                          $("#mycontract").show();     
                                           $("#mycase,#myconsult").hide();
                                           mycontract();
                                           break;
                                        case "002":
                                           $("#mycase").show();    
                                           $("#mycontract,#myconsult").hide();
                                            mycase();
                                            break;
                                         case "003":
                                          $("#myconsult").show();
                                           $("#mycontract,#mycase").hide();
                                           myconsult();
                                           break;

                                          
                                }

                        })
                        $(document).on("click",".sumbit-inquery",function(){
                                if(inquery_validate.form()){
                                        checkLogin(function(){
                                       
                                                inquerySumbit();    
                                                $(".tab-nav li.li-last").trigger("click")
                                                var target_top = $(".tab-nav").offset().top;
                                                $("html,body").animate({scrollTop: target_top}, 1000);   //带滑动效果的跳转
  
                                })
                        }
                        })
                        $(document).on("click",'.nodetail-btn',function(){
                                toastr.warning("暂无详情文件")
                                return false;
                        })
                        $(document).on("click",'.nodownload',function(){
                                toastr.warning("暂无下载文件")
                                return false;
                        })
                        $(document).on("click",'.mycontract-detail-btn,.download',function(){
                                checkLogin();
                        })
          

                       

                },
                 
        }
} ();
userCenter.init();