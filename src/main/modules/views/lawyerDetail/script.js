
; ;var index = function () {      //轮播图
  
    var codeid = Request['caseQueryLogId'];
    var codename = Request['name'];
    $(".info-box h4").text(codename);
    var params = {
        caseQueryLogId:codeid,
        name:codename,
        isGroupCategory:true,
        offset:0
    }
    $('.case-list-page .pager').tablePager({
    
        url: "case/lawyerRecommendCaseList",
        searchParam:params,
        success: function (result) {
           // result.data.host=  api.link+"caseDetail?";
            result.data.host=  api.host+"caseDetail?";
          $(".result-count").text(result.data.totalCount);
          var html = template('lawyer-list-templete', result.data); 
          $(".case-list").html(html);
          result.data.hosts=  api.host+"lawyerDetail?name="+codename;
        var html2 = template('lawyer-slider-templete', result.data); 
        $(".sidenav-menu").html(html2);

           
        

        if(result.data.totalCount<12){
            $(".page-row").hide()
        }else{
            $(".page-row").show()
        }
        }
    })

   
    // function keywordSumbit(){
    //     var keywords = $("input[name='keyword']").val()
       
    //     var params = {
    //         offset:0,
    //  //       keyword : keywords,
    //         caseTypeId : caseTypeId,
    //   //      courtCityId :areaid
    //     }
    //     $('#list-page .pager').tablePager({
        
    //         url: "case/lawyerRecommend",
    //         searchParam:params
    //         success: function (result) {
    //            if(result.code == 0){
    //             result.data.host=  api.link+"lawyerDetail?";
    //             var html = template('search-result-templete', result.data); 
    //             $("#search-result").html(html);
    //             if(result.data.totalCount<12){
    //                 $(".page-row").hide()
    //             }else{
    //                 $(".page-row").show()
    //             }
    //            }else{
    //                 toastr.warning(result.msg);
    //            }
              
    //         }
    //     })
    // }


        $(document).ready(function() {
         //表单验证
    
         $('[data-sidenav]').sidenav(); 
         function changeicon(){
                       
            $(".oneLevel a").toggerClass("show-up");
         
        
     }
    
        });
        return {
                init: function () {
                    change_main_current_class(1); 
                   $(document).on("click",".slider-result",function(){

                        var sonid =  $(this).attr("data-id");
                        console.log(sonid)
                        var params = {
                         caseQueryLogId:sonid,
                         name:codename,
                         isGroupCategory:true,
                         offset:0
                     }
                        $('.case-list-page .pager').tablePager({
                         url: "case/lawyerRecommendCaseList",
                         searchParam:params,
                         success: function (result) {     
                            result.data.host=  api.host+"caseDetail?";          
                           $(".result-count").text(result.data.totalCount);
                           var html = template('lawyer-list-templete', result.data); 
                           $(".case-list").html(html);
                          
                         if(result.data.totalCount<12){
                             $(".page-row").hide()
                         }else{
                             $(".page-row").show()
                         }
                         }
                     })
                     location.reload();
                     })  
                    //  $(document).on("click","#searchBtn",function(){
                    //     seachSumbit();
        
                    // })
                //     $(document).on("click",".case-list-box",function(){
                
                //         caseDetail.showDataDetailDialog2($(this).attr("data-id"))
                   
                // })
        }
    }
} ();
index.init();