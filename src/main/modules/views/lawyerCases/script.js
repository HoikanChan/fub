var userCenter = (function() {
  var page = 1
  var inquery_validate
  var start = {
    isinitVal: true,
    initDate:[{DD:"-7"},true],
    format: "YYYY-MM-DD",
    maxDate: $.nowDate({DD:0}), //最大日期
    zIndex: 99999,
    isClear:false,
    isok:false,
    okfun: function (elem, date) {
            end.minDate = elem.val.replace(/\//g,"-"); //开始日选好后，重置结束日的最小日期
         //   endDates();
    },
};
var end = {
    isinitVal: true,
    isok: false,
    isClear:false,
    zIndex: 99999,
    maxDate: $.nowDate({DD:0}), //最大日期
    format: "YYYY-MM-DD",
    okfun: function (elem, date) {
            start.maxDate = elem.val.replace(/\//g,"-"); //将结束日的初始值设定为开始日的最大日期
    }
};
  function getMycase(){ 
    var params = {
      lawyerId:lawyerId,
      sidx : "createTime",
      order : "desc"
    }

  $('#my-cases .pager').tablePager({
    
      url: "order/queryOrderList",
      searchParam:params,
      success: function (result) {
              if (result.code==0) {
             
                      if (result) {
                       
                          var html = template("case-result-templete",result.data)
                 
                         $(".my-case-box").html(html); 
                         if(result.data.totalCount<10){
                          $(".page-row").hide()
                          }else{
                              $(".page-row").show()
                          }
                          if(result.data.totalCount==0){
                              $(".my-cases-box").html("<P class='noresult'>抱歉，没有相关案件</P>")
                          }
                          }else{
                              toastr.warning(result.msg);
                          }
                        $(".my-cases-content .totalNum").text(result.data.totalCount);
                      }
      }
 })
  }
  function searchMycase(){ 

    var params = {
      clientId:clientId,
      sidx : "createTime",
      order : "desc",
      beginDate:$("#start-date").val(),
      endDate:$("#end-date").val()
    }

  $('#my-cases .pager').tablePager({
    
      url: "order/queryOrderList",
      searchParam:params,
      success: function (result) {
              if (result.code==0) {
             
                      if (result) {
                       
                          var html = template("case-result-templete",result.data)
                 
                         $(".my-case-box").html(html); 
                         if(result.data.totalCount<10){
                          $(".page-row").hide()
                          }else{
                              $(".page-row").show()
                          }
                          if(result.data.totalCount==0){
                              $(".my-cases-box").html("<P class='noresult'>抱歉，没有相关案件</P>")
                          }
                          }else{
                              toastr.warning(result.msg);
                          }
                        $(".my-cases-content .totalNum").text(result.data.totalCount);
                      }
      }
 })

  } 
  $(function() {
   $("#my-cases").addClass("active");
    $('aside .right-icon').click(function(e) {
      e.stopPropagation()
      if (e.target.classList.contains('fa-chevron-down')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .show()
        $(e.target)
          .addClass('fa-chevron-up')
          .removeClass('fa-chevron-down')
      } else if (e.target.classList.contains('fa-chevron-up')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .hide()
        $(e.target)
          .removeClass('fa-chevron-up')
          .addClass('fa-chevron-down')
      }
    })
     //时间选择 
     $("#start-date").jeDate(start);
     $("#end-date").jeDate(end);
    $(".all-status").on("change",function(){
      var select = $("select[name='status']").find("option:selected").val();
    })
  })
  return {
    init: function() {
      getMycase()
      $(document).on("click",".primary-btn",function(){
        searchMycase();
      })
      $(document).on("click",".showmore",function(){
          var caseid = $(this).attr("data-id");
          $({caseId:caseid,caseDesc:"time"})._Ajax({
            url: "casetrial/queryCaseTrial",
            success: function (result) {
              var html=[],html2=[],html3=[],html4=[];
                    if (result.code==0) {
                    var data = result.trialList;
                      html  = "<div class='process-img'>"
                                    + "<div class='grap-bg'>"
                                        +"<div class='org-bg-one'>"
                                        +"</div>"
                                        +"<div class='org-bg-two'>"
                                        +"</div>"
                                        +"<div class='org-bg-three'>"
                                        +"</div>"
                                        +"<div class='org-bg-four'>"
                                        +"</div>"
                                        +"<div class='org-bg-five'>"
                                        +"</div>"
                                      +"</div>"
                                      +"<div>"
                        for(var i=0;i<data.length;i++){
                          if(data[i].caseDesc){
                            html2 += "<div class='pro-tex'>"+ data[i].trialRound  +"（"+data[i].caseDesc +"）<span>"+data[i].time+"</span></div>"
                          }else{
                            html2 += "<div class='pro-tex'>"+ data[i].trialRound  +"<span>"+data[i].time+"</span></div>"
                          }
                         
                        }
                      
                         
                        $("#tr"+caseid+" .process-text").html(html2);
                        $("#tr"+caseid).toggle();
                    }
                 }
                });
      })
      $(document).on("click",".updatebtn",function(){
                
        _updateCase.updateCaseDialog($(this).attr("data-name"),$(this).attr("data-id"));
       
   
})
    }
  }
})()
userCenter.init()
