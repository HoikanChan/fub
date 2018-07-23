; ;var index = function () {      //轮播图

    var page =1;
   
      
    function question(page) {
        var name = $("input[name='name']").val();
        var params;
        if(name){
            params = {
                name:name,
            }
        }else{
            params = {
                name:"",
            }
        }
       
            $('#page-list .pager').tablePager({
                 url:"help/api/list",
                 type:"get",
                 searchParam:params,
                success:function(result){
                if(result.code == 0){
                            var html = template('question-content-templete', result.data);
                        
                            $("#accordion").html(html);
                            if(result.data.totalCount<12    ){
                                $(".page-row").hide()
                             }else{
                                $(".page-row").show()
                            }
                        }else{
                                toastr.warning(result.msg);
                        }
                
                }
            });
        }
       

        $(function(){
        
            question();
          
            
        });
        return {
                init: function () {

                    
             
                    change_main_current_class(3);
                   $(document).on("click","#basic-addon2",function(){
                    question();
                   })
                }

        }
} ();
index.init();