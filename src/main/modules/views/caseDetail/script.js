
; ;var index = function () {      
  
    var codeid = Request['id'];
    var name = Request['name'];
    $(".info-box h4").text(name);
    $({})._Ajax({
        url: "casedetail/infoByCaseId/"+codeid,
        success: function (result) {
                if (result.code==0) {
               
                        if (result) {
                            var html = template("case-content-templete",result)
                           $(".content").html(html); 
                            var da = result.data;
                           dataitem = $.parseJSON(result.data.legalBases);
                           
                        console.log(dataitem)
                            var lawerinfo =[];
                            var lawerinfos =[];
                            var baseinfo = [];
                            var childrenli = []
                            var appellors,caseType,reason,court,trialRound,content,legalBases;
                      if(result.data.legalBases =="[]"){
                        $(".case-title-btm").hide();
                        console.log("123")
                    }else{
                       
                          $(".case-title-btm").show();
                            for(var i=0;i<dataitem.length;i++){
                                lawerinfo += '<li>'+dataitem[i].law_name +'<ul>';
                              
                            for(var j=0;j<dataitem[i].items.length;j++){
                                var li = dataitem[i].items[j];
                                
                                lawerinfo +=  '<li>'+ li.item_name+'</li>'
                            
                        
                            }
                         
                            lawerinfo  += '</ul></li>'
                           }
                          
                           $(".case-ifon .parentul").html(lawerinfo) 
                         
                        }
                      
                      
                        if(da.court){
                            court = '<P><strong>审理法院：</strong>'+da.court+'</P>'
                        }else{
                            court ="";
                        }
                        if(da.caseType){
                            caseType = '<P><strong>案件类型：</strong>'+da.caseType+'</P>'
                        }else{
                            caseType ="";
                        }
                        if(da.trialRound){
                            trialRound = '<P><strong>审理程序：</strong>'+da.trialRound+'</P>'
                        }else{
                            trialRound ="";
                        }
                        if(da.trialDate){
                            trialDate = '<P><strong>审判日期：</strong>'+da.trialDate+'</P>'
                        }else{
                            trialDate ="";
                        }
                        if(da.appellors){
                            appellors = '<P><strong>当事人：</strong>'+da.appellors+'</P>'
                        }else{
                            appellors ="";
                        }
                          var html3 = court+caseType+trialRound+trialDate+appellors;
                          $(".base-info .case-title").after(html3);

                        }else{
                            
                        }      
                       
                }else{

                }
        
        }

}); 

   
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
    //         searchParam:params,
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
    
        
 
         $(window).on('scroll',function(){
            var $scroll=$(this).scrollTop();
            if($scroll>=800){
                $('#loutinav').show();
            }else{
                $('#loutinav').hide();
            }
        });
    
        });
        return {
                init: function () {
                    change_main_current_class(1); 
                    var $loutili=$('.item-list-left .item-p p');
                    $loutili.on('click',function(){
                        $(this).addClass('active').siblings('p').removeClass('active');
                        var $loutitop=$('.content-text a').eq($(this).index()).offset().top;
                     
                        $('html,body').animate({//$('html,body')
                            scrollTop:$loutitop
                        })
                    });
        }
    }
} ();
index.init();